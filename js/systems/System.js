function System(){
	this.objects = [];
	this.componentRequirements = [];
}

System.prototype.run = function(){}

System.prototype.addObject = function(object){
	for(let r of this.componentRequirements){
		if(!object.components.includes(r)){
			return;
		}
	}
	this.objects.push(object);
}

System.prototype.clearObjects = function(){
	this.objects = [];
}

System.prototype.handleEvent = function(engine, e){}
