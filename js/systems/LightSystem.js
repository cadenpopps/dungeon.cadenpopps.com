class LightSystem extends System {

	constructor(config) {
		super([component_light]);

		this.player;
		this.map;
		this.depth = 0;
		this.emitters = [[]];
		this.config = config;
	}

	run(engine) { }

	handleEvent(engine, eventID, data) {
		switch (eventID) {
			case event_start_game: case event_player_moved: case event_down_level: case event_up_level: case event_spawn_enemy_close:
				this.light(this.map);
				break;
			case event_up_level:
				this.depth--;
				break;
			case event_down_level:
				this.depth++
				break;
			case event_new_level:
				this.emitters.push([]);
				break;
		}
	}

	addObject(object) {
		if(object instanceof Player) { this.player = object; }
		else if(object instanceof Level) { this.map = object.map.map }
		if(object.components.includes(component_light_emitter)) {
			this.emitters[this.depth].push(object);
		}
	}

	light(map) {
		for(let r of map) {
			for(let s of r) {
				s.light.lightLevel = 0; 
			}
		}
		for(let l of this.emitters[this.depth]) {
			map[l.position.x][l.position.y].light.lightLevel = l.lightEmitter.level;
			for(let octant = 0; octant < 8; octant++) {
				this.lightTriangle(map, octant, l.position.x, l.position.y, l.lightEmitter.level);
			}
		}
	}

	lightTriangle(map, octant, sx, sy, range) {
		let x = 1;
		let shadows = [];
		let squaresVisible = true;

		while (x <= range && squaresVisible) {
			squaresVisible = false;
			let y = 0;
			let curslope = 0;
			while(curslope <= 1) {
				if(!VisionSystem.inShadow(x, y, shadows)) {
					squaresVisible = true;
					let cur = VisionSystem.getTranslatedSquare(map, octant, x, y, sx, sy); 
					if(cur === undefined) { break; }
					cur.light.lightLevel = range - x;
					if(cur.display.opaque) {
						let firstBlocked = this.getFirstBlockedLight(map, octant, x, y, sx, sy, shadows, range);
						let lastBlocked = this.getBlockedLight(map, octant, x, y, sx, sy, shadows, range);
						let shadowStart = VisionSystem.slope(firstBlocked.x, firstBlocked.y, BOTTOM_RIGHT);
						let shadowEnd = VisionSystem.slope(lastBlocked.x, lastBlocked.y, TOP_LEFT);
						shadows.push([shadowStart, shadowEnd]);
					}
					else{
						let above = VisionSystem.getTranslatedSquare(map, octant, x, y + 1, sx, sy); 
						if(above !== undefined ) { 
							// above.display.discovered = this.config.DISCOVERED_MAX;
						}
					}
				}
				y++;
				curslope = VisionSystem.slope(x, y, CENTER_SQUARE); 
			}
			x++;
		}
	}

	getFirstBlockedLight(map, octant, x, y, sx, sy, shadows, range) {
		let firstBlocked = {x:x, y:y};

		let currentBlocked = VisionSystem.getTranslatedSquare(map, octant, x, y, sx, sy); 

		while(currentBlocked !== undefined && currentBlocked.display.opaque && VisionSystem.slope(x, y, CENTER_SQUARE) > 0) {
			firstBlocked = {x:x, y:y};
			if(!VisionSystem.inShadow(x, y, shadows)) {
				currentBlocked.light.lightLevel = range - x;
			}

			y--;
			currentBlocked = VisionSystem.getTranslatedSquare(map, octant, x, y, sx, sy);
		}
		return firstBlocked;
	}

	getBlockedLight(map, octant, x, y, sx, sy, shadows, range) {
		let lastBlocked = {x:x, y:y};

		let currentBlocked = VisionSystem.getTranslatedSquare(map, octant, x, y, sx, sy); 

		while(currentBlocked !== undefined && currentBlocked.display.opaque && VisionSystem.slope(x, y, BOTTOM_RIGHT) < 1) {
			lastBlocked = {x:x, y:y};
			if(!VisionSystem.inShadow(x, y, shadows)) {
				currentBlocked.light.lightLevel = range - x;
			}

			y++;
			currentBlocked = VisionSystem.getTranslatedSquare(map, octant, x, y, sx, sy);
		}
		return lastBlocked;
	}
}
