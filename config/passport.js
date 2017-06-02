var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

//var configAuth = require('./auth.js');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        passReqToCallback: true
    }, function(req, username, password, done) {
        process.nextTick(function() {
            User.findOne({'username': username}, function(err, user) {
                if(err) {
                    return done(err);
                }

                if(!user) {
                    return done(null, false, req.flash('loginMessage_fail', 'Invalid Credentials'));
                }

                if(!user.validPassword(password)) {
                    return done(null, false, req.flash('loginMessage_fail', 'Invalid Credentials'));
                }

                var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

                User.updateUser(user._id, {ip: ip}, function(raw) {
                    req.flash('indexMessage_succ', 'You are now logged in');

                    return done(null, user);
                });
                
            });
        });
    }));

}