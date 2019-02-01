// DOM MANIPULATION script for playlist show page 

console.log("Connected!");


// ========== CACHED ELEMENTS ==========
let $episodes = $("#sortable li");
const $save = $("#sort-save-btn");

const $deleteBtns = $("#sortable button");
const $currentOrder = $("#current-order");


// ========== EPISODE ARRAYS ==========
const deleteEpisodeArray = [];

let currentEpisodeArray = [];


// make initial array of episode IDs

for (let i = 0; i < $episodes.length; i++) {
	currentEpisodeArray.push( $(`#${i}`)[0].title );
}

console.log(currentEpisodeArray);


// ========== SORT-OF EVENT LISTENER USING JQUERY UI ========== 

$("#sortable").sortable({
	stop: function(evt, ui){
		// update hidden inputs in form
		// updateEpisodeArray();
		updateEpisodeArray();
		updateEpisodeForm();
	}
});


 

// ========== FUNCTIONS ==========


function updateEpisodeForm() {
	let newValue = "";

	currentEpisodeArray.forEach((episodeId)=>{
		newValue += (episodeId + " ");
	})

	$currentOrder.val(newValue);
}



function deleteEpisodes () {

	const newEpisodeArray = currentEpisodeArray.filter((episodeId)=>{
		if (deleteEpisodeArray.includes(episodeId)) {
			return false;
		} else {
			return true;
		}
	})

	currentEpisodeArray = newEpisodeArray;

	console.log(currentEpisodeArray);

}

// update hidden form that contains data for what the updated episode array 
// will be 

function updateEpisodeArray () {

	$episodes = $("#sortable li");

	const newEpisodeArray = [];

	for (let i = 0; i < $episodes.length; i++) {
		newEpisodeArray.push( $episodes[i].title );
	}

	currentEpisodeArray = newEpisodeArray;


	deleteEpisodes();
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

		const $thisBtn = $(`#${i}-remove`)[0];
		const $thisItem = $(`#${i}`);


		if ($thisBtn.innerText.toString() === "x") {
			// delete
			deleteEpisodeArray.push(evt.currentTarget.title);

			console.log(deleteEpisodeArray);

			$thisItem.css("opacity", "0.3");
			$thisBtn.innerText = "+";

			updateEpisodeArray();
			updateEpisodeForm();

		} else {
			// undelete

			const indexOfEpisodeIdToUndelete = deleteEpisodeArray.findIndex((episodeId)=>{
				if (evt.currentTarget.title === episodeId) {
					return true;
				}
			})

			deleteEpisodeArray.splice(indexOfEpisodeIdToUndelete, 1);

			$thisItem.css("opacity", "1");
			$thisBtn.innerText = "x"; 

			console.log(deleteEpisodeArray);

			updateEpisodeArray();
			updateEpisodeForm();
			
		}



	})
}
