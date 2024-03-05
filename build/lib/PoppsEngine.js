export class PoppsEngine {
    constructor() {
        this.looping = false;
        this.ticks = 0;
    }
    loop(callback) {
        if (typeof callback == "function") {
            this.looping = true;
            this.tickCallback = callback;
            this.tick();
        }
    }
    tick() {
        if (this.looping) {
            this.tickCallback();
            this.ticks++;
            setTimeout(this.tick.bind(this), 0);
        }
    }
    stop() {
        this.looping = false;
    }
    resetTickCount() {
        this.ticks = 0;
    }
}
//# sourceMappingURL=PoppsEngine.js.map