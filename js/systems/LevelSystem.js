
LevelSystem.prototype = Object.create(System.prototype);
function LevelSystem (){
	System.call(this);

	this.acceptedEvents = [];
	this.acceptedCommands = [command_init, command_generate_level, command_down_level, command_up_level];

	let currentDepth = 0;
	let levels = [];
	let player;

	this.run = function(engine){

	}

	this.handleEvent = function(engine, e){
		if(this.acceptedEvents.includes(e.eventID)){
			switch(e.eventID){
			}
		}
	}

	this.handleCommand = function(engine, c){
		if(this.acceptedCommands.includes(c.commandID)){
			switch(c.commandID){
				case command_down_level:
					currentDepth++;
					if(currentDepth == levels.length){
						newLevel(CONFIG.DUNGEON_SIZE, currentDepth); 
						engine.sendEvent({ eventID: event_new_level });
					}
					fixPlayerPosition(levels[currentDepth].level.stairUp);
					updateLevel(engine);
					engine.sendEvent({ eventID: event_down_level, level: currentDepth });
					break;
				case command_up_level:
					if(currentDepth > 0){
						currentDepth--; 
						fixPlayerPosition(levels[currentDepth].level.stairDown);
						updateLevel(engine);
						engine.sendEvent({ eventID: event_up_level, level: currentDepth });
					}
					break;
				case command_init:
					newDungeon(engine);
					break;
			}
		}
	}

	this.updateObjects = function(object){
		if(object instanceof Player){ player = object; }
	}

	let newDungeon = function(engine){
		let level = newLevel(engine, 0);
		engine.sendCommand({ commandID:command_generate_player, x:level.level.stairUp.x, y:level.level.stairUp.y });
		updateLevel(engine);
		engine.sendEvent({ eventID: event_new_level });
	}

	let newLevel = function(engine, depth){
		let stair = undefined;
		if(depth > 0){ stair = levels[depth - 1].level.stairDown }
		let level = generateLevel(CONFIG.DUNGEON_SIZE, depth);
		levels.push(level);
		return level; 
	}

	let updateLevel = function(engine){
		engine.clearObjects();
		let level = levels[currentDepth];
		engine.updateObjects(level);
		for (var i = 0; i < CONFIG.DUNGEON_SIZE; i++) {
			for (let j = 0; j < CONFIG.DUNGEON_SIZE; j++) {
				engine.updateObjects(level.level.board[i][j]);
			}
		}
	}

	let fixPlayerPosition = function(stair){
		player.position.x = stair.x;
		player.position.y = stair.y;
	}

}
