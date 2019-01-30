// DOM MANIPULATION script for playlist show page 

console.log("Connected!");

// ========== CACHED ELEMENTS ==========

let $episodes = $("#sortable div");
const $save = $("#save-btn");


// ========== INITIAL EPISODE ORDER ==========
const initialEpisodeArray = [];


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
	makeFinalEpisodeArray();
})


// ========== MAKE FINAL ARRAY ==========

function makeFinalEpisodeArray () {

	$episodes = $("#sortable div");

	const finalEpisodeArrayIndices = [];

	for (let i = 0; i < $episodes.length; i++) {	
		finalEpisodeArrayIndices.push($episodes[i].id);
	}

	console.log(finalEpisodeArrayIndices);


	const finalEpisodeArray = finalEpisodeArrayIndices.map( (newOrderIndex)=>{
		const newIndex = parseInt(newOrderIndex);
		return initialEpisodeArray[newIndex];
	})

	console.log(finalEpisodeArray);

}


// export default finalEpisodeArray;

















