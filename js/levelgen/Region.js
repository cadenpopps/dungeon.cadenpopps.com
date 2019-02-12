function Region(room) {
    this.connected = false;
    this.rooms = [];
    this.addRoom(room);
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
