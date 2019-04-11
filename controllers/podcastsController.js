// === Imports ===
const express = require('express');
const router = express.Router();
const unirest = require('unirest');
const Podcast = require('../models/podcast')
const Episode = require('../models/episode')

// Get To Episode Search page
router.get("/", (req, res) => {
	res.render("podcasts/search.ejs", {
		loggedIn: req.session.loggedIn,
		message: req.session.message,
		title: "Podcast Search",
		header: "Podcast Search"
	})
})

router.post("/", async (req, res) => {
	try {
		query = req.body.query
		type = req.body.type
		offset = 10
		// Query the API
		const request = await unirest.get("https://listennotes.p.mashape.com/api/v1/search?offset=" + offset.toString() + "&q=" + query + "&type=podcast") //&only_in=author" )
		.header("X-Mashape-Key", process.env.API_KEY)
		.header("Accept", "application/json")
		.end ((data) => {

			console.log("API response data: ", data)

			if (data.error || !data.body) {
				throw new Error
			}

			// Add ids from Api query to array
			const queryIdArray = data.body.results.map(podcast => podcast.id)
			// Find Podcasts that have the same Id as query id Array
			Podcast.find({id: {$in: queryIdArray}}, (err, extantPodcastArray) => {
				if (err) {
					res.send(err)
				} else {
					//Find Ids of podcasts not to create
					const extantIdArray = extantPodcastArray.map(podcast => podcast.id)
					// Filter out podcasts not to create
					const podsToAdd = data.body.results.filter(result => !extantIdArray.includes(result.id))
					// Create remaining episodes in query
					Podcast.create(podsToAdd, (err, createdPodcasts) => {
						if (err) {
							res.send(err)
						} else {
							res.render("podcasts/searchResults.ejs", {
								loggedIn: req.session.loggedIn,
								results: data.body.results,
								message: req.session.message,
								title: "Podcast Search Results",
								header: "Podcast Search Results"
							})
						}
					})
				}
			})
		})
	} catch (err) {
		console.log(err);
		res.send(err);
	}
})

