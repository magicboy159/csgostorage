var mongoose = require('mongoose');

var siteSchema = mongoose.Schema({
    closed: {
        type: Boolean
    },
    admins: [{
        username: {
            type: 'String'
        }
    }]
}, { collection: 'sitedata' });

var Sitedata = module.exports = mongoose.model('Sitedata', siteSchema);

module.exports.toggleClosed = function(callback) {
    Sitedata.findOne({}, function(err, data) {
        if(data.closed) {
            data.update({closed: false}, function(err, raw) {
                if(err) {
                    throw err;
                }
                callback(false, raw)
            });
        } else {
            data.update({closed: true}, function(err, raw) {
                if(err) {
                    throw err;
                }
                callback(true, raw);
            });
        }
    });
}

module.exports.isClosed = function(callback) {
    Sitedata.findOne({}, function(err, data) {
        if(err) {
            throw err
        }
        callback(data.closed);
    });
}