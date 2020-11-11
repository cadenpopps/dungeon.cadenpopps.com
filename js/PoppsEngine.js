class PoppsEngine {

	constructor(data) {

		const config = data.config;

		const room_pool = data.room_pool;
		const stair_room_pool = data.stair_room_pool;

		const images = data.images.textures;
		const ui = data.images.ui;

		const player_config = data.player_config;
		const enemy_config = data.enemy_config;
		const boss_config = data.boss_config;

		this.systems = [];
		this.LevelSystem = new LevelSystem(config.level, room_pool, stair_room_pool);
		this.EntitySystem = new EntitySystem(config.entities, player_config, enemy_config, boss_config);
		this.DisplaySystem = new DisplaySystem(config.display, images);
		this.CameraSystem = new CameraSystem(config.camera);
		// this.InputSystem = new InputSystem();
		// this.VisionSystem = new VisionSystem(config.vision);
		// this.LightSystem = new LightSystem(config.light);
		// this.ActionSystem = new ActionSystem();
		// this.MovementSystem = new MovementSystem();
		// this.AnimationSystem = new AnimationSystem(config.animation);
		// this.CombatSystem = new CombatSystem(config.combat);
		// this.HealthSystem = new HealthSystem(config.health);
		// this.AISystem = new AISystem(config.ai);
		// this.AbilitySystem = new AbilitySystem(config.abilities);
		// this.SprintSystem = new SprintSystem(config.sprint);

		this.systems.push(this.LevelSystem);
		this.systems.push(this.EntitySystem);
		this.systems.push(this.DisplaySystem);
		this.systems.push(this.CameraSystem);
		// this.systems.push(this.InputSystem);
		// this.systems.push(this.VisionSystem);
		// this.systems.push(this.LightSystem);
		// this.systems.push(this.ActionSystem);
		// this.systems.push(this.MovementSystem);
		// this.systems.push(this.AnimationSystem);
		// this.systems.push(this.CombatSystem);
		// this.systems.push(this.HealthSystem);
		// this.systems.push(this.AISystem);
		// this.systems.push(this.SprintSystem);
		// this.systems.push(this.AbilitySystem);

		this.UISystem = new UISystem(config.ui, data.images.ui);
		this.systems.push(this.UISystem);

		this.init();

		if(TITLE_SCREEN) {
			this.sendEvent(event_title_screen);
		}
		else {
			this.sendEvent(event_new_game);
		}
	}

	init() {

		Utility.debugLog("Initializing PoppsEngine");

		this.entities = {}
		this.events = [];
		this.depth = 0;

		this.UIOnly = false;
		this.FOCUSED = true;

		for(let system of this.systems) {
			system.init(this);
		}

		window.addEventListener('resize', this.sendEvent(event_window_resized));

		let self = this;
		window.addEventListener("focus", function () {
			self.tick();
		});
		window.addEventListener("blur", function () {
			window.cancelAnimationFrame(self.requestID);
		});

		this.tick();

	}

	pause() {
		this.UIOnly = true;
	}

	resume() {
		this.UIOnly = false;
	}

	tick() {
		if(this.UIOnly) {
			this.UISystem.run(this);
		}
		else{
			this.handleEvents(this.events);
			for(let s of this.systems) {
				s.run(this);
			}
		}
		this.requestID = window.requestAnimationFrame(() => this.tick());
	}

	sendEvent(e, data = undefined, ticks = 0) {
		if(ticks == 0) {
			this.runEvent([e, data]);
		}
		else {
			this.events.push([e, data, ticks]);
		}
	}

	handleEvents(events) {
		for(let i = events.length - 1; i >= 0; i--) {
			if(events[i][2] > 0) {
				events[i][2]--;
			}
			else {
				this.runEvent(events[i]);
				events.splice(i, 1);
			}
		}
	}

	runEvent(e) {
		Utility.debugLog(event_to_string[e[0]]);
		this.handleEvent(e[0], e[1]);
		for(let s of this.systems) {
			s.handleEvent(this, e[0], e[1]);
		}
	}

	handleEvent(event, data) {
		switch(event) {
			case event_new_game:
				this.clearEntities();
				this.sendEvent(event_new_player);
				this.sendEvent(event_new_level, {depth: this.depth});
				// this.sendEvent(generate_new_level, this.Dungeon.levels[this.depth]);
				// this.EntitySystem.generatePlayer(this);
				// this.LevelSystem.generateLevel(this, this.depth);
				// this.EntitySystem.generateEntities(this, this.Dungeon.levels[this.depth], this.depth);
				// this.LightSystem.generateTorches(this, this.Dungeon.levels[this.depth].map.map, this.Dungeon.levels[this.depth].rooms);
				// this.loadEntities(this.depth);
				// this.sendEvent(event_begin_level, this.Dungeon.levels[this.depth], LOADING_SCREEN_TIME);
				break;
			case event_level_generated:
				this.sendEvent(event_begin_level, {depth: this.depth}, LOADING_SCREEN_TIME);
				break;
			case event_reset_game:
				this.init();
				break;
			case event_game_over:
				this.pause();
				break;
			case event_down_level:
				this.depth++;
				if(this.depth == this.Dungeon.levels.length) {
					this.Dungeon.entities.push([]);
					this.LevelSystem.generateLevel(this, this.depth);
					this.EntitySystem.generateEntities(this, this.Dungeon.levels[this.depth], this.depth);
					this.LightSystem.generateTorches(this, this.Dungeon.levels[this.depth].map.map, this.Dungeon.levels[this.depth].rooms);
				}
				this.clearEntities();
				// this.loadEntities(this.depth);
				this.sendEvent(event_begin_level, this.Dungeon.levels[this.depth], LOADING_SCREEN_TIME);
				break;
			// case event_up_level:
			// 	this.depth--;
			// 	this.clearEntities();
			// 	// this.loadEntities(this.depth);
			// 	this.sendEvent(event_begin_level, this.Dungeon.levels[this.depth], LOADING_SCREEN_TIME);
			// 	break;
		}
	}

	createEntity(components) {
		this.addEntity(new GameEntity(this.getFreeID(), components));
	}

	getFreeID() {
		let ID = 1;
		while(ID in this.entities) {
			ID++;
		}
		return ID;
	}

	addEntity(entity) {

		this.entities[entity.ID] = entity.components;

		for(let s of this.systems) {
			s.addEntity(entity);
		}

		// if(object instanceof Player) {
		// 	this.Dungeon.player = object;
		// }
		// if(object instanceof Level) {
		// 	this.Dungeon.levels[this.depth] = object;
		// 	for (let i = 0; i < this.Dungeon.levels[this.depth].map.map.length; i++) {
		// 		for (let j = 0; j < this.Dungeon.levels[this.depth].map.map.length; j++) {
		// 			this.addObject(this.Dungeon.levels[this.depth].map.map[i][j]);
		// 		}
		// 	}
		// }
		// if(object instanceof Entity) {
		// 	if(!this.Dungeon.entities[this.depth].includes(object)) {
		// 		this.Dungeon.entities[this.depth].push(object);
		// 	}
		// }
	}

	// destroyEntity(entity) {
	// 	if(entity.ID in this.entities) {
	// 		delete this.entities[entity.ID];
	// 	}

	// 	for(let s of this.systems) {
	// 		s.destroyEntity(entity);
	// 	}
	// }

	destroyEntity(ID) {
		if(ID in this.entities) {
			delete this.entities[ID];
		}
		for(let s of this.systems) {
			s.destroyEntity(ID);
		}
	}

	clearEntities() {
		for(let ID in this.entities) {
			if(!Utility.entityHasDepth(this.entities[ID])) {
				this.destroyEntity(ID);
			}
		}
	}

	//LOCAL STORAGE vs SESSION STORAGE ??? for saving runs after page exit
	saveLevel() {

		let level_data = {};

		if(sessionStorage.length > 0) {
			level_data = JSON.parse(sessionStorage.LEVEL_DATA);
		}

		level_data[this.depth] = [];

		for(let entityID in this.entities) {
			if(!Utility.entityHasDepth(this.entities[entityID])) {
				level_data[this.depth].push(this.entities[entitiyID]);
			}
		}
	}

	loadLevel(levelDepth) {

		this.clearEntities();

		let level_data = {};
		if(sessionStorage.length > 0) {
			level_data = JSON.parse(sessionStorage.LEVEL_DATA);
		}
		else {
			alert("Error loading level, sessionStorage has no data");
		}

		for(let entityWithoutDepth of level_data[levelDepth]) {
			this.addEntity(entityWithoutDepth);
		}

		this.depth = levelDepth;
		this.sendEvent(event_level_loaded, this.depth);
	}

	// printEvent(e) {
	// 	for(key in window) {
	// 		if(e[0] == window[key] && key.includes('event_')) {
	// 			Utility.debugLog(key);
	// 		}
	// 	}
	// }
}
