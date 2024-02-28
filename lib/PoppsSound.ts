// function loadAudio(src) {
//     if (_audioManager == undefined) initializeAudio();
//     return new PoppsSoundBuffer(src);
// }

// function initializeAudio() {
//     _audioManager = new PoppsAudioManager();
// }

// function loadBuffer(src, pointer) {
//     let request = new XMLHttpRequest();
//     request.open("GET", src, true);
//     request.responseType = "arraybuffer";
//     request.onload = function () {
//         _audioManager.audioContext.decodeAudioData(
//             request.response,
//             function (buffer) {
//                 pointer.ready = true;
//                 pointer.buffer = buffer;
//                 // pointer.onload();
//                 _audioManager.sounds.push(pointer);
//             },
//             function (e) {
//                 console.log("Fail");
//             }
//         );
//     };
//     request.send();
// }

// function PoppsAudioManager() {
//     this.sounds = [];
//     this.activeSounds = [];
//     this.audioContext = new AudioContext();
// }

// function playSound(poppsSoundBuffer, delay, startPoint, duration) {
//     return new PoppsSound(poppsSoundBuffer, delay, startPoint, duration);
// }

// function stopAllSounds() {
//     for (let s of _audioManager.activeSounds) {
//         s.stop();
//     }
//     _audioManager.activeSounds = [];
// }

// function PoppsSoundBuffer(src) {
//     this.ready = false;
//     loadBuffer(src, this);
// }

// function PoppsSound(poppsSoundBuffer, delay, startPoint, duration) {
//     this.playing = true;
//     this.loops = false;
//     this.sound = _audioManager.audioContext.createBufferSource();
//     if (poppsSoundBuffer.ready) {
//         this.init(poppsSoundBuffer, delay, startPoint, duration);
//     } else {
//         let bufferCheckInterval = setInterval(() => {
//             if (poppsSoundBuffer.ready) {
//                 clearInterval(bufferCheckInterval);
//                 bufferCheckInterval = undefined;
//                 this.init(poppsSoundBuffer, delay, startPoint, duration);
//             }
//         }, 10);
//     }

//     this.sound.onended = function () {
//         this.delete();
//     }.bind(this);
// }

// PoppsSound.prototype.init = function (
//     poppsSoundBuffer,
//     delay,
//     startPoint,
//     duration
// ) {
//     this.sound.buffer = poppsSoundBuffer.buffer;
//     this.sound.connect(_audioManager.audioContext.destination);
//     this.sound.start(delay, startPoint, duration);
//     _audioManager.activeSounds.push(this);
// };

// PoppsSound.prototype.volume = function (vol) {
//     this.sound.volume = vol;
// };

// PoppsSound.prototype.loop = function () {
//     this.loops = true;
//     this.sound.loop = true;
// };

// PoppsSound.prototype.noloop = function () {
//     this.loops = true;
//     this.sound.loop = false;
// };

// PoppsSound.prototype.stop = function () {
//     this.sound.stop();
//     this.sound.disconnect();
//     _audioManager.activeSounds.splice(
//         _audioManager.activeSounds.indexOf(this),
//         1
//     );
//     this.delete();
// };

// PoppsSound.prototype.pauseSound = function () {
//     if (this.playing) {
//         this.sound.disconnect();
//         this.playing = false;
//     }
// };

// PoppsSound.prototype.resumeSound = function () {
//     if (!this.playing) {
//         this.sound.connect(_audioManager.audioContext.destination);
//         // this.audio.start();
//         this.playing = true;
//     }
// };

// PoppsSound.prototype.delete = function () {
//     this.ended();
//     _audioManager.activeSounds.splice(
//         _audioManager.activeSounds.indexOf(this),
//         1
//     );
//     delete this.playing;
//     delete this.sound;
//     _delete(this);
// };

// PoppsSound.prototype.ended = function () {};
