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
        "last night",
        "yesterday",
        "remember when we danced under stars?",
        "this morning"
    ],
    [ // Dream sequence 2 - Childhood Memories
        " she's the one left to carry everything for my parents while I chase something far away",
        "it felt foreign, familiar, and distant",
        "I once dreamt of my dad growing old while I was overseas studying.",
        "I dreamt that her laptop screen fell off onto the tracks and she leapt down to go grab it.",
        "I was talking to a classmate from high school that I haven't spoken to since high school LOL",
        "but placed back in high school and just chatting abt if we did our English homework or not",
        "remember two Japanese brothel woman in kimonos walking in seeing us and saying",
        "Yeong-Yuh and I went on a trip somewhere with my family (I'm not sure where).",
        "Mom calling us home at sunset",
        "The old treehouse where we played"
    ],
    [ // Dream sequence 3 - Future Hopes
        "I remember imagining the carnage—her half body becoming muscle flesh and bone",
        "I was with the ex situationship and we were hanging out",
        "despite like carrying memories of my college life",
        "I woke up with a heavy feeling, like I had just glimpsed a future I couldn't change.",
        "and we were back in our hs but I was talking to her about assignments and high school related things",
        "last night I dreamt that Alex gave me an actual clear plastic box of coke.",
        "but they continue to enter the room onto the bed.",
        "I remember screaming and telling her to stop, but within less than a minute, a train came by and bulldozed her.",
        "I didn't say it out loud, but I felt guilty,",
        "They're definitely doing something together to which I try to ignore",
        "I cried to my parents in the dream, not knowing what to say.",
        "kind of dirty talked to me towards the end of the night,",        "Flying through cotton candy clouds",
    ],
    [ // Dream sequence 4 - Abstract/Surreal
            "I told my sister about it over the phone.",
            "but it had like a pointy nose like a pointy triangle nose head",
            "The size of one of my suitcases. It must've cost millions.",
            "\"I had a dream we go sent to prison tgt\"",
            "\"Last night you appeared in my dream and you said you were getting a minor in Pokémon\"",
            "then like two of your friends, were there and one of them that really curly hair",
            "\"I had a dream I met Paul but he looked different like he had some plastic surgery\"",
            "they were talking to me in Chinese and I was confused.",
            "\"I had a dream last night that you were smashing my phone screen LOL\""
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
    initializeSound();
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
const FADE_DURATION = 7000; // 5 seconds for fade to black
const FADE_IN_DURATION = 4000; // 2 seconds for fade in when face detected
let isFadedToBlack = false;
let isTransitioning = false;
let lastTransitionTime = 0;
const TRANSITION_COOLDOWN = 10000; // 10 seconds cooldown between transitions
let lastBlinkTime = 0; // Track last blink time
const BLINK_COOLDOWN = 1000; // 1 second cooldown between blinks
let canSpawnWords = false; // Controls whether words can be spawned
let backgroundSound = null;

function initializeSound() {
    backgroundSound = new Audio('campfire.mp3'); // Add sound file path here
    backgroundSound.loop = true;
    backgroundSound.volume = 0.5; // Set volume to 50%
}

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
    const introSvg = document.querySelector('.intro-svg');
    const overlay = document.querySelector('.fade-black-overlay');
    
    if (!video) {
        console.error('Video element not found!');
        return;
    }
    
    // Fade out overlay
    if (overlay) {
        overlay.classList.remove('active');
    }
    
    // Fade out text if it exists
    if (textContainer) {
        textContainer.style.transition = `opacity ${FADE_IN_DURATION/1000}s ease-out`;
        textContainer.style.opacity = '0';
        setTimeout(() => {
            if (textContainer.parentNode) textContainer.remove();
        }, FADE_IN_DURATION);
    }
    
    // Hide the SVG
    if (introSvg) {
        introSvg.classList.add('hidden');
    }
    
    // Ensure video is visible and at full opacity
    video.style.display = 'block';
    video.style.transition = `opacity ${FADE_IN_DURATION/1000}s ease-in`;
    video.style.opacity = '1';
    
    // Enable word spawning after fade in completes
    setTimeout(() => {
        canSpawnWords = true;
        console.log('Video fully visible, word spawning enabled');
        // Play background sound when video is visible
        if (backgroundSound) {
            backgroundSound.play().catch(error => {
                console.log('Audio playback failed:', error);
            });
        }
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
    let overlay = document.querySelector('.fade-black-overlay');
    
    if (!video) {
        console.error('Video element not found!');
        return;
    }
    
    // Create overlay if it doesn't exist
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'fade-black-overlay';
        document.body.appendChild(overlay);
    }
    // Show overlay
    setTimeout(() => {
        overlay.classList.add('active');
    }, 10); // allow DOM to register
    
    // Disable word spawning and pause sound
    canSpawnWords = false;
    if (backgroundSound) {
        backgroundSound.pause();
    }
    
    // Fade out video
    video.style.transition = `opacity ${FADE_DURATION/1000}s ease-out`;
    video.style.opacity = '0';
    
    // Set black background
    body.style.transition = `background-color ${FADE_DURATION/1000}s ease-out`;
    body.style.backgroundColor = 'black';
    
    // Create and show the text
    const textContainer = document.createElement('div');
    textContainer.className = 'awakening-text';
    textContainer.textContent = 'the intimacy around people you know appear in your dreams and sharing them with each other';
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

    // Only process blinks if we're not in cooldown, not faded to black, and video is fully visible
    if (timeSinceLastBlink >= BLINK_COOLDOWN && !isFadedToBlack && canSpawnWords) {
        lastBlinkTime = currentTime;
        createBlinkEffect();
        // Only spawn words if video is fully visible
        createDreamText();
    }
}

function swapRandomDivPositions(mainText, percent = 0.4) {
    const allElements = Array.from(mainText);
    const total = allElements.length;
    if (total < 2) return; // Not enough elements to swap

    const numToSwap = Math.max(1, Math.floor(total * percent));
    const selectedIndices = new Set();
    while (selectedIndices.size < numToSwap) {
        const idx = Math.floor(Math.random() * total);
        selectedIndices.add(idx);
    }
    const selected = Array.from(selectedIndices).map(idx => allElements[idx]).filter(Boolean);
    if (selected.length < 2) return; // Not enough valid elements to swap

    const selectedContent = selected.map(text => text.innerHTML);
    // Shuffle the selected content
    for (let i = selectedContent.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [selectedContent[i], selectedContent[j]] = [selectedContent[j], selectedContent[i]];
    }
    // Apply new content with fade effect only to selected
    selected.forEach((text, index) => {
        text.style.opacity = '0';
        setTimeout(() => {
            text.innerHTML = selectedContent[index];
            text.style.opacity = '1';
        }, 100);
    });
}

window.createBlinkEffect = function() {
    const video = document.querySelector('video');
    const mainText = document.querySelectorAll('.mainText, .floating-dream');
    if (!video || !mainText || !canSpawnWords) return;

    video.style.transition = 'opacity 0.2s cubic-bezier(0.215, 0.610, 0.355, 1.000)';
    mainText.forEach(text => {
        text.style.transition = 'all 0.2s cubic-bezier(0.215, 0.610, 0.355, 1.000)';
    });
    video.style.opacity = '0.85';

    // Swap 20% of div positions
    swapRandomDivPositions(mainText, 0.2);

    setTimeout(() => {
        video.style.opacity = '1';
        mainText.forEach(text => {
            text.style.transform = '';
        });
    }, 150);
};

// Check for face presence every second
setInterval(checkFacePresence, 1000);

// ASCII art animation frames
const asciiFrames = [
`  *     *        *      *\n    *        *      *\n*      (  .      )   *\n     )           (\n  (    *    *   )\n   *   (    )   *\n      (  *   )\n\n   WWWV .  .  *  WV\nWWWVU UWW-^^^ WWWV\n`,
`    *        *      *\n  *     *        *\n*      (  .      )   *\n     )           (\n  (    *    *   )\n   *   (    )   *\n      (  *   )\n\n   WWWV .  *  .  WV\nWWWVU UWW-^^^ WWWV\n`,
`  *     *        *      *\n    *        *      *\n*      (  .      )   *\n     )           (\n  (    *    *   )\n   *   (    )   *\n      (  *   )\n\n   WWWV *  .  .  WV\nWWWVU UWW-^^^ WWWV\n`
];
let asciiFrameIndex = 0;
let asciiInterval = null;

function showAsciiArt() {
    const container = document.getElementById('ascii-art-container');
    if (!container) return;
    container.textContent = asciiFrames[asciiFrameIndex];
    asciiFrameIndex = (asciiFrameIndex + 1) % asciiFrames.length;
}

function startAsciiArtAnimation() {
    if (asciiInterval) clearInterval(asciiInterval);
    asciiInterval = setInterval(() => {
        if (isFadedToBlack) {
            showAsciiArt();
        }
    }, 200);
}

function stopAsciiArtAnimation() {
    if (asciiInterval) clearInterval(asciiInterval);
    asciiInterval = null;
    const container = document.getElementById('ascii-art-container');
    if (container) container.textContent = '';
}

// Hook into fadeToBlack and fadeToVideo
const originalFadeToBlack = fadeToBlack;
fadeToBlack = function() {
    originalFadeToBlack.apply(this, arguments);
    startAsciiArtAnimation();
    showAsciiArt();
};
const originalFadeToVideo = fadeToVideo;
fadeToVideo = function() {
    originalFadeToVideo.apply(this, arguments);
    stopAsciiArtAnimation();
};
// Start/stop on load based on state
if (isFadedToBlack) {
    startAsciiArtAnimation();
    showAsciiArt();
} else {
    stopAsciiArtAnimation();
}
