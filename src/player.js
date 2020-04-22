const ship = require('./ship.js');

const UP_CODE = 38;
const LEFT_CODE = 37;
const RIGHT_CODE = 39;
const SPACE_CODE = 32;

class Player {
    constructor(x,y, game){
        this.ship = new ship.Ship(x,y);
        this.ship.setAngle(0);
        this.game = game;
        document.addEventListener("keydown",this.onkeydown.bind(this));
        document.addEventListener("keyup",this.onkeyup.bind(this));
    }

    onkeydown(e){
        console.log(e.keyCode);
        switch (e.keyCode) {
            case UP_CODE:
                this.ship.accelerate(true);
                break;
            case RIGHT_CODE:
                this.ship.turn(true, ship.SHIP_DIRECTIONS.RIGHT);
                break;
            case LEFT_CODE:
                this.ship.turn(true, ship.SHIP_DIRECTIONS.LEFT);
                break;
            case SPACE_CODE:
                this.game.lasers.push(this.ship.spawnLaser());
        }
    }

    onkeyup(e){
        switch (e.keyCode) {
            case UP_CODE:
                this.ship.accelerate(false);
                break;
            case RIGHT_CODE:
                this.ship.turn(false);
                break;
            case LEFT_CODE:
                this.ship.turn(false);
        }
    }

    debug(ctx){
        const i = this.ship.buildInputs();
        let y = 12;
        Object.keys(i).forEach(key => {
            ctx.font = "12px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(`${key}: ${i[key]}`, 10, y)
            y+=14;
        });
    }

    update(ctx){
        this.ship.update(ctx)
        this.debug(ctx);
    }
}

exports.Player = Player;