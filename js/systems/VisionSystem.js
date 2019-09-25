VisionSystem.prototype = Object.create(System.prototype);
function VisionSystem (){
	System.call(this);
	this.componentRequirements = [component_position, component_physical, component_display];

	let player;
	let map;
	let entities = [];

	this.run = function(engine){ }

	this.addObject = function(object){
		if(object instanceof Player){ player = object; }
		else if(object instanceof Level){ map = object.map.map }
		else if(object instanceof Mob){ entities.push(object); }
	}

	this.handleEvent = function(engine, eventID){
		switch (eventID){
			case event_start_game: case event_player_moved: case event_down_level: case event_up_level:
				vision(map, player);
				break;
		}
	}

	let vision = function(map, player){
		for(let r of map){
			for(let s of r){
				s.display.visible = false;
				if(s.display.discovered > 0){s.display.discovered--};
				if(s.components.includes(component_light)){ s.light.lightLevel = 0; }
			}
		}
		player.display.visible = true;
		map[player.position.x][player.position.y].display.visible = true;
		map[player.position.x][player.position.y].display.discovered = CONFIG.DISCOVERED_MAX;
		map[player.position.x][player.position.y].light.lightLevel = light_max;
		for(let octant = 0; octant < 8; octant++){
			playerSightTriangle(map, octant, player.position.x, player.position.y, CONFIG.PLAYER_VISION_RANGE);
		}
		for(let octant = 0; octant < 8; octant++){
			lightTriangle(map, octant, player.position.x, player.position.y, light_max);
		}
		for(let e of entities){
			if(map[e.position.x][e.position.y].display.visible){ e.display.visible = true; }
		}
	}



	let lightTriangle = function(map, octant, sx, sy, range){
		let x = 1;
		let shadows = [];
		let squaresVisible = true;

		while (x <= range && squaresVisible) {
			squaresVisible = false;
			let y = 0;
			let curslope = 0;
			while(curslope <= 1){
				if(!inShadow(x, y, shadows)){
					squaresVisible = true;
					let cur = getTranslatedSquare(map, octant, x, y, sx, sy); 
					if(cur === undefined){ break; }
					cur.light.lightLevel = range - x;
					if(cur.physical.blocking){
						let firstBlocked = getFirstBlockedLight(map, octant, x, y, sx, sy, shadows, range);
						let lastBlocked = getBlockedLight(map, octant, x, y, sx, sy, shadows, range);
						let shadowStart = slope(firstBlocked.x, firstBlocked.y, BOTTOM_RIGHT);
						let shadowEnd = slope(lastBlocked.x, lastBlocked.y, TOP_LEFT);
						shadows.push([shadowStart, shadowEnd]);
					}
					else{
						let above = getTranslatedSquare(map, octant, x, y + 1, sx, sy); 
						if(above !== undefined ){ 
							// above.display.discovered = CONFIG.DISCOVERED_MAX;
						}
					}
				}
				y++;
				curslope = slope(x, y, CENTER_SQUARE); 
			}
			x++;
		}
	}

	let getFirstBlockedLight = function(map, octant, x, y, sx, sy, shadows, range){
		let firstBlocked = {x:x, y:y};

		let currentBlocked = getTranslatedSquare(map, octant, x, y, sx, sy); 

		while(currentBlocked !== undefined && currentBlocked.physical.blocking && slope(x, y, CENTER_SQUARE) > 0){
			firstBlocked = {x:x, y:y};
			if(!inShadow(x, y, shadows)){
				currentBlocked.light.lightLevel = range - x;
			}

			y--;
			currentBlocked = getTranslatedSquare(map, octant, x, y, sx, sy);
		}
		return firstBlocked;
	}

	let getBlockedLight = function(map, octant, x, y, sx, sy, shadows, range){
		let lastBlocked = {x:x, y:y};

		let currentBlocked = getTranslatedSquare(map, octant, x, y, sx, sy); 

		while(currentBlocked !== undefined && currentBlocked.physical.blocking && slope(x, y, BOTTOM_RIGHT) < 1){
			lastBlocked = {x:x, y:y};
			if(!inShadow(x, y, shadows)){
				currentBlocked.light.lightLevel = range - x;
			}

			y++;
			currentBlocked = getTranslatedSquare(map, octant, x, y, sx, sy);
		}
		return lastBlocked;
	}

	let playerSightTriangle = function(map, octant, sx, sy, range){
		let x = 1;
		let shadows = [];
		let squaresVisible = true;

		while (x <= range && squaresVisible) {
			squaresVisible = false;
			let y = 0;
			let curslope = 0;
			while(curslope <= 1){
				if(!inShadow(x, y, shadows)){
					squaresVisible = true;
					let cur = getTranslatedSquare(map, octant, x, y, sx, sy); 
					if(cur === undefined){ break; }
					cur.display.visible = true;
					cur.display.discovered = CONFIG.DISCOVERED_MAX;
					if(cur.physical.blocking){
						let firstBlocked = getFirstBlocked(map, octant, x, y, sx, sy, shadows);
						let lastBlocked = getBlocked(map, octant, x, y, sx, sy, shadows);
						let shadowStart = slope(firstBlocked.x, firstBlocked.y, BOTTOM_RIGHT);
						let shadowEnd = slope(lastBlocked.x, lastBlocked.y, TOP_LEFT);
						shadows.push([shadowStart, shadowEnd]);
					}
					else{
						let above = getTranslatedSquare(map, octant, x, y + 1, sx, sy); 
						if(above !== undefined ){ above.display.discovered = CONFIG.DISCOVERED_MAX; }
					}
				}
				y++;
				curslope = slope(x, y, CENTER_SQUARE); 
			}
			x++;
		}
	}

	const CENTER_SQUARE = 0, TOP_LEFT = 1, BOTTOM_RIGHT = 2, UPPER_BOUND = 3, LOWER_BOUND = 4;
	const PERM = .5;

	let slope = function(x, y, CORNER){
		switch(CORNER){
			case CENTER_SQUARE:
				return y/x;
			case TOP_LEFT:
				if(x == 0){
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

	let getFirstBlocked = function(map, octant, x, y, sx, sy, shadows){
		let firstBlocked = {x:x, y:y};

		let currentBlocked = getTranslatedSquare(map, octant, x, y, sx, sy); 

		while(currentBlocked !== undefined && currentBlocked.physical.blocking && slope(x, y, CENTER_SQUARE) > 0){
			firstBlocked = {x:x, y:y};
			if(!inShadow(x, y, shadows)){
				currentBlocked.display.visible = true;
				currentBlocked.display.discovered = CONFIG.DISCOVERED_MAX;
			}

			y--;
			currentBlocked = getTranslatedSquare(map, octant, x, y, sx, sy);
		}
		return firstBlocked;
	}

	let getBlocked = function(map, octant, x, y, sx, sy, shadows){
		let lastBlocked = {x:x, y:y};

		let currentBlocked = getTranslatedSquare(map, octant, x, y, sx, sy); 

		while(currentBlocked !== undefined && currentBlocked.physical.blocking && slope(x, y, BOTTOM_RIGHT) < 1){
			lastBlocked = {x:x, y:y};
			if(!inShadow(x, y, shadows)){
				currentBlocked.display.visible = true;
				currentBlocked.display.discovered = CONFIG.DISCOVERED_MAX;
			}

			y++;
			currentBlocked = getTranslatedSquare(map, octant, x, y, sx, sy);
		}
		return lastBlocked;
	}

	let inShadow = function(x, y, shadows){
		let BR = slope(x, y, BOTTOM_RIGHT), TL = slope(x, y, TOP_LEFT);
		for(let s of shadows){
			if( BR >= s[0] && TL <= s[1]) return true;
			else if( BR >= s[0] && BR <= s[1] && TL >= s[1]) { BR = s[1]; }
			else if( BR <= s[0] && TL >= s[0] && TL <= s[1]) { TL = s[0]; }
		}
		return false;
	}

	let startSquare = function(x, slopeStart){
		if(slopeStart == 0) return 0; 
		return ceil(x * slopeStart);
	}

	let getTranslatedSquare = function(map, octant, x, y, sx, sy){
		let uc = translate(octant, x, y);
		let fx = sx + uc[0];
		let fy = sy - uc[1];
		if(Utility.positionInBounds(fx, fy)){
			return map[fx][fy];
		}
		return undefined;
	}

	const xxcomp = [ 1, 0, 0, -1, -1, 0, 0, 1 ];
	const xycomp = [ 0, 1, -1, 0, 0, -1, 1, 0 ];
	const yxcomp = [ 0, 1, 1, 0, 0, -1, -1, 0 ];
	const yycomp = [ 1, 0, 0, 1, -1, 0, 0, -1 ];

	let translate = function(octant, x, y){
		return[ x * xxcomp[octant] + y * xycomp[octant], x * yxcomp[octant] + y * yycomp[octant]];
	}

}
