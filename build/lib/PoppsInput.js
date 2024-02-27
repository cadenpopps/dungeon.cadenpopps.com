"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = exports.keyUpListener = exports.keyDownListener = exports.keyPressedListener = exports.mousedraggedListener = exports.mouseupListener = exports.listenMouseDown = exports.listenMouseClicked = exports.listenMouseMoved = exports.keyboard = exports.mouse = void 0;
const DRAGDIST = 15;
var mouseDragStartX = 0, mouseDragStartY = 0;
exports.mouse = {
    x: 0,
    y: 0,
    leftClick: false,
    rightClick: false,
    dragging: false,
};
exports.keyboard = {
    key: undefined,
    keycode: undefined,
};
function listenMouseMoved(callback) {
    return document.addEventListener("mousemove", function (event) {
        exports.mouse.x = event.pageX;
        exports.mouse.y = event.pageY;
        callback(event);
    });
}
exports.listenMouseMoved = listenMouseMoved;
function listenMouseClicked(callback) {
    return document.addEventListener("click", function (event) {
        exports.mouse.x = event.pageX;
        exports.mouse.y = event.pageY;
        callback(event);
    });
}
exports.listenMouseClicked = listenMouseClicked;
function listenMouseDown(callback) {
    document.addEventListener("mousedown", function (event) {
        exports.mouse.leftClick = true;
        exports.mouse.x = event.pageX;
        exports.mouse.y = event.pageY;
        callback(event);
    });
}
exports.listenMouseDown = listenMouseDown;
function mouseupListener(event) {
    mouseDown = false;
    mouseX = event.pageX;
    mouseY = event.pageY;
    mouseU();
}
exports.mouseupListener = mouseupListener;
function mousedraggedListener(event) {
    cancelClick = true;
    mouseX = event.pageX;
    mouseY = event.pageY;
    mouseDragged();
}
exports.mousedraggedListener = mousedraggedListener;
function keyPressedListener(event) {
    key = event.key;
    keycode = event.code;
    keyPressed();
}
exports.keyPressedListener = keyPressedListener;
function keyDownListener(event) {
    key = event.key;
    keycode = event.code;
    keyDown();
}
exports.keyDownListener = keyDownListener;
function keyUpListener(event) {
    key = event.key;
    keycode = event.code;
    keyUp();
}
exports.keyUpListener = keyUpListener;
function listen(event) {
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
                if (mouseDown &&
                    abs(dStartx - event.pageX) > DRAGDIST &&
                    abs(dStarty - event.pageY) > DRAGDIST) {
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
exports.listen = listen;
//# sourceMappingURL=PoppsInput.js.map