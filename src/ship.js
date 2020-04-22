const utils = require('./utils');
const laser = require('./laser');
const collision = require('./collision');
const globals = require('./globals');
const brain = require('./brain');

const shipSize = 10;

const getShipID = (function () {
    let counter = -1;
    return function () {counter += 1; return counter}
})();

class Ship{
    constructor(x,y) {
        this.id = getShipID();
        this.pos = new utils.Vector(x,y);
        this.size = shipSize;
        this.score = 0;

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

        this.closestShip;

        this.brain = this.buildBrain();
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

    getClosestShip(ships){
        if(!ships){
            return undefined;
        }
        const tempShips = [];
        ships.forEach(s => {
            if(s.id !== this.id){
                tempShips.push({ship:s, pos: s.pos});
            }
        });

        let closestShip = tempShips[0].ship;
        let closestDistance = this.pos.distance(closestShip.pos);
        tempShips.slice(1,tempShips.length).forEach(s => {
            const distance = this.pos.distance(s.pos);
            if(distance < closestDistance){
                closestShip = s.ship;
                closestDistance = distance;
            }
        });

        return closestShip;

    }

    buildInputs(){
        const bindOne = n => utils.bound(n,0,1); // Limits a number to between 0 and 1

        const closestShipPos = this.closestShip && this.closestShip.pos;
        const shipDistance = this.closestShip && this.pos.distance(this.closestShip.pos);
        const shipAngle = this.closestShip && this.pos.angle(this.closestShip.pos);
        return {
            height: bindOne(this.pos.y / globals.HEIGHT),
            width: bindOne(this.pos.x / globals.WIDTH),
            enemyHeight: bindOne(closestShipPos.y / globals.HEIGHT),
            enemyWidth: bindOne(closestShipPos.x / globals.WIDTH),
            speed: bindOne(this.speed / this.maxSpeed),
            enemySpeed: bindOne(this.closestShip && this.closestShip.speed / this.maxSpeed),
            headingX: bindOne((this.heading.x + 1) /2),
            headingY: bindOne((this.heading.y + 1) /2),
            enemyHeadingX: bindOne((this.closestShip && this.closestShip.heading.x + 1) /2),
            enemyHeadingY: bindOne((this.closestShip && this.closestShip.heading.y + 1) /2),
            turning: this.isTurning ? 1 : 0,
            accelerating: this.isAccelerating ? 1 : 0,
            closestShipAngle: shipAngle,
            closestShipDist: shipDistance / globals.WIDTH
        }
    }

    kill(){
        //placeholder
    }

    buildBrain(){
        const network = undefined;
        const fire = () => this.spawnLaser();
        const acc = () => this.accelerate(true);
        const acc_stop = () => this.accelerate(false);
        const left = () => this.turn(true, SHIP_DIRECTIONS.LEFT);
        const stop_left = () => this.turn(false, SHIP_DIRECTIONS.LEFT);
        const right = () => this.turn(true);
        const stop_right = this.turn(false);

        return new brain.Brain(network, fire, acc, acc_stop, left, stop_left, right, stop_right);
    }

    update(ctx, ships){
        this.updatePosition();
        this.calcAccelaration();
        this.calcTurn();
        this.closestShip = this.getClosestShip(ships);
        this.draw(ctx);
    }
}

const SHIP_DIRECTIONS = {
    LEFT: -1,
    RIGHT: 1
}

exports.Ship = Ship;
exports.SHIP_DIRECTIONS = SHIP_DIRECTIONS;
