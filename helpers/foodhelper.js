var User = require('../models/user');
var food = require('../foods');
var nutrientMap = new Map();
 

nutrientMap.set(203, {name: 'Protein', abbr: 'Protein'});
nutrientMap.set(204, {name: 'Total Fat', abbr: 'Fat'});
nutrientMap.set(205, {name: 'Carbohydrates', abbr: 'Carbs'});
nutrientMap.set(208, {name: 'Calories', abbr: 'Cals'});
nutrientMap.set(269, {name: 'Sugar', abbr: 'Sug'});
nutrientMap.set(307, {name: 'Sodium', abbr: 'Sodium'});
nutrientMap.set(601, {name: 'Cholesterol', abbr: 'Chol'});


var fHelper = function() {
    this.nutrientList = [];
    this.nutrientList.push({name: 'Calories', id: '208', abr: 'Cal', default: true});
    this.nutrientList.push({name: 'Cholesterol', id: '601', abr: 'Chol', default: true});
    this.nutrientList.push({name: 'Carbohydrates', id: '205', abr: 'Carbs', default: true});
    this.nutrientList.push({name: 'Sodium', id: '307', abr: 'NA', default: true});
    this.nutrientList.push({name: 'Sugar', id: '269', abr: 'Sug', default: true});
    this.nutrientList.push({name: 'Protien', id: '203', abr: 'Prot', default: true});
    this.nutrientList.push({name: 'Total Fat', id: '204', abr: 'Fat', default: true});
    this.nutrientList.push({name: 'Trans Fat', id: '605', abr: 'Fat (trans)'});
    this.nutrientList.push({name: 'Polyunsaturated Fat', id: '646', abr: 'Fat (polyunsaturated)'});
    this.nutrientList.push({name: 'Monounsaturated Fat', id: '645', abr: 'Fat (monounsaturated)'});
    this.nutrientList.push({name: 'Saturated Fat', id: '606', abr: 'Fat (saturated)'});
    
    this.getNutrient = function(n, list) {
        for (var i = 0; i < this.nutrientList.length; i++) {
            if (this.nutrientList[i].name === n) {
                return list.filter(function(obj) {
                    return obj.nutrient_id === nutrientList[i].id; 
                })[0];
            }
        }  
    };
    
    this.populateDefNutrients = function(obj, list) {
        for (i = 0; i < this.nutrientList.length; i++) {
            var nutrient = list.filter(function(o) {
                return o.nutrient_id = this.nutrientList[i].id;
            })[0];
            obj[this.nutrientList[i].name] = {
                value: nutrient.value,
                unit: nutrient.unit
            }
        }  
    };
	

    
}

