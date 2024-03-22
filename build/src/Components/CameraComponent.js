import { floor } from "../../lib/PoppsMath.js";
import { Component, CType } from "../Component.js";
export default class CameraComponent extends Component {
    x;
    y;
    z;
    velx;
    vely;
    accx;
    accy;
    zoom;
    visibleDistance;
    priority;
    constructor(x, y, z, zoom, priority) {
        super(CType.Camera);
        this.x = x;
        this.y = y;
        this.z = z;
        this.velx = 0;
        this.vely = 0;
        this.accx = 0;
        this.accy = 0;
        this.zoom = zoom;
        this.visibleDistance = floor(1500 / this.zoom);
        this.priority = priority;
    }
}
//# sourceMappingURL=CameraComponent.js.map