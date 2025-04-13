

function generateSimplePoem(userInput) {
    // Process user input
    const words = RiTa.tokenize(userInput);
    const tags = RiTa.pos(words);
    
    // Extract nouns, adjectives, verbs ----------------------------------------------------------------------------------
    let nouns = [];
    let adjectives = [];
    let verbs = [];
    
    for (let i = 0; i < words.length; i++) {
        if (tags[i].startsWith('nn')) nouns.push(words[i]);
        if (tags[i].startsWith('jj')) adjectives.push(words[i]);
        if (tags[i].startsWith('vb')) verbs.push(words[i]);
    }
    
    // Add defaults if none found ----------------------------------------------------------------------------------
    if (nouns.length === 0) nouns = ["place", "space", "home", RiTa.randomWord({ pos: "nn" })];
    if (adjectives.length === 0) adjectives = ["peaceful", "calm", "beautiful", RiTa.randomWord({ pos: "jj" })];
    if (verbs.length === 0) verbs = ["rest", "breathe", "live", RiTa.randomWord({ pos: "vb" })];

    try {
        // Helper function to get random elements
        function getRandom(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }
    
        
        // Create arrays for different phrase types
        const startVerbs = ["dream of", "hope for", "daydream of", "wonder about", 
                          "imagine", "yearn for", "long for", "wish for"];
                          
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
                expandUserPhrase()
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
                expandLiving(),
                getRandom(userAdjs) + " " + getRandom(spaces),
                getRandom(userAdjs) + " " + getRandom(feelings),
                getRandom(userAdjs) + " " + expandNounPhrase(),
                expandNounPhrase() + " with " + getRandom(userNouns),
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
            return getRandom(compare) + " than " + getRandom(timewords) + ", " + expandLiving();
        }
        
        // Create a generator object that can produce new lines
        const poemGenerator = {
            sentenceGenerators: [
                expandS1, expandS2, expandS3, expandS4, expandS5, expandS6,
                expandUserS1, expandUserS2, expandColors, expandElements, 
                expandComparison
            ],
            
            generateNextLine() {
                // Pick a random generator
                const generator = this.sentenceGenerators[Math.floor(Math.random() * this.sentenceGenerators.length)];
                let line = generator();
                
                // Format the line
                if (!line.endsWith(".") && !line.endsWith("?") && !line.endsWith("!")) {
                    line += ".";
                }
                return line.charAt(0).toUpperCase() + line.slice(1);
            }
        };

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
            lines: fallbackPoemGeneration(userInput, nouns, adjectives, verbs),
            generator: null 
        };
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

