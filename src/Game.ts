import PoppsCanvas from "../lib/PoppsCanvas.js";
import * as PoppsInput from "../lib/PoppsInput.js";

var testFn = function () {
    console.log(PoppsInput.keyboard.keys);
};

PoppsInput.listenKeyDown(testFn);

let c = new PoppsCanvas();

var x = 0;
c.loop(() => {
    c.background(0, 0, 0);
    c.fill(255, 0, 0);
    c.rect(x, 0, 20, 20);
    x += 10;
    if (x > c.width) {
        x = 0;
    }
});

setTimeout(() => {
    c.stop();
}, 3000);
