// Add Rita.js library
const rita = document.createElement('script');
rita.src = "https://unpkg.com/rita@3.1.3/dist/rita.min.js";
document.head.appendChild(rita);

let wishesRipple1 = [];

// Add these variables at the top of your file with other declarations
let hasGeneratedWish1 = false;

document.addEventListener('DOMContentLoaded', () => {
    // Detect swipe up gesture
    let touchStartY = 0;
    let touchEndY = 0;

    const container = document.getElementById('wish-input-container');

    // HANDLE SWIPE UP GESTURES ------------------------------------------------------------------------------------------
    container.addEventListener('touchstart', (event) => {
        touchStartY = event.changedTouches[0].screenY;
    });

    container.addEventListener('touchend', (event) => {
        touchEndY = event.changedTouches[0].screenY;
        handleGesture();
    });

    // SWIPE UP DETECTED ------------------------------------------------------------------------------------------------
    function handleGesture() {
        if (touchStartY - touchEndY > 50) { // Swipe up detected
            console.log('Swipe up detected');

            const ripple1 = document.getElementById('ripple-1');

            const userInput = document.getElementById('wish-input').value;
            const poemLines = generateSimplePoem(userInput);
            
            ripple1.innerHTML = ''; // Clear previous content
            
            // Set up the container for absolute positioning
            ripple1.style.position = 'relative';
            ripple1.style.height = '100%';
            
            // Calculate line height and position for stacking
            const lineHeight = 50; // Height estimate for each line in pixels
            const startPosition = 20; // Percentage from bottom
            
            // Create ripple effect for each line of the poem, in reversed order to stack properly
            poemLines.forEach((line, index) => {
                setTimeout(() => {
                    // Create a simple paragraph element for each line
                    const p = document.createElement('p');
                    p.className = 'poem-line';
                    p.textContent = line;
                    p.style.opacity = 0;
                    p.style.transition = 'opacity 2s ease-in';
                    
                    // Position each line absolutely, stacking from bottom up
                    p.style.position = 'absolute';
                    p.style.bottom = `${startPosition + (index * 10)}%`; // Position 10% higher for each line
                    p.style.left = '0';
                    p.style.right = '0';
                    p.style.margin = '0 auto'; // Center horizontally
                    p.style.zIndex = poemLines.length - index; // Stack newer lines behind older ones
                    
                    // Add to container
                    ripple1.appendChild(p);
                    
                    // Fade in after a brief delay
                    setTimeout(() => {
                        p.style.opacity = 1;
                    }, 100);
                    
                }, index * 1000); // Stagger the appearance of each line
            });
            
            hasGeneratedWish1 = true;
        }
    }
});

