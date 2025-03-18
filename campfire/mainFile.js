let emptyWordArr = [
    "Thank you for checking on me, everything will be alright. Have a great evening and see you tomorrow.",
    "Thank you for being a part of the group project!",
    "Happy birthday...",
    "Please just tell me that you're safe. I'll get over it if you really don't want to tell me where you are. Whatever you're doing I'm not mad, I'm just scared that you aren't ok.",
    "We always said in another life. We tried this one and it wasn't meant to be. Maybe in the next one we'll finally get there like we always thought",
    "love you bb",
    "Perhaps you're the same. Ever since we've been friends, I can't help but feel my feelings growing you each day. Knowing you're in a relationship broke my heart.",
    "Please remember how much I love you.",
    "I wish there was more",
    "Who are you?",
    "Mama Papa I see them… the angels",
    "I'm so tired. Can I go now?",
    "I love you, and I'm so proud of you"
  ];
  
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
        "I\nstill\nsee\nyour\nsmile\nin\nmy\ndreams",
        "The\nway\nyou\nused\nto\nlook\nat\nme",
        "Remember\nwhen\nwe\ndanced\nunder\nstars?",
        "Your\nlaugh\nechoes\nin\nempty\nrooms"
    ],
    [ // Dream sequence 2 - Childhood Memories
        "Running\nthrough\nsummer\nfields",
        "Ice\ncream\nmelting\non\nhot\nsidewalks",
        "Mom\ncalling\nus\nhome\nat\nsunset",
        "The\nold\ntreehouse\nwhere\nwe\nplayed"
    ],
    [ // Dream sequence 3 - Future Hopes
        "Cities\nmade\nof\nstarlight",
        "Flying\nthrough\ncotton\ncandy\nclouds",
        "Gardens\nthat\nbloom\nforever",
        "Doors\nthat\nopen\nto\nanywhere"
    ],
    [ // Dream sequence 4 - Abstract/Surreal
        "Time\nflows\nbackwards\nlike\nhoney",
        "The\nmoon\nspeaks\nin\nwhispers",
        "Butterflies\nmade\nof\nstained\nglass",
        "Piano\nkeys\nplaying\nthemselves"
    ],
    [ // Special sequence
        "*– <3 –*\n" +
        " –*–*– <3 <3 –*-*–\n" +
        " * <3 –<3 *\n" 
    ]
];

let dreamSequenceIndex = 0;
let dreamTextIndex = 0;

function mainTextChange(){

    const concretePoemWords = [
        "whisper", "dream", "light", "shadow", "echo", 
        "memory", "dance", "silence", "hope", "journey"
    ];

        const randomWord = concretePoemWords[Math.floor(Math.random() * concretePoemWords.length)];
        // document.querySelector('.mainText').innerHTML += randomWord.split('\n').join('<br>') + '<br>'; // Append new word


}

