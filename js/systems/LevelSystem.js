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
			case event_new_level:
				let levelOrigin = this.generateLevel(engine, data.depth);
				engine.sendEvent(event_level_generated, {levelOrigin: levelOrigin}, 1);
				break;
		}
	}

	generateLevel(engine, depth) {
		let level = generateLevel(this.config, depth, this.roomPool, this.stairRoomPool);
		for(let row of level.squares) {
			for(let square of row) {
				engine.createEntity(square);
			}
		}
		return level.level_origin;
	}

}
