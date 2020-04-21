class Ship{
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.angle = 90 * Math.PI / 180;
        this.speed = 100;
        this.acc = 50;
        this.color;
    }

    draw(ctx){
        console.log(this.x);
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.moveTo(0, 0 - this.size); // tip of rectangle
        ctx.lineTo( this.size / 2, 0 + this.size ); // Right point
        ctx.lineTo( -this.size / 2, 0 + this.size ); // left point
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.restore();
    }

    setAngle(a){
       this.angle = a * Math.PI / 180;
    }

    setColor(c){
        this.color = c;
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }
}

exports.Ship = Ship;