function Room(template, x, y) {

	/*
	 *
	 *   000T000   T = (3, 0)   W = 7
	 *   0000000   L = (0, 2)   H = 5
	 *   L00C000R  C = (3, 2)
	 *   0000000   R = (7, 2)
	 *   0000000   B = (3, 5)
	 *      B
	 *
	 */

	this.width = template.width; 
	this.height = template.height; 

	this.left = x - floor(this.width/2); //x coordinate of left most squares
	this.top = y - floor(this.height/2); //top most
	this.left += (this.left % 2) - 1;
	this.top += (this.top % 2) - 1;
	this.right = this.left + this.width; //x coord of first wall on right 
	this.bottom = this.top + this.height; //x coord of first wall on right 

	this.x = this.left + ceil(this.width/2);
	this.y = this.top + ceil(this.height/2);

	this.squares = template.squares.slice(0);
	this.doors = new Array(template.doors.length);

	for(let i = 0; i < this.doors.length; i++){
		this.doors[i] = [template.doors[i][0] + this.left, template.doors[i][1] + this.top];
	}
}
