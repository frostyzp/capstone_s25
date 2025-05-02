document.addEventListener('DOMContentLoaded', () => {
    // Add audio element
    const audio = document.createElement('audio');
    audio.src = 'graveyard.mp3'; // Audio file for graveyard ambiance
    audio.loop = true;
    audio.volume = 0.5;
    document.body.appendChild(audio);

    const container = document.getElementById('canvas-container');
    const graveyardCount = document.getElementsByClassName('graveyard-count')[0];
    const grainedElement = document.getElementsByClassName('grained-element')[0];
    const buryEntry = document.getElementById('bury_entry');
    const graveyardMain = document.getElementsByClassName('graveyardMain')[0];
    const introText = document.querySelector('.intro-text');
    const enterText = document.getElementById('enter');
    const mainTitle = document.querySelector('.main-title');

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
        "I love you, and I'm so proud of you",
        "It was nice to hear that your laugh never changed",
        "You had the kindest smile, eyes, and nature. I'm sorry you had to go through it alone",
        "Good luck to u! Hope Chicago treats you well",
        "I heard (the gist of) what happened… I love u, I'm here for you, and I wanna see if you're okay. let me know if you need anything, even if you j want to talk ILY",
        "Hi just wanted to check in and see how you are doing. Been thinking about messaging you a few times this year, hope u r happy n well",
        "Our snap streak is dying",
        "Why didn't you unfollow me everywhere if you were just gonna ghost me",
        "But I want YOU to be my Valentines. No one can replace you",
        "I hope we can both get closure."
    ];
    let existingDivPositions = [];
    let messageIndex = 0; // Track current message index
    const asciiLandscape = [
        "{{}}",
        "{}",
        "|",
        "^^^^^^",
        "              v .   ._, |_  .,\n           `-._\\/  .  \\ /    |/_\n               \\\\  _\\, y | \//\n         _\\_.___\\\\, \\/ -.\\||\n           `7-,--.`._||  / / ,\n           /'     `-. `./ / |/_.'\n                     |    |//\n                     |_    /\n                     |-   |\n                     |   =|\n                     |    |\n--------------------/ ,  . \\--",
        "{}",
        "~Y~",
        "              v .   ._, |_  .,\n           `-._\\/  .  \\ /    |/_\n               \\\\  _\\, y | \//\n         _\\_.___\\\\, \\/ -.\\||\n           `7-,--.`._||  / / ,\n           /'     `-. `./ / |/_.'\n                     |    |//\n                     |_    /\n                     |-   |\n                     |   =|\n                     |    |\n--------------------/ ,  . \\--",
        "*",
        "{{}}\n{}\n~Y~\n|\n^^^^^^",
        "{ { } }\n{}\n~Y~\n|\n^^^^^^",
        "~Y~",
        "|",
        "^^^^^^",
        "\*/",
        "*\n^\n^",
        "{{}}\n{}\n~Y~\n|\n^^^^^^",
    ];

    const driftingTexts = [
        "The intimacy of having never \ntalked again…",
        "The bond of absence",
        "The silence",
        "\nyou carry around",
        "The ghost of nothing but\n time\n and memory",
        "Memory and time, \nsuspended",
        "Presence",
        "Remains\nand imprints",
        "w h i s p e r",
    ];

    // Add typewriter effect to intro text
    const introTypewriter = new Typewriter(introText, {
        delay: 50,
        cursor: ''
    });
    introTypewriter
        .typeString('how intimate lies within the bond of absence, the silence we carry around?')
        .pauseFor(500)
        .typeString('<br>View the gravestones by tapping.')
        .start();

    // Add typewriter effect to enter text
    const enterTypewriter = new Typewriter(enterText, {
        delay: 50,
        cursor: ''
    });
    enterTypewriter
        .typeString('( explore the graveyard )')
        .start();

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
            const content = asciiElements[messageIndex];
            messageIndex = (messageIndex + 1) % asciiElements.length; // Increment and wrap around
            const formattedContent = formatTextContent(content);
            
            // Replace the last line with 'w' or 'v'
            const lines = formattedContent.split('\n');
            if (lines.length > 0) {
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

            // Function to update feFlood values
            function updatePixelateFilter(x, y) {
                const filter = document.querySelector('#pixelate feFlood');
                if (filter) {
                    filter.setAttribute('x', x);
                    filter.setAttribute('y', y);
                }
            }

            // For desktop, reveal based on mouse position with opacity
            contentDiv.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const content = this.dataset.content;
                const asciiCover = this.dataset.asciiCover;
                
                const progress = x / rect.width;
                const revealAmount = Math.floor(progress * content.length);
                const newOpacity = 0.3 + (progress * 0.7);
                this.style.opacity = newOpacity.toString();
                
                // Update feFlood values based on progress
                const newX = Math.max(0, 4 - (progress * 4));
                const newY = Math.max(0, 4 - (progress * 4));
                updatePixelateFilter(newX, newY);
                
                // Direct text update without typewriter
                const revealedText = content.substring(0, revealAmount);
                const remainingAscii = asciiCover.substring(revealAmount);
                
                // Create a span for the revealed text with glow effect
                const revealedSpan = document.createElement('span');
                revealedSpan.textContent = revealedText;
                revealedSpan.style.textShadow = '0 0 10px white, 0 0 20px white, 0 0 30px white';
                revealedSpan.style.zIndex = '1000';
                
                // Create a span for the remaining ASCII
                const asciiSpan = document.createElement('span');
                asciiSpan.textContent = remainingAscii;
                
                // Clear and update content
                this.innerHTML = '';
                this.appendChild(revealedSpan);
                this.appendChild(asciiSpan);
            });

            contentDiv.addEventListener('mouseleave', function() {
                const revealedChars = parseInt(this.dataset.revealedChars);
                const content = this.dataset.content;
                const asciiCover = this.dataset.asciiCover;
                
                const progress = revealedChars / content.length;
                const savedOpacity = 0.3 + (progress * 0.7);
                this.style.opacity = savedOpacity.toString();
                
                // Reset feFlood values
                updatePixelateFilter(4, 4);
                
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

            // Check if this is one of the special text elements
            const isSpecialText = content.includes('\n') && !content.includes('\\') && !content.includes('/');
            
            if (isSpecialText) {
                // For special text, just add the landscape div
                wrapper.appendChild(landscapeDiv);
                observer.observe(landscapeDiv);
            } else {
                // For regular elements, create perpendicular div
                const perpendicularDiv = document.createElement('div');
                perpendicularDiv.className = 'content-div-landscape';
                
                perpendicularDiv.style.left = `${xPos}px`;
                perpendicularDiv.style.top = `${yPos}px`;
                perpendicularDiv.style.transform = 'skewY(-20deg) translateZ(20px)';
                
                perpendicularDiv.textContent = content;
                perpendicularDiv.dataset.content = content;
                perpendicularDiv.style.whiteSpace = 'pre';

                // Add floating animation for special characters
                if (content === '*' || content === '* *') {
                    landscapeDiv.style.animation = 'float 2s steps(4) infinite';
                    perpendicularDiv.style.animation = 'float 2s steps(4) infinite';
                    wrapper.style.animation = 'float 2s 2s steps(4) infinite';
                }

                wrapper.appendChild(landscapeDiv);
                wrapper.appendChild(perpendicularDiv);
                observer.observe(landscapeDiv);
                observer.observe(perpendicularDiv);
            }

            container.appendChild(wrapper);
        }
    }

    function createDriftingTexts(count) {
        for (let i = 0; i < count; i++) {
            const wrapper = document.createElement('div');
            wrapper.className = 'drifting-wrapper';
            
            const driftingDiv = document.createElement('div');
            driftingDiv.className = 'content-div-landscape';
            
            // Random positioning within the viewport
            const xPos = Math.random() * (container.offsetWidth - 200);
            const yPos = Math.random() * (container.offsetHeight - 50);
            
            driftingDiv.style.left = `${xPos}px`;
            driftingDiv.style.top = `${yPos}px`;
            driftingDiv.style.transform = 'skewY(-20deg) translateZ(20px)';
            
            const content = driftingTexts[Math.floor(Math.random() * driftingTexts.length)];
            driftingDiv.textContent = content;
            driftingDiv.dataset.content = content;
            driftingDiv.style.whiteSpace = 'pre';
            driftingDiv.style.animation = 'windBlow 10s steps(4) infinite';
            
            wrapper.appendChild(driftingDiv);
            container.appendChild(wrapper);
            observer.observe(driftingDiv);
        }
    }

    // Click event listener for "Scroll to enter"
    enterText.addEventListener('click', function() {
        // Start playing the music
        audio.play().catch(error => {
            console.log('Audio playback failed:', error);
        });

        // Make the canvas container visible again
        // Fade out graveyardCount over 2 seconds
        if (graveyardMain) {
            graveyardMain.style.transition = 'opacity 1s ease-in-out';
            graveyardMain.style.opacity = '0';
        }

        if (container) {
            container.style.transition = 'opacity 1s ease-in-out';
            container.style.display = 'block';
            container.style.visibility = 'visible';
        }

        if (graveyardCount) {
            graveyardCount.style.transition = 'opacity 2s ease-in-out';
            graveyardCount.style.opacity = '0';
        }

        if (mainTitle) {
            mainTitle.style.transition = 'opacity 1s ease-in-out';
            mainTitle.style.opacity = '0';
        }

        // Use requestAnimationFrame for smoother transitions
        const fadeOut = () => {
            graveyardCount.style.display = 'none';

            grainedElement.style.opacity = '1';
            grainedElement.style.visibility = 'visible';
            grainedElement.style.display = 'block';
            grainedElement.style.transition = 'opacity 0.5s ease-in-out';
            grainedElement.style.opacity = '1';

            // Show the bury entry after a delay
            setTimeout(() => {
                buryEntry.classList.add('visible');
            }, 2000);
        };

        setTimeout(() => {
            requestAnimationFrame(fadeOut);
        }, 2500);

        const style = document.createElement('style');
        style.textContent = `
            body {
                background: radial-gradient(circle, rgba(2, 15, 4, 0.95), rgba(0, 0, 0, 1));
            }
        `;
        document.head.appendChild(style);
        createLandscapeElements(350);
        createRandomDivs(45);
        createDriftingTexts(15); // Add drifting texts
    });


    // BURY ENTRY MODAL - CONTRIBUTE TO THE GRAVEYARD ------------------------------------------------------------
    buryEntry.addEventListener('click', function() {
        const modal = document.querySelector('.bury-modal');
        const form = modal.querySelector('.bury-modal-form');
        const closeButton = modal.querySelector('.bury-modal-close');
        const textarea = modal.querySelector('.bury-modal-textarea');
        const title = modal.querySelector('.bury-modal-title');
        const buryButton = modal.querySelector('.bury-modal-submit');

        // Show the modal
        modal.style.display = 'flex';

        // Handle close button
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
            // Reset modal state
            title.textContent = 'Contribute to the cemetery';
            form.style.display = 'flex';
            textarea.style.display = 'block';
            closeButton.style.display = 'block';
            buryButton.style.display = 'block';
        });

        // Handle bury button click
        buryButton.addEventListener('click', () => {
            const message = textarea.value.trim();
            if (message) {
                // Add the new message to the asciiElements array
                asciiElements.push(message);
                title.textContent = 'your words will be buried and preserved';

                // Hide form elements
                form.style.display = 'none';
                textarea.style.display = 'none';
                closeButton.style.display = 'none';
                buryButton.style.display = 'none';
                textarea.value = '';
                
                // Close modal after delay
                setTimeout(() => {
                    modal.style.display = 'none';
                    // Reset modal state
                    title.textContent = 'Contribute to the cemetery';
                    form.style.display = 'flex';
                    textarea.style.display = 'block';
                    closeButton.style.display = 'block';
                    buryButton.style.display = 'block';
                }, 5000);
            }
        });
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


