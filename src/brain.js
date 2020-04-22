const net = require('./network');

class Brain{
    constructor(network, acc, acc_stop, fire, left, stop_left, right, stop_right){
        this.network = new net.Network(); // Neural Network to controls the ship
        this.fire = fire; // Function that fires a laser
        this.acc = acc; // Function that acellerates the ship
        this.acc_stop = acc_stop; // Function that stops accelerating the ship
        this.left = left; // Function that turns the ship left
        this.stop_left = stop_left; // Function stops turning the ship left
        this.right = right; // // Function that turns the ship right
        this.stop_right = stop_right; // Function stops turning the ship right
    }

    process(output){
        const fns = [this.fire, this.acc, this.acc_stop, this.left, this.stop_left, this.right, this.stop_right];
        output.forEach((o,i) => {
            const f = fns[i];
            if(o > 0.5){
                fns[i].call();
            }
        })
    }

    update(input){
        const output = this.network.predict(input);
        this.process(output);
    }
}

exports.Brain = Brain;