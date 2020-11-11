class EntitySystem extends GameSystem {

	constructor(config, player_data, entity_data, boss_data) {
		super([component_actions]);

		this.config = config;
		this.playerData = player_data;
		this.entityData = entity_data;
		this.bossData = boss_data;
	}

	handleEvent(engine, eventID, data) {
		switch(eventID) {
			case event_new_player:
				this.generatePlayer(engine);
				break;
			case event_level_generated:
				for(let ID in this.entities) {
					if(component_controller in this.entities[ID]) {
						this.entities[ID][component_position].x = data.levelOrigin.x;
						this.entities[ID][component_position].y = data.levelOrigin.y;
					}
				}
				break;
			case event_spawn_enemy_close:
				this.generateEnemy(engine, engine.getPlayer().position.x - randomInt(-4, 4), engine.getPlayer().position.y - randomInt(2, 4), engine.getDepth(), this.entityData[random(Object.keys(this.entityData))]);
				break;
		}
	}

	generatePlayer(engine) {
		let playerClass = class_warrior;
		let config = this.playerData[playerClass];
		let animations = Utility.convertAnimationsFromConfig(config.animations);
		let player = PlayerTemplate(-1, -1, 0, 1, config.health, config.attackDamage, config.magicDamage, config.armor, config.abilities, animations);
		engine.createEntity(player);
		engine.sendEvent(event_player_generated, {}, 1);
	}

	generateEntities(engine, level, depth) {
		let config, entityPosition;
		let numEntities = floor(random(level.rooms.length * .75, level.rooms.length * 1.5));
		let entities = [];

		while(numEntities > 0) {
			config = this.entityData[random(Object.keys(this.entityData))];
			entityPosition = this.findSafeSpawnLocation(config.size, entities[depth], level.stairUp, level.map.map);
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
			engine.createEntity(mob);
		}
	}

	findSafeSpawnLocation(size, entities, stairUp, map) {
		let validSquares = [];
		for(let i = 0; i < map.length; i++) {
			for(let j = 0; j < map[0].length; j++) {
				if((abs(stairUp.x - i) + abs(stairUp.y - j)) > this.config.SAFE_DISTANCE_FROM_PLAYER && this.safeSpawnLocation(i, j, size, entities, map)) {
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
		// 	engine.createEntity(e);
		// }
		// engine.sendEvent(event_entities_loaded, 0, 1);
	}
}
