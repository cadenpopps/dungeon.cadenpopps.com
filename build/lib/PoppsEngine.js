export class PoppsEngine {
    looping = false;
    ticks = 0;
    tickCallback;
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