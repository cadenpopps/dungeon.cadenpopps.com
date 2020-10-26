class LightSystem extends GameSystem {

	constructor(config) {
		super([component_light_emitter]);
		this.config = config;
	}

	run(engine) { }

	handleEvent(engine, eventID, data) {
		switch (eventID) {
			case event_spawn_enemy_close:
				this.light(engine.getMap());
				break;
			case event_player_moved:
				setTimeout(function() {
					this.light(engine.getMap());
				}.bind(this), 50);
				break;
			case event_begin_level:
				this.light(engine.getMap());
				break;
		}
	}

	generateTorches(engine, level, rooms) {
		if(DO_LEVEL_GEN) {
			for(let room of rooms) {
				if(room.width >= 5 && room.height >= 5) {
					let torchChance = this.config.ROOM_TORCH_CHANCE;
					let fullWalls = [];
					while(random() < torchChance && fullWalls.length < 3) {
						let dir = randomInt(4);
						while(fullWalls.includes(dir)) {
							dir = randomInt(4);
						}
						fullWalls.push(dir);
						let x = 0, y = 0;
						switch(dir) {
							case direction_up:
								x = room.left + randomInt(2, room.width - 2);
								y = room.top;
								dir = direction_down;
								if(level[x][room.top - 1] instanceof DoorSquare) { continue; }
								break;
							case direction_right:
								x = room.right - 1;
								y = room.top + randomInt(2, room.height - 2);
								dir = direction_left;
								if(level[room.right][y] instanceof DoorSquare) { continue; }
								break;
							case direction_down:
								x = room.left + randomInt(2, room.width - 2);
								y = room.bottom - 1;
								dir = direction_up;
								if(level[x][room.bottom] instanceof DoorSquare) { continue; }
								break;
							case direction_left:
								x = room.left;
								y = room.top + randomInt(2, room.height - 2);
								dir = direction_right;
								if(level[room.left - 1][y] instanceof DoorSquare) { continue; }
								break;
						}

						engine.addObject(new Torch(x, y, dir, engine.getDepth()));
						torchChance -= this.config.CHANCE_ADDITIONAL_TORCH;
					}
				}
			}
		}
	}

	light(map) {
		for(let r of map) {
			for(let s of r) {
				s.light.level = 0;
			}
		}
		for(let l of this.objects) {
			this.setLightLevel(map[l.position.x][l.position.y], l.lightEmitter.level);
			for(let octant = 0; octant < 8; octant++) {
				this.lightTriangle(map, octant, l.position.x, l.position.y, l.lightEmitter.level);
			}
		}
	}

	setLightLevel(object, range, x, y) {
		let l = (x === undefined) ? range : range - x - floor(y * .4);
		if(object.light.level < l) {
			object.light.level = l;
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
					this.setLightLevel(cur, range, x, y);
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
				this.setLightLevel(currentBlocked, range, x, y);
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
				this.setLightLevel(currentBlocked, range, x, y);
			}

			y++;
			currentBlocked = VisionSystem.getTranslatedSquare(map, octant, x, y, sx, sy);
		}
		return lastBlocked;
	}
}
