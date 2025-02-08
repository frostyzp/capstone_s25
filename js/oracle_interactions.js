// Perplexity 
// source https://www.perplexity.ai/search/im-coding-a-website-in-html-cs-PMEpTJIQQLG_3EKWtVcBaQ

// source https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
// Detecting a finger swipe

// document.addEventListener('touchstart', handleTouchStart, false);        
// document.addEventListener('touchmove', handleTouchMove, false);

const eightBallMessages = [
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes, definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes.",
    "Signs point to yes.",
    "Reply hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful."
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
    document.querySelector('.oracle_answer').textContent = eightBallMessages[randomIndex];
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

// // Function to trigger haptic feedback
// function triggerHapticFeedback() {
//     if (isInteraction && navigator.vibrate) {
//         navigator.vibrate(100); // Vibrate for 100ms
//     }
// }

// ––––––––––––––––––––––––– TILTING -------------------------------------- 

window.addEventListener("deviceorientation", (event) => {
    const beta = event.beta;  // Front-back tilt (-90 to 90)
    const gamma = event.gamma; // Left-right tilt (-90 to 90)
    // const scrollSpeed = 3; // Adjust as needed

        // Map beta angle to a scrolling speed range
    function mapRange(value, inMin, inMax, outMin, outMax) {
        return Math.min(outMax, Math.max(outMin, (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin));
    }
            
    let scrollSpeed = mapRange(Math.abs(beta), 0, 90, 0, 20); // Scroll faster when tilting more
    
    if (beta > 30) {

    } else if (beta < -10) {

    } else if (Math.abs(gamma) > 50 && !hasTiltTriggered) {
        document.body.style.backgroundColor = "black"; // Tilted left or right
        hasTiltTriggered = true;
        setTimeout(() => {
            const oracleDiv = document.querySelector('.oracle_answer');
            
            // Add fade-out effect
            oracleDiv.classList.remove("fade-in");
            oracleDiv.classList.add("fade-out");
    
            setTimeout(() => {
                // Update the message
                getEightBallMessage();
    
                // Add fade-in effect
                oracleDiv.classList.remove("fade-out");
                oracleDiv.classList.add("fade-in");

                hasTiltTriggered = false;
            }, 500); // Wait for fade-out before updating text
        }, 2000); // Delay before updating message

    } else {
        document.body.style.backgroundColor = "white"; // Default
    }
});


function requestPermission() {
    if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function") {
        DeviceMotionEvent.requestPermission().then(response => {
            if (response === "granted") {
                alert("Navigate through the site gently with care. ");
            }
        }).catch(console.error);
    } else {
        alert("Your browser does not require permission.");
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

