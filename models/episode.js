// Require Mongoose 
const mongoose = require("mongoose");

// Import needed models
const Comment = require("./comment")

// Make & Export Episode model
const episodeSchema = mongoose.Schema({
	podcast_title_original: String,
	title_original: String,
	podcast_id: String,
	id: String,
	audio: String,
	image: String,
	thumbnail: String,
	description_original: String,
	genres: [Number],
	pub_date_ms: Number,
	number: Number,
	comments: [Comment.schema]
});

const Episode = mongoose.model("Episode", episodeSchema);

module.exports = Episode;

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









