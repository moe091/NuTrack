var express = require('express');
var router = express.Router();
 
var fs = require('fs');

var User = require('../../models/user'); 
var Meal = require('../../models/meal');
var food = require('../../foods');


router.post('/newmeal', (req, res, next) => {
	console.log("called the enw route");
	console.log("called the enw route");
	console.log("body:", req.body);
	
	new Promise(function(resolve, reject) {
		let itemsData = [];
		for (var i in req.body.items) {
			food.nd.foodReports({
				ndbno: req.body.items[i],
				type: 'b'
			}, function(err, res) {
				console.log("response:", res);
				console.log("itemsData length=" + itemsData.length + ",  body.length=" + req.body.items.length);
				itemsData.push(res);
				if (itemsData.length == req.body.items.length) {
					resolve(itemsData);
				}
			});

		}
		
	}).then((data) => {
		res.setHeader('Content-Type', 'application/json');
		res.send({itemsData: data});
	}).catch((err) => {
		
	});
});


router.post('/create', (req, res, next) => {
	console.log("Create Meal ROUTE!");
	console.log("Create Meal ROUTE!");
	console.log("Create Meal ROUTE!");
	console.log("Create Meal ROUTE!");
	console.log("req:", req);
	if (req.user) {
		
		User.findById(req.user.id, (err, user) => { 
			
			var portions = req.body.items.map((item) => {
				console.log("_portion, item=", item);
				return {
					ndbno: item.report.food.ndbno,
					servings: item.amount,
					name: item.report.food.name
				}
			}); 
			var newMeal = Meal({
				name: req.body.mealName,
				portions: portions,
				date: req.body.date,
				nutrientTotals: req.body.nutTotals
			});
			
			newMeal.save((err) => {
				if (err) {
					console.log("ERROR SAVING MEAL: ", newMeal);
				} else {
					console.log("SAVING MEAL", newMeal);
					user.mealPlans.push(newMeal);
					user.save((err) => {
						if (err) {
							console.log("error saving user:", user);
						} else {
							console.log("!!Saved User!!", user);
							res.send({success: true, message: "Created new meal: " + req.body.mealName, user: user, meal: newMeal});
						}
					})
				}
			});
		})
		 
	} else {
		res.send({success: false, message: "You need to be logged in to create a new meal"});
	}
});

/** ----== Show Meal Page ==----
Display each meal: [name, nutrient vals, food item names]
	links: edit/view, delete, checkbox(for add to tracker/planner via navbar)

for now, edit/view links to edit meal page, eventually replace with a modal or animated div that stretches oeut under the meal

**/
router.get('/show', (req, res, next) => {
	res.render('index');
});
router.get('/new', (req, res, next) => {
	res.render('index');
});

router.get('/showmeals', (req, res, next) => {
	if (req.user) {
		res.send({success: true, message: "Your Meals - " + req.user.username, mealPlans: req.user.mealPlans});
	} else {
		res.send({success: false, message: "You are not logged in!", mealPlans: []});
	}
});


//tracker route - respond with user.tracker info if logged in, if not redirect to register/login page and send message:"log in to create and view tracker"
//tracker page - can change the view based on time-period(day, week, month) and date(this week, yesterday, last month, etc)
//each page type is made up of trackerDAY components, either way each component displays info for a single day, a monthly one will just have 30 smaller ones and a daily one will have a single, bigger, more detailed component.
//monthly(30-day) component will have 30 DayTrackerMonth components aranged in col's of 7 with the days of the week labeled across the top, and the date on the actual day componenent(e.g oct 30, feb 4) in the top-left corner
//weekly components will have the day of the week big on the top(left or mid) with the date smaller on the right
//day components will have the day of week and date both in small text on top-right of component

//all TrackerDay components will have a main 'content' area where the actual meals or w/e are displayed
//the meals will be displayed from top to bottom in the content area in order of time of day, the time will be displayed to the left of the div and the meal name will be to the right of that. Hovering over it will create a div-tooltip that displays the food items and a nutrientDetails component with the nutrient totals for that meal
//(NOTE:[IDEA] have the NutrientDetails component have an optional percentage prop for each nutrient, that will represent e.g the percentage of the daily recommended amount or the percentage of that meals nutrients relative to the totals for the entire day, the percentage will be represented by coloring the <li> for the nutrient from left to right or bottom to top, e.g 20% across if it is 20% of total).
//clicking on a meal name will take you to that meals page(the editMeal/newMeal/mealBuilder)

//each day component will have a + icon at the bottom to add meals/products to it, which will pop up a little menu offering to 'add from search' or 'add from saved meals', add from search will take you to the search component with the tracker+day sent as props. The search page will have an 'add to tracker(10/17)' button that is greyed out  until items are checked in the search, then clicking them will take you right to a page where you select the time of day to add the item to(and select the date, but it will be pre-set to the date that was provided as a prop to the search component). clicking the 'add from saved meals' option will take you to the showMeals page and pass a prop for the tracker+day to the showmeal component. ShowMeal will then render with a button at the bottom of every meal saying 'add to tracker(11/7)' that, when clicked, takes you to the page to select the time(and optionally change the date) and add the meal to the tracker.

router.get('/tracker', (req, res, next) => {
	
})

module.exports = router;











