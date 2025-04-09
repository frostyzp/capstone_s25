// Add Rita.js library
const rita = document.createElement('script');
rita.src = "https://unpkg.com/rita@3.1.3/dist/rita.min.js";
document.head.appendChild(rita);

let wishesRipple1 = [];
let wishesRipple2 = [];
let wishesRipple3 = [];

// Add these variables at the top of your file with other declarations
let lastTriggerTime = 0;
const cooldownPeriod = 2000; // 2 seconds cooldown
let lastWish1 = '';
let lastWish2 = '';
let lastWish3 = '';
let isWish1Active = false;
let isWish2Active = false;
let isWish3Active = false;
let hasGeneratedWish1 = false;
let hasGeneratedWish2 = false;
let hasGeneratedWish3 = false;
let fadeDelay = 400;

// Add a button or trigger to request permission
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded'); // Debug log
    
    const debuggingButton = document.getElementById('debugging');
    console.log('Button element:', debuggingButton); // Debug log to check if button is found
    
    if (debuggingButton) {
        // Add visual feedback
        debuggingButton.style.backgroundColor = '#ccc';
        
        // Try all possible event listeners
        debuggingButton.onclick = function() {
            console.log('Direct onclick fired');
            debuggingButton.style.backgroundColor = 'red'; // Visual feedback
            addWish('1');
        };

        debuggingButton.addEventListener('mousedown', function() {
            console.log('Mousedown fired');
            debuggingButton.style.backgroundColor = 'blue';
            addWish('1');
        });

        debuggingButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('Touchstart fired');
            debuggingButton.style.backgroundColor = 'green';
            const ripple1 = document.getElementById('ripple-1');
            const ripple2 = document.getElementById('ripple-2');
            const wish = generateWish('1');
            const wordElements = createWordElements(wish);
            console.log('wordElements:', wordElements);
            ripple1.innerHTML = ''; // Clear previous content
            ripple1.appendChild(wordElements);
            console.log('ripple1 words:', wordElements);


            hasGeneratedWish1 = true;        });

        // Make sure addWish function exists and works
        console.log('addWish function:', typeof addWish); // Debug check
    } else {
        console.error("Debugging button not found.");
    }

    // Get the text area
    const wishInput = document.getElementById('wish-input');
            // document.getElementById('wish-input2').value = '';
            // document.getElementById('wish-input3').value = '';

    // Button to submit wishes
    const submitButton = document.getElementById('submit-wish');
    submitButton.addEventListener('click', () => {
        requestOrientationPermission().then(() => {
            // Get the content from the wish input fields
            const wish1 = document.getElementById('wish-input').value;
            const wish2 = document.getElementById('wish-input').value;
            const wish3 = document.getElementById('wish-input').value;

            // Update the ripple content with the wishes
            wishesRipple1.push(wish1);
            wishesRipple2.push(wish2);
            wishesRipple3.push(wish3);
            
            document.getElementById('ripple-1').textContent = wish1;
            document.getElementById('ripple-2').textContent = wish2;
            document.getElementById('ripple-3').textContent = wish3;

            // Clear any existing text
            wishInput.value = '';


            const instructions = document.querySelector('.instructions');
            instructions.textContent = 'Tilt your vessel to and observe the ripples – each wish a rock, a skip'; // Change the text content
            instructions.style.opacity = 1; // Make it visible
            setTimeout(() => {
                instructions.classList.add('fade-out'); // Add fade-out class after 5 seconds
            }, 5000);
            
            // Add fade out class to container
            container.classList.add('fade-out');
        });
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
    if (rippleNumber === '0') {
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
    } else {
        // For rippleNumber 2 and 3, generate a new wish
        let rules = {
            start: "$timeframe I $verb for $something",
            timeframe: "today | tomorrow | someday",
            verb: "hope | wish | dream | long",
            something: "$adj $noun",
            adj: RiTa.randomWord({ pos: "jj" }),
            noun: RiTa.randomWord({ pos: "nn" })
        };

        const generatedWish = RiTa.grammar(rules).expand();
        
        // Add to appropriate array
        if (rippleNumber === '2') {
            wishesRipple2.push(generatedWish);
        } else if (rippleNumber === '3') {
            wishesRipple3.push(generatedWish);
        }
        
        return generatedWish;
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


// Modifying the tilt detection 
function enableOrientationFeatures() {
if (window.DeviceOrientationEvent) {
        // Add a test event to check if we're getting real values
        let orientationTest = function(e) {
            console.log('Orientation Test:', {
                beta: e.beta,
                gamma: e.gamma
            });
            window.removeEventListener('deviceorientation', orientationTest);
        };
        window.addEventListener('deviceorientation', orientationTest);

        // Main orientation handler
    window.addEventListener('deviceorientation', function(event) {
            const beta = event.beta;
            const gamma = event.gamma;

        const ripple1 = document.getElementById('ripple-1');
        const ripple2 = document.getElementById('ripple-2');
        const ripple3 = document.getElementById('ripple-3');

            // Handle left tilt
            if (gamma < -15) {
                if (!hasGeneratedWish1) {
                    const wish = generateWish('1');
                    const wordElements = createWordElements(wish);
                    console.log('wordElements:', wordElements);
                    ripple1.innerHTML = ''; // Clear previous content
                    ripple1.appendChild(wordElements);
                    hasGeneratedWish1 = true;

                    // Apply a slight gradient to the background body color
                }
            ripple1.style.opacity = 1;
            } else {
                if (gamma > -5) {
                    // Fade out words in reverse order
                    const words = ripple1.getElementsByTagName('span');
                    Array.from(words).reverse().forEach((word, index) => {
                        setTimeout(() => {
                            word.style.opacity = 0;
                        }, index * 100);
                    });
                    hasGeneratedWish1 = false;
                }
            }

            // Handle forward tilt
            if (beta > 15) {
                if (!hasGeneratedWish2) {
                    const wish = generateWish('1');
                    const wordElements = createWordElements(wish);
                    ripple2.innerHTML = '';
                    ripple2.appendChild(wordElements);
                    hasGeneratedWish2 = true;
                }
            ripple2.style.opacity = 1;
            } else {
                if (beta < 5) {
                    const words = ripple2.getElementsByTagName('span');
                    Array.from(words).reverse().forEach((word, index) => {
                        setTimeout(() => {
                            word.style.opacity = 0;
                        }, index * 100);
                    });
                    hasGeneratedWish2 = false;
                }
            }

            // Handle right tilt
            if (gamma > 15) {
                if (!hasGeneratedWish3) {
                    const wish = generateWish('1');
                    const wordElements = createWordElements(wish);
                    ripple3.innerHTML = '';
                    ripple3.appendChild(wordElements);
                    hasGeneratedWish3 = true;
                }
            ripple3.style.opacity = 1;
            } else {
                if (gamma < 5) {
                    const words = ripple3.getElementsByTagName('span');
                    Array.from(words).reverse().forEach((word, index) => {
                        setTimeout(() => {
                            word.style.opacity = 0;
                        }, index * 100);
                    });
                    hasGeneratedWish3 = false;
                }
            }
        }, true);
    } else {
        console.log("DeviceOrientationEvent is not supported");
        alert("Device orientation is not supported on your device.");
    }
}

// Modify the permission request to be more robust
async function requestOrientationPermission() {
    console.log('Requesting orientation permission...');
    
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
            console.log('iOS device detected, requesting permission...');
            const permission = await DeviceOrientationEvent.requestPermission();
            console.log('Permission response:', permission);
            
            if (permission === 'granted') {
                console.log('Permission granted, enabling features...');
                enableOrientationFeatures();
            } else {
                alert("hold your vessel gently, tilt and watch the ripples appear");
            }
        } catch (error) {
            console.error("Error requesting device orientation permission:", error);
            // Fallback for errors
            enableOrientationFeatures();
        }
} else {
        console.log('Non-iOS device detected, enabling features directly...');
        enableOrientationFeatures();
    }
}

