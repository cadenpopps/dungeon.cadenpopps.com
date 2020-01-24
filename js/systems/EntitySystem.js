class EntitySystem extends System {

	constructor(config, player_data, entity_data, boss_data) {
		super([component_actions]);

		this.config = config;
		this.playerData = player_data;
		this.entityData = entity_data;
		this.bossData = boss_data;
	}

	init(engine) {
		this.entities = [];
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
			case event_level_loaded:
				if(this.player.depth.depth <= engine.getDepth()) {
					this.fixPlayerPosition(this.player, engine.getLevel().stairUp, engine.getDepth());
				}
				else if(this.player.depth.depth > engine.getDepth()) {
					this.fixPlayerPosition(this.player, engine.getLevel().stairDown, engine.getDepth());
				}
				if(this.entities.length == engine.getDepth()) {
					this.generateEnemies(engine, this.entities, engine.getMap(), this.entityData, this.entities.length, this.player);
					// this.generateBosses(engine, this.entities, this.levels, this.bossData, this.entities.length, this.player);
				}
				this.updateEntities(engine);
				break;
			case event_spawn_enemy_close:
				this.generateEnemy(engine, this.player.position.x - randomInt(-4, 4), this.player.position.y - randomInt(2, 4), engine.getDepth(), this.entityData[random(Object.keys(this.entityData))]);
				break;
		}
	}

	addObject(object) {
		super.addObject(object);
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

	generateEnemies(engine, entities, map, entityData, depth, player) {
		let config, entityPosition;
		let numEntities = floor(depth / 3) + 10;
		entities.push([]);

		while(numEntities > 0) {
			config = entityData[random(Object.keys(entityData))];
			entityPosition = this.findSafeSpawnLocation(config.size, entities[depth], player, map);
			if(entityPosition != undefined) {
				this.generateEnemy(engine, entityPosition.x, entityPosition.y, depth, config);
			}
			numEntities--;
		}
	}

	generateEnemy(engine, x, y, depth, config) {
		let animations = Utility.convertAnimationsFromConfig(config.animations);
		let actions = Utility.convertActionsFromConfig(config.actions);
		if(this.safeSpawnLocation(x, y, config.size, this.entities[depth], engine.getMap())) {
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

	findSafeSpawnLocation(size, entities, player, map) {
		let validSquares = [];
		for(let i = 0; i < map.length; i++) {
			for(let j = 0; j < map[0].length; j++) {
				if((abs(player.position.x - i) + abs(player.position.y - j)) > this.config.SAFE_DISTANCE_FROM_PLAYER && this.safeSpawnLocation(i, j, size, entities, map)) {
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

	generateBosses(engine, entities, levels, bossData, depth, player) {
		let config, entityPosition;
		let numBosses = 1;
		entities.push([]);

		while(numBosses > 0) {
			config = bossData[random(Object.keys(bossData))];
			entityPosition = this.findSafeSpawnLocation(config.size, entities[depth], player, levels[depth].map.map);
			if(entityPosition != undefined) {
				this.generateEnemy(engine, entityPosition.x, entityPosition.y, depth, config);
			}
			numEntities--;
		}
	}

	fixPlayerPosition(player, stair, depth) {
		player.position.x = stair.x;
		player.position.y = stair.y;
		player.depth.depth = depth;
	}

	updateEntities(engine) {
		for(let e of this.entities[engine.getDepth()]) {
			engine.addObject(e);
		}
		// engine.addObject(this.player);
		engine.sendEvent(event_entities_loaded, 0, 1);

	}
}
