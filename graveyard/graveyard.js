document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    const asciiElements = [
        "  ^  ",
        " ^^^ ",
        "^^^^^",
        "  |  ",
        "~~~~~",
        "  ^  ",
        " ^^^ ",
        "^^^^^",
        "  |  ",
        "~~~~~",
        "  ^  ",
        " ^^^ ",
        "^^^^^",
        "  |  ",
        "~~~~~",
        "  ^  ",
        " ^^^ ",
        "^^^^^",
        "  |  ",
        "~~~~~",
        "  ^  ",
        " ^^^ ",
        "^^^^^",
        "  |  ",
        "~~~~~",
        "I miss you everyday baby...",
        "Thank you for checking on me, everything will be alright.\nHave a great evening and see you tomorrow.",
        "Thank you \nfor being a part \nof the group project!",
        "Happy birthday...",
        "Please just tell me that you're safe. \nI'll get over it if you really \ndon't want to tell me where you are. \nWhatever you're doing I'm not mad, \nI'm just scared that you aren't ok.",
        "We always said in another life. \nWe tried this one and it wasn't meant to be. \nMaybe in the next one we'll finally get there like we always thought",
        "love you bb",
        "Perhaps you're the same.\n Ever since we've been friends, \nI can't help but feel my feelings growing for you each day. \nKnowing you're in a relationship broke my heart.",
        "Please remember \nhow much I love you.",
        "I wish there \nwas more",
        "Who are you?",
        "Mama Papa I see them… \nthe angels",
        "I'm so tired. \nCan I go now?",
        "I love you,\n and I'm so proud of you"
    ];
    let existingDivPositions = [];
    let openedWindows = [];

    // Create random divs
    function createRandomDivs(count) {
        for (let i = 0; i < count; i++) {
            const div = document.createElement('div');
            // Randomly assign different classes
            const classTypes = ['content-div', 'content-div-2'];
            const randomClass = classTypes[Math.floor(Math.random() * classTypes.length)];
            div.className = randomClass;
            
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

        const content = div.dataset.content;
        if (content === "{{}}") {
            div.style.cursor = 'pointer'; // Change cursor to pointer for clickable effect
            div.addEventListener('click', (event) => {
                // Create modal
                const modal = document.createElement('div');
                modal.style.position = 'fixed';
                modal.style.top = `${event.clientY}px`; // Position modal at the click location
                modal.style.left = `${event.clientX}px`; // Position modal at the click location
                modal.style.transform = 'translate(-50%, -50%)'; // Adjust position to center the modal
                modal.style.width = '300px'; // Set a fixed width for the modal
                modal.style.height = '200px'; // Set a fixed height for the modal
                modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                modal.style.display = 'flex';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
                modal.style.zIndex = '1000';

                // Create modal content
                const modalContent = document.createElement('div');
                modalContent.style.backgroundColor = 'white';
                modalContent.style.padding = '20px';
                modalContent.style.borderRadius = '5px';
                modalContent.style.color = 'black';
                modalContent.innerText = 'This is a pop-up modal!';

                // Create close button
                const closeButton = document.createElement('button');
                closeButton.innerText = 'Close';
                closeButton.style.marginTop = '10px';
                closeButton.addEventListener('click', () => {
                    modal.remove(); // Remove modal on close
                });

                modalContent.appendChild(closeButton);
                modal.appendChild(modalContent);
                document.body.appendChild(modal);
            });
        }

        }
    }

    // Check for div overlap
    function checkOverlap(newPos) {
        const buffer = 15; // Reduced buffer for less spacing
        for (let pos of existingDivPositions) {
            if (!(newPos.x + 200 + buffer < pos.x || newPos.x > pos.x + pos.width + buffer || newPos.y + 100 + buffer < pos.y || newPos.y > pos.y + pos.height + buffer)) {
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
                    delay: 80,
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
    createRandomDivs(120); // Increased number for more scattered elements
    // The observe method is used to watch for visibility changes of the target elements.
    // Here, we are observing all content divs to trigger animations when they come into view.
    document.querySelectorAll('.content-div, .content-div-2').forEach(div => {
        observer.observe(div);
    });
});