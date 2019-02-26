const ERR = .5;

function playerSight(board, x, y){
	let px = x;
	let py = y;
	for(let octant = 0; octant < 1; octant ++){
		playerSightTriangle(board, octant, 0, 1, px, py, 0, 0, CONFIG.PLAYER_VISION_RANGE);
	}
}

function playerSightTriangle(board, octant, slopeStart, slopeEnd, sx, sy, offx, offy, range){
	let x = 0;
	while (x <= range) {
		let curslope = slopeStart;
		let y = ceil(x * curslope);
		while(curslope <= slopeEnd){
			let cur = getTranslatedSquare(board, octant, x, y, sx, sy); 
			if(cur === undefined){
				return;
			}
			else if(!cur.blocking){
				cur.visible = true;
			}
			else{
				let firstBlocked = [x,y];
				firstBlocked.visible = true;
				let nextBlocked = cur; 
				while(nextBlocked !== undefined && nextBlocked.blocking && curslope < slopeEnd){
					nextBlocked.visible = true;
					y++;
					curslope = slope(offx, offy, x, y);
					nextBlocked = getTranslatedSquare(board, octant, x, y, sx, sy);
				}

				if(nextBlocked !== undefined){ 
					//hits top
					if(firstBlocked[1] != 0 && (nextBlocked.blocking || curslope == slopeEnd)){
						nextBlocked.visible = true;
						// let newSlopeEnd = firstBlocked[1]/(firstBlocked[0] +1); 
						// playerSightTriangle(board, octant, newSlopeStart, newSlopeEnd, sx + x, sy, x, range - x);
						let newSlopeEnd = slope(offx, offy, firstBlocked[0] + 1, firstBlocked[1]); 
						playerSightTriangle(board, octant, slopeStart, newSlopeEnd, sx + x, sy, offx + x, offy, range - x);
					}

					//starts at bottom
					else if(firstBlocked[1] == 0 && curslope < slopeEnd){
						//let newSlopeStart = slope(offx, nextBlocked.x, nextBlocked.y); 
						//playerSightTriangle(board, octant, newSlopeStart, newSlopeEnd, sx + x, sy - y, x, range - x);
						let newSlopeStart = slope(offx, offy, nextBlocked.x, nextBlocked.y);
						playerSightTriangle(board, octant, newSlopeStart, slopeEnd, sx + x, sy - y, offx + x, offy + y, range - x);
					}
					else{
						////top
						//let newSlopeStart = slope(offx, offy, nextBlocked.x, nextBlocked.y);
						//playerSightTriangle(board, octant, newSlopeStart, slopeEnd, sx + x, sy - y, offx + x, offy + y, range - x);
						////bottom
						//let newSlopeEnd = slope(offx, offy, firstBlocked[0] + 1, firstBlocked[1]); 
						//playerSightTriangle(board, octant, slopeStart, newSlopeEnd, sx + x, sy, offx + x, offy, range - x);
					}

					//floats
				}
			}
			y++;
			curslope = slope(offx, offy, x, y); 
		}
		x++;
	}			
}

function slope(offx, offy, x, y){
	return constrainLow((offy + y)/(x + offx), 0);
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
