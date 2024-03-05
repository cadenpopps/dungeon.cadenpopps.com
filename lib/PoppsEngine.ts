export class PoppsEngine {
    public looping = false;
    public ticks = 0;
    private tickCallback!: Function;

    public loop(callback: Function): void {
        if (typeof callback == "function") {
            this.looping = true;
            this.tickCallback = callback;
            this.tick();
        }
    }

    public tick(): void {
        if (this.looping) {
            this.tickCallback();
            this.ticks++;
            setTimeout(this.tick.bind(this), 0);
        }
    }

    public stop(): void {
        this.looping = false;
    }

    public resetTickCount(): void {
        this.ticks = 0;
    }
}
