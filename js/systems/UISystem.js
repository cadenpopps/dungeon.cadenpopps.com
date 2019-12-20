class UISystem extends System {

	constructor(config, images) {
		super([]);
		this.config = config;
		this.images = images;
	}

	init(engine) {
		this.gameCanvas = document.getElementById('game');
		this.titleScreen = document.getElementById('titleScreen');
		this.levelChangeScreen = document.getElementById('levelChangeScreen');
		this.levelChangeText = document.getElementById('levelChangeText');
		this.gameOverScreen = document.getElementById('gameOverScreen');

		this.drawHearts = false;
		this.heartCanvas = document.getElementById('heartCanvas').getContext('2d');
		document.getElementById('heartCanvas').style.left = "" + this.config.HEART_OFFSET + "px";
		document.getElementById('heartCanvas').style.top = "" + this.config.HEART_OFFSET + "px";
	}

	run(engine) {
		this.drawPlayerHealth(this.heartCanvas, this.player);
	}

	handleEvent(engine, eventID, data) {
		switch(eventID) {
			case event_new_game:
				this.fadeScreenIn(this.levelChangeScreen, this.config.LEVEL_CHANGE_FADE_IN_TIME);
				this.drawHearts = false;
				break;
			case event_title_screen:
				this.showTitleScreen(engine);
				break;
			case event_down_level:
				this.levelChangeText.innerHTML = 'Entering Level ' + (engine.getDepth() + 1);
				this.fadeScreenIn(this.levelChangeScreen, this.config.LEVEL_CHANGE_FADE_IN_TIME);
				this.drawHearts = false;
				break;
			case event_up_level:
				this.levelChangeText.innerHTML = 'Entering Level ' + (engine.getDepth() + 1);
				this.fadeScreenIn(this.levelChangeScreen, this.config.LEVEL_CHANGE_FADE_IN_TIME);
				this.drawHearts = false;
				break;
			case event_begin_level:
				this.fadeScreenOut(this.levelChangeScreen, this.config.LEVEL_CHANGE_FADE_OUT_TIME);
				this.drawHearts = true;
				break;
			case event_player_generated:
				this.fixHeartCanvasSize(this.player);
				break;
			case event_game_over:
				this.showGameOverScreen(engine);
				break;
		}
	}

	addObject(object) {
		if(object instanceof Player) {
			this.player = object;
		}
		super.addObject(object);
	}

	showTitleScreen(engine) {
		this.fadeScreenIn(this.titleScreen, this.config.TITLE_FADE_IN_TIME);

		let self = this;
		document.getElementById('playButton').addEventListener('click', function() {
			self.fadeScreenOut(self.titleScreen, self.config.TITLE_FADE_OUT_TIME);
			engine.sendEvent(event_new_game);
		});

		document.getElementById('helpButton').addEventListener('click', function() {
			document.getElementById('helpScreen').style.visible = 'visible';
		});
	}

	showGameOverScreen(engine) {
		this.fadeScreenIn(this.gameOverScreen, this.config.GAME_OVER_FADE_IN_TIME);
		this.blurCanvas(this.gameCanvas, this.config.GAME_OVER_FADE_IN_TIME);
		this.hideHearts();

		let self = this;
		document.getElementById('playAgainButton').addEventListener('click', function() {
			self.fadeScreenOut(self.gameOverScreen, self.config.GAME_OVER_FADE_OUT_TIME);
			self.unblurCanvas(self.gameCanvas, self.config.GAME_OVER_FADE_OUT_TIME);
			engine.sendEvent(event_reset_game);
			engine.sendEvent(event_new_game, undefined, 20);
		});
	}

	fadeScreenIn(screen, milliseconds) {
		screen.style.transitionDuration = milliseconds + "ms";
		screen.style.opacity = '1';
		screen.style.visibility = 'visible';
	}

	fadeScreenOut(screen, milliseconds) {
		screen.style.transitionDuration = milliseconds + "ms";
		screen.style.opacity = '0';
		setTimeout(function() {
			screen.style.visibility = 'hidden';
		}, milliseconds);
	}

	blurCanvas(canvas, milliseconds) {
		canvas.style.transitionDuration = milliseconds + "ms";
		canvas.style.filter = 'blur(' + this.config.CANVAS_BLUR_AMOUNT + 'px)';
	}

	unblurCanvas(canvas, milliseconds) {
		canvas.style.transitionDuration = milliseconds + "ms";
		canvas.style.filter = 'blur(0)';
	}

	hideHearts() {
		this.heartCanvas.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
		this.drawHearts = false;
	}

	drawPlayerHealth(heartCanvas, player) {
		if(this.drawHearts) {
			let x = 0, y = 0;
			for(let i = 1; i <= HealthSystem.getMaxHeartAmount(player); i++) {
				if(i <= HealthSystem.getCurrentHeartAmount(player)) {
					heartCanvas.drawImage(this.images[ui_heart], (x * this.config.HEART_SIZE) + (x * this.config.HEART_SPACING), (y * this.config.HEART_SIZE), this.config.HEART_SIZE, this.config.HEART_SIZE);
				}
				else {
					heartCanvas.drawImage(this.images[ui_empty_heart], (x * this.config.HEART_SIZE) + (x * this.config.HEART_SPACING), (y * this.config.HEART_SIZE), this.config.HEART_SIZE, this.config.HEART_SIZE);
				}
				x++;
				if(i % this.config.HEARTS_PER_ROW == 0) {
					y++;
					x = 0;
				}
			}
		}
	}

	fixHeartCanvasSize(player) {
		let heartCanvas = document.getElementById('heartCanvas');
		let heartAmount = HealthSystem.getMaxHeartAmount(player);
		let w = (this.config.HEART_SPACING + this.config.HEART_SIZE) * this.config.HEARTS_PER_ROW;
		let h = (this.config.HEART_SPACING + this.config.HEART_SIZE) * ceil(heartAmount / this.config.HEARTS_PER_ROW);
		heartCanvas.width = w;
		heartCanvas.height = h;
	}
}
