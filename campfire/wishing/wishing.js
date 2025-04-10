// Add Rita.js library
const rita = document.createElement('script');
rita.src = "https://unpkg.com/rita@3.1.3/dist/rita.min.js";
document.head.appendChild(rita);

let wishesRipple1 = [];

// Add these variables at the top of your file with other declarations
let lastTriggerTime = 0;
const cooldownPeriod = 2000; // 2 seconds cooldown
let lastWish1 = '';
let isWish1Active = false;
let hasGeneratedWish1 = false;
let fadeDelay = 400;

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

    function handleGesture() {
        if (touchStartY - touchEndY > 50) { // Swipe up detected
            console.log('Swipe up detected');
            document.body.style.backgroundColor = "grey";

            const ripple1 = document.getElementById('ripple-1');

            const wish = generateWish('1');
            const wordElements = createWordElements(wish);
            console.log('wordElements:', wordElements);
            ripple1.innerHTML = ''; // Clear previous content
            ripple1.appendChild(wordElements);
            console.log('ripple1 words:', wordElements);

            hasGeneratedWish1 = true;
            // Change the background color
        }
    }
});



// Function to transform wish text through different tenses
function transformWish(inputText, rippleNumber) {
    // Parse the input text
    const words = RiTa.tokenize(inputText);
    const tags = RiTa.pos(words);
    let transformed = [];
    
    // Create three different tense versions
    const tenses = ['present', 'future', 'conditional'];
    
    words.forEach((word, i) => {
        if (tags[i].startsWith('vb')) {  // If it's a verb
            transformed.push({
                present: RiTa.conjugate(word, {tense: 'present'}),
                future: RiTa.conjugate(word, {tense: 'future'}),
                conditional: RiTa.conjugate(word, {tense: 'conditional'}),
                active: RiTa.conjugate(word, {tense: 'active'}) // Added active verb transformation
            });
        } else if (tags[i].startsWith('jj')) {  // If it's an adjective
            transformed.push({
                present: word,
                future: word,
                conditional: word
            });
        } else {  // Other words remain unchanged
            transformed.push({
                present: word,
                future: word,
                conditional: word
            });
        }
    });
    
    // Construct sentences in different tenses
    const presentTense = transformed.map(t => t.present).join(' ');
    const futureTense = transformed.map(t => t.future).join(' ');
    const conditionalTense = transformed.map(t => t.conditional).join(' ');
    
    // Add all versions to the appropriate ripple array
    if (rippleNumber === '1') {
        wishesRipple1.push(presentTense);
        wishesRipple1.push(futureTense);
        wishesRipple1.push(conditionalTense);
        
        // Return the appropriate tense based on how many times it's been called
        const currentLength = wishesRipple1.length;
        if (currentLength % 3 === 1) return presentTense;
        if (currentLength % 3 === 2) return futureTense;
        return conditionalTense;
    }
    
    return inputText; // Default return if not ripple1
}

// THE GRAMMAR FUNCTION ------------------------------------------------------------------------------------------
function generateWish(rippleNumber) {
    // Parse the user's input from the appropriate input field
    const userInput = rippleNumber === '1' ? document.getElementById('wish-input').value : '';

    // For rippleNumber 1, use the input for transformations
    if (rippleNumber === '1') {
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
        console.log('Transformed wish:', transformedWish); // Debug log
        
        // Add to appropriate array
        wishesRipple1.push(transformedWish);
        return transformedWish;
    }
}

// Function to add new wish when device is tilted
function addWish(rippleNumber) {
    console.log('addWish called with:', rippleNumber);
    const wish = generateWish(rippleNumber);
    console.log('Generated wish:', wish);
    
    const rippleDiv = document.getElementById(`ripple-${rippleNumber}`);
    if (rippleDiv) {
        rippleDiv.textContent = wish;
        rippleDiv.style.opacity = 1;
        rippleDiv.style.transition = 'opacity 0.5s ease-in';
    } else {
        console.error(`Ripple ${rippleNumber} element not found`);
    }
}

// Add this helper function to create word spans with fade-in effect
function createWordElements(wish) {
    const words = wish.split(' ');
    const container = document.createElement('div');
    container.style.opacity = 1;
    
    words.forEach((word, index) => {
        const span = document.createElement('span');
        span.innerHTML = word; // No line break here
        span.style.opacity = 0;
        span.style.transition = 'opacity 0.5s ease-in';
        span.style.marginRight = '10px'; // Add space between spans
        if (Math.random() < 0.3) {
            span.style.fontStyle = 'italic';
            span.style.display = 'inline-block'; // Allow spans to be inline-block for alignment
            span.style.textAlign = Math.random() < 0.5 ? 'left' : 'right'; // Randomly align left or right
            span.style.transform = `rotate(15deg) skew(15deg)`; // Tilt and rotate
        } else {
            span.style.transform = `rotate(-15deg) skew(-15deg)`; // Reset tilt and rotation
        }
        // Delay each word's fade in
        setTimeout(() => {
            span.style.opacity = 1;
        }, index * fadeDelay); // 200ms delay between each word
        container.appendChild(span);
    });
    
    return container;
}

