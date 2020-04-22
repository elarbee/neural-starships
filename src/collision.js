const utils = require('./utils');

class Triangle {
    constructor(p0,p1,p2){ // Vector2 points
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
    }
    static pointInTriangle(p,tri){
        const a = tri.p0;
        const b = tri.p1;
        const c = tri.p2;
        const A = 1/2 * (-b.y * c.x + a.y * (-b.x + c.x) + a.x * (b.y - c.y) + b.x * c.y);
        const sign = A < 0 ? -1 : 1;
        const s = (a.y * c.x - a.x * c.y + (c.y - a.y) * p.x + (a.x - c.x) * p.y) * sign;
        const t = (a.x * b.y - a.y * b.x + (a.y - b.y) * p.x + (b.x - a.x) * p.y) * sign;
        return s > 0 && t > 0 && (s + t) < 2 * A * sign;
    };

    asArray(){
        return [this.p0, this.p1, this.p2];
    }
}

// https://www.topcoder.com/community/competitive-programming/tutorials/geometry-concepts-line-intersection-and-its-applications/
class Line {
    constructor(v1,v2){ // Vector2
        this.pointA = v1;
        this.pointB = v2;
        this.A = v2.y - v1.y;
        this.B = v1.x - v2.x;

    }

}

exports.triangle = Triangle;