// Add Rita.js library
const rita = document.createElement('script');
rita.src = "https://unpkg.com/rita@3.1.3/dist/rita.min.js";
document.head.appendChild(rita);

let wishesRipple1 = [];

// Add these variables at the top of your file with other declarations
let hasGeneratedWish1 = false;

// Add color array at the top with other declarations
const brightColors = [
    'rgb(244, 250, 255)', // pink
    'rgb(255, 255, 255)', // white
    'rgb(255, 255, 0)'    // yellow
];

function getRandomColor() {
    return brightColors[Math.floor(Math.random() * brightColors.length)];
}

function createAsciiRipple(x, y, color) {
    const container = document.getElementById('ripple-container');
    if (!container) return;

    // Create ASCII ripple container
    const asciiContainer = document.createElement('div');
    asciiContainer.className = 'ascii-ripple';
    asciiContainer.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        transform: translate(-50%, -50%);
        font-family: 'VictorMono', monospace;
        font-size: 12px;
        color: ${color};
        white-space: pre;
        text-align: center;
        opacity: 0;
        z-index: 2;
        pointer-events: none;
        transition: opacity 0.3s ease-in;
    `;
    container.appendChild(asciiContainer);

    // ASCII ripple patterns - wave-like patterns
    const patterns = [
        '   ~   \n~.   ~\n     ~',
        '   /.  ~.  \\\n/. ~.    ~  \\\n\\.   ~.      /\n  ~  ~~ ~'
    ];

    let currentPattern = 0;
    const animateRipple = () => {
        if (currentPattern >= patterns.length) {
            asciiContainer.remove();
            return;
        }
        
        asciiContainer.textContent = patterns[currentPattern];
        asciiContainer.style.transform = 'perspective(500px) rotateX(60deg)';
        // Force a reflow to ensure the transition works
        void asciiContainer.offsetWidth;
        asciiContainer.style.opacity = '0.4';
        
        setTimeout(() => {
            asciiContainer.style.opacity = '0';
            setTimeout(() => {
                currentPattern++;
                animateRipple();
            }, 150);
        }, 500);
    };

    // Start the animation
    animateRipple();
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    let storedUserInput = '';
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let rockStartX = 0;
    let rockStartY = 0;
    let lastTimeStamp;
    let lastY;
    let velocityY = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartTime = 0;

    // Add click handler for submit button
    const submitButton = document.getElementById('submit-wish');
    if (submitButton) {
        submitButton.addEventListener('click', () => {
            storedUserInput = document.getElementById('wish-input').value;
            switchToPage('thirdPage');
        });
    } else {
        console.error('Submit button not found');
    }

    // Add swipe gesture detection for the third page
    const thirdPage = document.getElementById('third-page');
    if (thirdPage) {
        console.log('Adding touch event listeners to third page');
        thirdPage.addEventListener('touchstart', (event) => {
            console.log('Touch start detected on third page');
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
            touchStartTime = Date.now();
            console.log('Touch start position:', touchStartX, touchStartY);
        });

        thirdPage.addEventListener('touchmove', (event) => {
            touchEndX = event.touches[0].clientX;
            touchEndY = event.touches[0].clientY;
            console.log('Touch move position:', touchEndX, touchEndY);
        });

        thirdPage.addEventListener('touchend', (event) => {
            console.log('Touch end detected on third page');
            const touchEndTime = Date.now();
            const swipeDuration = touchEndTime - touchStartTime;
            const swipeDistance = touchStartY - touchEndY;
            const swipeVelocity = swipeDistance / swipeDuration; // pixels per millisecond
            
            console.log('Swipe details:', {
                distance: swipeDistance,
                duration: swipeDuration,
                velocity: swipeVelocity,
                endPosition: { x: touchEndX, y: touchEndY }
            });
            
            handleGesture(swipeDistance, swipeVelocity);
        });
    } else {
        console.error('Third page not found');
    }

    function handleGesture(swipeDistance, swipeVelocity) {
        console.log('Checking gesture:', swipeDistance, swipeVelocity);
        
        if (swipeDistance > 50) { // Swipe up detected
            console.log('Swipe up detected on third page');
            const { lines } = generateSimplePoem(storedUserInput);
            console.log('Generated lines:', lines);
            
            // Calculate starting position based on velocity and distance
            const basePosition = 5; // Base starting position (5% from bottom)
            const velocityFactor = Math.min(Math.max(swipeVelocity * 500, -10), 20); // Scale velocity down
            const distanceFactor = Math.min(swipeDistance / 20, 20); // Scale distance down
            const startPosition = basePosition + velocityFactor + distanceFactor;
            
            console.log('Text starting position:', startPosition);
            
            // Create ASCII ripple at touch end position
            // createAsciiRipple(touchEndX, touchEndY);
            
            // Start the text animation with custom position
            createRipplingText(lines.slice(0, 7), startPosition);
            // initializeTextScene(lines);

            hasGeneratedWish1 = true;
        } else {
            console.log('Not a swipe up gesture');
        }
    }

    // Restore rock functionality
    const rock = document.getElementById('skippingRock');
    if (rock) {
        rock.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDragging);

        rock.addEventListener('touchstart', startDragging);
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('touchend', stopDragging);
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
            // handleRockThrow();
        }
    }

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
});

function createRipplingText(lines, startPosition = 20) {
    console.log('Creating rippling text with lines:', lines);
    const container = document.getElementById('ripple-container');
    if (!container) {
        console.error('Ripple container not found');
        return;
    }
    
    // Make sure container is visible
    container.style.display = 'block';
    container.style.opacity = '1';
    container.style.zIndex = '1';
    
    // Create container for text if it doesn't exist
    let textContainer = container.querySelector('.text-container');
    if (!textContainer) {
        textContainer = document.createElement('div');
        textContainer.className = 'text-container';
        textContainer.style.cssText = `
            position: fixed;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            pointer-events: none;
            z-index: 2;
        `;
        container.appendChild(textContainer);
    }

    // Function to animate a line of text
    async function animateLine(line, lineIndex) {
        console.log('Animating line:', line);
        const lineElement = document.createElement('div');
        lineElement.className = 'lineElement'; // Add class for textillate
        lineElement.textContent = line;
        
        // Get a random color for this line
        const lineColor = getRandomColor();
        
        // Calculate opacity, size, and width based on line index
        const opacity = 1 - (lineIndex * 0.15); // Each line is 15% more transparent
        const fontSize = 16 - (lineIndex * 1.5); // Each line is 1.5px smaller
        const width = 80 - (lineIndex * 8); // Each line is 8% narrower
        
        // Calculate line position
        const bottomPosition = startPosition + lineIndex * 4;
        
        // Randomly choose left or right alignment with varying offsets
        const isLeft = Math.random() < 0.5;
        const randomOffset = Math.random() * 20; // Random offset between 0 and 20%
        const leftPosition = isLeft ? randomOffset : (100 - randomOffset - width);
        
        lineElement.style.cssText = `
            position: absolute;
            left: ${leftPosition}%;
            bottom: ${bottomPosition}%;
            text-align: ${isLeft ? 'left' : 'right'};
            width: ${width}%;
            opacity: 0;
            font-family: 'VictorMono', monospace;
            font-size: ${fontSize}px;
            color: ${lineColor};
            transition: opacity 1s ease-out, width 1s ease;
            z-index: 3;
        `;
        
        textContainer.appendChild(lineElement);
        
        // Get the line's position for the ripple
        const lineRect = lineElement.getBoundingClientRect();
        const rippleX = lineRect.left + lineRect.width / 2;
        const rippleY = lineRect.top + lineRect.height / 2;
        
        // Create ripple at line position with the same color
        createAsciiRipple(rippleX, rippleY, lineColor);

        // Apply textillate effect after a short delay to ensure the element is in the DOM
        setTimeout(() => {
            $(lineElement).textillate({
                in: {
                    effect: 'fadeInUp',
                    delay: 15,
                    // sequence: true,
                    shuffle: true,
                    sync: false
                },
                out: {
                    effect: 'fadeOutDown',
                    delay: 50,
                    shuffle: true
                }
            });
        }, 50);

        // Fade in the line with increased delay
        setTimeout(() => {
            lineElement.style.opacity = opacity;
            console.log('Fading in line:', line);
            
            // Fade out after 12 seconds
            setTimeout(() => {
                lineElement.style.transition = 'opacity 3s ease-out';
                lineElement.style.opacity = '0';
                
                // Remove element after fade out completes
                setTimeout(() => {
                    lineElement.remove();
                }, 3000);
            }, 12000);
        }, lineIndex * 400);


        document.addEventListener('touchstart', (event) => {
            const touch = event.touches[0];
            createAsciiRipple(touch.clientX, touch.clientY, 'white');
        });

        
        // Return a promise that resolves after the line has appeared
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, lineIndex * 400 + 400);
        });
    }

    // Animate all lines sequentially
    async function animateLines() {
        console.log('Starting line animation with lines:', lines);
        for (let i = 0; i < lines.length && i < 7; i++) {
            await animateLine(lines[i], i);
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
        const nouns = ["place", "space", "home", "room", "garden", "haven", "sanctuary", "retreat", "corner", "nook", "shelter", "dwelling", "abode", "refuge", "hideaway", "domain", "realm"];
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
                       "domains", "realms"].concat(nouns);
                       
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
                "a " + getRandom(userAdjs) + " " + getRandom(nouns),
                getRandom(userAdjs) + " " + getRandom(nouns),
                getRandom(compare) + " than " + getRandom(userAdjs) + " " + getRandom(nouns),
                "a " + getRandom(nouns) + " " + RiTa.randomWord({ pos: "in" }) + " " + getRandom(feelings)
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
                expandNounPhrase() + " with " + getRandom(nouns),
                getRandom(spaces) + " where all can " + getRandom(userVerbs)
            ];
            return getRandom(choices);
        }
        
        function expandNounPhrase() {
            const choices = [
                RiTa.randomWord({ pos: "nns" }),
                RiTa.randomWord({ pos: "nn" }),
                expandNounSingle(),
                getRandom(nouns) + " " + RiTa.randomWord({ pos: "in" }) + " " + 
                getRandom(userAdjs) + " " + RiTa.randomWord({ pos: "nn" }),
                getRandom(userAdjs) + " " + getRandom(nouns)
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
                "a " + RiTa.randomWord({ pos: "nn" }) + " like " + getRandom(nouns)
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
                   getRandom(nouns) + " for " + 
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
                   getRandom(nouns) + ", " +
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

