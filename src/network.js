const synaptic = require('synaptic');
const tensorFlow = require('@tensorflow/tfjs');
const globals = require('./globals');

class Network{
    constructor(){
        this.network = this.spawnNetwork();
    }

    spawnNetwork(){
        const input = 4;
        const output = 3;
        const hidden = input + output;
        return new synaptic.Architect.Perceptron(input, hidden, hidden, output);
    }

    mutate(){
        this.network.layers.input.list.forEach(this.mutateNeuron);
        this.network.layers.hidden.forEach(l => l.list.forEach(this.mutateNeuron));
        this.network.layers.output.list.forEach(this.mutateNeuron);
        return this.network;
    }

    mutateNeuron(n){
        if(Math.random() < globals.MUTATION_RATE){
            n.bias = n.bias + (globals.MUTATION_STRENGTH * (Math.random() > 0.5 ? 1 : -1));
            const projected = Object.keys(n.connections.projected);
            if(projected.length) {
                projected.forEach(key => {
                    n.connections.projected[key].weight += (globals.MUTATION_STRENGTH * (Math.random() > 0.5 ? 1 : -1));
                });
            }
        }
    }

    predict(input){
        return this.network.activate(input);
    }
}

exports.Network = Network;