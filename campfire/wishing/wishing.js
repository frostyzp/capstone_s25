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

            const wish = generateWish(1);
            const wordElements = createWordElements(wish);
            
            console.log('wordElements:', wordElements);
            ripple1.innerHTML = ''; // Clear previous content
            ripple1.appendChild(wordElements);
            console.log('ripple1 words:', wordElements);

            hasGeneratedWish1 = true;
        }
    }
});

// THE GRAMMAR FUNCTION ------------------------------------------------------------------------------------------
function generateWish(rippleNum) {
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

