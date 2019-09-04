var textures = [];
var room;
var tool;
var squareSize;

var drawSize;

const FLOOR = 0, WALL = 1, DOOR = 2, LOOT = 5;

function preload() {
	textures[FLOOR] = loadImage('/room_builder/img/floor.png');
	textures[WALL] = loadImage('/room_builder/img/wall.png');
	textures[DOOR] = loadImage('/room_builder/img/door.png');
	textures[LOOT] = loadImage('/room_builder/img/loot.png');
}

function setup() {
	createCanvas($("#canvas").width(), $("#canvas").height(), "canvas");

	room = new Room();

	room.calculateDoors();

	calcDrawSize();
	calcSquareSize();

	loop();
}

function draw() {

	background(0);

	fill(255);
	rect(drawOffsetX - 3, drawOffsetY - 3, drawSize + 6, drawSize + 6);
	fill(0);
	rect(drawOffsetX, drawOffsetY, drawSize, drawSize);

	for (var i = 0; i < room.width; i++) {
		for (var j = 0; j < room.height; j++) {
			room.squares[i][j].display(i, j);
		}
	}

	for(let d of room.doors){
		image(textures[DOOR], (d[0] * squareSize) + drawOffsetX, (d[1] * squareSize) + drawOffsetY, squareSize, squareSize);
	}
}

function mouseClicked() {
	var squareX = floor((mouseX - drawOffsetX) / squareSize);
	var squareY = floor((mouseY - drawOffsetY) / squareSize);

	if (squareX < room.width && squareX >= 0 && squareY < room.height && squareY >= 0) {
		room.squares[squareX][squareY].changeToType(tool);
	}

	room.calculateDoors();
}

function windowResized() {
	resizeCanvas($("#canvas").width(), $("#canvas").height());
	calcDrawSize();
	calcSquareSize();
}

function calcDrawSize(){
	if(height > width){
		drawSize = width * .7;	
		drawOffsetX = width * .15;
		drawOffsetY = (height - (drawSize)) / 2;
	}
	else{
		drawSize = height * .7;	
		drawOffsetX = (width - (drawSize)) / 2;
		drawOffsetY = height * .15;
	}
}

function calcSquareSize(){
	if(room.width > room.height){
		squareSize = drawSize / room.width;	
	}
	else{
		squareSize = drawSize / room.height;	
	}
}

function saveRoom() {
	var json = {};

	json.width = room.width;
	json.height = room.height;
	json.squares = room.squaresToJSON();
	json.doors = room.doors;

	console.log(JSON.stringify(json));
}
