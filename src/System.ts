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
                    this.refreshEntities();
                    break;
            }
            this.handleEvent(event);
        }
        if (!this.paused) {
            this.logic();
        }
    }

    public abstract handleEvent(event: Event): void;

    public abstract logic(): void;

    public refreshEntities(): void {
        this.entities = this.entityManager.getSystemEntities(
            this.requiredComponents
        );
    }
}

export enum SystemType {
    Game,
    Input,
    Graphics,
    Player,
    Physics,
    Movement,
    Camera,
    Level,
    Interactable,
}
