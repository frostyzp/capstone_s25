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
            addWish('1');
        });

        // Make sure addWish function exists and works
        console.log('addWish function:', typeof addWish); // Debug check
    } else {
        console.error("Debugging button not found.");
    }

    // Get the text area
    const wishInput = document.getElementById('wish-input');


    // Button to submit wishes
    const submitButton = document.getElementById('submit-wish');
    submitButton.addEventListener('click', () => {
        requestOrientationPermission().then(() => {
            // Get the content from the wish input fields
            const wish1 = document.getElementById('wish-input').value;
            const wish2 = document.getElementById('wish-input2').value;
            const wish3 = document.getElementById('wish-input3').value;

            // Update the ripple content with the wishes
            wishesRipple1.push(wish1);
            wishesRipple2.push(wish2);
            wishesRipple3.push(wish3);
            
            document.getElementById('ripple-1').textContent = wish1;
            document.getElementById('ripple-2').textContent = wish2;
            document.getElementById('ripple-3').textContent = wish3;

            // Clear any existing text
            wishInput.value = '';
            document.getElementById('wish-input2').value = '';
            document.getElementById('wish-input3').value = '';

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

    container.addEventListener('touchstart', (event) => {
        touchStartY = event.changedTouches[0].screenY;
    });

    container.addEventListener('touchend', (event) => {
        touchEndY = event.changedTouches[0].screenY;
        handleGesture();
    });

    function handleGesture() {
        if (touchStartY - touchEndY > 50) { // Swipe up detected
            
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

// Modify the generateWish function
function generateWish(rippleNumber) {
    // Parse the user's input from the appropriate input field
    const userInput = document.getElementById(`wish-input${rippleNumber === '1' ? '' : rippleNumber}`).value;

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

// Modify the orientation handler
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
            const beta = event.beta;   // Rotation around x-axis (-180 to 180)
            const gamma = event.gamma; // Rotation around y-axis (-90 to 90)

            // Debug log orientation values
            console.log('Orientation:', {
                beta: beta?.toFixed(2),
                gamma: gamma?.toFixed(2)
            });

        // Get the ripple elements
        const ripple1 = document.getElementById('ripple-1');
        const ripple2 = document.getElementById('ripple-2');
        const ripple3 = document.getElementById('ripple-3');

            // Check if device is in roughly neutral position
            const isNeutral = Math.abs(gamma) < 20 && Math.abs(beta) < 20;
            
            if (isNeutral) {
                // Reset all ripples and flags when device returns to neutral
        ripple1.style.opacity = 0;
        ripple2.style.opacity = 0;
        ripple3.style.opacity = 0;
                isWish1Active = false;
                isWish2Active = false;
                isWish3Active = false;
                return;
            }

            // Only generate new wishes if enough time has passed
            const currentTime = Date.now();
            if (beta !== null && gamma !== null && currentTime - lastTriggerTime > cooldownPeriod) {
                if (gamma < -20 && !isWish1Active) { // Tilted left
                    console.log('Tilted left - generating new wish');
                    lastWish1 = generateWish('1');
                    isWish1Active = true;
                    isWish2Active = false;
                    isWish3Active = false;
                    lastTriggerTime = currentTime;
                } else if (beta > 20 && !isWish2Active) { // Tilted forward
                    console.log('Tilted forward - generating new wish');
                    lastWish2 = generateWish('2');
                    isWish1Active = false;
                    isWish2Active = true;
                    isWish3Active = false;
                    lastTriggerTime = currentTime;
                } else if (gamma > 20 && !isWish3Active) { // Tilted right
                    console.log('Tilted right - generating new wish');
                    lastWish3 = generateWish('3');
                    isWish1Active = false;
                    isWish2Active = false;
                    isWish3Active = true;
                    lastTriggerTime = currentTime;
                }
            }

            // Update display based on current tilt
            if (gamma < -20) {
                ripple1.textContent = lastWish1;
            ripple1.style.opacity = 1;
                ripple2.style.opacity = 0;
                ripple3.style.opacity = 0;
            } else if (beta > 20) {
                ripple2.textContent = lastWish2;
                ripple1.style.opacity = 0;
            ripple2.style.opacity = 1;
                ripple3.style.opacity = 0;
            } else if (gamma > 20) {
                ripple3.textContent = lastWish3;
                ripple1.style.opacity = 0;
                ripple2.style.opacity = 0;
            ripple3.style.opacity = 1;
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
                alert("hold your vessel gently, tilt and wait for the ripples to appear");
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

