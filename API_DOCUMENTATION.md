# Mogster Serverless API Documentation

## `/api/rate.js` - Image Analysis Endpoint

This serverless function analyzes an image using the Google Gemini API and returns a structured "Mog" rating with clinical findings and verdict.

### Endpoint Details

- **Method:** POST
- **URL:** `https://your-vercel-deployment.vercel.app/api/rate.js`
- **Local Testing:** `http://localhost:3000/api/rate.js`

### Request Format

**Content-Type:** `application/json`

**Body:**
```json
{
  "image": "base64_encoded_image_string"
}
```

The `image` field should contain a base64-encoded image (JPEG, PNG, WebP, etc.). If sending from the browser, you can convert a File object using:
```javascript
const file = /* your File object */;
const reader = new FileReader();
reader.onload = (event) => {
  const base64Image = event.target.result.split(',')[1]; // Remove data:image/...; prefix
  const base64String = base64Image; // Use this in the API request
};
reader.readAsDataURL(file);
```

### Response Format

**Status:** 200 (success) or error status

**Body:**
```json
{
  "score": 7,
  "clinicalFindings": [
    {
      "indicator": "Cheekbone Prominence",
      "value": "0.85cm",
      "note": "Carved out and memorable with marked definition."
    },
    {
      "indicator": "Jawline Definition",
      "value": "78%",
      "note": "Crisp and severe lower border articulation."
    }
  ],
  "verdict": "The specimen is mogging hard, and it knows it. Simply put, the competition doesn't stand a chance..."
}
```

### Error Response Format

**Status:** 400, 500, etc.

**Body:**
```json
{
  "error": "Description of what went wrong",
  "details": "Optional additional information"
}
```

### Setup Instructions

1. **Get a Gemini API Key:**
   - Visit https://ai.google.dev/
   - Sign up or log in with your Google account
   - Create a new API key
   - Copy the key

2. **Set Environment Variables:**
   - Create a `.env.local` file (copy from `.env.example`)
   - Add: `GEMINI_API_KEY=your_actual_api_key`
   - **Never commit `.env.local` to version control**

3. **Deploy to Vercel:**
   ```bash
   npm i -g vercel
   vercel
   # Follow prompts to link project
   vercel env add GEMINI_API_KEY
   # Enter your API key when prompted
   vercel deploy --prod
   ```

### Frontend Integration Example

```javascript
async function analyzeImageWithGemini(file) {
  const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onload = async (event) => {
      try {
        const base64 = event.target.result.split(',')[1];
        
        const response = await fetch('/api/rate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'API request failed');
        }

        const result = await response.json();
        resolve(result); // { score, clinicalFindings, verdict }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.readAsDataURL(file);
  });
}
```

### Notes

- The function uses Gemini 2.0 Flash for fast processing
- Images are analyzed in real-time based on actual visual content
- The verdict tone automatically scales based on the score (roast for low, hype for high, balanced for mid)
- API responses are cached intelligently; repeated calls with similar images may be faster
- Rate limiting: Standard Gemini API free tier applies (~60 requests/minute)

### Troubleshooting

| Issue | Solution |
|-------|----------|
| `GEMINI_API_KEY not set` | Ensure environment variable is configured in Vercel dashboard or `.env.local` locally |
| `Invalid response structure` | Check that Gemini API key is valid and has vision access enabled |
| `Method not allowed` | Ensure you're sending a POST request, not GET |
| `Missing required field: image` | Verify the request body includes the base64-encoded `image` field |
