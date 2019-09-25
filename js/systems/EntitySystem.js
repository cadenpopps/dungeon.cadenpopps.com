
EntitySystem.prototype = Object.create(System.prototype);
function EntitySystem (){
	System.call(this);

	this.componentRequirements = [component_actions];

	let levels = [];
	let currentDepth = 0;
	let entities = [];
	let player;
	let map;

	this.run = function(engine){
		for(let e of this.objects){
			if(e instanceof Mob){
				let action = getMobBehavior(e, player);
				e.actions.nextAction = action;
			}
		}
	}

	this.handleEvent = function(engine, eventID){
		switch(eventID){
			case event_first_level_initiated:
				generatePlayer(engine, levels[0].stairUp);
				generateEnemies(engine, currentDepth);
				updateEntities(engine);
				break;
			case event_new_level:
				generateEnemies(engine, currentDepth + 1);
				break;
			case event_up_level: 
				currentDepth--;	
				fixPlayerPosition(levels[currentDepth].stairDown);
				updateEntities(engine);
				break;
			case event_down_level:
				currentDepth++;
				fixPlayerPosition(levels[currentDepth].stairUp);
				updateEntities(engine);
				break;
		}
	}

	let generatePlayer = function(engine, position){
		let animations = Utility.convertAnimationsFromConfig(PLAYER_CONFIG.animations);
		player = new Player(position.x, position.y, 10, 3, 3, 3, animations);
		engine.sendEvent(event_player_generated);
	}

	let generateEnemies = function(engine, depth){
		let animations = Utility.convertAnimationsFromConfig(PLAYER_CONFIG.animations);

		entities[depth] = [];
		let numEntities = depth + 7;

		while(numEntities > 0){
			let entityPosition = findValidEntitySquare(levels[depth].map.map);			
			entities[depth].push(new Mob(entityPosition.x, entityPosition.y, depth, 10, 10, 10, 10, 1, animations));
			numEntities--;
		}
	}

	let findValidEntitySquare = function(map){
		let validSquares = [];
		for(let i = 0; i < map.length; i++){
			for(let j = 0; j < map[0].length; j++){
				if(map[i][j] instanceof FloorSquare){
					let valid = true;
					let neighbors = Utility.getSquareNeighbors(i, j, map);
					for(let n of neighbors){
						if(n.physical.blocking){
							valid = false;
							break;
						}
					}
					if(valid) validSquares.push(map[i][j].position);
				}
			}
		}

		return random(validSquares);
	}

	let fixPlayerPosition = function(stair){
		player.position.x = stair.x;
		player.position.y = stair.y;
	}

	let updateEntities = function(engine){
		for(let e of entities[currentDepth]){
			engine.addObject(e);
		}
		engine.addObject(player);
	}

	this.addObject = function(object){
		if(object instanceof Level){ levels.push(object); }
		else{
			System.prototype.addObject.call(this, object);
		}
	}

	//MOB BEHAVIOR

	let getMobBehavior = function(mob, player){
		let map = levels[currentDepth].map.map;
		if(abs(mob.position.x - player.position.x) < CONFIG.PLAYER_VISION_RANGE && abs(mob.position.y - player.position.y) < CONFIG.PLAYER_VISION_RANGE){
			if(abs(mob.position.x - player.position.x) > 1 || abs(mob.position.y - player.position.y) > 1){
				let path = Utility.findMobPath(map, mob, player);
				if(path !== false){
					let dir = dirToSquare(map[mob.position.x][mob.position.y], path[1]);
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
