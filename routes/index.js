var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Item = require('../models/item')

module.exports = function(passport) {
    /* GET home page. */
    router.get('/', function(req, res, next) {

        var items = Item.find({}, function(err, items) {
            res.render('index', { 
                user: req.user,
                message_succ: req.flash('indexMessage_succ'),
                items: items
            });
        });
        
    });

    router.get('/login', function(req, res) {
        res.render('login', {
            message_fail: req.flash('loginMessage_fail'),
            message_succ: req.flash('loginMessage_succ')
        });
    });

    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

    router.get('/register', function(req, res) {
        res.render('register', {
            message_fail: req.flash('registerMessage_fail'),
            message_succ: req.flash('registerMessage_succ')
        });
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
            console.log(errors);
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
