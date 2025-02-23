let emptyWordArr = [
    "Eric is going to get me some, thank you!",
    "Thank you for checking on me, everything will be alright. Have a great evening and see you tomorrow.",
    "Thank you for being a part of the group project!",
    "Happy birthday.",
    "Please just tell me that you're safe. I'll get over it if you really don't want to tell me where you are. Whatever you're doing I'm not mad, I'm just scared that you aren't ok.",
    "We always said in another life. We tried this one and it wasn't meant to be. Maybe in the next one we'll finally get there like we always thought",
    "love you bb",
    "Perhaps you're the same. Ever since we've been friends, I can't help but feel my feelings growing you each day. Knowing you're in a relationship broke my heart.",
    "Please remember how much I love you.",
    "I wish there was more",
    "Who are you",
    "Mama Papa I see them… the angels",
    "I'm so tired. Can I go now?",
    "I love you, and I'm so proud of you"
  ];
  
let wordArray = []
let wordCounter = 0;
let windowCounter = 0;

let openedWindow = null;

const widths = [300, 600];
const heights = [600, 800];

const lefts = [window.innerHeight, window.innerHeight * 0.25, window.innerHeight * 0.75, window.innerHeight * 0.5, window.innerHeight * 1.3] ;
const tops = [window.innerWidth, window.innerWidth * 0.1, window.innerWidth * 0.5, window.innerWidth * 0.75, window.innerWidth * 1.3];

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


//   function openFloatingWindow() {
//     // Close the previously opened tab if it exists

//     closeFirstWindowIfTwoOpen();
//     // if (openedWindow) {
//     //     openedWindow.close();
//     // }

//     const randomIndex = getRandomInt(0, lefts.length);

//     const width = widths[windowCounter];
//     const height = heights[windowCounter];
//     const left = lefts[randomIndex];
//     const top = tops[randomIndex];

//     windowCounter += 1;
//     currentStoryIndex = (currentStoryIndex + 1) % 9;

//     if (windowCounter > 1){
//         windowCounter = 0;
//     }

//     // Open a new blank tab and store the reference in "openedTab"
//     openedWindow = window.open(
//         "",                    // URL (empty for a blank page)
//         "_blank",              // Target (new window)
//         `width=${width},height=${height},left=${left},top=${top}` // Features (size and position)
//     );

//     openedWindows.push(openedWindow);

//     openedWindow.document.write(`
//   <!DOCTYPE html>
//   <html lang="en">
//   <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>..:..:...</title>
//       <style>

//       @font-face {
//             src: url('fonts/PanamaMonospaceRegular.otf') format('opentype');
//             font-family: 'mainFont'; /* Custom font name */
//             font-weight: normal;
//             font-style: normal;
//             } 

//           body { 
//             background-color: #6A99D5;
//             background-image: url('images/window1.png'); /* Replace with the actual path to your image */
//             background-size: cover; /* Make the image cover the entire body */
//             background-position: center; /* Center the image */
//             background-repeat: no-repeat; /* Prevent tiling */
//             color: white;

//             display: flex;
//             align-items: center;
//             padding: 50px;
//             justify-content: center;
//             height: 70vh;
//             text-align: center;
//             margin-top: 10vh;
//             filter: contrast(8);


//             font-family: 'mainFont', serif;

//           }
//             #storyText {
//                 font-family: 'mainFont', serif;
//             }

//             .blur {
//                 display: flex;
//                 justify-content: center;
//                 align-items:center;
//                 position: relative;
//                 filter: blur(0.6px);
    
// }

//       </style>


//       <!-- Include Typewriter.js library -->
//       <script src="https://cdn.jsdelivr.net/npm/typewriter-effect@2.18.2/dist/core.js"></script>
//   </head>
//   <body>
//       <audio id="backgroundMusic" autoplay loop>
//         <source src="music/blinkingMusic.mp3" type="audio/mp3">
//         <!-- Your browser does not support the audio element. -->
//     </audio>

//     <div class="blur"> 
//         <p id="storyText" class="story-text"></p>
//     </div>


//    <script>
//         // AUDIO ***************************************************************
//         const audio = document.getElementById('backgroundMusic');
//         audio.volume = 1; // Set volume to 100%
//         audio.muted = false; // Ensure audio is not muted

//         // Play the audio when the page loads
//         window.onload = function() {
//             audio.play().catch(e => {
//                 console.error('Error playing audio:', e);
//             });
//         };

//         // BACKGROUND IMAGE **************************************************** 
//         let windowCounter = ${windowCounter}; // Value can be dynamically set
//         if (windowCounter === 1) {
//             document.body.style.backgroundImage = "url('images/window1.png')";
//         } else {
//             document.body.style.backgroundImage = "url('images/window2.png')";
//         }

//         // TEXT THAT SHOWS UP **************************************************
//         // Different types of 'love'. 
//         let storyArr = [
//     "Everyone's in their own little world...",
//     "'Ah man I smell today. You know you get those days where you jump in the shower but just forget to wash?' 'No. I don't. What the hell?!'",
//     "Sometimes I wish I belonged somewhere. I always feel like I'm in-between everything and everyone... I'm just floating around ",
//     "Why do you walk like that? With your computer out in front of you. You look so awkward. Like really awkward...",
//     "...I'm feeling nervous about school tomorrow. Is there anything you're missing or forgetting? If not, you'll be fine. Goodnight.",
//     "I've thought long and hard about this, and I'm still apprehensive about it, but I'm ready to meet you at a hotel. Genuinely.",
//     "Sometimes I feel like killing myself. I don't want to live anymore.. look at what your dad has done...",
//     "How much time would i be able to reclaim if i never had to blink...",
//     "I trust you, just bring out something that's reasonably priced. Anything under $5000 a bottle will be just fine, thanks.",
//     "...."
// ];


//     // Get the element where the typewriter effect will be applied
//     const storyTextElement = document.getElementById('storyText');

//     // Initialize Typewriter effect
//     const typewriter = new Typewriter(storyTextElement, {
//         loop: false, 
//         delay: 50,
//         cursor: ''   

//         });

//     // Start typing effect with the current story text
//     typewriter.typeString(storyArr[${currentStoryIndex}]).start();
//     print(storyArr[${currentStoryIndex}]);

//     // document.getElementById('storyText').innerText = storyArr[${currentStoryIndex}];


//     </script>

//   </body>
//   </html>
// `);

//     // -----------------------------------------------------
//     // Add counter here so it goes through it 
//     //openedWindow.document.write("<p>Blink gently</p>");}
// }


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
