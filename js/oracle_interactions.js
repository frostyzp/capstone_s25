// Perplexity 
// source https://www.perplexity.ai/search/im-coding-a-website-in-html-cs-PMEpTJIQQLG_3EKWtVcBaQ

// source https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
// Detecting a finger swipe

// document.addEventListener('touchstart', handleTouchStart, false);        
// document.addEventListener('touchmove', handleTouchMove, false);

const eightBallMessages = [
    "It is certain – go touch grass.",
    "It is decidedly so – go befriend a tree.",
    "Without a doubt – go lie on the grass and stare at the sky.",
    "Yes, definitely – go hug a tree.",
    "You may rely on it – take a deep breath of fresh air.",
    "As I see it, yes – listen to the wind in the leaves.",
    "Most likely – follow a butterfly.",
    "Outlook good – go chase the sun.",
    "Yes – listen to the oceanwaves.",
    "Signs point to yes – dip your feet in a stream.",
    "Reply hazy, try again – let the breeze decide.",
    "Ask again later – take a walk until you forget the question.",
    "Better not tell you now – look at the clouds above you instead.",
    "Cannot predict now – wait for the wind's answer.",
    "Concentrate and ask again – but first, touch the earth.",
    "Don't count on it – go count some clouds instead.",
    "My reply is no – go watch the waves crash.",
    "My sources say no – go touch some tree bark.",
    "Outlook not so good – plant something and see what grows.",
    "Very doubtful – go listen to the birds anyway."
];

let hasPermission = false;
let hasTiltTriggered = false;

// Initialize elements in a circle
function initializeElements() {
    console.log('Initializing elements');
    const container = document.querySelector('.elements-container');
    if (!container) {
        console.log('ERROR: Elements container not found');
        return;
    }

    container.innerHTML = '';

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const radius = Math.min(viewportWidth, viewportHeight) * 0.3;

    elements.forEach((element, index) => {
        const div = document.createElement('div');
        div.className = 'element';
        div.innerHTML = element.symbol.replace(/\n/g, '<br>');
        div.dataset.name = element.name;
        div.style.cursor = 'pointer';

        const angle = (index / elements.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        div.style.position = 'absolute';
        div.style.left = `calc(50% + ${x}px)`;
        div.style.top = `calc(50% + ${y}px)`;
        div.style.transform = 'translate(-50%, -50%)';

        div.addEventListener('click', () => {
            console.log('Element clicked:', element);
            handleElementSelection(element);
        });
        
        container.appendChild(div);
    });
    
    console.log('Elements initialized:', elements.length);
}

function handleElementSelection(element) {
    console.log('Element selected:', element);
    selectedElement = element;
    const continueButton = document.querySelector('.continue-button');
    if (continueButton) {
        continueButton.classList.remove('hidden');
    }
}

// Request device motion permission
async function requestPermission() {
    try {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            try {
                const permission = await DeviceMotionEvent.requestPermission();
                if (permission === 'granted') {
                    hasPermission = true;
                    startTiltDetection();
                }
            } catch (error) {
                console.error('Permission error:', error);
            }
        } else {
            // For non-iOS devices
            hasPermission = true;
            startTiltDetection();
        }
    } catch (error) {
        console.error('Error requesting permission:', error);
    }
}

function startTiltDetection() {
    window.addEventListener('deviceorientation', handleOrientation);
}

let revealedWords = {
    left: 0,  // Number of words revealed by left tilt
    right: 0  // Number of words revealed by right tilt
};

function handleOrientation(event) {
    if (!hasPermission) return;

    const gamma = event.gamma; // Left-right tilt (-90 to 90)
    const oracleWrapper = document.querySelector('.oracle_wrapper');
    if (!oracleWrapper) return;

    // Update background color based on tilt
    const tiltIntensity = Math.abs(gamma) / 90; // 0 to 1
    const baseColor = 34; // Dark gray base (from #222222)
    const targetColor = 255; // White target
    const colorValue = Math.floor(baseColor + (targetColor - baseColor) * tiltIntensity);
    document.body.style.backgroundColor = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;

    // Get all word elements
    const words = document.querySelectorAll('.oracle-word');
    
    // Handle word visibility based on tilt
    words.forEach((word, index) => {
        const type = word.dataset.type;
        const isFirstPart = type === 'first';
        
        if (gamma < -15 && isFirstPart && !hasTiltTriggered) {
            // Tilt left - reveal next first part word
            if (index === revealedWords.left * 2) {
                word.style.opacity = '1';
                word.classList.add('oracleFadeIn');
                revealedWords.left++;
                hasTiltTriggered = true;
            }
        } else if (gamma > 15 && !isFirstPart && !hasTiltTriggered) {
            // Tilt right - reveal next second part word
            if (index === (revealedWords.right * 2) + 1) {
                word.style.opacity = '1';
                word.classList.add('oracleFadeIn');
                revealedWords.right++;
                hasTiltTriggered = true;
            }
        } else if (Math.abs(gamma) < 10) {
            // Reset tilt trigger when device is back to neutral position
            hasTiltTriggered = false;
        }
    });
}

