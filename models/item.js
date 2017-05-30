var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
    itemName: String,
    exterior: String,
    price: Number,
    picUrl: String,
    default: {
        default: true,
        type: Boolean
    }
});

var Item = module.exports = mongoose.model('Item', itemSchema);

module.exports.getItems = function(callback) {
    Item.find({}).exec(callback);
}

module.exports.resetItems = function() {
    Item.remove({}, function(err) {
        for (var i = 0; i < 12; i++) {
            var newItem = new Item({
                itemName: "",
                exterior: "",
                price: 0,
                picUrl: "/images/skins/default.png",
                default: true
            });

            newItem.save(function(err, c) {
                if (err) throw err;
            });
        }
    });
}