var mongoose = require('mongoose');  
var pplMongoose = require('passport-local-mongoose');
var tracker = require('./tracker.js');
var meal = require('./meal.js');




var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
		mealPlans: [meal.schema],
    tracker: tracker.schema,
    planner: tracker.schema,
		watchedNutrients: [Number]
});

userSchema.plugin(pplMongoose);



module.exports = mongoose.model('User', userSchema);




