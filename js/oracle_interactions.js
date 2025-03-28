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
    "Cannot predict now – wait for the wind’s answer.",
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

// ––––––––––––––––––––––––– TILTING -------------------------------------- 

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

    } else if (Math.abs(gamma) > 45) {
        const tiltX = gamma/3; // Adjust the divisor to control tilt intensity
        const oracleBody = document.querySelector('.oracleBody');

        if (oracleBody) {
            oracleBody.style.transform = `rotateY(-${tiltX}deg)`;
        }

        if (!hasTiltTriggered) {
            // document.body.style.backgroundColor = "black"; // Tilted left or right
            hasTiltTriggered = true;

            setTimeout(() => {
                const oracleDiv = document.querySelector('.oracle_answer');
        
                // Add fade-out effect
                oracleDiv.classList.remove("fade-in");
                oracleDiv.classList.add("fade-out");
        
                setTimeout(() => {
                    changeOracleColor();
                    getEightBallMessage();
        
                    // Add fade-in effect
                    oracleDiv.classList.remove("fade-out");
                    oracleDiv.classList.add("fade-in");
        
                    // ✅ Reset cooldown **AFTER** fade-in finishes
                    setTimeout(() => {
                        hasTiltTriggered = false;
                    }, 1000); // Adjust based on fade-in time
        
                }, 1500); // Wait for fade-out before updating text
        
            }, 500); // Delay before updating message
        }
    } else {
        document.body.style.backgroundColor = "white"; // Default
    }
});

function requestPermission() {
    if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function") {
        DeviceMotionEvent.requestPermission().then(response => {
            if (response === "granted") {
                alert("Navigate through the site gently with care.");
                document.querySelector("#permission-button").remove();
                showContent();
            }
        }).catch(error => {
            console.error(error);
            // Show content anyway if permission fails
            showContent();
        });
    } else {
        // For non-iOS devices or desktop browsers
        document.querySelector("#permission-button").style.display = 'none';
        showContent();
    }

    // Also request device orientation permission if needed
    if (DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission().then(response => {
            if (response === "granted") {
                // Permission granted for device orientation
            }
        }).catch(console.error);
    }
}

function showContent() {
    // Add console log for debugging
    console.log('showContent called');
    
    // Remove intro text and button
    const introText = document.querySelector('.intro-text');
    const permissionButton = document.querySelector('#permission-button');
    
    if (introText) introText.style.display = 'none';
    if (permissionButton) permissionButton.style.display = 'none';
    
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

