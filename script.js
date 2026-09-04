// Storage key for leaderboard
const LEADERBOARD_KEY = 'mogsterLeaderboard';

// Mog Indicators - Technical facial analysis applied to objects
// Each indicator has both generateStructured (for detailed report) and generate (for loading screen)
const mogIndicators = [
    // Eye region
    {
        name: "Canthal Tilt",
        category: "Eye Region",
        generate: () => "Analyzing canthal tilt...",
        generateStructured: (score) => {
            const angle = Math.floor(Math.random() * 20) - 10;
            let verdict = "";
            if (score >= 8) {
                verdict = angle >= 5 ? "Textbook hunter geometry with upward orientation." : "Close enough to acceptable positioning.";
            } else if (score >= 5) {
                verdict = angle >= 0 ? "Splits the difference between desirable and neutral." : "Muted downward lean affects overall expression.";
            } else {
                verdict = angle < -5 ? "Pure downward orientation, unfavorable geometry." : "Forgettable trajectory either direction.";
            }
            return {
                name: "Canthal Tilt",
                value: `${angle}°`,
                description: verdict
            };
        }
    },
    {
        name: "Upper Lid Exposure",
        category: "Eye Region",
        generate: () => "Measuring upper lid exposure...",
        generateStructured: (score) => {
            const exposure = Math.floor(Math.random() * 60) + 20;
            let verdict = "";
            if (score >= 8) {
                verdict = exposure > 50 ? "Optimal aperture quality with excellent visibility." : "Tastefully hooded with balanced coverage.";
            } else if (score >= 5) {
                verdict = exposure > 50 ? "Adequate lid exposure for readable expression." : "Good amount of natural droop contributes charm.";
            } else {
                verdict = exposure > 50 ? "Upper exposure present but unremarkable." : "Excessive hood coverage diminishes appeal.";
            }
            return {
                name: "Upper Lid Exposure",
                value: `${exposure}%`,
                description: verdict
            };
        }
    },
    {
        name: "Eyebrow Position",
        category: "Eye Region",
        generate: () => "Evaluating eyebrow position...",
        generateStructured: (score) => {
            const height = Math.floor(Math.random() * 8) + 2;
            let verdict = "";
            if (score >= 8) {
                verdict = height > 5 ? "Aggressively set high with commanding presence." : "Solid placement contributes to overall strength.";
            } else if (score >= 5) {
                verdict = height > 5 ? "Decent ridge height with noticeable definition." : "Adequately positioned upper contours.";
            } else {
                verdict = height > 5 ? "Overcompensating attempts at definition." : "Forgettable outline barely registers.";
            }
            return {
                name: "Eyebrow Position",
                value: `${height}mm`,
                description: verdict
            };
        }
    },
    // Cheeks & midface
    {
        name: "Cheekbone Prominence",
        category: "Cheeks & Midface",
        generate: () => "Scanning cheekbone prominence...",
        generateStructured: (score) => {
            const prominence = (Math.random() * 0.4 + 0.6).toFixed(2);
            let verdict = "";
            if (score >= 8) {
                verdict = prominence > 0.8 ? "Carved out and memorable with marked definition." : "Respectable projection earning visual attention.";
            } else if (score >= 5) {
                verdict = prominence > 0.8 ? "Decent projection provides facial structure." : "Subtle highlight contributes modest dimension.";
            } else {
                verdict = prominence > 0.8 ? "Attempts prominence but falls short." : "Barely registers as a facial feature.";
            }
            return {
                name: "Cheekbone Prominence",
                value: `${prominence}cm`,
                description: verdict
            };
        }
    },
    {
        name: "Hollow Cheeks",
        category: "Cheeks & Midface",
        generate: () => "Assessing hollow cheeks...",
        generateStructured: (score) => {
            const hollow = (Math.random() * 0.5).toFixed(2);
            let verdict = "";
            if (score >= 8) {
                verdict = hollow > 0.3 ? "Sculpted inset contributes to refined aesthetics." : "Tasteful hollowing adds sophisticated dimension.";
            } else if (score >= 5) {
                verdict = hollow > 0.3 ? "Decent pocket provides acceptable definition." : "Minimal definition indicates flatter cheek composition.";
            } else {
                verdict = hollow > 0.3 ? "Hollow claim is generous for this structure." : "Essentially flat across the lateral face.";
            }
            return {
                name: "Hollow Cheeks",
                value: `${hollow}cm`,
                description: verdict
            };
        }
    },
    {
        name: "Midface Ratio",
        category: "Cheeks & Midface",
        generate: () => "Computing midface ratio...",
        generateStructured: (score) => {
            const ratio = (Math.random() * 0.3 + 0.85).toFixed(2);
            let verdict = "";
            if (score >= 8) {
                verdict = ratio > 1.0 ? "Exceeds ideal proportions yet maintains cohesion." : "Textbook harmonious center division.";
            } else if (score >= 5) {
                verdict = ratio > 1.0 ? "Slightly disproportionate but not disqualifying." : "Acceptably proportioned facial zones.";
            } else {
                verdict = ratio > 1.0 ? "Center zone exhibits bloating imbalance." : "Awkward segmentation across thirds.";
            }
            return {
                name: "Midface Ratio",
                value: `${ratio}`,
                description: verdict
            };
        }
    },
    // Jaw & lower face
    {
        name: "Jawline Definition",
        category: "Jaw & Lower Face",
        generate: () => "Measuring jawline definition...",
        generateStructured: (score) => {
            const sharpness = Math.floor(Math.random() * 40) + 40;
            let verdict = "";
            if (score >= 8) {
                verdict = sharpness > 70 ? "Crisp and severe lower border articulation." : "Well-articulated jaw boundary.";
            } else if (score >= 5) {
                verdict = sharpness > 70 ? "Decent edge provides readable facial geometry." : "Readable outline distinguishes chin from neck.";
            } else {
                verdict = sharpness > 70 ? "Attempts definition but lacks conviction." : "Muddy transition between facial zones.";
            }
            return {
                name: "Jawline Definition",
                value: `${sharpness}%`,
                description: verdict
            };
        }
    },
    {
        name: "Gonial Angle",
        category: "Jaw & Lower Face",
        generate: () => "Calculating gonial angle...",
        generateStructured: (score) => {
            const angle = Math.floor(Math.random() * 30) + 110;
            let verdict = "";
            if (score >= 8) {
                verdict = angle < 125 ? "Acute and commanding posterior angle." : "Refined obtuse back corner geometry.";
            } else if (score >= 5) {
                verdict = angle < 125 ? "Reasonable posterior angle contributes balance." : "Softer back edge indicates obtuse angulation.";
            } else {
                verdict = angle < 125 ? "Attempts to look sharp but misses mark." : "Rounded-off corners diminish definition.";
            }
            return {
                name: "Gonial Angle",
                value: `${angle}°`,
                description: verdict
            };
        }
    },
    {
        name: "Chin Projection",
        category: "Jaw & Lower Face",
        generate: () => "Analyzing chin projection...",
        generateStructured: (score) => {
            const projection = (Math.random() * 0.8 + 0.4).toFixed(2);
            let verdict = "";
            if (score >= 8) {
                verdict = projection > 0.9 ? "Pronounced and forward anterior point." : "Solid jutting profile contribution.";
            } else if (score >= 5) {
                verdict = projection > 0.9 ? "Decent protrusion adds lower facial dimension." : "Mild extension provides subtle structure.";
            } else {
                verdict = projection > 0.9 ? "Overshooting projection fails to enhance." : "Essentially tucked against neck plane.";
            }
            return {
                name: "Chin Projection",
                value: `${projection}cm`,
                description: verdict
            };
        }
    },
    {
        name: "Mandible-to-Maxilla Ratio",
        category: "Jaw & Lower Face",
        generate: () => "Computing mandible-maxilla ratio...",
        generateStructured: (score) => {
            const ratio = (Math.random() * 0.2 + 0.85).toFixed(2);
            let verdict = "";
            if (score >= 8) {
                verdict = ratio > 0.95 ? "Perfectly balanced halves create harmony." : "Harmonious vertical division across structure.";
            } else if (score >= 5) {
                verdict = ratio > 0.95 ? "Solid bottom-to-top split maintains proportion." : "Top-heavy imbalance yet remains workable.";
            } else {
                verdict = ratio > 0.95 ? "Lower half tries but upper dominates." : "Overall proportions exhibit fundamental misalignment.";
            }
            return {
                name: "Mandible-to-Maxilla Ratio",
                value: `${ratio}`,
                description: verdict
            };
        }
    },
    // Other
    {
        name: "Facial Symmetry",
        category: "Proportions",
        generate: () => "Scanning facial symmetry...",
        generateStructured: (score) => {
            const symmetry = Math.floor(Math.random() * 20) + 75;
            let verdict = "";
            if (score >= 8) {
                verdict = symmetry > 90 ? "Almost perfectly mirrored bilateral structure." : "Bilateral balance establishes proportion confidence.";
            } else if (score >= 5) {
                verdict = symmetry > 90 ? "Decent left-right match contributes coherence." : "Acceptable irregularity remains within tolerance.";
            } else {
                verdict = symmetry > 90 ? "One side passable, other side questionable." : "Lopsided structure exhibits multiple asymmetries.";
            }
            return {
                name: "Facial Symmetry",
                value: `${symmetry}%`,
                description: verdict
            };
        }
    },
    {
        name: "Facial Thirds Proportion",
        category: "Proportions",
        generate: () => "Evaluating facial thirds...",
        generateStructured: (score) => {
            const compliance = Math.floor(Math.random() * 30) + 65;
            let verdict = "";
            if (score >= 8) {
                verdict = compliance > 85 ? "Adheres to classical proportional ratios." : "Respectably proportioned across facial zones.";
            } else if (score >= 5) {
                verdict = compliance > 85 ? "Roughly divides well despite minor deviations." : "Unevenly segmented yet remains acceptable.";
            } else {
                verdict = compliance > 85 ? "Classical zones diverge from ideal." : "Proportional segmentation deviates across board.";
            }
            return {
                name: "Facial Thirds Proportion",
                value: `${compliance}%`,
                description: verdict
            };
        }
    },
    {
        name: "Nose Projection",
        category: "Nasal",
        generate: () => "Measuring nose projection...",
        generateStructured: (score) => {
            const projection = (Math.random() * 0.6 + 0.3).toFixed(2);
            let verdict = "";
            if (score >= 8) {
                verdict = projection > 0.7 ? "Commanding bridge establishes nasal presence." : "Subtle elevation contributes understated strength.";
            } else if (score >= 5) {
                verdict = projection > 0.7 ? "Noticeable rise provides facial articulation." : "Modest height registers without demanding attention.";
            } else {
                verdict = projection > 0.7 ? "Sticks out awkwardly without complementing face." : "Barely registers in overall facial composition.";
            }
            return {
                name: "Nose Projection",
                value: `${projection}cm`,
                description: verdict
            };
        }
    },
    {
        name: "Surface Texture Quality",
        category: "Surface",
        generate: () => "Analyzing surface texture...",
        generateStructured: (score) => {
            const quality = Math.floor(Math.random() * 35) + 60;
            let verdict = "";
            if (score >= 8) {
                verdict = quality > 85 ? "Pristine finish achieves zero discernible blemish." : "Smooth material composition enhances presentation.";
            } else if (score >= 5) {
                verdict = quality > 85 ? "Decent patina contributes authentic character." : "Weathered appearance remains honest and acceptable.";
            } else {
                verdict = quality > 85 ? "Surface scuffed extensively throughout." : "Texture quality ranks among least concerning flaws.";
            }
            return {
                name: "Surface Texture Quality",
                value: `${quality}%`,
                description: verdict
            };
        }
    }
];

