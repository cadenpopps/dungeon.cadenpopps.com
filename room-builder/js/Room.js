function Room() {

	this.width = 9;
	this.height = 9;
	this.squares = new Array(this.width);
	for (let i = 0; i < this.width; i++) {
		this.squares[i] = new Array(this.height);
		for (let j = 0; j < this.height; j++) {
			this.squares[i][j] = new Square();
		}
	}

	this.decWidth = function(){
		if(this.width > 3){
			this.width -= 2;
			this.squares.splice(this.squares.length - 1, 1);
			this.resize();
		}
	}

	this.incWidth = function(){
		this.width += 2;
		this.squares.push(new Array(this.height));
		for (let i = 0; i < this.height; i++) {
			this.squares[this.squares.length - 1][i] = new Square();
		}
		this.squares.push(new Array(this.height));
		for (let i = 0; i < this.height; i++) {
			this.squares[this.squares.length - 1][i] = new Square();
		}
		this.resize();
	}

	this.decHeight = function(){
		if(this.height > 3){
			this.height -= 2;
			for (let r of this.squares) {
				r.splice(r.length, 2);
			}
			this.resize();
		}
	}

	this.incHeight = function(){
		this.height += 2;
		for (let r of this.squares) {
			r.push(new Square());
			r.push(new Square());
		}
		this.resize();
	}


	this.resize = function() {
		if (this.width > this.height) {
			squareSize = BOUNDING_SIZE / this.width;
		}
		else {
			squareSize = BOUNDING_SIZE / this.height;
		}
	};

	this.squaresToJSON = function() {

		let w = this.width + 2;
		let h = this.height + 2; 

		let squares = new Array(w);
		for (let i = 0; i < w; i++) {
			squares[i] = new Array(h);
			for (let j = 0; j < h; j++) {
				if(i == 0 || j == 0 || i == w - 1 || j == h - 1){
					if(i % 2 == 1 && j % 2 == 1){
						squares[i][j] = DOOR;
					}
					else{
						squares[i][j] = WALL;
					}
				}
				else{
					squares[i][j] = this.squares[i - 1][j - 1].type;
				}
			}
		}

		return squares;
	};

}
