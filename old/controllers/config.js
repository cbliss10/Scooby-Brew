const config = require('../models/config');

exports.getConfig = (req, res, next) => {
    res.render('config.ejs', {
        pageTitle: 'Configuration',
        path: '/configure'
    });
}

exports.postConfig = (req, res, next) => {
    // handle new data
    let data = req.config;
    config.saveConfig(data)
    
    res.redirect('/');
}

exports.getData = (req, res, next) => {
    // handle new data
    
    res.status(200).json(req.config);
}