console.log("Connected!");

// DOM MANIPULATION script for playlist edit page -- ADDING episodes 


// ========== CACHED ELEMENTS ==========
const $save = $("#save-btn");
const $addBtn = $(".addBtn");

const $deleteList = $("#deleteList");

const $addToPlaylist = $("#add-to-playlist");
const $addList = $("#addList");



// ========== ADDED EPISODE ARRAY ==========
const addedEpisodeArray = [];




// ========== FUNCTIONS ==========

function addEpisode (data) {

	// FORM of the "data" being passed in: 
	
	// const episodeData = {
	// 	podcast: evt.currentTarget.dataset.podcast,
	// 	title: evt.currentTarget.dataset.episode,
	// 	imgURL: evt.currentTarget.dataset.img,
	// 	id: evt.currentTarget.dataset.epid
	// }

	const $newAddEpisodeEntry = 
		$(`<li id="${data.id}"><button id="${data.id}-remove">X</button><strong>${data.podcast}</strong><br />${data.title}</li>`);

	$addToPlaylist.append($newAddEpisodeEntry);


	// Add event listener to REMOVE the item; give it a function that removes that 
	// item from display AND removes it from the addedEpisodeArray; 
	$(`#${data.id}-remove`).on("click", (evt)=>{
		deleteAddedEpisode(evt);
	})

	addedEpisodeArray.push(data.id);

	updateAddForm();
}


function deleteAddedEpisode (evt) {

	const fullId = evt.currentTarget.id;
	let id = "";

	for (let i = 0; i < fullId.length; i++) {
		if (fullId[i] === "-") {
			break
		}
		id += fullId[i];
	}
	

	// manipulate the deleted episodes array 
	const indexOfEntryToRemove = addedEpisodeArray.findIndex((episodeId)=>{
		if (episodeId === id) {
			return true;
		}
	})

	addedEpisodeArray.splice(indexOfEntryToRemove, 1);

	$(`#${id}`).remove();

	updateAddForm();
}



function updateAddForm () {
	
	const newAddFormValue = addedEpisodeArray.reduce( (acc, episode) => {
		return acc + episode + " "
	}, "")

	$addList.val(newAddFormValue);
}



// ========== ADD EVENT LISTENERS ========== 
// add delete function to every "delete" button, keyed 
// to the correct ORIGINAL episode index!


for (let q = 0; q < $addBtn.length; q++) {
	$(`#add-${q}`).on("click", (evt) => {

		const episodeData = {
			podcast: evt.currentTarget.dataset.podcast,
			title: evt.currentTarget.dataset.episode,
			imgURL: evt.currentTarget.dataset.img,
			id: evt.currentTarget.dataset.epid
		}

		addEpisode(episodeData);

		$(`#add-${q}`).css("opacity", "0.3");
		$(`#add-${q}`).off();
	})
}
