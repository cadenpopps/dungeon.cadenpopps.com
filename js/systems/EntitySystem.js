class EntitySystem extends System {

	constructor(config, player_data, entity_data, boss_data) {
		super([component_actions]);

		this.config = config;
		this.playerData = player_data;
		this.entityData = entity_data;
		this.bossData = boss_data;
	}

	handleEvent(engine, eventID, data) {
		switch(eventID) {
			case event_spawn_enemy_close:
				this.generateEnemy(engine, engine.getPlayer().position.x - randomInt(-4, 4), engine.getPlayer().position.y - randomInt(2, 4), engine.getDepth(), this.entityData[random(Object.keys(this.entityData))]);
				break;
		}
	}

	generatePlayer(engine) {
		let playerClass = class_warrior;
		let config = this.playerData[playerClass]
		let animations = Utility.convertAnimationsFromConfig(config.animations);
		engine.addObject(new Player(-1, -1, config, playerClass, config.actions, animations));
		engine.sendEvent(event_player_generated);
	}

	generateEntities(engine, level, depth) {
		let config, entityPosition;
		let numEntities = floor(depth / 3) + 10;
		let entities = [];

		while(numEntities > 0) {
			config = this.entityData[random(Object.keys(this.entityData))];
			entityPosition = this.findSafeSpawnLocation(config.size, entities[depth], engine.getPlayer(), level.map.map);
			if(entityPosition != undefined) {
				this.generateEnemy(engine, entityPosition.x, entityPosition.y, depth, config);
			}
			numEntities--;
		}
	}

	generateEnemy(engine, x, y, depth, config) {
		let animations = Utility.convertAnimationsFromConfig(config.animations);
		if(this.safeSpawnLocation(x, y, config.size, engine.getEntities(), engine.getMap())) {
			let mob = new Mob(x, y, depth, config, config.actions, animations);
			engine.addObject(mob);
		}
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
				if(map[i][j].components.includes(component_collision)) {
					return false;
				}
			}
		}
		let col = new CollisionComponent(x, y, size);
		if(entities !== undefined) {
			for(let e of entities) {
				if(Utility.collision(col, e.collision)) {
					return false;
				}
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

	updateEntities(engine) {
		// for(let e of this.entities[engine.getDepth()]) {
		// 	engine.addObject(e);
		// }
		// engine.sendEvent(event_entities_loaded, 0, 1);
	}
}
