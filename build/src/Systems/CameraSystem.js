import { abs, floor } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import { System, SystemType } from "../System.js";
export default class CameraSystem extends System {
    constructor(eventManager, entityManager) {
        super(SystemType.Camera, eventManager, entityManager, [CType.Camera]);
        this.CAMERA_SPEED_DAMPER = 0.88;
        this.CAMERA_ACCEL_DIVIDER = 250;
    }
    logic() {
        for (let entityId of this.entities) {
            if (this.entityManager.getEntity(entityId).has(CType.Position)) {
                this.moveCamera(entityId);
            }
            if (this.entityManager.getEntity(entityId).has(CType.Controller)) {
                this.zoomCamera(entityId);
            }
        }
    }
    handleEvent(event) { }
    moveCamera(entityId) {
        const cam = this.entityManager.get(entityId, CType.Camera);
        const pos = this.entityManager.get(entityId, CType.Position);
        cam.z = pos.z;
        if (abs(cam.x - pos.x) > 0.01) {
            cam.accx = (pos.x - cam.x) / this.CAMERA_ACCEL_DIVIDER;
            cam.velx += cam.accx;
            cam.x += cam.velx;
            cam.velx *= this.CAMERA_SPEED_DAMPER;
        }
        else {
            cam.x = pos.x;
            cam.velx = 0;
            cam.accx = 0;
        }
        if (abs(cam.y - pos.y) > 0.01) {
            cam.accy = (pos.y - cam.y) / this.CAMERA_ACCEL_DIVIDER;
            cam.vely += cam.accy;
            cam.y += cam.vely;
            cam.vely *= this.CAMERA_SPEED_DAMPER;
        }
        else {
            cam.y = pos.y;
            cam.vely = 0;
            cam.accy = 0;
        }
    }
    zoomCamera(entityId) {
        const cam = this.entityManager.get(entityId, CType.Camera);
        const con = this.entityManager.get(entityId, CType.Controller);
        if (con.zoom_in) {
            if (cam.zoom >= 20) {
                con.zoom_in = false;
                cam.zoom -= 2;
                cam.visibleDistance = floor(1500 / cam.zoom);
            }
        }
        else if (con.zoom_out) {
            if (cam.zoom <= 120) {
                con.zoom_out = false;
                cam.zoom += 2;
                cam.visibleDistance = floor(1500 / cam.zoom);
            }
        }
    }
}
//# sourceMappingURL=CameraSystem.js.map