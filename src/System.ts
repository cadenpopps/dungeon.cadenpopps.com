import { CType } from "./Component.js";
import { EntityManager } from "./EntityManager.js";
import { Event, EventManager } from "./EventManager.js";

export abstract class System {
    public type: SystemType;
    public paused: boolean;
    public requiredComponents: Array<CType>;
    public entities: Array<number>;
    protected eventManager: EventManager;
    protected entityManager: EntityManager;

    constructor(
        type: SystemType,
        eventManager: EventManager,
        entityManager: EntityManager,
        requiredComponents: Array<CType>
    ) {
        this.type = type;
        this.paused = false;
        this.eventManager = eventManager;
        this.entityManager = entityManager;
        this.requiredComponents = requiredComponents;
        this.entities = new Array<number>();
    }

    public tick(): void {
        for (let event of this.eventManager.eventQueue) {
            switch (event) {
                case Event.entity_created:
                case Event.entity_modified:
                case Event.entity_destroyed:
                    this.getEntities();
                    break;
                case Event.level_change:
                    this.pause();
                    break;
                case Event.level_loaded:
                    this.unpause();
                    break;
                case Event.pause:
                    this.pause();
                    break;
                case Event.unpause:
                    this.unpause();
                    break;
            }
            this.handleEvent(event);
        }
        if (!this.paused) {
            this.logic();
        }
    }

    public handleEvent(_event: Event): void {}

    public logic(): void {}

    public getEntities(): void {
        this.entities = this.entityManager.getSystemEntities(this.requiredComponents);
        this.getEntitiesHelper();
    }

    public getEntitiesHelper(): void {}

    public pause(): void {
        this.paused = true;
    }

    public unpause(): void {
        this.paused = false;
    }
}

export enum SystemType {
    Game,
    Controller,
    Graphics,
    Player,
    Physics,
    Movement,
    Camera,
    Level,
    Interactable,
    Light,
    Visible,
    AI,
    UI,
    Ability,
    Hitbox,
    Health,
    Texture,
}
