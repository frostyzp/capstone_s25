let touchCount = 0;

function handleTouchStart(event) {
    touchCount++; // Increment touch count on each touch

    // Change background color to a warmer tone based on touch count
    const warmthFactor = Math.min(touchCount * 20, 255); // Limit to 255 for RGB
    document.body.style.backgroundColor = `rgb(${warmthFactor}, ${warmthFactor - 50}, ${warmthFactor - 100})`;

    // Change background color when touchCount reaches 4
    if (touchCount === 4) {
        document.body.style.backgroundColor = 'rgba(255, 165, 0, 1)'; // Change to a specific warm color
        
        const words = ["Warmth", "Gather", "Share", "Light", "Comfort", "Friendship", "Stories", "Joy"];
        
        function spawnCampfire() {
            const wordElement = document.createElement('div');
            wordElement.textContent = words[Math.floor(Math.random() * words.length)];
            wordElement.style.position = 'absolute';
            wordElement.style.color = 'white';
            wordElement.style.fontSize = '24px';
            wordElement.style.opacity = 0; // Start invisible

            // Random position
            wordElement.style.left = `${Math.random() * 100}vw`;
            wordElement.style.top = `${Math.random() * 100}vh`;

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

            // Remove the word after some time
            setTimeout(() => {
                document.body.removeChild(wordElement);
            }, 3000); // Remove after 3 seconds
        }

        setInterval(spawnCampfire, 500); // Call spawnCampfire every 0.5 seconds
    }
}

function handleTouchEnd() {
    touchCount = 0; // Reset touch count when touches end
}

document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchend', handleTouchEnd);
