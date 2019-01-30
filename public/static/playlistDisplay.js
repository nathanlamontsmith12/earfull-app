// DOM MANIPULATION script for playlist show page 

console.log("Connected!");


// ========== CACHED ELEMENTS ==========
let $episodes = $("#sortable div");
const $save = $("#save-btn");

const $deleteBtns = $("#sortable div li button");
const $deleteList = $("#deleteList");


// ========== INITIAL EPISODE ORDER ==========
const initialEpisodeArray = [];
const deleteEpisodeArray = [];

// make initial arrangedEpisodes array 
for (let i = 0; i < $episodes.length; i++) {
	initialEpisodeArray.push( $(`#episode-name-${i}`)[0].innerText );
}

// console.log(initialEpisodeArray);
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

	const $formList = $("#hidden-episode-list li input");

	for (let m = 0; m < $formList.length; m++) {
		const $input = $(`#hidden-episode-list li:nth-child(${m + 1}) input`);
		$input.val(currentEpisodeArray[m]);
	}

	console.log($("#hidden-episode-list li input"));
}


function deleteEntry () {

}


function undeleteEntry () {

}


function updateDeleteForm () {

	let newDeleteFormValue = "";

	deleteEpisodeArray.forEach((episode)=>{

	})

//	$deleteList.val(newDeleteFormValue);
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

	console.log(episode);


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


// for (let i = 0; i < $episodes.length; i++) {
// 	$(`#${i}`).on("mousedown", (evt)=>{
// 	})
// }


// $save.on("click", (evt)=>{
// })
