// SHOULD LIVE ON PODCAST SHOW
router.get("/:id", async (req, res) => {
	try {
		// find the podcast from its id in href
		const foundPodcast = await Podcast.findOne({id: req.params.id})

		const epsOfPodDb = await Episode.find({podcast_id: req.params.id})
		const epDbIdArray = epsOfPodDb.map(Episode => Episode.id)

		// // ======= BLOCK ON QUERYING PODCAST
		// query the database for episodes of podcast name
		query = foundPodcast.title_original
		offset = 10
		// console.log(query, "query\n");
		const request = await unirest.get("https://listennotes.p.mashape.com/api/v1/search?offset=" + offset.toString() + "&q=" + query + "&type=episode" )
			.header("X-Mashape-Key", process.env.API_KEY)
			.header("Accept", "application/json")
			.end ((data) => {
				console.log(data.body);
				// check if data.body.results exists
				if (!data.body) {
					// ====== Add IDs from episodes in DB to Podcast.Episodes ====== WORKING

					epsOfPodDb.forEach((episode) => {
						// console.log('');
						// console.log(episode.id);
						foundPodcast.episodes.push(episode.id)
					})
					console.log('\nfoundPodcast.episodes after adding eps in DB:\n\n', foundPodcast.episodes);

					// ======= Render Page ========

					res.render("podcasts/show.ejs", {
						episodes: epsOfPodDb,
						loggedIn: req.session.loggedIn,
						podcast: foundPodcast,
						message: req.session.message,
						title: foundPodcast.title_original,
						header: foundPodcast.title_original
					})

				} else {
					// ===== filter queried episodes by foundpodcast id ======= WORKING	

					const foundEpisodes = data.body.results
					const episodesOfFoundPodcast = foundEpisodes.filter(episode => episode.podcast_id === foundPodcast.id)
					// episodesOfFoundPodcast.forEach((e) => console.log('episodesOfFoundPodcast.podcast_id\n', e.podcast_id));

					// ====== Filter out Queried Episodes already in DB  ======  WORKING

					const filteredQueryEps = episodesOfFoundPodcast
						.filter(eps => !epDbIdArray.includes(eps.id))
					// console.log(epDbIdArray, "epDbIdArray\n");
					console.log('\nfilteredQueryEps Ids:\n');
					filteredQueryEps.forEach((e) => console.log(e.id));
					console.log('');

					// ====== Add IDs from episodes in DB to Podcast.Episodes ====== WORKING

					epsOfPodDb.forEach((episode) => {
						// console.log('');
						// console.log(episode.id);
						foundPodcast.episodes.push(episode.id)
					})
					console.log('\nfoundPodcast.episodes after adding eps in DB:\n\n', foundPodcast.episodes);

					// ====== Add IDs from episodes in Query to Podcast.Episodes ===== WORKING
					
					filteredQueryEps.forEach((episode) => foundPodcast.episodes.push(episode.id))
					console.log('\nfoundPodcast.episodes after adding eps from Query:\n\n', foundPodcast.episodes);

					// ====== Make a variable for all episodes belonging to podcast to pass in ===== WORKING
					const allEpsOfPodcast = []
					allEpsOfPodcast.push(epsOfPodDb);
					allEpsOfPodcast.push(filteredQueryEps);
					const allEpsOfPodcastFlat = allEpsOfPodcast.reduce((acc, episode) => acc.concat(episode), [])

					// console.log('allEpsOfPodcastFlat\n', allEpsOfPodcastFlat);

					// ======= Create Queried Episodes =============== // Working
					// if filtered Query Eps is empty, should not create

					if (filteredQueryEps !== []) {
						Episode.create(filteredQueryEps, (err, createdEpsfromQuery) => {
							if (err) {
								res.send(err)
							} else {
								res.render("podcasts/show.ejs", {
									episodes: allEpsOfPodcastFlat,
									loggedIn: req.session.loggedIn,
									podcast: foundPodcast,
									message: req.session.message,
									title: foundPodcast.title_original,
									header: foundPodcast.title_original
								})
							}
						})
					} else {
						res.render("podcasts/show.ejs", {
							episodes: allEpsOfPodcastFlat,
							loggedIn: req.session.loggedIn,
							podcast: foundPodcast,
							message: req.session.message,
							title: foundPodcast.title_original,
							header: foundPodcast.title_original
						})
					}
					// A response that works so my browser don't get confused -- just incase
					// res.render("podcasts/show.ejs", {
					// 	loggedIn: req.session.loggedIn,
					// 	podcast: foundPodcast,
					// 	message: req.session.message,
					// 	title: foundPodcast.title_original,
					// 	header: foundPodcast.title_original
					// })





				}	

			})		
	} catch (err) {
		console.log(err);
		res.send(err)
	}	
})


// Example Podcast result

// {
//   "results": [
//     {
//       "publisher_highlighted": "HeadGum / <span class=\"ln-search-highlight\">Doughboys</span> Media",
//       "title_highlighted": "<span class=\"ln-search-highlight\">Doughboys</span>",
//       "title_original": "Doughboys",
//       "earliest_pub_date_ms": 1432176191000,
//       "thumbnail": "https://d3sv2eduhewoas.cloudfront.net/channel/image/a6dee1aae87341219b5970dad9017330.jpeg",
//       "genres": [
//         133
//       ],
//       "email": "doughboyspodcast@gmail.com",
//       "lastest_pub_date_ms": 1548316860000,
//       "id": "a0049652ab0545eab60116fd610f7713",
//       "image": "https://d3sv2eduhewoas.cloudfront.net/channel/image/a6dee1aae87341219b5970dad9017330.jpeg",
//       "description_original": "\n      The podcast about chain restaurants. Comedians Mike Mitchell and Nick Wiger review fast food/sit-down chains and generally argue about food/everything.\n    ",
//       "explicit_content": true,
//       "itunes_id": 996151267,
//       "description_highlighted": "...\n      The podcast about chain restaurants. Comedians Mike Mitchell and Nick Wiger review fast food/sit-down chains and generally argue about food/everything.\n    ",
//       "listennotes_url": "https://www.listennotes.com/c/a0049652ab0545eab60116fd610f7713/",
//       "rss": "https://www.listennotes.com/c/r/a0049652ab0545eab60116fd610f7713",
//       "total_episodes": 292,
//       "publisher_original": "HeadGum / Doughboys Media"
//     },



module.exports = router;