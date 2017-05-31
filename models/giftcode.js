var mongoose = require('mongoose');

var giftcodeSchema = mongoose.Schema({
    name: String,
    code: String,
    worth: Number,
    oneTime: Boolean
});

var Giftcode = module.exports = mongoose.model('Giftcode', giftcodeSchema);

module.exports.getGiftcodes = function(callback) {
    Giftcode.find({}).exec(callback);
}

module.exports.updateGiftcode = function(id, update, callback) {
    User.updateOne({_id: id}, update, function(err, raw) {
        if(err) {
            throw err
        }

        callback(raw);
    })
}