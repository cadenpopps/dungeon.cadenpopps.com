function PoppsEngine(data) {

	const TICKRATE = floor(1000/60);
	// const TICKRATE = floor(1000/20);

	const CONFIG = data.config;
	const ROOM_POOL = data.room_pool;
	const STAIR_ROOM_POOL = data.stair_room_pool;
	const IMAGES = data.images;
	const PLAYER_DATA = data.player_data;
	const ENTITY_DATA = data.entity_data;

	// let music = data.music;
	// let sounds = data.sounds;

	this.systems = [];
	let tickInterval = undefined;

	this.init = function(){
		this.systems.push(new InputSystem());
		this.systems.push(new DisplaySystem(CONFIG.DISPLAY_SETTINGS, CONFIG.VISION_SETTINGS, IMAGES));
		this.systems.push(new VisionSystem(CONFIG.VISION_SETTINGS));
		this.systems.push(new ActionSystem());
		this.systems.push(new MovementSystem());
		this.systems.push(new LevelSystem(CONFIG.LEVEL_SETTINGS, ROOM_POOL, STAIR_ROOM_POOL));
		this.systems.push(new EntitySystem(PLAYER_DATA, ENTITY_DATA));
		this.systems.push(new AnimationSystem(CONFIG.ANIMATION_SETTINGS));
		this.systems.push(new CombatSystem());
		this.systems.push(new HealthSystem());
		this.systems.push(new AISystem());

		$(window).resize(this.sendEvent.bind(this, event_window_resized));

		this.sendEvent(event_new_game);
		this.sendEvent(event_start_game);

		tickInterval = setInterval(tick.bind(this), TICKRATE);
	};

	let tick = function(){
		for(let s of this.systems){
			s.run(this);
		}
	}

	this.sendEvent = function(e, data){
		if(e == event_game_over) {
			clearInterval(tickInterval);
		}
		for(let s of this.systems){
			s.handleEvent(this, e, data);
		}
	}

	this.addObject = function(object){
		for(let s of this.systems){
			s.addObject(object);
		}
	}

	this.removeObject = function(object){
		for(let s of this.systems){
			s.removeObject(object);
		}
	}

	this.clearObjects = function(){
		for(let s of this.systems){
			System.prototype.clearObjects.call(s);
		}
	}

	this.init();
}
