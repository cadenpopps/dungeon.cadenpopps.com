
LevelSystem.prototype = Object.create(System.prototype);
function LevelSystem (){
	System.call(this);

	let currentDepth = 0;
	let levels = [];
	let player;

	this.run = function(engine){

	}

	this.handleEvent = function(engine, eventID){
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
		let level = generateLevel(CONFIG.DUNGEON_SIZE, depth);
		levels.push(level);
		engine.sendEvent(event_new_level);
		return level; 
	}

	let handleDownLevel = function(engine){
		currentDepth++;
		if(currentDepth == levels.length){
			newLevel(engine, currentDepth); 
		}
		updateLevel(engine);
	}

	let handleUpLevel = function(engine){
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
				engine.addObject(level.level.board[i][j]);
			}
		}
	}
}
