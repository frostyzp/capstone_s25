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

let hasTiltTriggered = false; // 

var xDown = null;                                                        
var yDown = null;

var onlongtouch; 
var timer;
var touchduration = 500; //length of time we want the user to touch before we do something

let isInteraction = false;

function getEightBallMessage() {
    const randomIndex = Math.floor(Math.random() * eightBallMessages.length);
    const oracleAnswer = document.querySelector('.oracle_answer');
    if (oracleAnswer) {
        oracleAnswer.textContent = eightBallMessages[randomIndex];
    }
}

// BOILER PLATE STUFF TO PREVENT SCROLL
document.addEventListener("DOMContentLoaded", function () {
    disableUserScroll(); // Now safe to run

    


});





function touchstart() {
    timer = setTimeout(onlongtouch, touchduration); 
}
  
function touchend() {
    //stops short touches from firing the event
    if (timer)
        clearTimeout(timer); // clearTimeout, not cleartimeout..
}

onlongtouch = function() { //do something 
    document.body.style.backgroundColor="black";
}

document.addEventListener("click", function() {
    isInteraction = true;
    console.log("User interaction detected");
});

// ––––––––––––––––––––––––– TILTING -------------------------------------- 

window.addEventListener("deviceorientation", (event) => {
    const beta = event.beta;  // Front-back tilt (-90 to 90)
    const gamma = event.gamma; // Left-right tilt (-90 to 90)

    if (!fragments || !selectedStone) return;

    // Calculate background color based on tilt
    const maxTilt = 45; // Maximum tilt angle for full color effect
    const tiltPercentage = Math.min(Math.abs(gamma) / maxTilt, 1); // Normalize to 0-1
    const blueIntensity = Math.floor(tiltPercentage * 20); // Range 0-20 for subtle blue
    document.body.style.backgroundColor = `rgb(0, 0, ${blueIntensity})`;

    // Handle text fragment highlighting
    fragments.forEach(fragment => {
        // First unhighlight all fragments
        fragment.unhighlight();
        
        // Then highlight based on tilt
        if (fragment.messageId === currentMessageId) {
            if (gamma < -15 && fragment.type === 'first') {
                fragment.highlight(selectedStone);
            }
            else if (gamma > 15 && fragment.type === 'second') {
                fragment.highlight(selectedStone);
            }
            else if (beta > 15 && fragment.type === 'reflection') {
                fragment.highlight(selectedStone);
            }
        }
    });

    // Handle answer revealing
    const oracleWrapper = document.querySelector('.oracle_wrapper');
    const oracleAnswer = document.querySelector('.oracle_answer');
    
    if (oracleWrapper && oracleAnswer) {
        // If tilting down (beta > 30 degrees)
        if (beta > 30) {
            if (!hasTiltTriggered) {
                hasTiltTriggered = true;
                
                // Fade out current answer
                oracleAnswer.classList.remove("fade-in");
                oracleAnswer.classList.add("fade-out");
                
                setTimeout(() => {
                    // Get new answer
                    getEightBallMessage();
                    
                    // Fade in new answer
                    oracleAnswer.classList.remove("fade-out");
                    oracleAnswer.classList.add("fade-in");
                    
                    // Reset cooldown after animation
                    setTimeout(() => {
                        hasTiltTriggered = false;
                    }, 1000);
                }, 500);
            }
        }
    }
});

// Make requestPermission globally accessible
window.requestPermission = function() {
    return new Promise((resolve, reject) => {
        if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function") {
            DeviceMotionEvent.requestPermission().then(response => {
                if (response === "granted") {
                    if (DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
                        return DeviceOrientationEvent.requestPermission();
                    }
                    return Promise.resolve("granted");
                }
                return Promise.reject("Motion permission denied");
            }).then(response => {
                if (response === "granted") {
                    resolve();
                } else {
                    reject("Orientation permission denied");
                }
            }).catch(reject);
        } else {
            // For non-iOS devices or desktop browsers
            resolve();
        }
    });
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
        console.error('Content element not found');
    }
}

function disableUserScroll() {
    document.body.style.overflow = "hidden"; // Prevent scrolling
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventArrowScroll);
}

function enableUserScroll() {
    document.body.style.overflow = "auto"; // Restore scrolling
    window.removeEventListener("wheel", preventScroll);
    window.removeEventListener("touchmove", preventScroll);
    window.removeEventListener("keydown", preventArrowScroll);
}

function preventScroll(event) {
    event.preventDefault();
}

function preventArrowScroll(event) {
    const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]; // Spacebar too
    if (keys.includes(event.key)) {
        event.preventDefault();
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
    constructor(element, baseX, baseY, type, messageId) {
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
        this.highlightTimeout = null;
        this.orbitRadius = 20 + Math.random() * 30; // Random orbit radius between 20-50px
        this.orbitSpeed = 0.1 + Math.random() * 0.3; // Much slower orbit speed
        
        this.element.style.fontSize = `${this.size}px`;
        this.element.style.transform = `skew(${this.skew}deg)`;
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
    
    eightBallMessages.forEach((message, messageId) => {
        const [firstPart, secondPart] = message.split('–').map(part => part.trim());
        
        // First part (prediction)
        firstPart.split(' ').forEach(word => {
            const fragment = createFragment(word, 'first', messageId);
            fragments.push(fragment);
        });

        // Second part (nature connection)
        secondPart.split(' ').forEach(word => {
            const fragment = createFragment(word, 'second', messageId);
            fragments.push(fragment);
        });
    });

    // Add instruction text
    const instruction = document.createElement('div');
    instruction.className = 'instruction-text';
    instruction.textContent = 'Tilt your vessel to read your fortune';
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
    fragment.textContent = word;
    
    // Calculate position on a circle with some noise
    const angle = Math.random() * Math.PI * 2; // Random angle between 0 and 2π
    const radius = 25 + Math.random() * 10; // Circle radius between 30-40% of screen
    
    // Calculate base position on circle
    const baseX = 50 + Math.cos(angle) * radius; // Center at 50%
    const baseY = 50 + Math.sin(angle) * radius; // Center at 50%
    
    const textFragment = new TextFragment(fragment, baseX, baseY, type, messageId);
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Add event listeners for stones
    const stones = document.querySelectorAll('.stone');
    stones.forEach(stone => {
        stone.addEventListener('click', () => {
            handleStoneSelection(stone.id);
        });
    });
    
    // Show content if permission button is not present
    if (!document.querySelector("#permission-button")) {
        showContent();
    }
});

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


