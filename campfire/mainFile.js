let wordArray = []
let wordCounter = 0;
let windowCounter = 0;

let openedWindow = null;

const widths = [250]; // Set both widths to just above 1/4 of the width
const heights = [300]; // Set both heights to just above 1/4 of the height

const lefts = [
    0, 
    window.innerWidth / 7, 
    (window.innerWidth * 2) / 7, 
    (window.innerWidth * 3) / 7, 
    (window.innerWidth * 4) / 7, 
    (window.innerWidth * 5) / 7, 
    (window.innerWidth * 6) / 7,
    0, 
    window.innerWidth / 7, 
    (window.innerWidth * 2) / 7, 
    (window.innerWidth * 3) / 7, 
    (window.innerWidth * 4) / 7, 
    (window.innerWidth * 5) / 7, 
    (window.innerWidth * 6) / 7
];
const tops = [
    window.innerHeight * 0.45,  // Top left
    window.innerHeight * 0.35,  // Bottom left
    window.innerHeight * 0.25,  // Top middle
    window.innerHeight * 0.3,   // Bottom middle
    window.innerHeight * 0.25,  // Top right
    window.innerHeight * 0.35,  // Bottom right
    window.innerHeight * 0.45,  // Top far right --------------------------
    window.innerHeight * 0.65,  // Bottom far right
    window.innerHeight * 0.75,  // Top far right (going down)
    window.innerHeight * 0.65,  // Bottom far right (going up)
    window.innerHeight * 0.55,  // Top far right (going down)
    window.innerHeight * 0.65,  // Bottom far right (going up)
    window.innerHeight * 0.75,  // Top far right (going down)
    window.innerHeight * 0.65,  // Bottom far right (going up)
];

let storyAudio = [ ];
let currentStoryIndex = 0;


let openedWindows = []; // Array to keep track of opened windows

// Add this at the top of your file with other declarations
const dreams = [
    [ // Dream sequence 1 - Lost Love
        "I still see | your | smile in my dreams",
        "The way you used to look at me",
        "Remember when we danced under stars?",
        "Your laugh echoes in empty rooms"
    ],
    [ // Dream sequence 2 - Childhood Memories
        "Running through summer fields",
        "Ice cream melting on hot sidewalks",
        "Mom calling us home at sunset",
        "The old treehouse where we played"
    ],
    [ // Dream sequence 3 - Future Hopes
        "Cities made of starlight",
        "Flying through cotton candy clouds",
        "Gardens that bloom forever",
        "Doors that open to anywhere"
    ],
    [ // Dream sequence 4 - Abstract/Surreal
        "Time flows backwards like honey",
        "The moon speaks in whispers",
        "Butterflies made of stained glass",
        "Piano keys playing themselves"
    ]
];

let dreamSequenceIndex = 0;
let dreamTextIndex = 0;

const mainTextWords = ["To love", "to share", "to text", "to dream"];
let mainTextIndex = 0;

function mainTextChange(){

    const concretePoemWords = [
        "whisper", "dream", "light", "shadow", "echo", 
        "memory", "dance", "silence", "hope", "journey"
    ];

        const randomWord = concretePoemWords[Math.floor(Math.random() * concretePoemWords.length)];

}

