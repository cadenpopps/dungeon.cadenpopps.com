
EntitySystem.prototype = Object.create(System.prototype);
function EntitySystem (){
	System.call(this);

	this.acceptedEvents = [event_new_level, event_down_level, event_up_level];
	this.acceptedCommands = [command_generate_player];

	let levels = [];
	let player;

	this.run = function(engine){
		for(let e of this.objects){
			if(e instanceof Mob){
				e.actions.nextAction = randomInt(0, 4);
			}
		}
	}

	this.handleEvent = function(engine, e){
		if(this.acceptedEvents.includes(e.eventID)){
			switch(e.eventID){
				case event_new_level:
					generateEnemies(engine);
					updateEntities(engine, levels.length - 1);
					break;
				case event_up_level: event_down_level:
					updateEntities(engine, e.level);
					break;
			}
		}
	}

	this.handleCommand = function(engine, c){
		if(this.acceptedCommands.includes(c.commandID)){
			switch(c.commandID){
				case command_generate_player:
					generatePlayer(engine, c.x, c.y);
					break;
			}
		}
	}

	let generatePlayer = function(engine, x, y){
		player = new Player(x, y, 10, 3, 3, 3);
	}

	let generateEnemies = function(engine){
		levels[levels.length - 1] = [];
		levels[levels.length - 1].push(new Mob(player.position.x - 2, player.position.y - 2));
	}

	let updateEntities = function(engine, level){
		for(let e of levels[level]){
			engine.updateObjects(e);
		}
		engine.updateObjects(player);
	}
}
