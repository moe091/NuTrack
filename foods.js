
var NDB = require('nutrient-data-laboratory');
var food = {
    nd: new NDB('L43NiLQ6anMJC9LbtX8VH7SMJVHf5XlT8vUAdIVF'),
    val: null,
    getReport: function(no, t) {
        var val = null;
        return new Promise(function(resolve, reject) {
            food.nd.foodReports({
                ndbno: no,
                type: t
            }, function(err, res) {
                //console.log('inside: ', res.toString());
                resolve(res);
            });
            
        });
    },
    
    search: function(query, max, offset) {
        return new Promise(function(resolve, reject) {
            food.nd.search({
                q: query,
                max: max,
                offset: offset,
            }, (err, res) => {
                if (err) {
                    console.log("ERROR" + err);
                }  else {
                    resolve(res);
                }
            }); 
        });
    }
    
}

module.exports = food;