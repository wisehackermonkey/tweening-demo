// code addapted from
// github.com/IDMNYU/p5.js-func
// actual file
// https://github.com/IDMNYU/p5.js-func/blob/master/examples/easing3_animation/sketch.js

let ease = new p5.Ease();
let styles = ease.listAlgos();

let MAX_AUDIO_RANG = 20000; //Hrz

let curstyle;
let speed = 0.02;
let t = 0;
let doclear;

let x, y, tx, ty, x1, y1, px, py;

let osc, rev;

let tb; // textbox

let sound_styles = [
    "sine",
    "cosine",
    "sawtooth",
    "sawdown",
    "phasor",
    "square",
    "rectangle",
    "pulse",
    "triangle",
    "buzz",
];

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    fill(0);

    curstyle = random(styles);

    x = width / 2;
    y = height / 2;
    tx = width / 2;
    ty = height / 2;
    px = width / 2;
    py = height / 2;

    osc = new p5.Oscillator();
    osc.setType("sawtooth");
    osc.freq(440);
    osc.amp(0.3);
    osc.start();

    rev = new p5.Reverb();
    rev.process(osc, 5, 10);

    tb = createDiv("");
    tb.style("font-family", "Courier");
    tb.style("font-size", "12px");
    tb.position(width * 0.1, height * 0.1);
    tb.size(500, 500);
}

function draw() {
    background(255);

    let q = ease["tripleLinear"](t);
    x1 = map(q, 0, 1, x, tx);
    y1 = map(q, 0, 1, y, ty);
    noFill();
    stroke(255, 0, 0);
    ellipse(tx, ty, 30, 30);
    fill(0);
    noStroke();
    ellipse(x1, y1, 15, 15);

    let hs = `p5.Ease(): ${curstyle}<br><br>
click around.`;

    tb.html(hs);

    let f = constrain(dist(x1, y1, px, py) * 100, 0, 880);
    let a = constrain(dist(x1, y1, px, py), 0, 0.3);
    osc.freq(f);
    osc.amp(a);

    px = x1;
    py = y1;

    t += speed;
    if (t > 1) {
        t = 1;
        x = tx;
        y = ty;
    }
    set_loction();
}

function set_loction() {
    if (frameCount % 50 === 0) {
        // curstyle = "tripleLinear"/random(styles);
        x = px;
        y = py;
        tx = mouseX;
        ty = mouseY;
        t = 0;
    }
}
function mousePressed() {
    curstyle = random(styles);
    // osc.setType(random(sound_styles));
    x = px;
    y = py;
    tx = mouseX;
    ty = mouseY;
    t = 0;
}
