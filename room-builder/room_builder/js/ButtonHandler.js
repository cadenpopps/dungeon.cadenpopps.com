$(document).ready(function () {
	$('#decwidth').click(function () {
		room.resize(room.width - 1, room.height);
	});

	$('#incwidth').click(function () {
		room.resize(room.width + 1, room.height);
	});

	$('#decheight').click(function () {
		room.resize(room.width, room.height - 1);
	});

	$('#incheight').click(function () {
		room.resize(room.width, room.height + 1);
	});

	$('#save').click(saveRoom);

	$('#wall').click(function () {
		tool = WALL;
		resetBorders();

		$('#wall').css("border", '2px solid white');
	});
	$('#floor').click(function () {
		tool = FLOOR;
		resetBorders();

		$('#floor').css("border", '2px solid white');
	});
	$('#loot').click(function () {
		tool = LOOT;
		resetBorders();

		$('#loot').css("border", '2px solid white');
	});
	$('#door').click(function () {
		tool = DOOR;
		resetBorders();

		$('#door').css("border", '2px solid white');
	});
});

function resetBorders() {
	$('#wall').css("border", 'none');
	$('#floor').css("border", 'none');
	$('#loot').css("border", 'none');
	$('#door').css("border", 'none');
}