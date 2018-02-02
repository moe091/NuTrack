var express = require('express');
var router = express.Router();

var food = require('../foods');
var foodHelper = require('../helpers/foodhelper');

var User = require('../models/user');
var trackerRoute = require('./user/trackerRoute');
var meals = require('./user/meals');

/* GET users listing. */



router.use('/tracker', trackerRoute);
router.use('/meals', meals);

router.get('/home', function(req, res, next) {
	if (req.isAuthenticated()) {
		
		res.render('user/home');
		console.log('rendered user/home, is authenticated');
		console.log('\n\n');
		
	} else {
		
		res.render('user/home');
		console.log('rendered user/home, IS NOT AUTHENTICATED');
		console.log('\n\n');
		
	}
});





router.get('/search/:q', function(req, res, next) {  
 	console.log("user.js /search/:q");
	
	res.render('index', {title: req.params.q, data: req.params.q}); 
	
	console.log('rendered index, title and data = ', req.params.q);
	console.log('\n\n');
});





router.get('/search', function(req, res, next) {  
 	console.log("user.js /search");
	
	res.render('index', {title: "Search", data: null}); 
	
	console.log('rendered index, title: Search and data: null');
	console.log('\n\n');
});





router.get('/search/results/:q', (req, res, next) => {
	console.log('user.js /search/results/:q');
	
	var nutrientNames;
		nutrientNames = ["Calories", "Fat", "Sugar", "Carbs", "Protein"];
	
	var e = food.search(req.params.q, 25, 0).then(function(val) {
		
		res.send({nutNames: nutrientNames, items: val.list, query: req.params.q});
		
		console.log('rendered index, items.length:', val.list.length);
		console.log('\n\n');
		
	}).catch(function(err) {
		
		console.log('error rendering index(/search/results/:q), err:', err);
		console.log('\n\n');
		
		res.send({nutNames: nutrientNames, items: null, query: req.params.q});
		
	}); 
});






router.post('/item/list', (req, res, nex) => {
	console.log('user.js /item/list');
	
	//TODO: instead of this big complicated process to find nutrients/names, just take the watchedNutrients, and for each item set nutrients[i] = findNutrient(nutrients, watchedNutrients[i]);
	//findNutrient will set values to "N/A" if they don't exist, so React can easily render without any complicated client side logic
	var watched = []
		if (req.user) {
			watched = req.user.watchedNutrients;
		}
		foodHelper.getNutrientInfos(req.user, req.body.ndbs, req.body.type, req.session).then((nutrientList) => {
			
				if (req.body.type == 'b') {
					var index = -1;
					for (var i = 0; i < nutrientList.length; i++) {
						if (nutrientList[i].nutrients.length >= 5) {
							index = i;
							break;
						}
					}

					res.setHeader('Content-Type', 'application/json');
					res.send({
						nutrients: nutrientList,
						nutrientNames: nutrientList[index].nutrients.map((n) => {
							return n.name
						})				
					});

					console.log('sent json from /item/list(body type == "b"), nutrients.length: ', nutrientList.length);
					console.log('\n\n');
				
			} else {
				
					res.setHeader('Content-Type', 'application/json');
					res.send({
						nutrients: nutrientList,
						watched: watched
					});

					console.log('sent json from /item/list(body type != "b"), nutrients.length: ', nutrientList.length);
					console.log('\n\n');
				
			}
			
		}).catch((err) => {
			console.log("/item/list error:", err);
    	res.setHeader('Content-Type', 'application/json');
			res.send("just a string");
		});
	
});


module.exports = router;