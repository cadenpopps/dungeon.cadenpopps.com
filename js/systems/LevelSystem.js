
LevelSystem.prototype = Object.create(System.prototype);
function LevelSystem (){
	System.call(this);

	this.acceptedEvents = [];
	this.acceptedCommands = [command_generate_level];

	let currentDepth = 0;
	let levels = [];

	this.run = function(engine){
	}

	this.handleEvent = function(e){
		if(this.acceptedEvents.includes(e.eventID)){
			switch(e.eventID){
			}
		}
	}

	this.handleCommand = function(engine, c){
		if(this.acceptedCommands.includes(c.commandID)){
			switch(c.commandID){
				case command_generate_level:
					newLevel(engine, currentDepth);
					break;
			}
		}
	}

	this.updateObjects = function(object){
		if(object instanceof Level){levels.push(object);}
	}

	let newLevel = function(engine, depth){
		let stair = undefined;
		if(depth > 0){ stair = levels[depth - 1].level.stairDown }
		let level = generateLevel(engine, depth, stair)
		engine.updateObjects(level);
		engine.sendCommand({commandID:command_generate_player, x:level.level.stairUp.x, y:level.level.stairUp.y});
	}

	let downLevel = function( ){
	}

}
