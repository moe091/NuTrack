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
				meal: req.body.meal,
				date: req.body.date
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

module.exports = router;
