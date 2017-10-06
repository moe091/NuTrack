var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Meal = require('../models/meal.js');
var Tracker = require('../models/tracker.js');
var passport = require('passport');

/* GET users listing. */
router.get('/register', function(req, res, next) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
    console.log("username: " + req.body.username);
    console.log("password: " + req.body.password);
    var meal = new Meal({name: "cheerios meal"});
    var tracker = new Tracker({meals: [meal]});
    meal.save();
    tracker.save();
    
    User.register(new User({username: req.body.username, tracker: tracker}), req.body.password, function(err, user) {
        if (err) {
            console.log("ERROR", err);
            return res.render('register', {user: user});
        }
        
        passport.authenticate('local')(req, res, function() {
            
            
            res.redirect('/'); 
        });
    });
});

router.get('/login', function(req, res, next) {
    res.render('login', {user: req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});



module.exports = router;
