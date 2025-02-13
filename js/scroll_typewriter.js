// Typewriter effect function
// The Intersection Observer is a web API that lets us efficiently detect when elements enter the viewport (become visible on screen).
function createTypewriterEffect(element, textArray, options = {loop: false, delay: 50, cursor: ""}) {
    if (!element) {
        console.error(`Element not found.`);
        return;
    }
   
    const typewriter = new Typewriter(element, options);
  
    textArray.forEach((line, index) => {
        typewriter.typeString(line);
        if (index < textArray.length - 1) {
            typewriter.typeString('<br>');
        }
    });

    typewriter.start();
}

// Intersection Observer: Watches for elements becoming visible in the viewport
// Think of it like a security camera that tells us when elements come into view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // entry.isIntersecting is true when element is visible
        if (entry.isIntersecting) {
            const element = entry.target;
            const textArray = element.dataset.text.split('|');
            
            // Clear the element's content
            element.innerHTML = '';
            
            // Create typewriter effect
            createTypewriterEffect(element, textArray, {
                loop: false,
                delay: 100,
                cursor: ""
            });
            
            // Stop watching this element since we only want to animate once
            observer.unobserve(element);
        }
    });
}, {
    threshold: 0.5  // Trigger when element is 50% visible
});

// When the page loads, start watching all stanza elements
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.stanza').forEach(stanza => {
        observer.observe(stanza);
    });
}); 