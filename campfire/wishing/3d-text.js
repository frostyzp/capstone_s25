let scene, camera, renderer;
let textMeshes = [];
const textSpacing = 200; // Spacing between text lines in the Z axis

function init3DScene() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.z = 500;
    camera.position.y = 0;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('ripple-container').appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Add scroll listener
    window.addEventListener('wheel', onScroll, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onScroll(event) {
    // Move camera based on scroll
    camera.position.z += event.deltaY * 0.5;
    // Limit how far back the camera can go
    camera.position.z = Math.max(100, Math.min(camera.position.z, textMeshes.length * textSpacing + 500));
}

function createTextMesh(text, index) {
    const loader = new THREE.FontLoader();
    
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
        const geometry = new THREE.TextGeometry(text, {
            font: font,
            size: 18,
            height: 2,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 0.5,
            bevelSize: 0.3,
            bevelOffset: 0,
            bevelSegments: 5
        });

        const material = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            emissive: 0x666666,
            shininess: 100
        });

        const textMesh = new THREE.Mesh(geometry, material);
        
        // Center the text
        geometry.computeBoundingBox();
        const centerOffset = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
        textMesh.position.x = centerOffset;
        
        // Position in Z axis based on index
        textMesh.position.z = -index * textSpacing;
        
        // Add to scene and store reference
        scene.add(textMesh);
        textMeshes.push(textMesh);
    });
}

function animate() {
    requestAnimationFrame(animate);
    
    // Add subtle rotation to all text meshes
    textMeshes.forEach(mesh => {
        if (mesh) {
            mesh.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
        }
    });
    
    renderer.render(scene, camera);
}

// Function to be called when rock is skipped
function initializeTextScene(poemLines) {
    init3DScene();
    
    // Create text meshes for each line
    poemLines.forEach((line, index) => {
        createTextMesh(line, index);
    });
    
    // Start animation loop
    animate();
} 