var express = require('express');
var router = express.Router();
 
var fs = require('fs');

var User = require('../../models/user'); 
var Meal = require('../../models/meal');
var Tracker = require('../../models/tracker');
var Planner = require('../../models/planner');
var food = require('../../foods');


router.get('/new', (req, res, next) => {
	res.render('index');
});

router.post('/create', (req, res, next) => {
	req.body.meal.date = req.body.date;
	console.log("\n\n\n\nPLANNER/create\n\n\n\n");
	console.log("req:", req.body);
	
	
	if (req.user) {
		//find user making request
		User.findById(req.user.id, (err, user) => {
			//if planner doesn't exist yet, create one for this user
			if (typeof user.planner == "undefined") {
				user.planner = {
					meals: []
				}
				console.log("Created planner for user:", user);
			}
			
			//create obj to add to planner array
			var plannerMeal = {
				meal: req.body.meal
			}
			
			//just a fix, if planner array element is an obj with separate date/meal props, delete that obj(get rid of ref) and make the meal object take its place in the array
			for (var i = 0; i < user.planner.meals.length; i++) {
				if (user.planner.meals[i].hasOwnProperty('date')) {
					user.planner.meals[i] = user.planner.meals[i].meal;
				}
			}
			
			user.planner.meals.push(plannerMeal);
			user.save((err) => {	
				//send err msg if error, send planner and success msg if no error
				if (err) {
					console.log("ERROR SAVING TRACKER: ", user.planner);
					//send the planner in an obj called 'tracker' - for now the planner uses the trackerShow/trackerAdd components for display and is expecting a var called tracker
					res.send({message: "error saving planner", tracker: user.planner});
				} else {
					res.send({success: true, message: ("added meal " + req.body.meal.name + " to planner"), planner: user.planner});
				}
				
			});//user.save
			
		});//User.findById
	}//if (req.user)
	
	
});

router.get('/showplanner', (req, res, next) => {
	console.log('planner.js /showplanner');
	if (req.user) {
		//send the planner in an obj called 'tracker' - for now the planner uses the trackerShow/trackerAdd components for display and is expecting a var called tracker
		res.send({tracker: req.user.planner, endDate: new Date(), term: 'week', watchedNutrients: req.user.watchedNutrients, message: "TRACKER(week):"});
	} else {
		res.send({endDate: new Date(), term: 'week', message: 'Unable to retrieve data from server'});
	}
});

router.get('/show', (req, res, next) => {
        res.render('index', { data: 'show', user: req.user });
});

module.exports = router;
