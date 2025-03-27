// Add Rita.js library
const rita = document.createElement('script');
rita.src = "https://unpkg.com/rita@3.1.3/dist/rita.min.js";
document.head.appendChild(rita);

// Generate wishes function
function generateWish(rippleNumber) {

    if (rippleNumber === '1') {
    let rules = {
        start: "hope for $something even if it's $adj",
        something: "something | anything",
        adj: RiTa.randomWord({ pos: "jj" }),
    };
        console.log(RiTa.grammar(rules).expand());
        return RiTa.grammar(rules).expand();
    } if (rippleNumber === '2') {
        let rules = {
            start: "hope for $something even if it's $adj",
            something: "something | anything",
            adj: RiTa.randomWord({ pos: "jj" }),
        };
    } else {
        
    }
}

// Arrays to store wishes for each ripple
let wishesRipple1 = [];
let wishesRipple2 = [];
let wishesRipple3 = [];

// Request permission for device orientation
async function requestOrientationPermission() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
            // This is needed for iOS 13+ devices
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission === 'granted') {
                enableOrientationFeatures();
            } else {
                alert("to enter the wishing well, please allow device orientation");
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
                // document.getElementById('ripple-1').textContent = wishesRipple1.join('\n'); // Update content

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

// Add a button or trigger to request permission
document.addEventListener('DOMContentLoaded', () => {
    // You can either auto-request when page loads
    requestOrientationPermission();
    
    //     button.addEventListener('click', requestOrientationPermission);


    // Get the submit button and text area
    const submitButton = document.getElementById('submit-wish');
    const wishInput = document.getElementById('wish-input');
    submitButton.addEventListener('click', () => {
        // Get the container
        const container = document.getElementById('wish-input-container');
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
        
        // Request orientation permission
    })
});
