let touchCount = 0;

function handleTouchStart(event) {
    const touch = event.touches[0]; // Get the first touch point
    const x = touch.clientX; // Get the x coordinate
    const y = touch.clientY; // Get the y coordinate

    // Create a new ellipse element
    const ellipse = document.createElement('div');
    ellipse.style.position = 'absolute';
    ellipse.style.width = '50px'; // Set width of the ellipse
    ellipse.style.height = '30px'; // Set height of the ellipse
    ellipse.style.borderRadius = '50%'; // Make it an ellipse
    ellipse.style.background = 'linear-gradient(to right, red, orange)'; // Gradient background
    ellipse.style.left = `${x - 25}px`; // Center the ellipse on the touch point
    ellipse.style.top = `${y - 15}px`; // Center the ellipse on the touch point
    ellipse.style.pointerEvents = 'none'; // Prevent interaction with the ellipse

    document.body.appendChild(ellipse); // Add the ellipse to the body

    // Remove the ellipse after 2 seconds
    setTimeout(() => {
        document.body.removeChild(ellipse);
    }, 2000);
}

function handleTouchEnd() {
    touchCount = 0; // Reset touch count when touches end
}

document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchend', handleTouchEnd);
