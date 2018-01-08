var express = require('express');
var router = express.Router();
 
var fs = require('fs');

var User = require('../../models/user');
var Portoin = require('../../models/portion');
var Meal = require('../../models/meal');
var food = require('../../foods');


router.post('/new', (req, res, next) => {
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


module.exports = router;
