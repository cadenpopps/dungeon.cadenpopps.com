"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.map = exports.constrain = exports.max = exports.min = exports.ceil = exports.floor = exports.oneIn = exports.round = exports.randomIntInRange = exports.randomInt = exports.randomInRange = exports.random = exports.osc = exports.distance = exports.abs = void 0;
function abs(value) {
    return Math.abs(value);
}
exports.abs = abs;
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}
exports.distance = distance;
function osc(value, amplitude, center) {
    if (amplitude === undefined) {
        return Math.sin(value);
    }
    else if (center === undefined) {
        return Math.sin(value) * amplitude;
    }
    else {
        return Math.sin(value) * amplitude + center;
    }
}
exports.osc = osc;
function random(max) {
    if (max && max > 0) {
        return Math.random() * max;
    }
    else {
        return 0;
    }
}
exports.random = random;
function randomInRange(val1, val2) {
    if (val1 > val2) {
        return val2 + Math.random() * (val1 - val2);
    }
    else {
        return val1 + Math.random() * (val2 - val1);
    }
}
exports.randomInRange = randomInRange;
function randomInt(max) {
    if (!max || max <= 0) {
        return 0;
    }
    else {
        return Math.floor(this.random(max));
    }
}
exports.randomInt = randomInt;
function randomIntInRange(val1, val2) {
    if (val1 > val2) {
        return Math.floor(this.randomInRange(val1, val2));
    }
    else {
        return Math.floor(this.randomInRange(val2, val1));
    }
}
exports.randomIntInRange = randomIntInRange;
function round(value, decimals) {
    let factor = 1;
    if (decimals) {
        factor = Math.pow(10, decimals);
    }
    return Math.round(value * factor) / factor;
}
exports.round = round;
function oneIn(chance) {
    return 1 > this.random(chance);
}
exports.oneIn = oneIn;
function floor(value) {
    return Math.floor(value);
}
exports.floor = floor;
function ceil(value) {
    return Math.ceil(value);
}
exports.ceil = ceil;
function min(val1, val2) {
    return Math.min(val1, val2);
}
exports.min = min;
function max(val1, val2) {
    return Math.max(val1, val2);
}
exports.max = max;
function constrain(value, min, max) {
    return this.min(this.max(value, min), max);
}
exports.constrain = constrain;
function map(value, min1, max1, min2, max2) {
    value = this.constrain(value, min1, max1);
    const scale = (max2 - min2) / (max1 - min1);
    const dif = min2 - min1;
    return min2 + (value - min1) * scale;
}
exports.map = map;
//# sourceMappingURL=PoppsMath.js.map