document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    const asciiElements = [
        "{{}}",
        "{}",
        "~Y~",
        "|",
        "^^^^^^",
        "{{}}",
        "{}",
        "~Y~",
        "|",
        "^^^^^^",
        "{{}}",
        "{}",
        "~Y~",
        "|",
        "^^^^^^",
        "I miss you \neveryday baby...",
        "Thank you for checking on me, everything will be alright.\nHave a great evening and see you tomorrow.",
        "Happy birthday...",
        "Please just tell me that you're safe.\n I'll get over it if you really don't\n want to tell me where you are.\n Whatever you're doing I'm not mad,\n I'm just scared that you aren't ok.",
        "We always said in another life.\n We tried this one and it wasn't meant to be.\n Maybe in the next one we'll finally \nget there like we always thought",
        "love you bb",
        "Perhaps you're the same.\n Ever since we've been friends, \nI can't help but feel my feelings growing you each day. \nKnowing you're in a relationship broke my heart.",
        "Please remember how\n much I love you.",
        "I wish there was more",
        "Who are you?",
        "Mama Papa \nI see them…\n the angels",
        "I'm so tired. \nCan I go now?",
        "I love you, \nand I'm so proud of you"
    ];
    let existingDivPositions = [];
    let openedWindows = [];

    // Create random divs
    function createRandomDivs(count) {
        // Function to generate random ASCII art of specific length
        function generateASCIICover(content) {
            const asciiChars = ['~', '^', '{', '}', '|', '*', '+', '-', '>', '<', '/', '\\'];
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

        for (let i = 0; i < count; i++) {
            const div = document.createElement('div');
            div.className = Math.random() < 0.5 ? 'content-div' : 'content-div-2';
            
            // Position logic remains the same
            let position;
            do {
                position = {
                    x: Math.random() * (container.offsetWidth - 200),
                    y: Math.random() * (container.offsetHeight - 100)
                };
            } while (checkOverlap(position));

            existingDivPositions.push({
                x: position.x,
                y: position.y,
                width: 200,
                height: 100
            });

            div.style.left = `${position.x}px`;
            div.style.top = `${position.y}px`;
            
            // Store the actual content and generate matching ASCII cover
            const content = asciiElements[Math.floor(Math.random() * asciiElements.length)];
            const asciiCover = generateASCIICover(content);
            div.dataset.content = content;
            div.dataset.asciiCover = asciiCover;
            div.dataset.revealedChars = '0';
            div.textContent = asciiCover;
            div.style.whiteSpace = 'pre'; // Preserve ASCII art formatting

            // Touch handling for swipe reveals
            let touchStartX = 0;
            let touchStartY = 0;

            div.addEventListener('touchstart', function(e) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            });

            div.addEventListener('touchmove', function(e) {
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
                    Math.floor(currentRevealed + (distance / 5)) // Made more sensitive
                );

                if (newRevealed > currentRevealed) {
                    this.dataset.revealedChars = newRevealed.toString();
                    // Combine revealed content with remaining ASCII cover
                    const revealedText = content.substring(0, newRevealed);
                    const remainingAscii = asciiCover.substring(newRevealed);
                    this.textContent = revealedText + remainingAscii;
                }

                // Update start position for next movement
                touchStartX = touchEndX;
                touchStartY = touchEndY;
            });

            // For desktop, reveal based on mouse position
            div.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const content = this.dataset.content;
                const asciiCover = this.dataset.asciiCover;
                
                // Calculate reveal amount based on horizontal position
                const revealAmount = Math.floor((x / rect.width) * content.length);
                const revealedText = content.substring(0, revealAmount);
                const remainingAscii = asciiCover.substring(revealAmount);
                this.textContent = revealedText + remainingAscii;
            });

            div.addEventListener('mouseleave', function() {
                const revealedChars = parseInt(this.dataset.revealedChars);
                const content = this.dataset.content;
                const asciiCover = this.dataset.asciiCover;
                
                // Show partially revealed state or full ASCII cover
                const revealedText = content.substring(0, revealedChars);
                const remainingAscii = asciiCover.substring(revealedChars);
                this.textContent = revealedText + remainingAscii;
            });
            
            container.appendChild(div);
        }
    }

    // Check for div overlap
    function checkOverlap(newPos) {
        const buffer = 50;
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

    // Handle tap/click events
    let isHolding = false;
    let holdTimeout;

    container.addEventListener('mousedown', (e) => {
        isHolding = true;
        const tapText = document.createElement('div');
        tapText.className = 'tap-text';
        tapText.style.left = `${e.pageX}px`;
        tapText.style.top = `${e.pageY}px`;
        container.appendChild(tapText);

        // Spawn ^^^^ at the initial position
        const spawnText = document.createElement('div');
        spawnText.className = 'tap-text';
        spawnText.style.left = `${e.pageX}px`;
        spawnText.style.top = `${e.pageY}px`;
        // container.appendChild(spawnText);

        new Typewriter(spawnText, {
            delay: 0,
            cursor: ''
        })
        .typeString('^o^^o^') // Spawned text
        .start();

        holdTimeout = setTimeout(() => {
            const moveHandler = (moveEvent) => {
                if (isHolding) {
                    spawnText.style.left = `${moveEvent.pageX}px`;
                    spawnText.style.top = `${moveEvent.pageY}px`;
                }
            };

            const releaseHandler = () => {
                isHolding = false;
                container.removeEventListener('mousemove', moveHandler);
                container.removeEventListener('mouseup', releaseHandler);
                clearTimeout(holdTimeout);
                setTimeout(() => {
                    tapText.style.opacity = '0';
                    setTimeout(() => tapText.remove(), 1000);
                }, 10000);
            };

            container.addEventListener('mousemove', moveHandler);
            container.addEventListener('mouseup', releaseHandler);
        }, 0);
    });

    // Modify the observer to maintain partially revealed state
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                const revealedChars = parseInt(entry.target.dataset.revealedChars);
                const content = entry.target.dataset.content;
                const asciiCover = entry.target.dataset.asciiCover;
                
                // Maintain partially revealed state
                const revealedText = content.substring(0, revealedChars);
                const remainingAscii = asciiCover.substring(revealedChars);
                entry.target.textContent = revealedText + remainingAscii;
            } else {
                entry.target.style.opacity = '0';
            }
        });
    }, {
        threshold: 0.1
    });

    // Create initial divs
    createRandomDivs(80); // Increased number for more scattered elements

    // Observe all content divs
    document.querySelectorAll('.content-div, .content-div-2').forEach(div => {
        observer.observe(div);
    });
});