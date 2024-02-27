import * as PoppsMath from "../lib/PoppsMath";

describe("abs()", () => {
    it("should return positive number if input is positive", () => {
        expect(PoppsMath.abs(1) > 0).toBe(true);
    });

    it("should return positive number if input is negative", () => {
        expect(PoppsMath.abs(-1) > 0).toBe(true);
    });

    it("should return 0 if input is 0", () => {
        expect(PoppsMath.abs(0)).toBe(0);
    });
});

describe("distance()", () => {
    it("should return 1 for (0,0) (0,1)", () => {
        expect(PoppsMath.distance(0, 0, 0, 1)).toBe(1);
    });

    it("should return 5 for 3, 4, 5 triangle", () => {
        expect(PoppsMath.distance(0, 0, 4, 3)).toBe(5);
    });
});

describe("osc()", () => {
    it("should start at 0", () => {
        expect(PoppsMath.osc(0)).toBe(0);
    });

    it("should output 1 for input PI/2", () => {
        expect(PoppsMath.osc(Math.PI / 2)).toBe(1);
    });

    it("should output 2 for amplitude 2", () => {
        expect(PoppsMath.osc(Math.PI / 2, 2)).toBe(2);
    });

    it("should output -2 for amplitude 2 and center -4", () => {
        expect(PoppsMath.osc(Math.PI / 2, 2, -4)).toBe(-2);
    });
});

describe("random()", () => {
    it("should give output greater or equal to 0 and less than 1", () => {
        const rand = PoppsMath.random();
        expect(rand >= 0 && rand < 1).toBe(true);
    });

    it("should give output greater or equal to 0 and less than input", () => {
        const rand = PoppsMath.random(5);
        expect(rand >= 0 && rand < 5).toBe(true);
    });

    it("should return 0 with bad input", () => {
        expect(PoppsMath.random(-1)).toBe(0);
    });
});

describe("randomInRange()", () => {
    it("should give output greater or equal to val1 and less than val2", () => {
        const rand = PoppsMath.randomInRange(1, 5);
        expect(rand >= 1 && rand < 5).toBe(true);
    });

    it("should give output greater or equal to val2 and less than val1 if val1 is larger", () => {
        const rand = PoppsMath.randomInRange(5, 1);
        expect(rand >= 1 && rand < 5).toBe(true);
    });
});

describe("randomInt()", () => {
    it("should output integer", () => {
        expect(Number.isInteger(PoppsMath.randomInt(5))).toBe(true);
    });

    it("should output 0 with no input", () => {
        expect(PoppsMath.randomInt()).toBe(0);
    });

    it("should output 0 with negative input", () => {
        expect(PoppsMath.randomInt(-5)).toBe(0);
    });
});

describe("randomInRange()", () => {
    it("should output integer greater or equal to val1 and less than val2", () => {
        expect(Number.isInteger(PoppsMath.randomIntInRange(1, 5))).toBe(true);
    });

    it("should  output integer greater or equal to val2 and less than val1 if val1 is larger", () => {
        expect(Number.isInteger(PoppsMath.randomIntInRange(5, 1))).toBe(true);
    });
});

describe("round()", () => {
    it("should round down to the nearest hundredth", () => {
        expect(PoppsMath.round(2.1234, 2)).toBe(2.12);
    });

    it("should round up to the nearest hundredth", () => {
        expect(PoppsMath.round(2.9876, 2)).toBe(2.99);
    });

    it("should round to the nearest integer if decimals is 0", () => {
        expect(PoppsMath.round(2.9876, 0)).toBe(3);
    });

    it("should round to the nearest integer if decimals is undefined", () => {
        expect(PoppsMath.round(2.9876)).toBe(3);
    });

    it("should round to the nearest ten-thousanth", () => {
        expect(PoppsMath.round(2.9876, 6)).toBe(2.9876);
    });
});

describe("oneIn()", () => {
    it("should return true if random value is less than 1", () => {
        jest.spyOn(PoppsMath, "random").mockReturnValue(0.5);
        expect(PoppsMath.oneIn(20)).toBe(true);
    });

    it("should return false if random value is greater than 1", () => {
        jest.spyOn(PoppsMath, "random").mockReturnValue(4.5);
        expect(PoppsMath.oneIn(20)).toBe(false);
    });
});

describe("floor()", () => {
    it("it should return the closest integer smaller than the input", () => {
        expect(PoppsMath.floor(3.24)).toBe(3);
    });

    it("it should return the closest integer smaller than or equal to the input", () => {
        expect(PoppsMath.floor(3)).toBe(3);
    });
});

describe("ceil()", () => {
    it("it should return the closest integer larger than the input", () => {
        expect(PoppsMath.ceil(2.12)).toBe(3);
    });

    it("it should return the closest integer larger than or equal to the input", () => {
        expect(PoppsMath.ceil(3)).toBe(3);
    });
});

describe("min()", () => {
    it("it should return the minimum of two values", () => {
        expect(PoppsMath.min(3, 5)).toBe(3);
    });

    it("it should return the minimum of two negative values", () => {
        expect(PoppsMath.min(-3, -1)).toBe(-3);
    });
});

describe("max()", () => {
    it("it should return the maximum of two values", () => {
        expect(PoppsMath.max(3, 5)).toBe(5);
    });

    it("it should return the maximum of two negative values", () => {
        expect(PoppsMath.max(-3, -1)).toBe(-1);
    });
});

describe("constrain()", () => {
    it("it should return the input if between min and max", () => {
        expect(PoppsMath.constrain(2, 0, 10)).toBe(2);
    });

    it("it should return the min if the input is below the min", () => {
        expect(PoppsMath.constrain(-2, 0, 10)).toBe(0);
    });

    it("it should return the min if the input is above the max", () => {
        expect(PoppsMath.constrain(20, 0, 10)).toBe(10);
    });
});

describe("map()", () => {
    it("should return a mapped value between the range 2 min and max", () => {
        expect(PoppsMath.map(2, 0, 10, 0, 100)).toBe(20);
    });

    it("should return the min of range 2 if input is below the min of range 1", () => {
        expect(PoppsMath.map(-1, 0, 10, 0, 100)).toBe(0);
    });

    it("should return the max of range 2 if input is above the max of range 1", () => {
        expect(PoppsMath.map(20, 0, 10, 0, 100)).toBe(100);
    });

    it("should return the halfway point of range 2 if input is the halfway point of range 1", () => {
        expect(PoppsMath.map(2, 1, 3, 200, 400)).toBe(300);
    });
});
