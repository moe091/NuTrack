var mongoose = require('mongoose');  
var pplMongoose = require('passport-local-mongoose');
var tracker = require('./tracker.js');
var planner = require('./planner.js');
var meal = require('./meal.js');




var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
		mealPlans: [meal.schema],
    tracker: tracker.schema,
    planner: planner.schema,
		watchedNutrients: {type: Array, 'default': [203, 204, 205, 208, 269, 307]}
});

userSchema.plugin(pplMongoose);



module.exports = mongoose.model('User', userSchema);




