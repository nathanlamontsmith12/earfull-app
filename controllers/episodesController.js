// === Imports ===
const express = require('express');
const router = express.Router();
const unirest = require('unirest');
const Episode = require('../models/episode')
const Podcast = require('../models/podcast')

let query = "";
let type = "";
let offset;

// Genre Query
const genres = unirest.get("https://listennotes.p.mashape.com/api/v1/genres")
	.header("X-Mashape-Key", process.env.API_KEY)
	.header("Accept", "application/json")

// Print All Genres
router.get("/genres", (req, res) => {
	genres.end((err, result) => {
		if (err) {
			res.send(err)
		} else {
			res.send(result.body)
		}
	})
})

// Get To Episode Search page
router.get("/", (req, res) => {
	res.render("episodes/episodeSearch.ejs", {
		loggedIn: req.session.loggedIn,
		message: req.session.message,
		title: "Episode Search",
		header: "Episode Search"
	})
})

// Search results diplay under search bar
router.post("/", async (req, res) => {
	try {
		query = req.body.query
		offset = 10
		// Query the API
		const request = await unirest.get("https://listennotes.p.mashape.com/api/v1/search?offset=" + offset.toString() + "&q=" + query )
		.header("X-Mashape-Key", process.env.API_KEY)
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
							res.render("episodes/episodeSearchResults.ejs", {
								loggedIn: req.session.loggedIn,
								results: data.body.results,
								message: req.session.message,
								title: "Episode Search Results",
								header: "Episode Search Results"
							})
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

// Show page for episodes in Database
router.get("/:id", async (req, res) => {
	try {
		const foundEpisode = await Episode.findOne({id: req.params.id})
		// If podcast doesn't exist yet, create it
		// check Databse for podcast id 
		const podcastofEpisode = await Podcast.findOne({id: foundEpisode.podcast_id})
		// if results are null 

		if 	(!podcastofEpisode) {
			res.render("episodes/show.ejs", {
				podcastFound: false,
				loggedIn: req.session.loggedIn,
				episode: foundEpisode,
				message: req.session.message,
				title: foundEpisode.title_original,
				header: foundEpisode.title_original
			})

			
			// ==== Create Podcast in DB, if doesn't yet exist ==== NOT WORKING YET
			// query = foundEpisode.podcast_title_original
			// offset = 10
			// // Query the API for podcast of podcast name
			// const request = await unirest.get("https://listennotes.p.mashape.com/api/v1/search?offset=" + offset.toString() + "&q=" + query + "&type=podcast") //&only_in=author" )
			// .header("X-Mashape-Key", process.env.API_KEY)
			// .header("Accept", "application/json")
			// .end ((data) => {
			// // create podcast
			// 	if (data.body){
			// 		// check if podcast ids match
			// 		// Add ids from Api query to array
			// 		const queryIdArray = data.body.results.map(podcast => podcast.id)
			// 		// Find Podcasts that have the same Id as query id Array
			// 		Podcast.find({id: {$in: queryIdArray}}, (err, extantPodcastArray) => {
			// 			if (err) {
			// 				res.send(err)
			// 			} else {
			// 				//Find Ids of episodes not to create
			// 				const extantIdArray = extantPodcastArray.map(podcast => podcast.id)
			// 				// Filter out episodes not to create
			// 				const podsToAdd = data.body.results.filter(result => !extantIdArray.includes(result.id))
			// 				// Create remaining episodes in query
			// 				Podcast.create(podsToAdd, (err, createdPodcast) => {
			// 					if (err) {
			// 						res.send(err)
			// 					} else { 
			// 						if (createdPodcast) {
			// 							console.log(createdPodcast);
			// 							console.log('Api query worked, podcast created');
			// 							//render show page
			// 							res.render("episodes/show.ejs", {
			// 								podcastFound: true,
			// 								loggedIn: req.session.loggedIn,
			// 								episode: foundEpisode,
			// 								message: req.session.message,
			// 								title: foundEpisode.title_original,
			// 								header: foundEpisode.title_original
			// 							})			
			// 						} else {
			// 							console.log('Api query yielded results, but none were correct, no podcast created');
			// 							res.render("episodes/show.ejs", {
			// 								podcastFound: false,
			// 								loggedIn: req.session.loggedIn,
			// 								episode: foundEpisode,
			// 								message: req.session.message,
			// 								title: foundEpisode.title_original,
			// 								header: foundEpisode.title_original
			// 							})	
			// 						}
			// 					}
			// 				})
			// 			}
			// 		})
			// 	} else {
			// 		console.log('Api query yielded no results, no podcast created');
			// 		res.render("episodes/show.ejs", {
			// 			podcastFound: false,
			// 			loggedIn: req.session.loggedIn,
			// 			episode: foundEpisode,
			// 			message: req.session.message,
			// 			title: foundEpisode.title_original,
			// 			header: foundEpisode.title_original
			// 		})	
			// 	}
			// })
			
		} else {
			console.log('Podcast already exists');
			//render show page 
			res.render("episodes/show.ejs", {
				podcastFound: true,
				loggedIn: req.session.loggedIn,
				episode: foundEpisode,
				message: req.session.message,
				title: foundEpisode.title_original,
				header: foundEpisode.title_original
			})
		}

	// ==== Render that works just in case
	// res.render("episodes/show.ejs", { 
	// 	podcastFound: true,
	// 	loggedIn: req.session.loggedIn,
	// 	episode: foundEpisode,
	// 	message: req.session.message,
	// 	title: foundEpisode.title_original,
	// 	header: foundEpisode.title_original
	// })	
		
	} catch (err) {
		res.send(err)
	}
})

// Example of results from Star Wars query

// "took": 0.243,
//   "next_offset": 10,
//   "count": 10,
//   "results": [
//     {
//       "listennotes_url": "https://www.listennotes.com/e/5bc5ea48514c4be4b92eaa924a67bdaa/",
//       "id": "5bc5ea48514c4be4b92eaa924a67bdaa",
//       "description_original": "Star Wars Video Games Coming To Star Wars Celebration",
//       "podcast_id": "bc2933ec280741e78bab7402dfce8678",
//       "publisher_original": "DisKingdom.com",
//       "title_highlighted": "<span class=\"ln-search-highlight\">Star</span> <span class=\"ln-search-highlight\">Wars</span> Video Games Coming To <span class=\"ln-search-highlight\">Star</span> <span class=\"ln-search-highlight\">Wars</span> Celebration",
//       "image": "https://d3sv2eduhewoas.cloudfront.net/channel/image/12d46905105a41418106c7bae0aa8034.jpg",
//       "audio": "https://www.listennotes.com/e/p/5bc5ea48514c4be4b92eaa924a67bdaa/",
//       "podcast_title_original": "DisKingdom Podcast - Disney | Marvel | Star Wars",
//       "genres": [
//         86,
//         82
//       ],
//       "description_highlighted": "...Star Wars Video Games Coming To Star Wars Celebration",
//       "audio_length": "00:03:00",
//       "podcast_listennotes_url": "https://www.listennotes.com/c/bc2933ec280741e78bab7402dfce8678/",
//       "itunes_id": 966501112,
//       "pub_date_ms": 1488438000000,
//       "podcast_title_highlighted": "DisKingdom Podcast - Disney | Marvel | Star Wars",
//       "thumbnail": "https://d3sv2eduhewoas.cloudfront.net/channel/image/facd6f70149f4572a4ac0df3a1bc7786.jpg",
//       "transcripts_highlighted": [],
//       "rss": "https://www.listennotes.com/c/r/bc2933ec280741e78bab7402dfce8678",
//       "title_original": "Star Wars Video Games Coming To Star Wars Celebration",
//       "publisher_highlighted": "DisKingdom.com"
//     },

module.exports = router