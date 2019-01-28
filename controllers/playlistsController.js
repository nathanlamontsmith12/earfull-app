// ========== IMPORTS ==========
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Playlist = require("../models/playlist");

// const playlistSchema = mongoose.Schema({
// 	name: String, 
// 	ownerId: String,
// 	datePosted: {type: Date, default: Date.now()},
// 	lastEdited: {type: Date, default: Date.now()},
// 	episodes: [String] // array of strings of episode IDs!!
// });

// from server.js: 
// app.use("/earfull/playlists", playlistsController);


// ========== PLAYLIST ROUTES ==========

// New Route
router.get("/:userId/new", (req, res)=>{

});

// Create Route 
router.post("/:userId", (req, res)=>{
	
});

// Edit Route 
router.get("/:userId/:playlistId/edit", (req, res)=> {
	const reqData = {
		userId: req.params.userId,
		playlistId: req.params.userId
	}
});

// Update Route 
router.patch("/:userId/:playlistId", (req, res)=>{
	const reqData = {
		userId: req.params.userId,
		playlistId: req.params.userId
	}
});

// Destroy Route 
router.delete("/:userId/:playlistId", (req, res)=>{
	const reqData = {
		userId: req.params.userId,
		playlistId: req.params.userId
	}
});

// Show Route  
router.get("/:userId", (req, res)=>{
	User.findOne({_id: req.params.userId}, (err, foundUser)=>{
		if (err) {
			res.send(err) // need better error handling! 
		} else {
			res.render("/playlist.show.ejs")
		}
	})
});


// ========== EXPORT ROUTER ==========
module.exports = router;