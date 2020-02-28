const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const configPath = path.join('public','config','scoobybrew.config');

function readConfig(req) {
    try
    {
        fs.accessSync(configPath);
        console.log("Configuration file found.");
        var rawConfig = fs.readFileSync(configPath);
        req.config = JSON.parse(rawConfig);
        console.log(req.config);
    }
    catch
    {
        console.log("File not found. Creating file ...");
        let data = JSON.stringify(config);
        fs.writeFileSync(configPath, data);
    }
}

function CheckConfiguration(req) {
    if (req.config.configured==false) {
        console.log('Not configured');
    }
}

var loadConfig = function (req, res, next) {
    console.log('Loading configuration...');
    readConfig(req);
    CheckConfiguration(req);
    next();
  }

module.exports.loadConfig = loadConfig;

module.exports.readConfig = readConfig;

module.exports.writeConfig = () => {
    fsPromises.writeFileSync(configPath, JSON.stringify(config))
    .then(() => {
        console.log("Configuration updated!");
    })
    .catch((error) => {
        console.error(error);
    });
}

let config = {
    configured: false,
    onewireDevices: [],
    equipment: [],
}

module.exports.config = config;