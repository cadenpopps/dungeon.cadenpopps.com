export class PoppsEngine {
    constructor() {
        this.looping = false;
        this.ticks = 0;
    }
    loop(callback) {
        if (typeof callback == "function") {
            this.looping = true;
            this.tickCallback = callback;
        }
    }
    stop() {
        this.looping = false;
    }
    tick() {
        if (this.looping) {
            this.tickCallback();
            this.tick();
        }
    }
    resetTickCount() {
        this.ticks = 0;
    }
}
//# sourceMappingURL=PoppsEngine.js.map