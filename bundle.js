/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var mongoose = __webpack_require__(1);
var pplMongoose = __webpack_require__(6);
var tracker = __webpack_require__(7);
var meal = __webpack_require__(3);

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  mealPlans: [meal.schema],
  tracker: tracker.schema,
  planner: tracker.schema,
  watchedNutrients: [Number]
});

userSchema.plugin(pplMongoose);

module.exports = mongoose.model('User', userSchema);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var mongoose = __webpack_require__(1);
var portion = __webpack_require__(20);

var mealSchema = new mongoose.Schema({
  name: String,
  portions: [portion.schema], //each portion contains an ndbno, an amount(number for # of portions or percentage, and a name representing name of the item)
  date: { type: Date, default: Date.now //meal plans don't have date, meal items in tracker have date
  } });

module.exports = mongoose.model('meal', mealSchema);

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {


var NDB = __webpack_require__(18);
var food = {
    nd: new NDB('L43NiLQ6anMJC9LbtX8VH7SMJVHf5XlT8vUAdIVF'),
    val: null,
    getReport: function (no, t) {
        var val = null;
        return new Promise(function (resolve, reject) {
            food.nd.foodReports({
                ndbno: no,
                type: t
            }, function (err, res) {
                //console.log('inside: ', res.toString());
                resolve(res);
            });
        });
    },

    search: function (query, max, offset) {
        return new Promise(function (resolve, reject) {
            food.nd.search({
                q: query,
                max: max,
                offset: offset
            }, (err, res) => {
                if (err) {
                    console.log("ERROR" + err);
                } else {
                    resolve(res);
                }
            });
        });
    }

};

module.exports = food;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("passport-local-mongoose");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var mongoose = __webpack_require__(1);
var meal = __webpack_require__(3);

var trackerSchema = new mongoose.Schema({
    meals: [meal.schema] //the meals in tracker should all have dates


});

module.exports = mongoose.model('tracker', trackerSchema);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {var express = __webpack_require__(0);
var path = __webpack_require__(9);
var favicon = __webpack_require__(10);
var logger = __webpack_require__(11);
var cookieParser = __webpack_require__(12);
var bodyParser = __webpack_require__(13);
var lessMiddleware = __webpack_require__(14);
var passport = __webpack_require__(4);
var LocalStrategy = __webpack_require__(15).Strategy;
var session = __webpack_require__(16);

var index = __webpack_require__(17);
var users = __webpack_require__(19);
var food = __webpack_require__(21);
var user = __webpack_require__(24);

let app = express();

//setup mongoose/db
var mongoose = __webpack_require__(1);
mongoose.connect('mongodb://localhost/locallibrary');
var db = mongoose.connection;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

//PASSPORT/User Authentication
app.use(session({ secret: 'thissecretisreallynotsuchasecret' }));
app.use(passport.initialize());
app.use(passport.session());

var User = __webpack_require__(2);
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', index);
app.use('/users', users);
app.use('/food', food);
app.use('/user', user);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
console.log(process.env.PORT);
app.listen(3002);
module.exports = app;
/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("serve-favicon");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("less-middleware");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("passport-local");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var express = __webpack_require__(0);
var router = express.Router();

var food = __webpack_require__(5);

/* GET home page. */
router.get('/', function (req, res, next) {
    //var f = food.report('01009', 'b');
    var e = food.getReport('01009', 'f').then(function (val) {
        console.log('get-report');
        res.render('index', { data: val, user: req.user });
    }).catch(function (err) {
        console.log('ERROR:', err);
        res.render('index', { title: err });
    });
});

module.exports = router;

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("nutrient-data-laboratory");

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var express = __webpack_require__(0);
var router = express.Router();
var User = __webpack_require__(2);
var Meal = __webpack_require__(3);
var Tracker = __webpack_require__(7);
var passport = __webpack_require__(4);

/* GET users listing. */
router.get('/register', function (req, res, next) {
    res.render('register', {});
});

router.post('/register', function (req, res) {
    console.log("username: " + req.body.username);
    console.log("password: " + req.body.password);
    var meal = new Meal({ name: "cheerios meal" });
    var tracker = new Tracker({ meals: [meal] });
    meal.save();
    tracker.save();

    User.register(new User({ username: req.body.username, tracker: tracker }), req.body.password, function (err, user) {
        if (err) {
            console.log("ERROR", err);
            return res.render('register', { user: user });
        }

        passport.authenticate('local')(req, res, function () {

            res.redirect('/');
        });
    });
});

router.get('/login', function (req, res, next) {
    res.render('login', { user: req.user });
});

router.post('/login', passport.authenticate('local'), function (req, res) {
    res.redirect('/');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var mongoose = __webpack_require__(1);
var pplMongoose = __webpack_require__(6);

var portionSchema = new mongoose.Schema({
    ndb: String,
    amount: Number,
    name: String
});

module.exports = mongoose.model('portion', portionSchema);

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var express = __webpack_require__(0);
var router = express.Router();

var food = __webpack_require__(5);
var foodHelper = __webpack_require__(22);
var fs = __webpack_require__(23);

var User = __webpack_require__(2);

/* GET users listing. */

router.get('/item/:no', function (req, res, next) {
    //var f = food.report('01009', 'b');
    var e = food.getReport(req.params.no, 's').then(function (val) {
        res.render('food', { data: val, user: req.user });
    }).catch(function (err) {
        console.log('ERROR:', err);
        res.render('index', { title: err });
    });
});

router.get('/search/', function (req, res, next) {
    //var f = food.report('01009', 'b');

    var e = food.search(req.query.query, 10, 0).then(function (val) {

        return new Promise(function (resolve, reject) {
            var itemInfos = [];
            var nutLists = [];
            for (var i = 0; i < val.list.item.length; i++) {
                //console.log("looking up ndbno: " + val.list.item[i].ndbno);
                food.nd.foodReports({
                    ndbno: val.list.item[i].ndbno,
                    type: 'b'
                }, function (err, res) {
                    if (err) {
                        console.log("ERROR: ", err);
                    } else {
                        //console.log("SUCCESS. length = " + itemInfos.length);
                    }
                    var info = [];
                    foodHelper.populateNutrients(info, res.report.food.nutrients);
                    for (n in res.report.food.nutrients) {
                        if (res.report.food.nutrients[n].nutrient_id == '205') {
                            console.log(res.report.food.nutrients[n]);
                        }
                    }

                    if (req.user) {
                        //if logged in, update watchedNutrients if it is still null
                        if (req.user.watchedNutrients && req.user.watchedNutrients.length == 0) {
                            console.log("attempting update\nID = " + req.session.passport.user);
                            User.update({ _id: req.user._id }, { watchedNutrients: [203, 204, 205, 208, 269, 307] }, function (err, num, rawRes) {
                                if (err) {
                                    console.log("error updating user");
                                } else {
                                    console.log("update successful. updated " + num + " users");
                                    console.log("raw response:", rawRes);
                                    console.log('nuts:', req.user.watchedNutrients);
                                }
                            });
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
            } //end loop
        }).then(function (nutrientList) {
            /**
            User.update({_id: req.user._id}, {watchedNutrients: [204, 205, 208, 269, 307]}, function(err) {
            	console.log("\n\n\n\n\n\n\n\n\n\nUSER:", req.user.watchedNutrients);
                  	res.render('food/search', {data: val, user: req.user, infos: infos });
            });
            **/
            res.render('food/search', { data: val, user: req.user, message: "Search Results", nutList: nutrientList });
        });
    }).catch(function (err) {
        console.log("catch error:", err);
        res.render('food/search', { data: null, user: req.user, infos: null, message: "No Results Found" });
    });
});

router.get('/:no', function (req, res, next) {
    //var f = food.report('01009', 'b');
    console.log("GET FOOD ROUTE");
    var e = food.getReport(req.params.no, 's').then(function (val) {
        res.render('food', { data: val, user: req.user });
    }).catch(function (err) {
        console.log('ERROR:', err);
        res.render('index', { title: err });
    });
});

module.exports = router;

/***/ }),
/* 22 */
/***/ (function(module, exports) {

var nutrientMap = new Map();

nutrientMap.set(203, { name: 'Protein', abbr: 'Protein' });
nutrientMap.set(204, { name: 'Total Fat', abbr: 'Fat' });
nutrientMap.set(205, { name: 'Carbohydrates', abbr: 'Carbs' });
nutrientMap.set(208, { name: 'Calories', abbr: 'Cals' });
nutrientMap.set(269, { name: 'Sugar', abbr: 'Sug' });
nutrientMap.set(307, { name: 'Sodium', abbr: 'Sodium' });

var fHelper = function () {
    this.nutrientList = [];
    this.nutrientList.push({ name: 'Calories', id: '208', abr: 'Cal', default: true });
    this.nutrientList.push({ name: 'Cholesterol', id: '601', abr: 'Chol', default: true });
    this.nutrientList.push({ name: 'Carbohydrates', id: '205', abr: 'Carbs', default: true });
    this.nutrientList.push({ name: 'Sodium', id: '307', abr: 'NA', default: true });
    this.nutrientList.push({ name: 'Sugar', id: '269', abr: 'Sug', default: true });
    this.nutrientList.push({ name: 'Protien', id: '203', abr: 'Prot', default: true });
    this.nutrientList.push({ name: 'Total Fat', id: '204', abr: 'Fat', default: true });
    this.nutrientList.push({ name: 'Trans Fat', id: '605', abr: 'Fat (trans)' });
    this.nutrientList.push({ name: 'Polyunsaturated Fat', id: '646', abr: 'Fat (polyunsaturated)' });
    this.nutrientList.push({ name: 'Monounsaturated Fat', id: '645', abr: 'Fat (monounsaturated)' });
    this.nutrientList.push({ name: 'Saturated Fat', id: '606', abr: 'Fat (saturated)' });

    this.getNutrient = function (n, list) {
        for (var i = 0; i < this.nutrientList.length; i++) {
            if (this.nutrientList[i].name === n) {
                return list.filter(function (obj) {
                    return obj.nutrient_id === nutrientList[i].id;
                })[0];
            }
        }
    };

    this.populateDefNutrients = function (obj, list) {
        for (i = 0; i < this.nutrientList.length; i++) {
            var nutrient = list.filter(function (o) {
                return o.nutrient_id = this.nutrientList[i].id;
            })[0];
            obj[this.nutrientList[i].name] = {
                value: nutrient.value,
                unit: nutrient.unit
            };
        }
    };
};

var foodHelper = {
    nutrientList: [{ name: 'Calories', id: '208' }, { name: 'Cholesterol', id: '601' }, { name: 'Sodium', id: '307' }, { name: 'Sugar', id: '269' }, { name: 'Protien', id: '283' }, { name: 'Total Fat', id: '204' }, { name: 'Carbohydrates', id: '205' }],
    getNutrient: function (n, list) {
        var id = this.nutrientList.filter(function (obj) {
            return n === obj.name;
        })[0].id;

        var nutrient = list.filter(function (obj) {
            return id === obj.nutrient_id;
        })[0];

        if (nutrient == null) {
            nutrient = {
                name: n,
                value: 0,
                unit: ''
            };
        }
        //console.log("id: " + id + ", nutrient: " + nutrient.name);
        return { name: n, value: nutrient.value, unit: nutrient.unit };
    },
    populateNutrients: function (obj, list) {

        for (var i = 0; i < this.nutrientList.length; i++) {
            var item = this.getNutrient(this.nutrientList[i].name, list);
            if (item != null) {
                obj.push(item);
            }
        }
    },

    //list contains each item, and for each item contains 
    createNutrientObj: function (foodObj, nutList) {
        console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
        console.log("foodObj:", foodObj);
        console.log("nutList", nutList);
        var obj = {
            manu: foodObj.manu,
            name: foodObj.name,
            ru: foodObj.ru
        };

        obj.nutrients = [];

        for (nutrient in foodObj.nutrients) {
            for (id in nutList) {
                //console.log("checking id " + nutList[id]);
                if (nutList[id] == foodObj.nutrients[nutrient].nutrient_id) {
                    console.log("adding nutrient " + foodObj.nutrients[nutrient].name + " for food " + foodObj.name);
                    var nutObj = {
                        name: nutrientMap.get(nutList[id]).name,
                        abbr: nutrientMap.get(nutList[id]).abbr,
                        unit: foodObj.nutrients[nutrient].unit,
                        value: foodObj.nutrients[nutrient].value
                    };
                    obj.nutrients.push(nutObj);
                    console.log("=\n=\n=\n=\n=\n=\n=\n=\nDone adding ", nutObj);
                }
            }
        }
        return obj;
    }

    /** Planning. ignore me.
    Each user will have a list of watchedNutrients
    watched nutrients need to be displayed in search results or any other list of items
    there will be default values for the watchedNutrients
    
    To access them, I need the 'id' of the nutrient in the USDA api
    I also need the name, and an abbreviation/display name would be nice.
    
    abbreviation/display names are the same for all users, don't need to store them in user model, just the ID's
    
    user model: has watchedNutrients, an array of ints corresponding to nutrient ID's in the USDA api/database
    
    app will have a js 'hashmap' object, linking the id to the name, abbreviation, and in the future holding any functions or variables that will be useful with that nutrient
    
    data: id -> {abbr, name(USDA api name), title(what to display on list headers and whatnot, if the actual name isn't the best option)}
    
    
    FLOW:
    << user sends search request
    >> server queries API to get data
    >> server filters out the appropriate data and sends it to the client. watched nutrients are in an array of watchedNuts [{title, abbr, value, %dv}...]
    << client just displays each(technically the first 5-6 or however many watched nutrients there are, but it should equal the # of array elems) in the table or whatever.
    		it doesn't need to know the ID or which nutrients to display, the server decides and only sends those ones
    
    	++ client changes his watchedNutrients or something:
    		<< client sends ajax request to update nutrients
    		>> server responds with updated list of products+nutrients
    		c- client re-renders list
    		
    	++ client clicks an item
    		<< client sends a request for full data on that item
    		>> server responds with full item info
    		c- client renders product page
    		
    	++ client compares multiple items
    		<< client sends request for info on all products being compared
    		>> server sends FULL nutrient info on all items
    		c- client renders comparison list, client can change which nutrients to view and it already has the data available, even if it isn't all displayed already
    		
    
    CODE:
    	server needs a helper object that is basically a hashmap with the nutrientID as the key and an object containing the name, title, recDailyTotal, %dvCalcFunc(), and any other vars/funcs 	that may be needed int he future
    	
    	when a user searches for an item, it sends search string to server,
    		server queries USDA api and gets list of results
    		server passes the result list and the currentUser.watchedNutrients(which is just an array of ints) through a filter function to get the watchedNutrients array
    		server responds to user, including the newly created watchedNutrient array that contains each nutrients name, value, %dv, etc
    		client renders list using the watchedNutrient array. Doesn't need to know the ID's or even the users watchedNutrients, the array will only have the nutrients it's supposed to.
    		
    		
    		
    		
    
    
    **/
};var nutHelper = function () {
    var nh = {};

    return nh;
}();

module.exports = foodHelper;

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var express = __webpack_require__(0);
var router = express.Router();

var User = __webpack_require__(2);

/* GET users listing. */

router.get('/item/:no', function (req, res, next) {
    //var f = food.report('01009', 'b');
    var e = food.getReport(req.params.no, 's').then(function (val) {
        res.render('food', { data: val, user: req.user });
    }).catch(function (err) {
        console.log('ERROR:', err);
        res.render('index', { title: err });
    });
});

module.exports = router;

/***/ })
/******/ ]);