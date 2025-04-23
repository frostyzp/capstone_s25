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
    const words2 = RiTa.tokenize(wishInput2);
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
                    const base = RiTa.baseForm(word);
                    if (base !== word) userAdjectives.push(base);
                }
            }
            if (tag.startsWith('vb')) {
                userVerbs.push(word);
                // Add base form
                const base = RiTa.baseForm(word);
                if (base !== word) userVerbs.push(base);
            }
            if (tag.startsWith('rb')) userAdverbs.push(word);
            if (tag.startsWith('in')) userPrepositions.push(word);
            if (tag.startsWith('cc')) userConjunctions.push(word);
        }
    }
    
    // Process each input with enhanced extraction
    processWords(words1, tags1);
    processWords(words2, tags2);
    processWords(words3, tags3);
    
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
                // Get similar words
                const similar = RiTa.similarBySound(word);
                const similarByPos = similar.filter(w => RiTa.pos(w)[0].startsWith(pos));
                
                // If we found similar words with matching part of speech, return one
                if (similarByPos.length > 0) {
                    return similarByPos[Math.floor(Math.random() * similarByPos.length)];
                }
                
                // If no similar words found, try to get a random word with same POS
                return RiTa.randomWord({ pos: pos });
            } catch (e) {
                // If anything fails, return the original word
                return word;
            }
        }

        // Helper function to get a word with 50% chance of being similar to user input
        function getWordWithVariation(word, pos, userWords) {
            if (Math.random() < 0.5 && userWords.length > 0) {
                // 50% chance to use a user word
                return getRandom(userWords);
            } else {
                // 50% chance to use a similar word
                return getSimilarWord(word, pos);
            }
        }
    
        // Define the grammar components
        const defaultNouns = ["place", "space", "home", "room", "garden", "haven", "sanctuary", "retreat", "corner", "nook", "shelter", "dwelling", "abode", "refuge", "hideaway", "domain", "realm"];
        const userAdjs = userAdjectives.length > 0 ? userAdjectives : ["peaceful", "calm", "beautiful"];
        const userVerbsList = userVerbs.length > 0 ? userVerbs : ["rest", "breathe", "live"];
        const userFeelingsList = userFeelings.length > 0 ? userFeelings : ["peace", "comfort", "safety", "belonging"];
        
        // Create arrays for different phrase types
        const startVerbs = ["dreaming of", "hoping for", "daydreaming", "envisioning", "wishing", "yearning"];
        const connecting = ["among", "between", "hidden", "by", "in", "inside", "outside"];
        const feelings = userFeelingsList.concat(["peace", "comfort", "safety", "belonging", "freedom", "solitude", 
                         "connection", "harmony", "warmth", "tranquility", "serenity", "joy", 
                         "wonder", "contentment"]);
        const poeticVerbs = ["drift", "float", "whisper", "dance", "flow", "shimmer", "echo", "sway", 
                      "bloom", "melt", "unfold", "dissolve"];
        const verbsIng = ["drifting", "floating", "whispering", "dancing", "flowing", "shimmering", 
                         "echoing", "swaying", "blooming", "melting", "unfolding", "dissolving"];
        const materials = ["light", "shadow", "air", "water", "fire", "earth", "stone", "wood", 
                         "glass", "crystal", "silver", "gold", "mist", "cloud", "sand", "silk", 
                         "paper", "thread", "wax", "ice", "smoke", "dust", "rain", "snow", 
                         "leaves", "petals", "feathers", "shells", "pebbles", "stars"];
        const colors = ["blue", "green", "golden", "amber", "silver", "rose", "violet", "turquoise", 
                       "emerald", "russet", "ivory", "azure", "crimson", "ochre", "indigo", "lavender"];
        const elements = ["air", "water", "earth", "fire", "wind", "rain", "sunlight", "moonlight", 
                         "stars", "clouds", "mist", "fog", "shadows", "reflections"];
        const timewords = ["morning", "evening", "dusk", "dawn", "twilight", "midnight", "daybreak", 
                          "sunset", "seasons", "moments", "eternities", "instants", "hours", "days", "years"];
        const dets = ["another", "some", "that", "this", "every", "each", "any"];
        
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
        
        function expandPhrase() {
            const choices = [
                getRandomWithPriority(userAdjs, userAdjectives) + " " + expandNounPhrase(),
                getRandom(connecting) + " " + RiTa.randomWord({ pos: "nn" }),
                "a " + getRandomWithPriority(userAdjs, userAdjectives) + " home",
                "a place where " + expandClause(),
                expandLiving(),
                getRandomWithPriority(userAdjs, userAdjectives) + " " + getRandom(spaces),
                getRandomWithPriority(userAdjs, userAdjectives) + " " + getRandom(feelings),
                getRandomWithPriority(userAdjs, userAdjectives) + " " + expandNounPhrase(),
                expandNounPhrase() + " with " + getRandomWithPriority(defaultNouns, userNouns),
                getRandom(spaces) + " where all can " + getRandomWithPriority(userVerbsList, userVerbs)
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
    
        
        // Standard sentence structures ---------------------------------------------------------
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
                   getRandom(spaces) + " where ";
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
                   RiTa.randomWord({ pos: "jj" }) + ", " 
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
                () => `${getRandom(startVerbs)} ${getRandom(dets)} ${getWordWithVariation(getRandom(userNouns), "nn", userNouns)} ${getRandom(connecting)} ${getRandom(timewords)}`,
                () => `${getRandom(startVerbs)} ${getRandom(dets)} ${getWordWithVariation(getRandom(userAdjs), "jj", userAdjectives)} ${getWordWithVariation(getRandom(userNouns), "nn", userNouns)} ${getRandom(connecting)} ${getWordWithVariation(getRandom(userAdjs), "jj", userAdjectives)} ${getRandom(timewords)}`,
                () => `${getRandom(dets)} ${getWordWithVariation(getRandom(userNouns), "nn", userNouns)} ${getRandom(connecting)} ${getRandom(timewords)}, ${getRandom(startVerbs)}`,
                () => `A ${getWordWithVariation(getRandom(userNouns), "nn", userNouns)} of ${getRandom(feelings)}, ${getRandom(verbsIng)} ${getRandom(connecting)} ${getRandom(dets)} ${getWordWithVariation(getRandom(userAdjs), "jj", userAdjectives)} ${getWordWithVariation(getRandom(userNouns), "nn", userNouns)}`,
                () => `A ${getWordWithVariation(getRandom(userNouns), "nn", userNouns)} of ${getRandom(materials)}, ${getRandom(verbsIng)} like ${getRandom(dets)} ${getWordWithVariation(getRandom(userAdjs), "jj", userAdjectives)} ${getRandom(timewords)}`,
                () => `more ${getWordWithVariation(getRandom(userAdjs), "jj", userAdjectives)} than ${getRandom(dets)} ${getWordWithVariation(getRandom(userNouns), "nn", userNouns)}, less ${getWordWithVariation(getRandom(userAdjs), "jj", userAdjectives)} than ${getRandom(timewords)} ${getRandom(connecting)} ${getRandom(feelings)}`,
                () => `as if ${getRandom(dets)} ${getWordWithVariation(getRandom(userNouns), "nn", userNouns)} could ${getWordWithVariation(getRandom(userVerbsList), "vb", userVerbs)} ${getRandom(dets)} ${getWordWithVariation(getRandom(userAdjs), "jj", userAdjectives)} ${getRandom(feelings)}`,
                () => `${getRandom(timewords)}'s ${getWordWithVariation(getRandom(userAdjs), "jj", userAdjectives)} ${getWordWithVariation(getRandom(userNouns), "nn", userNouns)} ${getWordWithVariation(getRandom(userVerbsList), "vb", userVerbs)} ${getRandom(dets)} ${getRandom(feelings)} of ${getWordWithVariation(getRandom(userAdjs), "jj", userAdjectives)} ${getWordWithVariation(getRandom(userNouns), "nn", userNouns)}`
            ];

            let currentIndex = 0;
            return {
                generateNextLine() {
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

