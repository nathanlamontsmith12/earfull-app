// ========== IMPORTS ==========
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const unirest = require("unirest")
const User = require("../models/user");
const Playlist = require("../models/playlist");
const Episode = require("../models/episode")


 // ========== DATA OBJECT ==========
const search = {
	results: []
}



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
 

// ========== SEARCH POST THEN REDIRECT ==========

router.post("/:userId/:playlistId/search", async (req, res) => {

	const reqData = {
		userId: req.params.userId,
		playlistId: req.params.playlistId
	}

	try {
		query = req.body.query
		offset = 10
		// Query the API
		const request = await unirest.get("https://listennotes.p.mashape.com/api/v1/search?offset=" + offset.toString() + "&q=" + query )
		.header("X-Mashape-Key", "gymECYoyFxmshFoLe3A70dofgPSep1UuWJajsnNNQ5Ajsnnypv")
		.header("Accept", "application/json")
		.end ((data) => {
			// Add ids from Api query to array
			const queryIdArray = data.body.results.map(episode => episode.id)
			// Find Episodes that have the same Id as query id Array
			Episode.find({id: {$in: queryIdArray}}, (err, extantEpisodeArray) => {
				if (err) {
					res.send(err)
				} else {
					//Find Ids of episodes not to create
					const extantIdArray = extantEpisodeArray.map(episode => episode.id)
					// Filter out episodes not to create
					const epsToAdd = data.body.results.filter(result => !extantIdArray.includes(result.id))
					// Create remaining episodes in query
					Episode.create(epsToAdd, (err, createdEpisodes) => {
						if (err) {
							res.send(err)
						} else {
							search.results = data.body.results; 
							res.redirect(`/earfull/playlists/${reqData.userId}/${reqData.playlistId}/edit`)
						}
					})
				}
			})
		})
	} catch (err) {
		console.log(err);
		res.send(err)
	}
})

  

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
							res.redirect(`/earfull/playlists/${req.params.userId}/${playlistId}/edit`);
						}
					})
				}
			});
		}
	})
});

// VIEW Route: 
router.get("/:userId/:playlistId/view", (req, res)=>{
	// WE WANT TO ADD THIS IN!! Then set many of the redirects to this page, I think 
})


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

			const foundPlaylist = foundUser.playlists.find( (playlist)=>{
				if (playlist._id.toString() === reqData.playlistId) {
					return true;
				}
			})

			Episode.find({ id: { $in: foundPlaylist.episodes }}, (err, rawEpisodeArray) => {
				if (err) {
					res.send(err)
				} else {

					// need to put the episode array in the CORRECT order! 
					// THEN pass it on to the web page with res.render 

					let episodeArray = [];

					if (rawEpisodeArray.length > 0) {
						episodeArray = foundPlaylist.episodes.map( (episodeId) => {
							for (let t = 0; t < rawEpisodeArray.length; t++) {
								if (rawEpisodeArray[t]["id"] === episodeId) {
									return rawEpisodeArray[t];
								} else {
									// res.send("ERROR -- episode in playlist not found in DB")
	// =============== NEED WAAAAAAY BETTER ERROR HANDLING HERE!!! ===============
								}
							}	
						})					
					}

					res.render("playlist/edit.ejs", {
						user: foundUser,
						playlist: foundPlaylist,
						episodes: episodeArray,
						message: req.session.message,
						title: "Edit Playlist",
						header: `Edit Playlist`,
						loggedIn: req.session.loggedIn,
						results: search.results
					})
				}
			})

		}
	})
});


// EDIT -- input SORTING -- Route 
router.get("/:userId/:playlistId", (req, res)=>{

	const reqData = {
		userId: req.params.userId,
		playlistId: req.params.playlistId
	} 
	User.findOne({_id: req.params.userId}, (err, foundUser)=>{
		if (err) {
			res.send(err);
		} else {
			Playlist.findOne({_id: reqData.playlistId}, (err, foundPlaylist)=>{

				if (err) {
					res.send(err)
				} else {

					Episode.find({ id: { $in: foundPlaylist.episodes }}, (err, rawEpisodeArray) => {
						if (err) {
							res.send(err)
						} else {
							let episodeArray = [];

							if (rawEpisodeArray.length > 0) {
								episodeArray = foundPlaylist.episodes.map( (episodeId) => {
									for (let t = 0; t < rawEpisodeArray.length; t++) {
										if (rawEpisodeArray[t]["id"] === episodeId) {
											return rawEpisodeArray[t];
										} else {
											// res.send("ERROR -- episode in playlist not found in DB")
			// =============== NEED WAAAAAAY BETTER ERROR HANDLING HERE!!! ===============
										}
									}	
								})					
							}

							res.render("playlist/show.ejs", {
								user: foundUser,
								header: `${foundUser.username}'s Playlists`,
								title: "EarFull Playlists",
								message: req.session.message,
								loggedIn: req.session.loggedIn,
								playlist: foundPlaylist,
								episodes: episodeArray
							})

						}
					})
				}
			})
		}
	})
});



// Destroy Route 
router.delete("/:userId/:playlistId", async (req, res)=>{

	const reqData = {
		userId: req.params.userId,
		playlistId: req.params.playlistId
	} 

	try {


	 	// find user, and delete playlist -- might take a moment...
		const foundUser = await User.findOne({_id: reqData.userId});
		const deletedPlaylist = await Playlist.deleteOne({_id: reqData.playlistId});

		await Promise.all([foundUser, deletedPlaylist]);

		const playlistIndex = foundUser.playlists.findIndex( (playlist)=>{
			if (playlist._id.toString() === reqData.playlistId) {
				return true;
			}
		})

		foundUser.playlists.splice(playlistIndex, 1);

		foundUser.save((err, data)=>{
			if (err) {
				console.log(err.message);
				res.send(err);
			} else {
				res.redirect(`/earfull/playlists/${reqData.userId}`);
			}
		})
	} catch (err) {
		console.log(err.message);
		res.send(err);
	}

});
 


