const ship = require('./ship.js');
const utils = require('./utils');


const width = 800;
const height = 400;
const center = new utils.Vector(width/2, height/2);

const shipStartingMargin = 50; // Space between ships on start
const screenMargin = 80; // Space between ships and edge of screen on spawn

const numShips = 5; // Number of ships on each team

const goodColor = "blue";
const badColor = "#ea0000";

class Board {

    constructor(context){
        this.ctx = context;
    }

    buildShipLine(x,color, angle=90){
        const ships = [];
        utils.range(0,numShips).forEach(y => {
            let s =  new ship.Ship(x, (y * shipStartingMargin) + screenMargin);
            s.setColor(color);
            s.setAngle(angle);
            s.draw(this.ctx);
            ships.push(s);
        });
        return ships;
    }

    buildGoodShips(){
        return this.buildShipLine(50, goodColor);
    }

    buildBadShips(){
        return this.buildShipLine(750,badColor, 270);
    }

    drawBackground(){
        this.ctx.fillStyle = "#2a2a2a";
        this.ctx.fillRect(0, 0, width, height);
    }

    updateBoard(){
        this.drawBackground();
    }
}

exports.Board = Board;