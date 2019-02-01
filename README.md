# EARFULL

## Playlist manager for podcasts

### Earfull is powered by ListenNotes API 

### User Story
The home page contains a nav bar with links to episode search pages on the left-hand side, and registration links on the right-hand side. The main area of the home page has large buttons that direct the user to the Log In page or to the search page. The search page allows the user to query the ListenNotes database for episodes. Users can search and browse the episode database even if they are not logged in. 

Searching will take the user to a page populated with the episode search results. Clicking on any of the results will bring up a show page with more information about the selected episode, as well as an embedded audio player so the user can listen to it immediately. 

Upon logging in, the user will have access enabling them to create, view, and edit playlists of their podcast episodes. On the playlist view page, the UI allows the user to remove episodes or sort them dynamically, then save changes when they like. They can also click a link, "Add Episodes", which brings them to a page that lets the user search for episodes and add them to their playlist, which is displayed on the right-hand side of the page. 


### Models

#### User 
```
username: {type: String, required: true, unique: true},
password: {type: String, required: true}, 
email: {type: String, required: true},
topics: [String],
profile: Object,
recommendations: [String],
episodes: [String],
podcasts: [String],
search: [Search.schema],
comments: [Comment.schema],
playlists: [Playlist.schema]
```
#### Podcast
```
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
```
#### Episode
```
podcast_title_original: String,
title_original: String,
podcast_id: String,
publisher_original: String,
id: {type: String, unique: true, required: true},
audio: String,
image: String,
thumbnail: String,
description_original: String,
genres: [Number],
pub_date_ms: Number,
number: Number,
comments: [Comment.schema]
```
#### Search
```
userId: String,
genre_ids: [String],
language: String,
len_max: Number, 
len_min: Number,
excludeId: String,
includeId: String,
offset: Number,
only_in: String,
published_after: Number, 
published_before: Number,
q: {type: String, required: true},
safe_mode: Number,
sort_by_date: Number,
type: String 
```
#### Comment
```
ownerId: String,
name: String,
body: String,
datePosted: {type: Date, default: Date.now()},
dateEdited: {type: Date, default: Date.now()}
```
#### Playlist
```
name: {type: String, required: true},
ownerId: String,
datePosted: {type: Date, default: Date.now()},
lastEdited: {type: Date, default: Date.now()},
episodes: [String] 
```