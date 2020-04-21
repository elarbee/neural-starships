class Ship{
    constructor(x, y, angle, speed, acc) {
        this.x = y;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.acc = acc;
    }

    draw(ctx){
        ctx.beginPath();
        ctx.moveTo(75, 50);
        ctx.lineTo(100, 75);
        ctx.lineTo(100, 25);
        ctx.fill();
    }
}

exports.Ship = Ship;