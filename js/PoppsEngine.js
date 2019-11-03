class PoppsEngine {

	constructor(data) {
		this.init(data);
	}

	init(data) {
		const config = data.config;
		const ROOM_POOL = data.room_pool;
		const STAIR_ROOM_POOL = data.stair_room_pool;
		const IMAGES = data.images;
		const PLAYER_DATA = data.player_data;
		const ENTITY_DATA = data.entity_data;

		this.running = false;

		this.events = [];

		this.systems = [];
		this.systems.push(new InputSystem());
		this.systems.push(new DisplaySystem(config.display, IMAGES));
		this.systems.push(new VisionSystem(config.vision));
		this.systems.push(new LightSystem(config.light));
		this.systems.push(new ActionSystem());
		this.systems.push(new MovementSystem());
		this.systems.push(new LevelSystem(config.level, ROOM_POOL, STAIR_ROOM_POOL));
		this.systems.push(new EntitySystem(PLAYER_DATA, ENTITY_DATA));
		this.systems.push(new AnimationSystem(config.animation));
		this.systems.push(new CombatSystem());
		this.systems.push(new HealthSystem(config.health));
		this.systems.push(new AISystem());
		this.systems.push(new SprintSystem());

		this.start();
	}

	tick() {
		if(this.running) {
			for(let s of this.systems) {
				s.run(this);
			}
		}
		this.handleEvents(this.events);
		window.requestAnimationFrame(this.tick.bind(this));
	}

	start() {
		window.addEventListener('resize', this.sendEvent(event_window_resized));
		this.sendEvent(event_new_game);
		this.sendEvent(event_begin_game, 0, 20);
		window.requestAnimationFrame(this.tick.bind(this));
	}

	sendEvent(e, data = undefined, ticks = 0) {
		if(e == event_game_over) {
			alert('Game Over');
		}
		else if(ticks == 0) {
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
		for(let s of this.systems) {
			s.handleEvent(this, e[0], e[1]);
		}
		this.handleEvent(e[0], e[1]);
	}

	handleEvent(e, data) {
		switch(e) {
			case event_begin_game:
				this.running = true;
				break;
		}
	}

	addObject(object) {
		for(let s of this.systems) {
			s.addObject(object);
		}
	}

	removeObject(object) {
		for(let s of this.systems) {
			s.removeObject(object);
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

}
