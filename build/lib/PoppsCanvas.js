export default class PoppsCanvas {
    font = "sans-serif";
    fontSize = "10px";
    parentElement;
    canvasElement;
    canvas;
    width;
    height;
    looping = false;
    drawCallback;
    constructor(zIndex = 1, parent) {
        this.parentElement = parent || document.getElementsByTagName("body")[0];
        this.initCanvas(zIndex);
        this.initResizeListener();
    }
    initCanvas(zIndex) {
        this.canvasElement = document.createElement("canvas");
        this.canvas = this.canvasElement.getContext("2d");
        this.parentElement.append(this.canvasElement);
        this.canvasElement.style.position = "fixed";
        this.canvasElement.style.background = "transparent";
        this.canvasElement.style.zIndex = zIndex.toString();
        this.resizeCanvas();
    }
    initResizeListener() {
        window.addEventListener("resize", () => {
            this.resizeCanvas();
        });
    }
    resizeCanvas() {
        const parentWidth = this.parentElement.clientWidth;
        const parentHeight = this.parentElement.clientHeight;
        this.canvas.canvas.width = parentWidth;
        this.canvas.canvas.height = parentHeight;
        this.width = parentWidth;
        this.height = parentHeight;
    }
    loop(callback) {
        this.drawCallback = callback;
        this.looping = true;
        this.draw();
    }
    stop() {
        this.looping = false;
    }
    draw() {
        if (this.looping) {
            this.drawCallback();
            window.requestAnimationFrame(this.draw.bind(this));
        }
    }
    background(r, g, b, a) {
        a = a || 255;
        const currentFillStyle = this.canvas.fillStyle;
        this.fill(r, g, b, a);
        this.canvas.beginPath();
        this.canvas.rect(0, 0, this.width, this.height);
        this.canvas.fill();
        this.canvas.fillStyle = currentFillStyle;
    }
    fill(r, g, b, a) {
        r = Math.round(r);
        g = Math.round(g);
        b = Math.round(b);
        if (a === undefined) {
            a = 1;
        }
        this.canvas.fillStyle = `rgba(${r},${g},${b},${a})`;
    }
    stroke(r, g, b, a) {
        r = Math.round(r);
        g = Math.round(g);
        b = Math.round(b);
        if (a === undefined) {
            a = 1;
        }
        this.canvas.strokeStyle = `rgba(${r},${g},${b},${a})`;
    }
    strokeWidth(width) {
        this.canvas.lineWidth = width;
    }
    noStroke() {
        this.canvas.strokeStyle = "transparent";
    }
    setFont(f) {
        this.font = f;
        this.canvas.font = `${this.fontSize} ${this.font}`;
    }
    setFontSize(size) {
        this.fontSize = `${size}px`;
        this.setFont(this.font);
    }
    clearCanvas() {
        this.canvas.clearRect(0, 0, this.width, this.height);
    }
    rect(x1, y1, x2, y2) {
        this.canvas.beginPath();
        this.canvas.rect(x1, y1, x2, y2);
        this.canvas.fill();
    }
    strokeRect(x1, y1, x2, y2) {
        this.canvas.beginPath();
        this.canvas.rect(x1, y1, x2, y2);
        this.canvas.stroke();
    }
    line(x1, y1, x2, y2, width) {
        this.canvas.beginPath();
        this.canvas.moveTo(x1, y1);
        this.canvas.lineTo(x2, y2);
        if (width) {
            var t = this.canvas.lineWidth;
            this.strokeWidth(width);
            this.canvas.stroke();
            this.strokeWidth(t);
        }
        else {
            this.canvas.stroke();
        }
    }
    ellipse(x, y, r) {
        this.canvas.beginPath();
        if (r) {
            this.canvas.arc(x, y, r, 0, 2 * Math.PI);
        }
        else {
            this.canvas.arc(x, y, 1, 0, 2 * Math.PI);
        }
        this.canvas.fill();
    }
    strokeEllipse(x, y, r) {
        this.canvas.beginPath();
        if (r) {
            this.canvas.arc(x, y, r, 0, 2 * Math.PI);
        }
        else {
            this.canvas.arc(x, y, 1, 0, 2 * Math.PI);
        }
        this.canvas.stroke();
    }
    arc(x, y, r, startAngle, endAngle, ant) {
        this.canvas.beginPath();
        if (ant) {
            this.canvas.arc(x, y, r, startAngle, endAngle, true);
        }
        else {
            this.canvas.arc(x, y, r, startAngle, endAngle);
        }
        this.canvas.fill();
    }
    strokeArc(x, y, r, startAngle, endAngle, ant) {
        this.canvas.beginPath();
        if (ant) {
            this.canvas.arc(x, y, r, startAngle, endAngle, true);
        }
        else {
            this.canvas.arc(x, y, r, startAngle, endAngle);
        }
        this.canvas.stroke();
    }
    point(x, y, r) {
        this.canvas.beginPath();
        if (r) {
            this.canvas.arc(x, y, r, 0, 2 * Math.PI);
        }
        else {
            this.canvas.arc(x, y, 1, 0, 2 * Math.PI);
        }
        this.canvas.fill();
    }
    strokePoint(x, y, r) {
        this.canvas.beginPath();
        if (r) {
            this.canvas.arc(x, y, r, 0, 2 * Math.PI);
        }
        else {
            this.canvas.arc(x, y, 1, 0, 2 * Math.PI);
        }
        this.canvas.stroke();
    }
    text(t, x, y) {
        this.canvas.fillText(t, x, y);
    }
    strokeText(t, x, y) {
        this.canvas.strokeText(t, x, y);
    }
    image(img, x, y, width, height) {
        this.canvas.drawImage(img, x, y, width, height);
    }
    sprite(img, sx, sy, sWidth, sHeight, x, y, width, height) {
        this.canvas.drawImage(img, sx, sy, sWidth, sHeight, x, y, width, height);
    }
}
//# sourceMappingURL=PoppsCanvas.js.map