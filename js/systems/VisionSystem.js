
VisionSystem.prototype = Object.create(System.prototype);
function VisionSystem (){
	System.call(this);
	this.componentRequirements = [component_position, component_display];
	this.acceptedEvents = [event_game_start, event_player_moved];

	let player;
	let board;
	let needsUpdate = false;

	this.run = function(engine){
		if(needsUpdate){
			console.log("test");
			needsUpdate = false;
			player.display.visible = true;
			board[player.position.x][player.position.y].display.visible = true;
			board[player.position.x][player.position.y].display.discovered = true;
			for(let octant = 0; octant < 8; octant ++){
				playerSightTriangle(board, octant, player.position.x, player.position.y, CONFIG.PLAYER_VISION_RANGE);
			}
		}
	}

	this.handleEvent = function(e){
		if(this.acceptedEvents.includes(e.eventID)){
			needsUpdate = true;
		}
	}

	let playerSightTriangle = function(board, octant, sx, sy, range){
		let x = 1;
		let slopeStart = 0;
		let slopeEnd = 1;
		let shadows = [];

		while (x <= range && slopeStart < slopeEnd) {
			let y = startSquare(x, slopeStart);
			let curslope = slopeStart;
			while(curslope <= slopeEnd){
				let inShadow = false;
				for(let s of shadows){
					if(checkInShadow(x, y, s[0], s[1])){
						inShadow = true;
						break;
					}
				}
				if(!inShadow){
					let cur = getTranslatedSquare(board, octant, x, y, sx, sy); 
					if(cur === undefined){
						break;
					}
					else{
						cur.display.visible = true;
						cur.display.discovered = true;
						if(!cur.blocking){
							let above = getTranslatedSquare(board, octant, x, y + 1, sx, sy);
							if(above !== undefined){
								if(above.blocking){
									above.display.visible = true;
									above.display.discovered = true;
								}
								else if(!above.blocking){
									above.discovered = true;
								}
							}
							let below = getTranslatedSquare(board, octant, x, y - 1, sx, sy);
							if(below !== undefined){
								if(below.blocking){
									below.display.visible = true;
									below.display.discovered = true;
								}
								else if(!below.blocking){
									below.display.discovered = true;
								}
							}
						}
						else{
							let firstBlocked = {x:x, y:y};
							let lastBlocked = getBlocked(board, octant, x, y, sx, sy, slopeEnd, firstBlocked);

							if(firstBlocked.y == 0 && slope(lastBlocked.x, lastBlocked.y, TOP_LEFT) >= slopeEnd){
								slopeStart = 1;
							}
							else if(firstBlocked.y == 0){
								slopeStart = slope(lastBlocked.x, lastBlocked.y, TOP_LEFT); 
							}
							else if(lastBlocked.y == x || slope(lastBlocked.x, lastBlocked.y, TOP_LEFT) >= slopeEnd){
								slopeEnd = slope(firstBlocked.x, firstBlocked.y, BOTTOM_RIGHT);
							}
							else {
								let shadowStart = slope(firstBlocked.x, firstBlocked.y, BOTTOM_RIGHT);
								let shadowEnd = slope(lastBlocked.x, lastBlocked.y, TOP_LEFT);
								shadows.push([shadowStart, shadowEnd]);
							}
						}
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
				return (y - .5)/(x + .5);
			case UPPER_BOUND:
				return (y + PERM)/(x - PERM);
			case LOWER_BOUND:
				return (y - PERM)/(x + PERM);
		}
		return 1;
	}

	let getBlocked = function(board, octant, x, y, sx, sy, end, lastBlocked){
		let currentBlocked = getTranslatedSquare(board, octant, lastBlocked.x, lastBlocked.y, sx, sy); 
		currentBlocked.visible = true;
		currentBlocked.discovered = true;
		while(currentBlocked !== undefined && currentBlocked.blocking && slope(lastBlocked.x, lastBlocked.y, CENTER_SQUARE) < end){
			lastBlocked = {x:x, y:y};
			currentBlocked.visible = true;
			currentBlocked.discovered = true;
			leftSquare = getTranslatedSquare(board, octant, x - 1, y, sx, sy);
			if(leftSquare !== undefined && leftSquare.blocking) {
				lastBlocked = getBlocked(board, octant, x - 1, y, sx, sy, end, {x:x - 1, y:y}); 
				break;
			}
			else{
				y++;
				currentBlocked = getTranslatedSquare(board, octant, x, y, sx, sy);
			}
		}
		return lastBlocked;
	}

	let checkInShadow = function(x, y, s1, s2){
		if(slope(x, y, LOWER_BOUND) > s1 && slope(x, y, UPPER_BOUND) < s2) return true;
		return false;
	}

	let startSquare = function(x, slopeStart){
		if(slopeStart == 0) return 0;
		return ceil(x * slopeStart);
	}

	let getTranslatedSquare = function(board, octant, x, y, sx, sy){
		let uc = translate(octant, x, y);
		let fx = sx + uc[0];
		let fy = sy - uc[1];
		if(fx >= 0 && fy >= 0 && fx < CONFIG.DUNGEON_SIZE && fy < CONFIG.DUNGEON_SIZE){
			return board[fx][fy];
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

	this.updateObjects = function(object){
		if(object instanceof Player){
			player = object;
		}
		else if(object instanceof Level){
			board = object.board;
		}
		System.prototype.updateObjects.call(this, object);
	}

}
