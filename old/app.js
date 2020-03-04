const path = require('path');

const express = require('express');
const app = express();
const server = require('http').Server(app);
express.server = server;

const bodyParser = require('body-parser');
const errorController = require('./controllers/error');

const db = require('./util/database');

app.set('view engine', 'ejs');
app.set('views','views');

const configRoutes = require('./routes/config');
const brewRoutes = require('./routes/brew');
const config = require('./models/config');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules', 'bootstrap')));
app.use(express.static(path.join(__dirname, 'node_modules', 'popper.js')));
app.use(express.static(path.join(__dirname, 'node_modules', 'jquery')));
app.use(express.static(path.join(__dirname, 'node_modules', 'vue' )));
app.use(express.static(path.join(__dirname, 'public', 'scooby-vue', 'dist', 'js' )));

app.use(config.loadConfig);
app.use('/configure', configRoutes);
app.use('/brew', brewRoutes);

app.get('/', (req, res, next) => {
    res.render('index', {
        pageTitle: 'Scooby Brew',
        path: ''
    });
})

app.use(errorController.get404);

server.listen(3000);

process.on('SIGINT', function() {
    // closing functions here
    console.log("Exiting ...");
    process.exit();
})