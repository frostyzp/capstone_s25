// Add Rita.js library
const rita = document.createElement('script');
rita.src = "https://unpkg.com/rita@3.1.3/dist/rita.min.js";
document.head.appendChild(rita);

let wishesRipple1 = [];
let wishesRipple2 = [];
let wishesRipple3 = [];

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
                future: 'will ' + RiTa.conjugate(word, {tense: 'present'}),
                conditional: 'would ' + RiTa.conjugate(word, {tense: 'present'})
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
        window.addEventListener('deviceorientation', function(event) {
            const beta = event.beta;   // Rotation around the x-axis
            const gamma = event.gamma; // Rotation around the y-axis

            // // Reset all ripples to hidden
            // document.querySelectorAll('#ripple-1, #ripple-2, #ripple-3')
            //        .forEach(ripple => ripple.style.opacity = 0);

            // Generate new wishes based on device orientation
            if (gamma < -30) {
                document.body.style.backgroundColor = 'red';

                addWish('1');
            } else if (beta > 30) {
                addWish('2');
            } else if (gamma > 30) {
                addWish('3');
            }
        });
    } else {
        alert("Device orientation is not supported on your device.");
    }
}

// Request permission for device orientation
async function requestOrientationPermission() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
            // This is needed for iOS 13+ devices
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission === 'granted') {
                enableOrientationFeatures();
            } else {
                alert("hold your vessel gently, tilt and wait for the ripples to appear");
            }
        } catch (error) {
            console.error("Error requesting device orientation permission:", error);
        }
    } else {
        enableOrientationFeatures();
    }
}

