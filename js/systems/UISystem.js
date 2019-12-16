class UISystem extends System {

	constructor(config, images) {
		super([]);

		this.config = config;
		this.images = images;

		this.titleScreen = document.getElementById('titleScreen');
		this.levelChangeScreen = document.getElementById('levelChangeScreen');
		this.levelChangeText = document.getElementById('levelChangeText');

		this.drawHearts = false;
		this.heartCanvas = document.getElementById('heartCanvas').getContext('2d');
		document.getElementById('heartCanvas').style.left = "" + this.config.HEART_OFFSET + "px";
		document.getElementById('heartCanvas').style.top = "" + this.config.HEART_OFFSET + "px";

	}

	run(engine) {
		if(this.drawHearts) {
			this.drawPlayerHealth(this.heartCanvas, this.player);
		}
	}

	handleEvent(engine, eventID, data) {
		switch(eventID) {
			case event_title_screen:
				this.showTitleScreen(engine);
				break;
			case event_new_game:
				this.fadeScreenIn(this.levelChangeScreen, this.config.LEVEL_CHANGE_FADE_IN_TIME);
				this.drawHearts = false;
				break;
			case event_down_level:
				this.levelChangeText.innerHTML = 'Entering Level ' + (engine.getDepth() + 2)
				this.fadeScreenIn(this.levelChangeScreen, this.config.LEVEL_CHANGE_FADE_IN_TIME);
				this.drawHearts = false;
				break;
			case event_up_level:
				this.levelChangeText.innerHTML = 'Entering Level ' + (engine.getDepth())
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

	// showLevelChangeScreen(engine) {
	// 	this.levelChangeScreen.style.visibility = 'visible';
	// }

	// hideLevelChangeScreen(engine) {
	// 	this.levelChangeScreen.style.visibility = 'hidden';
	// }

	fadeScreenIn(screen, milliseconds) {
		// screen.style.transition = 'opacity';
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

	drawPlayerHealth(heartCanvas, player) {
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

	fixHeartCanvasSize(player) {
		let heartCanvas = document.getElementById('heartCanvas');
		let heartAmount = HealthSystem.getMaxHeartAmount(player);
		let w = (this.config.HEART_SPACING + this.config.HEART_SIZE) * this.config.HEARTS_PER_ROW;
		let h = (this.config.HEART_SPACING + this.config.HEART_SIZE) * ceil(heartAmount / this.config.HEARTS_PER_ROW);
		heartCanvas.width = w;
		heartCanvas.height = h;
	}
}
