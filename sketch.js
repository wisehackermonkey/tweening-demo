// code addapted from
// github.com/IDMNYU/p5.js-func
// actual file
// https://github.com/IDMNYU/p5.js-func/blob/master/examples/easing3_animation/sketch.js
//todo add sound
let player;
let mover;
let liquid;

let osc, rev;
let osc_horizontal
function setup() {
    createCanvas(500, 400);
    background(255);
    fill(0);

    player = new Player(width / 2, height / 2);

    osc = new p5.Oscillator();
    osc.setType("sine");
    osc.freq(0.0);
    osc.amp(0.05);
    osc.start();

    // add reverb to sound
    // rev = new p5.Reverb();
    // rev.process(osc, 3, 10);
    mover = new Mover(random(0.5, 3), 40 + 1 * 70, 0);
    liquid = new Liquid(0, height / 2, width, height / 2, 0.1);

}

function draw() {
    background(55, 150);

    player.read_keys();
    player.move_target();
    player.calc_movement();
    player.render();
    // circle(100, 100, 5);
    // circle(mouseX, mouseY, 5);
    // let distance = dist(player.pos.x, player.pos.y, player.tar.x, player.tar.y);

    // distance = round(distance / 20) * 40;
    // console.log(distance, player.dir.x);
    // (440 * 2 * (this.current_pitch - 69)) / 12;
    // osc.freq(map(distance, 0, height, 880, 220));

    if (play_sound) {
        osc.amp(100);
    } else {
        osc.amp(0);
    }

    liquid.display();

    if (liquid.contains(mover)) {
        // Calculate drag force
        let dragForce = liquid.calculateDrag(mover);
        // Apply drag force to Mover
        mover.applyForce(dragForce);
    }

    // Gravity is scaled by mass here!
    let gravity = createVector(0, 0.1 * mover.mass);
    // Apply gravity
    mover.applyForce(gravity);

    // Update and display
    mover.update();
    mover.display();
    mover.checkEdges();
    let frequency = mover.velocity.copy().mag() 
    frequency = map(frequency,0,7,0,550)
    print(frequency)
    osc.freq(frequency)

    // let frequency_y = floor(abs(map(mover.velocity.y,0,7,0,550))) 
    // print(frequency_y)
    // osc_horizontal.freq(frequency_y)

}

let play_sound = true;
function mouseClicked() {
    play_sound = !play_sound
}
function keyPressed(){
    if(key === "d"){
        let gravity = createVector(.5 * mover.mass,0 );

        mover.applyForce(gravity);
    }
    if(key === "a"){
        let gravity = createVector(-.5 * mover.mass,0 );

        mover.applyForce(gravity);
    }
}
class Player {
    constructor(x = 0, y = 0, target_x = 100, target_y = 100) {
        this.pos = createVector(x, y);
        this.prev = createVector(0, 0);
        this.tar = createVector(target_x, target_y);
        this.dir = createVector(0, 0);
        this.target_speed = 5;
        this.speed = 0.1;

        // sound generator
        this.osc = new p5.Oscillator();
        this.osc.setType("sawtooth");
        this.osc.freq(440.0);
        this.osc.amp(0.05);

        // add reverb to sound
        this.rev = new p5.Reverb();
        this.rev.process(this.osc, 3, 10);
    }

    move_target() {
        // this.tar.add(this.dir.copy().mult(this.target_speed));
        // bring player to a stop
        // this.dir.mult(0.01);
    }

    calc_movement() {
        // vector easing
        // let ease_persentage = ease["smootherStep"](t);
        // let q =  (x - tx ) * .1;
        // x1 = map(ease_persentage, 0, 1, this.pos.x, this.tar.x);
        // y1 = map(ease_persentage, 0, 1, this.pos.y, this.tar.y);
        let dist_x = (this.tar.x - this.pos.x) * this.speed;
        let dist_y = (this.tar.y - this.pos.y) * this.speed;

        let distance = createVector(dist_x, dist_y);

        this.pos.add(distance);

        //set previous value
        // this.prev.x = this.pos.x;
    }

    render() {
        this.show_circle(this.pos);
        // this.show_circle(this.tar, "green");
    }

    show_circle(point, col = "orange", sz = 30) {
        push();
        // noFill();
        // stroke(col);
        noStroke();
        fill(col);
        ellipse(point.x, point.y, sz, sz);
        pop();
    }

    read_keys() {
        if (keyIsDown(RIGHT_ARROW) || key === "d") {
            this.tar.add(createVector(1, 0).mult(this.target_speed));
        }
        if (keyIsDown(LEFT_ARROW) || key === "a") {
            this.tar.add(createVector(-1, 0).mult(this.target_speed));
        }
        if (keyIsDown(DOWN_ARROW) || key === "s") {
            this.tar.add(createVector(0, 1).mult(this.target_speed));
        }
        if (keyIsDown(UP_ARROW) || key === "w") {
            this.tar.add(createVector(0, -1).mult(this.target_speed));
        }

        // todo add diagonals to movement
    }
}

function mousePressed() {
    player.tar.set(mouseX, mouseY);
}

let Liquid = function (x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
};

// Is the Mover in the Liquid?
Liquid.prototype.contains = function (m) {
    let l = m.position;
    return (
        l.x > this.x &&
        l.x < this.x + this.w &&
        l.y > this.y &&
        l.y < this.y + this.h
    );
};

// Calculate drag force
Liquid.prototype.calculateDrag = function (m) {
    // Magnitude is coefficient * speed squared
    let speed = m.velocity.mag();
    let dragMagnitude = this.c * speed * speed;

    // Direction is inverse of velocity
    let dragForce = m.velocity.copy();
    dragForce.mult(-1);

    // Scale according to magnitude
    // dragForce.setMag(dragMagnitude);
    dragForce.normalize();
    dragForce.mult(dragMagnitude);
    return dragForce;
};

Liquid.prototype.display = function () {
    noStroke();
    fill(50);
    rect(this.x, this.y, this.w, this.h);
};

function Mover(m, x, y) {
    this.mass = m;
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
}

// Newton's 2nd law: F = M * A
// or A = F / M
Mover.prototype.applyForce = function (force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
};

Mover.prototype.update = function () {
    // Velocity changes according to acceleration
    this.velocity.add(this.acceleration);
    // position changes by velocity
    this.position.add(this.velocity);
    // We must clear acceleration each frame
    this.acceleration.mult(0);
};

Mover.prototype.display = function () {
    stroke(0);
    strokeWeight(2);
    fill(255, 127);
    ellipse(this.position.x, this.position.y, this.mass * 16, this.mass * 16);
};

// Bounce off bottom of window
Mover.prototype.checkEdges = function () {
    if (this.position.y > height - this.mass * 8) {
        // A little dampening when hitting the bottom
        this.velocity.y *= -0.9;
        this.position.y = height - this.mass * 8;
    }
};
