// === Imports ===
const express = require('express');
const router = express.Router();
const unirest = require('unirest');
const Episode = require('../models/episode')

let query = ""

const request = unirest.get("https://listennotes.p.mashape.com/api/v1/search?genre_ids=68%2C82&language=English&len_max=10&len_min=2&offset=0&only_in=title&published_after=1390190241000&published_before=1490190241000&q=" + query + "&safe_mode=1&sort_by_date=0&type=episode")
.header("X-Mashape-Key", "gymECYoyFxmshFoLe3A70dofgPSep1UuWJajsnNNQ5Ajsnnypv")
.header("Accept", "application/json")
// .end(function (result) {
//   console.log(result.status, result.headers, result.body);
// });

const genres = unirest.get("https://listennotes.p.mashape.com/api/v1/genres")
	.header("X-Mashape-Key", "gymECYoyFxmshFoLe3A70dofgPSep1UuWJajsnNNQ5Ajsnnypv")
	.header("Accept", "application/json")

// https://listennotes.p.mashape.com/api/v1/search
// /api/v1/genres


router.get("/", (req, res) => {
	// res.render("index.ejs")
	genres.end((result) => {
		console.log(result.status, result.headers, result.body);
		res.send(result.body)
	})
})

// router.post("/", (req, res) => {
// 	console.log(req.body.query);
// 	query = req.body.query
// 	request.end((result) => {
// 		res.send(result.body)
// 	})
// })

// genre_ids
// STRING



// 68,82
// A comma-delimited string of a list of genre ids. You can find the id and the name of all genres in the response of /api/v1/genres

// language
// STRING

// English
// Limit search results to a specific language. If not specified, it'll be any language. You can get a list of supported languages from /api/v1/languages endpoint

// len_max
// NUMBER

// 10
// Maximum audio length in minutes. Applicable only when type parameter is "episode".

// len_min
// NUMBER

// 2
// Minimum audio length in minutes. Applicable only when type parameter is "episode".

// ncid
// STRING

// optional
// A podcast id (the podcast_id field in response). This parameter is to exclude search results from a specific podcast. It works only when "type" is episode.

// ocid
// STRING

// optional
// A podcast id (the podcast_id field in response). This parameter is to limit search results in a specific podcast. It works only when "type" is episode.

// offset
// NUMBER

// 0
// Offset for search results, for pagination. You'll use next_offset from response for this parameter.

// only_in
// STRING

// title
// Search only in specific fields. Allowed values: title, description, author, audio. If not specified, then search every fields

// published_after
// NUMBER

// 1390190241000
// Only show episodes published after this timestamp (in milliseconds). Default: 0 (since the very first episode). If published_before & published_after are used at the same time, published_before should be bigger than published_after.

// published_before
// NUMBER

// 1490190241000
// Only show episodes published before this timestamp (in milliseconds). Default: now. If published_before & published_after are used at the same time, published_before should be bigger than published_after.

// q
// STRING

// star wars
// Search term

// safe_mode
// NUMBER

// 1
// Whether or not to exclude podcasts/episodes with explicit language. 1 is yes and 0 is no. Default: 0

// sort_by_date
// NUMBER

// 0
// Sort by date or not? If 1, sort by date. If 0 (default), sort by relevance.

// type
// STRING

// episode












module.exports = router