const ERR = .5;

function SightLine(board, sx, sy, ex, ey) {
	this.startx = min(sx, ex) + 1;
	this.starty = min(sy, ey);
	this.endx = max(sx, ex);
	this.endy = max(sy, ey);
	this.slope = abs(this.endy - this.starty) / abs(this.endx - this.startx);	
	this.squares = (function(board, startx, starty, endx, endy, slope){
		let s = [];
		let x = startx;
		let y = starty;
		let e = 0;
		while (x <= endx){
			s.push(board[x][y]);
			e += slope;
			if(e > ERR && y > endy){
				y -= 1;
				e -= 1;
				s.push(board[x][y]);
			}
			x++;
		}			
		return s;
	}(board, this.startx, this.starty, this.endx, this.endy, this.slope));
}

function getOctant(x, y){
	if(x>0){
		if(y>0){
			if(x>=y) return 0;
			else if(y>x) return 7;
		}
	}
}

function trasnlate(octant, x, y){
	switch (octant)	{
		case 0: return new [x, y];
		case 1: return new [y, x];
		case 2: return new [y, x * -1];
		case 3: return new [x * -1, y];
		case 4: return new [x * -1, y * -1];
		case 5: return new [y * -1, x * -1];
		case 6: return new [y * -1, x];
		case 7: return new [x, y * -1];
		default: return [-1,-1];
	}
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
