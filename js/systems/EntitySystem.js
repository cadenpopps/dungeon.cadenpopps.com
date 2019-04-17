
EntitySystem.prototype = Object.create(System.prototype);
function EntitySystem (){
	System.call(this);

	this.componentRequirements = [component_actions];

	this.acceptedEvents = [event_new_level, event_down_level, event_up_level];
	this.acceptedCommands = [command_generate_player];

	let levels = [];
	let player;
	let board;

	this.run = function(engine){
		for(let e of this.objects){
			if(e instanceof Mob){
				let b = getBehavior(e, player);
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

	this.updateObjects = function(object){
		if(object instanceof Level){ board = object.level.board; }
		System.prototype.updateObjects.call(this, object);
	}



	//MOB BEHAVIOR

	let getBehavior = function(mob, player){
		if(abs(mob.position.x - player.position.x) < CONFIG.PLAYER_VISION_RANGE && abs(mob.position.y - player.position.y) < CONFIG.PLAYER_VISION_RANGE){
			if(abs(mob.position.x - player.position.x) > 1 || abs(mob.position.y - player.position.y) > 1){
				let path = findMobPath(board, mob, player);
				let dir = dirToSquare(board[mob.position.x][mob.position.y], path[1]);
				mob.actions.nextAction = action_move + dir;
			}
			else{
			}
		}
	}


}
