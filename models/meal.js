var mongoose = require('mongoose');
var portion = require('./portion.js');




var mealSchema = new mongoose.Schema({
	name: String,
  portions: [portion.schema], //each portion contains an ndbno, an amount(number for # of portions or percentage, and a name representing name of the item)
  date: {type: Date, default: Date.now} //meal plans don't have date, meal items in tracker have date
});



module.exports = mongoose.model('meal', mealSchema);




