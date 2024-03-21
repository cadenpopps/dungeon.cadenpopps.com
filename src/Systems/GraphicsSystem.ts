import PoppsCanvas from "../../lib/PoppsCanvas.js";
import { distance, floor } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import CameraComponent from "../Components/CameraComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import VisibleComponent from "../Components/VisibleComponent.js";
import { EntityManager } from "../EntityManager.js";
import { Event, EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class GraphicsSystem extends System {
    private canvas: PoppsCanvas;
    private layers: Array<Array<number>>;
    private masterCamera: CameraComponent;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Graphics, eventManager, entityManager, [CType.Position, CType.Visible]);
        this.canvas = new PoppsCanvas();
        this.masterCamera = new CameraComponent(0, 0, 0, 0, 0);
        this.layers = Array<Array<number>>();
        this.canvas.loop(this.canvasCallback.bind(this));
    }

    public handleEvent(event: Event): void {
        switch (event) {
            case Event.entity_created:
            case Event.entity_modified:
            case Event.entity_destroyed:
                this.adjustCamera();
                this.groupEntitiesByLayer();
                break;
            case Event.level_loaded:
                this.adjustCamera();
                this.groupEntitiesByLayer();
                break;
        }
    }

    private canvasCallback(): void {
        this.canvas.background(0, 0, 0);
        this.adjustCamera();
        this.canvas.canvas.translate(
            floor(this.canvas.width / 2 - 0.5 * this.masterCamera.zoom - this.masterCamera.x * this.masterCamera.zoom),
            floor(this.canvas.height / 2 - 0.5 * this.masterCamera.zoom - this.masterCamera.y * this.masterCamera.zoom)
        );
        this.canvas.canvas.scale(this.masterCamera.zoom, this.masterCamera.zoom);
        for (let layer of this.layers) {
            const visibleEntities = this.determineVisibleEntities(layer);
            for (let entityId of visibleEntities) {
                const pos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
                const vis = this.entityManager.get<VisibleComponent>(entityId, CType.Visible);
                this.canvas.fill(vis.r, vis.g, vis.b, vis.a);
                this.canvas.rect(pos.x, pos.y, 1, 1);
                if (vis.layer === 5) {
                    this.canvas.fill(0, 0, 0);
                    this.canvas.rect(pos.x + 0.2, pos.y + 0.2, 0.1, 0.1);
                    this.canvas.rect(pos.x + 0.7, pos.y + 0.2, 0.1, 0.1);
                    this.canvas.rect(pos.x + 0.3, pos.y + 0.7, 0.4, 0.1);
                    this.canvas.rect(pos.x + 0.2, pos.y + 0.6, 0.1, 0.1);
                    this.canvas.rect(pos.x + 0.7, pos.y + 0.6, 0.1, 0.1);
                }
            }
        }
        this.canvas.canvas.resetTransform();
    }

    private groupEntitiesByLayer(): void {
        this.layers = new Array<Array<number>>();
        for (let entityId of this.entities) {
            const vis = this.entityManager.get<VisibleComponent>(entityId, CType.Visible);
            while (this.layers.length - 1 < vis.layer) {
                this.layers.push([]);
            }
            this.layers[vis.layer].push(entityId);
        }
    }

    private determineVisibleEntities(layer: Array<number>): Array<number> {
        const visibleEntities = new Array<number>();
        for (let entityId of layer) {
            if (this.withinVisionRange(entityId)) {
                visibleEntities.push(entityId);
            }
        }
        return visibleEntities;
    }

    private withinVisionRange(entityId: number): boolean {
        const pos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
        return distance(pos.x, pos.y, this.masterCamera.x, this.masterCamera.y) < this.masterCamera.visibleDistance;
    }

    private adjustCamera(): void {
        this.masterCamera.priority = -1;
        for (let entityId of this.entities) {
            if (this.entityManager.getEntity(entityId).has(CType.Camera)) {
                const cam = this.entityManager.get<CameraComponent>(entityId, CType.Camera);
                if (cam.priority > this.masterCamera.priority) {
                    this.masterCamera.zoom = cam.zoom;
                    this.masterCamera.x = cam.x;
                    this.masterCamera.y = cam.y;
                    this.masterCamera.priority = cam.priority;
                    this.masterCamera.visibleDistance = cam.visibleDistance;
                }
            }
        }
    }
}
