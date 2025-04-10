// Add Rita.js library
const rita = document.createElement('script');
rita.src = "https://unpkg.com/rita@3.1.3/dist/rita.min.js";
document.head.appendChild(rita);

let wishesRipple1 = [];

// Add these variables at the top of your file with other declarations
let hasGeneratedWish1 = false;
let isTiltPoemActive = false;
let tiltPoemInterval = null;
let lastTiltPoemTime = 0;
let tiltPoemWords = [];

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

            const wish = generateWish();
            const wordElements = createWordElements(wish);
            
            console.log('wordElements:', wordElements);
            ripple1.innerHTML = ''; // Clear previous content
            ripple1.appendChild(wordElements);
            console.log('ripple1 words:', wordElements);

            hasGeneratedWish1 = true;
        }
    }
});

// Function to be called when device is tilted (to be used by buttons.js)
function handleDeviceTilt(gamma, beta) {
    // Get the current time to throttle the effect
    const now = Date.now();
    
    // Check if enough time has passed since the last tilt poem generation
    if (now - lastTiltPoemTime < 500) {
        return; // Throttle to prevent too many generations
    }
    
    // Use the absolute values for detection
    const tiltLeftRight = Math.abs(gamma);
    const tiltFrontBack = Math.abs(beta);
    
    // Check if the device is tilted enough
    if (tiltLeftRight > 15 || tiltFrontBack > 15) {
        console.log('Device tilted for poem:', tiltLeftRight, tiltFrontBack);
        
        // Start the infinite poem if not already active
        if (!isTiltPoemActive) {
            startInfinitePoem();
        } else {
            // If already active, just add a new word to the ripple
            addWordToInfinitePoem();
        }
        
        lastTiltPoemTime = now;
    } else if (isTiltPoemActive && tiltLeftRight < 5 && tiltFrontBack < 5) {
        // If the device is fairly flat again, stop the infinite poem
        stopInfinitePoem();
    }
}

// Start generating the infinite poem
function startInfinitePoem() {
    if (isTiltPoemActive) return;
    
    console.log('Starting infinite poem');
    isTiltPoemActive = true;
    
    // Create poem container if it doesn't exist
    const rippleContainer = document.getElementById('ripple-container');
    let poemContainer = document.getElementById('infinite-poem-container');
    
    if (!poemContainer) {
        poemContainer = document.createElement('div');
        poemContainer.id = 'infinite-poem-container';
        poemContainer.style.position = 'fixed';
        poemContainer.style.top = '0';
        poemContainer.style.left = '0';
        poemContainer.style.width = '100%';
        poemContainer.style.height = '100%';
        poemContainer.style.pointerEvents = 'none';
        poemContainer.style.zIndex = '10';
        poemContainer.style.overflow = 'hidden';
        rippleContainer.appendChild(poemContainer);
    }
    
    // Clear any existing content
    poemContainer.innerHTML = '';
    tiltPoemWords = [];
    
    // Generate initial words and start the interval
    for (let i = 0; i < 5; i++) {
        addWordToInfinitePoem();
    }
    
    // Set an interval to keep adding words regularly
    tiltPoemInterval = setInterval(addWordToInfinitePoem, 2000);
}

// Stop the infinite poem
function stopInfinitePoem() {
    if (!isTiltPoemActive) return;
    
    console.log('Stopping infinite poem');
    isTiltPoemActive = false;
    clearInterval(tiltPoemInterval);
    
    // Fade out all words
    const poemContainer = document.getElementById('infinite-poem-container');
    if (poemContainer) {
        const words = poemContainer.querySelectorAll('.poem-word');
        words.forEach(word => {
            word.style.transition = 'opacity 1.5s ease-out';
            word.style.opacity = '0';
        });
        
        // Remove container after all words fade out
        setTimeout(() => {
            if (poemContainer.parentNode) {
                poemContainer.parentNode.removeChild(poemContainer);
            }
        }, 1500);
    }
}

