const range = (start, stop, step = 1) =>
    Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step);

const radian = degree => degree * (Math.PI / 180); // Convert a degree to a radian

class Vector {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    get(){
        return {x: this.x, y: this.y}
    }

    static toHeading(r){
        return new Vector(Math.sin(r), Math.cos(r)*-1);
    }
}

exports.range = range;
exports.radian = radian;
exports.Vector = Vector;
