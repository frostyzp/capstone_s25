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
    if (!wishInput) {
        console.error('Wish input not found');
        return;
    }

    // Initialize the skipping rock and arrow as hidden initially
    const skippingRock = document.getElementById('skippingRock');
    const arrow = document.getElementById('arrow');
    
    if (skippingRock) {
        skippingRock.style.display = 'none';
    }
    if (arrow) {
        arrow.style.display = 'none';
    }

    // SUBMIT BUTTON ------------------------------------------------------------------------------------------------
    const submitButton = document.getElementById('submit-wish');
    if (submitButton) {
        submitButton.addEventListener('click', () => {
            requestOrientationPermission().then(() => {
                // Get the content from the wish input fields
                let wish1 = document.getElementById('wish-input').value;
                if (!wish1.startsWith("I wish for ")) {
                    wish1 = "I wish for " + wish1;
                }
                
                // Switch to third page
                switchToPage('thirdPage');
                
                // Show rock and arrow in third page
                if (skippingRock) {
                    skippingRock.style.display = 'block';
                }
                if (arrow) {
                    arrow.style.display = 'block';
                }

                // Hide input and submit button
                document.getElementById('wish-input').style.display = 'none';
                document.getElementById('submit-wish').style.display = 'none';

                // Update instructions
                const instructions = document.querySelector('.instructions');
                if (instructions) {
                    instructions.textContent = 'Skip your rock into the universe. Drag your rock to cast your wish.';
                    instructions.style.opacity = 1;
                    setTimeout(() => {
                        instructions.classList.add('fade-out');
                    }, 5000);
                }
            });
        });
    }

    // Listen for when the rock is moved using playhtml
    document.addEventListener('move', (e) => {
        console.log('Move event detected:', e.detail);
        
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
                    ripple1.innerHTML = '';
                    ripple1.appendChild(wordElements);
                    hasGeneratedWish1 = true;
                    
                    // Provide visual feedback
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



                        // Add related nouns to the wish + recursive call
                        addRelatedNouns(word, 2); // Change 2 to the desired depth of recursion

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
    
    

 // Function to switch pages
 function switchToPage(pageClass) {
    document.querySelectorAll('.page').forEach(page => {
      page.classList.add('hidden');
      page.classList.remove('visible');
    });
    
    document.querySelector('.' + pageClass).classList.remove('hidden');
    document.querySelector('.' + pageClass).classList.add('visible');
  }
  
  // Add event listener to transition to second page
  document.getElementById('landingPageButton').addEventListener('click', function() {
    switchToPage('secondPage');
  });
  

  const gridContainer = document.createElement('div'); // Changed to 'div' for proper element creation
  gridContainer.style.display = 'grid';
  gridContainer.style.gridTemplateColumns = 'repeat(5, 1fr)'; // 5 columns
  gridContainer.style.gridTemplateRows = 'repeat(10, 1fr)'; // 10 rows
  gridContainer.style.width = '100%';
  gridContainer.style.height = '100%';
  gridContainer.style.position = 'relative';
  gridContainer.style.fontFamily = 'monospace'; // Use monospace for ASCII style
  gridContainer.style.whiteSpace = 'pre'; // Preserve whitespace for ASCII art
  gridContainer.style.zIndex = '-3'; // Change color as needed
  gridContainer.style.opacity = '0.2'; // Change color as needed
  gridContainer.style.paddingBottom = '100px'; // Change color as needed
  gridContainer.style.animation = 'background_ascii_animation 3s steps(2) infinite'; // Fixed animation property

  // Keyframes should be defined in a style tag or CSS file, not inline
  const style = document.createElement('style');
  style.textContent = `
    @keyframes background_ascii_animation {
      0% {
        opacity: 0.2;
        transform: perspective(500px) rotateX(60deg) translateX(0); // Added perspective and rotation here
      }
      50% {
        opacity: 0.1;
        transform: perspective(500px) rotateX(59deg) translateX(1px); // Added perspective and rotation here
      }
      100% {
        opacity: 0.2;
        transform: perspective(500px) rotateX(60deg) translateX(0); // Added perspective and rotation here
      }
    }
  `;
  document.head.appendChild(style); // Append the style to the document head

  for (let i = 0; i < 100; i++) { // 100 cells for a 10x10 grid
      const cell = document.createElement('div');
      cell.style.textAlign = 'center';
      cell.style.fontSize = '0.6rem';
      cell.style.color = 'white'; // Change color as needed
      cell.textContent = (i % 2 === 0) ? '///////' : '^- ^- ^--^'; // Alternating pattern
      gridContainer.appendChild(cell);
  }

  document.getElementById('ripple-container').appendChild(gridContainer);


  // Wait for DOM to be fully loaded
  $(document).ready(function() {
    console.log('Initializing textillate...');
    
    // Initialize textillate for skipping rock
    $('.skippingRockText, #landingPageButton').textillate({
      initialDelay: 0,
      autoStart: true,
      in: {
        effect: 'rotateIn',
        delay: 20,
        shuffle: true,
        sync: false
      },
      loop: false,
      callback: function() {
        console.log('Textillate animation completed');
      }
    });
  });