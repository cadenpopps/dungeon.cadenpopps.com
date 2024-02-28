export function abs(value) {
    return Math.abs(value);
}
export function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}
export function osc(value, amplitude, center) {
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
export function random(max) {
    if (max && max > 0) {
        return Math.random() * max;
    }
    else {
        return 0;
    }
}
export function randomInRange(val1, val2) {
    if (val1 > val2) {
        return val2 + Math.random() * (val1 - val2);
    }
    else {
        return val1 + Math.random() * (val2 - val1);
    }
}
export function randomInt(max) {
    if (!max || max <= 0) {
        return 0;
    }
    else {
        return Math.floor(this.random(max));
    }
}
export function randomIntInRange(val1, val2) {
    if (val1 > val2) {
        return Math.floor(this.randomInRange(val1, val2));
    }
    else {
        return Math.floor(this.randomInRange(val2, val1));
    }
}
export function round(value, decimals) {
    let factor = 1;
    if (decimals) {
        factor = Math.pow(10, decimals);
    }
    return Math.round(value * factor) / factor;
}
export function oneIn(chance) {
    return 1 > this.random(chance);
}
export function floor(value) {
    return Math.floor(value);
}
export function ceil(value) {
    return Math.ceil(value);
}
export function min(val1, val2) {
    return Math.min(val1, val2);
}
export function max(val1, val2) {
    return Math.max(val1, val2);
}
export function constrain(value, min, max) {
    return this.min(this.max(value, min), max);
}
export function map(value, min1, max1, min2, max2) {
    value = this.constrain(value, min1, max1);
    const scale = (max2 - min2) / (max1 - min1);
    return min2 + (value - min1) * scale;
}
//# sourceMappingURL=PoppsMath.js.map