// DOM MANIPULATION script for playlist show page -- 
// SORTING the playlist

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

// set initial form value: 
updateEpisodeForm();


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

	// const newEpisodeArray = [];


	deleteEpisodeArray.forEach( (episodeID) => {
		if (currentEpisodeArray.includes(episodeID)) {
			const index = currentEpisodeArray.findIndex( (id) => {
				if (id === episodeID) {
					return true
				} else {
					return false 
				}
			});
			currentEpisodeArray.splice(index, 1)
		}
	})

	// currentEpisodeArray.filter((episodeId)=>{
	// 	if (deleteEpisodeArray.includes(episodeId)) {
	// 		return false;
	// 	} else {
	// 		return true;
	// 	}
	// })

	// currentEpisodeArray = newEpisodeArray;

}


function updateEpisodeArray () {

	$episodes = $("#sortable li");

	const newEpisodeArray = [];

	for (let i = 0; i < $episodes.length; i++) {
		newEpisodeArray.push( $episodes[i].title );
	}

	currentEpisodeArray = newEpisodeArray;

	deleteEpisodes();
}



function deleteEntry (item, button, targetEpisodeId) {

	deleteEpisodeArray.push(targetEpisodeId);

	item.css("opacity", "0.3");
	button.innerText = "+";
}


function undeleteEntry (item, button, targetEpisodeId) {

	const targetIndex = deleteEpisodeArray.findIndex( (episodeId)=>{
		if (targetEpisodeId === episodeId) {
			return true;
		}
	})

	deleteEpisodeArray.splice(targetIndex, 1);

	item.css("opacity", "1");
	button.innerText = "x"; 

}



// ========== ADD EVENT LISTENERS ========== 
// add delete function to every "delete" button, keyed 
// to the correct original episode index

for (let i = 0; i < $deleteBtns.length; i++) {
	$(`#${i}-remove`).on("click", (evt)=>{

		const $thisItem = $(`#${i}`);
		const $thisBtn = $(`#${i}-remove`)[0];
		const targetEpisodeId = evt.currentTarget.title;

		if ($thisBtn.innerText.toString() === "x") {
			// delete
			deleteEntry($thisItem, $thisBtn, targetEpisodeId);

			// update Episode Array and Form: 
			updateEpisodeArray();
			updateEpisodeForm();

		} else {
			// undelete
			undeleteEntry($thisItem, $thisBtn, targetEpisodeId);

			// update Episode Array and Form: 
			updateEpisodeArray();
			updateEpisodeForm();
			
		}
	})
}
