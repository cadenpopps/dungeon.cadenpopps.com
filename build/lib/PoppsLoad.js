export function loadImage(url) {
    let img = new Image();
    img.src = url;
    return img;
}
export function loadJSON(path, reviver) {
    var request = new XMLHttpRequest();
    request.open("GET", path, false);
    request.send(null);
    if (reviver) {
        return JSON.parse(request.responseText, reviver);
    }
    return JSON.parse(request.responseText);
}
//# sourceMappingURL=PoppsLoad.js.map