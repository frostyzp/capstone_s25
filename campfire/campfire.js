let touchCount = 0;
let wordCount = 0;

function handleTouchStart(event) {
    touchCount = event.touches.length; // Update touch count based on active touches

    // Change background color to a warmer tone based on touch count
    const warmthFactor = Math.min(touchCount * 20, 255); // Limit to 255 for RGB
    document.body.style.backgroundColor = `rgb(${warmthFactor}, ${warmthFactor - 50}, ${warmthFactor - 100})`;

    // Change background color when touchCount reaches 4
    if (touchCount === 4) {
        const instructionsElement = document.querySelector('.instructions');
        instructionsElement.textContent = 'hold on and watch the exchanging of dreams';

        document.body.style.background = 'radial-gradient(circle, rgba(255, 215, 0, 1) 0%, rgb(78, 6, 6) 100%)'; // Radial gradient from yellow to dark red

        const words = ["Warmth", "Gather", "Share", "Light", "Comfort", "Friendship", "Stories", "Joy", "90th floor", "pointy nose", "he was a good man", "curly", "dog", "friends", "sketch a dog", "triangle head"];
        let angleOffset = 0; // Initialize angle offset for circular motion

        function spawnCampfire() {
            const wordElement = document.createElement('div');
            wordCount = wordCount + 1;
            wordElement.textContent = words[(wordCount % words.length)];
            wordElement.classList.add('word'); // Apply the CSS class for styling

            // Calculate position based on angle
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const radius = 150; // Adjust radius for spacing between words

            // Update angle for circular motion
            angleOffset += Math.PI / 12; // Adjust speed of rotation
            const left = centerX + radius * Math.cos(angleOffset) - 50; // Adjust for word width
            const top = centerY + radius * Math.sin(angleOffset) - 12; // Adjust for word height

            wordElement.style.left = `${left}px`;
            wordElement.style.top = `${top}px`;

            document.body.appendChild(wordElement);

            // Fade in effect
            let opacity = 0;
            const fadeInInterval = setInterval(() => {
                if (opacity < 1) {
                    opacity += 0.05; // Increase opacity
                    wordElement.style.opacity = opacity;
                } else {
                    clearInterval(fadeInInterval);
                }
            }, 50); // Adjust timing for fade effect

            // Apply floating effect with reduced rotation
            wordElement.style.transform = `rotateZ(${Math.random() * 90}deg) translateZ(0) scale(0)`; // Start with scale 0 and reduced rotation
            wordElement.style.transition = 'transform 1.5s, opacity 1s'; // Add transition for scaling
            setTimeout(() => {
                wordElement.style.transform = `rotateZ(${Math.random() * 90}deg) translateZ(0) scale(1.5)`; // Scale to 1.5 over time with reduced rotation
            }, 50); // Delay to allow for the fade-in effect


            setTimeout(() => {
                wordElement.style.transform += ' translateY(-10px)'; // Float effect
            }, 50);

            // Remove the word after some time
            setTimeout(() => {
                // Fade out effect
                wordElement.style.transition = 'opacity 0.5s'; // Set transition for opacity
                wordElement.style.opacity = 0; // Start fading out

                // Remove the word after fading out
                setTimeout(() => {
                    document.body.removeChild(wordElement);
                }, 500); // Remove after 0.5 seconds
            }, 5000); // Start fade out after 5 seconds
        }

        setInterval(spawnCampfire, 500); // Call spawnCampfire every 0.5 seconds
    }
}

function handleTouchEnd() {
    touchCount = 0; // Reset touch count when touches end
}

document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchend', handleTouchEnd);
