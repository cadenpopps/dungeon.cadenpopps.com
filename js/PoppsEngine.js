class PoppsEngine {

	constructor(data) {
		// const TICKRATE = floor(1000/60);
		this.init(data);
	}

	init(data) {
		const config = data.config;
		const ROOM_POOL = data.room_pool;
		const STAIR_ROOM_POOL = data.stair_room_pool;
		const IMAGES = data.images;
		const PLAYER_DATA = data.player_data;
		const ENTITY_DATA = data.entity_data;

		this.systems = [];
		let tickInterval = undefined;
		this.systems.push(new InputSystem());
		this.systems.push(new DisplaySystem(config.display, IMAGES));
		this.systems.push(new VisionSystem(config.vision));
		this.systems.push(new ActionSystem());
		this.systems.push(new MovementSystem());
		this.systems.push(new LevelSystem(config.level, ROOM_POOL, STAIR_ROOM_POOL));
		this.systems.push(new EntitySystem(PLAYER_DATA, ENTITY_DATA));
		this.systems.push(new AnimationSystem(config.animation));
		this.systems.push(new CombatSystem());
		this.systems.push(new HealthSystem(config.health));
		this.systems.push(new AISystem());
		this.systems.push(new SprintSystem());

		// $(window).resize(this.sendEvent.bind(this, event_window_resized));

		this.sendEvent(event_new_game);
		this.sendEvent(event_start_game);

		window.requestAnimationFrame(this.tick.bind(this));
	};

	tick() {
		for(let s of this.systems) {
			s.run(this);
		}
		window.requestAnimationFrame(this.tick.bind(this));
	}

	sendEvent(e, data) {
		if(e == event_game_over) {
			clearInterval(tickInterval);
		}
		for(let s of this.systems) {
			s.handleEvent(this, e, data);
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
}
