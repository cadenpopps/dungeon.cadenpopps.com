const ERR = .5;

function playerSight(board, x, y){
	let px = x;
	let py = y;
	board[px][py].visible = true;
	//board[px][py].discovered = true;
	for(let octant = 0; octant < 1; octant ++){
		playerSightTriangle(board, octant, px, py, CONFIG.PLAYER_VISION_RANGE);
	}
}

function playerSightTriangle(board, octant, sx, sy, range){
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
					cur.visible = true;
					//cur.discovered = true;
					if(!cur.blocking){
						// let above = getTranslatedSquare(board, octant, x, y+1, sx, sy);
						// if(above !== undefined && above.blocking){
						// 	//above.visible = true;
						// 	//above.discovered = true;
						// }
					}
					else{
						let firstBlocked = {x:x, y:y};
						let lastBlocked = getBlocked(board, octant, x, y, sx, sy, slopeEnd, cur);
						lastBlocked = {x:lastBlocked.x - sx, y: sy - lastBlocked.y};

						console.log(firstBlocked.x + "  " + firstBlocked.y + "       " + lastBlocked.x + "  "   + lastBlocked.y);

						tempslope = slope(lastBlocked.x, lastBlocked.y, TOP_LEFT);
						//let upLeftSquare = getTranslatedSquare(board, octant, x - 1, y + 1, sx, sy);
						if(firstBlocked.y == 0 && tempslope >= slopeEnd){
							slopeStart = 1;
						}
						else if(firstBlocked.y == 0){
							slopeStart = slope(lastBlocked.x, lastBlocked.y, TOP_LEFT); 
						}
						else if(lastBlocked.y == x || tempslope >= slopeEnd){
							slopeEnd = slope(firstBlocked.x, firstBlocked.y, BOTTOM_RIGHT);
						}
						else {
							let shadowStart = slope(firstBlocked.x, firstBlocked.y, BOTTOM_RIGHT);
							let shadowEnd = slope(lastBlocked.x, lastBlocked.y, TOP_LEFT);
							shadows.push([shadowStart, shadowEnd]);
						}
						break;
					}
				}
			}
			y++;
			curslope = slope(x, y, NONE); 
		}
		x++;
	}
}

const NONE = 0, TOP_LEFT = 1, BOTTOM_RIGHT = 2, UPPER_BOUND = 3, LOWER_BOUND = 4;
const PERM = .5;

function slope(x, y, CORNER){
	switch(CORNER){
		case NONE:
			return y/x;
		case TOP_LEFT:
			if(x == 0){
				return 2;
			}
			return (y + PERM)/(x - PERM);
		case BOTTOM_RIGHT:
			return (y - PERM)/(x + PERM);
			//case UPPER_BOUND:
			//	return (y + .2)/(x - .2);
			//case LOWER_BOUND:
			//	return (y - .2)/(x + .2);
	}
	return 1;
}

function checkInShadow(x, y, s1, s2){
	if(slope(x, y, NONE) > s1 && slope(x, y, NONE) <= s2) return true;
	return false;
}

function startSquare(x, slopeStart){
	if(slopeStart == 0) return 0;
	return ceil(x * slopeStart);
}

function getBlocked(board, octant, x, y, sx, sy, end, lastBlocked){
	let s = slope(x, y, TOP_LEFT);
	let nextBlocked = lastBlocked; 
	while(nextBlocked !== undefined && nextBlocked.blocking && s < end){
		lastBlocked = nextBlocked;
		lastBlocked.visible = true;
		//nextBlocked.discovered = true;

		leftSquare = getTranslatedSquare(board, octant, x - 1, y, sx, sy);
		if(leftSquare !== undefined && leftSquare.blocking) {
			lastBlocked = getBlocked(board, octant, x - 1, y, sx, sy, end, leftSquare); 
			break;
		}
		else{
			y++;
			s = slope(x, y, TOP_LEFT);
			nextBlocked = getTranslatedSquare(board, octant, x, y + 1, sx, sy);
		}
	}
	return lastBlocked;
}

function lineOfSight(board, sx, sy, ex, ey){
	let octant = getOctant(ex - sx, ey - sy);
	let tc = translateToZero(octant, ex - sx, ey - sy);
	let slope = abs(ey) / abs(ex);
	return !checkBlocked(board, sx, sy, tc[0], tc[1], slope, octant);
}

function checkBlocked(board, startx, starty, endx, endy, slope, octant){
	let x = 0;
	let y = 0;
	let e = 0;
	while (x <= endx) {
		if(getTranslatedSquare(board, octant, x, y, startx, starty).blocking) return true;
		e += slope;
		if(e > ERR && y < endy){
			y += 1;
			e -= 1;
			if(getTranslatedSquare(board, octant, x, y, startx, starty).blocking) return true;
		}
		x++;
	}			
	return false;
}

function SightLine(board, sx, sy, ex, ey) {
	this.startx = sx;
	this.starty = sy;
	this.octant = getOctant(ex-sx,ey-sy);
	this.translatedCoordinates = translateToZero(this.octant, ex - sx, ey - sy);
	this.endx = this.translatedCoordinates[0];
	this.endy = this.translatedCoordinates[1];
	this.slope = abs(this.endy) / abs(this.endx);
	this.squares = addSquares(board, this.startx, this.starty, this.endx, this.endy, this.slope, this.octant);
}

