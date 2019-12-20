function setup() {
	createCanvas(windowWidth, windowHeight, "game");
	load();
}

function load() {

	let config = loadConfig();
	let room_pool = loadRoomPools();
	let images = loadImages();
	let player_data = loadJSON('/data/player_data.json');
	let entity_data = loadJSON('/data/entity_data.json');
	let boss_data = loadJSON('/data/boss_data.json');

	// let music = loadMusic();
	// let sounds = loadSounds();

	let data = {
		'config': config,
		'room_pool': room_pool[0],
		'stair_room_pool': room_pool[1],
		'images': images,
		'player_data': player_data,
		'entity_data': entity_data,
		'boss_data': boss_data
		// 'music': music,
		// 'sounds': sounds
	};

	new PoppsEngine(data);

	// document.addEventListener('contextmenu', function () { });
}

function loadConfig(){
	return loadJSON('/config/config.json');
}

function loadRoomPools(){
	return loadJSON('/config/roompool.json');
}

function loadImages(){
	let images = [];

	images.textures = [];
	images.textures[texture_floor] = loadImage('/img/textures/floor0.jpg');
	images.textures[texture_wall] = loadImage('/img/textures/wall0.jpg');
	images.textures[texture_door_open] = loadImage('/img/textures/doorOpen.png');
	images.textures[texture_door_closed] = loadImage('/img/textures/doorClosed.jpg');
	images.textures[texture_loot_open] = loadImage('/img/textures/lootOpen.png');
	images.textures[texture_loot_closed] = loadImage('/img/textures/lootClosed.png');
	images.textures[texture_stair_up] = loadImage('/img/textures/stairUp.png');
	images.textures[texture_stair_down] = loadImage('/img/textures/stairDown.png');

	images.ui = [];
	images.ui[ui_heart] = loadImage('/img/icons/heart.png');
	images.ui[ui_empty_heart] = loadImage('/img/icons/emptyHeart.png');

	return images;
}


function loadMusic(){
	let music = [];
	music.push(loadAudio('/audio/music/001_0100.wav'));
	music.push(loadAudio('/audio/music/002_0001.wav'));
	music.push(loadAudio('/audio/music/003_0101.wav'));
	music.push(loadAudio('/audio/music/004_1101.wav'));
	music.push(loadAudio('/audio/music/005_1121.wav'));
	music.push(loadAudio('/audio/music/006_2121.wav'));
	music.push(loadAudio('/audio/music/007_0200.wav'));
	music.push(loadAudio('/audio/music/008_0201.wav'));
	music.push(loadAudio('/audio/music/009_1201.wav'));
	music.push(loadAudio('/audio/music/010_1221.wav'));
	return music;
}

function loadSounds(){
}

function keyDown() { }

function keyUp() { }

// $(document).ready(function () { init(); });