// Funny analysis statuses
const analysisStatuses = [
    "Initializing morphometric analysis",
    "Calibrating facial recognition parameters",
    "Scanning structural topology",
    "Computing bilateral symmetry index",
    "Analyzing surface topology",
    "Processing dimensional ratios"
];

// Professional closing statements for analysis reports
const closingStatements = [
    "Overall, specimen demonstrates commendable aesthetic coherence and structural integrity.",
    "In conclusion, the subject exhibits favorable compositional characteristics and dimensional harmony.",
    "Assessment indicates satisfactory alignment with established morphological parameters.",
    "Evaluation suggests competent proportional balance and structural organization.",
    "The specimen displays adequate confluence of analyzed indicators, warranting the assigned rating.",
    "Comprehensive analysis reveals consistent performance across evaluated metrics."
];

// Dom elements
const photoInput = document.getElementById('photoInput');
const uploadSection = document.getElementById('uploadSection');
const loadingSection = document.getElementById('loadingSection');
const nameInputSection = document.getElementById('nameInputSection');
const resultsSection = document.getElementById('resultsSection');
const leaderboardSection = document.getElementById('leaderboardSection');
const statusText = document.getElementById('statusText');
const ratingScore = document.getElementById('ratingScore');
const explanation = document.getElementById('explanation');
const resultImage = document.getElementById('resultImage');
const tryAgainBtn = document.getElementById('tryAgainBtn');
const mogName = document.getElementById('mogName');
const confirmNameBtn = document.getElementById('confirmNameBtn');
const leaderboardBtn = document.getElementById('leaderboardBtn');
const leaderboardList = document.getElementById('leaderboardList');
const backFromLeaderboardBtn = document.getElementById('backFromLeaderboardBtn');
const clearLeaderboardBtn = document.getElementById('clearLeaderboardBtn');
const indicatorsList = document.getElementById('indicatorsList');

