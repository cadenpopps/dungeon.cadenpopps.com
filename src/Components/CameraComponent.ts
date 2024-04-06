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

    constructor(x: number, y: number, z: number, zoom: number, priority: number) {
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
