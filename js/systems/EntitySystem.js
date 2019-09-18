
EntitySystem.prototype = Object.create(System.prototype);
function EntitySystem (){
	System.call(this);

	this.componentRequirements = [component_actions];

	let levels = [];
	let currentLevel = 0;
	let entities = [];
	let player;
	let board;

	this.run = function(engine){
		for(let e of this.objects){
			if(e instanceof Mob){
				let action = getBehavior(e, player);
				e.actions.nextAction = action;
			}
		}
	}

	this.handleEvent = function(engine, eventID){
		switch(eventID){
			case event_first_level_initiated:
				generatePlayer(engine);
				generateEnemies(engine);
				updateEntities(engine);
				fixPlayerPosition(levels[0].stairUp);
				break;
			case event_new_level:
				generateEnemies(engine);
				break;
			case event_up_level: 
				currentLevel--;	
				fixPlayerPosition(levels[currentLevel].stairDown);
				updateEntities(engine);
				break;
			case event_down_level:
				currentLevel++;
				fixPlayerPosition(levels[currentLevel].stairUp);
				updateEntities(engine);
				break;
		}
	}

	let generatePlayer = function(engine){
		player = new Player(0, 0, 10, 3, 3, 3);
		engine.sendEvent(event_player_generated);
	}

	let generateEnemies = function(engine){
		entities.push([]);
		// entities[entities.length - 1].push(new Mob(player.position.x - 2, player.position.y - 2));
	}

	let fixPlayerPosition = function(stair){
		player.position.x = stair.x;
		player.position.y = stair.y;
	}

	let updateEntities = function(engine){
		for(let e of entities[currentLevel]){
			engine.addObject(e);
		}
		if(player !== undefined) {
			engine.addObject(player);
		}
	}

	this.addObject = function(object){
		if(object instanceof Level){ 
			levels.push(object);
		}
		else{
			System.prototype.addObject.call(this, object);
		}
	}

	//MOB BEHAVIOR

	let getBehavior = function(mob, player){
		if(abs(mob.position.x - player.position.x) < CONFIG.PLAYER_VISION_RANGE && abs(mob.position.y - player.position.y) < CONFIG.PLAYER_VISION_RANGE){
			if(abs(mob.position.x - player.position.x) > 1 || abs(mob.position.y - player.position.y) > 1){
				let path = findMobPath(board, mob, player);
				if(path !== false){
					let dir = dirToSquare(board[mob.position.x][mob.position.y], path[1]);
					return action_move + dir;
				}
				else{
					return action_none;
				}
			}
			else{
			}
		}
	}


}
