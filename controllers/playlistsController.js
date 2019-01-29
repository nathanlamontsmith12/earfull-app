// ========== IMPORTS ==========
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Playlist = require("../models/playlist");



// ========== FUNCTIONS ==========
// Authentication check -- kick user back to 
// login if the current user's ID does not match 
// session info userId and/or 
// if session is logged out 

function checkLogin (status, sessionId, userId, response) {
	if (status && sessionId === userId) {
		return;
	} else {
		response.redirect("/earfull/user/auth/login");
	}
}

// ========== PLAYLIST ROUTES ==========

// NOTE: NEED BETTER ERROR HANDLING FOR ALL THESE ROUTES 


// const playlistSchema = mongoose.Schema({
// 	name: {type: String, require: true, unique: true}
// 	ownerId: String,
// 	datePosted: {type: Date, default: Date.now()},
// 	lastEdited: {type: Date, default: Date.now()},
// 	episodes: [String] // array of strings of episode IDs!!
// });

// from server.js: 
// app.use("/earfull/playlists", playlistsController);


// New Route
router.get("/:userId/new", (req, res)=>{
	User.findOne({_id: req.params.userId}, (err, foundUser)=>{
		if (err) {
			res.send(err);
		} else {
			res.render("playlist/new.ejs", {
				user: foundUser,
				message: req.session.message,
				title: "Create Playlist",
				header: `Make New Playlist`
			})
		}
	})
});

// Create Route 
router.post("/:userId", (req, res)=>{

	User.findOne({_id: req.params.userId}, (err, foundUser)=>{
		if (err) {
			res.send(err);
		} else {
			const newPlaylist = req.body;
			Playlist.create(newPlaylist, (err, createdPlaylist)=>{
				if (err) {
					res.send(err)
				} else {
					foundUser.playlists.push(createdPlaylist);
					const playlistId = createdPlaylist._id;
					foundUser.save((err, data)=>{
						if (err) {
							console.log(err);
							res.send(err);
						} else {
							console.log(data);
							// redirect to the new playlist show page 
							res.redirect(`/earfull/playlists/${reqData.req.params.userId}/${playlistId}`);
						}
					})
				}
			});
		}
	})
});

// Edit Route 
router.get("/:userId/:playlistId/edit", (req, res)=> {
	const reqData = {
		userId: req.params.userId,
		playlistId: req.params.playlistId
	}
	User.findOne({_id: reqData.userId}, (err, foundUser)=>{
		if (err) {
			res.send(err);
		} else {
			const foundPlaylist = foundUser.playlists.find((playlist)=>{
				if (playlist._id === reqData.playlistId) {
					return true;
				}
			})
			res.render("playlist/edit.ejs", {
				user: foundUser,
				playlist: foundPlaylist,
				message: req.session.message,
				title: "Edit Playlist",
				header: `Edit Playlist ${foundPlaylist.name}`
			})
		}
	})
});

// Update Route 
router.put("/:userId/:playlistId", (req, res)=>{
	const reqData = {
		userId: req.params.userId,
		playlistId: req.params.playlistId
	}
	User.findOne({_id: reqData.userId}, (err, foundUser)=>{
		if (err) {
			res.send(err);
		} else {
			const playlistIndex = foundUser.playlists.findIndex((playlist)=>{
				if (playlist._id === reqData.playlistId) {
					return true;
				}
			});
			const editedPlaylist = req.body;
			foundUser.playlists.splice(playlistIndex, 1, editedPlaylist);
			foundUser.save((err, data) => {
				if (err) {
					res.send(err);
				} else {
					res.redirect(`earfull/playlists/${reqData.req.params.userId}/`)
				}
			})
		}
	})
});

// Destroy Route 
router.delete("/:userId/:playlistId", (req, res)=>{
	const reqData = {
		userId: req.params.userId,
		playlistId: req.params.playlistId
	} 
	User.findOne({_id: reqData.userId}, (err, foundUser)=>{
		if (err) {
			res.rend(err)
		} else {
			const playlistIndex = foundUser.playlists.findIndex((playlist)=>{
				if (playlist._id === reqData.playlistId) {
					return true;
				}
			})
			foundUser.playlists.splice(playlistIndex, 1);
			foundUser.save((err, data) => {
				if (err) {
					res.send(err);
				} else {
					res.redirect(`earfull/playlists/${reqData.req.params.userId}`)
				}
			})
		}
	})
});

// Show Route  
router.get("/:userId", (req, res)=>{
	User.findOne({_id: req.params.userId}, (err, foundUser)=>{
		if (err) {
			res.send(err);
		} else {
			res.render("playlist/show.ejs", {
				user: foundUser,
				header: `${foundUser.username}'s Playlists`,
				title: "EarFull Playlists",
				message: req.session.message
			})
		}
	})
});


// ========== EXPORT ROUTER ==========
module.exports = router;