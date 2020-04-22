
class Brain{
    constructor(network, acc, acc_stop, fire, left, stop_left, right, stop_right){
        this.network = network; // Neural Network to controls the ship
        this.fire = fire; // Function that fires a laser
        this.acc = acc; // Function that acellerates the ship
        this.acc_stop = acc_stop; // Function that stops accelerating the ship
        this.left = left; // Function that turns the ship left
        this.stop_left = stop_left; // Function stops turning the ship left
        this.right = right; // // Function that turns the ship right
        this.stop_right = stop_right; // Function stops turning the ship right
    }

    process(output){

    }

    update(input){
        // this.network.train(input)
        this.process();
    }
}

exports.Brain = Brain;