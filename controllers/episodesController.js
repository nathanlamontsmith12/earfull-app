// === Imports ===
const express = require('express');
const router = express.Router();
const unirest = require('unirest');
const Episode = require('../models/episode')

let query = "";
let type = "";
let offset;

// WORKING QUERY

// unirest.get("https://listennotes.p.mashape.com/api/v1/search?offset=10&q=serial&type=episode")
// .header("X-Mashape-Key", "gymECYoyFxmshFoLe3A70dofgPSep1UuWJajsnNNQ5Ajsnnypv")
// .header("Accept", "application/json")
// .end(function (result) {
//   console.log(result.status, result.headers, result.body);
// });

const genres = unirest.get("https://listennotes.p.mashape.com/api/v1/genres")
	.header("X-Mashape-Key", "gymECYoyFxmshFoLe3A70dofgPSep1UuWJajsnNNQ5Ajsnnypv")
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


router.get("/", (req, res) => {
	res.render("episodes/episodeSearch.ejs", {

	})
})

router.post("/", async (req, res) => {
	try {
		let display;
		query = req.body.query
		type = req.body.type
		offset = 10
		const request = await unirest.get("https://listennotes.p.mashape.com/api/v1/search?offset=" + offset.toString() + "&q=" + query  )
		.header("X-Mashape-Key", "gymECYoyFxmshFoLe3A70dofgPSep1UuWJajsnNNQ5Ajsnnypv")
		.header("Accept", "application/json")
		.end ((data) => {
			const queryIdArray = data.body.results.map(episode => episode.id)
			Episode.find({id: {$in: queryIdArray}}, (err, extantEpisodeArray) => {
				if (err) {
					res.send(err)
				} else {
					const extantIdArray = extantEpisodeArray.map(episode => episode.id)
					const epsToAdd = data.body.results.filter(result => !extantIdArray.includes(result.id))
					Episode.create(epsToAdd, (err, createdEpisodes) => {
						if (err) {
							res.send(err)
						} else {
							res.render("episodes/episodeSearchResults.ejs", {
								results: data.body.results



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




router.get("/:id", async (req, res) => {
	const foundEpisode = await Episode.findOne({id: req.params.id})
	res.render("episodes/show.ejs", {
		episode: foundEpisode



	})
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