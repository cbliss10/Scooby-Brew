const controllers = require('../models/controller');
var configuration = []
var controlLoops = []
var isInitialized = false;

function initialize (config) {
    if(isInitialized)
    {
        //console.log("Brewery already initialized.")
        return
    }
    configuration = config;
    configuration.controlLoops.forEach(controlLoop => {
        controlLoops.push(new controllers.controlLoop(controlLoop.name, controlLoop.input, controlLoop.output, controlLoop.id))
    });
    isInitialized = true;
}

module.exports.initialize = initialize;

var loadBrewery = function (req, res, next) {
    //console.log('Loading brewery...');
    initialize(req.config)
    req.brewery = controlLoops
    next();
}

var close = function (req, res, next) {
    req.brewery.forEach(controlLoop => {
        controlLoop.turnOff
        console.log(controlLoop.name + " has been turned off.")
    });
    next();
}

module.exports.loadBrewery = loadBrewery;
module.exports.controlLoops = controlLoops
module.exports.close = close