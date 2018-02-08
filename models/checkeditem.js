var mongoose = require('mongoose');  

var checkeditemSchema = new mongoose.Schema({
	ndb: Number,
	name: String
});

module.exports = mongoose.model('Checkeditem', checkeditemSchema);