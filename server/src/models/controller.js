const pid = require('node-pid-controller');
const Gpio = require('pigpio').Gpio;
//const hltOutPin = new Gpio(18, {mode: Gpio.OUTPUT});
//const boilOutPin = new Gpio(17, {mode: Gpio.OUTPUT});
const sensors = require('ds18b20-raspi');



class output {
    constructor(pin) {
        this.gpio = new Gpio(pin, { mode: Gpio.OUTPUT });
    }

    turnOn() {
        this.gpio.digitalWrite(1);
    }

    turnOff() {
        this.gpio.digitalWrite(0);
    }

    setPowerLevel(powerLevel) {
        this.gpio.pwmWrite(powerLevel);
    }
}

class input {
    constructor(address) {
        this.address = address;
    }

    getTemp() {
        return sensors.readF(this.address);
    }
}

class controlLoop {
    constructor(name, address, pin, id) {
        this.name = name
        this.id = id
        this.input = new input(address);
        this.output = new output(pin);
        this.on = false;
        this.run = false;
    }

    turnOff() {
        this.on = false;
        this.run = false;
        this.output.turnOff()
        console.log("Off!")
    }

    async runAt(setTemp) {
        this.on = false;
        this.run = true;
        this.pid = new pid(2, .1, .1);
        let myPID = this.pid;
        let sTemp = setTemp
        do {
            myPID.setTarget(sTemp);
            let temp = this.input.getTemp()
            let rawOut = Math.round(this.pid.update(temp));
            let cleanOut = rawOut > 255 ? 255 : rawOut;
            cleanOut = cleanOut < 0 ? 0 : cleanOut;
            this.output.setPowerLevel(cleanOut)
            console.log("Power level: " + 100*cleanOut/255 + "%");

            // sleeeeeeeeping  for a second 
            await new Promise (resolve => {
              setTimeout(resolve, 1000)
            })

        } while (this.run == true);

        this.pid = []
        return
    }

    async fullOn() {
        this.run = false;
        this.on = true;
        do {
            this.output.turnOn()

            // sleeeeeeeeping  for a second 
            await new Promise (resolve => {
              setTimeout(resolve, 1000)
            })

        } while (this.on == true);
        console.log("On!")
        return
    }
}

module.exports.controlLoop = controlLoop;