const ship = require('./ship.js');
const utils = require('./utils');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = 400;
const height = 400;

const shipSize = 25;

const shipStartingMargin = 50; // Space between ships on start
const screenMargin = 80; // Space between ships and edge of screen on spawn

const numShips = 5; // Number of ships on each team

const goodColor = "blue";
const badColor = "red";


function buildShip(x, y){
    return new ship.Ship(x,y, shipSize);
}
function buildShipLine(x,color, angle=90){
    const ships = [];
    utils.range(0,numShips).forEach(y => {
        let s =  buildShip(x, (y * shipStartingMargin) + screenMargin);
        s.setColor(color);
        s.setAngle(angle);
        s.draw(ctx);
        ships.push(s);
    });
    return ships;
}

function drawGoodShips(){
    return buildShipLine(50, goodColor);
}

function drawBadShips(){
    return buildShipLine(350,badColor, 270);
}

const ships = drawGoodShips().concat(drawBadShips());
ships.forEach(s => s.draw(ctx));

