function setup() {
	createCanvas(windowWidth, windowHeight, "game");
	load();
}

function load() {

	let config = loadConfig();
	let images = loadImages(config.textures);
	let room_pool = loadRoomPools();
	let player_data = processEntityData(loadJSON('/data/player_data.json'));
	let entity_data = processEntityData(loadJSON('/data/entity_data.json'));
	let boss_data = processEntityData(loadJSON('/data/boss_data.json'));

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

function processEntityData(entityData) {
	let newEntityData = [];
	for(let e in entityData) {

		let entityConstant = entity_string_to_constant[e];
		newEntityData[entityConstant] = entityData[e];

		let processedActions = [];
		for(let action of entityData[e].actions) {
			let a = action_string_to_constant[action.action];
			processedActions[a] = {
				action: a,
				actionName: action.action_name,
				cooldown: action.cooldown,
				time: action.time
			};
		}

		newEntityData[entityConstant].actions = processedActions;

	}
	return newEntityData;
}

function loadConfig(){
	return loadJSON('/config/config.json');
}

function loadRoomPools(){
	return loadJSON('/config/roompool.json');
}

function loadImages(textureConfig){
	let images = {}
	images.textures = loadTextures(textureConfig);
	images.ui = loadUI();
	return images;
}

function loadTextures(textureConfig) {
	let textures = [];

	textures[texture_floor] = [];
	// textures[texture_floor][texture_default] = loadImage('/img/textures/floor/floor_default.jpg');
	// textures[texture_floor][texture_num_alts] = textureConfig.NUM_FLOOR_ALTS;
	// for(let i = 0; i < textures[texture_floor][texture_num_alts]; i++) {
	// 	textures[texture_floor][texture_alt1 + i] = loadImage('/img/textures/floor/floor_alt_' + (1 + i) + '.png');
	// }

	// textures[texture_floor][texture_alt2] = loadImage('/img/textures/floor/floor_alt_1.png');
	// textures[texture_floor][texture_alt3] = loadImage('/img/textures/floor/floor_alt_2.png');
	// textures[texture_floor][texture_alt4] = loadImage('/img/textures/floor/floor_alt_3.png');
	// textures[texture_floor][texture_alt5] = loadImage('/img/textures/floor/floor_alt_4.png');
	// textures[texture_floor][texture_alt6] = loadImage('/img/textures/floor/floor_alt_5.png');

	// 	textures[texture_floor][texture_side_top] = loadImage('/img/textures/floor/side_top.png');
	// 	textures[texture_floor][texture_side_right] = loadImage('/img/textures/floor/side_right.png');
	// 	textures[texture_floor][texture_side_bottom] = loadImage('/img/textures/floor/side_bottom.png');
	// 	textures[texture_floor][texture_side_left] = loadImage('/img/textures/floor/side_left.png');

	// 	textures[texture_floor][texture_in_corner_top_right] = loadImage('/img/textures/floor/corner_in_top_right.png');
	// 	textures[texture_floor][texture_in_corner_bottom_right] = loadImage('/img/textures/floor/corner_in_bottom_right.png');
	// 	textures[texture_floor][texture_in_corner_bottom_left] = loadImage('/img/textures/floor/corner_in_bottom_left.png');
	// 	textures[texture_floor][texture_in_corner_top_left] = loadImage('/img/textures/floor/corner_in_top_left.png');

	// 	textures[texture_floor][texture_out_corner_top_right] = loadImage('/img/textures/floor/corner_out_top_right.png');
	// 	textures[texture_floor][texture_out_corner_bottom_right] = loadImage('/img/textures/floor/corner_out_bottom_right.png');
	// 	textures[texture_floor][texture_out_corner_bottom_left] = loadImage('/img/textures/floor/corner_out_bottom_left.png');
	// 	textures[texture_floor][texture_out_corner_top_left] = loadImage('/img/textures/floor/corner_out_top_left.png');

	// 	textures[texture_floor][texture_U_top] = loadImage('/img/textures/floor/U_top.png');
	// 	textures[texture_floor][texture_U_right] = loadImage('/img/textures/floor/U_right.png');
	// 	textures[texture_floor][texture_U_bottom] = loadImage('/img/textures/floor/U_bottom.png');
	// 	textures[texture_floor][texture_U_left] = loadImage('/img/textures/floor/U_left.png');

	// textures[texture_floor][texture_cross] = loadImage('/img/textures/floor/cross.png');


	textures[texture_wall] = [];
	textures[texture_wall][texture_default] = loadImage('/img/textures/wall/wall_default.png');
	textures[texture_wall][texture_num_alts] = textureConfig.NUM_WALL_ALTS;
	for(let i = 0; i < textures[texture_wall][texture_num_alts]; i++) {
		textures[texture_wall][texture_alt1 + i] = loadImage('/img/textures/wall/wall_alt_' + (1 + i) + '.png');
	}

	// textures[texture_wall][texture_alt1] = loadImage('/img/textures/old/wallTexture0.png');
	// textures[texture_wall][texture_alt2] = loadImage('/img/textures/old/wallTexture0.png');
	// textures[texture_wall][texture_alt3] = loadImage('/img/textures/old/wallTexture1.png');
	// textures[texture_wall][texture_alt4] = loadImage('/img/textures/old/wallTexture3.png');
	// textures[texture_wall][texture_alt5] = loadImage('/img/textures/old/wallTexture4.png');
	// textures[texture_wall][texture_alt6] = loadImage('/img/textures/old/wallTexture5.png');
	// textures[texture_wall][texture_num_alts] = 0;

	textures[texture_wall][texture_side_top] = loadImage('/img/textures/wall/wall_side_top.png');
	textures[texture_wall][texture_side_right] = loadImage('/img/textures/wall/wall_side_right.png');
	textures[texture_wall][texture_side_bottom] = loadImage('/img/textures/wall/wall_side_bottom.png');
	textures[texture_wall][texture_side_left] = loadImage('/img/textures/wall/wall_side_left.png');

	textures[texture_wall][texture_in_corner_top_right] = loadImage('/img/textures/wall/wall_corner_in_top_right.png');
	textures[texture_wall][texture_in_corner_bottom_right] = loadImage('/img/textures/wall/wall_corner_in_bottom_right.png');
	textures[texture_wall][texture_in_corner_bottom_left] = loadImage('/img/textures/wall/wall_corner_in_bottom_left.png');
	textures[texture_wall][texture_in_corner_top_left] = loadImage('/img/textures/wall/wall_corner_in_top_left.png');

	textures[texture_wall][texture_out_corner_top_right] = loadImage('/img/textures/wall/wall_corner_out_top_right.png');
	textures[texture_wall][texture_out_corner_bottom_right] = loadImage('/img/textures/wall/wall_corner_out_bottom_right.png');
	textures[texture_wall][texture_out_corner_bottom_left] = loadImage('/img/textures/wall/wall_corner_out_bottom_left.png');
	textures[texture_wall][texture_out_corner_top_left] = loadImage('/img/textures/wall/wall_corner_out_top_left.png');

	// textures[texture_wall][texture_U_top] = loadImage('/img/textures/wall/wall_U_top.png');
	// textures[texture_wall][texture_U_right] = loadImage('/img/textures/wall/wall_U_right.png');
	// textures[texture_wall][texture_U_bottom] = loadImage('/img/textures/wall/wall_U_bottom.png');
	// textures[texture_wall][texture_U_left] = loadImage('/img/textures/wall/wall_U_left.png');

	// textures[texture_wall][texture_cross] = loadImage('/img/textures/wall/wall_cross.png');


	textures[texture_door_closed] = [];
	textures[texture_door_closed][texture_default] = loadImage('/img/textures/old/doorClosedTexture.png');
	textures[texture_door_closed][texture_num_alts] = 0;

	textures[texture_door_open] = [];
	textures[texture_door_open][texture_default] = loadImage('/img/textures/old/doorOpenedTexture.png');
	textures[texture_door_open][texture_num_alts] = 0;

	textures[texture_loot_closed] = [];
	textures[texture_loot_closed][texture_default] = loadImage('/img/textures/old/lootClosedTexture.png');
	textures[texture_loot_closed][texture_num_alts] = 0;

	textures[texture_loot_open] = [];
	textures[texture_loot_open][texture_default] = loadImage('/img/textures/old/lootOpenedTexture.png');
	textures[texture_loot_open][texture_num_alts] = 0;

	textures[texture_stair_up] = [];
	textures[texture_stair_up][texture_default] = loadImage('/img/textures/stairUp.png');
	textures[texture_stair_up][texture_num_alts] = 0;

	textures[texture_stair_down] = [];
	textures[texture_stair_down][texture_default] = loadImage('/img/textures/stairDown.png');
	textures[texture_stair_down][texture_num_alts] = 0;

	return textures;
}

function loadUI() {
	let ui = [];
	ui[ui_heart] = loadImage('/img/icons/heart.png');
	ui[ui_empty_heart] = loadImage('/img/icons/emptyHeart.png');
	return ui;
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
