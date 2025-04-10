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

    // SUBMIT BUTTON ------------------------------------------------------------------------------------------------
    const submitButton = document.getElementById('submit-wish');
    submitButton.addEventListener('click', () => {
        requestOrientationPermission().then(() => {
            // Get the content from the wish input fields
            const wish1 = document.getElementById('wish-input').value;

            // Update the ripple content with the wishes
            wishesRipple1.push(wish1);
            
            document.getElementById('ripple-1').textContent = wish1;


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
    
    