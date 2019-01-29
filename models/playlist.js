// Require Mongoose 
const mongoose = require("mongoose");

// Import needed models
const Episode = require("./episode")

// Make & Export Playlist model
const playlistSchema = mongoose.Schema({
	name: {type: String, required: true},
	ownerId: String,
	datePosted: {type: Date, default: Date.now()},
	lastEdited: {type: Date, default: Date.now()},
	episodes: [String] // array of strings of episode IDs!!
});

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;