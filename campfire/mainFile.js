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
    [ 
        "last night",
        "yesterday",
        "this morning"
    ],
    [
        " she's the one left to carry everything",
        "for my parents while I chase something far away",
        "it felt foreign",
        "familiar",
        "and distant",
        "I once dreamt of my dad",
        "growing old while I was overseas studying",
        "I dreamt that her laptop screen fell off",
        "onto the tracks",
        "and she leapt down to go grab it",
        "I was talking to a classmate from high school",
        "that I haven't spoken to since high school LOL",
        "but placed back in high school",
        "just chatting about if we did our English homework",
        "remember two Japanese brothel women in kimonos",
        "walking in seeing us",
        "Yeong-Yuh and I went on a trip somewhere",
        "with my family",
        "Mom calling us home at sunset",
        "The old treehouse where we played"
    ],
    [ 
        "I remember imagining the carnage",
        "her half body becoming muscle flesh and bone",
        "I was with the ex situationship",
        "and we were hanging out",
        "despite carrying memories",
        "of my college life",
        "I woke up with a heavy feeling",
        "like I had glimpsed a future I couldn't change",
        "we were back in our high school",
        "talking about assignments",
        "last night I dreamt that Alex",
        "gave me a clear plastic box of coke",
        "but they continue to enter the room",
        "onto the bed",
        "I remember screaming",
        "telling her to stop",
        "but within less than a minute",
        "a train came by and bulldozed her",
        "I didn't say it out loud",
        "but I felt guilty",
        "They're definitely doing something together",
        "which I try to ignore",
        "I cried to my parents in the dream",
        "not knowing what to say",
        "kind of dirty talked to me",
        "towards the end of the night",
        "Flying through cotton candy clouds",
    ],
    [ 
            "I told my sister about it",
            "over the phone",
            "but it had a pointy nose",
            "like a pointy triangle nose head",
            "The size of one of my suitcases",
            "It must've cost millions",
            "I had a dream we got sent to prison together",
            "Last night you appeared in my dream", 
            "you said you were getting a minor in Pokémon",
            "then like two of your friends were there",
            "one of them had really curly hair",
            "I had a dream I met Paul",
            "but he looked different",
            "like he had some plastic surgery",
            "they were talking to me in Chinese",
            "and I was confused",
            "I had a dream last night",
            "that you were smashing my phone screen LOL"
    ]
];

let dreamSequenceIndex = 0;
let dreamTextIndex = 0;

const mainTextWords = ["To love", "to share", "to text", "to dream"];
let mainTextIndex = 0;

const video = document.getElementById('video');
    const cameraSelect = document.getElementById('cameraSelect');

    // Step 1: List cameras
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      videoDevices.forEach((device, index) => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label || `Camera ${index + 1}`;
        cameraSelect.appendChild(option);
      });

      // Optional: Auto-start the first camera
      if (videoDevices.length > 0) {
        startCamera(videoDevices[0].deviceId);
      }
    });

    // Step 2: Start camera by deviceId
    function startCamera(deviceId) {
      navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } }
      }).then(stream => {
        video.srcObject = stream;
      }).catch(err => {
        console.error('Camera access error:', err);
      });
    }

    // Step 3: Handle selection change
    cameraSelect.onchange = () => {
      startCamera(cameraSelect.value);
    };

function mainTextChange(){

    const concretePoemWords = [
        "whisper", "dream", "light", "shadow", "echo", 
        "memory", "dance", "silence", "hope", "journey"
    ];

        const randomWord = concretePoemWords[Math.floor(Math.random() * concretePoemWords.length)];

}

