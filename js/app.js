function setup() {
	createCanvas(windowWidth, windowHeight);
	load();
}

function load() {

	let config = loadConfig();
	let room_pool = loadRoomPools();
	let images = loadImages();
	let player_data = loadPlayerData();
	let entity_data = loadEntityData();
	// let music = loadMusic();
	// let sounds = loadSounds();
	let data = {
		'config': config,
		'room_pool': room_pool[0],
		'stair_room_pool': room_pool[1],
		'images': images,
		'player_data': player_data,
		'entity_data': entity_data
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

	images.textures[texture_floor] = [];
	// images.textures[texture_floor][texture_default] = loadImage('/img/textures/old/pathTexture0.png');
	// images.textures[texture_floor][texture_alt1] = loadImage('/img/textures/old/pathTexture0.png');
	// images.textures[texture_floor][texture_alt2] = loadImage('/img/textures/old/pathTexture1.png');
	// images.textures[texture_floor][texture_alt3] = loadImage('/img/textures/old/pathTexture2.png');
	// images.textures[texture_floor][texture_alt4] = loadImage('/img/textures/old/pathTexture3.png');
	// images.textures[texture_floor][texture_alt5] = loadImage('/img/textures/old/pathTexture4.png');
	// images.textures[texture_floor][texture_alt6] = loadImage('/img/textures/old/pathTexture5.png');
	// images.textures[texture_floor][texture_num_alts] = 6;
	images.textures[texture_floor][texture_num_alts] = 0;

	// images.textures[texture_floor][texture_side_top] = loadImage('/img/textures/side_top.png');
	// images.textures[texture_floor][texture_side_right] = loadImage('/img/textures/side_right.png');
	// images.textures[texture_floor][texture_side_bottom] = loadImage('/img/textures/side_bottom.png');
	// images.textures[texture_floor][texture_side_left] = loadImage('/img/textures/side_left.png');

	// images.textures[texture_floor][texture_in_corner_top_right] = loadImage('/img/textures/corner_in_top_right.png');
	// images.textures[texture_floor][texture_in_corner_bottom_right] = loadImage('/img/textures/corner_in_bottom_right.png');
	// images.textures[texture_floor][texture_in_corner_bottom_left] = loadImage('/img/textures/corner_in_bottom_left.png');
	// images.textures[texture_floor][texture_in_corner_top_left] = loadImage('/img/textures/corner_in_top_left.png');

	// images.textures[texture_floor][texture_out_corner_top_right] = loadImage('/img/textures/corner_out_top_right.png');
	// images.textures[texture_floor][texture_out_corner_bottom_right] = loadImage('/img/textures/corner_out_bottom_right.png');
	// images.textures[texture_floor][texture_out_corner_bottom_left] = loadImage('/img/textures/corner_out_bottom_left.png');
	// images.textures[texture_floor][texture_out_corner_top_left] = loadImage('/img/textures/corner_out_top_left.png');

	// images.textures[texture_floor][texture_U_top] = loadImage('/img/textures/U_top.png');
	// images.textures[texture_floor][texture_U_right] = loadImage('/img/textures/U_right.png');
	// images.textures[texture_floor][texture_U_bottom] = loadImage('/img/textures/U_bottom.png');
	// images.textures[texture_floor][texture_U_left] = loadImage('/img/textures/U_left.png');

	// images.textures[texture_floor][texture_cross] = loadImage('/img/textures/cross.png');


	images.textures[texture_wall] = [];
	images.textures[texture_wall][texture_default] = loadImage('/img/textures/wall.png');
	// images.textures[texture_wall][texture_alt1] = loadImage('/img/textures/old/wallTexture0.png');
	// images.textures[texture_wall][texture_alt2] = loadImage('/img/textures/old/wallTexture0.png');
	// images.textures[texture_wall][texture_alt3] = loadImage('/img/textures/old/wallTexture1.png');
	// images.textures[texture_wall][texture_alt4] = loadImage('/img/textures/old/wallTexture3.png');
	// images.textures[texture_wall][texture_alt5] = loadImage('/img/textures/old/wallTexture4.png');
	// images.textures[texture_wall][texture_alt6] = loadImage('/img/textures/old/wallTexture5.png');
	images.textures[texture_wall][texture_num_alts] = 0;

	// images.textures[texture_wall][texture_side_top] = loadImage('/img/textures/side_top.png');
	// images.textures[texture_wall][texture_side_right] = loadImage('/img/textures/side_right.png');
	// images.textures[texture_wall][texture_side_bottom] = loadImage('/img/textures/side_bottom.png');
	// images.textures[texture_wall][texture_side_left] = loadImage('/img/textures/side_left.png');

	// images.textures[texture_wall][texture_in_corner_top_right] = loadImage('/img/textures/corner_in_top_right.png');
	// images.textures[texture_wall][texture_in_corner_bottom_right] = loadImage('/img/textures/corner_in_bottom_right.png');
	// images.textures[texture_wall][texture_in_corner_bottom_left] = loadImage('/img/textures/corner_in_bottom_left.png');
	// images.textures[texture_wall][texture_in_corner_top_left] = loadImage('/img/textures/corner_in_top_left.png');

	// images.textures[texture_wall][texture_out_corner_top_right] = loadImage('/img/textures/corner_out_top_right.png');
	// images.textures[texture_wall][texture_out_corner_bottom_right] = loadImage('/img/textures/corner_out_bottom_right.png');
	// images.textures[texture_wall][texture_out_corner_bottom_left] = loadImage('/img/textures/corner_out_bottom_left.png');
	// images.textures[texture_wall][texture_out_corner_top_left] = loadImage('/img/textures/corner_out_top_left.png');

	// images.textures[texture_wall][texture_U_top] = loadImage('/img/textures/U_top.png');
	// images.textures[texture_wall][texture_U_right] = loadImage('/img/textures/U_right.png');
	// images.textures[texture_wall][texture_U_bottom] = loadImage('/img/textures/U_bottom.png');
	// images.textures[texture_wall][texture_U_left] = loadImage('/img/textures/U_left.png');

	// images.textures[texture_wall][texture_cross] = loadImage('/img/textures/cross.png');

	images.textures[texture_door_closed] = [];
	images.textures[texture_door_closed][texture_default] = loadImage('/img/textures/old/doorClosedTexture.png');
	images.textures[texture_door_closed][texture_num_alts] = 0;

	images.textures[texture_door_open] = [];
	images.textures[texture_door_open][texture_default] = loadImage('/img/textures/old/doorOpenedTexture.png');
	images.textures[texture_door_open][texture_num_alts] = 0;

	images.textures[texture_loot_closed] = [];
	images.textures[texture_loot_closed][texture_default] = loadImage('/img/textures/old/lootClosedTexture.png');
	images.textures[texture_loot_closed][texture_num_alts] = 0;

	images.textures[texture_loot_open] = [];
	images.textures[texture_loot_open][texture_default] = loadImage('/img/textures/old/lootOpenedTexture.png');
	images.textures[texture_loot_open][texture_num_alts] = 0;

	images.textures[texture_stair_up] = [];
	images.textures[texture_stair_up][texture_default] = loadImage('/img/textures/stairUp.png');
	images.textures[texture_stair_up][texture_num_alts] = 0;

	images.textures[texture_stair_down] = [];
	images.textures[texture_stair_down][texture_default] = loadImage('/img/textures/stairDown.png');
	images.textures[texture_stair_down][texture_num_alts] = 0;

	images.ui = [];

	images.ui[ui_heart] = loadImage('/img/icons/heart.png');
	images.ui[ui_empty_heart] = loadImage('/img/icons/emptyHeart.png');

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
