
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
        // For non-iOS devices or older browsers that don't need explicit permission
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
            } else if (beta > 30) { // Tilted up
                ripple2.style.opacity = 1;
                ripple2.style.transition = 'opacity 0.5s ease-in';
            } else if (gamma > 30) { // Tilted to the right
                ripple3.style.opacity = 1;
                ripple3.style.transition = 'opacity 0.5s ease-in';
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
    
    // Or add a button for better user experience
    const button = document.createElement('button');
    button.textContent = 'Enable Device Orientation';
    button.addEventListener('click', requestOrientationPermission);
    document.body.insertBefore(button, document.body.firstChild);
});
