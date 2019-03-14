
VisionSystem.prototype = Object.create(System.prototype);
function VisionSystem (){
	System.call(this);
	this.componentRequirements = [component_position, component_display];

	let player;
	let board;

	this.run = function(){


	}

}
