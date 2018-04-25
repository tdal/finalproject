var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var dreamSchema = new Schema({
	date: String,
	// name: {type: String, required: true}, // this version requires this field to exist
	// name: {type: String, unique: true}, // this version requires this field to be unique in the db
	length: String,
	tags: [String],
	synopsis: String,
	description: {
		snore: Number,
		awake: Number
	},
	stress: Number,
	url: String,
	dateAdded : { type: Date, default: Date.now },
})

// export 'Animal' model so we can interact with it in other files
module.exports = mongoose.model('Dream',dreamSchema);
