module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            if (req.user.address != undefined) {
                return next();
            }
        }
        req.flash('error_msg', 'Please login to view this resource');
        res.redirect('/users/login');
    },
    ensureAdminAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            if (req.user.address == undefined) {
                return next();
            }
        }
        req.flash('error_msg', 'Please login to view this resource');
        res.redirect('/admin/login');
    }
}