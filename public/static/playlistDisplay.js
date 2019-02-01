// Ended up breaking this static js file into two 
// seaprate files for two different pages. 
// Keeping all the code here though, for reference. 
// At the moment, no pages link to here. 




console.log("Connected!");


// ========== CACHED ELEMENTS ==========
let $episodes = $("#hidden-episode-list input");
const $save = $("#save-btn");
const $addBtn = $(".addBtn");

const $deleteBtns = $("#sortable div li button");
const $deleteList = $("#deleteList");

const $addToPlaylist = $("#add-to-playlist");
const $addList = $("#addList");


// ========== EPISODE ARRAYS ==========
const initialEpisodeArray = [];
const deleteEpisodeArray = [];
const addedEpisodeArray = [];


// make initial array of episode IDs

for (let i = 0; i < $episodes.length; i++) {
	initialEpisodeArray.push( $(`#${i}-hidden`).val() );
}

console.log(initialEpisodeArray);
// works!



// ========== SORT-OF EVENT LISTENER USING JQUERY UI ========== 

$("#sortable").sortable({
	stop: function(evt, ui){
		// update hidden inputs in form
		updateEpisodeArray();
	}
});




// ========== FUNCTIONS ==========

// update hidden form that contains data for what the updated episode array 
// will be 

function updateEpisodeArray () {

	$episodes = $("#sortable div");

	const currentEpisodeArrayIndices = [];

	for (let i = 0; i < $episodes.length; i++) {	
		currentEpisodeArrayIndices.push($episodes[i].id);
	}

	const currentEpisodeArray = currentEpisodeArrayIndices.map( (newOrderIndex)=>{
		const newIndex = parseInt(newOrderIndex);
		return initialEpisodeArray[newIndex];
	})

	const $formList = $("#hidden-episode-list input");

	for (let m = 0; m < $formList.length; m++) {
		const $input = $(`#hidden-episode-list input:nth-child(${m + 1})`);
		$input.val(currentEpisodeArray[m]);
	}
}


function addEpisode (data) {

	// FORM of the "data" being passed in: 
	
	// const episodeData = {
	// 	podcast: evt.currentTarget.dataset.podcast,
	// 	title: evt.currentTarget.dataset.episode,
	// 	imgURL: evt.currentTarget.dataset.img,
	// 	id: evt.currentTarget.dataset.epid
	// }

	const newAddEpisodeEntry = 
		$(`<li data-epid="data.id"><strong>${data.podcast}</strong><br />${data.title}</li>`);

	$addToPlaylist.append(newAddEpisodeEntry);

	addedEpisodeArray.push(data.id);

	updateAddForm();
}


function deleteEntry (episode, origInd) {

	// code to change the visual display
	$(`#episode-name-${origInd}`).css("opacity", "0.3");
	$(`#${origInd}-remove`).text("+");

	// manipulate the deleted episodes array 
	deleteEpisodeArray.push(episode);
}


function undeleteEntry (episode, origInd) {

	// code to change the visual display 
	$(`#episode-name-${origInd}`).css("opacity", "1");
	$(`#${origInd}-remove`).text("x");

	// manipulate the deleted episodes array 
	const episodeIndex = deleteEpisodeArray.findIndex((maybeEpisode)=>{
		if (maybeEpisode === episode) {
			return true;
		}
	});

	deleteEpisodeArray.splice(episodeIndex, 1);
}


function updateAddForm () {
	
	const newAddFormValue = addedEpisodeArray.reduce( (acc, episode) => {
		return acc + episode + " "
	}, "")

	$addList.val(newAddFormValue);
}


function updateDeleteForm () {

	const newDeleteFormValue = deleteEpisodeArray.reduce( (acc, episode) => {
		return acc + episode + " "
	}, "")

 	$deleteList.val(newDeleteFormValue);

}


function toggleDeleteEntry (fullId) {

	let idNum = "";

	for (let m = 0; m < fullId.length; m++) {
		if (fullId[m] === "-") {
			break;
		} else {
			idNum += fullId[m]
		}
	}

	const episode = initialEpisodeArray[parseInt(idNum)];

	// figure out if episode is already in the deleteEpisodeArray 
	// if not, add it to deleteEpisodeArray, and do the "delete" display change 
	// if already there, remove it from that array, and do the "undelete" display change 
	// then, regardless, update the deleteForm ! 


	if (deleteEpisodeArray.includes(episode)) {
		undeleteEntry(episode, idNum);
	} else {
		deleteEntry(episode, idNum);
	}


	updateDeleteForm();

	console.log($deleteList.val());

// 	console.log(idNum); // --> WORKS

}


// ========== ADD EVENT LISTENERS ========== 
// add delete function to every "delete" button, keyed 
// to the correct ORIGINAL episode index!

for (let i = 0; i < $deleteBtns.length; i++) {
	$(`#${i}-remove`).on("click", (evt)=>{

		toggleDeleteEntry(evt.currentTarget.id.toString());
	})
}


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