function createDreamText() {
    const text1 = dreams[dreamSequenceIndex][dreamTextIndex];
    const text2 = dreams[(dreamSequenceIndex + 2) % dreams.length][dreamTextIndex];
    
    // Increment indices
    dreamTextIndex = (dreamTextIndex + 1) % dreams[dreamSequenceIndex].length;
    if (dreamTextIndex === 0) {
        dreamSequenceIndex = (dreamSequenceIndex + 1) % dreams.length;
    }

    // Create container for 3D perspective
    const container = document.createElement('div');
    container.className = 'dream-container';
    container.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        perspective: 1000px;
        transform-style: preserve-3d;
        bottom: -100px; /* Start below viewport */
        transition: opacity 2s ease-out;
    `;

    // Random X position
    const randomX = Math.random() * (window.innerWidth - 300);
    container.style.left = `${randomX}px`;

    // Create two dream elements
    const dreamElement1 = document.createElement('div');
    const dreamElement2 = document.createElement('div');
    
    [dreamElement1, dreamElement2].forEach((el, i) => {
        el.className = 'floating-dream';
        el.id = `dream-${Date.now()}-${i}`;
        el.style.cssText = `
            position: absolute;
            width: 100%;
            color: rgba(255, 255, 255, 0.8);
            font-size: 1.2rem;
            transform-style: preserve-3d;
            text-align: center;
        `;
        container.appendChild(el);
    });

    document.body.appendChild(container);

    // Create typewriter effects
    createTypewriterEffect(dreamElement1.id, [text1]);
    createTypewriterEffect(dreamElement2.id, [text2]);

    // Animation variables
    let bottom = -250; // Start from below
    let rotation1 = 0;
    let rotation2 = 180;
    const rotationSpeed1 = (Math.random() - 0.5) * 1.2;
    const rotationSpeed2 = (Math.random() - 0.5) * 1.2;
    const moveSpeed = 0.4; // Adjust this to control floating speed

    const animate = () => {
        bottom += moveSpeed;
        rotation1 += rotationSpeed1;
        rotation2 += rotationSpeed2;

        container.style.bottom = `${bottom}px`;
        
        dreamElement1.style.transform = `
            rotateX(${rotation1}deg) 
            rotateY(${rotation1 * 0.5}deg) 
        `;
        
        dreamElement2.style.transform = `
            rotateX(${-rotation2}deg) 
            rotateY(${rotation2 * 0.5}deg) 
        `;

        // translateZ(50px)


        // Remove when reaching top
        if (bottom > window.innerHeight + 100) {
            container.style.opacity = '0';
            setTimeout(() => {
                container.remove();
            }, 2000);
            return;
        }

        requestAnimationFrame(animate);
    };

    animate();
}

// Modified typewriter function to work with elements directly
function createTypewriterEffect(elementId, textArray, options = {}) {
    const element = document.getElementById(elementId);
    
    if (!element) {
        console.error(`Element with ID "${elementId}" not found.`);
        return;
    }

    const typewriter = new Typewriter(element, {
        loop: false,
        delay: 50,
        cursor: '',
        ...options
    });

    textArray.forEach(line => {
        typewriter.typeString(line);
    });

    typewriter.start();
}

// Replace handleBlink with this
function handleBlink() {
    createIntersectingDreamTexts();
}

  function spawnWords(){
    
    textSize(30);
    textAlign(CENTER, CENTER);
    fill(0);

    
    // add words from emptyWordArr 
    wordArray.push(emptyWordArr[wordCounter]);
    wordCounter = (wordCounter + 1) % emptyWordArr.length
    print('wordCounter :' +wordCounter);
    currentStoryIndex = (currentStoryIndex + 1) % emptyWordArr.length;
    // openFloatingWindow();


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

let position = 1; // Starting position in viewport width (vw)

// Various starting positions for clouds with different heights
let startingPositions = [
    { x: 1, y: 50 },   // Cloud at x=1, y=50
    { x: 100, y: 200 }, // Cloud at x=100, y=100
    { x: 200, y: 150 }, // Cloud at x=200, y=150
    { x: 300, y: 100 }, // Cloud at x=300, y=200
    { x: 400, y: -200 }  // Cloud at x=400, y=250
]; 
let currentPositions = [...startingPositions]; // Copy starting positions to current positions

// Different speeds for each cloud, ranging from -1 to -4
let speeds = [-1, -2, -3, -2, -1]; // Assigning different speeds to each cloud

function moveClouds() {
    const cloudTexts = document.querySelectorAll(".cloudText"); // Select all cloudText elements
    cloudTexts.forEach((cloudText, index) => {
        if (cloudText) { // Check if cloudText exists
            currentPositions[index].x += speeds[index]; // Move left by the assigned speed for each cloud
            cloudText.style.transform = `translate(${currentPositions[index].x}px, ${currentPositions[index].y}px)`; 
            
            // Check if the cloudText has moved out of the left side of the window
            if (currentPositions[index].x < -window.innerWidth) {
                currentPositions[index].x = startingPositions[index].x; // Reset to original starting position
            }
        } else {
            console.error("cloudText element not found");
        }
    });
    setTimeout(moveClouds, 100); // Call function every 100 milliseconds
}

moveClouds();

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

// Example of checking for a face and closing all windows after 10 seconds
let faceDetected = true; // This should be updated based on your face detection logic
let faceCheckInterval = setInterval(() => {
    if (!faceDetected) {
        setTimeout(() => {
            closeAllPopupWindows();
        }, 10000); // Close all windows after 10 seconds if no face is detected
    }
}, 1000); // Check every second
