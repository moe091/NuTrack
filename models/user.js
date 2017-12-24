var mongoose = require('mongoose');  
var pplMongoose = require('passport-local-mongoose');
var tracker = require('./tracker.js');




var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    tracker: tracker.schema,
    planner: tracker.schema
});

userSchema.plugin(pplMongoose);



module.exports = mongoose.model('User', userSchema);




