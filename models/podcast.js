// Require Mongoose 
const mongoose = require("mongoose");

// Import needed models
const User = require("./user")
const Episode = require("./episode")
const Comment = require("./comment")

// Make & Export Podcast model
const podcastSchema = mongoose.Schema({
	name: String,
	hosts: [String],
	imageURL: String,
	description: String,
	networkId: String,
	link: String,
	lastUpdated: Date,
	topics: [String],
	genres: [String],
	followers: [],
	episodes: [Episode.schema],
	comments: [Comment.schema]
});

// NOTE: followers array will be filled with Users, but this must 
// happen later; can't require atm because Users requires this schema 
// causing a chicken-egg problem

const Podcast = mongoose.model("Podcast", podcastSchema);

module.exports = Podcast;