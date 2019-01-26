# EARFULL

## Playlist manager for podcasts

### User Story
Home page will have a search input to query the database for podcasts and/or episodes. The home page will also have links to the login and registration pages. Users can search and browse the database even if they are not signed in. 

Searching will take the user to the search results page populated with the podcasts search results. Clicking on any of the results will bring up the podcast show page with more information about the selected podcast and episodes sorted chronologically with the most recent episodes first. Clicking any episode will take the user to the episode show page, with more information about that episode and an embedded audio player so the user can listen to it immediately. 

Upon logging in, the user will have access to a full navigation bar with links to the user page, home (search) page, and playlist page. In addition, being logged in allows the user to save any podcast search results to their favorite podcasts, or to save any episodes to their library and/or playlists. 

The user page displays the user profile (the user can optionally give some basic information about themselves to display). The user page also displays any podcasts the user has favorited, as well as all the playlists they have created and any episodes currently in their library. The user can follow links to separate view pages that display their library, favorited podcasts, or playlists. 

On the playlist page, users can view, create, edit, and delete their playlists. The playlist page will also have a search bar and display area for search results, so that users can search the podcast and episode database and add any results directly to playlists of their choice. 

If logged in, users can add comments to podcasts and episodes, which will be stored and displayed for all users. 


### Models

#### User 
```
username: {type: String, required: true, unique: true},
password: {type: String, required: true}, 
email: {type: String, required: true}, 
podcasts: [Podcast.schema],
episodes: [Episode.schema],
comments: [Comment.schema],
playlists: [Playlist.schema]
```
#### Podcast
```
name: String,
hosts: [String],
imageURL: String,
description: String,
networkId: String,
link: String,
lastUpdated: Date,
genres: [String],
episodes: [Episode.schema],
comments: [Comment.schema]
```
#### Episode
```
name: String,
number: Number,
podcastId: String,
audio: Buffer,
guests: [String],
imageURL: String,
description: String,
topics: [String],
datePosted: Date,
comments: [Comment.schema]
```
#### Comment
```
ownerId: String,
name: String,
body: String,
datePosted: Date
```
#### Playlist
```
name: String, 
ownerId: String,
datePosted: Date,
lastEdited: Date,
episodes: [Episode.schema]
```