var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
    itemName: String,
    exterior: String,
    price: Number,
    picUrl: String
});

var Item = module.exports = mongoose.model('Item', itemSchema);