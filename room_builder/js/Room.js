function Room() {

	this.width = 9;
	this.height = 9;

	this.squares = new Array(this.width);

	for (var i = 0; i < this.width; i++) {
		this.squares[i] = new Array(this.height);
		for (var j = 0; j < this.height; j++) {
			this.squares[i][j] = new Square();
		}
	}

	this.doors = [];

	this.decrementWidth = function(){
		if(this.width > 3){
			this.width -= 2;
			this.squares.splice(this.width);
			this.resized();
		}
	}

	this.incrementWidth = function(){
		this.width += 2;
		this.squares.push(new Array(this.height));
		this.squares.push(new Array(this.height));
		for(let i = 0; i < this.height; i++){
			this.squares[this.width - 2][i] = new Square();
			this.squares[this.width - 1][i] = new Square();
		}
		this.resized();
	}

	this.decrementHeight = function(){
		if(this.height > 3){
			this.height -= 2;
			for(let i = 0; i < this.width; i++){
				this.squares[i].splice(this.height);
			}
			this.resized();
		}
	}

	this.incrementHeight = function(){
		this.height += 2;
		for(let i = 0; i < this.width; i++){
			this.squares[i][this.height - 2] = new Square();
			this.squares[i][this.height - 1] = new Square();
		}
		this.resized();
	}

	this.resized = function(){
		$('#width').text("Width: " + room.width);
		$('#height').text("Height: " + room.height);

		calcSquareSize();

		this.calculateDoors();
	}

	this.calculateDoors = function(){
		let middleWidth = floor(this.width / 2);
		let middleHeight = floor(this.height / 2);

		let widthOddOffset = 0;
		let heightOddOffset = 0;

		let doors = [];

		if(middleWidth % 2 == 0){
			if(this.squares[middleWidth][0].type == FLOOR){
				doors.push([middleWidth, -1]);
			}
			if(this.squares[middleWidth][this.height - 1].type == FLOOR){
				doors.push([middleWidth, this.height]);
			}
		}
		else{
			widthOddOffset = 1;
		}

		for(let i = 1 - widthOddOffset; i < ceil((middleWidth + 1) / 2); i++){
			let x1 = middleWidth - (i * 2) - widthOddOffset;
			let x2 = middleWidth + (i * 2) + widthOddOffset;

			if(this.squares[x1][0].type == FLOOR){
				doors.push([x1, -1]);
			}
			if(this.squares[x1][this.height - 1].type == FLOOR){
				doors.push([x1, this.height]);
			}
			if(this.squares[x2][0].type == FLOOR){
				doors.push([x2, -1]);
			}
			if(this.squares[x2][this.height - 1].type == FLOOR){
				doors.push([x2, this.height]);
			}
		}

		if(middleHeight % 2 == 0){
			if(this.squares[0][middleHeight].type == FLOOR){
				doors.push([-1, middleHeight]);
			}
			if(this.squares[this.width - 1][middleHeight].type == FLOOR){
				doors.push([this.width, middleHeight]);
			}
		}
		else{
			heightOddOffset = 1;
		}

		for(let i = 1 - heightOddOffset; i < ceil((middleHeight + 1) / 2); i++){
			let y1 = middleHeight - (i * 2) - heightOddOffset;
			let y2 = middleHeight + (i * 2) + heightOddOffset;

			if(this.squares[0][y1].type == FLOOR){
				doors.push([-1, y1]);
			}
			if(this.squares[this.width - 1][y1].type == FLOOR){
				doors.push([this.width, y1]);
			}
			if(this.squares[0][y2].type == FLOOR){
				doors.push([-1, y2]);
			}
			if(this.squares[this.width - 1][y2].type == FLOOR){
				doors.push([this.width, y2]);
			}
		}

		this.doors = doors;
	}

	this.resize = function(w, h) {
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
