// Add Rita.js library
const rita = document.createElement('script');
rita.src = "https://unpkg.com/rita@3.1.3/dist/rita.min.js";
document.head.appendChild(rita);

// Add a button or trigger to request permission
document.addEventListener('DOMContentLoaded', () => {
    // Arrays to store wishes for each ripple
    let wishesRipple1 = [];
    let wishesRipple2 = [];
    let wishesRipple3 = [];
    
    // You can either auto-request when page loads

    // Get the text area
    const wishInput = document.getElementById('wish-input');

    // Detect swipe up gesture
    let touchStartY = 0;
    let touchEndY = 0;

    const container = document.getElementById('wish-input-container');

    container.addEventListener('touchstart', (event) => {
        touchStartY = event.changedTouches[0].screenY;
    });

    container.addEventListener('touchend', (event) => {
        touchEndY = event.changedTouches[0].screenY;
        handleGesture();
    });

    function handleGesture() {
        if (touchStartY - touchEndY > 120) { // Swipe up detected
            requestOrientationPermission();

            // Get the content from the wish input fields
            const wish1 = document.getElementById('wish-input').value;
            const wish2 = document.getElementById('wish-input2').value;
            const wish3 = document.getElementById('wish-input3').value;

            // Update the ripple content with the wishes
            wishesRipple1.push(wish1);
            wishesRipple2.push(wish2);
            wishesRipple3.push(wish3);
            
            document.getElementById('ripple-1').textContent = wish1;
            document.getElementById('ripple-2').textContent = wish2;
            document.getElementById('ripple-3').textContent = wish3;

            // Clear any existing text
            wishInput.value = '';
            document.getElementById('wish-input2').value = '';
            document.getElementById('wish-input3').value = '';

            const instructions = document.querySelector('.instructions');
            instructions.textContent = 'Tilt your vessel to and observe the ripples – each wish a rock, a skip'; // Change the text content
            instructions.style.opacity = 1; // Make it visible
            setTimeout(() => {
                instructions.classList.add('fade-out'); // Add fade-out class after 5 seconds
            }, 5000);
            
            // Add fade out class to container
            container.classList.add('fade-out');
        }
    }
});

// Generate wishes function
function generateWish(rippleNumber) {
    let rules;
    if (rippleNumber === '1') {
        rules = {
            start: "I hope for $something even if it's $adj. I will hope for $something even if it will be $adj. If I were to hope for $something, it would be $adj.",
            something: "something | anything",
            adj: RiTa.randomWord({ pos: "jj" }),
        };
    } else if (rippleNumber === '2') {
        rules = {
            start: "I hope for $something even if it's $adj. I will hope for $something even if it will be $adj. If I were to hope for $something, it would be $adj.",
            something: "something | anything",
            adj: RiTa.randomWord({ pos: "jj" }),
        };
    }

    // Generate the wish
    let wish = RiTa.grammar(rules).expand();
    
    // Activate associative leaps after 3 activations
    if (wishesRipple1.length + wishesRipple2.length + wishesRipple3.length >= 3) {
        let words = wish.split(' ');
        words = words.map(word => {
            let similarWords = RiTa.spellsLike(word).concat(RiTa.soundsLike(word)).concat(RiTa.rhymes(word));
            return similarWords.length > 0 ? similarWords[Math.floor(Math.random() * similarWords.length)] : word;
        });
        wish = words.join(' ');
    }

    console.log(wish);
    return wish;
}

// const submitWishButton = document.getElementById('submit-wish');
// if (submitWishButton) {
//     submitWishButton.addEventListener('click', function() {
//         const wish1 = document.getElementById('wish-input').value;
//         const wish2 = document.getElementById('wish-input2').value;
//         const wish3 = document.getElementById('wish-input3').value;

//         console.log('Wish 1:', wish1);
//         console.log('Wish 2:', wish2);
//         console.log('Wish 3:', wish3);
        
//         // Clear the input fields after logging
//         document.getElementById('wish-input').value = '';
//         document.getElementById('wish-input2').value = '';
//         document.getElementById('wish-input3').value = '';
//     });
// }

// Request permission for device orientation
async function requestOrientationPermission() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
            // This is needed for iOS 13+ devices
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission === 'granted') {
                enableOrientationFeatures();
            } else {
                alert("create ripples by tilting your vessel");
            }
        } catch (error) {
            console.error("Error requesting device orientation permission:", error);
        }
    } else {
        enableOrientationFeatures();
    }
}

// Function containing your existing orientation code
function enableOrientationFeatures() {
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(event) {
            const alpha = event.alpha; // Rotation around the z-axis
            const beta = event.beta;   // Rotation around the x-axis
            const gamma = event.gamma; // Rotation around the y-axis

            // Get the ripple elements
            const ripple1 = document.getElementById('ripple-1');
            const ripple2 = document.getElementById('ripple-2');
            const ripple3 = document.getElementById('ripple-3');

            // Reset all ripples to hidden
            ripple1.style.opacity = 0;
            ripple2.style.opacity = 0;
            ripple3.style.opacity = 0;

            // Check the orientation and fade in the appropriate ripple
            if (gamma < -30) { // Tilted to the left
                ripple1.style.opacity = 1;
                ripple1.style.transition = 'opacity 0.5s ease-in';
                wishesRipple1.push(generateWish('1')); // Generate a new wish for ripple 1
                document.getElementById('ripple-1').textContent = wishesRipple1[wishesRipple1.length - 1]; // Update content to last element
            } else if (beta > 30) { // Tilted up
                ripple2.style.opacity = 1;
                ripple2.style.transition = 'opacity 0.5s ease-in';
                wishesRipple2.push(generateWish('2')); // Generate a new wish for ripple 2
                document.getElementById('ripple-2').textContent = wishesRipple2.join('\n'); // Update content
            } else if (gamma > 30) { // Tilted to the right
                ripple3.style.opacity = 1;
                ripple3.style.transition = 'opacity 0.5s ease-in';
                wishesRipple3.push(generateWish('3')); // Generate a new wish for ripple 3
                document.getElementById('ripple-3').textContent = wishesRipple3.join('\n'); // Update content
            }
        });
    } else {
        alert("Device orientation is not supported on your device.");
    }
}
