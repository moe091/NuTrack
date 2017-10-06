var mongoose = require('mongoose');
var pplMongoose = require('passport-local-mongoose');



var portionSchema = new mongoose.Schema({
    ndb: String,
    amount: Number,
    name: String,
})


module.exports = mongoose.model('portion', portionSchema);