let currentStatusIndex = 0;
let statusInterval = null;
let currentRating = 0;
let currentImageData = null;
let currentIndicators = [];
let currentApiResponse = null; // Store real API response

// Handle file upload
photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        // Show the image preview and start loading
        const reader = new FileReader();
        reader.onload = (event) => {
            const imageData = event.target.result;
            currentImageData = imageData;
            resultImage.src = imageData;
            startAnalysis(imageData, file.type);
        };
        reader.readAsDataURL(file);
    }
});

// Handle name confirmation
confirmNameBtn.addEventListener('click', saveAndShowResults);
mogName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveAndShowResults();
});

// Handle leaderboard view
leaderboardBtn.addEventListener('click', () => {
    uploadSection.classList.add('hidden');
    loadingSection.classList.add('hidden');
    nameInputSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    leaderboardSection.classList.remove('hidden');
    displayLeaderboard();
});

backFromLeaderboardBtn.addEventListener('click', () => {
    leaderboardSection.classList.add('hidden');
    uploadSection.classList.remove('hidden');
});

// Handle clear leaderboard
clearLeaderboardBtn.addEventListener('click', () => {
    if (confirm('Are you sure? This will delete all entries.')) {
        localStorage.removeItem(LEADERBOARD_KEY);
        alert('Leaderboard cleared!');
    }
});

