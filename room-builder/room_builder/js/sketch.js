var canvas;

var wallTexture, floorTexture, doorClosedTexture, lootClosedTexture;

var room;
var tool = -1;

const FLOOR = 0;
const WALL = -1;
const DOOR = -2;
const LOOT = 1;

function preload() {
	wallTexture = (loadImage('data/wallTexture0.png'));
	floorTexture = (loadImage('data/floorTexture0.png'));
	doorClosedTexture = loadImage('data/doorClosedTexture.png');
	lootClosedTexture = loadImage('data/lootClosedTexture.png');
}

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	textFont('Monospace');
	noStroke();

	squareSize = (width / 3) / 10;

	room = new Room();
}

function draw() {

	$('#width').text("Width: " + room.width);
	$('#height').text("Height: " + room.height);

	background(20);

	translate(width / 3, height / 6);
	for (var i = 0; i < room.width; i++) {
		for (var j = 0; j < room.height; j++) {
			room.squares[i][j].display(i, j);
		}
	}
}

function mousePressed() {
	var squareX = floor((mouseX - (width / 3)) / squareSize);
	var squareY = floor((mouseY - (height / 6)) / squareSize);

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

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function saveRoom() {
	var json = {};

	json.id = 0;
	json.width = room.width;
	json.height = room.height;
	json.squares = room.squaresToJSON();

	saveJSON(json, 'newRoom.json');
}