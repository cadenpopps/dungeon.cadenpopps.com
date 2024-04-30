export default class PoppsCanvas {
    public font = "sans-serif";
    public fontSize = "10px";
    public width: number = 0;
    public height: number = 0;
    public imageSmoothingEnabled: boolean = true;
    public parentElement: HTMLElement;
    public canvasElement!: HTMLCanvasElement;
    public canvas!: CanvasRenderingContext2D;
    public looping = false;
    public drawCallback!: Function;

    constructor(zIndex: number = 1, parent: HTMLElement | null = null) {
        if (parent === null) {
            parent = document.getElementsByTagName("body")[0];
        }
        this.parentElement = parent;
        this.initCanvas(zIndex);
        this.initResizeListener();
    }

    private initCanvas(zIndex: number): void {
        this.canvasElement = document.createElement("canvas");
        this.canvas = this.canvasElement.getContext("2d") as CanvasRenderingContext2D;
        this.parentElement.append(this.canvasElement);
        this.canvasElement.style.position = "fixed";
        this.canvasElement.style.background = "transparent";
        this.canvasElement.style.zIndex = zIndex.toString();
        this.resizeCanvas();
    }

    private initResizeListener(): void {
        if (this.parentElement.tagName === "BODY") {
            window.addEventListener("resize", () => {
                this.resizeCanvas();
            });
        } else {
            this.parentElement.addEventListener("resize", () => {
                this.resizeCanvas();
            });
        }
    }

    private resizeCanvas(): void {
        const parentWidth = this.parentElement.clientWidth;
        const parentHeight = this.parentElement.clientHeight;
        this.canvas.canvas.width = parentWidth;
        this.canvas.canvas.height = parentHeight;
        this.width = parentWidth;
        this.height = parentHeight;
        this.canvas.imageSmoothingEnabled = this.imageSmoothingEnabled;
    }

    public loop(callback: Function): void {
        this.drawCallback = callback;
        this.looping = true;
        this.draw();
    }

    public stop(): void {
        this.looping = false;
    }

    private draw(): void {
        if (this.looping) {
            this.drawCallback();
            window.requestAnimationFrame(this.draw.bind(this));
        }
    }

    /**
     * Manually sets the canvas size
     */
    public setSize(width: number = 0, height: number = 0): void {
        this.canvas.canvas.width = width;
        this.canvas.canvas.height = height;
        this.width = width;
        this.height = height;
        this.canvas.imageSmoothingEnabled = this.imageSmoothingEnabled;
    }

    /**
     * Clear the canvas of previous draws and images
     */
    public clear(): void {
        this.canvas.clearRect(0, 0, this.width, this.height);
    }

    /**
     * @param r red value of background 0-255
     * @param g green value of background 0-255
     * @param b blue value of background 0-255
     * @param a optional alpha value of background 0-255
     */
    public background(r: number, g: number, b: number, a?: number): void {
        a = a || 255;
        const currentFillStyle = this.canvas.fillStyle;
        this.fill(r, g, b, a);
        this.canvas.beginPath();
        this.canvas.rect(0, 0, this.width, this.height);
        this.canvas.fill();
        this.canvas.fillStyle = currentFillStyle;
    }

    /**
     * @param r red value of fill 0-255
     * @param g green value of fill 0-255
     * @param b blue value of fill 0-255
     * @param a optional alpha value of fill 0-255
     */
    public fill(r: number, g: number, b: number, a?: number): void {
        r = Math.round(r);
        g = Math.round(g);
        b = Math.round(b);
        if (a === undefined) {
            a = 1;
        }
        this.canvas.fillStyle = `rgba(${r},${g},${b},${a})`;
    }

    /**
     * @param r red value of fill 0-255
     * @param g green value of fill 0-255
     * @param b blue value of fill 0-255
     * @param a optional alpha value of fill 0-255
     */
    public stroke(r: number, g: number, b: number, a?: number): void {
        r = Math.round(r);
        g = Math.round(g);
        b = Math.round(b);
        if (a === undefined) {
            a = 1;
        }
        this.canvas.strokeStyle = `rgba(${r},${g},${b},${a})`;
    }

    /**
     * @param width stroke width
     */
    public strokeWidth(width: number): void {
        this.canvas.lineWidth = width;
    }

    public noStroke(): void {
        this.canvas.strokeStyle = "transparent";
    }

    /**
     * @param f name of new font
     */
    public setFont(f: string): void {
        this.font = f;
        this.canvas.font = `${this.fontSize} ${this.font}`;
    }

    /**
     * @param size size of new font in pixels
     */
    public setFontSize(size: number): void {
        this.fontSize = `${size}px`;
        this.setFont(this.font);
    }

    /**
     * @param imageSmoothingEnabled whether the canvas anti aliases images drawn
     */
    public setImageSmoothingEnabled(imageSmoothingEnabled: boolean): void {
        this.imageSmoothingEnabled = imageSmoothingEnabled;
        this.canvas.imageSmoothingEnabled = imageSmoothingEnabled;
    }

    /**
     * @param globalAlpha the alpha value to draw all images and shapes
     */
    public setGlobalAlpha(globalAlpha: number): void {
        this.canvas.globalAlpha = globalAlpha;
    }

    /**
     * Resets the global alpha value to 1
     */
    public resetGlobalAlpha(): void {
        this.canvas.globalAlpha = 1;
    }

    /**
     * @param x1 x coordinate of top left corner
     * @param y1 y coordinate of top left corner
     * @param x2 x coordinate of bottom right corner
     * @param y2 y coordinate of bottom right corner
     */
    public rect(x1: number, y1: number, x2: number, y2: number): void {
        this.canvas.beginPath();
        this.canvas.rect(x1, y1, x2, y2);
        this.canvas.fill();
    }

    /**
     * @param x1 x coordinate of top left corner
     * @param y1 y coordinate of top left corner
     * @param x2 x coordinate of bottom right corner
     * @param y2 y coordinate of bottom right corner
     */
    public strokeRect(x1: number, y1: number, x2: number, y2: number): void {
        this.canvas.beginPath();
        this.canvas.rect(x1, y1, x2, y2);
        this.canvas.stroke();
    }

    /**
     * @param x1 x coordinate of first corner
     * @param y1 y coordinate of first corner
     * @param x2 x coordinate of first corner
     * @param y2 y coordinate of first corner
     * @param width stroke width of the line
     */
    public line(x1: number, y1: number, x2: number, y2: number, width: number): void {
        this.canvas.beginPath();
        this.canvas.moveTo(x1, y1);
        this.canvas.lineTo(x2, y2);
        if (width) {
            var t = this.canvas.lineWidth;
            this.strokeWidth(width);
            this.canvas.stroke();
            this.strokeWidth(t);
        } else {
            this.canvas.stroke();
        }
    }

    /**
     * @param x x coordinate of center point
     * @param y y coordinate of center point
     * @param r radius of ellipse
     */
    public ellipse(x: number, y: number, r: number): void {
        this.canvas.beginPath();
        if (r) {
            this.canvas.arc(x, y, r, 0, 2 * Math.PI);
        } else {
            this.canvas.arc(x, y, 1, 0, 2 * Math.PI);
        }
        this.canvas.fill();
    }

    /**
     * @param x x coordinate of center point
     * @param y y coordinate of center point
     * @param r radius of ellipse
     */
    public strokeEllipse(x: number, y: number, r: number): void {
        this.canvas.beginPath();
        if (r) {
            this.canvas.arc(x, y, r, 0, 2 * Math.PI);
        } else {
            this.canvas.arc(x, y, 1, 0, 2 * Math.PI);
        }
        this.canvas.stroke();
    }

    /**
     * @param x x coordinate of center point
     * @param y y coordinate of center point
     * @param r radius of arc
     * @param startAngle angle of start of arc
     * @param endAngle angle of end of arc
     * @param ant boolean to reverse direction
     */
    public arc(x: number, y: number, r: number, startAngle: number, endAngle: number, ant: number): void {
        this.canvas.beginPath();
        if (ant) {
            this.canvas.arc(x, y, r, startAngle, endAngle, true);
        } else {
            this.canvas.arc(x, y, r, startAngle, endAngle);
        }
        this.canvas.fill();
    }

    /**
     * @param x x coordinate of center point
     * @param y y coordinate of center point
     * @param r radius of arc
     * @param startAngle angle of start of arc
     * @param endAngle angle of end of arc
     * @param ant boolean to reverse direction
     */
    public strokeArc(x: number, y: number, r: number, startAngle: number, endAngle: number, ant: number): void {
        this.canvas.beginPath();
        if (ant) {
            this.canvas.arc(x, y, r, startAngle, endAngle, true);
        } else {
            this.canvas.arc(x, y, r, startAngle, endAngle);
        }
        this.canvas.stroke();
    }

    /**
     * @param x x coordinate of point
     * @param y y coordinate of point
     * @param r radius of point
     */
    public point(x: number, y: number, r: number): void {
        this.canvas.beginPath();
        if (r) {
            this.canvas.arc(x, y, r, 0, 2 * Math.PI);
        } else {
            this.canvas.arc(x, y, 1, 0, 2 * Math.PI);
        }
        this.canvas.fill();
    }

    /**
     * @param x x coordinate of point
     * @param y y coordinate of point
     * @param r radius of point
     */
    public strokePoint(x: number, y: number, r: number): void {
        this.canvas.beginPath();
        if (r) {
            this.canvas.arc(x, y, r, 0, 2 * Math.PI);
        } else {
            this.canvas.arc(x, y, 1, 0, 2 * Math.PI);
        }
        this.canvas.stroke();
    }

    /**
     * @param t string to print
     * @param x x coordinate to print text at
     * @param y y coordinate to print text at
     */
    public text(t: string, x: number, y: number): void {
        this.canvas.fillText(t, x, y);
    }

    /**
     * @param t string to print
     * @param x x coordinate to print text at
     * @param y y coordinate to print text at
     */
    public strokeText(t: string, x: number, y: number): void {
        this.canvas.strokeText(t, x, y);
    }

    /**
     * @param img ImageSource to draw
     * @param x x coordinate of top left corner of image
     * @param y y coordinate of top left corner of image
     * @param width width of image
     * @param height height of image
     */
    public image(img: CanvasImageSource, x: number, y: number, width: number, height: number) {
        this.canvas.drawImage(img, x, y, width, height);
    }

    /**
     * @param img ImageSource to draw
     * @param sx x coordinate of top left corner of sprite on spritesheet
     * @param sy y coordinate of top left corner of sprite on spritesheet
     * @param sWidth width of sprite on spritesheet
     * @param sHeight height of sprite on spritesheet
     * @param x x coordinate of top left corner of sprite on canvas
     * @param y y coordinate of top left corner of sprite on canvas
     * @param width width of sprite on canvas
     * @param height height of sprite on canvas
     */
    public sprite(
        img: CanvasImageSource,
        sx: number,
        sy: number,
        sWidth: number,
        sHeight: number,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        this.canvas.drawImage(img, sx, sy, sWidth, sHeight, x, y, width, height);
    }
}
