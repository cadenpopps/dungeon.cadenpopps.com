function SightLine(sx, sy, ex, ey) {

    const ERR = .5;

    this.startx = sx;
    this.starty = sy;
    this.endx = ex;
    this.endy = ey;
    this.straight = (sx == ex) || (sy == ey);
    this.touching = [];

    this.findTouching = function (board) {
        if (CHECK_CORNER_CASE && this.cornerCase(board)) {
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

    this.findStraightTouching = function (board) {
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

    this.cornerCase = function (board) {
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

    function blocking(square) {
        return (square.getSquareType() == WALL) || (square.getSquareType() == DOOR && !square.getOpen())
    }
}
