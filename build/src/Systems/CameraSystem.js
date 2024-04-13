import { abs, floor } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import { System, SystemType } from "../System.js";
export default class CameraSystem extends System {
    static PRIORITY_CAMERA;
    static VISIBLE_DISTANCE_CONSTANT = 1280;
    CAMERA_MIN_ZOOM = 10;
    CAMERA_MAX_ZOOM = 200;
    CAMERA_SPEED_DAMPER = 0.7;
    CAMERA_ACCEL_DIVIDER = 25;
    constructor(eventManager, entityManager) {
        super(SystemType.Camera, eventManager, entityManager, [CType.Camera]);
    }
    logic() {
        CameraSystem.setHighestPriorityCamera(this.entities, this.entityManager);
        for (let entityId of this.entities) {
            if (this.entityManager.getEntity(entityId).has(CType.Position)) {
                this.moveCamera(entityId);
            }
            if (this.entityManager.getEntity(entityId).has(CType.Controller)) {
                this.zoomCamera(entityId);
            }
        }
    }
    static setHighestPriorityCamera(cameraIds, entityManager) {
        let priority = 0;
        let prioCam = entityManager.get(cameraIds[0], CType.Camera);
        for (let entityId of cameraIds) {
            const cam = entityManager.get(entityId, CType.Camera);
            if (cam.priority > priority) {
                priority = cam.priority;
                prioCam = cam;
            }
        }
        CameraSystem.PRIORITY_CAMERA = prioCam;
    }
    static getHighestPriorityCamera() {
        return CameraSystem.PRIORITY_CAMERA;
    }
    moveCamera(entityId) {
        const cam = this.entityManager.get(entityId, CType.Camera);
        const pos = this.entityManager.get(entityId, CType.Position);
        if (cam.x !== pos.x) {
            cam.visualOffsetX += cam.x - pos.x;
            cam.x = pos.x;
        }
        if (cam.y !== pos.y) {
            cam.visualOffsetY += cam.y - pos.y;
            cam.y = pos.y;
        }
        cam.z = pos.z;
        if (abs(cam.visualOffsetX) > 0.001) {
            cam.accx = -cam.visualOffsetX / this.CAMERA_ACCEL_DIVIDER;
            cam.velx += cam.accx;
            cam.visualOffsetX += cam.velx;
            cam.velx *= this.CAMERA_SPEED_DAMPER;
        }
        else {
            cam.visualOffsetX = 0;
            cam.velx = 0;
            cam.accx = 0;
        }
        if (abs(cam.visualOffsetY) > 0.001) {
            cam.accy = -cam.visualOffsetY / this.CAMERA_ACCEL_DIVIDER;
            cam.vely += cam.accy;
            cam.visualOffsetY += cam.vely;
            cam.vely *= this.CAMERA_SPEED_DAMPER;
        }
        else {
            cam.visualOffsetY = 0;
            cam.vely = 0;
            cam.accy = 0;
        }
    }
    zoomCamera(entityId) {
        const cam = this.entityManager.get(entityId, CType.Camera);
        const con = this.entityManager.get(entityId, CType.Controller);
        if (con.zoom_in) {
            if (cam.zoom >= this.CAMERA_MIN_ZOOM) {
                con.zoom_in = false;
                cam.zoom -= 2;
                cam.visibleDistance = floor(CameraSystem.VISIBLE_DISTANCE_CONSTANT / cam.zoom);
            }
        }
        else if (con.zoom_out) {
            if (cam.zoom <= this.CAMERA_MAX_ZOOM) {
                con.zoom_out = false;
                cam.zoom += 2;
                cam.visibleDistance = floor(CameraSystem.VISIBLE_DISTANCE_CONSTANT / cam.zoom);
            }
        }
    }
}
//# sourceMappingURL=CameraSystem.js.map