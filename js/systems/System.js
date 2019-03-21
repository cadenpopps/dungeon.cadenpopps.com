const sys_error = 0, sys_ok = 1;
function System(){
	this.run = function(){return system_ok}

	this.objects = [];
	this.componentRequirements = [];

	this.events = [];
	this.acceptedEvents = [];

	this.acceptedCommands = [];
}

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

System.prototype.handleEvent = function(e){
	for(let a of this.acceptedEvents){
		if(e.eventID == a){
			this.events.push(e);
		}
	}
}

System.prototype.handleCommand = function(c){}
