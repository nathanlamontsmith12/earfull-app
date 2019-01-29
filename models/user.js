// Require Mongoose 
const mongoose = require("mongoose");

// Import other models 
const Podcast = require("./podcast");
const Episode = require("./episode")
const Comment = require("./comment")
const Playlist = require("./playlist")
const Search = require("./search");

// Make & Export User model
const userSchema = mongoose.Schema({
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true}, 
	email: {type: String, required: true},
	topics: [String],
	profile: Object,
	recommendations: [String], // array of strings of all recommended podcasts' IDs
	episodes: [String], // array of strings of all favorite episodes' IDs
	podcasts: [String], // array of strings of all favorite podcasts' IDs
	search: [Search.schema],
	comments: [Comment.schema],
	playlists: [Playlist.schema]
});

userSchema.add({friends: [userSchema]});

const User = mongoose.model("User", userSchema);

module.exports = User;