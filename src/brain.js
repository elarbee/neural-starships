const net = require('./network');

class Brain{
    constructor(network, fire, left, right){
        this.network = new net.Network(); // Neural Network to controls the ship
        this.fire = fire; // Function that fires a laser
        this.left = left; // Function that turns the ship left
        this.right = right; // // Function that turns the ship right
    }

    // process(output){
    //     const fns = [this.fire, this.left, this.right];
    //     output.forEach((o,i) => {
    //         const f = fns[i];
    //             fns[i](o);
    //     })
    // }

    update(input){
        const output = this.network.predict(input);
        // this.process(output);
        return output;
    }
}

exports.Brain = Brain;