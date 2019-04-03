let video;
let totalResults = [];
let counter = 0;

function setup() {
    createCanvas(300,300);
    video = createCapture(VIDEO);
    
    classifier = ml5.imageClassifier('Mobilenet', video, modelReady);
    print(totalResults); // ['Mango', 'Apple', 'Papaya']
}

function modelReady() {
    console.log("model ready");
    classifier.predict(gotResult);
}

function gotResult(er, results) {
    if (results) {
        console.log("results: ", results);
        select('#result').html(results[0].className);
        select('#probability').html(results[0].probability);
        
        // run storing function
        arrayOfResults(results[0].className, results[0].probability);
        
        // predict again
        classifier.predict(gotResult);
        
        if (results) {
            
        }
    }
}

// see if we already got this result
function arrayOfResults(in_string, prob) {
    //print(in_string);
    //select('#array').html(in_string);
    
    // assume its not there = 0 matches
    let match = 0;
    
    for (let i = 0; i < totalResults.length; i++) {
        // if it's there already
        if (in_string == totalResults[i]) {
            match++;
        }
    }
    
    // if it was there match will be > 0
    if (match == 0) {
        // is probability high enough?
        if (prob > 0.5) {
            append(totalResults, in_string);
        }
        else {
            counter++;
        }
    }
    select('#match').html(match);
    select('#counter').html(counter);
    select('#arraylenght').html(totalResults.length);
    select('#array').html(totalResults);

    
    //select('#array').html(in_string);
}
