exports.isLogin = function(req, res, next) {
    var email = req.session.email;
    if (email) next();
    else {
        console.log('user not login, sending 404.html ...');
        res.redirect('/404.html');
    }
}
