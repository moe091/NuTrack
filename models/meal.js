var mongoose = require('mongoose');



var nutrientInfo = new mongoose.Schema({
	name: String,
	abbr: String,
	id: Number,
	total: Number,
	unit: String
});

var portionSchema = new mongoose.Schema({
	ndbno: Number,
	servings: Number,
	name: String,
	nutrientTotals: [nutrientInfo]
});


var mealSchema = new mongoose.Schema({
	name: String,
  date: {type: Date, default: Date.now}, //meal plans don't have date, meal items in tracker have date
	nutrientTotals: [],
	portions: [portionSchema]
});




module.exports = mongoose.model('meal', mealSchema);




