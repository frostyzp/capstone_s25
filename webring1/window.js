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

    function startDrawing(e) {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(getMousePos(e).x, getMousePos(e).y);
    }

    function stopDrawing() {
        drawing = false;
        ctx.closePath();
    }

    function draw(e) {
        if (!drawing) return;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'; // Semi-transparent white
        ctx.lineWidth = 25; // Stroke width
        ctx.lineCap = 'round'; // Rounded ends
        
        const pos = getMousePos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
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
});
  