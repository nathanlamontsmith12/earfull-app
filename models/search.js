const mongoose = require("mongoose");

const searchSchema = mongoose.Schema({
	userId: String,
	// Need to figure out what we need here 
})

const Search = mognoose.model("searches", searchSchema);

module.exports = Search;