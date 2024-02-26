/**
 * @param value any numerical value
 * @returns the absolute value of the input
 */
export function abs(value: number): number {
    return Math.abs(value);
}

/**
 * @param x1 x coordinate of point 1
 * @param y1 y coordinate of point 1
 * @param x2 x coordinate of point 2
 * @param y2 y coordinate of point 2
 * @returns the distance between point 1 and point 2
 */
export function distance(
    x1: number,
    y1: number,
    x2: number,
    y2: number
): number {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

/**
 * @param value value to map
 * @param center value to center oscillation around
 * @param amplitude value to amplify oscillation
 * @returns a mapped value between -amplitude and +amplitude, centered around center
 */
export function osc(value: number, center: number, amplitude: number): number {
    if (center === undefined) {
        return Math.sin(value);
    } else if (amplitude === undefined) {
        return Math.sin(value) + center;
    } else {
        return Math.sin(value) * amplitude + center;
    }
}

/**
 * @param max maximum value (exclusive)
 * @returns a random float between 0 and max
 */
export function random(max: number): number {
    if (max <= 0) {
        return 0;
    } else {
        return Math.random() * max;
    }
}

/**
 * @param val1 minimum value (inclusive)
 * @param val2 maximum value (exclusive)
 * @returns a random float between val1 and val2
 */
export function randomInRange(val1: number, val2: number): number {
    if (val1 > val2) {
        return val2 + Math.random() * (val1 - val2);
    } else {
        return val1 + Math.random() * (val2 - val1);
    }
}

/**
 * @param max maximum value (exclusive)
 * @returns a random integer between 0 and max
 */
export function randomInt(max: number): number {
    if (max <= 0) {
        return 0;
    } else {
        return Math.floor(this.random(max));
    }
}

/**
 * @param val1 minimum value (inclusive)
 * @param val2 maximum value (exclusive)
 * @returns a random integer between val1 and val2
 */
export function randomIntInRange(val1: number, val2: number): number {
    if (val1 > val2) {
        return Math.floor(val2 + Math.random() * (val1 - val2));
    } else {
        return Math.floor(val1 + Math.random() * (val2 - val1));
    }
}

export function randomRound(amp, round) {
    if (amp === undefined) {
        return Math.random();
    }
    if (round === undefined) {
        return Math.random() * amp;
    }
    if (typeof round === "string") {
        return Math.floor(Math.random() * amp);
    }
    var factor = Math.pow(10, round - 3);
    return Math.floor(Math.random() * amp * factor) / factor;
}

export function oneIn(chance) {
    return 1 > this.random(chance);
}

export function map(value, low1, high1, low2, high2) {
    value = constrain(value, low1, high1);
    var scale = (high2 - low2) / (high1 - low1);
    var dif = low2 - low1;
    return value * scale + dif;
}

export function floor(value) {
    return Math.floor(value);
}

export function ceil(value) {
    return Math.ceil(value);
}

export function min(value, low) {
    return Math.max(value, low);
}

export function max(value, high) {
    return Math.min(value, high);
}

export function getMin(value1, value2) {
    return Math.min(value1, value2);
}

export function getMax(value1, value2) {
    return Math.max(value1, value2);
}

export function constrain(value, low, high) {
    return max(min(value, low), high);
}
