const ship = require('./ship.js');
const utils = require('./utils');
const globals = require('./globals');


const width = globals.HEIGHT;
const height = globals.WIDTH;
const center = new utils.Vector(width/2, height/2);

const shipStartingMargin = 50; // Space between ships on start
const screenMargin = 80; // Space between ships and edge of screen on spawn

const numShips = 5; // Number of ships on each team

const goodColor = "blue";
const badColor = "#ea0000";

class Board {

    constructor(context,brains, game){
        this.ctx = context;
        this.brains = brains;
        this.game = game;
    }

    // buildShipLine(x,color, angle=90){
    //     const ships = [];
    //     utils.range(0,numShips).forEach(y => {
    //         let s =  new ship.Ship(x, (y * shipStartingMargin) + screenMargin);
    //         s.setColor(color);
    //         s.setAngle(angle);
    //         s.draw(this.ctx);
    //         ships.push(s);
    //     });
    //     return ships;
    // }

    // buildGoodShips(){
    //     return this.buildShipLine(50, goodColor);
    // }
    //
    // buildBadShips(){
    //     return this.buildShipLine(750,badColor, 270);
    // }

    // Puts a ship in each corner and the center of each side of the board
    buildCornerShips(){
        // Corner positions
        const c0 = {pos: new utils.Vector(shipStartingMargin, shipStartingMargin), angle: 135};
        const c1 = {pos: new utils.Vector(width - shipStartingMargin, shipStartingMargin), angle: 225};
        const c2 = {pos: new utils.Vector(width - shipStartingMargin, height - shipStartingMargin), angle: 315};
        const c3 = {pos: new utils.Vector(shipStartingMargin, height - shipStartingMargin), angle: 45};
        // Side positions
        const s0 = {pos: new utils.Vector(width/2 + shipStartingMargin, shipStartingMargin), angle: 180};
        const s1 = {pos: new utils.Vector(width/2 - shipStartingMargin, height - shipStartingMargin), angle: 0};
        const s2 = {pos: new utils.Vector(width - shipStartingMargin, height/2 + shipStartingMargin), angle: 270};
        const s3 = {pos: new utils.Vector(shipStartingMargin, height/2 - shipStartingMargin), angle: 90};

        const positions = [c0,c1,c2,c3,s0,s1,s2,s3];
        const ships = positions.map(p => new ship.Ship(p.pos.x, p.pos.y,this.network, this.game));
        ships.forEach((s,i) => s.setAngle(positions[i].angle));

        return ships;
    }

    // buildShips(){
    //     const s0 = {pos: new utils.Vector(shipStartingMargin, shipStartingMargin), angle: 135};
    //     const s1 = {pos: new utils.Vector(width - shipStartingMargin, height - shipStartingMargin), angle: 315};
    //     const positions = [s0,s1];
    //     const ships = positions.map(p => new ship.Ship(p.pos.x, p.pos.y,this.network, this.game));
    //     ships.forEach((s,i) => s.setAngle(positions[i].angle));
    //
    //     return ships;
    // }

    drawBackground(){
        this.ctx.fillStyle = "#2a2a2a";
        this.ctx.fillRect(0, 0, width, height);
    }

    updateBoard(){
        this.drawBackground();
    }
}

exports.Board = Board;