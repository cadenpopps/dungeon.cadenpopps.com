$(document).ready(function() {

	$('#pattack').click(function() {
		gameManager.getPlayer().physicalAttack();
	});
	$('#mattack').click(function() {
		gameManager.getPlayer().magicalAttack();
	});
	$('#door').click(function() {
		gameManager.getPlayer().openDoor();
	});
	$('#loot').click(function() {
		gameManager.getPlayer().openLoot();
	});
	$('#helpbutton').click(function() {
		alert('help screen');
	});
	$('#settingsbutton').click(function() {
		alert('help screen');
	});
	$('#inventory').click(function() {
		alert('inventory screen');
	});
});
