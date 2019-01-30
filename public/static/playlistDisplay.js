// DOM MANIPULATION script for playlist show page 

console.log("Connected!");


// ========== CACHED ELEMENTS ==========
let $episodes = $("#sortable div");
const $save = $("#save-btn");
const $deleteBtns = $("#sortable div li button");

// ========== INITIAL EPISODE ORDER ==========
const initialEpisodeArray = [];


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


function deleteEntry (id) {
	console.log(id);
}


// ========== ADD EVENT LISTENERS ========== 

for (let i = 0; i < $deleteBtns.length; i++) {
	$(`#${i}-remove`).on("click", (evt)=>{
		const idNum = evt.currentTarget.id;
		deleteEntry(idNum);
	})
}


// for (let i = 0; i < $episodes.length; i++) {
// 	$(`#${i}`).on("mousedown", (evt)=>{
// 	})
// }


// $save.on("click", (evt)=>{
// })
















