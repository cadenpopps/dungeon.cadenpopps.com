export class PoppsEngine {
    public looping = false;
    public ticks = 0;
    private tickCallback!: Function;

    public loop(callback: Function): void {
        if (typeof callback == "function") {
            this.looping = true;
            this.tickCallback = callback;
        }
    }

    public stop() {
        this.looping = false;
    }

    public tick() {
        if (this.looping) {
            this.tickCallback();
            this.tick();
        }
    }

    public resetTickCount() {
        this.ticks = 0;
    }
}
