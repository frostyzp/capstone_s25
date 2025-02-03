// Perplexity 
// source https://www.perplexity.ai/search/im-coding-a-website-in-html-cs-PMEpTJIQQLG_3EKWtVcBaQ

// source https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
// Detecting a finger swipe

document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;

var onlongtouch; 
var timer;
var touchduration = 500; //length of time we want the user to touch before we do something

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


// ––––––––––––––––––––––––– SWIPE GESTURES -------------------------------------- 
function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     
                                                                         
function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                
                                                                         
function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
                                                                         
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            document.body.style.backgroundColor = "lightblue"; // Change to any color
        } else {
            document.body.style.backgroundColor = "red"; // Change to any color

        }                       
    } else {
        if ( yDiff > 0 ) {
            /* down swipe */ 
        } else { 
            /* up swipe */
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};



window.addEventListener("deviceorientation", (event) => {
    const beta = event.beta;  // Front-back tilt (-90 to 90)
    const gamma = event.gamma; // Left-right tilt (-90 to 90)
    const scrollSpeed = 3; // Adjust as needed

        // Function to trigger haptic feedback
        function triggerHapticFeedback() {
            if (navigator.vibrate) {
                navigator.vibrate(200); // Vibrate for 100ms
            }
        }
    

    if (beta > 30) {
        document.body.style.backgroundColor = "blue";  // Tilted forward (UP)
        window.scrollBy(0, -scrollSpeed); // Scroll up
        triggerHapticFeedback(); // Activate haptic feedback for scrolling up


    } else if (beta < -30) {
        document.body.style.backgroundColor = "red";  // Tilted backward (DOWN)
        window.scrollBy(0, scrollSpeed); // Scroll down

    } else if (Math.abs(gamma) > 30) {
        document.body.style.backgroundColor = "purple"; // Tilted left or right
        // window.scrollBy(0, +scrollSpeed); // Scroll up

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


// BOILER PLATE STUFF TO PREVENT SCROLL
document.addEventListener("DOMContentLoaded", function () {
    // disableUserScroll(); // Now safe to run
});

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