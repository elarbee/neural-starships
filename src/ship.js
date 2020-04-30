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
    constructor(x,y,network, game) {
        this.game = game;
        this.id = getShipID();
        this.startTime = new Date().getTime();
        this.pos = new utils.Vector(x,y);
        this.size = shipSize;
        this.score = 0;
        this.state = SHIP_STATE.ALIVE;

        this.setAngle(90);
        this.calcHeading();
        this.turnSpeed = 5;
        this.isTurning = false;
        this.turnDirection = 1; // Right: 1, Left: -1

        this.speed = 0;
        this.maxSpeed = 3;
        this.acc = 0.1;
        this.drag = 0.01;
        this.isAccelerating = true;
        this.canFire = true;
        this.color = "#fefefe";

        this.closestShip;

        this.network = network;
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
        if(this.isOutOfBounds()){
            this.kill()
        } else {
            const xSpeed = this.heading.x * this.speed;
            const ySpeed = this.heading.y * this.speed;
            const deltaPos = new utils.Vector(xSpeed, ySpeed);
            this.pos = this.pos.add(deltaPos);
        }
    }

    isOutOfBounds(){
        return this.pos.x < 0 ||
            this.pos.x > globals.WIDTH ||
            this.pos.y < 0 ||
            this.pos.y > globals.HEIGHT;
    }

    loopBoundaries(){
        if(this.pos.x < 0){
            this.pos.x = globals.WIDTH
        }
        if(
            this.pos.x > globals.WIDTH
        ){
            this.pos.x = 0;
        }
        if(this.pos.y < 0){
            this.pos.y = globals.HEIGHT
        }
        if(
            this.pos.y > globals.HEIGHT
        ){
            this.pos.y = 0;
        }
    }

    spawnLaser(){
        if(this.canFire) {
            this.game.lasers.push(new laser.Laser(this.calculateNosePos(), this.radian, this));
            this.canFire = false;
            setTimeout(() => this.canFire = true, globals.SHIP_FIRE_RATE);
        }
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
        if(!ships || ships.length <= 1){
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
        
        const score = {
            timeAlive: this.getTimeAlive() / globals.GENERATION_TIME,
            direction: this.angle / 360,
            enemyDirection: this.closestShip && this.closestShip.angle / 360,
            closestShipDist: shipDistance / globals.WIDTH
        };

        // Limit all inputs to between 0 and 1
        Object.keys(score).forEach(key => {
           score[key] = bindOne(score[key]);
        });
        return score;
    }

    kill(){
        this.score += globals.DEATH_SCORE;
        this.state = SHIP_STATE.DEAD;
        this.game.removeShip(this.id);
    }

    getTimeAlive(){
        const now = new Date().getTime();
        return now - this.startTime;
    }

    buildBrain(){
        const network = this.network;
        const fire = n => n > 0.5 ? this.spawnLaser() : null;
        const left = n => this.turn(n > 0.5, SHIP_DIRECTIONS.LEFT);
        const right = n => this.turn(n > 0.5);

        return new brain.Brain(network, fire, left, right);
    }

    updateBrain(){
        const i = Object.values(this.buildInputs());
        const output = this.brain.update(i);
        const fireOut = output[0];
        const leftOut = output[1];
        const rightOut = output[2];
        if(fireOut > 0.50){
            this.spawnLaser();
        }
        this.turn(leftOut > 0.50, SHIP_DIRECTIONS.LEFT);
        this.turn(rightOut > 0.50, SHIP_DIRECTIONS.RIGHT);
    }

    update(ctx, ships){
        if(this.state === SHIP_STATE.ALIVE) {
            this.score += globals.TIME_SCORE;
            this.updatePosition();
            this.calcAccelaration();
            this.calcTurn();
            this.closestShip = this.getClosestShip(ships);
            this.updateBrain();

            this.draw(ctx);
        }
    }
}

const SHIP_STATE = {
    ALIVE: 0,
    DEAD: 1
};

const SHIP_DIRECTIONS = {
    LEFT: -1,
    RIGHT: 1
};

exports.Ship = Ship;
exports.SHIP_DIRECTIONS = SHIP_DIRECTIONS;
