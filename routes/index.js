var express = require('express');
var router = express.Router();

var moment = require('moment');

var User = require('../models/user');
var Item = require('../models/item')
var Sitedata = require('../models/sitedata');

module.exports = function(passport) {

    router.use(closed);

    router.use(function(req, res, next) {
        res.locals.loginMessage_fail = req.flash('loginMessage_fail');
        res.locals.loginMessage_succ = req.flash('loginMessage_succ');
        res.locals.registerMessage_fail = req.flash('registerMessage_fail');
        res.locals.registerMessage_succ = req.flash('registerMessage_succ');
        res.locals.indexMessage_succ = req.flash('indexMessage_succ');
        next();
    });

    //router.use('/admin/*', requiresAdmin);

    /* GET home page. */
    router.get('/', function(req, res, next) {

        var items = Item.find({}, function(err, items) {
            res.render('index', { 
                user: req.user,
                items: items
            });
        });
        
    });

    router.get('/login', function(req, res) {
        res.render('login');
    });

    router.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if(err) { return next(err) }
            if(!user) { return res.redirect('/login') }
            req.logIn(user, function(err) {
                if(err) { return next(err) }
                if(user.isAdmin) {
                    return res.redirect('/admin/dashboard');
                }
                return res.redirect('/');
            });
        })(req, res, next);
    });

    router.get('/register', function(req, res) {
        res.render('register');
    });

    router.post('/register', function(req, res) {
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
        var password2 = req.body.password2;

        req.checkBody('username', 'Username is required').notEmpty();
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'Name is required').isEmail();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

        var errors = req.validationErrors();
        if(errors) {
            res.render('register', {
                errors: errors
            });
        } else {
            var newUser = new User({
                username,
                password,
                email
            });



            User.createUser(newUser, function(err, user, exists) {
                if(err) {
                    throw err;
                }

                if(exists) {
                    req.flash('registerMessage_fail', 'User already exists');
                    res.redirect('/register');
                } else {
                    req.flash('loginMessage_succ', 'You are registered and can now login');

                    res.redirect('/login')
                }

                
            });
        }

    });

    router.post('/settings', isLoggedIn, function(req, res) {

    });

    router.get('/admin/dashboard', function(req, res) {
        User.getUsers(function(err, users) {
            var editedUsers = [];
            for (var i = 0; i < users.length; i++) {
                var user = {}
                user.username = users[i].username;
                user.email = users[i].email;
                user.joined = moment(users[i].joined).format('DD MMM YYYY');
                user.credits = users[i].credits;
                editedUsers.push(user);
            }
            Sitedata.isClosed(function(closed) {
                console.log('Closed', closed);
                res.render('./admin/dashboard', {
                    layout: 'adminpanel',
                    user: req.user,
                    page: {
                        dashboard: true
                    },
                    users: editedUsers,
                    closed: closed
                })
            })
            
        });
    });

    router.get('/admin/users', function(req, res) {
        User.getUsers(function(err, users) {

        });
    });

    router.post('/admin/action', function(req, res) {
        Sitedata.toggleClosed(function(state, raw) {
            res.redirect('/admin/dashboard');
        });
    });

    router.get('/logout', function(req, res) {
        req.logout();
        req.flash('indexMessage_succ', 'You are now logged out');

        res.redirect('/');
    });

    return router;
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function requiresAdmin(req, res, next) {
    if(req.isAuthenticated() && req.user && req.user.isAdmin === true) {
        next();
    } else {
        res.redirect('/');
    }
}

function closed(req, res, next) {
    Sitedata.find({}, function(err, data) {
        var closed = data[0].closed;
        var path = req.path;

        if(closed) {
            if(path.match(/\/admin\/[a-z]*/)) {
                next();
            } else {
                res.render('closed', {
                    layout: false
                });
            }
        } else {
            next();
        }
    });
}