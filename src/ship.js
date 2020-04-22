const utils = require('./utils');
const laser = require('./laser');
const collision = require('./collision');

const shipSize = 25;
class Ship{
    constructor(x,y) {
        this.pos = new utils.Vector(x,y);
        this.size = shipSize;

        this.setAngle(90);
        this.calcHeading();
        this.turnSpeed = 2;
        this.isTurning = false;
        this.turnDirection = 1; // Right: 1, Left: -1

        this.speed = 0;
        this.maxSpeed = 5;
        this.acc = 0.1;
        this.drag = 0.01;
        this.isAccelerating = false;
        this.color = "#fefefe";
    }

    draw(ctx){
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.radian);
        ctx.beginPath();
        ctx.moveTo(0, 0 - this.size); // tip of rectangle
        ctx.lineTo( this.size / 2, this.size ); // Right point
        ctx.lineTo( -this.size / 2, this.size ); // left point
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.restore();

    }

    setAngle(a){
       this.angle = a;
       this.radian = utils.radian(a);
       this.calcHeading();
    }

    calcHeading(){
        this.heading = utils.Vector.toHeading(this.radian);
    }

    setColor(c){
        this.color = c;
    }

    accelerate(b){
        this.isAccelerating = b;
    }

    turn(b,direction = SHIP_DIRECTIONS.RIGHT){
       this.isTurning = b;
       this.turnDirection = direction;
    }

    calcAccelaration(){
        if(this.isAccelerating){
            const newVal = this.speed + this.acc;
            this.speed = Math.min(newVal, this.maxSpeed)
        }
        const dragSpeed = this.speed - this.drag;
        this.speed = Math.max(0, dragSpeed);
    }

    calcTurn(){
        if(this.isTurning){
            const newAngle = (this.angle + (this.turnSpeed * this.turnDirection)) % 360;
            this.setAngle(newAngle);
            this.calcHeading();
        }
    }

    updatePosition(){
        const xSpeed = this.heading.x * this.speed;
        const ySpeed = this.heading.y * this.speed;
        const deltaPos = new utils.Vector(xSpeed, ySpeed);
        this.pos = this.pos.add(deltaPos);
    }

    spawnLaser(){
        return new laser.Laser(this.calculateNosePos(), this.radian);
    }

    calculateNosePos(){
        const noseDelta = utils.polarToCartesian(-this.size, this.radian);
        const flipX = new utils.Vector(-noseDelta.x, noseDelta.y);
        return this.pos.add(flipX);
    }

    update(ctx){
        this.updatePosition();
        this.calcAccelaration();
        this.calcTurn();
        this.draw(ctx);

    }

    getTriangle(){
        // Nose position already calculated in seperate function
        const p0 = this.calculateNosePos();

        // Unrotated points
        const p1 = new utils.Vector(this.pos.x + (this.size / 2), this.pos.y + this.size);
        const p2 = new utils.Vector(this.pos.x - (this.size / 2), this.pos.y + this.size);
        // Rotate points p1 and p2
        const p3 = utils.rotatePoint(this.pos, p1, this.radian);
        const p4 = utils.rotatePoint(this.pos, p2, this.radian);

        return new collision.triangle(p0,p3,p4);
    }

    kill(){
        //placeholder
    }
}

const SHIP_DIRECTIONS = {
    LEFT: -1,
    RIGHT: 1
}

exports.Ship = Ship;
exports.SHIP_DIRECTIONS = SHIP_DIRECTIONS;
