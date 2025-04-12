// Add Rita.js library
const rita = document.createElement('script');
rita.src = "https://unpkg.com/rita@3.1.3/dist/rita.min.js";
document.head.appendChild(rita);

let wishesRipple1 = [];

// Add these variables at the top of your file with other declarations
let hasGeneratedWish1 = false;

document.addEventListener('DOMContentLoaded', () => {
    let storedUserInput = '';
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let rockStartX = 0;
    let rockStartY = 0;
    let lastTimeStamp;
    let lastY;
    let velocityY = 0;

    // Add click handler for submit button
    document.getElementById('submit-wish').addEventListener('click', () => {
        storedUserInput = document.getElementById('wish-input').value;
        switchToPage('thirdPage');
    });

    const rock = document.getElementById('skippingRock');
    if (!rock) return;

    function handleRockThrow() {
        const { lines } = generateSimplePoem(storedUserInput || "a peaceful wish");
        createRipplingText(lines.slice(0, 5));
        initializeTextScene(lines);
        
        // Make rock disappear with fade out
        rock.style.transition = 'all 0.5s ease-out';
        rock.style.opacity = '0';
        rock.style.transform = 'translateY(-10vh) scale(0.5)';
        
        // Reset rock after animation
        setTimeout(() => {
            rock.style.transition = 'opacity 0.3s ease';
            rock.style.transform = 'none';
            rock.style.top = 'auto';
            rock.style.bottom = '5%';
            rock.style.left = '45%';
            rock.style.opacity = '1';
        }, 1000);
    }

    function startDragging(e) {
        isDragging = true;
        const touch = e.touches ? e.touches[0] : e;
        const rect = rock.getBoundingClientRect();
        
        // Store the offset of the click/touch point relative to the rock's position
        startX = touch.clientX - rect.left;
        startY = touch.clientY - rect.top;
        
        // Add dragging styles
        rock.style.transition = 'none';
        rock.style.cursor = 'grabbing';
        rock.classList.add('dragging');
    }

    function onDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const touch = e.touches ? e.touches[0] : e;
        
        // Calculate new position accounting for the initial grab offset
        const newX = touch.clientX - startX;
        const newY = touch.clientY - startY;
        
        // Calculate velocity
        const currentTime = Date.now();
        const timeDiff = currentTime - lastTimeStamp;
        if (timeDiff > 0) {
            velocityY = (touch.clientY - lastY) / timeDiff;
        }
        lastTimeStamp = currentTime;
        lastY = touch.clientY;

        // Update rock position using transform
        rock.style.position = 'fixed';
        rock.style.transform = `translate(${newX}px, ${newY}px)`;
    }

    function stopDragging() {
        if (!isDragging) return;
        isDragging = false;
        rock.style.cursor = 'grab';
        rock.classList.remove('dragging');

        // Check if velocity is high enough for a "fling"
        if (velocityY < -1.5) { // Negative velocity means upward movement
            handleRockThrow();
        }
    }

    // Mouse events
    rock.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDragging);

    // Touch events
    rock.addEventListener('touchstart', startDragging);
    document.addEventListener('touchmove', onDrag, { passive: false });
    document.addEventListener('touchend', stopDragging);

    // Add CSS for dragging state
    const style = document.createElement('style');
    style.textContent = `
        #skippingRock {
            cursor: grab;
            user-select: none;
            touch-action: none;
            position: fixed;
            bottom: 5%;
            left: 45%;
            transform-origin: center;
        }
        #skippingRock.dragging {
            cursor: grabbing;
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);

    // Listen for when the rock is moved using playhtml
    document.addEventListener('move', (e) => {
        console.log('Move event detected:', e.detail);
        
        if (e.detail && e.detail.element && e.detail.element.id === 'skippingRock') {
            const element = e.detail.element;
            const rockPosition = element.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // If the rock is moved more than halfway up the screen, consider it "skipped"
            if (rockPosition.top < viewportHeight / 2) {
                handleRockThrow();
                
                // Provide visual feedback
                element.style.opacity = 0.5;
                setTimeout(() => {
                    element.style.opacity = 1;
                    // Reset rock position after throw
                    element.style.transform = 'none';
                    element.style.top = 'auto';
                    element.style.bottom = '5%';
                    element.style.left = '45%';
                }, 1000);
            }
        }
    });

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

            const userInput = document.getElementById('wish-input').value;
            const { lines } = generateSimplePoem(userInput);
            
            // Switch to third page first
            switchToPage('thirdPage');
            
            // Then start the text animation
            createRipplingText(lines.slice(0, 5));
            
            hasGeneratedWish1 = true;
        }
    }
});

function createRipplingText(lines) {
    console.log('Creating rippling text with lines:', lines);
    const container = document.getElementById('ripple-container');
    if (!container) {
        console.error('Ripple container not found');
        return;
    }
    container.innerHTML = '';
    
    // Create container for text
    const textContainer = document.createElement('div');
    textContainer.style.cssText = `
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        pointer-events: none;
    `;
    container.appendChild(textContainer);

    // Function to split text into words
    function splitIntoWords(text) {
        return text.split(/\s+/);
    }

    // Function to create and animate a single word
    function createWordElement(word, index, totalWords) {
        const wordElement = document.createElement('span');
        
        wordElement.textContent = word + ' ';
        wordElement.style.cssText = `
            display: inline-block;
            opacity: 0;
            font-family: 'VictorMono', monospace;
            font-size: ${14 + Math.random() * 2}px;
            color: white;
            transition: all 3s ease-out;
            filter: blur(${Math.random() * 0.5}px);
            transform: translateY(${Math.random() * 10 - 5}px) scale(1.1);
        `;
        
        // Calculate delay based on word position
        const delay = index * 100; // 100ms delay between each word
        
        setTimeout(() => {
            wordElement.style.opacity = '1';
        }, delay);

        return wordElement;
    }

    // Function to animate a line of text
    async function animateLine(line, lineIndex) {
        const lineElement = document.createElement('div');
        lineElement.style.cssText = `
            position: absolute;
            left: 50%;
            bottom: ${20 + lineIndex * 8}%;
            transform: translateX(-50%);
            text-align: center;
            width: 80%;
            white-space: nowrap;
        `;
        
        const words = splitIntoWords(line);
        const wordElements = [];
        
        // Create word elements first
        for (let i = 0; i < words.length; i++) {
            const wordElement = createWordElement(words[i], i, words.length);
            wordElements.push(wordElement);
            lineElement.appendChild(wordElement);
        }
        
        textContainer.appendChild(lineElement);
        
        // Return a promise that resolves after all words have appeared
        return new Promise(resolve => {
            const totalDelay = words.length * 100 + 500; // Total animation time plus buffer
            setTimeout(() => {
                resolve();
            }, totalDelay);
            
            // Set up fade out
            setTimeout(() => {
                wordElements.forEach((element, i) => {
                    setTimeout(() => {
                        element.style.opacity = '0';
                        element.style.transform = 'translateY(-10px)';
                    }, i * 100);
                });
            }, 2500);
        });
    }

    // Animate all lines sequentially
    async function animateLines() {
        console.log('Starting line animation');
        for (let i = 0; i < lines.length && i < 5; i++) {
            await animateLine(lines[i], i);
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }

    // Start the animation
    animateLines().catch(err => console.error('Animation error:', err));
}

function createTextOverlay(lines, generator) {
    const container = document.getElementById('ripple-container');
    container.innerHTML = ''; // Clear container
    
    // Create text container with specific styling
    const textContainer = document.createElement('div');
    textContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    `;
    container.appendChild(textContainer);
    
    let opacity = 1;
    let delay = 0;
    
    // Add initial lines with fading effect
    lines.forEach((line, index) => {
        const textElement = document.createElement('div');
        textElement.textContent = line;
        textElement.style.cssText = `
            position: absolute;
            font-family: 'VictorMono', monospace;
            font-size: ${window.innerWidth < 600 ? '16px' : '24px'};
            color: white;
            opacity: ${opacity};
            transform: translate(-50%, -50%);
            text-align: center;
            max-width: 80%;
            transition: opacity 0.5s ease;
            pointer-events: none;
            white-space: nowrap;
        `;
        
        // Randomize position slightly
        const randomX = 50 + (Math.random() - 0.5) * 20; // 40-60%
        const randomY = 50 + (Math.random() - 0.5) * 20; // 40-60%
        textElement.style.left = `${randomX}%`;
        textElement.style.top = `${randomY}%`;
        
        textContainer.appendChild(textElement);
        opacity *= 0.85; // Reduce opacity for each subsequent line
    });
    
    // Add scroll listener to generate new lines
    let lastScrollY = 0;
    container.addEventListener('wheel', (e) => {
        if (e.deltaY > 0 && generator) { // Scrolling down
            const newLine = generator.generateNextLine();
            addNewLine(textContainer, newLine);
        }
    });
    
    // Add touch support
    let touchStart = 0;
    container.addEventListener('touchstart', (e) => {
        touchStart = e.touches[0].clientY;
    });
    
    container.addEventListener('touchmove', (e) => {
        const touchEnd = e.touches[0].clientY;
        if (touchStart > touchEnd && generator) { // Swiping up
            const newLine = generator.generateNextLine();
            addNewLine(textContainer, newLine);
        }
        touchStart = touchEnd;
    });
}

