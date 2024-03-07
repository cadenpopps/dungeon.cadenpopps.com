export class EventManager {
    public eventQueue: Array<Event>;
    public nextQueue: Array<Event>;

    constructor() {
        this.eventQueue = new Array<Event>();
        this.nextQueue = new Array<Event>();
    }

    public addEvent(event: Event) {
        this.nextQueue.push(event);
    }

    public addEvents(events: Event[]) {
        for (let event of events) {
            this.nextQueue.push(event);
        }
    }

    public tick(): void {
        this.eventQueue = this.nextQueue.slice();
        this.nextQueue = new Array<Event>();
    }
}

export enum Event {
    new_game,
    entity_created,
    entity_destroyed,
    entity_modified,
    level_change,
    level_loaded,
}
