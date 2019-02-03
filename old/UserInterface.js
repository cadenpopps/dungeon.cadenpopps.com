function UserInterface() {

	this.startTime = -1;
	this.gameOverTime = -1;

	var squareSize = floor((height) / PLAYER_VISION_RANGE);

	const BARWIDTH = 24;

	this.displayStart = function () {
		$('#game').css('z-index', 100);
		if (this.startTime == -1) {
			this.startTime = millis();
		}
		background(0);
		textSize(width / 15);
		textAlign(CENTER);
		if ((millis() - this.startTime) < 255) {
			fill(255, (millis() - this.startTime));
		}
		else {
			fill(255);
		}
		text("Welcome Adventurer", width / 2, (height / 2));
	};

	this.displayGameOver = function () {
		if (this.gameOverTime == -1) {
			this.gameOverTime = millis();
		}
		background(6);
		textAlign(CENTER);
		textSize(width / 15);
		if ((millis() - this.gameOverTime) < 255) {
			fill(255, (millis() - this.gameOverTime));
		}
		else {
			fill(255);
		}

		text("Game Over", width / 2, (height / 2));
		if (millis() > this.gameOverTime + 1000) {
			textSize(width / 30);
			text("Press n or refresh to restart", width / 2, (height / 2) + (width / 15));
		}
	};

	this.displayGame = function () {

		this.drawBoard();

		//this.displayInventory();

		noStroke();
		fill(227, 223, 223);

		this.displayTerminal();
	};

	this.displayPlayerInfo = function () {

		this.displayHealth();
		this.displayXP();
		this.updatePlayerStats();
	};

	this.displayHealth = function () {

		var healthBarWidth = gameManager.getPlayer().getHealthMult();

		$("#health").css("width", (BARWIDTH * healthBarWidth) + "vw");

	};

	this.displayXP = function () {

		var XPBarWidth = gameManager.getPlayer().getXPMult();

		$("#xp").css("width", (BARWIDTH * XPBarWidth) + "vw");

	};

	this.displayInventory = function () {

		stroke(227, 223, 223);
		strokeWeight(1);
		fill(0);
		rect(-1, 15, this.leftPanelScale + 2, height - 30);
		noStroke();

		this.displayPlayerEquipped();

	};

	this.updatePlayerStats = function () {
		// $('#stat1').text(gameManager.getPlayer().getStrength());
		// $('#stat2').text(gameManager.getPlayer().getMagic());
		// $('#stat3').text(gameManager.getPlayer().getIntelligence());

		var numSize = 34;

		var str = gameManager.getPlayer().getStrength();
		var mag = gameManager.getPlayer().getMagic();
		var int = gameManager.getPlayer().getIntelligence();

		//strength
		for (var i = gameManager.getPlayer().getStrength().toString().length - 1; i >= 0; i--) {
			drawNumber(str % 10, ((width / 100) * 11) + (i * numSize * .8), ((width / 100) * .8), numSize);
			str = floor(str / 10);
		}
		//magic
		for (var i = gameManager.getPlayer().getMagic().toString().length - 1; i >= 0; i--) {
			drawNumber(mag % 10, ((width / 100) * 11) + (i * numSize * .8), ((width / 100) * 3.6), numSize);
			mag = floor(mag / 10);
		}
		//intelligence
		for (var i = gameManager.getPlayer().getIntelligence().toString().length - 1; i >= 0; i--) {
			drawNumber(int % 10, ((width / 100) * 11) + (i * numSize * .8), ((width / 100) * 6.4), numSize);
			int = floor(int / 10);
		}

	};

	this.displayPlayerEquipped = function () {

		this.displayPlayerInventorySpot(0);
		this.displayPlayerInventorySpot(1);
		this.displayPlayerInventorySpot(2);

	};

	this.displayPlayerInventorySpot = function (num) {
		fill(227, 223, 223);
		rect(this.leftPanelScale / 10, height / 2 + (num * (height / 6)), this.leftPanelScale - this.leftPanelScale / 5, this.leftPanelScale - this.leftPanelScale / 5);
		textAlign(LEFT);
		textSize(this.leftPanelScale / 10);
		fill(0);
		text("inventory\nplaceholder", this.leftPanelScale / 10, height / 2 + (num * (height / 6)) + 20);
	};

	this.displayTerminal = function () {

	};

	var drawPlayer = function () {
		switch (gameManager.getPlayer().getState()) {
			case STATELEFT:
				image(playerTextures[0], gameManager.getPlayer().getX() * squareSize, gameManager.getPlayer().getY() * squareSize, squareSize, squareSize);
				break;
			case STATERIGHT:
				image(playerTextures[1], gameManager.getPlayer().getX() * squareSize, gameManager.getPlayer().getY() * squareSize, squareSize, squareSize);
				break;
			case STATEFRONT:
				image(playerTextures[2], gameManager.getPlayer().getX() * squareSize, gameManager.getPlayer().getY() * squareSize, squareSize, squareSize);
				break;
			case STATEBACK:
				image(playerTextures[3], gameManager.getPlayer().getX() * squareSize, gameManager.getPlayer().getY() * squareSize, squareSize, squareSize);
				break;
			case STATELEFTWALKING:
				image(playerTextures[4], gameManager.getPlayer().getX() * squareSize, gameManager.getPlayer().getY() * squareSize, squareSize, squareSize);
				break;
		}
	};

	var drawMob = function (mob, mobX, mobY) {
		switch (mob.getState()) {
			case STATELEFT:
				image(skeletonTextureLeft, mobX * squareSize, mobY * squareSize, squareSize, squareSize);
				break;
			case STATERIGHT:
				image(skeletonTextureRight, mobX * squareSize, mobY * squareSize, squareSize, squareSize);
				break;
			case STATEFRONT:
				image(skeletonTextureFront, mobX * squareSize, mobY * squareSize, squareSize, squareSize);
				break;
			case STATEBACK:
				image(skeletonTextureBack, mobX * squareSize, mobY * squareSize, squareSize, squareSize);
				break;
		}
	};

	this.drawBoard = function () {
		push();
		noStroke();
		if (DEBUGBOARD) {
			this.drawFullBoard();
		}
		else {
			scale(SCALE);
			translate(floor((-gameManager.getPlayer().getX() * squareSize) + (width / (SCALE * 2)) - (squareSize / 2)), floor((-gameManager.getPlayer().getY() * squareSize) + (height / (SCALE * 2)) - squareSize));
			this.drawBoardWithImages();
		}
		pop();
	};

	this.drawFullBoard = function () {
		scale(.7);
		translate(width / 3, height / 20);
		for (var i = 0; i < DUNGEON_SIZE; i++) {
			for (var j = 0; j < DUNGEON_SIZE; j++) {
				var curSquare = gameManager.getCurrentFloor().getSquare(i, j);
				switch (curSquare.getSquareType()) {
					case PATH:
						//path
						image(floorTextures[curSquare.getTexture()], i * squareSize, j * squareSize, squareSize, squareSize);
						break;
					case WALL:
						//wall
						image(wallTextures[curSquare.getTexture()], i * squareSize, j * squareSize, squareSize, squareSize);
						break;
					case STAIRDOWN:
						//stair down
						fill(0, 50, 255);
						image(stairDownTexture, i * squareSize, j * squareSize, squareSize, squareSize);
						break;
					case STAIRUP:
						//stair up
						image(stairUpTexture, i * squareSize, j * squareSize, squareSize, squareSize);
						break;
					case DOOR:
						//door
						if (curSquare.getOpen()) {
							image(doorOpenedTexture, i * squareSize, j * squareSize, squareSize, squareSize);
						}
						else {
							image(doorClosedTexture, i * squareSize, j * squareSize, squareSize, squareSize);
						}
						break;
					case LOOT:
						//loot
						fill(255, 50, 50);
						rect(i * squareSize, j * squareSize, squareSize, squareSize);
						break;
				}
				// if (curSquare.getMobAt() != null) {
				// 	fill(255, 255, 0);
				// 	rect(i * squareSize, j * squareSize, squareSize, squareSize);
				// }
			}
		}
	};

	this.drawBoardWithImages = function () {

		var player = gameManager.getPlayer();

		for (var i = player.getX() - PLAYER_VISION_RANGE; i < player.getX() + PLAYER_VISION_RANGE; i++) {
			for (var j = player.getY() - PLAYER_VISION_RANGE; j < player.getY() + PLAYER_VISION_RANGE; j++) {
				if (i >= 0 && j >= 0 && i <= DUNGEON_SIZE - 1 && j <= DUNGEON_SIZE - 1) {
					var curSquare = gameManager.getCurrentFloor().getSquare(i, j);
					if (player.getCanSee().includes(curSquare) || player.getHasSeen().includes(curSquare) || player.getCanSeeEdge().includes(curSquare)) {
						switch (curSquare.getSquareType()) {
							case PATH:
								//path
								image(floorTextures[curSquare.getTexture()], i * squareSize, j * squareSize, squareSize, squareSize);
								break;
							case WALL:
								//wall
								image(wallTextures[curSquare.getTexture()], i * squareSize, j * squareSize, squareSize, squareSize);
								break;
							case STAIRDOWN:
								//stair down
								image(stairDownTexture, i * squareSize, j * squareSize, squareSize, squareSize);
								break;
							case STAIRUP:
								//stair up
								image(stairUpTexture, i * squareSize, j * squareSize, squareSize, squareSize);
								break;
							case DOOR:
								//door
								if (curSquare.getOpen()) {
									image(doorOpenedTexture, i * squareSize, j * squareSize, squareSize, squareSize);
								}
								else {
									image(doorClosedTexture, i * squareSize, j * squareSize, squareSize, squareSize);
								}
								break;
							case LOOT:
								//loot
								if (curSquare.getOpen()) {
									image(lootOpenedTexture, i * squareSize, j * squareSize, squareSize, squareSize);
								}
								else {
									image(lootClosedTexture, i * squareSize, j * squareSize, squareSize, squareSize);
								}
								break;
						}
						//darken for light level
						// fill(0, 0, 5, constrain(curSquare.lightLevel * 6, 0, 255));
						// rect(i * squareSize, j * squareSize, squareSize, squareSize);
						// if (player.getCanSee().includes(curSquare)) {
						// 	if (curSquare.getMobAt() != null && (player.getX() != i || player.getY() != j)) {
						// 		drawMob(curSquare.getMobAt(), i, j);
						// 		fill(255, 50, 50);
						// 		rect(i * squareSize + (squareSize / 8), j * squareSize - (squareSize / 8), 3 * (squareSize / 4), (squareSize / 8));
						// 		fill(50, 255, 50);
						// 		rect(i * squareSize + (squareSize / 8), j * squareSize - (squareSize / 8), 3 * (squareSize / 4) * curSquare.getMobAt().getHealthMult(), (squareSize / 8));
						// 	}
						// }
						// else if (player.getCanSeeEdge().includes(curSquare)) {
						// 	if (curSquare.getMobAt() != null && (player.getX() != i || player.getY() != j)) {
						// 		drawMob(curSquare.getMobAt(), i, j);
						// 	}
						// 	fill(0, 0, 10, constrain(curSquare.lightLevel * 7, 0, 60));
						// 	rect(i * squareSize, j * squareSize, squareSize, squareSize);
						// }
						// else if (player.getHasSeen().includes(curSquare)) {
						// 	fill(0, 0, 5, 90);
						// 	rect(i * squareSize, j * squareSize, squareSize, squareSize);
						// }
					}
				}
			}
		}
		drawPlayer();
	};
}