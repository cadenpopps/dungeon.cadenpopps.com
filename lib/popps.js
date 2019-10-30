const DRAGDIST = 10, CORNER = 0, CENTER = 1, COORD = 2, INT = "int", POSITIVE = 0, NEGATIVE = 1;

var preloading;
var canvasElement, canvas, invisibleCanvasElement, invisCanvas;
var windowWidth, windowHeight, width, height;
var looping = false, frameRate = undefined, lastFrameTime = 0, frameCount = 0;
var font = "sans-serif", fontSize = "10px";
var mouseIsDown = false, mouseX = 0, mouseY = 0;
var canvasX = 0, canvasY = 0;
var key = '', keycode = -1, keys = [], shift = false;
var startTime;
var dragStartX, dragStartY, dragging;
var _audioManager = undefined;

document.addEventListener("DOMContentLoaded", function (event) {
	initializeValues();
	if (typeof preload === "function" && typeof setup === "function") {
		preloading = true;
		preload();
		preloadInterval = setInterval(function () {
			if (itemsLoaded == preloadCounter) {
				preloading = false;
				clearInterval(preloadInterval);
				startPoppsJs();
			}
		}, 10);
	}
	else if (typeof setup === "function") {
		startPoppsJs();
	}
	else {
		throw new Error("No setup function found");
	}
});

function initializeValues() {
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
	startTime = new Date();
}

function startPoppsJs() {
	listeners();
	setup();
}

function listen() {
	throw new Error("The function listen() is depreceated");
}

function listeners() {
	if (typeof mouseDown === 'function') {
		document.addEventListener("mousedown", function (e) { mouseDownListener(e); });
	}
	if (typeof mouseUp === 'function') {
		document.addEventListener("mouseup", function (e) { mouseUpListener(e); });
	}
	if (typeof mouseMoved === 'function') {
		document.addEventListener("mousemove", function (e) { mouseMovedListener(e); });
	}
	if (typeof mouseClicked === 'function') {
		document.addEventListener("click", function (e) { mouseClickedListener(e); });
	}
	if (typeof mouseDragged === 'function') {
		document.addEventListener("mousedown", function (e) {
			dragStartX = event.pageX;
			dragStartY = event.pageY;
			mouseIsDown = true;
		});
		document.addEventListener("mousemove", function (e) {
			if (mouseIsDown && abs(dragStartX - event.pageX) > DRAGDIST && abs(dragStartY - event.pageY) > DRAGDIST) {
				dragging = true;
			}
			if (dragging) {
				mouseDraggedListener(e);
			}
		});
		document.addEventListener("mouseup", function () {
			mouseIsDown = false;
			setTimeout(() => {
				dragging = false;
			}, 10);
		});
	}

	if (typeof keyPressed === 'function') {
		document.addEventListener("keypress", function (e) { keyPressedListener(e); });
	}
	if (typeof keyDown === 'function') {
		document.addEventListener("keydown", function (e) { keyDownListener(e); });
		document.addEventListener("keyup", function (e) { removeKey(e.key); });
	}
	if (typeof keyUp === 'function') {
		document.addEventListener("keyup", function (e) { keyUpListener(e); });
	}

	if (typeof windowResized === 'function') {
		window.addEventListener("resize", windowResizedListener);
	}
}

function updateMouseCoords(e) {
	mouseX = e.pageX - canvasX;
	mouseY = e.pageY - canvasY;
}

function mouseMovedListener(e) {
	updateMouseCoords(e);
	mouseMoved(e);
}

function mouseClickedListener(e) {
	if (!dragging) {
		updateMouseCoords(e)
		mouseClicked(e);
	}
}

function mouseDownListener(e) {
	mouseIsDown = true;
	updateMouseCoords(e);
	mouseDown(e);
}

function mouseUpListener(e) {
	mouseIsDown = false;
	updateMouseCoords(e);
	mouseUp(e);
}

function mouseDraggedListener(e) {
	updateMouseCoords(e);
	mouseDragged(e);
}

function updateKeys(e) {
	key = e.key;
	keycode = e.keyCode;
}

function addKey(k) {
	if(keycode == 16){
		shifting = true;
	}
	else {
		k = k.toLowerCase();
		if (keys.indexOf(k) == -1 && k.length == 1) {
			keys.push(k);
		}
	}
}

function removeKey(k) {
	if(keycode == 16){
		shifting = false;
	}
	else{
		k = k.toLowerCase();
		for (let i = keys.length - 1; i >= 0; i--) {
			if (keys[i] == k) keys.splice(i, 1);
		}
	}
}

