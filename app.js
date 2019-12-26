const express = require('express');
const path = require('path');
const expressHbs = require('express-handlebars');

const app = express();

app.engine('hbs', expressHbs({layoutsDir: 'views/layouts', defaultLayout: "main-layout", extname:'hbs'}));
app.set('view engine', 'hbs');
app.set('views','views');

app.use('/', (req, res, next) => {
    res.render("initialize");
});

app.listen(3000);