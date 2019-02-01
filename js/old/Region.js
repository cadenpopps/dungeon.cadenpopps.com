function Region(_children) {
    //makes a new region that is not connected, is not a path, and has an arraylist of childsquares
    this.connected = false;
    this.path = false;
    this.children = _children;
    this.connectors = [];
    //connects this region
    this.connect = function () {
        this.connected = true;
    }
}
