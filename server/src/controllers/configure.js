const config = require('../models/configure');
exports.getConfig = (req, res) => {
    res.send([req.config])
}

exports.postConfig = (req, res, next) => {
    // handle new data
    //console.log(req);
    let data = req.body;
    //console.log("request body: " + JSON.stringify(req.body))
    config.saveConfig(data)
    res.send('Success!')
}
