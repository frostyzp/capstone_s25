document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded'); // Debug log
    
    // Initialize variables
    let hasGeneratedWish1 = false;
    
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

    // Initialize the skipping rock as hidden initially
    const skippingRock = document.getElementById('skippingRock');
    if (skippingRock) {
        // We'll show this after the wish is submitted
        skippingRock.style.display = 'none';
    }

    // SUBMIT BUTTON ------------------------------------------------------------------------------------------------
    const submitButton = document.getElementById('submit-wish');
    submitButton.addEventListener('click', () => {
        requestOrientationPermission().then(() => {
            // Get the content from the wish input fields
            
            let wish1 = document.getElementById('wish-input').value;
            if (!wish1.startsWith("I wish for ")) {
                wish1 = "I wish for " + wish1;
                console.log('wish1:', wish1);
            }
            // Update the ripple content with the wishes
            // wishesRipple1.push(wish1);
    
            // document.getElementById('ripple-1').textContent = wish1;

            // change bg color
            document.body.style.backgroundColor = 'black';
            document.body.style.transition = 'background-color 1.5s ease-in-out';
            document.body.style.color = 'white';

            // The textarea for input is hidden as per the instructions
            document.getElementById('wish-input').style.display = 'none';

            //hide the submit button
            document.getElementById('submit-wish').style.display = 'none';

            // rock appears at the bottom of the screen
            document.getElementById('arrow').style.display = 'block';
            document.getElementById('skippingRock').style.display = 'block';

            // instructions
            const instructions = document.querySelector('.instructions');
            instructions.textContent = 'Skip your rock into the universe. Drag your rock to cast your wish.';
            instructions.style.opacity = 1; // Make it visible
            setTimeout(() => {
                instructions.classList.add('fade-out'); // Add fade-out class after 5 seconds
            }, 5000);
            
            // Add fade out class to container
            // container.classList.add('fade-out');
        });
    });

    // Listen for when the rock is moved using playhtml
    document.addEventListener('move', (e) => {
        console.log('Move event detected:', e.detail);
        
        // If the rock is moved beyond a certain point, trigger the ripple effect
        if (e.detail && e.detail.element && e.detail.element.id === 'skippingRock') {
            const element = e.detail.element;
            const rockPosition = element.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // If the rock is moved more than halfway up the screen, consider it "skipped"
            if (rockPosition.top < viewportHeight / 2) {
                const ripple1 = document.getElementById('ripple-1');
                if (!hasGeneratedWish1) {
                    const wish = generateWish('1');
                    const wordElements = createWordElements(wish);
                    console.log('wordElements:', wordElements);
                    ripple1.innerHTML = ''; // Clear previous content
                    ripple1.appendChild(wordElements);
                    hasGeneratedWish1 = true;
                    
                    // Provide visual feedback that the wish has been cast
                    element.style.opacity = 0.5;
                    setTimeout(() => {
                        element.style.opacity = 1;
                    }, 1000);
                }
                ripple1.style.opacity = 1;
            }
        }
    });

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
                        document.body.style.background = 'linear-gradient(to right, grey, black)';


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
                
                // Call the infinite poem function with the tilt values
                if (typeof handleDeviceTilt === 'function') {
                    handleDeviceTilt(gamma, beta);
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
});
    
    