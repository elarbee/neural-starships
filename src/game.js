// Game loop and collision detection
const collision = require('./collision');
const Board = require('./board.js');
const Player = require('./player.js');
const globals = require('./globals');
const net = require('./network');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

class Game{
    constructor(){
        this.newGame(new Array(globals.NUM_SHIPS).fill(new net.Network()))
    }

    newGame(minds){
        this.board = new Board.Board(ctx,minds, this);
        this.lasers = [];
        this.ships = this.board.buildCornerShips();
        this.saveShips = [...this.ships];
        this.generationNum = 0;
        this.setTimers();
    }

    newGeneration(){
        clearInterval(this.loopTimer);
        clearInterval(this.generationTimer);
        // Get top ships by score
        const sortedShips = this.saveShips.sort((s1,s2) => s1.score < s2.score ? 1 : -1);
        const top = sortedShips.slice(0,globals.NUM_SURVIVORS);
        const topNetworks = top.map(s => s.brain.network);
        const randomMind = () => topNetworks[Math.floor(Math.random() * topNetworks.length)];
        // Mutate
        const newMinds = new Array(globals.NUM_SHIPS).fill(randomMind().mutate());
        this.newGame(newMinds);
    }

    checkCollision(){
        this.lasers.forEach((l,i) => {
            this.ships.forEach((s,j) => {
                // const c = collision.triangle.pointInTriangle(l.pos, s.getTriangle());
                const c = collision.pointWithinCircle(l.pos, s.pos, globals.SHIP_COLLISION_RADIUS);
                if(c){
                    l.ship.score += globals.KILL_SCORE;
                    s.kill();
                    this.lasers.splice(i,1);
                }
            })
        })
    }

    removeShip(id){
        const i = this.ships.findIndex(s => s.id === id);
        this.ships.splice(i,1);
    }

    showScore(ctx){
        const sortedShips = this.saveShips.sort((s1,s2) => s1.score < s2.score ? 1 : -1);

        let y = 12;
        sortedShips.forEach(s => {
            ctx.font = "12px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(`${s.id}: ${s.score}`, 10, y)
            y+=14;
        });
    }

    setTimers(){
        this.loopTimer = setInterval(this.gameLoop.bind(this), 1000/60); // game loop
        this.generationTimer = setTimeout(this.newGeneration.bind(this), globals.GENERATION_TIME); // Make new generation
    }

    gameLoop(){
        this.board.updateBoard();
        if(this.ships.length <= 1){
            this.newGeneration();
            return;
        }
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
exports.Game = Game;
