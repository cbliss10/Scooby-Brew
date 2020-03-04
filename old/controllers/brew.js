//const io = require('socket.io')(exports.server);
const pid = require('node-pid-controller');
//config
//const config = require('./config');

const Gpio = require('pigpio').Gpio;
const hltOutPin = new Gpio(18, {mode: Gpio.OUTPUT});
const boilOutPin = new Gpio(17, {mode: Gpio.OUTPUT});
const sensors = require('ds18b20-raspi');

module.exports.getBrew = (req, res, next) => {

    console.log(req.config);

    if(req.config.configured == false)
    {
        res.redirect('/configure');
    }

    //const sensors = require('ds18b20-raspi');
    const hltCtr = new pid(2, .1, .1);
    const boilCtr = new pid(2, .1, .1);
    hltCtr.i_max = 1000;
    boilCtr.i_max = 1000;


    // global variables
    var initialized = false;
    var controllers = [];

    var hltSensor = {
        sensorAddress: '28-0517025495ff',
        getTemp: function () {
            return sensors.readF(this.sensorAddress);
        }
    }

    var mashSensor = {
        sensorAddress: '28-0517027930ff',
        getTemp: function () {
            return sensors.readF(this.sensorAddress);
        }
    }

    var boilKettleSensor = {
        sensorAddress: '28-031702e1aeff',
        getTemp: function () {
            return sensors.readF(this.sensorAddress);
        }
    }

    // GPIO initialization
    /*const initList = sensors.list();
    hltOutPin.digitalWrite(0);
    boilOutPin.digitalWrite(0);

    console.log(initList);
    if(initList.length == 0)
    {
        console.log("initList undefined");
        return;
    }

    io.on('connection', function (socket) {
        socket.emit('consoleMessage', 'Socket.io connected.');
        socket.on('requestData', function (dataReq) {
            let data = {
                hlt: {
                    temp: hltSensor.getTemp(),
                    out: 0
                },
                mash: {
                    temp: mashSensor.getTemp(),
                },
                boilKettle: {
                    temp: boilKettleSensor.getTemp(),
                    out: 0
                }
            };
            if (dataReq) {
                // hlt
                if(dataReq.hlt.on)
                {
                    hltOutPin.digitalWrite(1);
                    data.hlt.out = 255;
                }
                else if(dataReq.hlt.run)
                {
                    hltCtr.setTarget(dataReq.hlt.setTemp);
                    let hltRaw = Math.round(hltCtr.update(data.hlt.temp));
                    let hltOut = hltRaw > 255 ? 255 : hltRaw;     
                    hltOut = hltOut < 0 ? 0 : hltOut;
                    hltOutPin.pwmWrite(hltOut);
                    data.hlt.out = hltOut;
                }
                else
                {
                    hltOutPin.digitalWrite(0);
                }
                // boil kettle
                if(dataReq.boilKettle.on)
                {
                    boilOutPin.digitalWrite(1);
                    data.boilKettle.out = 255;
                }
                else if(dataReq.boilKettle.run)
                {
                    boilCtr.setTarget(dataReq.boilKettle.setTemp);
                    let boilRaw = Math.round(boilCtr.update(data.boilKettle.temp));
                    let boilOut = boilRaw > 255 ? 255 : boilRaw;     
                    boilOut = boilOut < 0 ? 0 : boilOut;
                    boilOutPin.pwmWrite(boilOut);
                    data.boilKettle.out = boilOut;
                }
                else
                {
                    boilOutPin.digitalWrite(0);
                }
                
                socket.emit('data', data);
            }
        });
        socket.on('consoleMessage', function (Data) {
            console.log(Data);
        });
    });
*/
    res.render('brew.ejs', {
        pageTitle: 'Brew',
        path: '/brew'
    });
}