function keyPressedListener(e) {
	updateKeys(e);
	keyPressed(e);
}

function keyDownListener(e) {
	updateKeys(e);
	addKey(e.key);
	keyDown(e);
}

function keyUpListener(e) {
	updateKeys(e);
	removeKey(e.key);
	keyUp(e);
}

function keyIsDown(k) {
	for (let key of keys) {
		if (k == key) return true;
	}
	return false;
}

function windowResizedListener() {
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
	windowResized();
}

function loop(f) {
	looping = true;
	frameCount = 0;
	if (f) {
		frameRate = f;
		frameTime = 1000 / f;
	}
	requestAnimationFrame(frameUpdate);
}

function noLoop() {
	looping = false;
}

function frameUpdate() {
	if (looping) {
		requestAnimationFrame(frameUpdate);

		if (frameRate && millis() - lastFrameTime > frameTime) {
			frameCount++;
			draw();
		}
		else if (frameRate === undefined) {
			frameCount++;
			draw();
		}
	}
}

function millis() {
	var endTime = new Date();
	return endTime - startTime;
}

function createCanvas(w, h, parent) {
	if (parent) {
		canvasElement = document.getElementById("" + parent);
	}
	else {
		canvasElement = document.createElement("canvas");
		document.getElementsByTagName("BODY")[0].append(canvasElement);
	}
	canvas = canvasElement.getContext("2d");
	canvas.canvas.width = w;
	canvas.canvas.height = h;
	width = w;
	height = h;
	var r = canvasElement.getBoundingClientRect();
	// var scrollTop = document.documentElement.scrollTop ?
	// 	document.documentElement.scrollTop : document.body.scrollTop;
	// var scrollLeft = document.documentElement.scrollLeft ?
	// 	document.documentElement.scrollLeft : document.body.scrollLeft;
	canvasX = r.left;
	canvasY = r.top;

	window.addEventListener("scroll", function (event) {
		var r = canvasElement.getBoundingClientRect();
		scrollTop = document.documentElement.scrollTop ?
			document.documentElement.scrollTop : document.body.scrollTop;
		scrollLeft = document.documentElement.scrollLeft ?
			document.documentElement.scrollLeft : document.body.scrollLeft;
		canvasX = r.left + scrollLeft;
		canvasY = r.top + scrollTop;
	});
	return canvas;
}

function createInvisibleCanvas() {
	if (invisCanvas == undefined) {
		invisibleCanvasElement = document.createElement("canvas");
		invisCanvas = invisibleCanvasElement.getContext("2d");
		invisCanvas.canvas.width = 0;
		invisCanvas.canvas.height = 0;
		return invisibleCanvasElement;
	}
}

function resizeCanvas(w, h) {
	canvas.canvas.width = w;
	canvas.canvas.height = h;
	width = w;
	height = h;
}

function resizeInvisibleCanvas(w, h) {
	if (invisCanvas != undefined) {
		invisCanvas.canvas.width = w;
		invisCanvas.canvas.height = h;
		invisibleCanvasElement.style.width = w;
		invisibleCanvasElement.style.height = h;
	}
}

function fill(r, g, b, a) {
	var f = "rgb";
	if (r === undefined) {
		f += "(0,0,0)";
		canvas.fillStyle = f;
		return;
	}
	r = Math.round(r);
	if (g === undefined) {
		f += "(" + r + "," + r + "," + r + ")";
		canvas.fillStyle = f;
		return;
	}
	g = Math.round(g);
	b = Math.round(b);
	if (a === undefined) {
		f += "(" + r + "," + g + "," + b + ")";
		canvas.fillStyle = f;
		return;
	}
	f += "a(" + r + "," + g + "," + b + "," + a;
	canvas.fillStyle = f;
	return;
}

function stroke(r, g, b, a) {
	var f = "rgb";
	if (r === undefined) {
		f += "(0,0,0)";
		canvas.strokeStyle = f;
		return;
	}
	r = Math.round(r);
	if (g === undefined) {
		f += "(" + r + "," + r + "," + r + ")";
		canvas.strokeStyle = f;
		return;
	}
	g = Math.round(g);
	b = Math.round(b);
	if (a === undefined) {
		f += "(" + r + "," + g + "," + b + ")";
		canvas.strokeStyle = f;
		return;
	}
	f += "a(" + r + "," + g + "," + b + "," + a;
	canvas.strokeStyle = f;
	return;
}