function createDreamText() {
    if (dreamSequenceIndex >= dreams.length) dreamSequenceIndex = 0;
    if (dreamTextIndex >= dreams[dreamSequenceIndex].length) dreamTextIndex = 0;

    const text = dreams[dreamSequenceIndex][dreamTextIndex] || '';
    
    // Increment indices
    dreamTextIndex = (dreamTextIndex + 1) % dreams[dreamSequenceIndex].length;
    if (dreamTextIndex === 0) {
        dreamSequenceIndex = (dreamSequenceIndex + 1) % dreams.length;
    }

    // Create container
    const container = document.createElement('div');
    container.className = 'dream-container';
    const randomX = Math.random() * (window.innerWidth - 300);
    container.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        perspective: 1000px;
        transform-style: preserve-3d;
        bottom: ${window.innerHeight * 0.2}px;
        left: ${randomX}px;
    `;

    // Create dream element
    const dreamElement = document.createElement('div');
    dreamElement.className = 'floating-dream';
    dreamElement.style.cssText = `
        position: absolute;
        width: 100%;
        color: rgba(254, 239, 165, 0.9);
        font-size: 1.2rem;
        transform-style: preserve-3d;
        perspective: 1000px;
    `;

    // Create and append words
    const fragment = document.createDocumentFragment();
    const words = text.split(' ').filter(word => word.trim());
    
    words.forEach((word, index) => {
        const wordDiv = document.createElement('div');
        const alignments = ['left', 'center', 'right'];
        const randomAlignment = alignments[Math.floor(Math.random() * 3)];
        const baseRotationY = (Math.random() - 0.5) * 40;
        const baseRotationX = (Math.random() - 0.5) * 60;
        const translateZ = Math.random() * -50;
        const baseSize = 1.2 + (Math.random() * 0.6);
        const rotationSpeed = 0.5 + Math.random() * 0.5; // Random rotation speed for each word

        wordDiv.textContent = word;
        wordDiv.style.cssText = `
            position: absolute;
            width: 100%;
            text-align: ${randomAlignment};
            transform: translateY(${index * 30}px) 
                       rotateY(${baseRotationY}deg) 
                       rotateX(${baseRotationX}deg) 
                       translateZ(${translateZ}px) 
                       scale(${baseSize});
            text-shadow: 0 0 10px rgba(255, 125, 26, 0.5), 0 0 20px rgba(255, 89, 0, 0.54);
            filter: blur(1px);
            transform-style: preserve-3d;
            opacity: 0;
            transition: opacity 0.5s ease-in;
        `;

        // Fade in each word with a delay
        setTimeout(() => {
            wordDiv.style.opacity = '1';
        }, index * 200);

        // Dynamic rotation and size animation
        let startTime = performance.now();
        const animateTransform = (currentTime) => {
            const elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds
            
            // Continuous rotation based on time
            const rotationY = baseRotationY + Math.sin(elapsedTime * rotationSpeed) * 30;
            const rotationX = baseRotationX + Math.cos(elapsedTime * rotationSpeed * 0.8) * 40;
            const scale = baseSize + Math.sin(elapsedTime * rotationSpeed * 1.2) * 0.05;
            
            wordDiv.style.transform = `
                translateY(${index * 30}px) 
                rotateY(${rotationY}deg) 
                rotateX(${rotationX}deg) 
                translateZ(${translateZ}px) 
                scale(${scale})
            `;
            
            requestAnimationFrame(animateTransform);
        };
        
        requestAnimationFrame(animateTransform);
        fragment.appendChild(wordDiv);
    });

    dreamElement.appendChild(fragment);
    container.appendChild(dreamElement);
    document.body.appendChild(container);

    // Animation
    let bottom = 0;
    const moveSpeed = 0.75;
    let animationFrameId;

    const animate = () => {
        bottom += moveSpeed;
        container.style.bottom = `${window.innerHeight * 0.2 + bottom}px`;
        
        // Keep animating until we reach the top
        if (bottom > window.innerHeight + 100) {
            cancelAnimationFrame(animationFrameId);
            container.remove();
            return;
        }

        animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Fade out after 10 seconds
    setTimeout(() => {
        const words = container.querySelectorAll('div');
        words.forEach(word => {
            word.style.transition = 'opacity 3s ease-out';
            word.style.opacity = '0';
        });
        
        // Remove container after fade out
        setTimeout(() => {
            container.remove();
        }, 5000);
    }, 15000);
}

// Add at the top of the file with other initialization code
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, setting up blink detection');
    
    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            console.log('Tab became visible - handleBlink triggered');
            handleBlink();
        }
    });

    // Also trigger on click for testing
    document.addEventListener('click', () => {
        console.log('Click detected - handleBlink triggered');
        handleBlink();
    });
});

let faceDetectionTimeout = null;
const FADE_DURATION = 5000; // 5 seconds for fade to black
const FADE_IN_DURATION = 2000; // 2 seconds for fade in when face detected
let isFadedToBlack = false;
let isTransitioning = false;
let lastTransitionTime = 0;
const TRANSITION_COOLDOWN = 10000; // 10 seconds cooldown between transitions
let lastBlinkTime = 0; // Track last blink time
const BLINK_COOLDOWN = 1000; // 1 second cooldown between blinks
let canSpawnWords = false; // Controls whether words can be spawned

function checkFacePresence() {
    // Check if handsfree is initialized and has face data
    if (handsfree && handsfree.data && handsfree.data.facemesh) {
        const hasFace = handsfree.data.facemesh.multiFaceLandmarks && 
                       handsfree.data.facemesh.multiFaceLandmarks.length > 0;
        
        const currentTime = Date.now();
        const timeSinceLastTransition = currentTime - lastTransitionTime;
        
        // Don't check if we're in cooldown period
        if (timeSinceLastTransition < TRANSITION_COOLDOWN) {
            return;
        }
        
        console.log(`Face detection: ${hasFace ? 'Face present' : 'No face'}`);
        
        if (hasFace && isFadedToBlack && !isTransitioning) {
            console.log('Face detected while faded to black, preparing to fade in...');
            startTransition(() => fadeToVideo(), FADE_IN_DURATION);
        } else if (!hasFace && !isFadedToBlack && !isTransitioning) {
            console.log('No face detected, preparing to fade out...');
            startTransition(() => fadeToBlack(), FADE_DURATION);
            canSpawnWords = false; // Disable word spawning when no face is detected
        }
    }
}

function startTransition(callback, duration) {
    if (isTransitioning) {
        console.log('Transition already in progress, skipping');
        return;
    }
    
    isTransitioning = true;
    
    // Clear any existing timeout
    if (faceDetectionTimeout) {
        clearTimeout(faceDetectionTimeout);
        faceDetectionTimeout = null;
    }
    
    // Set new timeout
    faceDetectionTimeout = setTimeout(() => {
        callback();
        isTransitioning = false;
        lastTransitionTime = Date.now();
    }, duration);
}

function fadeToVideo() {
    console.log('Starting fade to video...');
    const video = document.querySelector('video');
    const body = document.body;
    const textContainer = document.querySelector('.awakening-text');
    
    if (!video) {
        console.error('Video element not found!');
        return;
    }
    
    // Fade out text if it exists
    if (textContainer) {
        textContainer.style.transition = `opacity ${FADE_IN_DURATION/1000}s ease-out`;
        textContainer.style.opacity = '0';
        setTimeout(() => textContainer.remove(), FADE_IN_DURATION);
    }
    
    // Ensure video is visible and at full opacity
    video.style.display = 'block';
    video.style.transition = `opacity ${FADE_IN_DURATION/1000}s ease-in`;
    video.style.opacity = '1';
    
    // Enable word spawning after fade in completes
    setTimeout(() => {
        canSpawnWords = true;
        console.log('Video fully visible, word spawning enabled');
    }, FADE_IN_DURATION);
    
    // Fade background to transparent
    body.style.transition = `background-color ${FADE_IN_DURATION/1000}s ease-in`;
    body.style.backgroundColor = 'transparent';
    
    // Update state
    isFadedToBlack = false;
}

function fadeToBlack() {
    console.log('Starting fade to black...');
    const video = document.querySelector('video');
    const body = document.body;
    
    if (!video) {
        console.error('Video element not found!');
        return;
    }
    
    // Disable word spawning
    canSpawnWords = false;
    
    // Fade out video
    video.style.transition = `opacity ${FADE_DURATION/1000}s ease-out`;
    video.style.opacity = '0';
    
    // Set black background
    body.style.transition = `background-color ${FADE_DURATION/1000}s ease-out`;
    body.style.backgroundColor = 'black';
    
    // Create and show the text
    const textContainer = document.createElement('div');
    textContainer.className = 'awakening-text';
    textContainer.textContent = 'the campfire of dreams';
    textContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: rgba(254, 239, 165, 0.9);
        font-size: 1.5rem;
        text-align: center;
        opacity: 0;
        transition: opacity ${FADE_DURATION/1000}s ease-in;
        text-shadow: 0 0 10px rgba(255, 125, 26, 0.5), 0 0 20px rgba(255, 89, 0, 0.54);
        z-index: 1000;
    `;
    
    document.body.appendChild(textContainer);
    
    // Force a reflow to ensure transitions start
    void body.offsetWidth;
    
    // Fade in the text
    textContainer.style.opacity = '1';
    
    // Update state
    isFadedToBlack = true;
}

