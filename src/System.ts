import { CType } from "./Component.js";
import { EntityManager } from "./EntityManager.js";
import { Event, EventManager } from "./EventManager.js";

export abstract class System {
    public type: SystemType;
    public paused: boolean;
    public requiredComponents: Array<CType>;
    public entities: Array<number>;
    public eventManager: EventManager;
    public entityManager: EntityManager;

    constructor(
        type: SystemType,
        eventManager: EventManager,
        entityManager: EntityManager,
        requiredComponents: Array<CType>
    ) {
        this.type = type;
        this.paused = true;
        this.eventManager = eventManager;
        this.entityManager = entityManager;
        this.requiredComponents = requiredComponents;
        this.entities = new Array<number>();
        this.entityManager.subscribeToEntities(this.requiredComponents, this.entities, this);
    }

    public tick(): void {
        for (let event of this.eventManager.eventQueue) {
            switch (event) {
                case Event.pause:
                    this.paused = true;
                    break;
                case Event.level_change_complete:
                case Event.unpause:
                    this.paused = false;
                    break;
            }
            this.handleEvent(event);
        }
        if (!this.paused) {
            this.logic();
        }
    }

    public handleEvent(_event: Event): void {}

    public entitiesModifiedCallback(): void {}

    public logic(): void {}
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
    Enemy,
}