function strokeWidth(w) {
	canvas.lineWidth = w;
}

function noStroke() {
	canvas.strokeStyle = "transparent";
}

function font(f) {
	font = f;
	canvas.font = "" + fontSize + font;
}

function fontSize(s) {
	fontSize = s;
	canvas.font = "" + fontSize + font;
}

function background(r, g, b, a) {
	var t = canvas.fillStyle;
	fill(r, g, b, a);
	canvas.beginPath();
	canvas.rect(0, 0, width, height);
	canvas.fill();
	canvas.fillStyle = t;
}

function clearBackground() {
	canvas.clearRect(0, 0, width, height);
}

function rect(x1, y1, x2, y2, type) {
	canvas.beginPath();
	if (type === undefined) {
		canvas.rect(x1, y1, x2, y2);
	}
	else if (type == 1) {
		canvas.rect(x1 - (x2 / 2), y1 - (y2 / 2), x2, y2);
	}
	else if (type == 2) {
		canvas.rect(x1, y1, x2 - x1, y2 - y1);
	}
	else {
		console.log("Invalid Rectangle Type");
		canvas.closePath();
		return;
	}
	canvas.fill();
}

function strokeRect(x1, y1, x2, y2, type) {
	canvas.beginPath();
	if (type === undefined || type === CORNER) {
		canvas.rect(x1, y1, x2, y2);
	}
	else if (type == CENTER) {
		canvas.rect(x1 - (x2 / 2), y1 - (y2 / 2), x2, y2);
	}
	else if (type == COORD) {
		canvas.rect(x1, y1, x2 - x1, y2 - y1);
	}
	else {
		console.log("Invalid Rectangle Type");
		canvas.closePath();
		return;
	}
	canvas.stroke();
}

function line(x1, y1, x2, y2, w) {
	canvas.beginPath();
	canvas.moveTo(x1, y1);
	canvas.lineTo(x2, y2);
	if (w) {
		var t = canvas.lineWidth;
		strokeWidth(w);
		canvas.stroke();
		strokeWidth(t);
	}
	else {
		canvas.stroke();
	}
}

function ellipse(x, y, r) {
	canvas.beginPath();
	if (r) {
		canvas.arc(x, y, r, 0, 2 * Math.PI);
	}
	else {
		canvas.arc(x, y, 1, 0, 2 * Math.PI);
	}
	canvas.fill();
}

function strokeEllipse(x, y, r) {
	canvas.beginPath();
	if (r) {
		canvas.arc(x, y, r, 0, 2 * Math.PI);
	}
	else {
		canvas.arc(x, y, 1, 0, 2 * Math.PI);
	}
	canvas.stroke();
}

function arc(x, y, r, startAngle, endAngle, ant) {
	canvas.beginPath();
	if (ant) {
		canvas.arc(x, y, r, startAngle, endAngle, true);
	}
	else {
		canvas.arc(x, y, r, startAngle, endAngle);
	}
	canvas.fill();
}

function strokeArc(x, y, r, startAngle, endAngle, ant) {
	canvas.beginPath();
	if (ant) {
		canvas.arc(x, y, r, startAngle, endAngle, true);
	}
	else {
		canvas.arc(x, y, r, startAngle, endAngle);
	}
	canvas.stroke();
}

function point(x, y, r) {
	canvas.beginPath();
	if (r) {
		canvas.arc(x, y, r, 0, 2 * Math.PI);
	}
	else {
		canvas.arc(x, y, 1, 0, 2 * Math.PI);
	}
	canvas.fill();
}

function strokePoint(x, y, r) {
	canvas.beginPath();
	if (r) {
		canvas.arc(x, y, r, 0, 2 * Math.PI);
	}
	else {
		canvas.arc(x, y, 1, 0, 2 * Math.PI);
	}
	canvas.stroke();
}

function text(t, x, y) {
	canvas.fillText(t, x, y);
}

function strokeText(t, x, y) {
	canvas.strokeText(t, x, y);
}

function image(img, sx, sy, sWidth, sHeight, x, y, width, height) {
	if (img != undefined) {
		if (sWidth === undefined) {
			canvas.drawImage(img, sx, sy);
		}
		else if (x === undefined) {
			canvas.drawImage(img, sx, sy, sWidth, sHeight);
		}
		else {
			canvas.drawImage(img, sx, sy, sWidth, sHeight, x, y, width, height);
		}
	}
}

// -------------------------------   Data Structures   -------------------------------

