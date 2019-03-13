const sys_error = 0, sys_ok = 1;
function System(){
	this.run = function(){return system_ok}
	this.objects = [];
	this.componentRequirements = [];

	this.alert = function(object){
		let valid = true;
		for(let r of this.componentRequirements){
			if(!object.components.includes(r)) valid = false;
		}
		if(valid && !this.objects.includes(object)) this.objects.push(object);
		else if(!valid && this.objects.includes(object)) this.objects.splice(this.objects.indexOf(object), 1);
	}
}
