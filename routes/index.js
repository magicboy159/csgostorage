var express = require('express');
var router = express.Router();

var moment = require('moment');
var multer = require('multer');
var path = require('path');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, 'Skin');
  }
})



var User = require('../models/user');
var Item = require('../models/item');
var Sitedata = require('../models/sitedata');

module.exports = function(passport) {

    // router.use('/admin/*', requiresAdmin);
    router.use(closed);

    router.use(function(req, res, next) {
        res.locals.loginMessage_fail = req.flash('loginMessage_fail');
        res.locals.loginMessage_succ = req.flash('loginMessage_succ');
        res.locals.registerMessage_fail = req.flash('registerMessage_fail');
        res.locals.registerMessage_succ = req.flash('registerMessage_succ');
        res.locals.indexMessage_succ = req.flash('indexMessage_succ');
        next();
    });

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
        if(req.user) {
            res.redirect('/');
        } else {
            res.render('login');
        }
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
        if(req.user) {
            res.redirect('/');
        } else {
            res.render('register');
        }
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

    router.post('/settings/:id', isLoggedIn, function(req, res) {
        var userId = req.params.id;
        var update = {
            tradeUrl: req.body.tradeurl
        }
        User.updateUser(userId, update, function(raw) {
            res.redirect('/');
        });
    });

    router.get('/admin', function(req, res) {
        res.render('./admin/login');
    });

    router.post('/admin', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if(err) { return next(err) }
            if(!user) { return res.redirect('/admin') }
            req.logIn(user, function(err) {
                if(err) { return next(err) }
                if(user.isAdmin) {
                    console.log('USER IS ADMIN');
                    return res.redirect('/admin/dashboard');
                } else {
                    req.logout();
                    return res.redirect('/admin');
                }
            });
        })(req, res, next);
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
                user.tradeUrl = users[i].tradeUrl;
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
            var editedUsers = [];
            for (var i = 0; i < users.length; i++) {
                var user = {}
                user.username = users[i].username;
                user.email = users[i].email;
                user.joined = moment(users[i].joined).format('DD MMM YYYY');
                user.credits = users[i].credits;
                user.tradeUrl = users[i].tradeUrl;
                user.id = users[i].id;
                user.isAdmin = users[i].isAdmin;
                editedUsers.push(user);
            }
            res.render('./admin/users', {
                layout: 'adminpanel',
                page: {
                    users: true
                },
                users: editedUsers
            });
        });
    });

    router.get('/admin/skins', function(req, res) {
        //Item.resetItems();
        User.getUsers(function(err, users) {
            Item.getItems(function(err, items) {
                res.render('./admin/skins', {
                    layout: 'adminpanel',
                    page: {
                        skins: true
                    },
                    users: users,
                    items: items
                });
            })
        });
    });

    router.get('/admin/giftcodes', function(req, res) {
        res.render('./admin/giftcodes', {
            layout: 'adminpanel',
            page: {
                giftcodes: true
            }
        });
    });

    router.post('/offers/trialpay/callback', function(req, res) {
        console.log(req.body);
        res.redirect('/');
    });

    var upload = multer({storage: storage}).any();
    router.post('/admin/action/updateskin', function(req, res) {
        upload(req, res, function(err) {
            if(err) {
                console.log(err);
            }
        })
    });

    router.get('/admin/action/:action/:userid?', function(req, res) {
        var action = req.params.action;
        var userId = req.params.userid;
        
        if(action === 'toggleclosed') {
            Sitedata.toggleClosed(function(state, raw) {
                res.redirect('/admin/dashboard');
            });
        }

        if(action == 'deleteuser') {
            User.findByIdAndRemove(userId, function(err, doc){
                if(err) {
                    throw err;
                }
                res.redirect('/admin/users')
            });
        }
    });

    router.post('/admin/action/:action/:userid?', function(req, res) {
        var action = req.params.action;
        var userId = req.params.userid;
        
        if((action === 'edituser') && userId) {
            var update = {
                username: req.body.username,
                email: req.body.email,
                tradeUrl: req.body.tradeUrl,
                credits: req.body.credits,
                isAdmin: req.body.isAdmin
            }

            User.updateUser(userId, update, function(raw) {
                res.redirect('/admin/users');
            });
                
        }

        if((action === 'editgiftcode') && userId) {

        }

        if(action === 'addgiftcode') {

        }

        
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
            //if(path.match(/\/admin\/[a-z]*/)) {
            if((req.isAuthenticated() && req.user && req.user.isAdmin === true) || path == '/admin') {
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