
// Crappy Blink Detector using p5.js + handsfree.js
//
// HOW IT WORKS, USING RUDIMENTARY STATISTICS:
// The amount of eye-opening is measured each frame,
// by measuring the distance between several eye landmarks.
// We compute the running average of this amount. 
// When the amount of eye-opening drops below a certain 
// threshold (based on the standard deviation of the 
// measurement), it's a blink. 
//
// https://unpkg.com/handsfree@8.5.1/build/lib/handsfree.js
// Note: this downloads large models the first time it's run.
// Your mileage may vary. Go close to camera, use good lighting.

let handsfree; // The handsfree.js tracker
let webcam; // A webcam video (for display only)

let eyeBlinkHistory = [];
const historyLen = 320;
let runningAvg = 0; 
var blinkActivation = 0; 
const cooldown = 1000;
let lastBlink = 0;
let raindrops = [];
let audioStarted = false; // Boolean to track if the sound has been started

//------------------------------------------
function preload() {
  myFont = "monospace"; // Set the default font to monospace
  //  myFont = loadFont('graveyard_blink/fonts/PanamaMonospaceRegular.otf');

}

function setup() {
  // createCanvas(windowWidth, windowHeight); 
  createCanvas(windowWidth, windowHeight).id('canvas'); // Give the canvas an ID

  textFont(myFont); // Apply the custom font

  // mySound.setVolume(1); // Set the volume (1 is max, 0 is mute)
  // mySound.loop(); // Loop the sound continuously

  eyeBlinkHistory = new Array(historyLen); 
  for (var i=0; i<historyLen; i++){
    eyeBlinkHistory[i] = 0.1;// guess
  }
  
  // Create a webcam object. It's just for show.
  webcam = createCapture(VIDEO);
  webcam.size(640, 480);
  webcam.hide();
  
  // Configure handsfree.js to track hands, body, and/or face.
  handsfree = new Handsfree({
    showDebug: false,  /* shows or hides the camera */
    hands: false,      /* acquire hand data? */
    pose: false,       /* acquire body data? */
    facemesh: true     /* acquire face data? */
  });
  
  handsfree.start();
}


//------------------------------------------
function draw() {
  background('black');
  //drawVideoBackground();
  drawFaceLandmarks();
  detectBlinking();

  textSize(12);
  textAlign(CENTER,CENTER);
  fill('white');
  noStroke();

  let myText = `
  graveyard
  of
  the
  unanswered
  ^
  ^
  `;
  text(myText, width / 2, 200);

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }


//------------------------------------------
function drawVideoBackground(){
  push();
  translate(width, 0);
  scale(-1,1);
  tint(255,255,255, 160);
  image(webcam, 0, 0, width, height);
  tint(255);
  pop();
}


//------------------------------------------
function drawFaceLandmarks(){
  // Draw the 468 2D face landmarks
  
  if (handsfree.data.facemesh) {
    if (handsfree.data.facemesh.multiFaceLandmarks) {
      var faceLandmarks = handsfree.data.facemesh.multiFaceLandmarks;   
      var nFaces = faceLandmarks.length;
      if (nFaces > 0){
        var whichFace = 0;
        
        // print('face is present');

        stroke('black'); 
        strokeWeight(1); 
        var nFaceLandmarks = faceLandmarks[whichFace].length; 
        /*for (var i = 0; i < nFaceLandmarks; i++) {
          var px = faceLandmarks[whichFace][i].x;
          var py = faceLandmarks[whichFace][i].y;
          px = map(px, 0, 1, width, 0);
          py = map(py, 0, 1, 0, height);
          // circle(px, py, 0.5);

        }
        */
      }
    } 
    else {
      fill('black');
      textAlign(CENTER, CENTER);
      textSize(17);
      fill('white');
      text('Your face needs to be present here.', width/2, height/4);

  }
  } 
}