function addSquares(board, startx, starty, endx, endy, slope, octant){
	let blocked = false;
	let s = [];
	let x = 0;
	let y = 0;
	let e = 0;
	while (x <= endx && !blocked){
		let current = getTranslatedSquare(board, octant, x, y, startx, starty);
		if(current.blocking) blocked = true;
		s.push(current);	
		e += slope;
		if(e > ERR && y < endy){
			y += 1;
			e -= 1;
			let current = getTranslatedSquare(board, octant, x, y, startx, starty);
			if(current.blocking) blocked = true;
			s.push(current);	
		}
		x++;
	}			
	return s;
}

function getOctant(x, y){
	if(y>=0){
		if(x>=0){
			if(x>=y) return 0;
			else return 1;
		}
		else{
			if(abs(x) < y) return 2;
			else return 3;
		}
	}
	else{
		if(x<0){
			if(abs(x)>=abs(y)) return 4;
			else return 5;
		}
		else{
			if(x < abs(y)) return 6;
			else return 7;
		}
	}
}

function translateToZero(octant, x, y){
	switch (octant)	{
		case 0: return [x, y];
		case 1: return [y, x];
		case 2: return [y, x * -1];
		case 3: return [x * -1, y];
		case 4: return [x * -1, y * -1];
		case 5: return [y * -1, x * -1];
		case 6: return [y * -1, x];
		case 7: return [x, y * -1];
		default: console.log("Invalid octant: " + octant);
	}
}

const xxcomp = [ 1, 0, 0, -1, -1, 0, 0, 1 ];
const xycomp = [ 0, 1, -1, 0, 0, -1, 1, 0 ];
const yxcomp = [ 0, 1, 1, 0, 0, -1, -1, 0 ];
const yycomp = [ 1, 0, 0, 1, -1, 0, 0, -1 ];

function translate(octant, x, y){
	return[ x * xxcomp[octant] + y * xycomp[octant], x * yxcomp[octant] + y * yycomp[octant]];
}

function getTranslatedSquare(board, octant, x, y, sx, sy){
	let uc = translate(octant, x, y);
	let fx = sx + uc[0];
	let fy = sy - uc[1];
	if(fx >= 0 && fy >= 0 && fx < CONFIG.DUNGEON_SIZE && fy < CONFIG.DUNGEON_SIZE){
		return board[fx][fy];
	}
	return undefined;
}

SightLine.prototype.findTouching = function (board) {
	if (this.cornerCase(board)) {
		return;
	}
	var deltax = this.startx - this.endx;
	var deltay = this.starty - this.endy;
	var deltaerr = abs(deltay / deltax);
	var error = deltaerr - ERR;
	var j = this.starty;
	if (this.startx < this.endx) {
		for (var i = this.startx; i <= this.endx; i++) {
			this.touching.push(board[i][j]);
			error = error + deltaerr;
			if (error >= ERR) {
				if (this.starty < this.endy) {
					j = j + 1;
				}
				else {
					j = j - 1;
				}
				error = error - (ERR * 2);
			}
		}
	}
	else {
		for (var i = this.startx; i >= this.endx; i--) {
			this.touching.push(board[i][j]);
			error = error + deltaerr;
			if (error >= ERR) {
				if (this.starty < this.endy) {
					j = j + 1;
				}
				else {
					j = j - 1;
				}
				error = error - (ERR * 2);
			}
		}
	}

	deltax = this.startx - this.endx;
	deltay = this.starty - this.endy;
	deltaerr = abs(deltax / deltay);
	error = deltaerr - ERR;
	var a = this.startx;
	if (this.starty < this.endy) {
		for (var b = this.starty; b <= this.endy; b++) {
			this.touching.push(board[a][b]);
			error = error + deltaerr;
			if (error >= ERR) {
				if (this.startx < this.endx) {
					a = a + 1;
				}
				else {
					a = a - 1;
				}
				error = error - (ERR * 2);
			}
		}
	}
	else {
		for (var b = this.starty; b >= this.endy; b--) {
			this.touching.push(board[a][b]);
			error = error + deltaerr;
			if (error >= ERR) {
				if (this.startx < this.endx) {
					a = a + 1;
				}
				else {
					a = a - 1;
				}
				error = error - (ERR * 2);
			}
		}
	}
};

SightLine.prototype.findStraightTouching = function (board) {
	if (this.startx == this.endx) {
		if (this.starty < this.endy) {
			for (var i = this.starty; i <= this.endy; i++) {
				this.touching.push(board[this.startx][i]);
			}
		}
		else {
			for (var i = this.starty; i >= this.endy; i--) {
				this.touching.push(board[this.startx][i]);
			}
		}
	}
	else if (this.starty == this.endy) {
		if (this.startx < this.endx) {
			for (var i = this.startx; i <= this.endx; i++) {
				this.touching.push(board[i][this.starty]);
			}
		}
		else {
			for (var i = this.startx; i >= this.endx; i--) {
				this.touching.push(board[i][this.starty]);
			}
		}
	}
};

SightLine.prototype.cornerCase = function (board) {
	if (blocking(board[this.startx - 1][this.starty]) && blocking(board[this.startx][this.starty - 1]) && this.endx < this.startx && this.endy < this.starty) {
		return true;
	}
	if (blocking(board[this.startx - 1][this.starty]) && blocking(board[this.startx][this.starty + 1]) && this.endx < this.startx && this.endy > this.starty) {
		return true;
	}
	if (blocking(board[this.startx + 1][this.starty]) && blocking(board[this.startx][this.starty - 1]) && this.endx > this.startx && this.endy < this.starty) {
		return true;
	}
	if (blocking(board[this.startx + 1][this.starty]) && blocking(board[this.startx][this.starty + 1]) && this.endx > this.startx && this.endy > this.starty) {
		return true;
	}
}

function blocking(s) {
	// return (square.squareType == WALL) || (square.squareType == DOOR && !square.getOpen());
	return s.squareType == WALL;
}
