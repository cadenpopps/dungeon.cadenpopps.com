$(document).ready(function () {
	$('#decrement-width').click(function(){
		room.decrementWidth();
	});

	$('#increment-width').click(function(){
		room.incrementWidth();
	});

	$('#decrement-height').click(function(){
		room.decrementHeight();
	});

	$('#increment-height').click(function(){
		room.incrementHeight();
	});

	$('#save-button').click(saveRoom);


	$('#wall').click(function () {
		tool = WALL;
		resetBorders();

		$('#wall').css("border", '3px solid white');
	});

	$('#floor').click(function () {
		tool = FLOOR;
		resetBorders();

		$('#floor').css("border", '3px solid white');
	});

	$('#loot').click(function () {
		tool = LOOT;
		resetBorders();

		$('#loot').css("border", '3px solid white');
	});


	tool = WALL;
	$('#wall').css("border", '3px solid white');

});

function resetBorders() {
	$('#wall').css("border", '3px solid transparent');
	$('#floor').css("border", '3px solid transparent');
	$('#loot').css("border", '3px solid transparent');
}
