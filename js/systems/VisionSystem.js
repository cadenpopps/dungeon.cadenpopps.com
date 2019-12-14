class VisionSystem extends System {

	constructor(config) {
		super([component_display, component_position]);

		this.player;
		this.map;
		this.config = config;
	}

	run(engine) { }

	handleEvent(engine, eventID, data) {
		switch (eventID) {
			case event_player_moved: case event_begin_level: case event_spawn_enemy_close:
				this.vision(this.map, this.player);
				break;
		}
	}

	addObject(object) {
		if(object instanceof Player) { this.player = object; }
		else if(object instanceof Level) { this.map = object.map.map; }
		else if(!(object instanceof Square)) {
			super.addObject(object);
		}
	}

	vision(map, player) {
		for(let r of map) {
			for(let s of r) {
				s.display.visible = false;
			}
		}
		player.display.visible = true;
		map[player.position.x][player.position.y].display.visible = true;
		map[player.position.x][player.position.y].display.discovered = true;
		for(let octant = 0; octant < 8; octant++) {
			this.playerSightTriangle(map, octant, player.position.x, player.position.y, this.config.PLAYER_VISION_RANGE);
		}
		for(let e of this.objects) {
			if(map[e.position.x][e.position.y].display.visible) {
				e.display.visible = true;
				e.display.discovered = true;
			}
			else {
				e.display.visible = false;
			}
		}
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
				if(!VisionSystem.inShadow(x, y, shadows)) {
					squaresVisible = true;
					let cur = VisionSystem.getTranslatedSquare(map, octant, x, y, sx, sy);
					if(cur === undefined) { break; }
					cur.display.visible = true;
					cur.display.discovered = true;
					if(cur.display.opaque) {
						let firstBlocked = this.getFirstBlocked(map, octant, x, y, sx, sy, shadows);
						let lastBlocked = this.getBlocked(map, octant, x, y, sx, sy, shadows);
						let shadowStart = VisionSystem.slope(firstBlocked.x, firstBlocked.y, BOTTOM_RIGHT);
						let shadowEnd = VisionSystem.slope(lastBlocked.x, lastBlocked.y, TOP_LEFT);
						shadows.push([shadowStart, shadowEnd]);
					}
					else{
						let above = VisionSystem.getTranslatedSquare(map, octant, x, y + 1, sx, sy);
						if(above !== undefined ) { above.display.discovered = true; }
					}
				}
				y++;
				curslope = VisionSystem.slope(x, y, CENTER_SQUARE);
			}
			x++;
		}
	}

	getFirstBlocked(map, octant, x, y, sx, sy, shadows) {
		let firstBlocked = {x:x, y:y};

		let currentBlocked = VisionSystem.getTranslatedSquare(map, octant, x, y, sx, sy);

		while(currentBlocked !== undefined && currentBlocked.display.opaque && VisionSystem.slope(x, y, CENTER_SQUARE) > 0) {
			firstBlocked = {x:x, y:y};
			if(!VisionSystem.inShadow(x, y, shadows)) {
				currentBlocked.display.visible = true;
				currentBlocked.display.discovered = true;
			}

			y--;
			currentBlocked = VisionSystem.getTranslatedSquare(map, octant, x, y, sx, sy);
		}
		return firstBlocked;
	}

	getBlocked(map, octant, x, y, sx, sy, shadows) {
		let lastBlocked = {x:x, y:y};

		let currentBlocked = VisionSystem.getTranslatedSquare(map, octant, x, y, sx, sy);

		while(currentBlocked !== undefined && currentBlocked.display.opaque && VisionSystem.slope(x, y, BOTTOM_RIGHT) < 1) {
			lastBlocked = {x:x, y:y};
			if(!VisionSystem.inShadow(x, y, shadows)) {
				currentBlocked.display.visible = true;
				currentBlocked.display.discovered = true;
			}

			y++;
			currentBlocked = VisionSystem.getTranslatedSquare(map, octant, x, y, sx, sy);
		}
		return lastBlocked;
	}

	static slope(x, y, CORNER) {
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

	static inShadow(x, y, shadows) {
		let BR = VisionSystem.slope(x, y, BOTTOM_RIGHT), TL = VisionSystem.slope(x, y, TOP_LEFT);
		for(let s of shadows) {
			if( BR >= s[0] && TL <= s[1]) return true;
			else if( BR >= s[0] && BR <= s[1] && TL >= s[1]) { BR = s[1]; }
			else if( BR <= s[0] && TL >= s[0] && TL <= s[1]) { TL = s[0]; }
		}
		return false;
	}

	static startSquare(x, slopeStart) {
		if(slopeStart == 0) return 0;
		return ceil(x * slopeStart);
	}

	static getTranslatedSquare(map, octant, x, y, sx, sy) {
		let uc = VisionSystem.translate(octant, x, y);
		let fx = sx + uc[0];
		let fy = sy - uc[1];
		if(Utility.positionInBounds(fx, fy, map.length)) {
			return map[fx][fy];
		}
		return undefined;
	}

	static translate(octant, x, y) {
		return[ x * xxcomp[octant] + y * xycomp[octant], x * yxcomp[octant] + y * yycomp[octant]];
	}

	static sightLine(p1, p2, map) {
		let slope = VisionSystem.slope(p1.x - p2.x, p1.y - p2.y, CENTER);
		console.log(slope);
		return false;
	}
}
