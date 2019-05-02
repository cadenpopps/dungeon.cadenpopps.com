function Region(room) {
    this.connectors = room.getConnectors();
}

Region.prototype.removeWorstConnectors = function (regions) {
	let best = this.connectors.slice(0,5);
	for(let i = 0; i < best.length; i++){
		best[i].dist = getConnectorDistance(best[i], this, regions);
	}
	for(let i = this.connectors.length - 1; i >=0; i--){
		let d = getConnectorDistance(this.connectors[i], this, regions);
		for(let j = 0; j < best.length; j++){
			if(d < best[j].dist){
				this.connectors[i].dist = d;
				best[j] = this.connectors[i];
				break;
			}
		}
	}

	this.connectors = best;
}

Region.prototype.addRoom = function (room) {
    room.region = this;
    if (!this.rooms.includes(room)) this.rooms.push(room);
}

Region.prototype.addRooms = function (rooms) {
    for (let r of rooms) {
        r.changeRegion(this);
        if (!this.rooms.includes(r)) this.rooms.push(r);
    }
}
