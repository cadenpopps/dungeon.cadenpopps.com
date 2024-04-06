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
            this.ticks++;
            setTimeout(this.tick.bind(this), 20);
            this.tickCallback();
        }
    }

    public stop(): void {
        this.looping = false;
    }

    public resetTickCount(): void {
        this.ticks = 0;
    }
}
