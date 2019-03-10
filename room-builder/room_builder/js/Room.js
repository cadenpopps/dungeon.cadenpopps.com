function Room() {

	this.width = 10;
	this.height = 10;
	this.squares = new Array(this.width);
	for (var i = 0; i < this.width; i++) {
		this.squares[i] = new Array(this.height);
		for (var j = 0; j < this.height; j++) {
			this.squares[i][j] = new Square();
		}
	}

	this.resize = function(w, h) {
		if (w > h) {
			squareSize = (width / 3) / w;
		}
		else {
			squareSize = (height / 1.5) / h;
		}

		if (w < this.width) {
			this.squares.splice(this.squares.length, 1);
		}
		else if (w > this.width) {
			this.squares.push(new Array(this.height));
			for (var i = 0; i < this.height; i++) {
				this.squares[this.squares.length - 1][i] = new Square();
			}
		}
		else if (h < this.height) {
			for (let r of this.squares) {
				r.splice(r.length, 1);
			}
		}
		else if (h > this.height) {
			for (let r of this.squares) {
				r.push(new Square());
			}
		}

		this.width = w;
		this.height = h;

	};

	this.squaresToJSON = function() {
		var array = new Array(this.width);
		for (var i = 0; i < this.width; i++) {
			array[i] = new Array(this.height);
			for (var j = 0; j < this.height; j++) {
				array[i][j] = this.squares[i][j].type;
			}
		}

		return array;
	};

}
