import { floor } from "../../lib/PoppsMath.js";
import { Component, ComponentType } from "../Component.js";

export default class CameraComponent extends Component {
    public x: number;
    public y: number;
    public z: number;
    public velx: number;
    public vely: number;
    public accx: number;
    public accy: number;
    public zoom: number;
    public visibleDistance: number;
    public priority: number;

    constructor(
        x: number,
        y: number,
        z: number,
        zoom: number,
        priority: number
    ) {
        super(ComponentType.Camera);
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
