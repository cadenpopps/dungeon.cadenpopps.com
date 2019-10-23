"use strict";

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {

	let config = loadConfig();
	let room_pool = loadRoomPools();
	let images = loadImages();
	let player_data = loadPlayerData();
	let entity_data = loadEntityData();
	let music = loadMusic();
	let sounds = loadSounds();
	let data = {
		"config": config,
		"room_pool": room_pool[0],
		"stair_room_pool": room_pool[1],
		"images": images,
		"player_data": player_data,
		"entity_data": entity_data,
		"music": music,
		"sounds": sounds
	}

	let e = new PoppsEngine(data);

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

	images.TEXTURES = [];
	images.TEXTURES[TEXTURE_FLOOR] = loadImage('/img/textures/floor0.jpg');
	images.TEXTURES[TEXTURE_WALL] = loadImage('/img/textures/wall0.jpg');
	images.TEXTURES[TEXTURE_DOOR_OPEN] = loadImage('/img/textures/doorOpen.png');
	images.TEXTURES[TEXTURE_DOOR_CLOSED] = loadImage('/img/textures/doorClosed.jpg');
	images.TEXTURES[TEXTURE_LOOT_OPEN] = loadImage('/img/textures/lootOpen.png');
	images.TEXTURES[TEXTURE_LOOT_CLOSED] = loadImage('/img/textures/lootClosed.png');
	images.TEXTURES[TEXTURE_STAIR_UP] = loadImage('/img/textures/stairUp.png');
	images.TEXTURES[TEXTURE_STAIR_DOWN] = loadImage('/img/textures/stairDown.png');

	images.UI = [];
	images.UI[HEART] = loadImage('/img/icons/heart.png');

	return images;
}

function loadPlayerData(){
	return loadJSON('/data/player_data.json');
}

function loadEntityData(){
	return loadJSON('/data/entity_data.json');
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
