import PoppsCanvas from "../../lib/PoppsCanvas.js";
import { floor } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import HealthComponent from "../Components/HealthComponent.js";
import HitboxComponent, { HitboxShape } from "../Components/HitboxComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import RotationComponent from "../Components/RotationComponent.js";
import SizeComponent from "../Components/SizeComponent.js";
import TextureComponent from "../Components/TextureComponent.js";
import VisibleComponent from "../Components/VisibleComponent.js";
import { SHOW_HITBOXES } from "../Constants.js";
import { EntityManager } from "../EntityManager.js";
import { Event, EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";
import VisibleSystem from "./VisibleSystem.js";

export default class GraphicsSystem extends System {
    private canvas: PoppsCanvas;
    private invisibleCanvas: PoppsCanvas;
    private layers: Array<Array<number>>;
    private hitboxIds: Array<number>;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Graphics, eventManager, entityManager, [CType.Position, CType.Visible, CType.Size]);
        this.canvas = new PoppsCanvas();
        this.invisibleCanvas = new PoppsCanvas(0, document.querySelector(`#spriteCanvas`) as HTMLElement);
        this.layers = Array<Array<number>>();
        this.hitboxIds = Array<number>();
        this.canvas.loop(this.canvasCallback.bind(this));
        this.canvas.setImageSmoothingEnabled(false);
        this.invisibleCanvas.setImageSmoothingEnabled(false);
    }

    public handleEvent(event: Event): void {
        switch (event) {
            case Event.entity_created:
            case Event.entity_modified:
            case Event.entity_destroyed:
                this.groupEntitiesByLayer();
                break;
            case Event.level_loaded:
                this.groupEntitiesByLayer();
                break;
        }
    }

    public getEntitiesHelper(): void {
        if (SHOW_HITBOXES) {
            this.hitboxIds = this.entityManager.getSystemEntities([CType.Hitbox]);
        }
    }

    private canvasCallback(): void {
        this.canvas.clear();
        const cam = CameraSystem.getHighestPriorityCamera();
        if (!cam) {
            return;
        }
        this.canvas.canvas.translate(
            floor(this.canvas.width / 2) - floor((cam.x + cam.visualOffsetX) * cam.zoom),
            floor(this.canvas.height / 2) - floor((cam.y + cam.visualOffsetY) * cam.zoom)
        );
        this.canvas.canvas.scale(cam.zoom, cam.zoom);
        for (let layer of this.layers) {
            const visibleEntities = VisibleSystem.getVisibleAndDiscoveredEntities(layer, this.entityManager);
            for (let entityId of visibleEntities) {
                const entity = this.entityManager.getEntity(entityId);
                const pos = entity.get(CType.Position) as PositionComponent;
                const vis = entity.get(CType.Visible) as VisibleComponent;
                const size = entity.get(CType.Size) as SizeComponent;
                const width = size.width;
                const height = size.height;

                if (entity.has(CType.Rotation)) {
                    this.canvas.canvas.save();
                    const rotation = entity.get(CType.Rotation) as RotationComponent;
                    this.canvas.canvas.translate(rotation.centerPoint.x, rotation.centerPoint.y);
                    this.canvas.canvas.rotate((rotation.degrees * Math.PI) / 180);
                    this.canvas.canvas.translate(-rotation.centerPoint.x, -rotation.centerPoint.y);
                }

                if (entity.has(CType.Health)) {
                    const health = entity.get(CType.Health) as HealthComponent;
                    if (health.invincibleCounter > 0) {
                        this.canvas.setGlobalAlpha(0.5);
                    }
                }

                if (entity.has(CType.Texture)) {
                    const tex = entity.get(CType.Texture) as TextureComponent;
                    if (!vis.visible) {
                        this.canvas.setGlobalAlpha(0.8);
                    }

                    if (entity.has(CType.Tile)) {
                        for (let texture of tex.textures) {
                            this.canvas.sprite(
                                texture.textureMap,
                                texture.mapX,
                                texture.mapY,
                                texture.pixelWidth,
                                texture.pixelHeight,
                                texture.x + pos.x - 0.5,
                                texture.y + pos.y - 0.5,
                                1,
                                1
                            );
                            if (texture.tint) {
                                this.canvas.fill(texture.tint.r, texture.tint.g, texture.tint.b, texture.tint.a);
                                this.canvas.rect(texture.x + pos.x - 0.5, texture.y + pos.y - 0.5, 1, 1);
                            }
                        }
                        this.canvas.canvas.globalCompositeOperation = "source-atop";
                        const light = vis.light;
                        this.canvas.fill(light.r, light.g, light.b, light.a);
                        this.canvas.rect(pos.x - 0.5, pos.y - 0.5, 1, 1);
                        const shadow = vis.shadow;
                        this.canvas.fill(shadow.r, shadow.g, shadow.b, shadow.a);
                        this.canvas.rect(pos.x - 0.5, pos.y - 0.5, 1, 1);
                        this.canvas.canvas.globalCompositeOperation = "source-over";
                    } else {
                        for (let texture of tex.textures) {
                            this.invisibleCanvas.clear();
                            this.invisibleCanvas.sprite(
                                texture.textureMap,
                                texture.mapX,
                                texture.mapY,
                                texture.pixelWidth,
                                texture.pixelHeight,
                                0,
                                0,
                                texture.pixelWidth,
                                texture.pixelHeight
                            );

                            this.invisibleCanvas.canvas.globalCompositeOperation = "source-atop";
                            if (texture.tint) {
                                this.canvas.fill(texture.tint.r, texture.tint.g, texture.tint.b, texture.tint.a);
                                this.canvas.rect(0, 0, texture.pixelWidth, texture.pixelHeight);
                            }
                            const light = vis.light;
                            this.invisibleCanvas.fill(light.r, light.g, light.b, light.a);
                            this.invisibleCanvas.rect(0, 0, texture.pixelWidth, texture.pixelHeight);
                            const shadow = vis.shadow;
                            this.invisibleCanvas.fill(shadow.r, shadow.g, shadow.b, shadow.a);
                            this.invisibleCanvas.rect(0, 0, texture.pixelWidth, texture.pixelHeight);
                            this.invisibleCanvas.canvas.globalCompositeOperation = "source-over";

                            this.canvas.sprite(
                                this.invisibleCanvas.canvasElement,
                                0,
                                0,
                                texture.pixelWidth,
                                texture.pixelHeight,
                                texture.x + pos.x - width / 2,
                                texture.y + pos.y - height / 2,
                                width,
                                height
                            );
                        }
                    }
                } else {
                    if (!vis.visible) {
                        this.canvas.fill(255, 255, 255, 0.75);
                    } else {
                        this.canvas.fill(255, 255, 255, 1);
                    }
                    this.canvas.rect(pos.x - width / 2, pos.y - height / 2, width, height);
                    const light = vis.light;
                    this.canvas.fill(light.r, light.g, light.b, light.a);
                    this.canvas.rect(pos.x - width / 2, pos.y - height / 2, width, height);
                    const shadow = vis.shadow;
                    this.canvas.fill(shadow.r, shadow.g, shadow.b, shadow.a);
                    this.canvas.rect(pos.x - width / 2, pos.y - height / 2, width, height);
                }
                this.canvas.resetGlobalAlpha();

                if (entity.has(CType.Rotation)) {
                    this.canvas.canvas.restore();
                }
            }
        }

        if (SHOW_HITBOXES) {
            for (const entityId of this.hitboxIds) {
                const rotation = this.entityManager.get<RotationComponent>(entityId, CType.Rotation);
                const hitbox = this.entityManager.get<HitboxComponent>(entityId, CType.Hitbox);
                const pos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
                const size = this.entityManager.get<SizeComponent>(entityId, CType.Size);
                const width = size.width;
                const height = size.height;
                this.canvas.canvas.save();
                this.canvas.canvas.translate(rotation.centerPoint.x, rotation.centerPoint.y);
                this.canvas.canvas.rotate((rotation.degrees * Math.PI) / 180);
                this.canvas.canvas.translate(-rotation.centerPoint.x, -rotation.centerPoint.y);
                this.canvas.stroke(255, 0, 40, 0.75);
                this.canvas.strokeWidth(0.1);
                if (hitbox.shape === HitboxShape.Rectangle) {
                    this.canvas.strokeRect(pos.x - width / 2, pos.y - height / 2, width, height);
                } else if (hitbox.shape === HitboxShape.Circle) {
                    this.canvas.strokeEllipse(pos.x, pos.y, hitbox.width);
                }
                this.canvas.canvas.restore();
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
}
