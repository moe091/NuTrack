var express = require('express');
var router = express.Router();

var food = require('../foods');
var foodHelper = require('../helpers/foodhelper');
var fs = require('fs');

/* GET users listing. */



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
    console.log("FOOD SEARCH ROUTE - " + req.query.query);
    
    var e = food.search(req.query.query, 10, 0).then(function(val) {
        
        return new Promise(function(resolve, reject) {
            var itemInfos = [];
            for (var i = 0; i < val.list.item.length; i++) {
                console.log("looking up ndbno: " + val.list.item[i].ndbno);
                food.nd.foodReports({
                    ndbno: val.list.item[i].ndbno,
                    type: 'b'
                }, function(err, res) {
                    if (err) {
                        console.log("ERROR: ", err);
                    } else {
                        console.log("SUCCESS. length = " + itemInfos.length);
                        console.log(res.report.food.nutrients);
                    }
                    var info = []
                    foodHelper.populateNutrients(info, res.report.food.nutrients);
                    console.log('infos: ' + info[0].name + '-' + info[0].value);
                    //info.cals = res.report.food.nutrients.filter(function(obj) {
                        //return obj.nutrient_id === '208';
                    //});
                    
                    //info.cals = info.cals[0].value;
                    console.log('calories: ', info.cals);
                    itemInfos.push(info);
                    if (itemInfos.length == val.list.item.length) {
                        resolve(itemInfos);
                        
                    }
                });
            }//end loop
        }).then(function(infos) {
            res.render('food/search', {data: val, user: req.user, infos: infos });
        })
            
        
        
    });
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
