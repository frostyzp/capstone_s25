// Updated createTypewriterEffect function
function createTypewriterEffect(textArray, options = { loop: false, delay: 50, cursor: "" }, className, customStyles = {}) {
    // Create a new div element for the typewriter effect
    const element = document.createElement("div");
  
    // Apply the given class (either "tree" or "tree2")
    element.classList.add(className);
  
    // Merge any custom inline styles (like positioning) with element's existing styles
    Object.assign(element.style, customStyles);
  
    // Add the new element to the document body
    document.body.appendChild(element);
  
    // Initialize the typewriter effect for this element
    const typewriter = new Typewriter(element, options);
  
    // Add each line of text to the typewriter effect
    textArray.forEach(line => {
      typewriter.typeString(line + "<br>");
    });
  
    // Start the typewriter animation
    typewriter.start();
  }
  
  // Define your two text arrays (each split into lines)
  const storyArr = [
    "*– <3 –*\n" +
    " –*–*– <3 <3 –*-*–\n" +
    " * <3 –<3 *\n" 
  ].join("\n").split("\n");
  
  const anotherStoryArr = [
    "*– <3 –*\n" +
    "  –*–*– <3 <3 –*-*–\n" +
    " * <3 –<3 *\n" 
  ].join("\n").split("\n");
  
  // Function to spawn two typewriter effects (tree and tree2) simultaneously at the same random location
  function spawnTypewriterPair() {
    // Generate a random horizontal position (left) on the screen
    const left = `${Math.random() * 80}vw`; // Random horizontal position within 80% of the viewport width
  
    // Optionally, you can also generate a random vertical position (top)
    const top = `${Math.random() * 80}vh`;  // Random vertical position within 80% of the viewport height
  
    // Create an object for the shared inline styles (positioning)
    const positionStyles = {
      position: "absolute",  // This makes the element's position relative to the nearest positioned ancestor (usually <body>)
      left: left,            // Random horizontal position (left)
      top: top               // Random vertical position (top)
    };
    // Both will use the same 'positionStyles' so they spawn together at the same random position.
    createTypewriterEffect(storyArr, { loop: false, delay: 50, cursor: "" }, "snow", positionStyles);
    createTypewriterEffect(anotherStoryArr, { loop: false, delay: 50, cursor: "" }, "snow2", positionStyles);
  }
  
  let pairCount = 0;
  const maxPairs = 35;  // How many pairs of typewriter effects you want to spawn
  const pairInterval = setInterval(() => {
    if (pairCount >= maxPairs) {
      clearInterval(pairInterval);  // Stop spawning after reaching the max number of pairs
      return;
    }
    spawnTypewriterPair();  // Call the function to spawn two typewriter effects
    pairCount++;            // Increment the pair counter
  }, 1500);  // Spawns a new pair every 1.5 seconds
  


  // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  
document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    let drawing = false;

    // Set canvas size to match the window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Start drawing
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchmove', draw);

    let strokes = []; // Array to store stroke data

    function startDrawing(e) {
        e.preventDefault(); // Prevent default touch behavior
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(getMousePos(e).x, getMousePos(e).y);
    }

    function stopDrawing(e) {
        e.preventDefault(); // Prevent default touch behavior
        drawing = false;
        ctx.closePath();
    }

    function draw(e) {
        e.preventDefault(); // Prevent default touch behavior
        if (!drawing) return;
        
        const pos = getMousePos(e);
        ctx.strokeStyle = 'rgba(250, 252, 255, 0.1)'; // Semi-transparent white
        ctx.lineWidth = 25; // Stroke width
        ctx.lineCap = 'round'; // Rounded ends
        
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        // Store the stroke data
        strokes.push({ x: pos.x, y: pos.y });
    }

    // Get mouse position
    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.touches ? e.touches[0].clientX : e.clientX; // Use touch position if available
        const y = e.touches ? e.touches[0].clientY : e.clientY; // Use touch position if available
        return {
            x: x - rect.left,
            y: y - rect.top
        };
    }

    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });



    document.getElementById('saveButton').addEventListener('click', () => {
        console.log('Save button clicked. Sending strokes to cloud...');
        performRightAction();
    });


    document.getElementById('requestPermissionButton').addEventListener('click', showPermissionModal);





    // Send strokes to cloud storage
    function sendStrokesToCloud() {
        fetch('YOUR_CLOUD_STORAGE_API_ENDPOINT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(strokes),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    // Call this function when you want to save the strokes, e.g., on a button click

    showPermissionModal(); // Show the permission modal when the page loads

    // Ensure the button exists before adding the event listener
    const requestPermissionButton = document.getElementById('requestPermissionButton');
    console.log('Request Permission Button:', requestPermissionButton); // Debugging line

    if (requestPermissionButton) {
        requestPermissionButton.addEventListener('click', function() {
            // Request device orientation permission
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission().then(response => {
                    if (response === 'granted') {
                        // Hide the modal and show the main content
                        document.getElementById('permissionModal').style.display = 'none';
                        document.getElementById('mainContent').style.display = 'block';
                    }
                }).catch(console.error);
            } else {
                // Automatically grant permission on non-mobile devices
                document.getElementById('permissionModal').style.display = 'none';
                document.getElementById('mainContent').style.display = 'block';
            }
        });
    } else {
        console.error('Request Permission Button not found!'); // Debugging line
    }
});

// Function to clear the canvas
function clearCanvas() {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
    strokes = []; // Reset the strokes array
    console.log('Canvas cleared.');
}

// Function to perform another action when tilted right
function nextWindow() {
    console.log('Tilted right! Performing another action...');
    document.body.style.backgroundImage = "url('window_bg.png')"; // Change background image to window_bg.png
    clearCanvas();
    // Add your desired action here
}

// Function to show the permission modal
function showPermissionModal() {
    const modal = document.getElementById('permissionModal');
    modal.style.display = 'block'; // Show the modal
}

// Function to request permission for device orientation
function requestDeviceOrientationPermission() {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then((response) => {
                if (response === 'granted') {
                    // Permission granted, start listening for device orientation
                    startListeningForOrientation();
                    closeModal(); // Close the modal
                } else {
                    console.error('Device orientation permission denied.');
                }
            })
            .catch((error) => {
                console.error('Error requesting device orientation permission:', error);
            });
    } else {
        // Permission is automatically granted on non-mobile devices
        startListeningForOrientation();
        closeModal(); // Close the modal
    }
}



// Function to start listening for device orientation changes
function startListeningForOrientation() {
    window.addEventListener('deviceorientation', (event) => {
        const tiltLeftThreshold = -60; // Degrees for tilting left
        const tiltRightThreshold = 60; // Degrees for tilting right

        // Check the gamma value (left/right tilt)
        const tilt = event.gamma; // Gamma represents the left/right tilt

        if (tilt < tiltLeftThreshold) {
            clearCanvas(); // Clear the canvas if tilted left
        } else if (tilt > tiltRightThreshold) {
            nextWindow(); // Perform action if tilted right
        }
    });
}

