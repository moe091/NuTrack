var fHelper = function() {
    this.nutrientList = [];
    this.nutrientList.push({name: 'Calories', id: '208', abr: 'Cal', default: true});
    this.nutrientList.push({name: 'Cholesterol', id: '601', abr: 'Chol', default: true});
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
        {name: 'Total Fat', id: '204'}
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

module.exports = foodHelper;