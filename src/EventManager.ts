export class EventManager {
    public eventQueue: Array<Event>;
    public nextQueue: Array<Event>;

    constructor() {
        this.eventQueue = new Array<Event>();
        this.nextQueue = new Array<Event>();
    }

    public addEvent(event: Event) {
        if (this.nextQueue.includes(event)) {
            return;
        }
        this.nextQueue.push(event);
    }

    public addEvents(events: Event[]) {
        for (let event of events) {
            if (this.nextQueue.includes(event)) {
                continue;
            }
            this.nextQueue.push(event);
        }
    }

    public tick(): void {
        this.eventQueue = this.nextQueue.slice();
        this.nextQueue = new Array<Event>();
    }
}

export enum Event {
    init,
    new_game,
    respawn,
    load_game,
    level_change_begin,
    level_change_complete,
    begin_level_load,
    level_loaded,
    pause,
    unpause,
}
