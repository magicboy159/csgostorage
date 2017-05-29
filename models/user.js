var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    tradeUrl: {
        type: String
    },
    credits: {
        type: Number,
        default: 0
    },
    joined: {
        type: Date,
        default: Date.now
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

var User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function(newUser, callback) {
    User.findOne({username: newUser.username}, function(err, user) {
        if(err) {
            throw err;
        }

        if(user) {
            callback(null, false, true);
        }
    });
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(function(err, user) {
                callback(err, user, null);
            });
        });
    })
}

module.exports.getUsers = function(callback) {
    User.find({}).sort({joined: -1}).limit(5).exec(callback);
}