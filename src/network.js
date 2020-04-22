const synaptic = require('synaptic');

class Network{
    constructor(){
        this.network = this.spawnNetwork();
    }

    spawnNetwork(){
       return new synaptic.Architect.Perceptron(14, 21, 21,21, 7);
    }

    predict(input){
        return this.network.activate(input);
    }
}

exports.Network = Network;