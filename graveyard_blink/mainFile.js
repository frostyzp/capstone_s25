let emptyWordArr = [
    "Thank you for checking on me, everything will be alright. Have a great evening and see you tomorrow.",
    "Thank you for being a part of the group project!",
    "Happy birthday.",
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
    window.innerWidth * 0.25, 
    window.innerWidth * 0.5, 
    window.innerWidth * 0.75
];
const tops = [
    window.innerHeight * 0.1, 
    window.innerHeight * 0.25, 
    window.innerHeight * 0.5, 
    window.innerHeight * 0.75
];

let storyAudio = [ ];
let currentStoryIndex = 0;


let openedWindows = []; // Array to keep track of opened windows

  function spawnWords(){
    
    textSize(30);
    textAlign(CENTER, CENTER);
    fill(0);

    
    // add words from emptyWordArr 
    wordArray.push(emptyWordArr[wordCounter]);
    wordCounter = (wordCounter + 1) % emptyWordArr.length
    print('wordCounter :' +wordCounter);
    currentStoryIndex = (currentStoryIndex + 1) % emptyWordArr.length;
    openFloatingWindow();


// ------------------------------ WHERE TEXT IS INPUTTED ------------------------------
  const storyTextElement = document.querySelector('.mainText');
  const typewriter = new Typewriter(storyTextElement, {
      loop: false, 
      delay: 50,
      cursor: ''   
  });
  typewriter.typeString(emptyWordArr[wordCounter]).start();
    
  }

  // ------------------------------ END OF SPAWN WORDS ------------------------------


  function openFloatingWindow() {
    console.log("Attempting to open a new window. Current windowCounter:", windowCounter);
    
    // Close the previously opened tab if it exists
    // closeFirstWindowIfTwoOpen();

    const randomIndex = getRandomInt(0, lefts.length);

    const width = widths[windowCounter % widths.length];
    const height = heights[windowCounter % heights.length];
    const left = lefts[randomIndex];
    const top = tops[randomIndex];

    windowCounter += 1; // Increment windowCounter to allow multiple windows
    console.log("New window will open at position:", left, top);

    openedWindow = window.open(
        "",                    
        "",  // Use an empty string or a unique identifier
        `width=${width},height=${height},left=${left},top=${top}`
    );

    document.body.style.backgroundImage = "none"; 

    openedWindows.push(openedWindow);

    // Close the first opened window if there are more than 7
    if (openedWindows.length > 7) {
        closeFirstWindow();
    }

    openedWindow.document.write(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TOMBSTONE</title>
      <style>

      @font-face {
            src: url('fonts/PanamaMonospaceRegular.otf') format('opentype');
            font-family: 'mainFont'; /* Custom font name */
            font-weight: normal;
            font-style: normal;
            } 

          body { 
            background-color: white;
            background-size: cover; /* Make the image cover the entire body */
            background-position: center; /* Center the image */
            background-repeat: no-repeat; /* Prevent tiling */
            color: white;

            display: flex;
            align-items: center;
            padding: 50px;
            justify-content: center;
            height: 50vh;
            text-align: center;
            margin-top: 10vh;
            filter: contrast(8);


            font-family: 'mainFont', serif;

          }
            #storyText {
                font-family: 'mainFont', serif;
            }

            .blur {
                display: flex;
                justify-content: center;
                align-items:center;
                position: relative;
                filter: blur(0.6px);
    
}

      </style>


      <!-- Include Typewriter.js library -->
      <script src="https://cdn.jsdelivr.net/npm/typewriter-effect@2.18.2/dist/core.js"></script>
  </head>
  <body>
      <audio id="backgroundMusic" autoplay loop>
        <source src="music/blinkingMusic.mp3" type="audio/mp3">
        <!-- Your browser does not support the audio element. -->
    </audio>

    <div class="blur"> 
        <p id="storyText" class="story-text"></p>
    </div>


   <script>
        // AUDIO ***************************************************************
        const audio = document.getElementById('backgroundMusic');
        audio.volume = 1; // Set volume to 100%
        audio.muted = false; // Ensure audio is not muted

        // Play the audio when the page loads
        window.onload = function() {
            audio.play().catch(e => {
                console.error('Error playing audio:', e);
            });
        };

        // BACKGROUND IMAGE **************************************************** 
        let windowCounter = ${windowCounter}; // Value can be dynamically set
        if (windowCounter === 1) {
            document.body.style.backgroundImage = "url('tombstone.png')";
        } else {
            document.body.style.backgroundImage = "url('tombstone.png')";
        }

        // TEXT THAT SHOWS UP **************************************************
        // Different types of 'love'. 
        let storyArr = [
    "Thank you for checking on me, everything will be alright. Have a great evening and see you tomorrow.",
    "Thank you for being a part of the group project!",
    "Happy birthday.",
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


    // Get the element where the typewriter effect will be applied
    const storyTextElement = document.getElementById('storyText');

    // Initialize Typewriter effect
    const typewriter = new Typewriter(storyTextElement, {
        loop: false, 
        delay: 50,
        cursor: ''   

        });

    // Start typing effect with the current story text
    typewriter.typeString(storyArr[${currentStoryIndex}]).start();

    // document.getElementById('storyText').innerText = storyArr[${currentStoryIndex}];


    </script>

  </body>
  </html>
`);

    // -----------------------------------------------------
    // Add counter here so it goes through it 
    //openedWindow.document.write("<p>Blink gently</p>");}
}


function spawnGardenWord () {
    let storyArr = [
        "Poop",
        "Hey",
        "yay"
    ];

    // Get the element where the typewriter effect will be applied
    const storyTextElement = document.getElementById('storyText');

    // Initialize Typewriter effect
    const typewriter = new Typewriter(storyTextElement, {
        loop: false, 
        delay: 50,
        cursor: ''   
        });

    // Start typing effect with the current story text
    typewriter.typeString(storyArr[0]).start();

}


    // Function to get a random value from an array
function getRandomValue(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
function closeFirstWindowIfTwoOpen() {
    if (openedWindows.length === 4) {
        // Get the first window in the array
        let firstWindow = openedWindows[0];

        if (firstWindow) {
            firstWindow.close();  // Close the first window
            openedWindows.shift(); // Remove the reference from the array
        }
    } 
}

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
