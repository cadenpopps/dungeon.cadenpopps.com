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
 * @param amplitude value to amplify oscillation
 * @param center value to center oscillation around
 * @returns a mapped value between -amplitude and +amplitude, centered around center
 */
export function osc(
    value: number,
    amplitude?: number,
    center?: number
): number {
    if (amplitude === undefined) {
        return Math.sin(value);
    } else if (center === undefined) {
        return Math.sin(value) * amplitude;
    } else {
        return Math.sin(value) * amplitude + center;
    }
}

/**
 * @param max maximum value (exclusive)
 * @returns a random float between 0 and max
 */
export function random(max?: number): number {
    if (max && max > 0) {
        return Math.random() * max;
    } else {
        return 0;
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
export function randomInt(max?: number): number {
    if (!max || max <= 0) {
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
        return Math.floor(this.randomInRange(val1, val2));
    } else {
        return Math.floor(this.randomInRange(val2, val1));
    }
}

/**
 * @param value value to round
 * @param decimals amount of decimals to keep
 * @returns a value rounded to the nearest decimal place
 */
export function round(value: number, decimals?: number): number {
    let factor = 1;
    if (decimals) {
        factor = Math.pow(10, decimals);
    }
    return Math.round(value * factor) / factor;
}

/**
 * @param chance denominator for the 1/X chance
 * @returns true if a randomly generated number between 0 and chance is less than 1
 */
export function oneIn(chance: number): boolean {
    return 1 > this.random(chance);
}

/**
 * @param value value to floor
 * @returns value rounded down to the nearest integer
 */
export function floor(value: number): number {
    return Math.floor(value);
}

/**
 * @param value value to floor
 * @returns value rounded up to the nearest integer
 */
export function ceil(value: number): number {
    return Math.ceil(value);
}

/**
 * @param val1 value one
 * @param val2 value two
 * @returns the minimum of value one and two
 */
export function min(val1: number, val2: number): number {
    return Math.min(val1, val2);
}

/**
 * @param val1 value one
 * @param val2 value two
 * @returns the maximum of value one and two
 */
export function max(val1: number, val2: number): number {
    return Math.max(val1, val2);
}

/**
 * @param value value to constrain between low and high
 * @param min the minimum cutoff (inclusive)
 * @param max the maximum cutoff (inclusive)
 * @returns the value if it is between min and max, otherwise the min or max
 */
export function constrain(value: number, min: number, max: number): number {
    return this.min(this.max(value, min), max);
}

/**
 * @param value value to map from one range onto another
 * @param min1 minimum value of range 1 (inclusive)
 * @param max1 maximum value of range 1 (inclusive)
 * @param min2 minimum value of range 2 (inclusive)
 * @param max2 maximum value of range 2 (inclusive)
 * @returns a value from range 2 that corresponds to the provided value in range 1
 */
export function map(
    value: number,
    min1: number,
    max1: number,
    min2: number,
    max2: number
): number {
    value = this.constrain(value, min1, max1);
    const scale = (max2 - min2) / (max1 - min1);
    return min2 + (value - min1) * scale;
}
