function Dungeon() {

	this.numFloors = 1;
	this.currentFloorNum = 0;
	this.floors = [];
	var lastFloor;
	var floorFactory = new FloorFactory();

	this.floors.push(floorFactory.createFloor(createVector(floor(random(4, DUNGEON_SIZE - 4)), floor(random(4, DUNGEON_SIZE - 4))), 0));
	lastFloor = this.floors[0];
	this.currentFloor = this.floors[0];

	this.addFloor = function () {
		this.numFloors++;
		this.floors.push(floorFactory.createFloor(lastFloor.stairDown, this.numFloors));
		// while (gameManager.getPlayer().findPath(floors[floors.length - 1].b(floors[floors.length - 1].stairDown.x, floors[floors.length - 1].stairDown.y)) === false) {
		// 	floors[floors.length - 1] = floorFactory.createFloor(floors[floors.length - 2].stairDown, numFloors);
		// }
		lastFloor = this.floors[this.numFloors - 1]
	};

	this.update = function () {
		floors[currentFloorNum].update();
	}

	this.downFloor = function () {
		this.currentFloorNum++;
		if (this.currentFloorNum == this.floors.length) {
			this.addFloor();
		}
		this.currentFloor = this.floors[this.currentFloorNum];
	}
	this.upFloor = function () {
		this.currentFloorNum--;
		this.currentFloor = this.floors[this.currentFloorNum];
	}
}
