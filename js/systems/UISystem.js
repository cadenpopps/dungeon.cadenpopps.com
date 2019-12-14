class UISystem extends System {

	constructor(config, images) {
		super([]);

		this.config = config;
		this.images = images;

		this.titleScreen = document.getElementById('titleScreen');

		this.heartCanvas = document.getElementById('heartCanvas').getContext('2d');
		document.getElementById('heartCanvas').style.left = "" + this.config.HEART_OFFSET + "px";
		document.getElementById('heartCanvas').style.top = "" + this.config.HEART_OFFSET + "px";
	}

	run(engine) {
		this.drawPlayerHealth(this.heartCanvas, this.player);
	}

	handleEvent(engine, eventID, data) {
		switch(eventID) {
			case event_title_screen:
				this.showTitleScreen(engine);
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
		this.titleScreen.style.display = 'block';

		let self = this;
		document.getElementById('playButton').addEventListener('click', function() {
			self.titleScreen.style.display = 'none';
			engine.sendEvent(event_new_game);
		});

		document.getElementById('howToPlayButton').addEventListener('click', function() {
			document.getElementById('howToPlayScreen').style.visible = 'visible';
			// engine.sendEvent(event_new_game);
		});
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
