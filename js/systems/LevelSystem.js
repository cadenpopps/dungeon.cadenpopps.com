class LevelSystem extends System {

	constructor(config, room_pool, stair_room_pool) {
		super([]);

		this.config = config;
		this.roomPool = room_pool;
		this.stairRoomPool = stair_room_pool;

		this.player;
		this.depth = 0;
		this.levels = [];
	}

	run(engine) { }

	handleEvent(engine, eventID, data) {
		switch(eventID) {
			case event_down_level:
				this.handleDownLevel(engine);
				break;
			case event_up_level:
				this.handleUpLevel(engine);
				break;
			case event_new_game:
				this.handleNewGame(engine);
				break;
			case event_entities_loaded:
				engine.sendEvent(event_begin_level, 0, 1);
				break;
		}
	}

	addObject(object) {
		if(object instanceof Player) {
			this.player = object;
		}
		super.addObject(object);
	}

	handleNewGame(engine) {
		this.newLevel(engine, 0);
		this.updateLevel(engine);
	}

	newLevel(engine, depth) {
		let level = generateLevel(this.config, depth, this.roomPool, this.stairRoomPool);
		this.levels.push(level);
		engine.sendEvent(event_new_level);
		// let t = new Torch(level.stairUp.x - 1, level.stairUp.y - 5, direction_down, 7)
		// engine.addObject(t);
		return level;
	}

	handleDownLevel(engine) {
		engine.clearObjects();
		this.depth++;
		if(this.depth == this.levels.length) {
			this.newLevel(engine, this.depth);
			this.updateLevel(engine);
		}
		else{
			this.updateLevel(engine);
		}
	}

	handleUpLevel(engine) {
		engine.clearObjects();
		if(this.depth > 0) {
			this.depth--;
			this.updateLevel(engine);
		}
	}

	updateLevel(engine) {
		let level = this.levels[this.depth];
		engine.addObject(level);
		for (var i = 0; i < this.levels[this.depth].map.map.length; i++) {
			for (let j = 0; j < this.levels[this.depth].map.map.length; j++) {
				engine.addObject(level.map.map[i][j]);
			}
		}
		for(let t of level.torches) {
			engine.addObject(t);
		}
		engine.sendEvent(event_level_loaded, 0, 1);
	}

}
