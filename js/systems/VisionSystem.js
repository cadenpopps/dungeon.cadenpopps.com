class VisionSystem extends System {

	constructor(config) {
		super([]);

		this.player;
		this.map;
		this.entities = [];
		this.config = config;
	}

	run(engine) { }

	handleEvent(engine, eventID, data) {
		switch (eventID) {
			case event_start_game: case event_player_moved: case event_down_level: case event_up_level: case event_spawn_enemy_close:
				this.vision(this.map, this.player);
				break;
		}
	}

	addObject(object) {
		if(object instanceof Player) { this.player = object; }
		else if(object instanceof Level) { this.map = object.map.map }
		else if(object instanceof Mob) { this.entities.push(object); }
	}

	vision(map, player) {
		for(let r of map) {
			for(let s of r) {
				s.display.visible = false;
				if(s.display.discovered > 0) {s.display.discovered--};
				if(s.components.includes(component_light)) { s.light.lightLevel = 0; }
			}
		}
		player.display.visible = true;
		map[player.position.x][player.position.y].display.visible = true;
		map[player.position.x][player.position.y].display.discovered = this.config.DISCOVERED_MAX;
		map[player.position.x][player.position.y].light.lightLevel = light_range;
		for(let octant = 0; octant < 8; octant++) {
			this.playerSightTriangle(map, octant, player.position.x, player.position.y, this.config.PLAYER_VISION_RANGE);
			this.lightTriangle(map, octant, player.position.x, player.position.y, light_range);
		}
		for(let e of this.entities) {
			if(map[e.position.x][e.position.y].display.visible) { 
				e.display.visible = true;
				e.display.discovered = true;
			}
			else {
				e.display.visible = false;
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
				if(!this.inShadow(x, y, shadows)) {
					squaresVisible = true;
					let cur = this.getTranslatedSquare(map, octant, x, y, sx, sy); 
					if(cur === undefined) { break; }
					cur.light.lightLevel = range - x;
					if(cur.display.opaque) {
						let firstBlocked = this.getFirstBlockedLight(map, octant, x, y, sx, sy, shadows, range);
						let lastBlocked = this.getBlockedLight(map, octant, x, y, sx, sy, shadows, range);
						let shadowStart = this.slope(firstBlocked.x, firstBlocked.y, BOTTOM_RIGHT);
						let shadowEnd = this.slope(lastBlocked.x, lastBlocked.y, TOP_LEFT);
						shadows.push([shadowStart, shadowEnd]);
					}
					else{
						let above = this.getTranslatedSquare(map, octant, x, y + 1, sx, sy); 
						if(above !== undefined ) { 
							// above.display.discovered = this.config.DISCOVERED_MAX;
						}
					}
				}
				y++;
				curslope = this.slope(x, y, CENTER_SQUARE); 
			}
			x++;
		}
	}

	getFirstBlockedLight(map, octant, x, y, sx, sy, shadows, range) {
		let firstBlocked = {x:x, y:y};

		let currentBlocked = this.getTranslatedSquare(map, octant, x, y, sx, sy); 

		while(currentBlocked !== undefined && currentBlocked.display.opaque && this.slope(x, y, CENTER_SQUARE) > 0) {
			firstBlocked = {x:x, y:y};
			if(!this.inShadow(x, y, shadows)) {
				currentBlocked.light.lightLevel = range - x;
			}

			y--;
			currentBlocked = this.getTranslatedSquare(map, octant, x, y, sx, sy);
		}
		return firstBlocked;
	}

	getBlockedLight(map, octant, x, y, sx, sy, shadows, range) {
		let lastBlocked = {x:x, y:y};

		let currentBlocked = this.getTranslatedSquare(map, octant, x, y, sx, sy); 

		while(currentBlocked !== undefined && currentBlocked.display.opaque && this.slope(x, y, BOTTOM_RIGHT) < 1) {
			lastBlocked = {x:x, y:y};
			if(!this.inShadow(x, y, shadows)) {
				currentBlocked.light.lightLevel = range - x;
			}

			y++;
			currentBlocked = this.getTranslatedSquare(map, octant, x, y, sx, sy);
		}
		return lastBlocked;
	}

	playerSightTriangle(map, octant, sx, sy, range) {
		let x = 1;
		let shadows = [];
		let squaresVisible = true;

		while (x <= range && squaresVisible) {
			squaresVisible = false;
			let y = 0;
			let curslope = 0;
			while(curslope <= 1) {
				if(!this.inShadow(x, y, shadows)) {
					squaresVisible = true;
					let cur = this.getTranslatedSquare(map, octant, x, y, sx, sy); 
					if(cur === undefined) { break; }
					cur.display.visible = true;
					cur.display.discovered = this.config.DISCOVERED_MAX;
					if(cur.display.opaque) {
						let firstBlocked = this.getFirstBlocked(map, octant, x, y, sx, sy, shadows);
						let lastBlocked = this.getBlocked(map, octant, x, y, sx, sy, shadows);
						let shadowStart = this.slope(firstBlocked.x, firstBlocked.y, BOTTOM_RIGHT);
						let shadowEnd = this.slope(lastBlocked.x, lastBlocked.y, TOP_LEFT);
						shadows.push([shadowStart, shadowEnd]);
					}
					else{
						let above = this.getTranslatedSquare(map, octant, x, y + 1, sx, sy); 
						if(above !== undefined ) { above.display.discovered = this.config.DISCOVERED_MAX; }
					}
				}
				y++;
				curslope = this.slope(x, y, CENTER_SQUARE); 
			}
			x++;
		}
	}

	slope(x, y, CORNER) {
		switch(CORNER) {
			case CENTER_SQUARE:
				return y/x;
			case TOP_LEFT:
				if(x == 0) {
					return 1;
				}
				return (y + .5)/(x - .5);
			case BOTTOM_RIGHT:
				return max(0, (y - .5)/(x + .5));
			case UPPER_BOUND:
				return (y + PERM)/(x - PERM);
			case LOWER_BOUND:
				return (y - PERM)/(x + PERM);
		}
		return 1;
	}

	getFirstBlocked(map, octant, x, y, sx, sy, shadows) {
		let firstBlocked = {x:x, y:y};

		let currentBlocked = this.getTranslatedSquare(map, octant, x, y, sx, sy); 

		while(currentBlocked !== undefined && currentBlocked.display.opaque && this.slope(x, y, CENTER_SQUARE) > 0) {
			firstBlocked = {x:x, y:y};
			if(!this.inShadow(x, y, shadows)) {
				currentBlocked.display.visible = true;
				currentBlocked.display.discovered = this.config.DISCOVERED_MAX;
			}

			y--;
			currentBlocked = this.getTranslatedSquare(map, octant, x, y, sx, sy);
		}
		return firstBlocked;
	}

	getBlocked(map, octant, x, y, sx, sy, shadows) {
		let lastBlocked = {x:x, y:y};

		let currentBlocked = this.getTranslatedSquare(map, octant, x, y, sx, sy); 

		while(currentBlocked !== undefined && currentBlocked.display.opaque && this.slope(x, y, BOTTOM_RIGHT) < 1) {
			lastBlocked = {x:x, y:y};
			if(!this.inShadow(x, y, shadows)) {
				currentBlocked.display.visible = true;
				currentBlocked.display.discovered = this.config.DISCOVERED_MAX;
			}

			y++;
			currentBlocked = this.getTranslatedSquare(map, octant, x, y, sx, sy);
		}
		return lastBlocked;
	}

	inShadow(x, y, shadows) {
		let BR = this.slope(x, y, BOTTOM_RIGHT), TL = this.slope(x, y, TOP_LEFT);
		for(let s of shadows) {
			if( BR >= s[0] && TL <= s[1]) return true;
			else if( BR >= s[0] && BR <= s[1] && TL >= s[1]) { BR = s[1]; }
			else if( BR <= s[0] && TL >= s[0] && TL <= s[1]) { TL = s[0]; }
		}
		return false;
	}

	startSquare(x, slopeStart) {
		if(slopeStart == 0) return 0; 
		return ceil(x * slopeStart);
	}

	getTranslatedSquare(map, octant, x, y, sx, sy) {
		let uc = this.translate(octant, x, y);
		let fx = sx + uc[0];
		let fy = sy - uc[1];
		if(Utility.positionInBounds(fx, fy, map.length)) {
			return map[fx][fy];
		}
		return undefined;
	}

	translate(octant, x, y) {
		return[ x * xxcomp[octant] + y * xycomp[octant], x * yxcomp[octant] + y * yycomp[octant]];
	}

}
