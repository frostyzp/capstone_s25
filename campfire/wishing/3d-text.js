let scene, camera, renderer;
let textMeshes = [];
const textSpacing = 200; // Spacing between text lines in the Z axis
let touchStartY = 0;

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
    
    // Move camera based on touch, no limits
    camera.position.z += deltaY * 1.5;
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
    // Move camera based on scroll, no limits
    camera.position.z += event.deltaY * 0.5;
}

function createTextMesh(text, index) {
    const loader = new THREE.FontLoader();
    
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
        // Calculate maximum width based on window size
        const maxWidth = Math.min(window.innerWidth * 0.8, 800); // 80% of window width or 800px max
        
        // Create text geometry with responsive size
        const geometry = new THREE.TextGeometry(text, {
            font: font,
            size: window.innerWidth < 600 ? 10 : 15, // Smaller text size
            height: 1, // Thinner depth
            curveSegments: 12,
            bevelEnabled: false
        });

        // Create material with fade effect
        const material = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            emissive: 0x666666,
            shininess: 100,
            transparent: true,
            opacity: 0 // Start invisible for fade in
        });

        const textMesh = new THREE.Mesh(geometry, material);
        
        // Center the text horizontally and constrain width
        geometry.computeBoundingBox();
        const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
        const scale = textWidth > maxWidth ? maxWidth / textWidth : 1;
        textMesh.scale.set(scale, scale, scale);
        
        const centerOffset = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x) * scale;
        textMesh.position.x = centerOffset;
        
        // Position vertically based on screen height
        const verticalOffset = window.innerHeight * 0.4; // Start text 40% from top
        textMesh.position.y = verticalOffset - (index * 50); // Stack text with 50 units spacing
        
        // Position in Z axis with larger spacing
        textMesh.position.z = -index * 300;
        
        // Add to scene
        scene.add(textMesh);
        textMeshes.push(textMesh);

        // Fade in animation
        fadeIn(material);
    });
}

// Fade in animation function
function fadeIn(material) {
    const fadeInDuration = 2000; // 2 seconds
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / fadeInDuration, 1);
        
        material.opacity = progress;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    
    // Add subtle animations to all text meshes
    textMeshes.forEach((mesh, index) => {
        if (mesh) {
            // Gentle floating motion
            mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.05;
            
            // Subtle rotation
            mesh.rotation.y = Math.sin(Date.now() * 0.0005) * 0.1;
            
            // Fade based on camera distance
            const distance = Math.abs(camera.position.z + mesh.position.z);
            const opacity = Math.max(0, Math.min(1, 1 - (distance - 500) / 1000));
            mesh.material.opacity = opacity;
        }
    });
    
    renderer.render(scene, camera);
}

// Function to be called when rock is skipped
function initializeTextScene(poemLines) {
    console.log('Starting text scene initialization with', poemLines.length, 'lines');
    
    try {
        if (!window.THREE) {
            throw new Error('Three.js not loaded');
        }
        
        init3DScene();
        
        // Create text meshes for each line
        poemLines.forEach((line, index) => {
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