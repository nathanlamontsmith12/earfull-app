// Require Mongoose 
const mongoose = require("mongoose");

// Import needed models
const Comment = require("./comment")

// Make & Export Episode model
const episodeSchema = mongoose.Schema({
	name: String,
	number: Number,
	podcastId: String,
	audioURL: String,
	guests: [String],
	imageURL: String,
	description: String,
	topics: [String],
	datePosted: Date,
	comments: [Comment.schema]
});

const Episode = mongoose.model("Episode", episodeSchema);

module.exports = Episode;