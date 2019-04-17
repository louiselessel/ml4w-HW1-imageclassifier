// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
KNN Classification on Webcam Images with mobileNet. Built with p5.js
=== */
let video;
// Create a KNN classifier
const knnClassifier = ml5.KNNClassifier();
// Create a featureExtractor that can extract the already learned features from MobileNet
const featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
let currentWord;
let myVoice;

function setup() {
  noCanvas();
  // Create a video element
  video = createCapture(VIDEO);
  // Append it to the videoContainer DOM element
  video.parent('videoContainer');
  // Create the UI buttons
  createButtons();
  // Speech synthesis object
  myVoice = new p5.Speech();
  // The speak() method will interrupt existing speech currently being synthesized.
  myVoice.interrupt = true;
    

}

function modelReady() {
  select('#status').html('FeatureExtractor(mobileNet model) Loaded');
  chooseVoice();
}

function chooseVoice() {
    //myVoice.listVoices();  
    myVoice.setVoice('Daniel'); // Kyoko
}

// Add the current frame from the video to the classifier
function addExample(label) {
  // Get the features of the input video
  const features = featureExtractor.infer(video);

  // Add an example with a label to the classifier
  knnClassifier.addExample(features, label);
  updateExampleCounts();
}

// Predict the current frame.
function classify() {
  // Get the total number of classes from knnClassifier
  const numClasses = knnClassifier.getNumClasses();
  if (numClasses <= 0) {
    console.error('There is no examples in any class');
    return;
  }
  // Get the features of the input video
  const features = featureExtractor.infer(video);

  // Use knnClassifier to classify which class do these features belong to
  // You can pass in a callback function `gotResults` to knnClassifier.classify function
  knnClassifier.classify(features, gotResults);
}

// A util function to create UI buttons
function createButtons() {
  // When the A button is pressed, add the current frame to class "Hello"
  buttonA = select('#addClass1');
  buttonA.mousePressed(function() {
    addExample('Slouching');
  });

  // When the B button is pressed, add the current frame to class "goodbye"
  buttonB = select('#addClass2');
  buttonB.mousePressed(function() {
    addExample('Goodposture');
  });
    
  // When the C button is pressed, add the current frame to class "goodbye"
  buttonC = select('#addClass3');
  buttonC.mousePressed(function() {
    addExample('Other');
  });

  // Predict button
  buttonPredict = select('#buttonPredict');
  buttonPredict.mousePressed(classify);

  // Clear all classes button
  buttonClearAll = select('#clearAll');
  buttonClearAll.mousePressed(clearAllClasses);
}

// Show the results
function gotResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
  }

  if (result.confidencesByLabel) {
    const confideces = result.confidencesByLabel;
    // result.label is the label that has the highest confidence
    if (result.label) {
      select('#result').html(result.label);
      select('#confidence').html(`${confideces[result.label] * 100} %`);

      // If the confidence is higher then 0.9
      if (result.label !== currentWord && confideces[result.label] > 0.9) {
        currentWord = result.label;
          if (currentWord == 'Slouching') {
            // Say the current word 
            myVoice.speak("Sit up straight!");
          } else if (currentWord == 'Goodposture') {
            myVoice.speak("Your posture is nice.");
          } else if (currentWord == 'Other') {
            myVoice.speak("You are doing great, remember breaks");
          }
      }
    }
  }

  classify();
}

// Update the example count for each class	
function updateExampleCounts() {
  const counts = knnClassifier.getClassExampleCountByLabel();

  select('#example1').html(counts['Slouching'] || 0);
  select('#example2').html(counts['Goodposture'] || 0);
  select('#example3').html(counts['Other'] || 0);
}

// Clear all the examples in all classes
function clearAllClasses() {
  knnClassifier.clearAllClasses();
  updateExampleCounts();
}