// Simple poem generator using RiTa grammar directly
function generateSimplePoem(userInput) {
    // Process user input
    const words = RiTa.tokenize(userInput);
    const tags = RiTa.pos(words);
    
    // Extract nouns, adjectives, verbs
    let nouns = [];
    let adjectives = [];
    let verbs = [];
    
    for (let i = 0; i < words.length; i++) {
        if (tags[i].startsWith('nn')) nouns.push(words[i]);
        if (tags[i].startsWith('jj')) adjectives.push(words[i]);
        if (tags[i].startsWith('vb')) verbs.push(words[i]);
    }
    
    // Add defaults if none found
    if (nouns.length === 0) nouns = ["place", "space", "home", RiTa.randomWord({ pos: "nn" })];
    if (adjectives.length === 0) adjectives = ["peaceful", "calm", "beautiful", RiTa.randomWord({ pos: "jj" })];
    if (verbs.length === 0) verbs = ["rest", "breathe", "live", RiTa.randomWord({ pos: "vb" })];

    try {
        // Helper function to get random elements
        function getRandom(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }
        
        // Define the grammar components
        const userNouns = nouns.length > 0 ? nouns : ["place", "space", "home"];
        const userAdjs = adjectives.length > 0 ? adjectives : ["peaceful", "calm", "beautiful"];
        const userVerbs = verbs.length > 0 ? verbs : ["rest", "breathe", "live"];
        
        // Create arrays for different phrase types
        const startVerbs = ["dream of", "hope for", "desire", "daydream of", "wonder about", 
                          "imagine", "yearn for", "envision", "long for", "wish for"];
                          
        const compare = ["more", "less", "smaller", "greater", "clearer", "brighter", "darker", 
                        "warmer", "cozier", "quieter", "safer", "freer", "calmer", "softer", 
                        "wilder", "gentler", "lovelier", "spacier", "airier", "livelier"];
                        
        const spaces = ["rooms", "gardens", "havens", "sanctuaries", "retreats", "corners", "nooks", 
                       "shelters", "dwellings", "homes", "abodes", "refuges", "hideaways", 
                       "domains", "realms"].concat(userNouns);
                       
        const feelings = ["peace", "comfort", "safety", "belonging", "freedom", "solitude", 
                         "connection", "harmony", "warmth", "tranquility", "serenity", "joy", 
                         "wonder", "contentment"];
                         
        const colors = ["blue", "green", "golden", "amber", "silver", "rose", "violet", "turquoise", 
                       "emerald", "russet", "ivory", "azure", "crimson", "ochre", "indigo", "lavender"];
                       
        const materials = ["wood", "stone", "glass", "fabric", "water", "light", "metal", "clay", 
                          "paper", "cotton", "silk", "wool", "velvet", "linen", "leather"];
                          
        const elements = ["air", "water", "earth", "fire", "wind", "rain", "sunlight", "moonlight", 
                         "stars", "clouds", "mist", "fog", "shadows", "reflections"];
                         
        const timewords = ["morning", "evening", "dusk", "dawn", "twilight", "midnight", "daybreak", 
                          "sunset", "seasons", "moments", "eternities", "instants", "hours", "days", "years"];
                          
        const dets = ["another", "some", "that", "this", "every", "each", "any"];
        
        // Grammar-based generation functions
        
        // Generate user-inspired phrases
        function expandUserInspired() {
            const choices = [
                expandUserPhrase(),
                expandUserPhrase() + ", " + expandPhrase(),
                expandUserPhrase() + " where " + expandClause()
            ];
            return getRandom(choices);
        }
        
        function expandUserPhrase() {
            const choices = [
                userInput,
                "a " + getRandom(userAdjs) + " " + getRandom(userNouns),
                getRandom(userAdjs) + " " + getRandom(userNouns),
                getRandom(compare) + " than " + getRandom(userAdjs) + " " + getRandom(userNouns),
                "a " + getRandom(userNouns) + " " + RiTa.randomWord({ pos: "in" }) + " " + getRandom(feelings)
            ];
            return getRandom(choices);
        }
        
        function expandPhrase() {
            const choices = [
                getRandom(userAdjs) + " " + expandNounPhrase(),
                getRandom(compare) + " " + RiTa.randomWord({ pos: "nn" }),
                "a " + getRandom(userAdjs) + " home",
                "a place where " + expandClause(),
                expandLiving(),
                getRandom(userAdjs) + " " + getRandom(spaces),
                getRandom(userAdjs) + " " + getRandom(feelings),
                getRandom(userAdjs) + " " + expandNounPhrase(),
                expandNounPhrase() + " with " + getRandom(userNouns),
                getRandom(spaces) + " where all can " + getRandom(userVerbs)
            ];
            return getRandom(choices);
        }
        
        function expandNounPhrase() {
            const choices = [
                RiTa.randomWord({ pos: "nns" }),
                RiTa.randomWord({ pos: "nn" }),
                expandNounSingle(),
                getRandom(userNouns) + " " + RiTa.randomWord({ pos: "in" }) + " " + 
                getRandom(userAdjs) + " " + RiTa.randomWord({ pos: "nn" }),
                getRandom(userAdjs) + " " + getRandom(userNouns)
            ];
            return getRandom(choices);
        }
        
        function expandNounSingle() {
            const choices = [
                "a " + RiTa.randomWord({ pos: "nn" }),
                "a " + getRandom(userAdjs) + " " + RiTa.randomWord({ pos: "nn" }),
                "a " + RiTa.randomWord({ pos: "nn" }) + " " + RiTa.randomWord({ pos: "in" }) + " " + 
                getRandom(feelings),
                "a " + RiTa.randomWord({ pos: "nn" }) + " where " + expandClause(),
                "a " + getRandom(spaces) + " " + RiTa.randomWord({ pos: "in" }) + " " + 
                getRandom(userAdjs) + " " + RiTa.randomWord({ pos: "nns" }),
                "a " + getRandom(userAdjs) + " " + RiTa.randomWord({ pos: "nn" }),
                "a " + RiTa.randomWord({ pos: "nn" }) + " like " + getRandom(userNouns)
            ];
            return getRandom(choices);
        }
        
        function expandLiving() {
            const choices = [
                "living " + RiTa.randomWord({ pos: "rb" }),
                "living " + RiTa.randomWord({ pos: "in" }) + " " + getRandom(spaces),
                "living " + RiTa.randomWord({ pos: "in" }) + " a " + 
                getRandom(userAdjs) + " world",
                "living where " + expandClause(),
                "living with " + getRandom(userAdjs) + " " + getRandom(feelings)
            ];
            return getRandom(choices);
        }
        
        function expandClause() {
            const choices = [
                "the " + RiTa.randomWord({ pos: "nns" }) + " are " + getRandom(userAdjs),
                "time moves " + RiTa.randomWord({ pos: "jjr" }),
                "there is " + getRandom(userAdjs) + " " + RiTa.randomWord({ pos: "nn" }),
                "light " + RiTa.randomWord({ pos: "vbz" }) + " through " + 
                getRandom(userAdjs) + " glass",
                "the " + RiTa.randomWord({ pos: "nns" }) + " " + 
                RiTa.randomWord({ pos: "vb" }) + " " + RiTa.randomWord({ pos: "in" }) + " one",
                RiTa.randomWord({ pos: "nn" }) + " becomes sanctuary",
                getRandom(userAdjs) + " " + RiTa.randomWord({ pos: "nns" }) + " surround the space"
            ];
            return getRandom(choices);
        }
        
        // Standard sentence structures
        function expandS1() {
            return getRandom(dets) + " " + 
                   getRandom(userAdjs) + " " + 
                   getRandom(userNouns) + " for " + 
                   "one to " + RiTa.randomWord({ pos: "vb" }) + " " + 
                   RiTa.randomWord({ pos: "in" });
        }
        
        function expandS2() {
            return "a place where " + 
                   RiTa.randomWord({ pos: "nns" }) + " " + 
                   RiTa.randomWord({ pos: "vb" }) + " like " + 
                   getRandom(userAdjs) + " " + 
                   RiTa.randomWord({ pos: "nn" });
        }
        
        function expandS3() {
            return "the " + 
                   getRandom(userAdjs) + " " + 
                   getRandom(spaces) + " where " + 
                   expandClause();
        }
        
        function expandS4() {
            return getRandom(dets) + " " +
                  RiTa.randomWord({ pos: "nn" }) + " filled with " +
                  getRandom(userAdjs) + " " +
                  RiTa.randomWord({ pos: "nns" }) + " and " + 
                  RiTa.randomWord({ pos: "jj" }) + " " +
                  RiTa.randomWord({ pos: "nns" });
        }
        
        function expandS5() {
            return getRandom(userAdjs) + " light falling " +
                   RiTa.randomWord({ pos: "in" }) + " " +
                   getRandom(userAdjs) + " " +
                   RiTa.randomWord({ pos: "nns" });
        }
        
        function expandS6() {
            return "the " + getRandom(feelings) + " of " +
                   RiTa.randomWord({ pos: "vbg" }) + " " +
                   RiTa.randomWord({ pos: "rb" }) + " " +
                   RiTa.randomWord({ pos: "in" }) + " " +
                   "the " +
                   getRandom(userAdjs) + " " +
                   RiTa.randomWord({ pos: "nn" });
        }
        
        function expandUserS1() {
            return getRandom(dets) + " " +
                   getRandom(userAdjs) + " " +
                   RiTa.randomWord({ pos: "nn" }) + " where " +
                   "one can " +
                   getRandom(userVerbs) + " " +
                   RiTa.randomWord({ pos: "in" }) + " dreams";
        }
        
        function expandUserS2() {
            return "the " +
                   getRandom(userNouns) + ", " +
                   getRandom(userAdjs) + " and " +
                   RiTa.randomWord({ pos: "jj" }) + ", " +
                   RiTa.randomWord({ pos: "in" }) + " the " +
                   getRandom(userAdjs) + " " +
                   RiTa.randomWord({ pos: "nn" });
        }
        
        function expandStart() {
            return getRandom(startVerbs) + " " + expandUserInspired();
        }
        
        // Special combined templates
        function expandColors() {
            return getRandom(colors) + " " + getRandom(feelings) + " in " + getRandom(spaces);
        }
        
        function expandElements() {
            return getRandom(elements) + " moving through " + getRandom(userAdjs) + " " + getRandom(timewords);
        }
        
        function expandMaterials() {
            return getRandom(materials) + " shaped into " + expandNounPhrase();
        }
        
        function expandComparison() {
            return getRandom(compare) + " than " + getRandom(timewords) + ", " + expandLiving();
        }
        
        // Generate the poem lines
        const lines = [];
        
        // First generate the starting line
        lines.push(expandStart());
        
        // Create an array of sentence generators and shuffle them
        const sentenceGenerators = [
            expandS1, expandS2, expandS3, expandS4, expandS5, expandS6,
            expandUserS1, expandUserS2, expandColors, expandElements, 
            expandMaterials, expandComparison
        ];
        
        // Helper function to shuffle array
        function shuffleArray(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }
        
        // Shuffle and pick generators to use
        const shuffledGenerators = shuffleArray(sentenceGenerators);
        
        // Generate 4 more lines
        for (let i = 0; i < 8; i++) {
            const generatorIndex = i % shuffledGenerators.length;
            lines.push(shuffledGenerators[generatorIndex]());
        }
        
        // Format the lines properly
        const formattedLines = lines.map(line => {
            // Add period if needed
            if (!line.endsWith(".") && !line.endsWith("?") && !line.endsWith("!")) {
                line += ".";
            }
            // Capitalize first letter
            return line.charAt(0).toUpperCase() + line.slice(1);
        });
        
        return formattedLines;
    } catch (error) {
        console.error("Error generating poem:", error);
        return fallbackPoemGeneration(userInput, nouns, adjectives, verbs);
    }
}

// Fallback poem generation if all else fails
function fallbackPoemGeneration(userInput, nouns, adjectives, verbs) {
    // Helper for fallback
    const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];
    
    const lines = [];
    
    lines.push("Dream of " + userInput + ".");
    lines.push("A " + getRandom(adjectives) + " " + getRandom(nouns) + " waiting to be found.");
    lines.push("Becoming " + getRandom(verbs) + " in the " + getRandom(adjectives) + " light.");
    lines.push("Where " + getRandom(nouns) + " meets " + getRandom(adjectives) + " dreams.");
    lines.push("The space transforms into sanctuary.");
    
    return lines;
}

