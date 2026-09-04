/**
 * Vercel Serverless Function: Mogster Image Analysis
 * Accepts a POST request with a base64-encoded image and returns a structured
 * analysis using the Google Gemini API.
 */

export default async function handler(req, res) {
    // Only accept POST requests
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

        // Validate API key
        const apiKey = (process.env.GEMINI_API_KEY || '').trim();
        if (!apiKey) {
            console.error('GEMINI_API_KEY environment variable not set');
            return res.status(500).json({ 
                error: 'Server configuration error: GEMINI_API_KEY is not set in Vercel',
                details: 'Please add GEMINI_API_KEY in Vercel Project Settings > Environment Variables, then redeploy.'
            });
        }

        // Call Gemini API with vision capabilities
        const geminiResponse = await callGeminiAPI(image, apiKey, mimeType);

        // Clean any markdown code blocks if present
        let cleanedJson = geminiResponse.trim();
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

/**
 * Calls the Google Gemini API with vision capabilities, trying candidate models
 * @param {string} base64Image - The base64-encoded image
 * @param {string} apiKey - The Gemini API key
 * @param {string} mimeType - Image MIME type
 * @returns {Promise<string>} - The JSON response from Gemini
 */
async function callGeminiAPI(base64Image, apiKey, mimeType = 'image/jpeg') {
    const candidateModels = [
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash'
    ];

    if (process.env.GEMINI_MODEL && !candidateModels.includes(process.env.GEMINI_MODEL)) {
        candidateModels.unshift(process.env.GEMINI_MODEL);
    }

    let lastError = null;

    for (const model of candidateModels) {
        try {
            return await requestGemini(model, base64Image, apiKey, mimeType);
        } catch (err) {
            lastError = err;
            console.warn(`Model ${model} failed: ${err.message}`);

            // Stop trying other models if it's an authentication or quota error
            const isAuthOrQuota = err.message.includes('403') || 
                                  err.message.includes('400') ||
                                  err.message.includes('429') ||
                                  err.message.includes('API key') ||
                                  err.message.includes('quota');
            if (isAuthOrQuota) {
                throw err;
            }
            // For 404 (model not found) or 503, try next candidate
        }
    }

    throw lastError || new Error('All candidate Gemini models failed to process the request');
}

async function requestGemini(model, base64Image, apiKey, mimeType) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

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

    const requestBody = {
        contents: [
            {
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            mimeType: mimeType || 'image/jpeg',
                            data: base64Image
                        }
                    }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 1024,
            responseMimeType: 'application/json'
        },
        safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
        ]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData.error?.message || `HTTP ${response.status}`;
        throw new Error(`Gemini API error (${model}): ${response.status} - ${errMsg}`);
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
        const blockReason = data.promptFeedback?.blockReason;
        if (blockReason) {
            throw new Error(`Gemini blocked this request (reason: ${blockReason}). Please try another image.`);
        }
        throw new Error('No response candidates returned from Gemini API');
    }

    const candidate = data.candidates[0];
    if (candidate.finishReason === 'SAFETY') {
        throw new Error('Image flagged by Gemini safety filters. Please try another object or angle.');
    }

    const part = candidate.content?.parts?.[0];
    if (!part || typeof part.text !== 'string') {
        throw new Error(`Unexpected Gemini response format: finishReason=${candidate.finishReason || 'unknown'}`);
    }

    return part.text.trim();
}
