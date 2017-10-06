var mongoose = require('mongoose');
var meal = require('./meal.js');

var trackerSchema = new mongoose.Schema({
    meals: [meal.schema],
    
    
});

module.exports = mongoose.model('tracker', trackerSchema);




