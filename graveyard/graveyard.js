document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    const graveyardCount = document.getElementsByClassName('graveyard-count')[0];
    const grainedElement = document.getElementsByClassName('grained-element')[0];
    const buryEntry = document.getElementById('bury_entry');
    const graveyardMain = document.getElementsByClassName('graveyardMain')[0];
    const asciiElements = [
        "I miss you everyday baby...",
        "Thank you for checking on me, everything will be alright. Have a great evening and see you tomorrow.",
        "Happy birthday...",
        "Please just tell me that you're safe. I'll get over it if you really don't want to tell me where you are. Whatever you're doing I'm not mad, I'm just scared that you aren't ok.",
        "We always said in another life. We tried this one and it wasn't meant to be. Maybe in the next one we'll finally get there like we always thought",
        "love you bb",
        "I can't help but feel my feelings growing you each day. Knowing you're in a relationship broke my heart.",
        "Please remember how much I love you.",
        "I wish there was more",
        "Who are you?",
        "Mama Papa I see them… the angels ^^^^^^^^",
        "I'm so tired. Can I go now?",
        "I love you, and I'm so proud of you"
    ];
    let existingDivPositions = [];
    const asciiLandscape = [
        "{{}}",
        "{}",
        "w h i s p e r",
        "|",
        "^^^^^^",
        "              v .   ._, |_  .,\n           `-._\\/  .  \\ /    |/_\n               \\\\  _\\, y | \//\n         _\\_.___\\\\, \\/ -.\\||\n           `7-,--.`._||  / / ,\n           /'     `-. `./ / |/_.'\n                     |    |//\n                     |_    /\n                     |-   |\n                     |   =|\n                     |    |\n--------------------/ ,  . \\--",
        "{}",
        "~Y~",
        "|",
        "*",
        "* *",
        "{{}}\n{}\n~Y~\n|\n^^^^^^",
        "{ { } }",
        "{}",
        "~Y~",
        "|",
        "^^^^^^",
        "*",
        "* *",
        "{{}}\n{}\n~Y~\n|\n^^^^^^",
    ];