// Update Route PART 1 -- rename 
router.put("/:userId/:playlistId", (req, res)=>{

	// params data from request 
	const reqData = {
		userId: req.params.userId,
		playlistId: req.params.playlistId
	}

	// timestamp for the edits 
	const dateEdited = new Date();

	const update = {
		name: req.body.name,
		lastEdited: dateEdited,
	}

	// NEED to change this below!! 

	// find the playlist in its database, update it   
	Playlist.findOneAndUpdate( {_id: reqData.playlistId}, {name: req.body.name, lastEdited: dateEdited, $push: {episodes: req.body.episode}}, {new: true}, (err, updatedPlaylist)=> {
		if (err) {
			console.log(err.message);
			res.send(err);
		} else {
			User.findOne( {_id: reqData.userId}, (err, foundUser)=> {
				if (err) {
					console.log(err.message);
					res.send(err);
				} 
				else {

					const playlistIndex = foundUser.playlists.findIndex((playlist)=> {
						if(playlist._id.toString() === reqData.playlistId) {
							return true;
						}
					});

					const deletedItem = foundUser.playlists.splice(playlistIndex, 1, updatedPlaylist);

					foundUser.save( (err, data)=>{
						if (err) {
							console.log(err.message);
							res.send(err);
						} else {
							res.redirect(`/earfull/playlists/${reqData.userId}/`);
						}
					})
				}
			});
		}
	})
});



// Update Route PART 2 -- add episodes 
router.patch("/:userId/:playlistId", (req, res)=>{ 

	const reqData = {
		userId: req.params.userId,
		playlistId: req.params.playlistId
	}


	let idsToAdd = [];

	if (req.body.addList && req.body.addList !== "" && req.body.addList !== " ") {
		idsToAdd = req.body.addList.split(" ");
	} else {
		idsToAdd = [];
	}

	const addArray = idsToAdd.filter( (episodeId) => {
		if (episodeId) {
			return true;
		} else {
			return false;
		}
	});



	Playlist.findOne( {_id: reqData.playlistId}, (err, foundPlaylist) => {
		if (err) {
			console.log(err.message);
			res.send(err)
		} else {

			// grab old playlist, concat w/ added episodes: 
			const finalArray = foundPlaylist.episodes.concat(addArray);

			// generate new date for "lastEdited" data  
			const dateEdited = new Date();

			const update = {
				lastEdited: dateEdited,
				episodes: finalArray
			}

			Playlist.findOneAndUpdate( {_id: reqData.playlistId}, update, {new: true}, (err, updatedPlaylist) => {
				if (err) {
					console.log(err.message);
					res.rend(err)
				} else {
					User.findOne( {_id: reqData.userId}, (err, foundUser) => {
						if (err) {
							console.log(err.message);
							res.send(err)
						} else {
							const playlistIndex = foundUser.playlists.findIndex((playlist)=> {
								if(playlist._id.toString() === reqData.playlistId) {
									return true;
								}
							});

							foundUser.playlists.splice(playlistIndex, 1, updatedPlaylist)

							foundUser.save( (err, data)=>{
								if (err) {
									console.log(err.message);
									res.send(err);
								} else {
									res.redirect(`/earfull/playlists/${reqData.userId}/${reqData.playlistId}`);
								}
							})
						}
					})
				}
			})
		}
	})
})




// update route part 3 -- SORT 
router.patch("/:userId/:playlistId/sort", (req, res) => {

	const reqData = {
		userId: req.params.userId,
		playlistId: req.params.playlistId
	}

	const dateEdited = new Date();

	const update = {
		lastEdited: dateEdited,
		episodes: []
	}

	if (req.body.episodeArray) {
		const rawEpisodeArray = req.body.episodeArray.split(" ");

		const cleanEpisodeArray = rawEpisodeArray.filter( (episodeId)=>{
			if (episodeId && episodeId !== " " && episodeId !== "" && episodeId.length === 32) {
				return true;
			} else {
				return false;
			}
		})

		update.episodes = cleanEpisodeArray;

		Playlist.findOneAndUpdate( {_id: reqData.playlistId}, update, {new: true}, (err, updatedPlaylist) => {
			if (err) {
				console.log(err.message);
				res.rend(err)
			} else {
				User.findOne( {_id: reqData.userId}, (err, foundUser) => {
					if (err) {
						console.log(err.message);
						res.send(err)
					} else {
						const playlistIndex = foundUser.playlists.findIndex((playlist)=> {
							if(playlist._id.toString() === reqData.playlistId) {
								return true;
							}
						});

						foundUser.playlists.splice(playlistIndex, 1, updatedPlaylist)

						foundUser.save( (err, data)=>{
							if (err) {
								console.log(err.message);
								res.send(err);
							} else {
								res.redirect(`/earfull/playlists/${reqData.userId}/${reqData.playlistId}`);
							}
						})
					}
				})
			}
		})
	} else {
		console.log("ERROR -- did not update playlist");
		res.redirect(`/earfull/playlists/${reqData.userId}`)
	}
})




// ========== EXPORT ROUTER ==========
module.exports = router;