// Add these arrays at the top with other declarations
const verbs = ["rest", "breathe", "live", "dream", "float", "drift", "flow", "glow", "dance", "sing", "whisper", "echo"];
const verbsIng = verbs.map(v => v + "ing");

// Use RiTa for these word types
const adverbs = ["gently", "softly", "quietly", "slowly", "deeply", "lightly", "swiftly", "calmly", "peacefully", "serenely"];
const dets = ["another", "some", "that", "this", "every", "each", "any", "the", "a"];
const timewords = ["morning", "evening", "dusk", "dawn", "twilight", "midnight", "daybreak", "sunset", "seasons", "moments"];
const materials = ["light", "shadow", "air", "water", "fire", "earth", "stone", "wood", "glass", "crystal", "silver", "gold"];
const startVerbs = ["dreaming of", "hoping for", "daydreaming", "envisioning", "wishing", "yearning"];
const connecting = ["among", "between", "hidden", "by", "in", "inside", "outside", "within", "through", "beyond"];

// Enhanced noun categories
const natureNouns = ["garden", "forest", "meadow", "river", "mountain", "valley", "ocean", "sky", "cloud", "star", "moon", "sun", "tree", "flower", "leaf", "stone", "sand", "wave", "breeze", "rain"];
const spaceNouns = ["space", "universe", "cosmos", "galaxy", "star", "planet", "moon", "comet", "nebula", "void", "infinity", "eternity"];
const sanctuaryNouns = ["sanctuary", "haven", "retreat", "refuge", "shelter", "abode", "dwelling", "home", "nest", "cove", "grove", "glade", "clearing", "meadow", "garden"];
const abstractNouns = ["dream", "hope", "peace", "serenity", "tranquility", "harmony", "balance", "wisdom", "knowledge", "truth", "beauty", "grace", "light", "darkness", "silence", "sound"];

const defaultNouns = [...natureNouns, ...spaceNouns, ...sanctuaryNouns, ...abstractNouns];

// Helper function to get random words using RiTa
function getRandomWord(pos, count = 1) {
    try {
        if (count === 1) {
            return RiTa.randomWord({ pos: pos });
        } else {
            const words = [];
            for (let i = 0; i < count; i++) {
                words.push(RiTa.randomWord({ pos: pos }));
            }
            return words;
        }
    } catch (e) {
        console.error("Error getting random word:", e);
        return null;
    }
}

// Helper function to get a noun from the appropriate category
function getContextualNoun(userNoun) {
    try {
        // First try to categorize the user's noun
        const nounCategories = {
            nature: natureNouns,
            space: spaceNouns,
            sanctuary: sanctuaryNouns,
            abstract: abstractNouns
        };

        // Try to find which category the user's noun belongs to
        let bestCategory = null;
        let bestMatch = 0;

        for (const [category, nouns] of Object.entries(nounCategories)) {
            const match = nouns.some(noun => 
                RiTa.similarBySound(userNoun, noun) || 
                RiTa.similarBySound(noun, userNoun)
            );
            if (match) {
                bestCategory = category;
                break;
            }
        }

        // If we found a category, use it
        if (bestCategory) {
            return nounCategories[bestCategory][Math.floor(Math.random() * nounCategories[bestCategory].length)];
        }

        // If no category found, try to get a similar word using RiTa
        try {
            const similarWords = RiTa.similarBySound(userNoun);
            if (Array.isArray(similarWords) && similarWords.length > 0) {
                // Filter out words that are too different in length
                const filteredWords = similarWords.filter(word => 
                    Math.abs(word.length - userNoun.length) <= 3 &&
                    word.toLowerCase() !== userNoun.toLowerCase()
                );
                if (filteredWords.length > 0) {
                    return filteredWords[Math.floor(Math.random() * filteredWords.length)];
                }
            }
        } catch (e) {
            console.log("No similar words found for:", userNoun);
        }

        // If all else fails, return a random noun from the most appropriate category
        return defaultNouns[Math.floor(Math.random() * defaultNouns.length)];
    } catch (e) {
        console.error("Error in getContextualNoun:", e);
        return defaultNouns[Math.floor(Math.random() * defaultNouns.length)];
    }
}