//------------------------------------------
function detectBlinking(){
  
  if (handsfree.data.facemesh) {
    if (handsfree.data.facemesh.multiFaceLandmarks) {
      var faceLandmarks = handsfree.data.facemesh.multiFaceLandmarks;   
      var nFaces = faceLandmarks.length;
      if (nFaces > 0){
        var whichFace = 0;
        
        //----------------------
        // Vertices for the eyes
        var eyes = [[33,161,160,159,158,157,173,  133,155,154,153,145,144,163,7],
                    [362,384,385,386,387,388,466,263,  249,390,373,374,380,381,382]];

        //----------------------
        // Compute the centroid of the eye vertices.
        // This is purely for display purposes.
        var eyeAvgX = 0; 
        var eyeAvgY = 0;
        var count = 0; 
        for (var e=0; e<2; e++){
          for (var j=0; j<(eyes[e].length); j++){
            var px = faceLandmarks[whichFace][eyes[e][j]].x;
            var py = faceLandmarks[whichFace][eyes[e][j]].y;
            eyeAvgX += map(px, 0, 1, width, 0);
            eyeAvgY += map(py, 0, 1, 0, height);
            count++;
          }
        }
        eyeAvgX /= count;
        eyeAvgY /= count;
        
        //----------------------
        // Draw the eyes, isolated, on a white background:
        /*
        noStroke(); 
        fill('white'); 
        rect(0,0, width, 100); 
        
        push();
        translate(width/2, 50); 
        translate(-eyeAvgX, -eyeAvgY); 
        fill('red'); 
        stroke(0);
        strokeWeight(1);
        for (var e=0; e<2; e++){
          beginShape(); 
          for (var j=0; j<(eyes[e].length); j++){
            var px = faceLandmarks[whichFace][eyes[e][j]].x;
            var py = faceLandmarks[whichFace][eyes[e][j]].y;
            px = map(px, 0, 1, width, 0);
            py = map(py, 0, 1, 0, height);
            vertex(px, py); 
          }
          endShape(CLOSE); 
        }
        pop(); 
        */
        
        //----------------------
        // Measure the openness of the eyes. Your mileage may vary. 
        var eyeBlinkMeasurementPairs = [[159,154],[158,145],[385,374],[386,373]];
        var measurement = 0; 
        for (var i=0; i<eyeBlinkMeasurementPairs.length; i++){
          var pa = faceLandmarks[whichFace][eyeBlinkMeasurementPairs[i][0]];
          var pb = faceLandmarks[whichFace][eyeBlinkMeasurementPairs[i][1]];
          measurement += dist(pa.x, pa.y, pb.x, pb.y); 
        }
        // Add the data to the history; 
        for (var i=0; i<(historyLen-1); i++){
          eyeBlinkHistory[i] = eyeBlinkHistory[i+1];
        }
        eyeBlinkHistory[historyLen-1] = measurement;
        
        
        //----------------------
        // Compute stats and Detect a blink!
        runningAvg = 0.95*runningAvg + 0.05*measurement;
        var stdv = 0; 
        for (var i=0; i<historyLen; i++){
          stdv += sq(eyeBlinkHistory[i] - runningAvg);
        }
        stdv = sqrt(stdv/historyLen);
    
        var blink = false;
        blinkActivation = 0.9*blinkActivation; // reduce activation
        var threshStdv = 1.0; // how many stdv's to detect a blink
        var threshVal = runningAvg-stdv*threshStdv;
        if ((eyeBlinkHistory[historyLen-1] < threshVal) && 
            (eyeBlinkHistory[historyLen-2] >= threshVal)){
          blink = true;
          blinkActivation = 1.0;

          checkBlink();
          
        }


        //----------------------
        // Render the blink history on a gray background
        /*
        var historyScale = 500; 
        push();
        translate(0, 100); 
        
        let myGray = color(200,200,200);
        let myRed = color(255,0,0);
        fill(lerpColor(myGray, myRed, blinkActivation));
        noStroke(); 
        rect(0,0,width, 100); 
        
        noFill();
        stroke(0); 
        beginShape();
        for (var i=0; i<(historyLen-1); i++){
          var hx = i;
          var hy = eyeBlinkHistory[i] * historyScale;
          vertex(hx,hy);
        }
        endShape(); 
        stroke(0,0,0, 64); 
        line(0,runningAvg*historyScale, width,runningAvg*historyScale); 
        line(0,(runningAvg-stdv)*historyScale, width,(runningAvg-stdv)*historyScale); 
        pop();
*/
        
      }
    }
  }
}

function checkBlink() {
  const currentTime = millis();
          
  if (currentTime - lastBlink >= cooldown){

      if (document.title === "Blinking Windows") {
        // Code specific to the About page
        // console.log("About page loaded");
        // print("Blink (Windows)) at " + int(millis()) + " milliseconds");
        spawnWords();
      } else {
        // console.log("Garden");
        // print("Blink (Garden) at " + int(millis()) + " milliseconds");

        spawnGardenWord();
        
      }
 


    // fade color in the bg
    let firstColor = color(0,0,0);
    let secondColor = color(255,255,255,10);
    fill(lerpColor(firstColor, secondColor, blinkActivation));

    //rect(0, 0, width, height);
    // update last blink
    lastBlink = currentTime;

  }


}


function mousePressed() {
  // spawnWords();
  // if (!audioStarted) {
  //   mySound.setVolume(1); // Set the volume
  //   mySound.loop(); // Start the sound loop
  //   audioStarted = true; // Prevent restarting the audio on subsequent clicks
  // }
}




