function MusicManager() {

    let music = MUSIC;
    MUSIC = null;
    let currentLoop = music[0];

    let loop = function () {
        currentLoop.ended = function () {
            currentLoop = playSound(music[randomInt(music.length)]);
            loop();
        }
    }

    let init = (function () {
        // currentLoop = playSound(currentLoop);
        // loop();
    })();
}