// Add a new word to the infinite poem
function addWordToInfinitePoem() {
    // Get user input if available, otherwise use default seed words
    const userInput = document.getElementById('wish-input').value;
    let seedText = userInput || "dream wish hope star light water ripple";
    
    // Use RiTa to generate poetic words
    let newWord = "";
    
    // Different strategies to generate words
    const strategy = Math.floor(Math.random() * 5);
    
    switch (strategy) {
        case 0: // Use a random word from the seed text
            const seedWords = RiTa.tokenize(seedText);
            newWord = seedWords[Math.floor(Math.random() * seedWords.length)];
            break;
            
        case 1: // Generate a similar word to a random word from previous words
            if (tiltPoemWords.length > 0) {
                const randomPrevWord = tiltPoemWords[Math.floor(Math.random() * tiltPoemWords.length)];
                try {
                    const similar = RiTa.similar(randomPrevWord, {limit: 10});
                    if (similar && similar.length > 0) {
                        newWord = similar[Math.floor(Math.random() * similar.length)];
                    }
                } catch (e) {
                    console.log('Error getting similar words:', e);
                }
            }
            break;
            
        case 2: // Generate a random word with specific part of speech
            const pos = ["nn", "jj", "vb"][Math.floor(Math.random() * 3)];
            newWord = RiTa.randomWord({pos: pos});
            break;
            
        case 3: // Transform a previous word (if available)
            if (tiltPoemWords.length > 0) {
                const prevWord = tiltPoemWords[Math.floor(Math.random() * tiltPoemWords.length)];
                if (RiTa.isVerb(prevWord)) {
                    const tenses = ['present', 'past', 'future'];
                    const tense = tenses[Math.floor(Math.random() * tenses.length)];
                    newWord = RiTa.conjugate(prevWord, {tense: tense});
                } else if (RiTa.isNoun(prevWord)) {
                    newWord = RiTa.pluralize(prevWord);
                } else {
                    newWord = prevWord;
                }
            }
            break;
            
        case 4: // Generate a random rhyming word
            if (tiltPoemWords.length > 0) {
                const prevWord = tiltPoemWords[Math.floor(Math.random() * tiltPoemWords.length)];
                try {
                    const rhymes = RiTa.rhymes(prevWord, {limit: 10});
                    if (rhymes && rhymes.length > 0) {
                        newWord = rhymes[Math.floor(Math.random() * rhymes.length)];
                    }
                } catch (e) {
                    console.log('Error getting rhymes:', e);
                }
            }
            break;
    }
    
    // If we couldn't generate a word, use a fallback
    if (!newWord || newWord === "") {
        const fallbacks = ["dream", "wish", "hope", "ripple", "flow", "drift", "glow"];
        newWord = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
    
    // Add to our word collection
    tiltPoemWords.push(newWord);
    if (tiltPoemWords.length > 20) {
        tiltPoemWords.shift(); // Keep the array from growing too large
    }
    
    // Display the word with ripple effect
    displayRippleWord(newWord);
}

// Display a word with a ripple effect in the infinite poem
function displayRippleWord(word) {
    const poemContainer = document.getElementById('infinite-poem-container');
    if (!poemContainer) return;
    
    // Create a word element
    const wordEl = document.createElement('div');
    wordEl.className = 'poem-word';
    wordEl.textContent = word;
    
    // Position in the center initially
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Random position in a circle around the center
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 100; // 50-150px from center
    const startX = centerX + Math.cos(angle) * 20; // Start closer to center
    const startY = centerY + Math.sin(angle) * 20;
    const endX = centerX + Math.cos(angle) * distance;
    const endY = centerY + Math.sin(angle) * distance;
    
    // Style the word
    wordEl.style.position = 'absolute';
    wordEl.style.left = startX + 'px';
    wordEl.style.top = startY + 'px';
    wordEl.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 30 - 15}deg)`;
    wordEl.style.color = `rgba(255, 255, 255, ${0.5 + Math.random() * 0.5})`; // Semi-transparent white
    wordEl.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
    wordEl.style.fontSize = `${Math.random() * 12 + 14}px`; // 14-26px
    wordEl.style.fontWeight = Math.random() > 0.5 ? 'normal' : 'bold';
    wordEl.style.fontStyle = Math.random() > 0.7 ? 'italic' : 'normal';
    wordEl.style.opacity = '0';
    wordEl.style.zIndex = '10';
    
    // Add to container
    poemContainer.appendChild(wordEl);
    
    // Start the animation sequence
    setTimeout(() => {
        // Fade in
        wordEl.style.transition = 'opacity 0.8s ease-in, left 3s ease-out, top 3s ease-out, filter 2s ease-in-out';
        wordEl.style.opacity = '1';
        
        // Move outward
        setTimeout(() => {
            wordEl.style.left = endX + 'px';
            wordEl.style.top = endY + 'px';
            
            // Fade out as it moves to the edge
            setTimeout(() => {
                wordEl.style.opacity = '0';
                wordEl.style.filter = 'blur(3px)';
                
                // Remove from DOM after animation completes
                setTimeout(() => {
                    if (wordEl.parentNode) {
                        wordEl.parentNode.removeChild(wordEl);
                    }
                }, 1000);
            }, 1500);
        }, 100);
    }, 10);
}

// THE GRAMMAR FUNCTION ------------------------------------------------------------------------------------------
function generateWish() {
    const userInput = document.getElementById('wish-input').value;
    const words = RiTa.tokenize(userInput);
    const tags = RiTa.pos(words);
    
    // Find verbs and adjectives to potentially transform
    const transformedWords = words.map((word, i) => {
        if (tags[i].startsWith('vb')) {
            // Randomly transform verbs
            const transforms = [
                RiTa.conjugate(word, {tense: 'present'}),
                RiTa.conjugate(word, {tense: 'past'}),
                'will ' + RiTa.conjugate(word, {tense: 'present'}),
                'would ' + RiTa.conjugate(word, {tense: 'present'})
            ];
            return transforms[Math.floor(Math.random() * transforms.length)];
        } else if (tags[i].startsWith('jj')) {
            // For adjectives, just get a new random adjective
            return RiTa.randomWord({ pos: "jj" });
        }
        return word;
    });
    
    const transformedWish = transformedWords.join(' ');
    console.log('Transformed wish:', transformedWish);
    
    // Add to array
    wishesRipple1.push(transformedWish);
    return transformedWish;
}

// Function to find related nouns using RiTa ----------------------------------------------------------------------------
function getRelatedNouns(noun, count = 3) {
    // Use RiTa's features to get related words
    let related = [];
    
    try {
        // Try to get similar words first
        const similar = RiTa.similar(noun, {limit: count*2});
        if (similar && similar.length > 0) {
            // Filter for only nouns
            for (let word of similar) {
                if (RiTa.isNoun(word) && related.length < count) {
                    related.push(word);
                }
            }
        }
        
        // If we don't have enough, try to get some random nouns
        if (related.length < count) {
            const needed = count - related.length;
            for (let i = 0; i < needed; i++) {
                const randomNoun = RiTa.randomWord({ pos: "nn" });
                related.push(randomNoun);
            }
        }
    } catch (e) {
        console.log('Error getting related nouns:', e);
        // Fallback: just generate random nouns
        for (let i = 0; i < count; i++) {
            related.push(RiTa.randomWord({ pos: "nn" }));
        }
    }
    
    return related;
}

// HELPER FUNCTION TO CREATE WORD ELEMENTS WITH FADE EFFECT ---------------------------------------------------------------
function createWordElements(wish) {
    const words = wish.split(' ');
    const container = document.createElement('div');
    container.style.opacity = 1;
    container.style.display = 'flex';
    container.style.flexDirection = 'column-reverse'; // Stack elements from bottom to top
    container.style.alignItems = 'center';
    container.style.height = '100%';
    container.style.position = 'relative';

    // Parse words to identify nouns
    const tags = RiTa.pos(words);

    // RIPPLE WORDS APPEARING FROM BOTTOM TO TOP -------------------------------------------------------------------------
    words.forEach((word, index) => {
        const wordGroup = document.createElement('div');
        wordGroup.style.position = 'relative';
        wordGroup.style.marginBottom = '20%'; // Space between stacked words
        wordGroup.style.display = 'block';
        wordGroup.style.textAlign = 'center';
        wordGroup.style.width = '100%';
        
        // Create main word span
        const span = document.createElement('span');
        span.innerHTML = word;
        span.style.opacity = 0;
        span.style.display = 'inline-block';
        span.className = 'main-word';
        span.style.position = 'relative';
        span.style.zIndex = '5'; // Keep main word on top
        
        if (Math.random() < 0.3) {
            span.style.fontStyle = 'italic';
            span.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
        }
        
        // Add related nouns if this is a noun
        if (tags[index] && tags[index].startsWith('nn')) {
            const relatedNouns = getRelatedNouns(word);
            
            // Add related nouns around the main word
            relatedNouns.forEach((relatedNoun, relatedIndex) => {
                const relatedSpan = document.createElement('span');
                relatedSpan.innerHTML = relatedNoun;
                relatedSpan.style.opacity = 0;
                relatedSpan.style.position = 'absolute';
                relatedSpan.style.fontSize = '0.7em';
                relatedSpan.style.color = 'rgba(255, 255, 255, 0.7)';
                
                // Position the related noun around the main word
                const angle = (relatedIndex / relatedNouns.length) * Math.PI * 2;
                const distance = 60 + Math.random() * 40; // Random distance from center
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                relatedSpan.style.transform = `translate(${x}px, ${y}px) rotate(${Math.random() * 20 - 10}deg)`;
                
                // Fade in and out with slight delay compared to main word
                setTimeout(() => {
                    relatedSpan.style.transition = 'opacity 0.8s ease-in, filter 0.8s ease-in';
                    relatedSpan.style.opacity = 0.7;
                    relatedSpan.style.filter = 'blur(1px)';
                }, index * 500 + 150 + relatedIndex * 100);
                
                setTimeout(() => {
                    relatedSpan.style.opacity = 0;
                    relatedSpan.style.filter = 'blur(5px)';
                }, (index + 1) * 500 + 100 + relatedIndex * 50);
                
                wordGroup.appendChild(relatedSpan);
            });
        }
        
        // Add main word animation
        setTimeout(() => {
            span.style.transition = 'opacity 0.5s ease-in, filter 0.5s ease-in, font-size 0.5s ease-in';
            span.style.opacity = 1;
            span.style.filter = 'blur(0px)';
            span.style.fontSize = '1.1em';
        }, index * 500);

        // Increase blur and fade out after the transition
        setTimeout(() => {
            span.style.filter = 'blur(5px)';
            span.style.opacity = 0;
        }, (index + 1) * 500);
        
        wordGroup.appendChild(span);
        container.appendChild(wordGroup);
    });
    
    return container;
}