async function startAnalysis(imageDataUrl, mimeType = 'image/jpeg') {
    // Hide upload, show loading
    uploadSection.classList.add('hidden');
    loadingSection.classList.remove('hidden');
    nameInputSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    leaderboardSection.classList.add('hidden');
    
    // Clear previous indicators
    indicatorsList.innerHTML = '';
    
    try {
        // Convert DataURL to base64 (remove 'data:image/...;base64,' prefix)
        const base64Image = imageDataUrl.split(',')[1];
        
        // Call the API with timeout
        const analysisData = await fetchAnalysisWithTimeout(base64Image, mimeType, 30000); // 30 second timeout
        
        // Store the API response
        currentApiResponse = analysisData;
        currentRating = analysisData.score;
        
        // Convert API clinical findings to a display format
        const findings = analysisData.clinicalFindings || [];
        
        // Display clinical findings one by one
        let displayIndex = 0;
        const displayInterval = setInterval(() => {
            if (displayIndex < findings.length) {
                const finding = findings[displayIndex];
                const fullLine = `${finding.indicator}: ${finding.note}`;
                
                const itemDiv = document.createElement('div');
                itemDiv.className = 'indicator-item';
                itemDiv.innerHTML = `<span class="indicator-verdict">${fullLine}</span>`;
                indicatorsList.appendChild(itemDiv);
                
                displayIndex++;
            } else {
                clearInterval(displayInterval);
                // After all findings displayed, wait a moment then show name input
                setTimeout(() => {
                    showNameInput();
                }, 800);
            }
        }, 500);
        
    } catch (error) {
        console.error('Analysis error:', error);
        
        // Show error message in loading section
        indicatorsList.innerHTML = '';
        const errorDiv = document.createElement('div');
        errorDiv.className = 'indicator-item';
        errorDiv.style.color = '#d32f2f';
        errorDiv.innerHTML = `<span class="indicator-verdict">${error.message}</span>`;
        indicatorsList.appendChild(errorDiv);
        
        // Show retry button
        setTimeout(() => {
            const retryBtn = document.createElement('button');
            retryBtn.textContent = 'Try Again';
            retryBtn.style.marginTop = '20px';
            retryBtn.style.padding = '10px 20px';
            retryBtn.style.cursor = 'pointer';
            retryBtn.style.backgroundColor = '#667eea';
            retryBtn.style.color = 'white';
            retryBtn.style.border = 'none';
            retryBtn.style.borderRadius = '8px';
            retryBtn.style.fontSize = '1em';
            retryBtn.addEventListener('click', () => {
                uploadSection.classList.remove('hidden');
                loadingSection.classList.add('hidden');
                photoInput.value = '';
            });
            indicatorsList.appendChild(retryBtn);
        }, 500);
    }
}

