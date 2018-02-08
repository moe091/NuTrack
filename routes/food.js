var express = require('express');
var router = express.Router();

var food = require('../foods');
var foodHelper = require('../helpers/foodhelper');
var fs = require('fs');

var User = require('../models/user');
var meals = require('./user/meals');
var tracker = require('./user/tracker');

/* GET users listing. */
//​

router.use('/meals', meals);
router.use('/tracker', tracker);

router.get('/item/:no', function(req, res, next) {
      //var f = food.report('01009', 'b');
    var e = food.getReport(req.params.no, 's').then(function(val) {
        res.render('food', { data: val, user: req.user });
    }).catch(function(err) {
        console.log('ERROR:', err);
        res.render('index', {title: err, user: req.user}); 
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














router.get('/:no', function(req, res, next) {
      //var f = food.report('01009', 'b');
     console.log("GET FOOD ROUTE");
    var e = food.getReport(req.params.no, 's').then(function(val) {
        res.render('food', { data: val, user: req.user });
    }).catch(function(err) {
        console.log('ERROR:', err);
        res.render('index', {title: err, user: req.user }); 
    });
});



module.exports = router;
