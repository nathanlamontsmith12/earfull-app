// Require Mongoose 
const mongoose = require("mongoose");

// Import needed models
const User = require("./user")
const Episode = require("./episode")
const Comment = require("./comment")

// Make & Export Podcast model
const podcastSchema = mongoose.Schema({
	title_original: String,
	image: String,
	thumbnail: String,
	description_original: String,
	publisher_original: String,
	listennotes_url: String,
	lastest_pub_date_ms: Number,
	genres: [Number],
	followers: [],
	id: String,
	episodes: [{type: String, unique: true}],
	comments: [Comment.schema]
});

// NOTE: followers array will be filled with Users, but this must 
// happen later; can't require atm because Users requires this schema 
// causing a chicken-egg problem

const Podcast = mongoose.model("Podcast", podcastSchema);

module.exports = Podcast;

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


