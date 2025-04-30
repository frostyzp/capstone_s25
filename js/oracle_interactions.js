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
        div.style.left = `${viewportWidth / 2 + x}px`;
        div.style.top = `${viewportHeight / 2 + y}px`;
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

function handleOrientation(event) {
    if (!hasPermission) return;

    const gamma = event.gamma; // Left-right tilt (-90 to 90)
    const oracleWrapper = document.querySelector('.oracle_wrapper');
    if (!oracleWrapper) return;

    // Get all word elements
    const words = document.querySelectorAll('.oracle-word');
    
    // Handle word visibility based on tilt
    words.forEach(word => {
        const type = word.dataset.type;
        const isFirstPart = type === 'first';
        
        if (gamma < -15 && isFirstPart) {
            // Tilt left - reveal first part
            word.style.opacity = '1';
        } else if (gamma > 15 && !isFirstPart) {
            // Tilt right - reveal second part
            word.style.opacity = '1';
        } else {
            // Reset opacity when not tilted
            word.style.opacity = '0';
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
        wordElement.textContent = word + ' ';
        wordElement.dataset.index = index;
        oracleAnswer.appendChild(wordElement);
    });

    // Add device orientation event listener
    window.addEventListener('deviceorientation', handleOrientation);
}

function handleOrientation(event) {
    const gamma = event.gamma; // Left-right tilt (-90 to 90)
    const words = document.querySelectorAll('.oracle-word');
    
    words.forEach(word => {
        const index = parseInt(word.dataset.index);
        // Alternate words based on index (even/odd)
        const isEven = index % 2 === 0;
        
        if (gamma < -15 && isEven) {
            // Tilt left - show even indexed words
            word.style.opacity = '1';
        } else if (gamma > 15 && !isEven) {
            // Tilt right - show odd indexed words
            word.style.opacity = '1';
        } else {
            // Reset opacity when not tilted
            word.style.opacity = '0';
        }
    });
}

// Reset the oracle
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
            if (this.value.trim().length > 0) {
                permissionButton.classList.remove('hidden');
            } else {
                permissionButton.classList.add('hidden');
            }
        });

        // Handle keydown events to ensure spaces work
        questionInput.addEventListener('keydown', function(e) {
            e.stopPropagation();
        });

        // Handle keyup events
        questionInput.addEventListener('keyup', function(e) {
            e.stopPropagation();
        });
    }
    
    // Add permission button click handler
    if (permissionButton) {
        permissionButton.addEventListener('click', function() {
            switchToPage('main-page');
        });
    }
    
    // Add continue button click handler
    const continueButton = document.querySelector('.continue-button');
    if (continueButton) {
        console.log('Continue button found');
        continueButton.addEventListener('click', function() {
            console.log('Continue button clicked');
            console.log('Selected element:', selectedElement);
            
            // Check which page is currently visible
            const questionPage = document.querySelector('.question-page');
            const mainPage = document.querySelector('.main-page');
            const oracleAnswerPage = document.querySelector('.oracle-answer-page');
            
            console.log('Question page visible:', questionPage.classList.contains('visible'));
            console.log('Main page visible:', mainPage.classList.contains('visible'));
            
            if (questionPage.classList.contains('visible')) {
                // If we're on the question page, go to main page
                console.log('Switching from question page to main page');
                switchToPage('main-page');
            } else if (mainPage.classList.contains('visible')) {
                if (selectedElement) {
                    console.log('Switching from main page to oracle answer page');
                    // Hide the continue button
                    this.classList.add('hidden');
                    // Switch to oracle answer page
                    switchToPage('oracle-answer-page');
                    // Initialize the oracle answer
                    console.log('About to initialize oracle answer');
                    initializeOracleAnswer();
                    // Request permission for device motion
                    requestPermission();
                } else {
                    console.log('No element selected');
                }
            } else {
                console.log('Neither question page nor main page is visible');
            }
        });
    } else {
        console.log('Continue button not found');
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

// Perlin noise implementation
class PerlinNoise {
    constructor() {
        this.grad3 = [
            [1,1,0], [-1,1,0], [1,-1,0], [-1,-1,0],
            [1,0,1], [-1,0,1], [1,0,-1], [-1,0,-1],
            [0,1,1], [0,-1,1], [0,1,-1], [0,-1,-1]
        ];
        this.p = new Array(256);
        this.perm = new Array(512);
        this.seed();
    }

    seed() {
        // Initialize p array
        for (let i = 0; i < 256; i++) {
            this.p[i] = i;
        }
        
        // Shuffle p array
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.p[i], this.p[j]] = [this.p[j], this.p[i]];
        }
        
        // Initialize perm array
        for (let i = 0; i < 512; i++) {
            this.perm[i] = this.p[i & 255];
        }
    }

    noise2D(x, y) {
        // Find unit square that contains point
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        
        // Find relative x,y of point in square
        x -= Math.floor(x);
        y -= Math.floor(y);
        
        // Compute fade curves for x,y
        const u = this.fade(x);
        const v = this.fade(y);
        
        // Hash coordinates of the corners
        const A = this.perm[X] + Y;
        const B = this.perm[X + 1] + Y;
        
        // Add blended results from corners
        return this.lerp(v,
            this.lerp(u,
                this.grad(this.perm[A], x, y),
                this.grad(this.perm[B], x - 1, y)),
            this.lerp(u,
                this.grad(this.perm[A + 1], x, y - 1),
                this.grad(this.perm[B + 1], x - 1, y - 1)));
    }

    fade(t) { 
        return t * t * t * (t * (t * 6 - 15) + 10); 
    }

    lerp(t, a, b) { 
        return a + t * (b - a); 
    }

    grad(hash, x, y) {
        const h = hash & 15;
        const grad = this.grad3[h % this.grad3.length];
        return grad[0] * x + grad[1] * y;
    }
}