/**
 * Fetch analysis from /api/rate with timeout
 * @param {string} base64Image - Base64-encoded image without prefix
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise<Object>} - Analysis response with score, clinicalFindings, verdict
 */
async function fetchAnalysisWithTimeout(base64Image, mimeType, timeoutMs) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
        const response = await fetch('/api/rate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: base64Image, mimeType: mimeType || 'image/jpeg' }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || `API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate response structure
        if (!data.score || !data.clinicalFindings || !data.verdict) {
            throw new Error('Invalid response format from server');
        }
        
        return data;
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please check your connection and try again.');
        }
        
        throw new Error(error.message || 'Failed to analyze image. Please try again.');
    }
}

function getRandomRating() {
    return Math.floor(Math.random() * 10) + 1; // 1-10
}

function selectRandomIndicators() {
    // Select 5-6 random indicators
    const count = Math.floor(Math.random() * 2) + 5; // 5 or 6
    const shuffled = [...mogIndicators].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function generateAnalysisReport(rating, indicators) {
    // Create professional opening
    const opening = "MORPHOMETRIC ASSESSMENT REPORT";
    
    // Build indicator details with sentiment-matched copy (pass score)
    let report = "";
    indicators.forEach(ind => {
        report += `${ind.generate(rating)}\n`;
    });
    
    return {
        opening: opening,
        indicators: indicators,
        rating: rating
    };
}

function showNameInput() {
    loadingSection.classList.add('hidden');
    nameInputSection.classList.remove('hidden');
    mogName.focus();
}

function generateVerdictParagraph(name, score, indicators) {
    const sentences = [];
    
    if (score >= 7) {
        // HIGH SCORE: Build escalating hype by reframing each indicator as a compliment
        indicators.forEach((indicator, index) => {
            let comment = "";
            switch(indicator.name) {
                case "Canthal Tilt":
                    comment = "The upward eye geometry is *chef's kiss*.";
                    break;
                case "Upper Lid Exposure":
                    comment = "Upper lid presence is perfectly calibrated for maximum impact.";
                    break;
                case "Eyebrow Position":
                    comment = "The eyebrow ridge sits at that aggressive, commanding height.";
                    break;
                case "Cheekbone Prominence":
                    comment = "Cheekbones cut through like a freshly sharpened blade.";
                    break;
                case "Hollow Cheeks":
                    comment = "The cheek hollows are sculpted to absolute precision.";
                    break;
                case "Midface Ratio":
                    comment = "Midface proportions are harmoniously aligned.";
                    break;
                case "Jawline Definition":
                    comment = "That jawline is crisp, defined, and unforgettable.";
                    break;
                case "Gonial Angle":
                    comment = "The posterior angle geometry is textbook superior.";
                    break;
                case "Chin Projection":
                    comment = "Chin projection is assertive and commanding.";
                    break;
                case "Mandible-to-Maxilla Ratio":
                    comment = "Vertical proportions are perfectly balanced top to bottom.";
                    break;
                case "Facial Symmetry":
                    comment = "Bilateral symmetry is near-flawless.";
                    break;
                case "Facial Thirds Proportion":
                    comment = "Classical proportions hit harder than expected.";
                    break;
                case "Nose Projection":
                    comment = "Nasal projection bridges the gap between subtle and commanding.";
                    break;
                case "Surface Texture Quality":
                    comment = "Surface finish is immaculate across the board.";
                    break;
                default:
                    comment = `The ${indicator.name.toLowerCase()} is surprisingly impressive.`;
            }
            sentences.push(comment);
        });
        
        // Add escalating hype conclusion
        const conclusions = [
            "This specimen is mogging hard, and it knows it.",
            "Simply put, the competition doesn't stand a chance.",
            "Absolute main character energy on display here.",
            "This is the gold standard we'll be measuring everything else against.",
            "Nothing left to say except: it's all over the screen."
        ];
        sentences.push(conclusions[Math.floor(Math.random() * conclusions.length)]);
        
    } else if (score >= 4) {
        // MID SCORE: Dry wit with teeth—clever observations that actually land
        indicators.forEach((indicator, index) => {
            let comment = "";
            switch(indicator.name) {
                case "Canthal Tilt":
                    comment = "The eye angle pulls off that 'casually competent' vibe, which is honestly impressive for a geometry experiment.";
                    break;
                case "Upper Lid Exposure":
                    comment = "Upper lid exposure has learned the fine art of showing just enough to keep everyone guessing.";
                    break;
                case "Eyebrow Position":
                    comment = "Eyebrow positioning? It's playing the 'respectable middle ground' card, and somehow it works.";
                    break;
                case "Cheekbone Prominence":
                    comment = "Cheekbones are giving 'I didn't try too hard but still showed up'—peak midrange energy.";
                    break;
                case "Hollow Cheeks":
                    comment = "Cheek hollows are present in spirit, if not in actual definition.";
                    break;
                case "Midface Ratio":
                    comment = "Midface proportions have struck that delicate balance between 'fine' and 'forgettable.'";
                    break;
                case "Jawline Definition":
                    comment = "The jawline exists as promised, with enough edge to make a statement that nobody asked for.";
                    break;
                case "Gonial Angle":
                    comment = "Back corner angle: ambitious without being delusional.";
                    break;
                case "Chin Projection":
                    comment = "Chin projection is living its best understated life.";
                    break;
                case "Mandible-to-Maxilla Ratio":
                    comment = "Upper and lower halves have negotiated a surprisingly peaceful agreement.";
                    break;
                case "Facial Symmetry":
                    comment = "Bilateral symmetry is playing both sides, convincingly enough.";
                    break;
                case "Facial Thirds Proportion":
                    comment = "Classical thirds compliance levels are 'passing the vibe check' material.";
                    break;
                case "Nose Projection":
                    comment = "Nose bridge has mastered the art of being present without demanding applause.";
                    break;
                case "Surface Texture Quality":
                    comment = "Surface texture refuses to offend, which is a valid life strategy.";
                    break;
                default:
                    comment = `The ${indicator.name.toLowerCase()} is holding its own, admittedly.`;
            }
            sentences.push(comment);
        });
        
        // Add balanced conclusion with actual landing punchlines
        const conclusions = [
            "Verdict: this is peak 'coasting just above average'—not mogging, but not getting mogged either.",
            "This is the definition of 'it is what it is,' and surprisingly, that's enough.",
            "Perfectly competent, refreshingly forgettable, and weirdly honest about both.",
            "If mid-range had a poster child, this would politely decline to be on it.",
            "Bottom line: solid enough to survive, interesting enough to rate."
        ];
        sentences.push(conclusions[Math.floor(Math.random() * conclusions.length)]);
        
    } else {
        // LOW SCORE: Full comedic roast, escalating insults
        indicators.forEach((indicator, index) => {
            let comment = "";
            switch(indicator.name) {
                case "Canthal Tilt":
                    comment = "That eye angle is giving pure prey energy, straight down.";
                    break;
                case "Upper Lid Exposure":
                    comment = "Upper lids are so hooded they're practically closed.";
                    break;
                case "Eyebrow Position":
                    comment = "Eyebrows apparently gave up halfway through positioning.";
                    break;
                case "Cheekbone Prominence":
                    comment = "Cheekbones flatter than a pancake on a hot griddle.";
                    break;
                case "Hollow Cheeks":
                    comment = "Those cheeks have less depth than a paper cup.";
                    break;
                case "Midface Ratio":
                    comment = "Midface proportions are doing their own thing, and it's wrong.";
                    break;
                case "Jawline Definition":
                    comment = "Jawline? More like jaw-suggestion, barely perceptible.";
                    break;
                case "Gonial Angle":
                    comment = "Back corners are rounded off like a sad pebble.";
                    break;
                case "Chin Projection":
                    comment = "Chin recedes so far back it's filing taxes in a different time zone.";
                    break;
                case "Mandible-to-Maxilla Ratio":
                    comment = "Vertical proportions are completely borked top to bottom.";
                    break;
                case "Facial Symmetry":
                    comment = "Bilateral symmetry is a joke—and not a funny one.";
                    break;
                case "Facial Thirds Proportion":
                    comment = "Classical thirds? This thing doesn't follow any rules.";
                    break;
                case "Nose Projection":
                    comment = "Nose bridge is basically sleepy, barely making a cameo.";
                    break;
                case "Surface Texture Quality":
                    comment = "Surface texture looks like it's been through a blender.";
                    break;
                default:
                    comment = `The ${indicator.name.toLowerCase()} is catastrophically bad.`;
            }
            sentences.push(comment);
        });
        
        // Add brutal roast conclusion
        const conclusions = [
            "My dog's piss would mog this into oblivion.",
            "Even my last dump could clear this with ease.",
            "This is what happens when beauty standards take a sick day.",
            "The background looks better than this, no joke.",
            "If I had to rate this versus literally anything else, I'd pick the anything else."
        ];
        sentences.push(conclusions[Math.floor(Math.random() * conclusions.length)]);
    }
    
    return sentences.join(" ");
}

function saveAndShowResults() {
    const name = mogName.value.trim() || 'Mystery Mog';
    
    // Use real API response if available, otherwise fall back to fake data
    let explanationText = `<strong>SECTION 1: MORPHOMETRIC ASSESSMENT REPORT</strong><br><br>`;
    
    if (currentApiResponse) {
        // Display real clinical findings from API response
        const findings = currentApiResponse.clinicalFindings || [];
        findings.forEach(finding => {
            explanationText += `
                <div class="indicator-block">
                    <div class="indicator-header">
                        <span class="indicator-name">${finding.indicator}</span>
                        <span class="indicator-value">${finding.value}</span>
                    </div>
                    <div class="indicator-description">${finding.note}</div>
                </div>
            `;
        });
        
        // Section 2: Use real verdict from API response
        const verdict = currentApiResponse.verdict;
        const sentences = verdict.split('. ');
        let highlightedVerdict = sentences.slice(0, -1).join('. ') + '. ';
        const punchline = sentences[sentences.length - 1];
        highlightedVerdict += `<span class="verdict-punchline">${punchline}</span>`;
        
        explanationText += `
            <div class="section-2-card">
                <h3 class="section-2-heading">💀 SECTION 2: VERDICT</h3>
                <p class="section-2-text">${highlightedVerdict}</p>
            </div>
        `;
    } else {
        // Fallback to fake data (for backward compatibility if API fails)
        const verdictParagraph = generateVerdictParagraph(name, currentRating, currentIndicators);
        
        currentIndicators.forEach(ind => {
            const structured = ind.generateStructured(currentRating);
            explanationText += `
                <div class="indicator-block">
                    <div class="indicator-header">
                        <span class="indicator-name">${structured.name}</span>
                        <span class="indicator-value">${structured.value}</span>
                    </div>
                    <div class="indicator-description">${structured.description}</div>
                </div>
            `;
        });
        
        const sentences = verdictParagraph.split('. ');
        let highlightedVerdict = sentences.slice(0, -1).join('. ') + '. ';
        const punchline = sentences[sentences.length - 1];
        highlightedVerdict += `<span class="verdict-punchline">${punchline}</span>`;
        
        explanationText += `
            <div class="section-2-card">
                <h3 class="section-2-heading">💀 SECTION 2: VERDICT</h3>
                <p class="section-2-text">${highlightedVerdict}</p>
            </div>
        `;
    }
    
    // Save to leaderboard
    saveToLeaderboard(name, currentRating, currentImageData);
    
    ratingScore.textContent = `${currentRating}/10`;
    explanation.innerHTML = explanationText;
    
    nameInputSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
}

function saveToLeaderboard(name, rating, imageData) {
    let leaderboard = getLeaderboard();
    
    leaderboard.push({
        id: Date.now(),
        name: name,
        rating: rating,
        image: imageData,
        date: new Date().toLocaleDateString()
    });
    
    // Sort by rating descending
    leaderboard.sort((a, b) => b.rating - a.rating);
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
}

function getLeaderboard() {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : [];
}

function displayLeaderboard() {
    const leaderboard = getLeaderboard();
    leaderboardList.innerHTML = '';
    
    if (leaderboard.length === 0) {
        leaderboardList.innerHTML = '<p class="empty-leaderboard">No mogs rated yet. Start rating to build the leaderboard!</p>';
        return;
    }
    
    leaderboard.forEach((entry, index) => {
        const rank = index + 1;
        let medal = '';
        
        if (rank === 1) medal = '🥇';
        else if (rank === 2) medal = '🥈';
        else if (rank === 3) medal = '🥉';
        
        const entryDiv = document.createElement('div');
        entryDiv.className = 'leaderboard-entry';
        entryDiv.innerHTML = `
            <div class="leaderboard-rank">${medal || rank}.</div>
            <img src="${entry.image}" class="leaderboard-image" alt="${entry.name}">
            <div class="leaderboard-info">
                <div class="leaderboard-name">${entry.name}</div>
                <div class="leaderboard-score">${entry.rating}/10</div>
            </div>
        `;
        leaderboardList.appendChild(entryDiv);
    });
}

// Handle try again
tryAgainBtn.addEventListener('click', () => {
    // Reset everything
    photoInput.value = '';
    mogName.value = '';
    uploadSection.classList.remove('hidden');
    loadingSection.classList.add('hidden');
    nameInputSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    leaderboardSection.classList.add('hidden');
});
