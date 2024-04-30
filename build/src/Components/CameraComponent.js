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
    minZoom;
    maxZoom;
    constructor(x, y, z, priority, zoom, minZoom, maxZoom) {
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
        this.zoom = floor(zoom / CameraSystem.CAMERA_ZOOM_SPEED) * CameraSystem.CAMERA_ZOOM_SPEED;
        this.visibleDistance = floor(CameraSystem.VISIBLE_DISTANCE_CONSTANT / this.zoom);
        this.priority = priority;
        this.minZoom = minZoom;
        this.maxZoom = maxZoom;
    }
}
//# sourceMappingURL=CameraComponent.js.map