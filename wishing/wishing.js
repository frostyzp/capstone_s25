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
    'rgb(255, 255, 255)'  // white
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
        '   /.  ~.  \\\n/. ~.    ~  \\\n\\.   ~.      /\n  ~  ~~ ~',
        '  ○ ◌ ○  \n◌  ○  ◌\n○ ◌ ○',
        ' ≈≈≈≈≈ \n≈≈≈≈≈≈≈\n ≈≈≈≈≈ ',
        '  ∿∿∿  \n∿∿∿∿∿∿∿\n  ∿∿∿  ',
        ' ≋≋≋≋≋ \n≋≋≋≋≋≋≋\n ≋≋≋≋≋ '
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

// Define mock data and state variables globally
const mockWishes = [
    {
        wish: "I dream of a treehouse where birds sing ancient melodies, feelings of wonder",
        skips: 13,
        date: "4/20/25"
    },
    {
        wish: "I dream of a garden where time stands still, feelings of peace", 
        skips: 17,
        date: "4/21/25"
    },
    {
        wish: "I dream of a cloud where rainbows are born, feelings of joy",
        skips: 29,
        date: "4/22/25"
    },
    {
        wish: "I dream of a moonlit lake where stars dance on ripples, feelings of serenity",
        skips: 14,
        date: "4/23/25"
    },
    {
        wish: "I dream of a forest clearing where fireflies paint stories, feelings of magic",
        skips: 24,
        date: "4/24/25"
    },
    {
        wish: "I dream of a barn peak where winds talk like cows, feelings of freedom",
        skips: 13,
        date: "4/25/25"
    },
    {
        wish: "I dream of a hidden cave where crystals hold memories, feelings of mystery",
        skips: 3,
        date: "4/26/25"
    }
];

