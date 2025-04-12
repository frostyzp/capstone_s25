let scene, camera, renderer;
let textMeshes = [];
const textSpacing = 200; // Spacing between text lines in the Z axis
let touchStartY = 0;
let lastGeneratedIndex = 0;
let poemGenerator = null; // Store reference to the poem generator

function init3DScene() {
    try {
        console.log('Initializing 3D scene...');
        
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        // Create camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        camera.position.z = 500;
        camera.position.y = 0;

        // Create renderer with pixel ratio for better mobile display
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        const container = document.getElementById('ripple-container');
        if (!container) {
            throw new Error('Ripple container not found');
        }
        container.appendChild(renderer.domElement);
        console.log('Canvas added to container');

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 0, 1);
        scene.add(directionalLight);

        // Handle window resize
        window.addEventListener('resize', onWindowResize, false);

        // Add both mouse and touch event listeners
        window.addEventListener('wheel', onScroll, false);
        window.addEventListener('touchstart', onTouchStart, false);
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onTouchEnd, false);
        
        console.log('3D scene initialized successfully');
    } catch (error) {
        console.error('Error initializing 3D scene:', error);
    }
}

function onTouchStart(event) {
    event.preventDefault();
    touchStartY = event.touches[0].pageY;
}

function onTouchMove(event) {
    event.preventDefault();
    if (!touchStartY) return;
    
    const touchY = event.touches[0].pageY;
    const deltaY = touchStartY - touchY;
    touchStartY = touchY;
    
    // Move camera based on touch
    camera.position.z += deltaY * 1.5;
    checkAndGenerateNewLines();
}

function onTouchEnd(event) {
    touchStartY = null;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onScroll(event) {
    // Move camera based on scroll
    camera.position.z += event.deltaY * 0.5;
    checkAndGenerateNewLines();
}

function createTextMesh(text, index) {
    const loader = new THREE.FontLoader();
    
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
        // Calculate maximum width based on window size
        const maxWidth = Math.min(window.innerWidth * 0.8, 800);
        
        // Standardize text size
        const textSize = window.innerWidth < 600 ? 15 : 20;
        
        // Create text geometry with standardized size
        const geometry = new THREE.TextGeometry(text, {
            font: font,
            size: textSize,
            height: 0.5,
            curveSegments: 12,
            bevelEnabled: false
        });

        const material = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            emissive: 0x666666,
            shininess: 100
        });

        const textMesh = new THREE.Mesh(geometry, material);
        
        // Center the text horizontally
        geometry.computeBoundingBox();
        const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
        const scale = textWidth > maxWidth ? maxWidth / textWidth : 1;
        textMesh.scale.set(scale, scale, scale);
        
        const centerOffset = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x) * scale;
        textMesh.position.x = centerOffset;
        
        // Fixed Y position for all text
        textMesh.position.y = -(window.innerHeight * 0.2);
        
        // Position in Z axis with consistent spacing
        const zSpacing = 100;
        textMesh.position.z = -index * zSpacing;
        
        scene.add(textMesh);
        textMeshes.push(textMesh);
    });
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function checkAndGenerateNewLines() {
    if (!poemGenerator) return;
    
    // Calculate how far we've scrolled relative to the last generated text
    const zSpacing = 100;
    const lastTextPosition = -(lastGeneratedIndex - 1) * zSpacing;
    const distanceToLast = camera.position.z - lastTextPosition;
    
    // Generate only one new line when close to the last text
    if (distanceToLast > -200) {
        console.log('Generating new line...');
        const newLine = poemGenerator.generateNextLine();
        createTextMesh(newLine, lastGeneratedIndex++);
    }
}

// Function to be called when rock is skipped
function initializeTextScene(poemLines, generator) {
    console.log('Starting text scene initialization');
    
    try {
        if (!window.THREE) {
            throw new Error('Three.js not loaded');
        }
        
        init3DScene();
        
        // Store the generator for later use
        poemGenerator = generator;
        
        // Only create first 3 lines initially
        const initialLines = poemLines.slice(0, 3);
        lastGeneratedIndex = initialLines.length;
        
        // Create text meshes for initial lines
        initialLines.forEach((line, index) => {
            console.log('Creating text mesh for line:', index);
            createTextMesh(line, index);
        });
        
        // Start animation loop
        animate();
        console.log('Text scene initialization complete');
    } catch (error) {
        console.error('Error in initializeTextScene:', error);
    }
} 