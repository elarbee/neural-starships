// Game loop and collision detection
const collision = require('./collision');
const Board = require('./board.js');
const Player = require('./player.js');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

class Game{
    constructor(){
        this.board = new Board.Board(ctx);
        this.lasers = [];
        this.ships = this.board.buildShips();
        this.player = new Player.Player(400,200, this);
        setInterval(this.gameLoop.bind(this), 1000/60);
    }

    checkCollision(){
        this.lasers.forEach((l,i) => {
            this.ships.forEach((s,j) => {
                const c = collision.triangle.pointInTriangle(l.pos, s.getTriangle());
                if(c){
                    this.lasers.splice(i,1);
                    this.ships.splice(j,1);
                }
            })
        })
    }

    gameLoop(){
        this.board.updateBoard();
        this.ships.forEach(s => {
            s.update(ctx, this.ships);
        });
        this.player.update(ctx, this.ships);
        this.lasers.forEach(l => l.update(ctx));
        this.checkCollision();
    }
}

new Game();