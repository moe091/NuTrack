var mongoose = require('mongoose');
var meal = require('./meal.js');

var plannerMealSchema = new mongoose.Schema({
	meal: meal.schema,
	date: {type: Date, default: Date.now}
});

var plannerSchema = new mongoose.Schema({
    meals: [plannerMealSchema], //the meals in planner should all have dates
    
    
});




module.exports = mongoose.model('planner', plannerSchema);