function _delete(object) {
	object = null;
	delete object;
}

preloadCounter = 0;
itemsLoaded = 0;

function loadJSON(path) {
	if (preloading) preloadCounter++;
	var req = new XMLHttpRequest();
	req.overrideMimeType("application/json");
	req.open('GET', path, false);
	req.send(null);
	if (req.readyState == 4 && req.status == "200") {
		if (preloading) {
			itemsLoaded++;
		}
		return JSON.parse(req.responseText);
	} else {
		console.log("Error loading JSON");
	}
}

function loadImage(url) {
	if (preloading) preloadCounter++;
	let img = new Image();
	if (preloading) {
		img.onload = function () {
			itemsLoaded++;
		}
	}
	img.src = url;
	return img;
}

function getCropped(img, sx, sy, width, height) {
	createInvisibleCanvas();
	resizeInvisibleCanvas(width, height);
	invisCanvas.drawImage(img, sx, sy, width, height, 0, 0, width, height);
	return loadImage(invisibleCanvasElement.toDataURL());
}

function loadAudio(src) {
	if (_audioManager == undefined) initializeAudio();
	return new PoppsSoundBuffer(src);
}

// function 

function initializeAudio() {
	_audioManager = new PoppsAudioManager();
}

function loadBuffer(src, pointer) {
	let request = new XMLHttpRequest();
	request.open('GET', src, true);
	request.responseType = 'arraybuffer';
	request.onload = function () {
		_audioManager.audioContext.decodeAudioData(
			request.response,
			function (buffer) {
				pointer.ready = true;
				pointer.buffer = buffer;
				// pointer.onload();
				_audioManager.sounds.push(pointer);
			},
			function (e) {
				console.log("Fail");
			}
		)
	}
	request.send();
}

function PoppsAudioManager() {
	this.sounds = [];
	this.activeSounds = [];
	this.audioContext = new AudioContext();
}

function playSound(poppsSoundBuffer, delay, startPoint, duration) {
	return new PoppsSound(poppsSoundBuffer, delay, startPoint, duration);
}

function stopAllSounds() {
	for (let s of _audioManager.activeSounds) {
		s.stop();
	}
	_audioManager.activeSounds = [];
}

function PoppsSoundBuffer(src) {
	this.ready = false;
	loadBuffer(src, this);
}

function PoppsSound(poppsSoundBuffer, delay, startPoint, duration) {
	this.playing = true;
	this.loops = false;
	this.sound = _audioManager.audioContext.createBufferSource();
	if (poppsSoundBuffer.ready) {
		this.init(poppsSoundBuffer, delay, startPoint, duration);
	}
	else {
		let bufferCheckInterval = setInterval(() => {
			if (poppsSoundBuffer.ready) {
				clearInterval(bufferCheckInterval);
				bufferCheckInterval = undefined;
				this.init(poppsSoundBuffer, delay, startPoint, duration);
			}
		}, 10);
	}

	this.sound.onended = function () {
		this.delete();
	}.bind(this);
}

PoppsSound.prototype.init = function (poppsSoundBuffer, delay, startPoint, duration) {
	this.sound.buffer = poppsSoundBuffer.buffer;
	this.sound.connect(_audioManager.audioContext.destination);
	this.sound.start(delay, startPoint, duration);
	_audioManager.activeSounds.push(this);
}

PoppsSound.prototype.volume = function (vol) {
	this.sound.volume = vol;
}

PoppsSound.prototype.loop = function () {
	this.loops = true;
	this.sound.loop = true;
}

PoppsSound.prototype.noloop = function () {
	this.loops = true;
	this.sound.loop = false;
}

PoppsSound.prototype.stop = function () {
	this.sound.stop()
	this.sound.disconnect();
	_audioManager.activeSounds.splice(_audioManager.activeSounds.indexOf(this), 1);
	this.delete();
}

PoppsSound.prototype.pauseSound = function () {
	if (this.playing) {
		this.sound.disconnect();
		this.playing = false;
	}
}

PoppsSound.prototype.resumeSound = function () {
	if (!this.playing) {
		this.sound.connect(_audioManager.audioContext.destination);
		// this.audio.start();
		this.playing = true;
	}
}

PoppsSound.prototype.delete = function () {
	this.ended();
	_audioManager.activeSounds.splice(_audioManager.activeSounds.indexOf(this), 1);
	delete this.playing;
	delete this.sound;
	_delete(this);
}

PoppsSound.prototype.ended = function () { };


