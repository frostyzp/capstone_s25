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

    if (beta > 30) {
        document.body.style.backgroundColor = "blue";  // Tilted forward (UP)
    } else if (Math.abs(gamma) > 30) {
        document.body.style.backgroundColor = "purple"; // Tilted left or right
    } else {
        // document.body.style.backgroundColor = "white"; // Default
    }
});


function requestPermission() {
    if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function") {
        DeviceMotionEvent.requestPermission().then(response => {
            if (response === "granted") {
                alert("Permission granted! Tilt your device.");
                startListening();

            }
        }).catch(console.error);
    } else {
        alert("Your browser does not require permission.");
    }
}

function startListening() {
    window.addEventListener("deviceorientation", (event) => {
        const beta = event.beta; // Forward/backward tilt (-90 to 90)
        const scrollSpeed = Math.max(0, (beta - 10) * 2); // Adjust sensitivity

        if (beta < 10) {
            window.scrollBy(0, -scrollSpeed); // Scroll up
        }
    });
}