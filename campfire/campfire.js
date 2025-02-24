let touchCount = 0;

function handleTouchStart(event) {
    touchCount = event.touches.length;
    changeBackgroundColor();
}

function handleTouchEnd() {
    touchCount = 0;
    resetBackgroundColor();
}

function changeBackgroundColor() {
    if (touchCount === 4) {
        document.body.style.backgroundColor = 'red';
    document.querySelector('h1').textContent = 'F I R E S I D E';
    document.querySelector('p').textContent = ' ....' ;


    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let noise = new Float32Array(canvas.width * canvas.height);
    let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);

    function generateNoise() {
        for (let i = 0; i < noise.length; i++) {
            noise[i] = Math.random();
        }
    }

    function drawGradient() {
        gradient.addColorStop(0, `rgba(255, 0, 0, ${noise[0]})`);
        gradient.addColorStop(1, `rgba(0, 0, 255, ${noise[1]})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function animate() {
        generateNoise();
        drawGradient();
        requestAnimationFrame(animate);
    }

    animate();
    }
}

function resetBackgroundColor() {
    document.body.style.backgroundColor = ''; // Reset to default
}

// Add event listeners for touch events
document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchend', handleTouchEnd);
