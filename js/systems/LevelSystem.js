class LevelSystem extends GameSystem {

	//HANDLE LEVEL EVENTS LIKE DOORS, CHESTS, STAIRS, INTERACTABLES

	constructor(config, room_pool, stair_room_pool) {
		super([]);
		this.config = config;
		this.roomPool = room_pool;
		this.stairRoomPool = stair_room_pool;
	}

	handleEvent(engine, eventID, data) {
		switch(eventID) {
			// case event_entities_loaded:
			// 	if(LOADING_SCREEN) {
			// 		engine.sendEvent(event_begin_level, this.levels[engine.getDepth()], 60);
			// 	}
			// 	else {
			// 		engine.sendEvent(event_begin_level, this.levels[engine.getDepth()], 1);
			// 	}
			// 	break;
		}
	}

	generateLevel(engine, depth) {
		let level = generateLevel(this.config, depth, this.roomPool, this.stairRoomPool);
		engine.addObject(level);
		return level;
	}

}
