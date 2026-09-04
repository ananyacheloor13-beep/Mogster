# Frontend API Integration Summary

## Changes Made to script.js

### 1. **New Variable for API Response Storage**
```javascript
let currentApiResponse = null; // Store real API response
```
This stores the actual response from the Gemini API so we can use real data throughout the display flow.

### 2. **Updated File Upload Handler** (lines ~354-368)
- Now passes `imageData` to `startAnalysis()` 
- Converts the uploaded file to base64 DataURL immediately

### 3. **New Async `startAnalysis()` Function** (lines ~399-448)
- Takes `imageDataUrl` as parameter
- Extracts pure base64 from DataURL (`imageDataUrl.split(',')[1]`)
- Calls `fetchAnalysisWithTimeout()` to get real analysis from `/api/rate`
- **Success path:**
  - Stores API response in `currentApiResponse`
  - Sets `currentRating` from API score
  - Displays clinical findings in loading screen (one per 500ms)
  - Shows name input after all findings displayed
- **Error path:**
  - Shows error message in red
  - Displays "Try Again" button to reset
  - User can retry upload

### 4. **New `fetchAnalysisWithTimeout()` Function** (lines ~475-527)
Handles the actual API call with these features:
- Sends POST to `/api/rate` with base64 image
- **30-second timeout** - prevents stuck loading screen
- **Proper error handling:**
  - If timeout → "Request timed out. Please check your connection..."
  - If API error → Shows API error message
  - If response invalid → "Invalid response format from server"
- Returns parsed JSON response with score, clinicalFindings, verdict

### 5. **Updated `showNameInput()` Function** (lines ~553-556)
- Removed the `getRandomRating()` call that was overwriting the real score
- Now simply transitions from loading → name input screen
- Uses the real score already set from API response

### 6. **Updated `saveAndShowResults()` Function** (lines ~755-825)
- **If API response exists** (real data):
  - Displays Section 1 from `currentApiResponse.clinicalFindings` array
  - Displays Section 2 verdict from `currentApiResponse.verdict` field
  - Highlights the punchline as before
- **Fallback** (if API fails):
  - Uses fake data generation (backward compatibility)
  - Maintains existing tone/personality rules

## Display Flow (with API)

```
1. User uploads image
   ↓
2. Convert to base64 DataURL
   ↓
3. Show loading screen (spinner already visible)
   ↓
4. Call /api/rate with base64 image
   ↓
5a. [Success] Display clinical findings one by one
   ↓
   Show name input
   ↓
   User enters name, clicks "Save & View Rating"
   ↓
   Display real clinical findings + verdict using API response
   ↓
   Save to leaderboard

5b. [Error] Display error message + retry button
   ↓
   User clicks "Try Again"
   ↓
   Back to upload screen
```

## Error Handling

| Scenario | User Sees |
|----------|-----------|
| Network timeout (>30s) | "Request timed out. Please check your connection and try again." |
| Invalid API key | "Gemini API error: 403 - ..." |
| Malformed image | "Invalid response format from server" |
| API down | "Failed to analyze image. Please try again." |

## Backward Compatibility

If the API endpoint is not available or fails:
- Code falls back to fake analysis generation
- User experience remains unchanged (same UI, tone, personality)
- Leaderboard still works with fallback data

## Configuration Required

For this to work on deployment:

1. **Environment variable set in Vercel:**
   ```
   GEMINI_API_KEY=your_actual_api_key
   ```

2. **API endpoint running at:** `/api/rate`

3. **Expected response format:**
   ```json
   {
     "score": <1-10>,
     "clinicalFindings": [
       { "indicator": "...", "value": "...", "note": "..." },
       ...
     ],
     "verdict": "<full paragraph>"
   }
   ```

## No Changes to:
- ✅ Styling/CSS
- ✅ Layout
- ✅ Loading animation
- ✅ Leaderboard functionality
- ✅ Tone/personality rules (scale with score automatically)
- ✅ Section 1 / Section 2 display structure
