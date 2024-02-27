const DRAGDIST = 15;

var mouseDragStartX = 0,
    mouseDragStartY = 0;

export var mouse = {
    x: 0,
    y: 0,
    leftClick: false,
    rightClick: false,
    dragging: false,
};

export var keyboard = {
    key: undefined,
    keycode: undefined,
};

export function listenMouseMoved(callback: Function): void {
    return document.addEventListener("mousemove", function (event) {
        mouse.x = event.pageX;
        mouse.y = event.pageY;
        callback(event);
    });
}

export function listenMouseClicked(callback: Function): void {
    return document.addEventListener("click", function (event) {
        mouse.x = event.pageX;
        mouse.y = event.pageY;
        callback(event);
    });
}

export function listenMouseDown(callback: Function): void {
    document.addEventListener("mousedown", function (event) {
        mouse.leftClick = true;
        mouse.x = event.pageX;
        mouse.y = event.pageY;
        callback(event);
    });
}

export function mouseupListener(event) {
    mouseDown = false;
    mouseX = event.pageX;
    mouseY = event.pageY;
    mouseU();
}

export function mousedraggedListener(event) {
    cancelClick = true;
    mouseX = event.pageX;
    mouseY = event.pageY;
    mouseDragged();
}

export function keyPressedListener(event) {
    key = event.key;
    keycode = event.code;
    keyPressed();
}

export function keyDownListener(event) {
    key = event.key;
    keycode = event.code;
    keyDown();
}

export function keyUpListener(event) {
    key = event.key;
    keycode = event.code;
    keyUp();
}

export function listen(event) {
    switch (event) {
        case "mousemoved":
            break;
        case "mouseclicked":
            break;
        case "mousedown":
            break;
        case "mouseup":
            document.addEventListener("mouseup", function (event) {
                mouseupListener(event);
            });
            break;
        case "mousedragged":
            document.addEventListener("mousedown", function (event) {
                mouseDown = true;
                dStartx = event.pageX;
                dStarty = event.pageX;
            });
            document.addEventListener("mousemove", function (event) {
                if (
                    mouseDown &&
                    abs(dStartx - event.pageX) > DRAGDIST &&
                    abs(dStarty - event.pageY) > DRAGDIST
                ) {
                    mousedraggedListener(event);
                }
            });
            document.addEventListener("mouseup", function () {
                mouseDown = false;
            });
            break;
        case "keypressed":
            document.addEventListener("keypress", function (event) {
                keyPressedListener(event);
            });
            break;
        case "keydown":
            document.addEventListener("keydown", function (event) {
                keyDownListener(event);
            });
            break;
        case "keyup":
            document.addEventListener("keyup", function (event) {
                keyUpListener(event);
            });
            break;
        case "windowresized":
            window.addEventListener("resize", windowResizedListener);
            break;
    }
}
