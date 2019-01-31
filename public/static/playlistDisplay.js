// DOM MANIPULATION script for playlist show page 

console.log("Connected!");


// ========== CACHED ELEMENTS ==========
let $episodes = $("#sortable div");
const $save = $("#save-btn");
const $addBtn = $(".addBtn");

const $deleteBtns = $("#sortable div li button");
const $deleteList = $("#deleteList");


// ========== INITIAL EPISODE ORDER ==========
const initialEpisodeArray = [];
const deleteEpisodeArray = [];
const addedEpisodeArray = [];


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


function updateDeleteForm () {

	const newDeleteFormValue = deleteEpisodeArray.reduce( (acc, episode)=>{
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
			podcast: evt.currentTarget.value,
			title: evt.currentTarget.name,
			imgURL: evt.currentTarget.src,
			id: evt.currentTarget.classList[0]
		}

		console.log(episodeData);
		addedEpisodeArray.push(episodeData);

		$(`#add-${q}`).css("opacity", "0.3");
		$(`#add-${q}`).off();
	})
}


// <button id="add-0" class="36e88bffa12c43d6935234a07c2eefe1 addBtn" value="Well This Sucks" name="Doughboys! with Mike Mitchell &amp; Nick Wiger" src="https://d3sv2eduhewoas.cloudfront.net/channel/image/6ae7187c29434f85846eb242fd42c7f4.jpeg">Add to faves</button>


// for (let i = 0; i < $episodes.length; i++) {
// 	$(`#${i}`).on("mousedown", (evt)=>{
// 	})
// }


// $save.on("click", (evt)=>{
// })
















