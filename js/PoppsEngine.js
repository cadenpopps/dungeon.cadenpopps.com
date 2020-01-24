class PoppsEngine {

	constructor(data) {

		const config = data.config;

		const room_pool = data.room_pool;
		const stair_room_pool = data.stair_room_pool;

		const images = data.images.textures;
		const ui = data.images.ui;

		const player_data = data.player_data;
		const entity_data = data.entity_data;
		const boss_data = data.boss_data;

		this.systems = [];
		this.systems.push(new InputSystem());
		this.systems.push(new DisplaySystem(config.display, images));
		this.systems.push(new VisionSystem(config.vision));
		this.systems.push(new LightSystem(config.light));
		this.systems.push(new ActionSystem());
		this.systems.push(new MovementSystem());
		this.systems.push(new LevelSystem(config.level, room_pool, stair_room_pool));
		this.systems.push(new EntitySystem(config.entities, player_data, entity_data, boss_data));
		this.systems.push(new AnimationSystem(config.animation));
		this.systems.push(new CombatSystem());
		this.systems.push(new HealthSystem(config.health));
		this.systems.push(new AISystem(config.ai));
		this.systems.push(new SprintSystem());

		this.UISystem = new UISystem(config.ui, data.images.ui);
		this.systems.push(this.UISystem);

		this.init();
		window.requestAnimationFrame(() => this.tick());

		if(TITLE_SCREEN) {
			this.sendEvent(event_title_screen);
		}
		else {
			this.sendEvent(event_new_game);
		}
	}

	init() {
		this.clearObjects();
		this.UIOnly = true;
		this.events = [];

		this.DUNGEON = {
			depth: 0,
			player: undefined,
			map: undefined,
			levels: [],
			entities: []
		};

		for(let system of this.systems) {
			system.init(this);
		}

		window.addEventListener('resize', this.sendEvent(event_window_resized));
	}

	pause() {
		this.UIOnly = true;
	}

	resume() {
		this.UIOnly = false;
	}

	tick() {
		this.handleEvents(this.events);
		if(this.UIOnly) {
			this.UISystem.run(this);
		}
		else{
			for(let s of this.systems) {
				s.run(this);
			}
		}
		window.requestAnimationFrame(() => this.tick());
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
		if(DEBUG_MODE) {
			this.printEvent(e);
		}
		this.handleEvent(e[0], e[1]);
		for(let s of this.systems) {
			s.handleEvent(this, e[0], e[1]);
		}
	}

	handleEvent(event, data) {
		switch(event) {
			case event_new_game:
				this.resume();
				break;
			case event_reset_game:
				this.init();
				break;
			case event_game_over:
				this.pause();
				break;
			case event_down_level:
				this.DUNGEON.depth++;
				break;
			case event_up_level:
				this.DUNGEON.depth--;
				break;
			case event_new_level:
				this.DUNGEON.entities.push([]);
				break;
		}
	}

	addObject(object) {
		for(let s of this.systems) {
			s.addObject(object);
		}

		if(object instanceof Player) {
			this.DUNGEON.player = object;
		}

		if(object instanceof Level) {
			this.DUNGEON.levels[object.depth.depth] = object;
			this.DUNGEON.map = object.map.map;
		}

		if(object instanceof Entity) {
			if(!this.DUNGEON.entities[object.depth.depth].includes(object)) {
				this.DUNGEON.entities[object.depth.depth].push(object);
			}
		}
	}

	removeObject(object) {
		for(let s of this.systems) {
			s.removeObject(object);
		}

		if(object instanceof Mob) {
			if(this.DUNGEON.entities[object.depth.depth].includes(object)) {
				this.DUNGEON.entities[object.depth.depth].splice(this.DUNGEON.entities[object.depth.depth].indexOf(object), 1);
			}
		}
	}

	clearObjects() {
		for(let s of this.systems) {
			s.clearObjects();
		}
	}

	printEvent(e) {
		for(key in window) {
			if(e[0] == window[key] && key.includes('event_')) {
				console.log(key);
			}
		}
	}

	getDepth() {
		return this.DUNGEON.depth;
	}

	getPlayer() {
		return this.DUNGEON.player;
	}

	getMap() {
		return this.DUNGEON.map;
	}

	getLevel() {
		return this.DUNGEON.levels[this.DUNGEON.depth];
	}

	getEntities() {
		return this.DUNGEON.entities[this.DUNGEON.depth];
	}

}
