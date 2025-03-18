document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    const asciiElements = [
        "{{}}",
        "{}",
        "~Y~",
        "|",
        "^^^^^^",
        "I miss you everyday baby..."
    ];
    let existingDivPositions = [];
    let openedWindows = [];

    // Create random divs
    function createRandomDivs(count) {
        for (let i = 0; i < count; i++) {
            const div = document.createElement('div');
            div.className = 'content-div';
            
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
            
            container.appendChild(div);
            
            // Store the content but don't start typing yet
            div.dataset.content = asciiElements[Math.floor(Math.random() * asciiElements.length)];
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
        container.appendChild(spawnText);

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

    // Check visibility and trigger typewriter effect
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.typed) {
                entry.target.style.opacity = '1';
                // Start typewriter effect
                new Typewriter(entry.target, {
                    delay: 50,
                    cursor: ''
                })
                .typeString(entry.target.dataset.content)
                .start();
                
                // Mark as typed so we don't repeat the animation
                entry.target.dataset.typed = 'true';
            } else if (!entry.isIntersecting) {
                entry.target.style.opacity = '0';
                // Reset typed status when out of view
                if (!entry.target.dataset.keepTyped) {
                    entry.target.dataset.typed = '';
                    entry.target.innerHTML = '';
                }
            }
        });
    }, {
        threshold: 0.1
    });

    // Create initial divs
    createRandomDivs(50); // Increased number for more scattered elements

    // Observe all content divs
    document.querySelectorAll('.content-div').forEach(div => {
        observer.observe(div);
    });
});