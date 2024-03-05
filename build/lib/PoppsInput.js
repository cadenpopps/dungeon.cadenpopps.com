const DRAGDIST = 15;
var mouseDragStartX = 0, mouseDragStartY = 0;
export var mouse = {
    x: 0,
    y: 0,
    leftClick: false,
    rightClick: false,
    dragging: false,
};
document.addEventListener("mousedown", function () {
    mouse.leftClick = true;
});
document.addEventListener("mouseup", function () {
    mouse.leftClick = false;
});
export var keyboard = {
    lastKey: "",
    lastKeycode: "",
    keys: [],
};
document.addEventListener("keydown", function (event) {
    if (!keyboard.keys.includes(event.key)) {
        keyboard.keys.push(event.key);
    }
});
document.addEventListener("keyup", function (event) {
    keyboard.keys = keyboard.keys.filter(function (key) {
        return key !== event.key;
    });
});
export function listenMouseMoved(callback) {
    document.addEventListener("mousemove", function (event) {
        mouse.x = event.pageX;
        mouse.y = event.pageY;
        callback(event);
    });
}
export function listenMouseClicked(callback) {
    document.addEventListener("click", function (event) {
        mouse.x = event.pageX;
        mouse.y = event.pageY;
        callback(event);
    });
}
export function listenMouseDown(callback) {
    document.addEventListener("mousedown", function (event) {
        mouse.x = event.pageX;
        mouse.y = event.pageY;
        callback(event);
    });
}
export function listenMouseUp(callback) {
    document.addEventListener("mouseup", function (event) {
        mouse.x = event.pageX;
        mouse.y = event.pageY;
        callback(event);
    });
}
export function listenMouseDragged(callback) {
    document.addEventListener("mousedown", function (event) {
        mouse.leftClick = true;
        mouse.x = event.pageX;
        mouse.y = event.pageY;
        mouseDragStartX = mouse.x;
        mouseDragStartY = mouse.y;
    });
    document.addEventListener("mousemove", function (event) {
        if (mouse.dragging) {
            mouse.x = event.pageX;
            mouse.y = event.pageY;
            callback(event);
        }
        else if (mouse.leftClick &&
            (Math.abs(mouseDragStartX - event.pageX) > DRAGDIST ||
                Math.abs(mouseDragStartY - event.pageY) > DRAGDIST)) {
            mouse.x = event.pageX;
            mouse.y = event.pageY;
            mouse.dragging = true;
            callback(event);
        }
    });
    document.addEventListener("mouseup", function (event) {
        mouse.dragging = false;
        mouse.x = event.pageX;
        mouse.y = event.pageY;
    });
}
export function listenScroll(callback) {
    window.addEventListener("wheel", (event) => {
        callback(event);
    });
}
export function listenKeyPressed(callback) {
    document.addEventListener("keypress", function (event) {
        keyboard.lastKey = event.key;
        keyboard.lastKeycode = event.code;
        callback(event.key);
    });
}
export function listenKeyDown(callback) {
    document.addEventListener("keydown", function (event) {
        keyboard.lastKey = event.key;
        keyboard.lastKeycode = event.code;
        callback(event.key);
    });
}
export function listenKeyUp(callback) {
    document.addEventListener("keyup", function (event) {
        keyboard.lastKey = event.key;
        keyboard.lastKeycode = event.code;
        callback(event.key);
    });
}
//# sourceMappingURL=PoppsInput.js.map