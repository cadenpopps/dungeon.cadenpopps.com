export function loadImage(url: string): HTMLImageElement {
    let img = new Image();
    img.src = url;
    return img;
}

// export function loadJSON(path: string): Object {
//     var req = new XMLHttpRequest();
//     req.overrideMimeType("application/json");
//     console.log(path);
//     req.open("GET", path, false);
//     req.send(null);
//     if (req.readyState == 4 && req.status == 200) {
//         console.log(req.responseText);
//         return JSON.parse(req.responseText);
//     } else {
//         console.log("Error loading JSON");
//         return {};
//     }
// }

// public createInvisibleCanvas() {
//     if (invisCanvas == undefined) {
//         invisibleCanvasElement = document.createElement("canvas");
//         invisCanvas = invisibleCanvasElement.getContext("2d");
//         invisCanvas.canvas.width = 0;
//         invisCanvas.canvas.height = 0;
//         return invisibleCanvasElement;
//     }
// }

// public resizeInvisibleCanvas(w, h) {
//     if (invisCanvas != undefined) {
//         invisCanvas.canvas.width = w;
//         invisCanvas.canvas.height = h;
//         invisibleCanvasElement.style.width = w;
//         invisibleCanvasElement.style.height = h;
//     }
// }

// public getCropped(img, sx, sy, width, height) {
//     createInvisibleCanvas();
//     resizeInvisibleCanvas(width, height);
//     invisCanvas.drawImage(img, sx, sy, width, height, 0, 0, width, height);
//     return loadImage(invisibleCanvasElement.toDataURL());
// }
