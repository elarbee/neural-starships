const range = (start, stop, step = 1) =>
    Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step);

const radian = degree => degree * (Math.PI / 180); // Convert a degree to a radian
const degree = r => r * 180/Math.pi; // Degree from radian

const coordToRadian = (x,y) => Math.atan2(y,x);

const polarToCartesian = (r, degrees) => new Vector(r * Math.sin( degrees ), r * Math.cos(degrees));

const lowerBound = (n,min) => Math.max(n,min)

const bound = (n, min, max) => Math.min(Math.max(n,min),max);

// Rotate a cartesian point around an origin point
function rotatePoint(origin, p, radians) {
        const cos = Math.cos(-radians);
        const sin = Math.sin(-radians);
        const nx = (cos * (p.x - origin.x)) + (sin * (p.y - origin.y)) + origin.x;
        const ny = (cos * (p.y - origin.y)) - (sin * (p.x - origin.x)) + origin.y;
    return new Vector(nx, ny);
}

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

    multiply(v){
        return new Vector(this.x * v.x, this.y * v.y);
    }

    add(v){
        return new Vector(this.x + v.x, this.y + v.y);
    }

    subtract(v){
        return new Vector(this.x - v.x, this.y - v.y);
    }
}

exports.range = range;
exports.radian = radian;
exports.Vector = Vector;
exports.coordToRadian = coordToRadian;
exports.degree = degree;
exports.polarToCartesian = polarToCartesian;
exports.rotatePoint = rotatePoint;
exports.bound = bound;
