var express = require('express');
var router = express.Router();
 
var fs = require('fs');

var User = require('../../models/user'); 
var Meal = require('../../models/meal');
var Tracker = require('../../models/tracker');
var food = require('../../foods');


router.get('/new', (req, res, next) => {
	res.render('index');
});

router.post('/create', (req, res, next) => {
	req.body.meal.date = req.body.date;
	console.log("\n\n\n\nTracker/create\n\n\n\n");
	console.log("req:", req.body);
	console.log("meal date:", req.body.meal.date);
	if (req.user) {
		User.findById(req.user.id, (err, user) => {
			var trackerMeal = {
				meal: req.body.meal
			}
			for (var i = 0; i < user.tracker.meals.length; i++) {
				if (user.tracker.meals[i].hasOwnProperty('date')) {
					user.tracker.meals[i] = user.tracker.meals[i].meal;
				}
			}
			user.tracker.meals.push(trackerMeal);
			user.save((err) => {
				if (err) {
					console.log("ERROR SAVING TRACKER: ", user.tracker);
					res.send({message: "error saving tracker", tracker: user.tracker});
				} else {
					res.send({success: true, message: ("added meal " + req.body.meal.name + " to tracker"), tracker: user.tracker});
				}
			})
		});
	}
});

router.get('/showtracker', (req, res, next) => {
	if (req.user) {
		res.send({tracker: req.user.tracker, endDate: new Date(), term: 'week', watchedNutrients: req.user.watchedNutrients, message: "TRACKER(week):"});
	} else {
		res.send({endDate: new Date(), term: 'week', message: 'Unable to retrieve data from server'});
	}
});

router.get('/show', (req, res, next) => {
        res.render('index', { data: 'show', user: req.user });
});

module.exports = router;
