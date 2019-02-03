function Region(squares) {
    this.connected = false;
    this.path = false;
    this.squares = squares;
    this.connectors = [];
    this.connect = function () {
        this.connected = true;
    }
}
