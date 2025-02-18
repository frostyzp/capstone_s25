

const trackingConfig = {
    doAcquireFaceMetrics: true,
    cpuOrGpuString: "GPU",
    maxNumFaces: 1,
  };

let myFaceLandmarker;
let faceLandmarks;
let myCapture;
let lastVideoTime = -1;
let blinkThreshold = 0.01; // Adjust sensitivity of blink detection

// Animation for ASCII art
document.addEventListener('DOMContentLoaded', () => {
    const asciiArt = document.querySelector('.ascii-art');
    
    // Set initial position (off-screen to the right)
    asciiArt.style.position = 'relative';
    asciiArt.style.right = '-100%';
    
    // Animate using keyframes with infinite loop
    asciiArt.animate([
        { right: '-100%' },  // Start position
        { right: '0%' },     // Middle position
        // { right: '-100%' }   // End position (same as start for seamless loop)
    ], {
        duration: 10000,     // 10 seconds
        easing: 'linear',
        iterations: Infinity, // Makes the animation loop forever
        fill: 'forwards'     // Keeps element at final position
    });

});

// Function to fade out an element
function fadeOutElement(element) {
    element.style.transition = 'opacity 1s'; // Set transition for opacity
    element.style.opacity = '0'; // Start fading out
}

document.querySelector('button').addEventListener('click', () => {
    const mainText = document.querySelector('.main-text');
    mainText.classList.add('hide');
});



// –––––––––––––––––––––––––––––––– FACE TRACKING ––––––––––––––––––––––––––––––––
// face_landmarker.js

// Load MediaPipe and p5.js in your HTML page
// Example:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.0/p5.js"></script>
// <script src="face_landmarker.js" type="module"></script>



async function preload() {
    const mediapipe_module = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.js');
    FaceLandmarker = mediapipe_module.FaceLandmarker;
    FilesetResolver = mediapipe_module.FilesetResolver;
  
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.17/wasm"
    );
  
    myFaceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      numFaces: trackingConfig.maxNumFaces,
      runningMode: "VIDEO",
      outputFaceBlendshapes: trackingConfig.doAcquireFaceMetrics,
      baseOptions: {
        delegate: trackingConfig.cpuOrGpuString,
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
      },
    });
  }
  
  async function predictWebcam() {
    let startTimeMs = performance.now();
    if (lastVideoTime !== myCapture.elt.currentTime) {
      if (myFaceLandmarker) {
        faceLandmarks = myFaceLandmarker.detectForVideo(myCapture.elt, startTimeMs);
        console.log("Detected Face Landmarks:", faceLandmarks); // Log landmarks to debug
        checkBlink();
      }
      lastVideoTime = myCapture.elt.currentTime;
    }
    window.requestAnimationFrame(predictWebcam);
  }
  
  function checkBlink() {
    // console.log("Checking blink...");
    
    if (!faceLandmarks || !faceLandmarks.faceBlendshapes || faceLandmarks.faceBlendshapes.length === 0) {
      console.log("No valid face blendshapes detected.");
      return;
    }
  
    let aFaceMetrics = faceLandmarks.faceBlendshapes[0];
    // console.log("Face Metrics:", aFaceMetrics);
  
    if (aFaceMetrics) {
      let leftEyeBlink = getMetricValue(aFaceMetrics, "eyeBlink_L");
      let rightEyeBlink = getMetricValue(aFaceMetrics, "eyeBlink_R");
  
    //   console.log("Left Eye Blink:", leftEyeBlink, "Right Eye Blink:", rightEyeBlink);
  
      if (leftEyeBlink > blinkThreshold || rightEyeBlink > blinkThreshold) {
        console.log("Blink Detected!");
        onBlinkDetected();
      }
    }
  }
  
  function getMetricValue(faceMetrics, metricName) {
    // console.log("Categories:", faceMetrics.categories); // Log categories to check available metrics
    for (let i = 0; i < faceMetrics.categories.length; i++) {
      if (faceMetrics.categories[i].categoryName === metricName) {
        return faceMetrics.categories[i].score;
      }
    }
    return 0;
  }
  
  function onBlinkDetected() {
    console.log("Blink detected!");
  }
  
  function setup() {
    createCanvas(800, 600);
    myCapture = createCapture(VIDEO);
    myCapture.size(320, 240);
    myCapture.hide(); // Hide webcam feed
  }
  
  function draw() {
    background("white");
    predictWebcam();
  }
  