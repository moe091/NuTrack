var express = require('express');
var router = express.Router();

var food = require('../foods');
var foodHelper = require('../helpers/foodhelper');
var fs = require('fs');

var User = require('../models/user');

/* GET users listing. */
//​ saving this



router.get('/item/:no', function(req, res, next) {
      //var f = food.report('01009', 'b');
    var e = food.getReport(req.params.no, 's').then(function(val) {
        res.render('food', { data: val, user: req.user });
    }).catch(function(err) {
        console.log('ERROR:', err);
        res.render('index', {title: err}); 
    });
});

router.get('/search/', function(req, res, next) {
      //var f = food.report('01009', 'b');
    console.log("plain search!!!!!!!!!!!!!!!!!!!");
    console.log("plain search!!!!!!!!!!!!!!!!!!!");
    console.log("plain search!!!!!!!!!!!!!!!!!!!");
    var e = food.search(req.query.query, 10, 0).then(function(val) {
        
        return new Promise(function(resolve, reject) {
            var itemInfos = [];
						var nutLists = [];
            for (var i = 0; i < val.list.item.length; i++) {
                //console.log("looking up ndbno: " + val.list.item[i].ndbno);
                food.nd.foodReports({
                    ndbno: val.list.item[i].ndbno,
                    type: 'b'
                }, function(err, res) {
                    if (err) {
                        console.log("ERROR: ", err);
                    } else {
                        //console.log("SUCCESS. length = " + itemInfos.length);
                    }
                    var info = []
                    foodHelper.populateNutrients(info, res.report.food.nutrients); 
										for (n in res.report.food.nutrients) {
											if (res.report.food.nutrients[n].nutrient_id == '205') {
												console.log(res.report.food.nutrients[n]);
											}
										}
									
									
									
										if (req.user) { //if logged in, update watchedNutrients if it is still null
											if (req.user.watchedNutrients && req.user.watchedNutrients.length == 0) {
												console.log("attempting update\nID = " + req.session.passport.user);
												User.update({_id: req.user._id}, {watchedNutrients: [203, 204, 205, 208, 269, 307]}, function(err, num, rawRes) {
													if (err) {
														console.log("error updating user");
													} else {
														console.log("update successful. updated " + num + " users");
														console.log("raw response:", rawRes);
														console.log('nuts:', req.user.watchedNutrients);
													}
												})
											}
											//logged in, watchedNutrients is not null(unless error, handle above)
											var watched = req.user.watchedNutrients;
											
										}
									
										if (watched && watched.length > 0) {
											var fObj = foodHelper.createNutrientObj(res.report.food, watched);
											console.log("returned fObj:", fObj);
											nutLists.push(fObj);
											console.log("__________________pushing fObj to nutLists. length=" + nutLists.length + "__________________________");
										} else {
											console.log("\n\n\n\n\nWatchedNutrients still empty!!");
										}
                    //info.cals = res.report.food.nutrients.filter(function(obj) {
                        //return obj.nutrient_id === '208';
                    //});
                    
                    //info.cals = info.cals[0].value;
                    itemInfos.push(info);
                    if (itemInfos.length == val.list.item.length) {
                        resolve(nutLists);
                        
                    }
                });
            }//end loop
        }).then(function(nutrientList) {
						/**
						User.update({_id: req.user._id}, {watchedNutrients: [204, 205, 208, 269, 307]}, function(err) {
							console.log("\n\n\n\n\n\n\n\n\n\nUSER:", req.user.watchedNutrients);
            	res.render('food/search', {data: val, user: req.user, infos: infos });
						});
						**/
							console.log("RESPONDING - this is the old route");
            	res.render('food/search', {data: val, user: req.user, message: "Search Results", nutList: nutrientList });
        });
            
        
        
    }).catch(function(err) {
			console.log("catch error:", err);
				res.render('food/search', {data: null, user: req.user, infos: null, message: "No Results Found" });
		});
});

router.get('/search/:q', function(req, res, next) {  
 	console.log("search food route");
	console.log("responding - New search route")
	console.log("user:", req.user);
	res.render('index', {title: req.params.q, data: req.params.q}); 
});




router.get('/search/results/:q', (req, res, next) => {
	console.log("sesion:", req.session);
	console.log("user:", req.user);
	console.log("testname: ", req.body);
	var nutrientNames;
		nutrientNames = ["Calories", "Fat", "Sugar", "Carbs", "Protein"];
	
	var e = food.search(req.params.q, 25, 0).then(function(val) {
	console.log("user:", req.user);
		res.send({nutNames: nutrientNames, items: val.list, query: req.params.q});
	}).catch(function(err) {
		res.send({nutNames: nutrientNames, items: null, query: req.params.q});
	}); 
});


router.post('/item/list', (req, res, nex) => {
	console.log("-\n-\n-\n-\n");
	console.log("-\n-\n-\n-\n");
	console.log("req body:", req.body);
	
	//TODO: instead of this big complicated process to find nutrients/names, just take the watchedNutrients, and for each item set nutrients[i] = findNutrient(nutrients, watchedNutrients[i]);
	//findNutrient will set values to "N/A" if they don't exist, so React can easily render without any complicated client side logic
	var watched = []
		if (req.user) {
			watched = req.user.watchedNutrients;
		}
		foodHelper.getNutrientInfos(req.user, req.body.ndbs, req.body.type).then((nutrientList) => {
			if (req.body.type == 'b') {
				var index = -1;
				for (var i = 0; i < nutrientList.length; i++) {
					if (nutrientList[i].nutrients.length >= 5) {
						index = i;
						break;
					}
				}

				console.log("user:", req.user);
				res.setHeader('Content-Type', 'application/json');
				res.send({
					nutrients: nutrientList,
					nutrientNames: nutrientList[index].nutrients.map((n) => {
						return n.name
					})				
				});
			} else {
				res.setHeader('Content-Type', 'application/json');
				res.send({
					nutrients: nutrientList,
					watched: watched
				});
			}
		}).catch((err) => {
			console.log("error:", err);
    	res.setHeader('Content-Type', 'application/json');
			res.send("just a string");
		});
	
	console.log("-\n-\n-\n-\n");
	console.log("-\n-\n-\n-\n");
});






router.get('/:no', function(req, res, next) {
      //var f = food.report('01009', 'b');
     console.log("GET FOOD ROUTE");
    var e = food.getReport(req.params.no, 's').then(function(val) {
        res.render('food', { data: val, user: req.user });
    }).catch(function(err) {
        console.log('ERROR:', err);
        res.render('index', {title: err}); 
    });
});



module.exports = router;
