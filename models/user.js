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
	search: [Search.schema],
	recommendations: [Podcast.schema],
	podcasts: [Podcast.schema],
	episodes: [Episode.schema],
	comments: [Comment.schema],
	playlists: [Playlist.schema]
});

userSchema.add({friends: [userSchema]});

const User = mongoose.model("User", userSchema);

module.exports = User;