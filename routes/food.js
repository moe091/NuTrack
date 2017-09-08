var express = require('express');
var router = express.Router();

var food = require('../foods');

/* GET users listing. */
router.get('/:no', function(req, res, next) {
      //var f = food.report('01009', 'b');
    var e = food.getReport(req.params.no, 's').then(function(val) {
        console.log(val);
        res.render('index', { data: val });
    }).catch(function(err) {
        console.log('ERROR:', err);
        res.render('index', {title: err}); 
    });
});

module.exports = router;
