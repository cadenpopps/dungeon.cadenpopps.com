class EntitySystem extends System {

	constructor(player_data, entity_data) {
		super([component_actions]);

		this.playerData = player_data;
		this.entityData = entity_data;

		this.entities = [];
		this.levels = [];
		this.depth = 0;
		this.player = this.generatePlayer();
	}

	run(engine) {
		// for(let e of this.objects) {
		// 	if(e instanceof Mob) {
		// 	}
		// }
	}

	handleEvent(engine, eventID, data) {
		switch(eventID) {
			case event_new_game:
				engine.addObject(this.player);
				engine.sendEvent(event_player_generated);
				break;
			case event_up_level:
				this.depth--;
				break;
			case event_down_level:
				this.depth++;
				break;
			case event_level_loaded:
				if(this.player.depth.depth < this.depth) {
					this.fixPlayerPosition(this.player, this.levels[this.depth].stairUp, this.depth);
				}
				else if(this.player.depth.depth > this.depth) {
					this.fixPlayerPosition(this.player, this.levels[this.depth].stairDown, this.depth);
				}
				if(this.entities.length == this.depth) {
					this.generateEnemies(engine, this.entities, this.levels, this.entityData, this.entities.length);
				}
				this.updateEntities(engine);
				break;
			case event_spawn_enemy_close:
				this.generateEnemy(engine, this.player.position.x - randomInt(-4, 4), this.player.position.y - randomInt(2, 4), this.depth, this.entityData[random(Object.keys(this.entityData))]);
				break;
		}
	}

	addObject(object) {
		if(object instanceof Level) { this.levels[object.depth.depth] = object; }
		else {
			super.addObject(object);
		}
	}

	removeObject(object) {
		for(let level of this.entities) {
			if(level.includes(object)) {
				level.splice(level.indexOf(object), 1);
			}
		}
		super.removeObject(object);
	}

	generatePlayer() {
		let animations = Utility.convertAnimationsFromConfig(this.playerData.animations);
		let actions = Utility.convertActionsFromConfig(this.playerData.actions);
		let config = this.playerData;
		let playerClass = this.playerData.classes.warrior;
		return new Player(0, 0, config, playerClass, actions, animations);
	}

	generateEnemies(engine, entities, levels, entityData, depth) {
		let config, entityPosition;
		let numEntities = depth + 7;
		entities.push([]);

		while(numEntities > 0) {
			config = entityData[random(Object.keys(entityData))];
			entityPosition = this.findSafeSpawnLocation(config.size, entities[depth], levels[depth].map.map);
			if(entityPosition != undefined) {
				this.generateEnemy(engine, entityPosition.x, entityPosition.y, depth, config);
			}
			numEntities--;
		}
	}

	generateEnemy(engine, x, y, depth, config) {
		let animations = Utility.convertAnimationsFromConfig(config.animations);
		let actions = Utility.convertActionsFromConfig(config.actions);
		if(this.safeSpawnLocation(x, y, config.size, this.entities[depth], this.levels[depth].map.map)) {
			let mob = new Mob(x, y, depth, config, actions, animations);
			if(config.sprint_threshhold !== undefined) {
				mob.components.push(component_sprint);
				mob.sprint = new SprintComponent(config.sprint_threshhold);
			}
			this.entities[depth].push(mob);
			engine.addObject(mob);
			engine.sendEvent(event_entity_spawned, mob);
			return true;
		}
		return false;
	}

	findSafeSpawnLocation(size, entities, map) {
		let validSquares = [];
		for(let i = 0; i < map.length; i++) {
			for(let j = 0; j < map[0].length; j++) {
				if(this.safeSpawnLocation(i, j, size, entities, map)) {
					validSquares.push(map[i][j].position);
				}
			}
		}
		return random(validSquares);
	}

	safeSpawnLocation(x, y, size, entities, map) {
		for(let i = x; i < x + size; i++) {
			for(let j = y; j < y + size; j++) {
				if(map[i][j].physical.solid) {
					return false;
				}
			}
		}
		let col = new CollisionComponent(x, y, size);
		for(let e of entities) {
			if(Utility.collision(col, e.collision)) {
				return false;
			}
		}
		return true;
	}

	fixPlayerPosition(player, stair, depth) {
		MovementSystem.move(player, stair);
		player.depth.depth = depth;
	}

	updateEntities(engine) {
		for(let e of this.entities[this.depth]) {
			engine.addObject(e);
		}
		engine.addObject(this.player);
		engine.sendEvent(event_entities_loaded, 0, 1);
	}
}
