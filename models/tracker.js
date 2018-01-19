var mongoose = require('mongoose');
var meal = require('./meal.js');

var trackerMealSchema = new mongoose.Schema({
	meal: meal.schema,
	date: {type: Date, default: Date.now}
});

var trackerSchema = new mongoose.Schema({
    meals: [trackerMealSchema], //the meals in tracker should all have dates
    
    
});




module.exports = mongoose.model('tracker', trackerSchema);




