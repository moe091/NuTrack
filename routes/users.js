var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Meal = require('../models/meal.js');
var Tracker = require('../models/tracker.js');
var passport = require('passport');

/* GET users listing. */
router.get('/register', function(req, res, next) {
    res.render('index', {user: req.user});
});

router.post('/register', function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
        if (err) {
            console.log("ERROR---", err);
            res.send({success: false, message: err.message})
        }
        
        passport.authenticate('local')(req, res, function() {
            
        res.redirect('/users/login/success'); 
        });
    });
});

router.get('/login', function(req, res, next) {
   // res.render('login', {user: req.user });
    res.render('index', {user: req.user });
});

router.post('/login', passport.authenticate('local', {
    
	
			successRedirect : '/users/login/success', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
}));

router.get('/login/success', function(req, res, next) {
	res.send({success: true, message: "Logged in Successfully: ", user: req.user})
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});



module.exports = router;
