function System(){
	this.objects = [];
	this.componentRequirements = [];
	this.acceptedEvents = [];
	this.acceptedCommands = [];
}

System.prototype.run = function(){}

System.prototype.updateObjects = function(object){
	let valid = true;
	for(let r of this.componentRequirements){
		if(!object.components.includes(r)){
			valid = false;
			break;
		}
	}
	if(valid && !this.objects.includes(object)) this.objects.push(object);
	else if(!valid && this.objects.includes(object)) this.objects.splice(this.objects.indexOf(object), 1);
}

System.prototype.clearObjects = function(){
	this.objects = [];
}

System.prototype.handleEvent = function(engine, e){}

System.prototype.handleCommand = function(engine, c){}
