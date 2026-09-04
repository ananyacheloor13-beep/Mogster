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
        const { image } = req.body;

        // Validate input
        if (!image) {
            return res.status(400).json({ error: 'Missing required field: image (base64-encoded)' });
        }

        // Validate API key
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('GEMINI_API_KEY environment variable not set');
            return res.status(500).json({ error: 'Server configuration error: API key not found' });
        }

        // Call Gemini API with vision capabilities
        const geminiResponse = await callGeminiAPI(image, apiKey);

        // Parse and validate the response
        const analysisResult = JSON.parse(geminiResponse);

        // Validate response structure
        if (!analysisResult.score || !analysisResult.clinicalFindings || !analysisResult.verdict) {
            return res.status(500).json({ error: 'Invalid response structure from Gemini API' });
        }

        // Return the structured analysis
        return res.status(200).json(analysisResult);
    } catch (error) {
        console.error('Error in rate.js:', error.message);

        // Handle JSON parsing errors
        if (error instanceof SyntaxError) {
            return res.status(500).json({
                error: 'Failed to parse Gemini response as JSON',
                details: error.message
            });
        }

        // Handle other errors
        return res.status(500).json({
            error: 'Failed to analyze image',
            details: error.message
        });
    }
}

/**
 * Calls the Google Gemini API with vision capabilities
 * @param {string} base64Image - The base64-encoded image
 * @param {string} apiKey - The Gemini API key
 * @returns {Promise<string>} - The JSON response from Gemini
 */
async function callGeminiAPI(base64Image, apiKey) {
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

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
    { "indicator": "Indicator Name", "value": "measurement", "note": "observation based on what you see" },
    ...
  ],
  "verdict": "<full paragraph using the tone appropriate for the score, with genuine visual references>"
}

Do not include any text outside the JSON. Respond with only valid JSON.`;

    const requestBody = {
        contents: [
            {
                parts: [
                    {
                        text: prompt
                    },
                    {
                        inlineData: {
                            mimeType: 'image/jpeg',
                            data: base64Image
                        }
                    }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 1024
        }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API Error:', errorData);
        throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    // Extract text content from Gemini response
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Unexpected response structure from Gemini API');
    }

    const responseText = data.candidates[0].content.parts[0].text;

    // Validate that the response is JSON
    return responseText.trim();
}
