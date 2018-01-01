var mongoose = require('mongoose');
var meal = require('./meal.js');

var trackerSchema = new mongoose.Schema({
    meals: [meal.schema], //the meals in tracker should all have dates
    
    
});

module.exports = mongoose.model('tracker', trackerSchema);