// Add blink detection
function handleBlink() {
    const currentTime = Date.now();
    const timeSinceLastBlink = currentTime - lastBlinkTime;
    
    // Only process blinks if we're not in cooldown and not faded to black
    if (timeSinceLastBlink >= BLINK_COOLDOWN && !isFadedToBlack) {
        lastBlinkTime = currentTime;
        createBlinkEffect();
        
        // Only spawn words if video is fully visible
        if (canSpawnWords) {
            createDreamText();
        }
    }
}

function createBlinkEffect() {
    const video = document.querySelector('video');
    if (!video) return;
    
    // Set fast transition for blink effect
    video.style.transition = 'opacity 0.2s ease-in-out';
    
    // Briefly reduce opacity to 0.9
    video.style.opacity = '0.9';
    
    // Return to full opacity after a short delay
    setTimeout(() => {
        video.style.opacity = '1';
    }, 200);
}

// Check for face presence every second
setInterval(checkFacePresence, 1000);

  function spawnWords(){
    
    textSize(30);
    textAlign(CENTER, CENTER);
    fill(0);

    
    // add words from emptyWordArr 
    // wordArray.push(emptyWordArr[wordCounter]);
    // wordCounter = (wordCounter + 1) % emptyWordArr.length
    // print('wordCounter :' +wordCounter);
    // currentStoryIndex = (currentStoryIndex + 1) % emptyWordArr.length;
    // // openFloatingWindow();


// ------------------------------ WHERE TEXT IS INPUTTED ------------------------------
  const storyTextElement = document.querySelector('.mainText');
  const typewriter = new Typewriter(storyTextElement, {
      loop: false, 
      delay: 50,
      cursor: ''   
  });
//   typewriter.typeString(emptyWordArr[wordCounter]).start();
    
  }

  // ------------------------------ END OF SPAWN WORDS ------------------------------

// Function to get a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to close the first opened window
function closeFirstWindow() {
    if (openedWindows.length > 0) {
        const firstWindow = openedWindows[0];
        firstWindow.close(); // Close the first window
        openedWindows.shift(); // Remove the reference from the array
    }
}

// Function to close all popup windows
function closeAllPopupWindows() {
    openedWindows.forEach(window => {
        window.close(); // Close each window
    });
    openedWindows = []; // Clear the array
}