function createDreamText() {
    // Randomly select a sub-array
    const randomSequenceIndex = Math.floor(Math.random() * dreams.length);
    const currentSequence = dreams[randomSequenceIndex];
    
    // Randomly select a text from the chosen sub-array
    const randomTextIndex = Math.floor(Math.random() * currentSequence.length);
    const text = currentSequence[randomTextIndex] || '';
    
    // Create container with document fragment
    const fragment = document.createDocumentFragment();
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

    // Create words with document fragment
    const wordsFragment = document.createDocumentFragment();
    const words = text.split(' ').filter(word => word.trim());
    
    words.forEach((word, index) => {
        const wordDiv = document.createElement('div');
        const alignments = ['left', 'center', 'right'];
        const randomAlignment = alignments[Math.floor(Math.random() * 3)];
        const baseRotationY = (Math.random() - 0.5) * 40;
        const baseRotationX = (Math.random() - 0.5) * 60;
        const translateZ = Math.random() * -50;
        const baseSize = 1.2 + (Math.random() * 0.6);
        const rotationSpeed = 0.5 + Math.random() * 0.5;

        wordDiv.textContent = word;
        wordDiv.style.cssText = `
            position: absolute;
            width: 100%;
            text-align: ${randomAlignment};
            color: rgba(254, 239, 165, 0.9);
            font-size: 1.2rem;
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
            will-change: transform, opacity;
        `;

        // Fade in each word with a delay
        setTimeout(() => {
            wordDiv.style.opacity = '1';
        }, index * 200);

        // Optimize animation using requestAnimationFrame
        let animationFrameId;
        const animateTransform = (currentTime) => {
            const elapsedTime = (currentTime - startTime) / 1000;
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
            
            animationFrameId = requestAnimationFrame(animateTransform);
        };
        
        let startTime = performance.now();
        animationFrameId = requestAnimationFrame(animateTransform);
        
        // Store animation ID for cleanup
        wordDiv.dataset.animationId = animationFrameId;
        
        // Add blur animation
        let blurValue = 1;
        const blurInterval = setInterval(() => {
            blurValue += 0.1;
            wordDiv.style.filter = `blur(${blurValue}px)`;
            if (blurValue >= 3) {
                clearInterval(blurInterval);
            }
        }, 1000);

        // Store blur interval for cleanup
        wordDiv.dataset.blurInterval = blurInterval;
        
        wordsFragment.appendChild(wordDiv);
    });

    container.appendChild(wordsFragment);
    fragment.appendChild(container);
    document.body.appendChild(fragment);

    // Animation
    let bottom = 0;
    const moveSpeed = 0.75;
    let animationFrameId;
    let fadeOutTimeout;

    const cleanup = () => {
        // Cancel all animation frames
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        
        // Cancel all word animations
        container.querySelectorAll('div').forEach(word => {
            if (word.dataset.animationId) {
                cancelAnimationFrame(parseInt(word.dataset.animationId));
            }
            if (word.dataset.blurInterval) {
                clearInterval(parseInt(word.dataset.blurInterval));
            }
        });
        
        // Remove the container from DOM
        if (container.parentNode) {
            container.remove();
        }
        
        // Clear any pending timeouts
        if (fadeOutTimeout) {
            clearTimeout(fadeOutTimeout);
        }
    };

    const animate = () => {
        bottom += moveSpeed;
        container.style.bottom = `${window.innerHeight * 0.2 + bottom}px`;
        
        if (bottom > window.innerHeight + 100) {
            cleanup();
            return;
        }

        animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Fade out after 10 seconds
    fadeOutTimeout = setTimeout(() => {
        const words = container.querySelectorAll('div');
        let fadeComplete = true;
        
        words.forEach(word => {
            word.style.transition = 'opacity 3s ease-out';
            word.style.opacity = '0';
            
            // Add event listener to check when fade is complete
            word.addEventListener('transitionend', () => {
                fadeComplete = fadeComplete && word.style.opacity === '0';
                if (fadeComplete) {
                    cleanup();
                }
            });
        });
        
        // Fallback cleanup in case transitionend doesn't fire
        setTimeout(cleanup, 5000);
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
let soundtrack2 = null;
let audioLoaded = false;
let lastFaceCheck = 0;
const FACE_CHECK_INTERVAL = 2000; // Check every 2 seconds instead of 1

function initializeSound() {
    // Main soundtrack
    backgroundSound = new Audio('campfire.mp3');
    backgroundSound.loop = true;
    backgroundSound.volume = 0.2;
    
    // Second soundtrack
    soundtrack2 = new Audio('fire.mp3');
    soundtrack2.loop = true;
    soundtrack2.volume = 0.8;

    // Add event listeners for loading
    const audioElements = [backgroundSound, soundtrack2];
    let loadedCount = 0;

    audioElements.forEach(audio => {
        audio.addEventListener('canplaythrough', () => {
            loadedCount++;
            if (loadedCount === audioElements.length) {
                audioLoaded = true;
                console.log('All audio files loaded successfully');
            }
        });

        audio.addEventListener('error', (e) => {
            console.error('Error loading audio:', e);
        });
    });
}

function checkFacePresence() {
    const currentTime = Date.now();
    if (currentTime - lastFaceCheck < FACE_CHECK_INTERVAL) return;
    lastFaceCheck = currentTime;

    // Check if handsfree is initialized and has face data
    if (handsfree && handsfree.data && handsfree.data.facemesh) {
        const hasFace = handsfree.data.facemesh.multiFaceLandmarks && 
                       handsfree.data.facemesh.multiFaceLandmarks.length > 0;
        
        const timeSinceLastTransition = currentTime - lastTransitionTime;
        
        // Don't check if we're in cooldown period
        if (timeSinceLastTransition < TRANSITION_COOLDOWN) {
            return;
        }
        
        if (hasFace && isFadedToBlack && !isTransitioning) {
            console.log('Face detected while faded to black, preparing to fade in...');
            startTransition(() => fadeToVideo(), FADE_IN_DURATION);
        } else if (!hasFace && !isFadedToBlack && !isTransitioning) {
            console.log('No face detected, preparing to fade out...');
            startTransition(() => fadeToBlack(), FADE_DURATION);
            canSpawnWords = false;
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
        
        // Play both soundtracks when video is visible
        if (audioLoaded) {
            if (backgroundSound) {
                backgroundSound.play().catch(error => {
                    console.log('Soundtrack 1 playback failed:', error);
                });
            }
            if (soundtrack2) {
                soundtrack2.play().catch(error => {
                    console.log('Soundtrack 2 playback failed:', error);
                });
            }
        } else {
            console.log('Audio not fully loaded yet, retrying...');
            // Retry after a short delay
            setTimeout(() => {
                if (backgroundSound) backgroundSound.play().catch(console.error);
                if (soundtrack2) soundtrack2.play().catch(console.error);
            }, 1000);
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
    
    // Disable word spawning and pause soundtracks
    canSpawnWords = false;
    if (backgroundSound) {
        backgroundSound.pause();
    }
    if (soundtrack2) {
        soundtrack2.pause();
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
    console.log('Creating blink effect');
    const video = document.querySelector('video');
    const mainText = document.querySelectorAll('.mainText, .floating-dream');
    if (!video || !mainText || !canSpawnWords) return;

    // video.style.transition = 'opacity 0.2s cubic-bezier(0.215, 0.610, 0.355, 1.000)';
    // mainText.forEach(text => {
    //     text.style.transition = 'all 0.2s cubic-bezier(0.215, 0.610, 0.355, 1.000)';
    //     // Reset blur to 1px
    //     text.style.filter = 'blur(1px)';
    //     // Clear and restart blur animation
    //     if (text.dataset.blurInterval) {
    //         clearInterval(parseInt(text.dataset.blurInterval));
    //         let blurValue = 1;
    //         const blurInterval = setInterval(() => {
    //             blurValue += 0.1;
    //             text.style.filter = `blur(${blurValue}px)`;
    //             if (blurValue >= 3) {
    //                 clearInterval(blurInterval);
    //             }
    //         }, 1000);
    //         text.dataset.blurInterval = blurInterval;
    //     }
    // });
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

// Change the interval to be less frequent
setInterval(checkFacePresence, FACE_CHECK_INTERVAL);

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
