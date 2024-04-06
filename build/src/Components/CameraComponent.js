import { floor } from "../../lib/PoppsMath.js";
import { Component, CType } from "../Component.js";
import CameraSystem from "../Systems/CameraSystem.js";
export default class CameraComponent extends Component {
    x;
    y;
    visualOffsetX;
    visualOffsetY;
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
        this.visualOffsetX = 0;
        this.visualOffsetY = 0;
        this.z = z;
        this.velx = 0;
        this.vely = 0;
        this.accx = 0;
        this.accy = 0;
        this.zoom = zoom;
        this.visibleDistance = floor(CameraSystem.VISIBLE_DISTANCE_CONSTANT / this.zoom);
        this.priority = priority;
    }
}
//# sourceMappingURL=CameraComponent.js.map