const path = require('path');

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
//const control = require(path.join(__dirname, 'scripts', 'controller.js'));

const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const fs = require('fs');
const Gpio = require('pigpio').Gpio;
const sensors = require('ds18b20-raspi');

// global variables
var initialized = false;
var controllers = [];

// GPIO initialization
const initList = sensors.list();
let sensorList = [], sensorIndex = 1;
initList.forEach(sensorAddress => {
    //let sensor = control.input(sensorIndex, "UnnamedSensor" + sensorIndex, sensorAddress);
    //sensorList.push(sensor);
    sensorIndex ++;
});

app.set('view engine', 'ejs');
app.set('views','views');

const configRoutes = require('./routes/config');
const brewRoutes = require('./routes/brew');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules', 'bootstrap')));
app.use(express.static(path.join(__dirname, 'node_modules', 'popper.js')));
app.use(express.static(path.join(__dirname, 'node_modules', 'jquery')));

app.use('/configure', configRoutes);
app.use('/brew', brewRoutes);

app.get('/', (req, res, next) => {
    res.render('index', {
        pageTitle: 'Scooby Brew',
        path: ''
    });
})

app.use(errorController.get404);

io.on('connection', function (socket) {
    let i = 1;
    socket.emit('consoleMessage', 'Socket.io connected.');
    socket.on('requestData', function(){
       // console.log("Data request " + i);
        //i++;
        let temp1 = sensors.readF(initList[0]);
        socket.emit('sensor1', temp1);
    });
});

server.listen(3000);

process.on('SIGINT', function() {
    // closing functions here
    process.exit();
})