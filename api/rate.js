/**
 * Vercel Serverless Function: Mogster Image Analysis
 * Accepts a POST request with a base64-encoded image and returns a structured
 * analysis using the Google Gemini API.
 */

import { GoogleGenAI } from "@google/genai";

/**
 * Vercel Serverless Function: Mogster Image Analysis
 * Uses official @google/genai SDK with gemini-3.8-flash interactions API
 */
export default async function handler(req, res) {
    // Health check and API diagnostic endpoint
    if (req.method === 'GET') {
        const rawKey = process.env.GEMINI_API_KEY || '';
        const apiKey = rawKey.replace(/^["']|["']$/g, '').trim();

        if (!apiKey) {
            return res.status(200).json({
                status: 'error',
                message: 'GEMINI_API_KEY is not set in Vercel. Please add GEMINI_API_KEY in Vercel Project Settings > Environment Variables, and click Redeploy.',
                hasKey: false
            });
        }

        try {
            const ai = new GoogleGenAI({ apiKey });
            return res.status(200).json({
                status: 'ok',
                message: 'Gemini API key is configured with @google/genai SDK and ready for gemini-3.8-flash!',
                hasKey: true,
                keyPrefix: apiKey.slice(0, 6) + '...'
            });
        } catch (err) {
            return res.status(200).json({
                status: 'error',
                message: `SDK Initialization error: ${err.message}`,
                hasKey: true
            });
        }
    }

    // Only accept POST requests for analysis
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
        const { image, mimeType = 'image/jpeg' } = body;

        // Validate input
        if (!image) {
            return res.status(400).json({ error: 'Missing required field: image (base64-encoded)' });
        }

        // Validate API key and strip accidental quotes
        const rawKey = process.env.GEMINI_API_KEY || '';
        const apiKey = rawKey.replace(/^["']|["']$/g, '').trim();

        if (!apiKey) {
            console.error('GEMINI_API_KEY environment variable not set');
            return res.status(500).json({ 
                error: 'GEMINI_API_KEY is not set in Vercel',
                details: 'Please add GEMINI_API_KEY in Vercel Project Settings > Environment Variables, then redeploy.'
            });
        }

        // Initialize GoogleGenAI SDK
        const ai = new GoogleGenAI({ apiKey });

        // Clean base64 string
        const cleanBase64 = image.includes(',') ? image.split(',')[1].trim() : image.trim();

        const prompt = `You are "The Mog Judge" - a brutally honest facial analyst who applies beauty standards absurdly but with genuine visual grounding. Analyze ONLY what you see in this image.

Analyze the object in the image using 5-6 of these facial analysis categories:
- Canthal tilt (eye angle)
- Upper lid exposure (eyelid visibility)
- Eyebrow position (ridge height)
- Cheekbone prominence (projection and definition)
- Hollow cheeks (cheek depth and sculpting)
- Midface ratio (proportions of center face)
- Jawline definition (edge sharpness and articulation)
- Gonial angle (jaw corner geometry)
- Chin projection (forward protrusion)
- Mandible-to-maxilla ratio (jaw-to-face proportions)
- Facial symmetry (bilateral mirror quality)
- Facial thirds/fifths (classical proportions)
- Nose shape/projection (bridge and tip prominence)
- Skin quality/texture (surface condition)

For each indicator, provide:
1. A measured/visual value (e.g., "8mm", "45°", "0.92cm")
2. A clinical-sounding but absurd assessment grounded in what you actually see

Determine an overall score (1-10) based on how well the object conforms to facial beauty standards when treated as a face.

Your tone MUST scale with the score:
- Score 1-3: Full roast with escalating insults, but grounded in real visual observations
- Score 4-7: Dry wit, clever observations that actually land, balanced humor
- Score 8-10: Escalating hype, reframing features as compliments

Return your response as VALID JSON ONLY (no markdown, no explanations) with this exact structure:
{
  "score": <number 1-10>,
  "clinicalFindings": [
    { "indicator": "Indicator Name", "value": "measurement", "note": "observation based on what you see" }
  ],
  "verdict": "<full paragraph using the tone appropriate for the score, with genuine visual references>"
}

Do not include any text outside the JSON. Respond with only valid JSON.`;

        // Call Gemini using Interactions API with gemini-3.8-flash (with fallbacks)
        const modelsToTry = [
            process.env.GEMINI_MODEL,
            'gemini-3.8-flash',
            // 'gemini-2.5-flash',
            // 'gemini-2.0-flash',
            // 'gemini-1.5-flash'
        ].filter(Boolean);

        let responseText = '';
        let lastError = null;

        for (const model of modelsToTry) {
            try {
                const interaction = await ai.interactions.create({
                    model: model,
                    input: [
                        { type: 'text', text: prompt },
                        {
                            type: 'image',
                            data: cleanBase64,
                            mime_type: mimeType || 'image/jpeg'
                        }
                    ]
                });

                responseText = interaction.output_text || '';
                if (responseText) break;
            } catch (err) {
                lastError = err;
                console.warn(`Model ${model} via interactions failed: ${err.message}`);

                // Abort early if the API key is unauthorized/invalid
                if (err.message.includes('API_KEY_INVALID') || err.message.includes('API key not valid') || err.message.includes('403')) {
                    throw err;
                }
            }
        }

        if (!responseText && lastError) {
            throw lastError;
        }

        // Clean any markdown code blocks if present
        let cleanedJson = responseText.trim();
        if (cleanedJson.startsWith('```json')) {
            cleanedJson = cleanedJson.slice(7);
        } else if (cleanedJson.startsWith('```')) {
            cleanedJson = cleanedJson.slice(3);
        }
        if (cleanedJson.endsWith('```')) {
            cleanedJson = cleanedJson.slice(0, -3);
        }
        cleanedJson = cleanedJson.trim();

        // Parse and validate the response
        let analysisResult;
        try {
            analysisResult = JSON.parse(cleanedJson);
        } catch (jsonErr) {
            console.error('JSON parse error on response:', cleanedJson);
            throw new Error(`Failed to parse Gemini output as JSON: ${jsonErr.message}`);
        }

        // Validate response structure
        if (typeof analysisResult.score !== 'number' || !Array.isArray(analysisResult.clinicalFindings) || !analysisResult.verdict) {
            console.error('Unexpected analysis structure:', analysisResult);
            throw new Error('Gemini returned an invalid response structure (missing score, clinicalFindings, or verdict)');
        }

        // Return the structured analysis
        return res.status(200).json(analysisResult);
    } catch (error) {
        console.error('Error in rate.js:', error);

        return res.status(500).json({
            error: error.message || 'Failed to analyze image',
            details: error.message || 'Unknown server error'
        });
    }
}