// Initialize Perlin noise
const perlin = new PerlinNoise();

// Fragment class to manage individual text fragments
class TextFragment {
    constructor(element, baseX, baseY, type, messageId, textContent) {
        this.element = element;
        this.baseX = baseX;
        this.baseY = baseY;
        this.time = Math.random() * 1000;
        this.speed = (0.1 + Math.random() * 0.3) * 0.3; // Much slower base speed
        this.opacityRange = {
            min: 0.1 + Math.random() * 0.15,
            max: 0.3 + Math.random() * 0.2
        };
        this.size = 16 + Math.random() * 12;
        this.skew = -20 + Math.random() * 40;
        this.type = type;
        this.messageId = messageId;
        this.textContent = textContent;
        this.highlightTimeout = null;
        this.orbitRadius = 20 + Math.random() * 30; // Random orbit radius between 20-50px
        this.orbitSpeed = 0.1 + Math.random() * 0.3; // Much slower orbit speed
        
        this.element.style.fontSize = `${this.size}px`;
        this.element.style.transform = `skew(${this.skew}deg)`;
        this.element.textContent = textContent;
    }

    update(deltaTime) {
        this.time += deltaTime * this.speed;
        
        // Calculate circular motion
        const orbitAngle = this.time * this.orbitSpeed;
        const orbitX = Math.cos(orbitAngle) * this.orbitRadius;
        const orbitY = Math.sin(orbitAngle) * this.orbitRadius;
        
        // Add some noise to the orbit for more organic movement
        const noiseX = perlin.noise2D(this.time * 0.0001, 0) * 5; // Slower noise
        const noiseY = perlin.noise2D(0, this.time * 0.0001) * 5; // Slower noise
        
        const x = Math.max(0, Math.min(100, this.baseX + orbitX + noiseX));
        const y = Math.max(0, Math.min(100, this.baseY + orbitY + noiseY));
        this.element.style.left = `${x}%`;
        this.element.style.top = `${y}%`;
        
        if (!this.element.classList.contains('highlighted')) {
            const opacityNoise = (perlin.noise2D(this.time * 0.0005, this.time * 0.0005) + 1) * 0.5; // Slower opacity changes
            const opacity = this.opacityRange.min + 
                           (this.opacityRange.max - this.opacityRange.min) * opacityNoise;
            this.element.style.opacity = opacity;
        }
    }

