// Require Mongoose 
const mongoose = require("mongoose");

// Make & Export Comment model
const commentSchema = mongoose.Schema({
	ownerId: String,
	name: String,
	body: String,
	datePosted: {type: Date, default: Date.now()},
	dateEdited: {type: Date, default: Date.now()}
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;