const pid = require('node-pid-controller');
const Gpio = require('pigpio').Gpio;
//const hltOutPin = new Gpio(18, {mode: Gpio.OUTPUT});
//const boilOutPin = new Gpio(17, {mode: Gpio.OUTPUT});
const sensors = require('ds18b20-raspi');

class Output {
    constructor(pin){
        this.gpio = new Gpio(pin, {mode: Gpio.OUTPUT});
    }
}

module.exports.output = Output;