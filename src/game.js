// Game loop and collision detection
const ship = require('./ship.js');
const collision = require('./collision');
const Board = require('./board.js')

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const UP_CODE = 38;
const LEFT_CODE = 37;
const RIGHT_CODE = 39;
const SPACE_CODE = 32;

document.addEventListener("keydown",onkeydown);
document.addEventListener("keyup",onkeyup);

const board = new Board.Board(ctx);

const lasers = [];
const ships = board.buildBadShips().concat(board.buildGoodShips());

const player = board.spawnPlayer();

function checkCollision(){
    lasers.forEach((l,i) => {
        ships.forEach((s,j) => {
            const c = collision.triangle.pointInTriangle(l.pos, s.getTriangle());
            if(c){
                lasers.splice(i,1);
                ships.splice(j,1);
            }
        })
    })
}

function onkeydown(e){
    console.log(e.keyCode);
    switch (e.keyCode) {
        case UP_CODE:
            player.accelerate(true);
            break;
        case RIGHT_CODE:
            player.turn(true, ship.SHIP_DIRECTIONS.RIGHT);
            break;
        case LEFT_CODE:
            player.turn(true, ship.SHIP_DIRECTIONS.LEFT);
            break;
        case SPACE_CODE:
            lasers.push(player.spawnLaser());
    }
}

function onkeyup(e){
    switch (e.keyCode) {
        case UP_CODE:
            player.accelerate(false);
            break;
        case RIGHT_CODE:
            player.turn(false);
            break;
        case LEFT_CODE:
            player.turn(false);
    }
}

function gameLoop(){
    board.updateBoard();
    ships.forEach(s => {
        s.update(ctx);
    });
    player.update(ctx);
    lasers.forEach(l => l.update(ctx));
    checkCollision();
}


setInterval(gameLoop, 1000/60);


