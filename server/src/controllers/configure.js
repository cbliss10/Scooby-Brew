const config = require('../models/configure');
exports.getConfig = (req, res) => {
    res.send([req.config])
}

exports.postConfig = (req, res, next) => {
    // handle new data
    let data = req.config;
    config.saveConfig(data)
}

exports.getData = (req, res, next) => {
    // handle new data

    res.status(200).json(req.config);
}