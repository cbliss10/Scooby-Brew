exports.getConfig = (req, res, next) => {
    res.render('config.ejs', {
        pageTitle: 'Configuration',
        path: '/configure'
    });
}