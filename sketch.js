// code addapted from
// github.com/IDMNYU/p5.js-func
// actual file
// https://github.com/IDMNYU/p5.js-func/blob/master/examples/easing3_animation/sketch.js

let ease = new p5.Ease();

let t, x, y, tx, ty, px, py;
let speed = 0.002;

let player;
function setup() {
    createCanvas(500, 400);
    // createCanvas(windowWidth, windowHeight);
    background(255);
    fill(0);

    player = new Player(width / 2, height / 2);

    x = width / 2;
    y = height / 2;
    tx = width / 2;
    ty = height / 2;
    px = width / 2;
    py = height / 2;

    x = px;
    y = py;
    tx = mouseX;
    ty = mouseY;
    t = 0;
}

function draw() {
    background(55,150);

    let q = ease["smootherStep"](t);
    // let q =  (x - tx ) * .1;
    // print(q)
    x1 = map(q, 0, 1, x, tx);
    y1 = map(q, 0, 1, y, ty);

    // render(t, x, y, tx, ty, px, py);

    px = x1;
    py = y1;

    t += speed;

    // what does this do??
    // cap acceleration
    if (t > 1) {
        t = 1;
        // x = tx;
        // y = ty;
    }
    set_loction();
    player.read_keys();
    player.move_target();
    player.calc_movement();
    player.render();
}

function render(t, x, y, tx, ty, px, py) {
    push();
    noFill();
    stroke("red");
    ellipse(tx, ty, 30, 30);
    pop();

    for (let size = 50; size >= 0; size -= 5) {
        push();
        fill(map(size, 0, 50, 0, 255));
        noStroke();
        ellipse(x1, y1, size, size);
        pop();
    }
    push();

    fill("black");
    noStroke();
    ellipse(x1, y1, 15, 15);

    fill("green");
    noStroke();
    ellipse(px, py, 10, 10);

    fill("blue");
    noStroke();
    ellipse(mouseX, mouseY, 10, 10);

    pop();
}

function set_loction() {
    tx = mouseX;
    ty = mouseY;
    x = px;
    y = py;
}
function mousePressed() {
    // osc.setType(random(sound_styles));
    x = px;
    y = py;
    tx = mouseX;
    ty = mouseY;
    t = 0;
}

class Player {
    constructor(x = 0, y = 0, target_x = 100, target_y = 100) {
        this.pos = createVector(x, y);
        this.prev = createVector(0, 0);
        this.tar = createVector(target_x, target_y);
        this.dir = createVector(0, 0);
        this.target_speed = 5;
        this.speed = 0.1;
        
    }

    move_target() {
        this.tar.add(this.dir.copy().mult(this.target_speed));

        // bring player to a stop
        this.dir.mult(.01)
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

        this.pos.add(distance)
        // this.pos.x += distance_x;
        // this.pos.x += x1;

        //set previouse value
        this.prev.x = this.pos.x;
    }

    render() {
        this.show_circle(this.pos);
        // this.show_circle(this.tar, "green");
    }

    set_direction(_dir) {
        this.dir = _dir.copy();
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
            player.dir = createVector(1, 0);
        }
        if (keyIsDown(LEFT_ARROW) || key === "a") {
            player.dir = createVector(-1, 0);
        }
        if (keyIsDown(DOWN_ARROW) || key === "s") {
            player.dir = createVector(0, 1);
        }
        if (keyIsDown(UP_ARROW) || key === "w") {
            player.dir = createVector(0, -1);
        }

        // todo add diagonals to movement

    }
}

function mousePressed()
{
 player.tar.set(mouseX,mouseY)
}


