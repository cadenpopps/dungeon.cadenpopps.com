import { floor } from "../../lib/PoppsMath.js";
import { Component, CType } from "../Component.js";
import CameraSystem from "../Systems/CameraSystem.js";

export default class CameraComponent extends Component {
    public x: number;
    public y: number;
    public visualOffsetX: number;
    public visualOffsetY: number;
    public z: number;
    public velx: number;
    public vely: number;
    public accx: number;
    public accy: number;
    public zoom: number;
    public visibleDistance: number;
    public priority: number;
    public minZoom: number;
    public maxZoom: number;

    constructor(x: number, y: number, z: number, priority: number, zoom: number, minZoom: number, maxZoom: number) {
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
