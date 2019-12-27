const path = require('path');

const express = require('express');
const app = express();
//const server = require('http').Server(app);
const expressHbs = require('express-handlebars');
const expressWs = require('express-ws')(app);
const fs = require('fs');
//const io = require('socket.io')(server);
const Gpio = require('pigpio').Gpio;
const sensors = require('ds18b20-raspi');

// GPIO initialization
const initList = sensors.list();
let sensorList = [], sensorIndex = 1;
initList.forEach(sensorAddress => {
    sensorList.push({name: "Unnamed Sensor " + sensorIndex, address: sensorAddress});
    sensorIndex ++;
});

app.engine('hbs', expressHbs({layoutsDir: 'views/layouts', defaultLayout: "main-layout", extname:'hbs'}));
app.set('view engine', 'hbs');
app.set('views','views');

app.use('/', (req, res, next) => {
    res.render("initialize", {pageTitle: 'Initialization', sensors: sensorList });
});

app.ws('/', function(ws,req) {
    ws.on('message', function(msg) {
        console.log(msg);
    });
});

app.listen(3000);

process.on('SIGINT', function() {
    // closing functions here
    process.exit();
})