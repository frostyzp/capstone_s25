document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
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
    let openedWindows = [];

    const asciiLandscape = [
        "{{}}",
        "{}",
        "~Y~",
        "|",
        "^^^^^^",
        "              v .   ._, |_  .,\n           `-._\\/  .  \\ /    |/_\n               \\\\  _\\, y | \//\n         _\\_.___\\\\, \\/ -.\\||\n           `7-,--.`._||  / / ,\n           /'     `-. `./ / |/_.'\n                     |    |//\n                     |_    /\n                     |-   |\n                     |   =|\n                     |    |\n--------------------/ ,  . \\--",
        "{}",
        "~Y~",
        "|",
        "^^^^^^",
        "{{}}",
        "{}",
        "~Y~",
        "|",
        "^^^^^^"
    ];

    // Create random divs
    function createRandomDivs(count) {
        // Function to generate random ASCII art of specific length
        function generateASCIICover(content) {
            const asciiChars = ['~', '|', '/', '\\'];
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
            const HORIZONTAL_LINE = '-'.repeat(MAX_WIDTH + 2); // +2 for the vertical bars
            
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
            const asciiCover = generateASCIICover(formattedContent);
            
            // Create wrapper for each line
            const contentLines = formattedContent.split('\n');
            contentDiv.innerHTML = ''; // Clear existing content
            contentLines.forEach(line => {
                const lineDiv = document.createElement('div');
                lineDiv.className = 'text-line';
                lineDiv.textContent = line;
                contentDiv.appendChild(lineDiv);
            });

            // Store formatted content in dataset
            contentDiv.dataset.content = formattedContent;
            contentDiv.dataset.asciiCover = asciiCover;
            contentDiv.dataset.revealedChars = '0';
            contentDiv.textContent = asciiCover;
            contentDiv.style.whiteSpace = 'pre'; // Preserve ASCII art formatting

            // Touch handling with opacity
            let touchStartX = 0;
            let touchStartY = 0;

            contentDiv.addEventListener('touchstart', function(e) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            });

            contentDiv.addEventListener('touchmove', function(e) {
                e.preventDefault();
                const touchEndX = e.touches[0].clientX;
                const touchEndY = e.touches[0].clientY;
                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                const content = this.dataset.content;
                const asciiCover = this.dataset.asciiCover;
                const currentRevealed = parseInt(this.dataset.revealedChars);
                const newRevealed = Math.min(
                    content.length,
                    Math.floor(currentRevealed + (distance / 5))
                );

                if (newRevealed > currentRevealed) {
                    this.dataset.revealedChars = newRevealed.toString();
                    
                    // Calculate opacity based on reveal progress
                    const progress = newRevealed / content.length;
                    const newOpacity = 0.3 + (progress * 0.7);
                    this.style.opacity = newOpacity.toString();

                    // Direct text update without typewriter
                    const revealedText = content.substring(0, newRevealed);
                    const remainingAscii = asciiCover.substring(newRevealed);
                    this.textContent = revealedText + remainingAscii;
                }

                touchStartX = touchEndX;
                touchStartY = touchEndY;
            });

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

    // Update the observer to add typewriter effect for ASCII cover
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
            } else {
                entry.target.style.opacity = '0';
                entry.target.dataset.typed = ''; // Reset typed status when out of view
            }
        });
    }, {
        threshold: 0.1
    });

    // Create initial divs
    createRandomDivs(40); // Reduced from 80

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
            const xPos = Math.random() * (container.offsetWidth - 100);
            const yPos = Math.random() * (container.offsetHeight - 50);
            
            landscapeDiv.style.left = `${xPos}px`;
            landscapeDiv.style.top = `${yPos}px`;
            
            const content = asciiLandscape[Math.floor(Math.random() * asciiLandscape.length)];
            landscapeDiv.textContent = content;
            landscapeDiv.dataset.content = content;
            landscapeDiv.style.whiteSpace = 'pre';

            // Create perpendicular div with inverse skew
            const perpendicularDiv = document.createElement('div');
            perpendicularDiv.className = 'content-div-landscape';
            
            perpendicularDiv.style.left = `${xPos}px`;
            perpendicularDiv.style.top = `${yPos}px`;
            perpendicularDiv.style.transform = 'skewY(-20deg) translateZ(20px)';  // Inverse values
            
            perpendicularDiv.textContent = content;
            perpendicularDiv.dataset.content = content;
            perpendicularDiv.style.whiteSpace = 'pre';

            wrapper.appendChild(landscapeDiv);
            wrapper.appendChild(perpendicularDiv);
            container.appendChild(wrapper);

            // Observe both divs for typewriter effect
            observer.observe(landscapeDiv);
            observer.observe(perpendicularDiv);
        }
    }

    // Create landscape elements
    createLandscapeElements(150); // Reduced from 20
});



