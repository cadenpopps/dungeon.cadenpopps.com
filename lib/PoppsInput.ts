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

// window.addEventListener("scroll", function (event) {
//     var r = canvasElement.getBoundingClientRect();
//     scrollTop = document.documentElement.scrollTop
//         ? document.documentElement.scrollTop
//         : document.body.scrollTop;
//     scrollLeft = document.documentElement.scrollLeft
//         ? document.documentElement.scrollLeft
//         : document.body.scrollLeft;
//     canvasX = r.left + scrollLeft;
//     canvasY = r.top + scrollTop;
// });
document.addEventListener("mousedown", function () {
    mouse.leftClick = true;
});

document.addEventListener("mouseup", function () {
    mouse.leftClick = false;
});

export var keyboard = {
    lastKey: "",
    lastKeycode: "",
    keys: [] as String[],
};

document.addEventListener("keydown", function (event: KeyboardEvent) {
    if (!keyboard.keys.includes(event.key)) {
        keyboard.keys.push(event.key);
    }
});

document.addEventListener("keyup", function (event: KeyboardEvent) {
    keyboard.keys = keyboard.keys.filter(function (key) {
        return key !== event.key;
    });
});

/**
 * @param callback function to call whenever the mousemove event fires
 * @returns void
 */
export function listenMouseMoved(callback: Function): void {
    document.addEventListener("mousemove", function (event: MouseEvent) {
        mouse.x = event.pageX;
        mouse.y = event.pageY;
        callback(event);
    });
}

/**
 * @param callback function to call whenever the click event fires
 * @returns void
 */
export function listenMouseClicked(callback: Function): void {
    document.addEventListener("click", function (event: MouseEvent) {
        mouse.x = event.pageX;
        mouse.y = event.pageY;
        callback(event);
    });
}

/**
 * @param callback function to call whenever the mousedown event fires
 * @returns void
 */
export function listenMouseDown(callback: Function): void {
    document.addEventListener("mousedown", function (event: MouseEvent) {
        mouse.x = event.pageX;
        mouse.y = event.pageY;
        callback(event);
    });
}

/**
 * @param callback function to call whenever the mouseup event fires
 * @returns void
 */
export function listenMouseUp(callback: Function): void {
    document.addEventListener("mouseup", function (event: MouseEvent) {
        mouse.x = event.pageX;
        mouse.y = event.pageY;
        callback(event);
    });
}

/**
 * @param callback function to call whenever the mousedragged conditions are met
 * @returns void
 */
export function listenMouseDragged(callback: Function): void {
    document.addEventListener("mousedown", function (event: MouseEvent) {
        mouse.leftClick = true;
        mouse.x = event.pageX;
        mouse.y = event.pageY;
        mouseDragStartX = mouse.x;
        mouseDragStartY = mouse.y;
    });
    document.addEventListener("mousemove", function (event: MouseEvent) {
        if (mouse.dragging) {
            mouse.x = event.pageX;
            mouse.y = event.pageY;
            callback();
        } else if (
            mouse.leftClick &&
            (Math.abs(mouseDragStartX - event.pageX) > DRAGDIST ||
                Math.abs(mouseDragStartY - event.pageY) > DRAGDIST)
        ) {
            mouse.x = event.pageX;
            mouse.y = event.pageY;
            mouse.dragging = true;
            callback();
        }
    });
    document.addEventListener("mouseup", function (event: MouseEvent) {
        mouse.dragging = false;
        mouse.x = event.pageX;
        mouse.y = event.pageY;
    });
}

/**
 * @param callback function to call whenever the keypress event fires
 * @returns void
 */
export function listenKeyPressed(callback: Function): void {
    document.addEventListener("keypress", function (event: KeyboardEvent) {
        keyboard.lastKey = event.key;
        keyboard.lastKeycode = event.code;
        callback();
    });
}

/**
 * @param callback function to call whenever the keydown event fires
 * @returns void
 */
export function listenKeyDown(callback: Function): void {
    document.addEventListener("keydown", function (event: KeyboardEvent) {
        keyboard.lastKey = event.key;
        keyboard.lastKeycode = event.code;
        callback();
    });
}

/**
 * @param callback function to call whenever the keyup event fires
 * @returns void
 */
export function listenKeyUp(callback: Function): void {
    document.addEventListener("keyup", function (event: KeyboardEvent) {
        keyboard.lastKey = event.key;
        keyboard.lastKeycode = event.code;
        callback();
    });
}
