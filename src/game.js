// Game loop and collision detection
const collision = require('./collision');
const Board = require('./board.js');
const Player = require('./player.js');
const globals = require('./globals')

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

class Game{
    constructor(){
        this.board = new Board.Board(ctx, this);
        this.lasers = [];
        this.ships = this.board.buildShips();
        this.saveShips = [...this.ships];
        // this.player = new Player.Player(400,200, this);
        setInterval(this.gameLoop.bind(this), 1000/60);
    }

    checkCollision(){
        this.lasers.forEach((l,i) => {
            this.ships.forEach((s,j) => {
                const c = collision.triangle.pointInTriangle(l.pos, s.getTriangle());
                if(c){
                    l.ship.score += globals.KILL_SCORE;
                    s.kill();
                    this.lasers.splice(i,1);
                    this.ships.splice(j,1);
                }
            })
        })
    }

    showScore(ctx){
        let score = {};
        this.saveShips.forEach(s => {
            score[s.id] = s.score;
        });

        let y = 12;
        Object.keys(score).forEach(key => {
            ctx.font = "12px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(`${key}: ${score[key]}`, 10, y)
            y+=14;
        });
    }

    gameLoop(){
        this.board.updateBoard();
        this.ships.forEach(s => {
            s.update(ctx, this.ships);
        });
        // this.player.update(ctx, this.ships);
        this.showScore(ctx);
        this.lasers.forEach(l => l.update(ctx));
        this.checkCollision();
    }
}

new Game();