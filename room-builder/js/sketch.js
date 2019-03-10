var canvas;

var wallTexture, floorTexture, doorClosedTexture, lootClosedTexture;
var room;

var FLOOR, WALL, DOOR, LOOT;
var BOUNDING_SIZE, xoff, yoff;

var tool;

function preload() {
	wallTexture = (loadImage('/img/textures/wall0.jpg'));
	floorTexture = (loadImage('/img/textures/floor0.jpg'));
	doorClosedTexture = loadImage('/img/textures/doorClosed.jpg');
	lootClosedTexture = loadImage('/img/textures/lootClosed.png');

	window.config = loadJSON('/config/config.json');

}

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	textFont('Monospace');
	noStroke();


	config = config[2].val;
	FLOOR = config.floor;
	WALL = config.wall;
	DOOR = config.door;
	LOOT = config.loot;

	tool = WALL;

	BOUNDING_SIZE = 8 * height / 10;

	room = new Room();
	room.resize();

	xoff = (width - BOUNDING_SIZE)/2;
	yoff = (height - BOUNDING_SIZE)/2;
}

function draw() {

	$('#width').text("Width: " + room.width);
	$('#height').text("Height: " + room.height);

	background(20);

	for (var i = 0; i < room.width; i++) {
		for (var j = 0; j < room.height; j++) {
			room.squares[i][j].display(i, j, squareSize);
		}
	}
}

function mousePressed() {
	var squareX = floor((mouseX - xoff) / squareSize);
	var squareY = floor((mouseY - yoff) / squareSize);

	if (squareX < room.width && squareX >= 0 && squareY < room.height && squareY >= 0) {
		// if (keyIsDown(16)) {
		// 	room.squares[squareX][squareY].change();
		// }
		// else {
		// 	room.squares[squareX][squareY].changeBack();
		// }

		room.squares[squareX][squareY].changeToType(tool);
	}
}

function keyPressed(){
	switch(keyCode){
		case 37: case 72:
			room.decWidth();
			break;
		case 39: case 76:
			room.incWidth();
			break;
		case 40: case 75:
			room.decHeight();
			break;
		case 38: case 74:
			room.incHeight();
			break;
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function saveRoom() {
	var json = {};

	json.id = 0;
	json.width = room.width;
	json.height = room.height;
	json.squares = room.squaresToJSON();

	json = JSON.stringify(json, null, 2);

	copyToClipboard(json);
	//saveJSON(json, 'newRoom.json');
}

function copyToClipboard(json){
	let el = document.createElement('textarea');
	el.value = json;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
};
