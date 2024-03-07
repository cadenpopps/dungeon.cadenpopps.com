import { abs, floor } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import CameraComponent from "../Components/CameraComponent.js";
import ControllerComponent from "../Components/ControllerComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import { EntityManager } from "../EntityManager.js";
import { Event, EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class CameraSystem extends System {
    private CAMERA_SPEED_DAMPER = 0.88;
    private CAMERA_ACCEL_DIVIDER = 250;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Camera, eventManager, entityManager, [CType.Camera]);
    }

    public logic(): void {
        for (let entityId of this.entities) {
            if (this.entityManager.getEntity(entityId).has(CType.Position)) {
                this.moveCamera(entityId);
            }
            if (this.entityManager.getEntity(entityId).has(CType.Controller)) {
                this.zoomCamera(entityId);
            }
        }
    }

    public handleEvent(event: Event): void {}

    private moveCamera(entityId: number): void {
        const cam = this.entityManager.get<CameraComponent>(
            entityId,
            CType.Camera
        );
        const pos = this.entityManager.get<PositionComponent>(
            entityId,
            CType.Position
        );

        cam.z = pos.z;
        if (abs(cam.x - pos.x) > 0.01) {
            cam.accx = (pos.x - cam.x) / this.CAMERA_ACCEL_DIVIDER;
            cam.velx += cam.accx;
            cam.x += cam.velx;
            cam.velx *= this.CAMERA_SPEED_DAMPER;
        } else {
            cam.x = pos.x;
            cam.velx = 0;
            cam.accx = 0;
        }

        if (abs(cam.y - pos.y) > 0.01) {
            cam.accy = (pos.y - cam.y) / this.CAMERA_ACCEL_DIVIDER;
            cam.vely += cam.accy;
            cam.y += cam.vely;
            cam.vely *= this.CAMERA_SPEED_DAMPER;
        } else {
            cam.y = pos.y;
            cam.vely = 0;
            cam.accy = 0;
        }
    }

    private zoomCamera(entityId: number): void {
        const cam = this.entityManager.get<CameraComponent>(
            entityId,
            CType.Camera
        );
        const con = this.entityManager.get<ControllerComponent>(
            entityId,
            CType.Controller
        );

        if (con.zoom_in) {
            if (cam.zoom >= 20) {
                con.zoom_in = false;
                cam.zoom -= 2;
                cam.visibleDistance = floor(1500 / cam.zoom);
            }
        } else if (con.zoom_out) {
            if (cam.zoom <= 120) {
                con.zoom_out = false;
                cam.zoom += 2;
                cam.visibleDistance = floor(1500 / cam.zoom);
            }
        }
    }
}
