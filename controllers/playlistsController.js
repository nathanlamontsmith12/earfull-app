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

function checkLogin (reqSession, userId, response) {
	if (reqSession.loggedIn && reqSession.userId === userId) {
		return;
	} else {
		if (session) {
			session.destroy((err)=>{
				if (err) {
					return next(err)
				} else {
					req.session.message = "You must log in again ";
					response.redirect("/earfull/user/auth/login");				
				}
			});		
		}
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


// Redirects --> Home
router.get("/", (req, res)=>{
	res.redirect("/earfull")
})
router.get("//", (req, res)=>{
	res.redirect("/earfull")
})


// Index Route 
router.get("/:userId", (req, res)=>{
	User.findOne({_id: req.params.userId}, (err, foundUser)=>{
		if (err) {
			res.send(err);
		} else {
			res.render("playlist/index.ejs", {
				user: foundUser,
				header: `${foundUser.username}'s Playlists`,
				title: "EarFull Playlists",
				message: req.session.message,
				loggedIn: req.session.loggedIn,
				playlists: foundUser.playlists
			})
		}
	})
})

 
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
				header: `Make New Playlist`,
				loggedIn: req.session.loggedIn
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

			const newPlaylist = {};

			// need to create the playlist according to this schema: 

			// name: {type: String, require: true, unique: true}
			// ownerId: String,
			// datePosted: {type: Date, default: Date.now()},
			// lastEdited: {type: Date, default: Date.now()},
			// episodes: [String] // array of strings of episode IDs!!
			
			newPlaylist.name = req.body.name;
			newPlaylist.episodes = [];

			// make timestamp for playlist and add 
			// it to the playlist 
			const dateNow = new Date();
			newPlaylist.datePosted = dateNow; 
			newPlaylist.lastEdited = dateNow;

			// give the playlist the correct ownerId
			newPlaylist.ownerId = foundUser._id;

			// create a new instance of the playlist model 
			Playlist.create(newPlaylist, (err, createdPlaylist)=>{
				if (err) {
					res.send(err)
				} else {
					
					// add the created playlist to the user's playlist array
					foundUser.playlists.push(createdPlaylist);
					const playlistId = createdPlaylist._id;

					// save these changes to the user 
					foundUser.save((err, data)=>{
						if (err) {
							console.log(err);
							res.send(err);
						} else {
							// redirect to the new playlist show page 
							res.redirect(`/earfull/playlists/${req.params.userId}/${playlistId}`);
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
	console.log(reqData);
	User.findOne({_id: reqData.userId}, (err, foundUser)=>{
		if (err) {
			res.send(err);
		} else {
			const foundPlaylist = foundUser.playlists.find((playlist)=>{
				if (playlist._id.toString() === reqData.playlistId) {
					return true;
				}
			})
			res.render("playlist/edit.ejs", {
				user: foundUser,
				playlist: foundPlaylist,
				message: req.session.message,
				title: "Edit Playlist",
				header: `Edit Playlist`,
				loggedIn: req.session.loggedIn
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

			// find index of the playlist in the user's playlist array
			const playlistIndex = foundUser.playlists.findIndex((playlist)=>{
				if (playlist._id === reqData.playlistId) {
					return true;
				}
			});


			// find playlist in order to edit it: 
			const editedPlaylist = foundUser.playlists[playlistIndex];


			// SCHEMA for reference: 
			// name: {type: String, require: true, unique: true}
			// ownerId: String,
			// datePosted: {type: Date, default: Date.now()},
			// lastEdited: {type: Date, default: Date.now()},
			// episodes: [String] // array of strings of episode IDs!!

			editedPlaylist.name = req.body.name;


			// make timestamp for playlist and add 
			// it to the playlist 
			const dateNow = new Date();
			newPlaylist.lastEdited = dateNow;
			
			// replace edited list in the user's playlist array with the 
			// edited list, via .splice()
			foundUser.playlists.splice(playlistIndex, 1, editedPlaylist);
			
			// save found user w/ these changes, and redirect to the edited 
			// playlist's show page 
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
				if (playlist._id.toString() === reqData.playlistId) {
					return true;
				}
			})
			foundUser.playlists.splice(playlistIndex, 1);
			foundUser.save((err, data) => {
				if (err) {
					res.send(err);
				} else {
					res.redirect(`/earfull/playlists/${reqData.userId}`)
				}
			})
		}
	})
});

// Show Route  
router.get("/:userId/:playlistId", (req, res)=>{
	const reqData = {
		userId: req.params.userId,
		playlistId: req.params.playlistId
	} 
	User.findOne({_id: req.params.userId}, (err, foundUser)=>{
		if (err) {
			res.send(err);
		} else {
			const playlistToShow = foundUser.playlists.find((playlist)=>{
				if (playlist._id.toString() === reqData.playlistId) {
					return true;
				}
			})
			console.log(playlistToShow);
			res.render("playlist/show.ejs", {
				user: foundUser,
				header: `${foundUser.username}'s Playlists`,
				title: "EarFull Playlists",
				message: req.session.message,
				loggedIn: req.session.loggedIn,
				playlist: playlistToShow
			})
		}
	})
});


// ========== EXPORT ROUTER ==========
module.exports = router;