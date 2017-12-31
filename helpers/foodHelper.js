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
        {name: 'Protien', id: '283'},
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
        console.log("id: " + id + ", nutrient: " + nutrient.name);
        return {name: n, value: nutrient.value, unit: nutrient.unit};
        
    },
    populateNutrients: function(obj, list) {
        
        for (var i = 0; i < this.nutrientList.length; i++) {
            var item = this.getNutrient(this.nutrientList[i].name, list);
            if (item != null) {
                console.log('item: ', item);
                obj.push(item);
            }
        }
    }
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