var foodHelper = {
	nutrientList: [
			{name: 'Calories', id: '208'},
			{name: 'Cholesterol', id: '601'},
			{name: 'Sodium', id: '307'},
			{name: 'Sugar', id: '269'},
			{name: 'Protien', id: '203'},
			{name: 'Total Fat', id: '204'},
			{name: 'Carbohydrates', id: '205'}
	],
	getNutrient: function(n, list) {
			var id = this.nutrientList.filter(function(obj) {
					return n === obj.name;
			})[0].id;

			var nutrient = list.filter(function(obj) {
					return id === obj.nutrient_id;
			})[0];

			if (nutrient == null) {
					nutrient = {
							name: n,
							value: 0,
							unit: ''
					}
			} 
			//console.log("id: " + id + ", nutrient: " + nutrient.name);
			return {name: n, value: nutrient.value, unit: nutrient.unit};

	},
	populateNutrients: function(obj, list) {

			for (var i = 0; i < this.nutrientList.length; i++) {
					var item = this.getNutrient(this.nutrientList[i].name, list);
					if (item != null) { 
							obj.push(item);
					}
			}
	},

		//list contains each item, and for each item contains 
	createNutrientObj: function(foodObj, nutList) {  
		var obj = {
			manu: foodObj.manu,
			name: foodObj.name,
			ru: foodObj.ru,
			ndb: foodObj.ndbno
		}

		obj.nutrients = [];

		for (nutrient in foodObj.nutrients) {
			for (id in nutList) {
				//console.log("checking id " + nutList[id]);
				if (nutList[id] == foodObj.nutrients[nutrient].nutrient_id) { 
					var nutObj = {
						name: nutrientMap.get(nutList[id]).name,
						abbr: nutrientMap.get(nutList[id]).abbr,
						unit: foodObj.nutrients[nutrient].unit,
						value: foodObj.nutrients[nutrient].value,
						id: foodObj.nutrients[nutrient].nutrient_id
					}
					obj.nutrients.push(nutObj); 
				}
			}
		}
		return obj;
	},

	mapNutrientIDs: function(nutIDs) {
		let names = [];

		for (var i in nutIDs) {
			names.push(nutrientMap.get(nutIDs[i]).name);
		}

		return names;
	},

	updateWatchedNutrients: function(user, session) {
		if (user) { //if logged in, update watchedNutrients if it is still null
			if (user.watchedNutrients && user.watchedNutrients.length == 0) {
				console.log("attempting update\nID = " + session.passport.user);
				User.update({_id: user._id}, {watchedNutrients: [203, 204, 205, 208, 269, 307]}, function(err, num, rawRes) {
					if (err) {
						console.log("error updating user");
					} else {
						console.log("update successful. updated " + num + " users");
						console.log("raw response:", rawRes);
						console.log('nuts:', user.watchedNutrients);
					}
				})
			}
			//logged in, watchedNutrients is not null(unless error, handle above)
			var watched = user.watchedNutrients;

		}

		return watched ? watched : [203, 204, 205, 208, 269, 307]

	},
	
	
	
	
	getNutrientInfos: function(user, ndbs, type, session) {
		var itemInfos = [];
		var nutLists = [];
		
		console.log("Called getNutrientInfos() - " + type);
		return new Promise(function(resolve, reject) {
			console.log("in promise. ndbs = ", ndbs);
			for (var i in ndbs) {
				if (ndbs[i] != null) {
					food.nd.foodReports({
						ndbno: ndbs[i],
						type: type
					}, function(err, res) {
						if (err) {
							console.log("ERROR: item=" + i + ":  ", err);
							resolve(err);
						} else {
							//TODO copy and paste below implementation into this block
						}
						console.log("RESPONSE:", res);

						var info = []
						if (res != null) {
							console.log(res);
							if (type == 'b')
								foodHelper.populateNutrients(info, res.report.food.nutrients); //takes the report for a food item and uses foodHelper.nutrientList array to populate info with the data on each nutrient listed in the nutrientList array. Change this method to accept watchedNutrients array instead of using foodHelper.nutrientList
						} else {
							ndbs = []; //so length = 0, and promise can resolve(see if below with resolve() statement in it). Definitely gotta find a better resolve condition
						}


						var watched = foodHelper.updateWatchedNutrients(user, session);

						if (watched && watched.length > 0) {
							if (type == 'b') {
								var fObj = foodHelper.createNutrientObj(res.report.food, watched);
							} else {
								var fObj = res;
							}
							nutLists.push(fObj); 
						} else {
							console.log("\n\n\n\n\nWatchedNutrients still empty!!");
						}
						//info.cals = res.report.food.nutrients.filter(function(obj) {
								//return obj.nutrient_id === '208';
						//});

						//info.cals = info.cals[0].value;
						itemInfos.push(info);
						if (itemInfos.length == ndbs.length) {
							resolve(nutLists); 
						}
					});
				}//end loop
				
			}
			
		});
		
	} // {=- End getNutrientInfos(user, ndbs) function -=}
	
	
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
var nutHelper = (function() {
	var nh = {};
	
	return nh;
}());

module.exports = foodHelper;