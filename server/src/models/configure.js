const fs = require('fs'); 
const path = require('path');
const configPath = path.join('public','config','scoobybrew.config');
const Gpio = require('pigpio').Gpio;
const sensors = require('ds18b20-raspi');
const initList = sensors.list();
const util = require('../util/utilities');

function readConfig(req) {
    try
    {
        fs.accessSync(configPath);
        console.log("Configuration file found.");
        var rawConfig = fs.readFileSync(configPath);
        req.config = JSON.parse(rawConfig);
    }
    catch
    {
        console.log("File not found. Creating file ...");
        req.config = config;
        let data = JSON.stringify(req.config);
        try
        {
            fs.writeFileSync(configPath, data);
        } 
        catch (error)
        {
            console.error(error);
        }
    }
}
function CheckConfiguration(req) {
    if (req.config.configured==false) {
        console.log('Not configured');
    }
    if(!req.config.onewireDevices.equals(initList))
    {
        console.log('not equal!!!');
        req.config.onewireDevices = initList
    }
}
function writeConfig(data) {
    try{
        console.log(data)
        fs.writeFileSync(configPath, JSON.stringify(data));
    }catch(error){
        console.error(error);
    };
}
var loadConfig = function (req, res, next) {
    console.log('Loading configuration...');
    readConfig(req);
    CheckConfiguration(req);
    next();
}
var saveConfig = function(data) {
    console.log('Saving configuration ...');
    console.log(data);
    writeConfig(data);
}
module.exports.loadConfig = loadConfig;
module.exports.saveConfig = saveConfig;
//module.exports.readConfig = readConfig;
//module.exports.writeConfig = writeConfig;

const controllers = require('../models/controller');

//default configuration
let config = {
    configured: false,
    onewireDevices: [],
    controlLoops: [],
    outputPins: [18, 17]
}

module.exports.config = config;