import { abs, floor } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import CameraComponent from "../Components/CameraComponent.js";
import ControllerComponent from "../Components/ControllerComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import { EntityManager } from "../EntityManager.js";
import { EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class CameraSystem extends System {
    public static PRIORITY_CAMERA: CameraComponent;
    public static VISIBLE_DISTANCE_CONSTANT = 1280;
    public static CAMERA_ZOOM_SPEED = 16;
    private CAMERA_SPEED_DAMPER = 0.7;
    private CAMERA_ACCEL_DIVIDER = 25;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Camera, eventManager, entityManager, [CType.Camera]);
    }

    public logic(): void {
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

    private static setHighestPriorityCamera(cameraIds: Array<number>, entityManager: EntityManager): void {
        let priority = 0;
        let prioCam = entityManager.get<CameraComponent>(cameraIds[0], CType.Camera);
        for (let entityId of cameraIds) {
            const cam = entityManager.get<CameraComponent>(entityId, CType.Camera);
            if (cam.priority > priority) {
                priority = cam.priority;
                prioCam = cam;
            }
        }
        CameraSystem.PRIORITY_CAMERA = prioCam;
    }
    public static getHighestPriorityCamera(): CameraComponent {
        return CameraSystem.PRIORITY_CAMERA;
    }

    private moveCamera(entityId: number): void {
        const cam = this.entityManager.get<CameraComponent>(entityId, CType.Camera);
        const pos = this.entityManager.get<PositionComponent>(entityId, CType.Position);

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
        } else {
            cam.visualOffsetX = 0;
            cam.velx = 0;
            cam.accx = 0;
        }

        if (abs(cam.visualOffsetY) > 0.001) {
            cam.accy = -cam.visualOffsetY / this.CAMERA_ACCEL_DIVIDER;
            cam.vely += cam.accy;
            cam.visualOffsetY += cam.vely;
            cam.vely *= this.CAMERA_SPEED_DAMPER;
        } else {
            cam.visualOffsetY = 0;
            cam.vely = 0;
            cam.accy = 0;
        }
    }

    private zoomCamera(entityId: number): void {
        const cam = this.entityManager.get<CameraComponent>(entityId, CType.Camera);
        const con = this.entityManager.get<ControllerComponent>(entityId, CType.Controller);

        if (con.zoom_in) {
            if (cam.zoom >= cam.minZoom) {
                con.zoom_in = false;
                cam.zoom =
                    floor((cam.zoom - CameraSystem.CAMERA_ZOOM_SPEED) / CameraSystem.CAMERA_ZOOM_SPEED) *
                    CameraSystem.CAMERA_ZOOM_SPEED;
                cam.visibleDistance = floor(CameraSystem.VISIBLE_DISTANCE_CONSTANT / cam.zoom);
            }
        } else if (con.zoom_out) {
            if (cam.zoom <= cam.maxZoom) {
                con.zoom_out = false;
                cam.zoom =
                    floor((cam.zoom + CameraSystem.CAMERA_ZOOM_SPEED) / CameraSystem.CAMERA_ZOOM_SPEED) *
                    CameraSystem.CAMERA_ZOOM_SPEED;
                cam.visibleDistance = floor(CameraSystem.VISIBLE_DISTANCE_CONSTANT / cam.zoom);
            }
        }
    }
}