let currentWishIndex = 0;
let wishes = [...mockWishes];

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Initialize background music
    const audio = document.createElement('audio');
    audio.src = '/wishing/ocean.mp3';
    audio.loop = true;
    audio.volume = 0.3;
    document.body.appendChild(audio);
    
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

    // Get DOM elements
    const viewWishesBtn = document.getElementById('view-wishes-btn');
    const wishesModal = document.getElementById('wishes-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const closeModalBtn = document.getElementById('close-modal');
    const wishesList = document.getElementById('wishes-list');
    const prevBtn = document.querySelector('.nav-arrow.prev');
    const nextBtn = document.querySelector('.nav-arrow.next');
    const submitButton = document.getElementById('submit-wish');
    const input1 = document.getElementById('wish-input-1');
    const input2 = document.getElementById('wish-input-2');
    const input3 = document.getElementById('wish-input-3');

    // Function to check if all inputs are filled
    function areAllInputsFilled() {
        return input1.value.trim() !== '' && 
               input2.value.trim() !== '' && 
               input3.value.trim() !== '';
    }

    // Function to update submit button visibility
    function updateSubmitButtonVisibility() {
        if (areAllInputsFilled()) {
            submitButton.classList.add('visible');
        } else {
            submitButton.classList.remove('visible');
        }
    }

    // Add input event listeners to all input fields
    [input1, input2, input3].forEach(input => {
        input.addEventListener('input', updateSubmitButtonVisibility);
    });

    // Set initial state
    submitButton.classList.remove('visible');

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
            
            // Play ocean sound
            const oceanSound = new Audio('/wishing/ocean.mp3');
            oceanSound.play().catch(e => console.error('Error playing sound:', e));
            
            // Trigger haptic feedback if supported
            if ('vibrate' in navigator) {
                navigator.vibrate(100);
            }

            // Animate the rock
            const rock = document.getElementById('skippingRock');
            
            // Reset any existing animations
            rock.classList.remove('throwing', 'reappearing');
            
            // Force a reflow to ensure the reset takes effect
            void rock.offsetWidth;
            
            // Start the throw animation
            rock.classList.add('throwing');
            
            // After throw animation completes, wait 3 seconds then fade in
            setTimeout(() => {
                rock.classList.remove('throwing');
                rock.classList.add('reappearing');
                
                // Don't remove the reappearing class - let it stay visible
                // The next swipe will reset it anyway
            }, 3000);
            
            const { lines } = generateSimplePoem(storedUserInput);
            console.log('Generated lines:', lines);
            
            // Calculate starting position based on velocity and distance
            const basePosition = 5; // Base starting position (5% from bottom)
            const velocityFactor = Math.min(Math.max(swipeVelocity * 500, -10), 20);
            const distanceFactor = Math.min(swipeDistance / 20, 20);
            const startPosition = basePosition + velocityFactor + distanceFactor;
            
            console.log('Text starting position:', startPosition);
            
            // Start the text animation with custom position
            createRipplingText(lines.slice(0, 7), startPosition);

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

    // Debug logging
    console.log('Modal elements:', {
        viewWishesBtn,
        wishesModal,
        modalOverlay,
        closeModalBtn,
        wishesList
    });

    function displayCurrentWish() {
        console.log('Displaying wish:', currentWishIndex, wishes[currentWishIndex]);
        if (!wishesList) return;

        if (wishes.length === 0) {
            wishesList.innerHTML = `
                <div class="wish-item">
                    <div class="wish-text">no wishes yet...</div>
                    <div class="wish-stats">
                        <span class="skipped-count">skipped<br>0 times</span>
                        <span class="found-date">found on<br>--/--/--</span>
                    </div>
                </div>`;
            return;
        }

        const wish = wishes[currentWishIndex];
        wishesList.innerHTML = `
            <div class="wish-item">
                <div class="wish-text">${wish.wish}</div>
                <div class="wish-stats">
                    <span class="skipped-count">skipped<br>${wish.skips} times</span>
                    <span class="found-date">found on<br>${wish.date}</span>
                </div>
            </div>`;
    }

    function formatDate(date) {
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const yy = String(date.getFullYear()).slice(-2);
        return `${mm}/${dd}/${yy}`;
    }

    function addWishToList(wishText) {
        const today = new Date();
        const wish = {
            wish: wishText,
            skips: Math.floor(Math.random() * 50) + 1,
            date: `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${String(today.getFullYear()).slice(-2)}`
        };
        wishes.push(wish);
        currentWishIndex = wishes.length - 1;
        console.log('Added new wish:', wish);
    }

    // Navigation event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Previous clicked, current index:', currentWishIndex);
            if (currentWishIndex <= 0) {
                currentWishIndex = wishes.length - 1; // Loop to end
            } else {
                currentWishIndex--;
            }
            displayCurrentWish();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Next clicked, current index:', currentWishIndex);
            if (currentWishIndex >= wishes.length - 1) {
                currentWishIndex = 0; // Loop to beginning
            } else {
                currentWishIndex++;
            }
            displayCurrentWish();
        });
    }

    // Modal open/close handlers
    if (viewWishesBtn) {
        viewWishesBtn.addEventListener('click', () => {
            console.log('Opening modal');
            if (wishesModal && modalOverlay) {
                wishesModal.classList.add('visible');
                modalOverlay.classList.add('visible');
                displayCurrentWish(); // Display current wish when modal opens
            }
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (wishesModal && modalOverlay) {
                wishesModal.classList.remove('visible');
                modalOverlay.classList.remove('visible');
            }
        });
    }

    // Form submission handler
    if (submitButton) {
        submitButton.addEventListener('click', () => {
            if (!areAllInputsFilled()) return; // Double check before submission
            
            const input1 = document.getElementById('wish-input-1').value;
            const input2 = document.getElementById('wish-input-2').value;
            const input3 = document.getElementById('wish-input-3').value;
            
            const wishText = `I dream of a ${input1} where ${input2} feelings of ${input3}`;
            addWishToList(wishText);
            switchToPage('thirdPage');
        });
    }
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
        container.appendChild(textContainer);
    }

    // Function to animate a line of text
    async function animateLine(line, lineIndex) {
        console.log('Animating line:', line);
        const lineElement = document.createElement('div');
        lineElement.className = 'lineElement'; // Add class for textillate
        lineElement.textContent = line;
        

        // Add slight delay before playing splash sound
        await new Promise(resolve => setTimeout(resolve, 300));
        const splashSound = new Audio('/wishing/water splash.mp3');
        splashSound.volume = 0.2; // Set volume to 30%
        splashSound.play().catch(e => console.error('Error playing splash sound:', e));
        
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
            transition: opacity 1s ease-out, width 1s ease, transform 10s ease, filter 5s ease;
            z-index: 3;
            transform: scale(1);
            filter: blur(0px);
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
            
            // Start scale animation
            setTimeout(() => {
                lineElement.style.transform = 'scale(1.1)';
            }, 50);
            
            // Start blur animation after 15 seconds
            setTimeout(() => {
                lineElement.style.filter = 'blur(2px)';
            }, 10000);
            
            // Fade out after 12 seconds
            setTimeout(() => {
                lineElement.style.transition = 'opacity 5s ease-out';
                lineElement.style.opacity = '0';
                
                // Remove element after fade out completes
                setTimeout(() => {
                    lineElement.remove();
                }, 5000);
            }, 25000);
        }, lineIndex * 400);

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
        // Add 1 second delay before starting the first line
        await new Promise(resolve => setTimeout(resolve, 1000));
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

// Add SVG filter support detection
function checkSVGFilterSupport() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    svg.appendChild(filter);
    document.body.appendChild(svg);
    
    const result = 'filter' in svg.style;
    document.body.removeChild(svg);
    return result;
}

// Apply appropriate effect based on support
function applyRippleEffect() {
    const textElements = document.querySelectorAll('.lineElement');
    if (checkSVGFilterSupport()) {
        textElements.forEach(element => {
            element.classList.remove('no-svg-filter');
        });
    } else {
        textElements.forEach(element => {
            element.classList.add('no-svg-filter');
        });
    }
}

// Call this when the page loads and when new text elements are added
document.addEventListener('DOMContentLoaded', function() {
    applyRippleEffect();
    
    // Debounce the observer callback
    let timeout;
    const observer = new MutationObserver((mutations) => {
        // Clear any pending timeouts
        if (timeout) {
            clearTimeout(timeout);
        }
        
        // Only process if we actually added nodes
        const hasNewNodes = mutations.some(mutation => 
            mutation.addedNodes.length > 0 && 
            Array.from(mutation.addedNodes).some(node => 
                node.classList && node.classList.contains('lineElement')
            )
        );
        
        if (hasNewNodes) {
            // Debounce the application of the effect
            timeout = setTimeout(() => {
                applyRippleEffect();
            }, 100);
        }
    });
    
    // Only observe the ripple container where text elements are added
    const rippleContainer = document.getElementById('ripple-container');
    if (rippleContainer) {
        observer.observe(rippleContainer, {
            childList: true,
            subtree: true
        });
    }
});