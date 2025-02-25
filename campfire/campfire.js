let touchCount = 0;
const glowDiv = document.createElement("div");
glowDiv.style.position = 'fixed';
glowDiv.style.top = '50%';
glowDiv.style.left = '50%';
glowDiv.style.transform = 'translate(-50%, -50%)';
glowDiv.style.width = '100px';
glowDiv.style.height = '100px';
glowDiv.style.borderRadius = '50%';
glowDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
glowDiv.style.transition = 'box-shadow 0.8s ease';
document.body.appendChild(glowDiv);

function handleTouchStart(event) {
    touchCount = event.touches.length;
    changeGlow();
    if (touchCount >= 4) {
        document.body.style.background = 'linear-gradient(to bottom, orange, red)'; // Change background to orange-red gradient
        
    }
}

function handleTouchEnd() {
    touchCount = 0;
    resetGlow();
    document.body.style.background = ''; // Reset background when touch ends
}

function changeGlow() {
    const glowIntensity = Math.min(touchCount * 10, 100); // Limit glow intensity
    glowDiv.style.boxShadow = `0 0 ${glowIntensity}px rgba(255, 0, 0, 0.7)`;
}

function resetGlow() {
    glowDiv.style.boxShadow = 'none'; // Reset glow effect
}

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("touchstart", (event) => {
        const touch = event.touches[0];
        
        const mark = document.createElement("div");
        mark.classList.add("touch-mark");
        mark.style.left = `${touch.clientX}px`;
        mark.style.top = `${touch.clientY}px`;
        mark.style.width = '20px'; // Set width for the mark
        mark.style.height = '20px'; // Set height for the mark
        mark.style.backgroundColor = 'rgba(255, 0, 0, 0.5)'; // Semi-transparent red
        mark.style.position = 'absolute'; // Position it absolutely
        mark.style.borderRadius = '50%'; // Make it circular
        mark.style.opacity = 0; // Start with opacity 0
        document.body.appendChild(mark);

        // Fade in
        setTimeout(() => {
            mark.style.transition = 'opacity 0.4s ease';
            mark.style.opacity = 1;
        }, 10);

        // Fade out and remove after 0.8s
        setTimeout(() => {
            mark.style.opacity = 0;
            setTimeout(() => {
                mark.remove();
            }, 400); // Wait for fade out to finish before removing
        }, 800);
    });

    // Ensure touchend is handled to reset touch count
    document.addEventListener("touchend", handleTouchEnd);
});

function spawnCampfire(words) {
    let index = 0; // To keep track of the current word

    setInterval(() => {
        // Create a new span element for the word
        const wordElement = document.createElement('span');
        wordElement.textContent = words[index];
        wordElement.style.position = 'absolute';
        wordElement.style.color = 'white'; // Set text color
        wordElement.style.fontSize = '2rem'; // Set initial font size
        wordElement.style.transition = 'transform 1s ease, opacity 1s ease'; // Transition for scaling and fading
        wordElement.style.transform = 'scale(0)'; // Start with scale 0

        // Append the word to the body or a specific container
        document.body.appendChild(wordElement);

        // Position the word in the center
        wordElement.style.left = '50%';
        wordElement.style.top = '50%';
        wordElement.style.transform = 'translate(-50%, -50%) scale(0)'; // Center and scale

        // Trigger the animation
        setTimeout(() => {
            wordElement.style.transform = 'translate(-50%, -50%) scale(2)'; // Scale to 2rem
            wordElement.style.opacity = '0'; // Fade out
        }, 10); // Small delay to ensure the scale transition starts

        // Remove the word after the animation is complete
        setTimeout(() => {
            wordElement.remove();
        }, 2000); // Wait for 2 seconds before removing

        // Update the index for the next word
        index = (index + 1) % words.length; // Loop through the words
    }, 1000); // Spawn a new word every second
}

// Example usage
const wordsArray = ["Fire", "Warmth", "Gather", "Share", "Light"];
spawnCampfire(wordsArray);