function createVector(val1, val2, val3) {
	if (val1 && val2 && val3) {
		return new Vector(val1, val2, val3);
	}
	if (val1 && val2) {
		return new Vector(val1, val2);
	}
	if (val1) {
		return new Vector(val1, 0);
	}
	return new Vector(0, 0);
}

function Vector(val1, val2) {
	this.x = val1;
	this.y = val2;
}

Vector.prototype.set = function (val1, val2) {
	if (val2) {
		this.x = val1;
		this.y = val2;
		return this;
	}
	if (val1) {
		this.x = val1;
		this.y = 0;
		return this;
	}
	this.x = 0;
	this.y = 0;
	return this;
}
Vector.prototype.mult = function (v2) {
	if (typeof v2 === 'number') {
		this.x *= v2;
		this.y *= v2;
	}
	else {
		this.x *= v2.x;
		this.y *= v2.y;
	}
	return this;
}
Vector.prototype.div = function (v2) {
	if (typeof v2 === 'number') {
		this.x *= v2;
		this.y *= v2;
	}
	else {
		this.x *= v2.x;
		this.y *= v2.y;
	}
	return this;
}
Vector.prototype.add = function (v2) {
	if (typeof v2 === 'number') {
		this.x += v2;
		this.y += v2;
	}
	else {
		this.x += v2.x;
		this.y += v2.y;
	}
	return this;
}
Vector.prototype.sub = function (v2) {
	if (typeof v2 === 'number') {
		this.x -= v2;
		this.y -= v2;
	}
	else {
		this.x -= v2.x;
		this.y -= v2.y;
	}
	return this;
}

function applyForces(pos, vel, acc) {
	pos.add(vel);
	vel.add(acc);
}

// -------------------------------   Math   -------------------------------

function abs(val) {
	return Math.abs(val);
}

function dist(x1, y1, x2, y2) {
	return Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
}

function osc(val, center, amp, type) {
	if (center === undefined) {
		return Math.sin(val)
	}
	if (amp === undefined) {
		return Math.sin(val) + center;
	}
	if (type === undefined) {
		return (Math.sin(val) * amp) + center;
	}
	if (type === POSITIVE) {
		return (Math.abs(Math.sin(val)) * amp) + center;
	}
	if (type === NEGATIVE) {
		return (-Math.abs(Math.sin(val)) * amp) + center;
	}
}

function oscSpeed(val, center, amp, speed, type) {
	if (center === undefined) {
		return Math.sin(val)
	}
	if (amp === undefined) {
		return Math.sin(val) + center;
	}
	if (speed === undefined) {
		return (Math.sin(val) * amp) + center;
	}
	if (type === undefined) {
		return (Math.sin(val * speed) * amp) + center;
	}
	if (type === POSITIVE) {
		return (Math.abs(Math.sin(val * speed)) * amp) + center;
	}
	if (type === NEGATIVE) {
		return (-Math.abs(Math.sin(val * speed)) * amp) + center;
	}
}

function random(low, high) {
	if (high) {
		return map(Math.random(), 0, 1, low, high);
	}
	if (low) {
		if (Array.isArray(low)) {
			return low[randomInt(low.length)];
		}
		return Math.random() * low;
	}
	return Math.random();
}

function randomInt(low = 0, high) {
	if (high) {
		return floor(random(low, high));
	}
	return floor(random(low));
}

function randomRound(amp, round) {
	if (amp === undefined) {
		return Math.random();
	}
	if (round === undefined) {
		return Math.random() * amp;
	}
	if (typeof round === 'string') {
		return Math.floor(Math.random() * amp);
	}
	var factor = Math.pow(10, round - 3);
	return Math.floor((Math.random() * amp) * factor) / factor;
}

function oneIn(chance) {
	return (1 > random(chance));
}

function fiftyFifty() {
	return (random(1) < .5);
}

function map(val, low1, high1, low2, high2) {
	val = constrain(val, low1, high1);
	var scale = (high2 - low2) / (high1 - low1);
	var dif = low2 - low1;
	return (val * scale) + dif;
}

function floor(val) {
	return Math.floor(val);
}

function ceil(val) {
	return Math.ceil(val);
}

function constrainLow(v, l) {
	return Math.max(v, l);
}

function constrainHigh(v, h) {
	return Math.min(v, h);
}

function min(v1, v2) {
	return Math.min(v1, v2);
}

function max(v1, v2) {
	return Math.max(v1, v2);
}

function constrain(v, l, h) {
	return constrainHigh(constrainLow(v, l), h);
}