// Initialize the oracle answer page
function initializeOracleAnswer() {
    console.log('Starting oracle answer initialization');
    const oracleAnswer = document.querySelector('.oracle_answer');
    if (!oracleAnswer) {
        console.log('ERROR: Oracle answer div not found');
        return;
    }

    // Reset revealed words counter
    revealedWords = {
        left: 0,
        right: 0
    };

    // Get a random message
    const randomIndex = Math.floor(Math.random() * eightBallMessages.length);
    const message = eightBallMessages[randomIndex];
    console.log('Creating message:', message);
    
    // Clear existing content
    oracleAnswer.innerHTML = '';
    
    // Split message into words and create word elements
    const words = message.split(' ');
    words.forEach((word, index) => {
        const wordElement = document.createElement('span');
        wordElement.className = 'oracle-word';
        wordElement.textContent = word + ' ';  // Add space after each word
        wordElement.dataset.index = index;
        wordElement.dataset.type = index % 2 === 0 ? 'first' : 'second';
        wordElement.style.opacity = '0'; // Start all words invisible
        oracleAnswer.appendChild(wordElement);
    });

    window.addEventListener('deviceorientation', handleOrientation);
}

function resetOracle() {
    initializeOracleAnswer();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Add event listener for question input
    const questionInput = document.querySelector('.question-input');
    const permissionButton = document.querySelector('.permission-button');
    
    if (questionInput) {
        // Handle input events
        questionInput.addEventListener('input', function() {
            permissionButton.classList.toggle('hidden', this.value.trim().length === 0);
        });

        // Handle key events to ensure spaces work
        questionInput.addEventListener('keydown', e => e.stopPropagation());
        questionInput.addEventListener('keyup', e => e.stopPropagation());
    }
    
    // Add permission button click handler
    if (permissionButton) {
        permissionButton.addEventListener('click', () => switchToPage('main-page'));
    }
    
    // Add continue button click handler
    const continueButton = document.querySelector('.continue-button');
    if (continueButton) {
        continueButton.addEventListener('click', function() {
            const questionPage = document.querySelector('.question-page');
            const mainPage = document.querySelector('.main-page');
            
            if (questionPage.classList.contains('visible')) {
                switchToPage('main-page');
                initializeOracleAnswer();
            } else if (mainPage.classList.contains('visible') && selectedElement) {
                this.classList.add('hidden');
                switchToPage('oracle-answer-page');
                initializeOracleAnswer();
                requestPermission();
            }
        });
    }

    // Initialize elements
    initializeElements();
    
    // Add event listener for ask again button
    const askAgainBtn = document.querySelector('.ask-again-button');
    if (askAgainBtn) {
        askAgainBtn.addEventListener('click', resetOracle);
    }
});

function disableUserScroll() {
    document.body.style.overflow = "hidden";
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventArrowScroll);
}

function preventScroll(event) {
    event.preventDefault();
}

function preventArrowScroll(event) {
    const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];
    if (keys.includes(event.key)) {
        event.preventDefault();
    }
}

// ASCII elements for selection
const elements = [
    { 
        symbol: `  _\\|/_
   /|\\ 
  / | \\
 /  |  \\
/___|___\\`, 
        name: 'grass' 
    },
    { 
        symbol: `   .--.
 .(    ).
(___.__)__)`, 
        name: 'cloud' 
    },
    { 
        symbol: `   ___
  /   \\
 /     \\
|       |
 \\     /
  \\___/`, 
        name: 'rock' 
    },
    { 
        symbol: `  ~ ~ ~
 ~ ~ ~ ~
~ ~ ~ ~ ~`, 
        name: 'water' 
    },
    { 
        symbol: `  (  )
 (    )
(      )
 \\    /
  \\__/`, 
        name: 'fire' 
    }
];

// Oracle messages
const oracleMessages = [
    "The winds whisper of change...",
    "A new path unfolds before you...",
    "The stars align in your favor...",
    "Patience will bring clarity...",
    "Trust your inner voice..."
];

let selectedElement = null;
let rotationCount = 0;
let lastRotation = 0;
let rotationThreshold = 45; // Increased threshold to 45 degrees
let lastRotationTime = 0;
let rotationCooldown = 1000; // 1 second cooldown between rotations
let rotationDirection = 0; // -1 for down, 1 for up, 0 for neutral
let baseBackgroundColor = '#222222'; // Starting dark background

