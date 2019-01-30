// DOM MANIPULATION script for playlist show page 

console.log("Connected!");

// ========== CACHED ELEMENTS ==========

const $episodes = $("#sortable div");
const $save = $("#save-btn");


// ========== INITIAL AND FINAL EPISODE ORDER ==========
const initialEpisodeArray = [];
const finalEpisodeArray = [];


// make initial arrangedEpisodes array 
for (let i = 0; i < $episodes.length; i++) {
	initialEpisodeArray.push( $(`#episode-name-${i}`)[0].innerText );
}

console.log(initialEpisodeArray);
// works!


// ========== ADD EVENT LISTENERS ========== 
for (let i = 0; i < $episodes.length; i++) {
	$(`#${i}`).on("mousedown", (evt)=>{
		console.log(evt.currentTarget.id); 
	})
}

$("#sortable").sortable({
	stop: function(evt, ui){
		console.log(ui.item.index());
	}
});

$save.on("click", (evt)=>{
	makeChangedArray();
})


// ========== MAKE FINAL ARRAY ==========

function makeChangedArray () {
	
	const finalEpisodeArrayIndices = [];

	for (let i = 0; i < $episodes.length; i++) {
		finalEpisodeArrayIndices.push($episodes[i].id);
	}

	console.log(finalEpisodeArrayIndices);

}


// export default finalEpisodeArray;

















