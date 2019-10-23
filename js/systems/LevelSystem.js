LevelSystem.prototype = Object.create(System.prototype);
function LevelSystem (CONFIG, ROOM_POOL, STAIR_ROOM_POOL){
	System.call(this);

	let currentDepth = 0;
	let levels = [];
	let player;

	this.run = function(engine){

	}

	this.handleEvent = function(engine, eventID, data){
		switch(eventID){
			case event_down_level:
				handleDownLevel(engine);
				break;
			case event_up_level:
				handleUpLevel(engine);
				break;
			case event_new_game:
				handleNewGame(engine);
				break;
		}
	}

	this.addObject = function(object){
		if(object instanceof Player){ player = object; }
	}

	let handleNewGame = function(engine){
		newLevel(engine, 0);
		updateLevel(engine);
		engine.sendEvent(event_first_level_initiated);
	}

	let newLevel = function(engine, depth){
		let level = generateLevel(CONFIG, depth, ROOM_POOL, STAIR_ROOM_POOL);
		levels.push(level);
		return level; 
	}

	let handleDownLevel = function(engine){
		engine.clearObjects();
		currentDepth++;
		if(currentDepth == levels.length){
			newLevel(engine, currentDepth); 
			updateLevel(engine);
			engine.sendEvent(event_new_level);
		}
		else{
			updateLevel(engine);
		}
	}

	let handleUpLevel = function(engine){
		engine.clearObjects();
		if(currentDepth > 0){
			currentDepth--; 
			updateLevel(engine);
		}
	}

	let updateLevel = function(engine){
		let level = levels[currentDepth];
		engine.addObject(level);
		for (var i = 0; i < CONFIG.DUNGEON_SIZE; i++) {
			for (let j = 0; j < CONFIG.DUNGEON_SIZE; j++) {
				engine.addObject(level.map.map[i][j]);
			}
		}
	}
}
