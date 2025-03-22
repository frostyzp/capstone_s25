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
        "I miss you everyday baby...",
        "Thank you for checking on me, everything will be alright.\nHave a great evening and see you tomorrow.",
        "Thank you for being a part of the group project!",
        "Happy birthday...",
        "Please just tell me that you're safe. I'll get over it if you really don't want to tell me where you are. Whatever you're doing I'm not mad, I'm just scared that you aren't ok.",
        "We always said in another life. We tried this one and it wasn't meant to be. Maybe in the next one we'll finally get there like we always thought",
        "love you bb",
        "Perhaps you're the same.\n Ever since we've been friends, I can't help but feel my feelings growing you each day. Knowing you're in a relationship broke my heart.",
        "Please remember how much I love you.",
        "I wish there was more",
        "Who are you?",
        "Mama Papa I see them… the angels",
        "I'm so tired. Can I go now?",
        "I love you, and I'm so proud of you"
    ];
    let existingDivPositions = [];
    let openedWindows = [];

    // Create random divs
    function createRandomDivs(count) {
        for (let i = 0; i < count; i++) {
            const div = document.createElement('div');
            // Randomly assign either content-div or content-div-2 class
            div.className = Math.random() < 0.5 ? 'content-div' : 'content-div-2';
            
            // Keep trying until we find a non-overlapping position
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
            
            // Store the actual content in dataset but display '***'
            div.dataset.content = asciiElements[Math.floor(Math.random() * asciiElements.length)];
            div.textContent = '';
            div.style.cursor = 'pointer';

            // Add click/tap handler for all divs
            div.addEventListener('click', function() {
                if (!this.dataset.revealed) {
                    this.dataset.revealed = 'true';
                    // Clear the *** and start typewriter
                    this.textContent = '';
                    new Typewriter(this, {
                        delay: 50,
                        cursor: ''
                    })
                    .typeString(this.dataset.content)
                    .start();
                }
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

    // Modify the observer to not automatically start typewriter
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
            } else {
                entry.target.style.opacity = '0';
                // Reset to *** if not revealed yet
                if (!entry.target.dataset.revealed) {
                    entry.target.textContent = '^ -- ^ -- ^';
                }
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