function addNewLine(container, text) {
    const textElement = document.createElement('div');
    textElement.textContent = text;
    
    // Get existing elements and their opacities
    const existingElements = container.children;
    
    // Fade existing elements
    Array.from(existingElements).forEach(element => {
        const currentOpacity = parseFloat(element.style.opacity);
        element.style.opacity = currentOpacity * 0.85;
    });
    
    // Style new element
    textElement.style.cssText = `
        position: absolute;
        font-family: 'VictorMono', monospace;
        font-size: ${window.innerWidth < 600 ? '16px' : '24px'};
        color: white;
        opacity: 1;
        transform: translate(-50%, -50%);
        text-align: center;
        max-width: 80%;
        transition: opacity 0.5s ease;
        pointer-events: none;
        white-space: nowrap;
        left: ${50 + (Math.random() - 0.5) * 20}%;
        top: ${50 + (Math.random() - 0.5) * 20}%;
    `;
    
    container.appendChild(textElement);
    
    // Remove very faded elements to prevent memory issues
    Array.from(existingElements).forEach(element => {
        if (parseFloat(element.style.opacity) < 0.1) {
            element.remove();
        }
    });
}

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
        
        // Create a generator object that can produce new lines
        const poemGenerator = {
            sentenceGenerators: [
                expandS1, expandS2, expandS3, expandS4, expandS5, expandS6,
                expandUserS1, expandUserS2, expandColors, expandElements, 
                expandMaterials, expandComparison
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

