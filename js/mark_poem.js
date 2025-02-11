document.addEventListener("DOMContentLoaded", () => {
    let touchCounter = 0;
    const messages = [
        "First touch!", "Another mark left.", "You are creating a pattern.", "The screen is filling up!",
        "What are you drawing?", "Keep going...", "A masterpiece in progress.", "Is this abstract art?"
    ];
    
    document.addEventListener("touchstart", (event) => {
        touchCounter++;
        const touch = event.touches[0];
        
        const mark = document.createElement("div");
        mark.classList.add("touch-mark");
        mark.style.left = `${touch.clientX}px`;
        mark.style.top = `${touch.clientY}px`;
        document.body.appendChild(mark);

        // Initially set the opacity to 0 (to allow fade-in)
        mark.style.opacity = 0;

// Trigger the fade-in by setting opacity to 1
    setTimeout(() => {
    mark.style.opacity = 0.5;
    }, 10); // Small delay to allow the browser to apply the opacity change

// // After 1 second, fade-out and remove the element
// setTimeout(() => {
//     mark.style.opacity = 0;

//     // Wait for the opacity transition to finish before removing the element
//     setTimeout(() => {
//         mark.remove();
//     }, 500); // 500ms delay for opacity transition
// }, 1000); // 1 second delay before fade-out
        
        // Add the message below the last touch
        const message = document.createElement("p");
        message.classList.add("touch-message");
        message.textContent = messages[Math.min(touchCounter - 1, messages.length - 1)];
        message.style.left = `${touch.clientX}px`;
        message.style.top = `${touch.clientY + 30}px`;
        document.body.appendChild(message);

                // Initially set the opacity to 0 (to allow fade-in)
                message.style.opacity = 0;

                // Trigger the fade-in by setting opacity to 1
                    setTimeout(() => {
                        message.style.opacity = 0.5;
                    }, 10); // Small delay to allow the browser to apply the opacity change
    });
});