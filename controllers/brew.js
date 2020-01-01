exports.getBrew = (req, res, next) => {
    res.render('brew.ejs', {
        pageTitle: 'Brew',
        path: '/brew'
    });
}