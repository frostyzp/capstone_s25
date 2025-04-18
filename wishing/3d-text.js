let scene, camera, renderer;
let textMeshes = [];
const MAX_VISIBLE_LINES = 10;
const Z_SPACING = 200;
let touchStartY = 0;
let lastGeneratedIndex = 0;
let poemGenerator = null;
let allGeneratedLines = [];

function init3DScene() {
    try {
        console.log('Initializing 3D scene...');
        
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        camera.position.z = 500;
        camera.position.y = 0;

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        const container = document.getElementById('ripple-container');
        if (!container) {
            throw new Error('Ripple container not found');
        }
        container.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 0, 1);
        scene.add(directionalLight);

        window.addEventListener('resize', onWindowResize, false);
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
    
    camera.position.z += deltaY * 1.5;
    checkAndUpdateVisibility();
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
    camera.position.z += event.deltaY * 0.5;
    checkAndUpdateVisibility();
}

function createTextMesh(text, index) {
    const loader = new THREE.FontLoader();
    
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
        const maxWidth = Math.min(window.innerWidth * 0.8, 800);
        const textSize = window.innerWidth < 600 ? 15 : 20;
        
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
        
        geometry.computeBoundingBox();
        const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
        const scale = textWidth > maxWidth ? maxWidth / textWidth : 1;
        textMesh.scale.set(scale, scale, scale);
        
        const centerOffset = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x) * scale;
        textMesh.position.x = centerOffset;
        
        textMesh.position.y = -(window.innerHeight * 0.2);
        textMesh.position.z = -index * Z_SPACING;
        
        scene.add(textMesh);
        textMeshes.push({
            mesh: textMesh,
            geometry: geometry,
            material: material,
            index: index,
            text: text
        });
        
        updateVisibleMeshes();
    });
}

function updateVisibleMeshes() {
    if (textMeshes.length > MAX_VISIBLE_LINES) {
        // Sort meshes by distance from camera
        textMeshes.sort((a, b) => {
            const distA = Math.abs(camera.position.z - a.mesh.position.z);
            const distB = Math.abs(camera.position.z - b.mesh.position.z);
            return distA - distB;
        });
        
        // Remove meshes that are too far
        while (textMeshes.length > MAX_VISIBLE_LINES) {
            const oldMesh = textMeshes.pop();
            scene.remove(oldMesh.mesh);
            oldMesh.geometry.dispose();
            oldMesh.material.dispose();
        }
    }
}

function checkAndUpdateVisibility() {
    // Find the camera's current position in terms of line indices
    const currentIndex = Math.round(camera.position.z / Z_SPACING);
    
    // Generate meshes for lines that should be visible but aren't
    const startIndex = currentIndex - Math.floor(MAX_VISIBLE_LINES / 2);
    const endIndex = currentIndex + Math.floor(MAX_VISIBLE_LINES / 2);
    
    for (let i = startIndex; i <= endIndex; i++) {
        if (i >= 0 && i < allGeneratedLines.length) {
            const exists = textMeshes.some(mesh => mesh.index === i);
            if (!exists) {
                createTextMesh(allGeneratedLines[i], i);
            }
        }
    }
    
    updateVisibleMeshes();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Function to be called when rock is skipped
function initializeTextScene(poemLines, generator) {
    console.log('Starting text scene initialization');
    
    try {
        if (!window.THREE) {
            throw new Error('Three.js not loaded');
        }
        
        init3DScene();
        
        // Store the generator and generate initial set of lines
        poemGenerator = generator;
        allGeneratedLines = [...poemLines];
        
        // Generate additional lines
        for (let i = 0; i < 20; i++) {
            allGeneratedLines.push(poemGenerator.generateNextLine());
        }
        
        // Create initial visible meshes
        const initialLines = allGeneratedLines.slice(0, MAX_VISIBLE_LINES);
        initialLines.forEach((line, index) => {
            console.log('Creating text mesh for line:', index);
            createTextMesh(line, index);
        });
        
        animate();
        console.log('Text scene initialization complete');
    } catch (error) {
        console.error('Error in initializeTextScene:', error);
    }
} 