    highlight(selectedStone) {
        this.element.classList.add('highlighted', selectedStone);
        clearTimeout(this.highlightTimeout);
    }

    unhighlight() {
        const element = this.element;
        this.highlightTimeout = setTimeout(() => {
            element.classList.remove('highlighted', 'smoky-quartz', 'clear-quartz', 'amethyst');
        }, 5000); // Increased from 0.7s to 5s
    }
}

// Initialize text cloud with message types
function initializeTextCloud() {
    const textCloud = document.querySelector('.text-cloud');
    if (!textCloud) return;
    
    // Clear existing elements
    textCloud.innerHTML = '';
    
    // Remove any existing instruction text and ask again button
    const oldInstructions = document.querySelectorAll('.instruction-text');
    const oldButtons = document.querySelectorAll('.ask-again-button');
    oldInstructions.forEach(el => el.remove());
    oldButtons.forEach(el => el.remove());
    
    const fragments = [];
    let currentMessageId = Math.floor(Math.random() * eightBallMessages.length);
    const currentMessage = eightBallMessages[currentMessageId];
    
    // Split the message into words and create fragments
    const words = currentMessage.split(' ');
    words.forEach((word, index) => {
        const type = index % 2 === 0 ? 'first' : 'second';
        const fragment = createFragment(word, type, currentMessageId);
        fragments.push(fragment);
    });

    // Add instruction text
    const instruction = document.createElement('div');
    instruction.className = 'instruction-text';
    instruction.textContent = 'Tilt left to reveal the first part, tilt right to reveal the second part';
    document.body.appendChild(instruction);

    // Fade out instruction after 3 seconds
    setTimeout(() => {
        instruction.classList.add('fade-out');
    }, 3000);

    // Add "Ask Again" button
    const askAgainBtn = document.createElement('button');
    askAgainBtn.className = 'ask-again-button';
    askAgainBtn.textContent = 'Ask Again';
    askAgainBtn.onclick = () => {
        initializeTextCloud();
    };
    document.body.appendChild(askAgainBtn);
    
    // Animation loop
    let lastTime = performance.now();
    function animate(currentTime) {
        const deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;
        fragments.forEach(fragment => fragment.update(deltaTime));
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    return { fragments, currentMessageId };
}

function createFragment(word, type, messageId) {
    const fragment = document.createElement('span');
    fragment.className = 'text-fragment';
    
    // Calculate position on a circle with some noise
    const angle = Math.random() * Math.PI * 2; // Random angle between 0 and 2π
    const radius = 25 + Math.random() * 10; // Circle radius between 30-40% of screen
    
    // Calculate base position on circle
    const baseX = 50 + Math.cos(angle) * radius; // Center at 50%
    const baseY = 50 + Math.sin(angle) * radius; // Center at 50%
    
    const textFragment = new TextFragment(fragment, baseX, baseY, type, messageId, word);
    document.querySelector('.text-cloud').appendChild(fragment);
    
    return textFragment;
}

let fragments = [];
let selectedStone = '';
let currentMessageId = Math.floor(Math.random() * eightBallMessages.length);

// Update stone selection handler
function handleStoneSelection(stoneId) {
    const stones = document.querySelectorAll('.stone');
    const stonesContainer = document.querySelector('.stones-container');
    const instructionText = document.querySelector('.instruction-text');
    
    stones.forEach(stone => {
        if (stone.id === stoneId) {
            stone.classList.add('selected');
            selectedStone = stoneId;
            
            // Fade out stones and instruction
            if (stonesContainer) {
                stonesContainer.style.opacity = '0';
                setTimeout(() => {
                    stonesContainer.style.display = 'none';
                }, 500); // Match this with CSS transition time
            }
            if (instructionText) {
                instructionText.style.opacity = '0';
                setTimeout(() => {
                    instructionText.style.display = 'none';
                }, 500);
            }
            
            // Initialize text cloud after stone selection
            setTimeout(() => {
                const result = initializeTextCloud();
                fragments = result.fragments;
                currentMessageId = result.currentMessageId;
            }, 600); // Start after stones fade out
            
        } else {
            stone.classList.remove('selected');
        }
    });
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


