class EntitySystem extends System {

	constructor(player_data, entity_data) {
		super([component_actions]);

		this.playerData = player_data;
		this.entityData = entity_data;

		this.entities = [];
		this.levels = [];
		this.depth = 0;
		this.player;
	}

	run(engine) {
		for(let e of this.objects) {
			if(e instanceof Mob) {
				// let action = getMobBehavior(e, player);
				// e.actions.nextAction = action;
			}
		}
	}

	handleEvent(engine, eventID, data) {
		switch(eventID) {
			case event_first_level_initiated:
				this.generatePlayer(engine, this.levels[0].stairUp);
				this.generateEnemies(engine, this.depth);
				break;
			case event_new_level:
				this.generateEnemies(engine, this.depth + 1);
				break;
			case event_up_level: 
				this.depth--;	
				this.updateEntities(engine);
				break;
			case event_down_level:
				this.depth++;
				this.updateEntities(engine);
				break;
			case event_spawn_enemy_close:
				let config = this.entityData[random(Object.keys(this.entityData))];
				this.generateEnemy(engine, this.player.position.x - randomInt(-4, 4), this.player.position.y - randomInt(2, 4), this.depth, config);
				break;
		}
	}

	addObject(object) {
		if(object instanceof Level) { this.levels.push(object); }
		else{ super.addObject(object); }
	}

	removeObject(object) {
		for(let level of this.entities) {
			if(level.includes(object)) {
				level.splice(level.indexOf(object), 1);
			}
		}
		super.removeObject(object);
	}

	generatePlayer(engine, position) {
		let animations = Utility.convertAnimationsFromConfig(this.playerData.animations);
		let actions = Utility.convertActionsFromConfig(this.playerData.actions);
		let config = this.playerData;
		let playerClass = this.playerData.classes.warrior;
		this.player = new Player(position.x, position.y, config, playerClass, actions, animations);
		engine.sendEvent(event_player_generated);
		engine.addObject(this.player);
	}

	generateEnemies(engine, depth) {
		let config = this.entityData[random(Object.keys(this.entityData))];

		this.entities[depth] = [];
		let numEntities = depth + 7;

		while(numEntities > 0) {
			let entityPosition = this.findSafeSpawnLocation(config.size, this.entities[depth], this.levels[depth].map.map);			
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

	updateEntities(engine) {
		for(let e of this.entities[this.depth]) {
			engine.addObject(e);
		}
		engine.addObject(this.player);
	}
}
