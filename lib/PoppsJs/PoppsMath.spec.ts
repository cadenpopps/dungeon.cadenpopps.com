import * as PoppsMath from "./PoppsMath";

describe("abs()", () => {
    test("should return positive number if input is positive", () => {
        expect(PoppsMath.abs(1) > 0).toBe(true);
    });

    test("should return positive number if input is negative", () => {
        expect(PoppsMath.abs(-1) > 0).toBe(true);
    });

    test("should return 0 if input is 0", () => {
        expect(PoppsMath.abs(0)).toBe(0);
    });
});