// install js libraries

    // COVER FOR RANDOM DIVS
    function createRandomDivs(count) {
        // Function to generate random ASCII art of specific length
        function generateASCIICover(content) {
            const asciiChars = ['\\', 'x', '/', '\\'];
            let result = '';
            // Process the content character by character
            for (let i = 0; i < content.length; i++) {
                // If we encounter a newline, preserve it in the ASCII cover
                if (content[i] === '\n') {
                    result += '\n';
                } else {
                    result += asciiChars[Math.floor(Math.random() * asciiChars.length)];
                }
            }
            return result;
        }

        function formatTextContent(text) {
            const MAX_WIDTH = 15; // Characters per line
            const HORIZONTAL_LINE = '^'.repeat(MAX_WIDTH + 2); // +2 for the vertical bars
            
            // Split input text into initial lines
            const inputLines = text.split('\n');
            const resultLines = [];
            
            // Add horizontal line at the top
            resultLines.push(HORIZONTAL_LINE);
            
            inputLines.forEach(line => {
                const words = line.trim().split(/\s+/);
                let currentLine = [];
                let currentLength = 0;
                
                // Process words to create wrapped lines
                words.forEach(word => {
                    const spaceNeeded = currentLine.length > 0 ? 1 : 0;
                    if (currentLength + spaceNeeded + word.length <= MAX_WIDTH) {
                        if (currentLine.length > 0) {
                            currentLine.push(' ');
                            currentLength += 1;
                        }
                        currentLine.push(word);
                        currentLength += word.length;
                    } else {
                        // Line is full, justify it if it has multiple words
                        if (currentLine.length > 0) {
                            const lineText = currentLine.join('');
                            if (lineText.split(/\s+/).length > 1) {
                                const spaces = MAX_WIDTH - lineText.length;
                                const gaps = lineText.split(/\s+/).length - 1;
                                const spacesPerGap = Math.floor(spaces / gaps);
                                const extraSpaces = spaces % gaps;
                                
                                const justifiedWords = lineText.split(/\s+/);
                                const justifiedLine = justifiedWords.map((word, i) => {
                                    if (i === justifiedWords.length - 1) return word;
                                    return word + ' '.repeat(1 + spacesPerGap + (i < extraSpaces ? 1 : 0));
                                }).join('');
                                
                                // Add vertical bars to the justified line
                                resultLines.push(`|${justifiedLine.padEnd(MAX_WIDTH)}|`);
                            } else {
                                // Add vertical bars to single word line
                                resultLines.push(`|${lineText.padEnd(MAX_WIDTH)}|`);
                            }
                        }
                        
                        currentLine = [word];
                        currentLength = word.length;
                    }
                });
                
                // Handle the last line
                if (currentLine.length > 0) {
                    const lineText = currentLine.join('');
                    // Add vertical bars to the last line
                    resultLines.push(`|${lineText.padEnd(MAX_WIDTH)}|`);
                }
            });
            
            // Add horizontal line at the bottom
            resultLines.push(HORIZONTAL_LINE);
            
            return resultLines.join('\n');
        }

        for (let i = 0; i < count; i++) {
            const wrapper = document.createElement('div');
            wrapper.className = 'content-wrapper';
            
            const contentDiv = document.createElement('div');
            contentDiv.className = Math.random() < 0.5 ? 'content-div' : 'content-div-2';
            
            // Set initial opacity only (since this is dynamic)
            contentDiv.style.opacity = '0.3';

            // Position logic remains the same
            let position;
            do {
                position = {
                    x: Math.random() * (container.offsetWidth - 300),
                    y: Math.random() * (container.offsetHeight - 200)
                };
            } while (checkOverlap(position));

            existingDivPositions.push({
                x: position.x,
                y: position.y,
                width: 100,
                height: 100
            });

            // Position styles (these need to be dynamic)
            contentDiv.style.left = `${position.x}px`;
            contentDiv.style.top = `${position.y}px`;
            
            // Store the actual content and generate matching ASCII cover
            const content = asciiElements[Math.floor(Math.random() * asciiElements.length)];
            const formattedContent = formatTextContent(content);
            
            // Replace the last line with 'w' or 'v'
            const lines = formattedContent.split('\n');
            if (lines.length > 0) {
                // Replace the last line with 'w' or 'v'
                lines[lines.length - 1] = Math.random() < 0.5 ? 'wwwvvWW v vvww' : 'vwwWWvwvv v vvWw';
            }
            const adjustedFormattedContent = lines.join('\n'); // Join lines back
            
            const asciiCover = generateASCIICover(adjustedFormattedContent);
            
            // Create wrapper for each line
            const contentLines = adjustedFormattedContent.split('\n');
            contentDiv.innerHTML = ''; // Clear existing content
            contentLines.forEach(line => {
                const lineDiv = document.createElement('div');
                lineDiv.className = 'text-line';
                lineDiv.textContent = line;
                contentDiv.appendChild(lineDiv);
            });

            // Store formatted content in dataset
            contentDiv.dataset.content = adjustedFormattedContent;
            contentDiv.dataset.asciiCover = asciiCover;
            contentDiv.dataset.revealedChars = '0';
            contentDiv.textContent = asciiCover;
            contentDiv.style.whiteSpace = 'pre'; // Preserve ASCII art formatting

            // For desktop, reveal based on mouse position with opacity
            contentDiv.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const content = this.dataset.content;
                const asciiCover = this.dataset.asciiCover;
                
                const progress = x / rect.width;
                const revealAmount = Math.floor(progress * content.length);
                const newOpacity = 0.3 + (progress * 0.7); // Opacity ranges from 0.3 to 1.0
                this.style.opacity = newOpacity.toString();
                
                // Direct text update without typewriter
                const revealedText = content.substring(0, revealAmount);
                const remainingAscii = asciiCover.substring(revealAmount);
                this.textContent = revealedText + remainingAscii;
            });

            contentDiv.addEventListener('mouseleave', function() {
                const revealedChars = parseInt(this.dataset.revealedChars);
                const content = this.dataset.content;
                const asciiCover = this.dataset.asciiCover;
                
                // Reset to saved progress opacity
                const progress = revealedChars / content.length;
                const savedOpacity = 0.3 + (progress * 0.7);
                this.style.opacity = savedOpacity.toString();
                
                // Direct text update without typewriter
                const revealedText = content.substring(0, revealedChars);
                const remainingAscii = asciiCover.substring(revealedChars);
                this.textContent = revealedText + remainingAscii;
            });

            wrapper.appendChild(contentDiv);
            container.appendChild(wrapper);
        }
    }

    // Check for div overlap
    function checkOverlap(newPos) {
        const buffer = 30;
        for (let pos of existingDivPositions) {
            if (!(newPos.x + 200 + buffer < pos.x || 
                newPos.x > pos.x + pos.width + buffer ||
                newPos.y + 100 + buffer < pos.y || 
                newPos.y > pos.y + pos.height + buffer)) {
                return true;
            }
        }
        return false;
    }

    // Update the observer to only handle initial appearance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('content-div-landscape')) {
                    // Handle landscape elements
                    if (!entry.target.dataset.typed) {
                        entry.target.dataset.typed = 'true';
                        const content = entry.target.dataset.content;
                        entry.target.textContent = '';  // Clear for typewriter
                        new Typewriter(entry.target, {
                            delay: 50,
                            cursor: ''
                        })
                        .typeString(content)
                        .start();
                    }
                } else {
                    const revealedChars = parseInt(entry.target.dataset.revealedChars);
                    const content = entry.target.dataset.content;
                    const asciiCover = entry.target.dataset.asciiCover;
                    
                    // Restore saved progress and opacity
                    const progress = revealedChars / content.length;
                    const savedOpacity = 0.3 + (progress * 0.7);
                    entry.target.style.opacity = savedOpacity.toString();
                    
                    // If not yet typed, start typewriter effect
                    if (!entry.target.dataset.typed) {
                        entry.target.dataset.typed = 'true';
                        entry.target.textContent = ''; // Clear existing content
                        new Typewriter(entry.target, {
                            delay: 80,
                            cursor: ''
                        })
                        .typeString(revealedChars > 0 ? 
                            content.substring(0, revealedChars) + asciiCover.substring(revealedChars) : 
                            asciiCover)
                        .start();
                    }
                }
                // Unobserve the element after it's been revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Create initial divs

    // Observe all content divs
    document.querySelectorAll('.content-div, .content-div-2, .content-div-landscape').forEach(div => {
        observer.observe(div);
    });

    // Simplified landscape element creation without overlap check
    function createLandscapeElements(count) {
        for (let i = 0; i < count; i++) {
            const wrapper = document.createElement('div');
            wrapper.className = 'landscape-wrapper';
            
            // Create horizontal div
            const landscapeDiv = document.createElement('div');
            landscapeDiv.className = 'content-div-landscape';
            
            // Simple random positioning
            const xPos = Math.random() * (container.offsetWidth - 200);
            const yPos = Math.random() * (container.offsetHeight - 50);
            
            landscapeDiv.style.left = `${xPos}px`;
            landscapeDiv.style.top = `${yPos}px`;
            
            const content = asciiLandscape[Math.floor(Math.random() * asciiLandscape.length)];
            landscapeDiv.textContent = content;
            landscapeDiv.dataset.content = content;
            landscapeDiv.style.whiteSpace = 'pre';

            // Change color to bright green if content is "*" or "* *"
            if (content === '*' || content === '* *') {
                landscapeDiv.style.color = 'lime'; // Bright green
                landscapeDiv.style.animation = 'float 2s ease-in-out infinite'; // Add floating animation
                wrapper.style.animation = 'float 2s ease-in-out infinite'; // Add floating animation
            }

            // Create perpendicular div with inverse skew
            const perpendicularDiv = document.createElement('div');
            perpendicularDiv.className = 'content-div-landscape';
            
            perpendicularDiv.style.left = `${xPos}px`;
            perpendicularDiv.style.top = `${yPos}px`;
            perpendicularDiv.style.transform = 'skewY(-20deg) translateZ(20px)';  // Inverse values
            
            perpendicularDiv.textContent = content;
            perpendicularDiv.dataset.content = content;
            perpendicularDiv.style.whiteSpace = 'pre';

            // Change color to bright green if content is "*" or "* *"
            if (content === '*' || content === '* *') {
                perpendicularDiv.style.color = 'lime'; // Bright green
            }

            wrapper.appendChild(landscapeDiv);
            wrapper.appendChild(perpendicularDiv);
            container.appendChild(wrapper);

            // Observe both divs for typewriter effect
            observer.observe(landscapeDiv);
            observer.observe(perpendicularDiv);
        } // Fixed bracket issue here
    }

    const enterText = document.getElementById('enter'); // Reference to the "Scroll to enter" text
    const buryText = document.getElementById('enter'); // Reference to the "Scroll to enter" text

    // Click event listener for "Scroll to enter"
    enterText.addEventListener('click', function() {
        // Make the canvas container visible again
        // Fade out graveyardCount over 2 seconds
        graveyardMain.style.transition = 'opacity 1s ease-in-out'; // Reduced transition time
        graveyardMain.style.opacity = '0';

        container.style.transition = 'opacity 1s ease-in-out'; // Reduced transition time
        container.style.display = 'block'; // Change to 'block' or 'flex' as needed
        container.style.visibility = 'visible'; // Ensure visibility is set to visible


        graveyardCount.style.transition = 'opacity 2s ease-in-out'; // Reduced transition time
        graveyardCount.style.opacity = '0';
        console.log('graveyardCount is not visible'); // Debugging log

        // buryEntry.style.display = 'block'; 

        // Use requestAnimationFrame for smoother transitions
        const fadeOut = () => {
            graveyardCount.style.display = 'none';

            grainedElement.style.opacity = '1';
            grainedElement.style.visibility = 'visible';
            grainedElement.style.display = 'block';
            // Fade in grainedElement over 0.5 seconds
            grainedElement.style.transition = 'opacity 0.5s ease-in-out';
            grainedElement.style.opacity = '1';
        };

        setTimeout(() => {
            requestAnimationFrame(fadeOut); // Use requestAnimationFrame for better performance
        }, 2500); // Wait for the fade-out to complete before hiding

        const style = document.createElement('style');
        style.textContent = `
            body {
                background: radial-gradient(circle, rgba(2, 15, 4, 0.95), rgba(0, 0, 0, 1)); /* Update background only */
            }
        `;
        document.head.appendChild(style);
        createLandscapeElements(350); // Reduced from 20
        createRandomDivs(45); // Reduced from 80

    });


    // BURY ENTRY MODAL - CONTRIBUTE TO THE GRAVEYARD ------------------------------------------------------------
    buryEntry.addEventListener('click', function() {

    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    modal.style.border = '2px solid #000';
    modal.style.padding = '20px';
    modal.style.zIndex = '1000';
    modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    modal.innerText = 'Contribute to the graveyard.';

    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.style.marginTop = '10px';
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.appendChild(closeButton);
    document.body.appendChild(modal);        

    });

    $(document).ready(function() {
        // Initialize Textillate.js on the element you want to animate
        $('.text-line').textillate({
            in: { effect: 'fadeIn', delayScale: 1.5, delay: 50 },
            out: { effect: 'fadeOut', delayScale: 1.5, delay: 50 },
            loop: true // Set to true if you want the animation to loop
        });
    });
});


