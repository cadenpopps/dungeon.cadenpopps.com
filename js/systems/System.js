const sys_error = 0, sys_ok = 1;
function System(){
	this.run = function(){return system_ok}
	let objects = [];
	let componentRequirements = [];
	let player;

	this.alert = function(object){
		if(object instanceof Player) player = object;
		let validObject = true;
		for(let r of componentRequirements){
			if(!object.components.includes(r)) validObject = false;
		}
		if(validObject && !objects.includes(object)) objects.push(object);
		else if(!validObject && objects.includes(object)) objects.splice(objects.indexOf(object), 1);
	}
}
