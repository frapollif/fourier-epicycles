// Coding Challenge 130.3: Drawing with Fourier Transform and Epicycles
// Daniel Shiffman


const USER = 0;
const FOURIER = 1;
const INIT = -1;

let x = [];
let fourierX;
let time = 0;
let path = [];
let drawing = [];
let state = INIT;
let fourier = [];
let precision_slider;
// TODO : framerate slider 10->60
let framerate_slider;
let reset_button;
let dt;
var global_precision = -1;
cycles_FRT=15;

function reset() {
  state = INIT;
  clear();
  initScreen();
  drawing = [];
  x = [];
  time = 0;
  path = [];
  precision_slider.remove();
  framerate_slider.remove();
}
// function keyPressed() {
//   state = INIT;
//   // clear();
//   initScreen();
//   drawing = [];
//   x = [];
//   time = 0;
//   path = [];
//   precision_slider.remove();
//   framerate_slider.remove();
// }

function initScreen() {
  background(0);
  push();
  fill(255);
  textAlign(CENTER);
  textSize(64);
  text("Draw Something!", width / 2, height / 2);
  textSize(14);
  // text("Number of cycles",70,40);
  //
  pop();
  drawrect();

}
function keyReleased() {


}
function mousePressed() {

  if (state == INIT) {
    frameRate(60);
    state = USER;
    drawing = [];
    x = [];
    time = 0;
    path = [];
  }
}



function mouseReleased() {
  if (state == USER) {
    state = FOURIER;
    frameRate(cycles_FRT);
    const skip = 1;
    for (let i = 0; i < drawing.length; i += skip) {
      x.push(new Complex(drawing[i].x, drawing[i].y));
    }
    fourierX = dft(x);

    fourierX.sort((a, b) => b.amp - a.amp);
    precision_slider = createSlider(2, fourierX.length, fourierX.length);
    precision_slider.position(80, 50);
    framerate_slider=createSlider(5,60,10);
    framerate_slider.position(80,100);
    // reset_button = createButton('Reset');
    // reset_button.position(width / 2, 50);

    button.mousePressed(() => {
      state = INIT;
      clear();
      initScreen();
      drawing = [];
      x = [];
      time = 0;
      path = [];
      precision_slider.remove();
      framerate_slider.remove();
    });
    clear();


  }

}


function drawrect(x = 0, y = 0) {
  push();
  noFill();
  stroke(255);
  rect_size = 600
  rect(x + width / 2 - rect_size / 2, y + height / 2 - rect_size / 2, rect_size, rect_size);
  pop();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  initScreen();
  stroke(255);
  noFill();
  drawrect();
  
}

function epicycles(x, y, rotation, fourier, precision = global_precision) {


  if (precision == -1) {
    precision = fourier.length
  }

  // Loop over each element in the Fourier series
  for (let i = 0; i < precision; i++) {
    // Store the current x and y coordinates
    let prevx = x;
    let prevy = y;
    // Extract the frequency, amplitude, and phase from the current Fourier element
    let freq = fourier[i].freq;
    let radius = fourier[i].amp;
    let phase = fourier[i].phase;
    // Update the x and y coordinates based on the Fourier element
    x += radius * cos(freq * time + phase + rotation);
    y += radius * sin(freq * time + phase + rotation);

    // Draw the circle with the calculated radius and at the calculated position
    push();
    stroke(255, 100);
    strokeWeight(2);
    noFill();
    ellipse(prevx, prevy, radius * 2);
    // Draw a line from the center of the circle to the calculated x and y coordinates
    stroke(255);
    pop();
    line(prevx, prevy, x, y);
  }
  // Return a vector with the final calculated x and y coordinates
  return createVector(x, y);
}


function getrange(data) {
  xmin = 0;
  xmax = 0;
  ymin = 0;
  ymax = 0;
  for (let v of data) {
    if (v.x < xmin) { xmin = v.x }
    if (v.x > xmax) { xmax = v.x }
    if (v.y < ymin) { ymin = v.y }
    if (v.y > ymax) { ymax = v.y }
  }
  return [xmin, xmax, ymin, ymax];
}
function draw() {

  if (state == USER) {
    background(0);
    let point = createVector(mouseX - width / 2, mouseY - height / 2);
    drawing.push(point);
    push();
    stroke(255);
    noFill();

    beginShape();
    for (let v of drawing) {
      vertex(v.x + width / 2, v.y + height / 2);
    }
    endShape();
    pop();
    drawrect();
  } else if (state == FOURIER) {
    frameRate(framerate_slider.value());
    background(0);
    push();
    stroke(0);
    fill(255);
    strokeWeight(2);
    textAlign(CENTER);
    textSize(14);

    text("Number of cycles", 150, 40);
    text("Animation speed", 150, 90);
    // text("Your drawing",150,100);

    text("Click the Reset button to start again", width / 2, 50);

    pop();

    // Draw a scaled version of the drawing 
    push();
    // rect(10,120,300,300);
    beginShape();
    stroke(255, 0, 0);
    strokeWeight(5);
    noFill();



    // rng=getrange(drawing);
    // if (rng[0]<0){xmin=rng[0]}
    // else {xmin=-rng[0]}

    // xmax=rng[1];
    // ymin=rng[2];
    // ymax=rng[3];
    // scale(0.4);
    translate(width / 2, height / 2);

    for (let v of drawing) {

      //TODO position drawing according to min and max x,y in vectors
      // vertex(v.x - xmin+50, v.y -ymin+400);
      vertex(v.x, v.y);
    }
    endShape();
    pop();
    /// 

    // console.log(getrange(drawing));
    global_precision = precision_slider.value();
    cycles_FRT =framerate_slider.value();

    let v = epicycles(width / 2, height / 2, 0, fourierX);
    path.unshift(v);
    push();
    beginShape();
    strokeWeight(2);
    noFill();
    stroke(255);
    // strokeWeight(25);
    // stroke(255,0,0);

    for (let i = 0; i < path.length; i++) {
      vertex(path[i].x, path[i].y);
    }

    endShape();
    pop();

    const dt = TWO_PI / fourierX.length;
    time += dt;

    if (time > TWO_PI) {
      time = 0;
      path = [];
    }
  }


}