function getWordWithVariation(word, pos, userWords) {
    if (pos.startsWith('nn')) {
        if (Math.random() < 0.6) {
            return word;
        }
        return getContextualNoun(word);
    }
    
    if (Math.random() < 0.5 && userWords.length > 0) {
        return getRandom(userWords);
    }
    return getRandomWord(pos) || word;
}

function generateSimplePoem(userInput) {
    // Validate input
    if (!userInput || typeof userInput !== 'string') {
        userInput = '';
    }

    // Get user inputs from the form
    const wishInput1 = document.getElementById('wish-input-1')?.value || '';
    const wishInput2 = document.getElementById('wish-input-2')?.value || '';
    const wishInput3 = document.getElementById('wish-input-3')?.value || '';

    // Process user inputs with enhanced word extraction
    const words1 = RiTa.tokenize(wishInput1);
    const words2 = RiTa.tokenize(wishInput2.replace(/\n/g, ' ')); // Replace newlines with spaces
    const words3 = RiTa.tokenize(wishInput3);
    
    const tags1 = RiTa.pos(words1);
    const tags2 = RiTa.pos(words2);
    const tags3 = RiTa.pos(words3);
    
    // Enhanced word extraction arrays
    let userNouns = [];
    let userAdjectives = [];
    let userVerbs = [];
    let userFeelings = [];
    let userAdverbs = [];
    let userPrepositions = [];
    let userConjunctions = [];
    
    // Enhanced word processing function
    function processWords(words, tags, targetArrays) {
        if (!Array.isArray(tags) || tags.length === 0) return;
        
        for (let i = 0; i < words.length; i++) {
            if (!tags[i] || typeof tags[i] !== 'string') continue;
            
            const word = words[i].toLowerCase();
            const tag = tags[i];
            
            // Skip common stop words
            const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
            if (stopWords.includes(word)) continue;
            
            // Enhanced part of speech detection
            if (tag.startsWith('nn')) {
                userNouns.push(word);
                // Also add plural forms
                if (tag === 'nns') {
                    const singular = RiTa.singularize(word);
                    if (singular !== word) userNouns.push(singular);
                }
            }
            if (tag.startsWith('jj')) {
                userAdjectives.push(word);
                // Add comparative/superlative forms
                if (tag === 'jjr' || tag === 'jjs') {
                    // Use stem instead of baseForm
                    const stem = RiTa.stem(word);
                    if (stem !== word) userAdjectives.push(stem);
                }
            }
            if (tag.startsWith('vb')) {
                userVerbs.push(word);
                // Add base form using stem
                const stem = RiTa.stem(word);
                if (stem !== word) userVerbs.push(stem);
            }
            if (tag.startsWith('rb')) userAdverbs.push(word);
            if (tag.startsWith('in')) userPrepositions.push(word);
            if (tag.startsWith('cc')) userConjunctions.push(word);
        }
    }
    
    // Process each input with enhanced extraction
    processWords(words1, tags1, userNouns);
    processWords(words2, tags2, userAdjectives);
    processWords(words3, tags3, userVerbs);
    
    // Add semantic expansion for feelings
    if (userFeelings.length > 0) {
        userFeelings.forEach(feeling => {
            try {
                const similar = RiTa.similarBySound(feeling);
                similar.forEach(word => {
                    if (RiTa.pos(word)[0].startsWith('nn') || RiTa.pos(word)[0].startsWith('jj')) {
                        userFeelings.push(word);
                    }
                });
            } catch (e) {
                console.error("Error expanding feelings:", e);
            }
        });
    }
    
    // Add defaults if none found, with more variety
    if (userNouns.length === 0) userNouns = ["place", "space", "home", "sanctuary", "haven", "retreat", "garden", "room", "corner", "nook"];
    if (userAdjectives.length === 0) userAdjectives = ["peaceful", "calm", "beautiful", "serene", "tranquil", "gentle", "soft", "quiet"];
    if (userVerbs.length === 0) userVerbs = ["rest", "breathe", "live", "dream", "float", "drift", "flow", "glow"];
    if (userFeelings.length === 0) userFeelings = ["peace", "comfort", "safety", "belonging", "wonder", "joy", "serenity", "harmony"];
    if (userAdverbs.length === 0) userAdverbs = ["gently", "softly", "quietly", "slowly", "deeply", "lightly"];
    if (userPrepositions.length === 0) userPrepositions = ["in", "among", "between", "through", "within", "beyond"];
    if (userConjunctions.length === 0) userConjunctions = ["and", "or", "but", "while", "as", "when"];

    try {
        // Helper function to get random elements
        function getRandom(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        // Helper function to get similar words using RiTa
        function getSimilarWord(word, pos) {
            try {
                // For nouns, use our enhanced contextual noun system
                if (pos.startsWith('nn')) {
                    return getContextualNoun(word);
                }
                
                // For other word types, try to get random words with same POS
                try {
                    return getRandomWord(pos) || word;
                } catch (e) {
                    console.error("Error getting random word:", e);
                    return word;
                }
            } catch (e) {
                console.error("Error in getSimilarWord:", e);
                return word;
            }
        }

        // Helper function to get a word with 50% chance of being similar to user input
        function getWordWithVariation(word, pos, userWords) {
            // For nouns, allow more variation while keeping context
            if (pos.startsWith('nn')) {
                // 60% chance to use the exact user noun
                if (Math.random() < 0.6) {
                    return word;
                }
                // 40% chance to use a similar or related noun
                return getSimilarWord(word, pos);
            }
            
            // For other word types, keep the 50/50 split
            if (Math.random() < 0.5 && userWords.length > 0) {
                return getRandom(userWords);
            } else {
                return getSimilarWord(word, pos);
            }
        }
    
        // Define the grammar components
        const userAdjs = userAdjectives.length > 0 ? userAdjectives : ["peaceful", "calm", "beautiful"];
        const userVerbsList = userVerbs.length > 0 ? userVerbs : ["rest", "breathe", "live"];
        const userFeelingsList = userFeelings.length > 0 ? userFeelings : ["peace", "comfort", "safety", "belonging"];
        
        // Create arrays for different phrase types
        const feelings = userFeelingsList.concat(["peace", "comfort", "safety", "belonging", "freedom", "solitude", 
                         "connection", "harmony", "warmth", "tranquility", "serenity", "joy", 
                         "wonder", "contentment"]);
        const poeticVerbs = ["drift", "float", "whisper", "dance", "flow", "shimmer", "echo", "sway", 
                      "bloom", "melt", "unfold", "dissolve"];
        const colors = ["blue", "green", "golden", "amber", "silver", "rose", "violet", "turquoise", 
                       "emerald", "russet", "ivory", "azure", "crimson", "ochre", "indigo", "lavender"];
        const elements = ["air", "water", "earth", "fire", "wind", "rain", "sunlight", "moonlight", 
                         "stars", "clouds", "mist", "fog", "shadows", "reflections"];
        
        // Helper function to get random elements with user input priority
        function getRandomWithPriority(arr, userArr) {
            // If user input is available, use it directly
            if (userArr && userArr.length > 0) {
                return userArr[Math.floor(Math.random() * userArr.length)];
            }
            return arr[Math.floor(Math.random() * arr.length)];
        }
        
        // Generate user-inspired phrases
        function expandUserInspired() {
            const choices = [
                expandUserPhrase(),
                expandUserPhrase()
            ];
            return getRandom(choices);
        }
        
        function expandUserPhrase() {
            const choices = [
                userInput,
                "a " + getRandomWithPriority(userAdjs, userAdjectives) + " " + getRandomWithPriority(defaultNouns, userNouns),
                getRandomWithPriority(userAdjs, userAdjectives) + " " + getRandomWithPriority(defaultNouns, userNouns),
                getRandom(connecting) + " " + getRandomWithPriority(userAdjs, userAdjectives) + " " + getRandomWithPriority(defaultNouns, userNouns),
                "a " + getRandomWithPriority(defaultNouns, userNouns) + " " + RiTa.randomWord({ pos: "in" }) + " " + getRandom(feelings)
            ];
            return getRandom(choices);
        }
        
        function expandNounPhrase() {
            const choices = [
                RiTa.randomWord({ pos: "nns" }),
                RiTa.randomWord({ pos: "nn" }),
                expandNounSingle(),
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
            ];
            return getRandom(choices);
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
        
        
        function expandComparison() {
            return getRandom(connecting) + " than " + getRandom(timewords) + ", " + expandLiving();
        }
        
        
        function generateGrammarStructure() {
            const structures = [
                // Template 1: Use user noun in first position
                () => `${getRandom(startVerbs)} ${getRandom(dets)} ${getWordWithVariation(getRandom(userNouns), "nn", userNouns)} ${getRandom(connecting)} ${getRandom(timewords)}`,
                
                // Template 2: Use different structure without user noun
                () => `${getRandom(dets)} ${getRandom(userAdjs)} ${getRandom(defaultNouns)} where ${getRandomWord('vb')}`,
                
                // Template 3: Use user noun in different position
                () => `the ${getRandom(feelings)} of ${getRandom(verbsIng)} ${getRandomWord('rb')} in ${getWordWithVariation(getRandom(userNouns), "nn", userNouns)}`,
                
                // Template 4: Use different structure
                () => `${getRandom(dets)} ${getRandom(materials)} of ${getRandom(feelings)}, ${getRandom(verbsIng)} ${getRandom(connecting)} ${getRandom(dets)} ${getRandom(userAdjs)} ${getRandom(defaultNouns)}`,
                
                // Template 5: Use user noun in final position
                () => `more ${getRandom(userAdjs)} than ${getRandom(dets)} ${getRandom(defaultNouns)}, less ${getRandom(userAdjs)} than ${getRandom(timewords)} ${getRandom(connecting)} ${getWordWithVariation(getRandom(userNouns), "nn", userNouns)}`,
                
                // Template 6: Use different structure without user noun
                () => `as if ${getRandom(dets)} ${getRandom(defaultNouns)} could ${getRandomWord('vb')} ${getRandom(dets)} ${getRandom(userAdjs)} ${getRandom(feelings)}`,
                
                // Template 7: Use user noun in middle position
                () => `${getRandom(timewords)}'s ${getRandom(userAdjs)} ${getWordWithVariation(getRandom(userNouns), "nn", userNouns)} ${getRandomWord('vb')} ${getRandom(dets)} ${getRandom(feelings)}`
            ];

            let currentIndex = 0;
            let usedNouns = new Set(); // Track which nouns we've used

            return {
                generateNextLine() {
                    // Reset used nouns if we've used them all
                    if (usedNouns.size >= userNouns.length) {
                        usedNouns.clear();
                    }

                    const line = structures[currentIndex]();
                    currentIndex = (currentIndex + 1) % structures.length;
                    return line.charAt(0).toUpperCase() + line.slice(1);
                }
            };
        }

        // Create a generator object that can produce new lines
        const poemGenerator = generateGrammarStructure();

        const lines = [];
        
        // First generate the starting line
        lines.push(expandStart());
        
        // Generate initial set of lines
        for (let i = 0; i < 8; i++) {
            lines.push(poemGenerator.generateNextLine());
        }
        
        return { lines, generator: poemGenerator };
    } catch (error) {
        console.error("Error generating poem:", error);
        return { 
            lines: fallbackPoemGeneration(userInput, userNouns, userAdjectives, userVerbs),
            generator: null 
        };
    }
}

// Fallback poem generation if all else fails
function fallbackPoemGeneration(userInput, nouns, adjectives, verbs) {
    // Helper for fallback
    const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];
    
    const lines = [];
    
    lines.push("Dream of " + userInput);
    lines.push("A " + getRandom(adjectives) + " " + getRandom(nouns) + " waiting to be found.");
    lines.push("Becoming " + getRandom(verbs) + " in the " + getRandom(adjectives) + " light.");
    lines.push("Where " + getRandom(nouns) + " meets " + getRandom(adjectives) + " dreams.");
    lines.push("The space transforms into sanctuary.");
    
    return lines;
}