function updateBackgroundColor() {
    const percent = (rotationCount / 5) * 20; // 20% per rotation
    const r = Math.floor(34 + (255 - 34) * (percent / 100));
    const g = Math.floor(34 + (255 - 34) * (percent / 100));
    const b = Math.floor(34 + (255 - 34) * (percent / 100));
    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

function showContent() {
    // Add console log for debugging
    console.log('showContent called');
    
    // Show main content
    const content = document.querySelector('.content');
    if (content) {
        console.log('Found content element, removing hidden class');
        content.classList.remove('hidden');
        
        // Force a reflow before adding visible class
        void content.offsetWidth;
        
        content.classList.add('visible');
    } else {
        console.log('Content element not found, but continuing execution');
        // Continue execution even if content element is not found
        return;
    }
}

function changeOracleColor() {
    const wrapper = document.querySelector('.oracle_wrapper');
    const currentClass = Array.from(wrapper.classList)
        .find(className => className.startsWith('oracle-color-'));
    
    // Remove current color class if it exists
    if (currentClass) {
        wrapper.classList.remove(currentClass);
    }
    
    // Get random number between 1 and 5
    const newColorNum = Math.floor(Math.random() * 5) + 1;
    wrapper.classList.add(`oracle-color-${newColorNum}`);
}

// Update markers array with more kaomojis
const outerMarkers = ['(｡•́︿•̀｡)', '(◕‿◕✿)', '(╯°□°）╯︵ ┻━┻', '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', '(ง •̀_•́)ง', '(ノಠ益ಠ)ノ彡┻━┻', '(づ｡◕‿‿◕｡)づ', '(っ◔◡◔)っ ♥', '(ﾉ´ヮ`)ﾉ*: ･ﾟ', '(◕ᴗ◕✿)', '(ﾉ◕ヮ◕)ﾉ*:･ﾟ', '(◕‿◕)'];
const innerMarkers = ['(´･ω･`)', '(｡♥‿♥｡)', '(╥﹏╥)', '(◠‿◠✿)', '(⊙_☉)', '(◑‿◐)', '(◕‿◕✿)', '(◠‿◠)'];

// Initialize markers in concentric circles
function initializeMarkers() {
    const markersContainer = document.querySelector('.markers-container');
    if (!markersContainer) return;
    
    // Clear existing markers
    markersContainer.innerHTML = '';
    
    // Create outer ring
    outerMarkers.forEach((symbol, index) => {
        const marker = document.createElement('div');
        marker.className = 'marker outer';
        marker.textContent = symbol;
        
        // Calculate position on outer circle
        const angle = (index / outerMarkers.length) * Math.PI * 2;
        const radius = window.innerWidth * 0.40; // 40% of viewport width
        
        const x = Math.cos(angle) * radius + 150;
        const y = Math.sin(angle) * radius + 150;
        
        marker.style.left = `${x - 20}px`;
        marker.style.top = `${y - 20}px`;
        
        marker.addEventListener('click', () => {
            requestPermission().then(() => {
                handleMarkerSelection(index, 'outer');
            }).catch((error) => {
                console.error('Permission error:', error);
                handleMarkerSelection(index, 'outer');
            });
        });
        
        markersContainer.appendChild(marker);
    });
    
    // Create inner ring
    innerMarkers.forEach((symbol, index) => {
        const marker = document.createElement('div');
        marker.className = 'marker inner';
        marker.textContent = symbol;
        
        // Calculate position on inner circle
        const angle = (index / innerMarkers.length) * Math.PI * 2;
        const radius = window.innerWidth * 0.25; // 25% of viewport width
        
        const x = Math.cos(angle) * radius + 150;
        const y = Math.sin(angle) * radius + 150;
        
        marker.style.left = `${x - 20}px`;
        marker.style.top = `${y - 20}px`;
        
        marker.addEventListener('click', () => {
            requestPermission().then(() => {
                handleMarkerSelection(index, 'inner');
            }).catch((error) => {
                console.error('Permission error:', error);
                handleMarkerSelection(index, 'inner');
            });
        });
        
        markersContainer.appendChild(marker);
    });
}

// Update selection handler to handle both rings
function handleMarkerSelection(index, ring) {
    const markersContainer = document.querySelector('.markers-container');
    const markers = document.querySelectorAll('.marker');
    const instructionText = document.querySelector('.instruction-text');
    
    markers.forEach((marker, i) => {
        if (marker.classList.contains(ring) && i === index) {
            marker.classList.add('selected');
        } else {
            marker.classList.remove('selected');
        }
    });
    
    // Fade out markers and instruction
    if (markersContainer) {
        markersContainer.style.opacity = '0';
        setTimeout(() => {
            markersContainer.style.display = 'none';
        }, 500);
    }
    if (instructionText) {
        instructionText.style.opacity = '0';
        setTimeout(() => {
            instructionText.style.display = 'none';
        }, 500);
    }
    
    // Initialize text cloud after marker selection
    setTimeout(() => {
        const result = initializeTextCloud();
        fragments = result.fragments;
        currentMessageId = result.currentMessageId;
    }, 600);
}

// Update DOM loaded event listener
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    initializeMarkers();
    showContent();
});

// Update the switchToPage function
function switchToPage(pageClass) {
    console.log('Switching to page:', pageClass);
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('visible');
    });
    
    // Show the target page
    const targetPage = document.querySelector('.' + pageClass);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('visible');
        console.log('Page switched successfully:', pageClass);
    } else {
        console.log('Target page not found:', pageClass);
    }
}


