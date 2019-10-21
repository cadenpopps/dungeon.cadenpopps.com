EntitySystem.prototype = Object.create(System.prototype);
function EntitySystem (PLAYER_DATA, ENTITY_DATA){
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
				// let action = getMobBehavior(e, player);
				// e.actions.nextAction = action;
			}
		}
	}

	this.handleEvent = function(engine, eventID, data){
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
		let animations = Utility.convertAnimationsFromConfig(PLAYER_DATA.animations);
		let actions = Utility.convertActionsFromConfig(PLAYER_DATA.actions);
		let config = PLAYER_DATA;
		let playerClass = PLAYER_DATA.classes.warrior;
		player = new Player(position.x, position.y, config, playerClass, actions, animations);
		engine.sendEvent(event_player_generated);
	}

	let generateEnemies = function(engine, depth){
		let animations = Utility.convertAnimationsFromConfig(ENTITY_DATA.skeleton.animations);
		let actions = Utility.convertActionsFromConfig(ENTITY_DATA.skeleton.actions);
		let config = ENTITY_DATA.skeleton;

		entities[depth] = [];
		let numEntities = depth + 7;

		//near player
		// entities[depth].push(new Mob(player.position.x - 2, player.position.y - 2, depth, config, actions, animations));

		while(numEntities > 0){
			let entityPosition = findValidEntitySquare(levels[depth].map.map);			
			entities[depth].push(new Mob(entityPosition.x, entityPosition.y, depth, config, actions, animations));
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


	//MOB BEHAVIOR

	let getMobBehavior = function(mob, player){
		let map = levels[currentDepth].map.map;
		if(abs(mob.position.x - player.position.x) < 20 && abs(mob.position.y - player.position.y) < 20){
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

	this.addObject = function(object){
		if(object instanceof Level){ levels.push(object); }
		else{
			System.prototype.addObject.call(this, object);
		}
	}

	this.removeObject = function(object){
		if(entities.includes(object)){
			entities.splice(entities.indexOf(object), 1);
		}
		System.prototype.removeObject.call(this, object);
	}
}
