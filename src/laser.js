const utils = require('./utils');

const width = 5;
const height = 10;
const speed = 20;
class Laser{

    constructor(position, radian){
        this.pos = position;
        this.radian = radian;
        this.calcHeading();
    }

    draw(ctx){
        ctx.save();
        ctx.translate( this.pos.x+width/2, this.pos.y+height/2 );
        ctx.rotate(this.radian);
        ctx.fillStyle = "#F00";
        ctx.beginPath();
        ctx.rect(-width, 0, width, height);
        ctx.fill();
        ctx.restore();
    }

    calcHeading(){
        this.heading = utils.Vector.toHeading(this.radian);
    }

    updatePosition(){
        const xSpeed = this.heading.x * speed;
        const ySpeed = this.heading.y * speed;
        const deltaPos = new utils.Vector(xSpeed, ySpeed);
        this.pos = this.pos.add(deltaPos);
    }

    update(ctx){
        this.updatePosition();
        this.draw(ctx)
    }
}

exports.Laser = Laser;