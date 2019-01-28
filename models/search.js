const mongoose = require("mongoose");

const searchSchema = mongoose.Schema({
	userId: String,
	genre_ids: [String],
	language: String,
	len_max: Number, 
	len_min: Number,
	excludeId: String, // ncid on api
	includeId: String, // ocid on api
	offset: Number,
	only_in: String,  // Allowed values: title, description, author, audio = drop down menu
	published_after: Number,  // will have to be converted to number from date
	published_before: Number,
	q: {type: String, required: true},
	safe_mode: Number, // Boolean 0 or 1, 1 for true
	sort_by_date: Number, // Boolean 0 or 1, 1 for true otherwise relevance
	type: String // episode or podcast = drop down menu episode is default


	// Need to figure out what we need here 



})

const Search = mongoose.model("searches", searchSchema);

module.exports = Search;