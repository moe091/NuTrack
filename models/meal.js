var mongoose = require('mongoose');
var portion = require('./portion.js');




var mealSchema = new mongoose.Schema({
    name: String,
    portions: [portion.schema],
    date: {type: Date, default: Date.now}
});



module.exports = mongoose.model('meal', mealSchema);




