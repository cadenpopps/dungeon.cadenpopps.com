class AbilitySystem extends GameSystem {

	constructor() {
		super([component_abilities]);
	}

	run(engine) {
		for(let entity of this.objects) {
			switch(entity.actions.currentAction) {
				case action_ability_one:
					this.handleAbility(engine, entity, entity.abilities.abilities[0]);
					break;
				case action_ability_two:
					this.handleAbility(engine, entity, entity.abilities.abilities[1]);
					break;
				case action_ability_three:
					this.handleAbility(engine, entity, entity.abilities.abilities[2]);
					break;
			}
		}
	}

	handleEvent(engine, eventID, data) { }

	handleAbility(engine, entity, ability) {
		if(ability !== undefined) {
			switch(ability.abilityType) {
				case ability_type_melee:
					this.handleMeleeAbility(engine, entity, ability);
					break;
				case ability_type_aoe:
					this.handleAOEAbility(engine, entity, ability);
					break;
				case ability_type_aoe_ranged:
					this.handleAOERangedAbility(engine, entity, ability);
					break;
				case ability_type_skillshot:
					this.handleSkillshotAbility(engine, entity, ability);
					break;
				case ability_type_smite:
					this.handleSmiteAbility(engine, entity, ability);
					break;
			}
		}
	}

	// add effects, buffs

	handleMeleeAbility(engine, entity, ability) {
		let squares = Utility.getSquaresInFront(engine, entity.position, entity.direction.direction, ability.range);
		let targets = Utility.getEntitiesInSquares(engine, squares);
		let dirOffset = 0;
		while(targets.length == 0 && dirOffset < 4) {
			dirOffset++;
			squares = Utility.getSquaresInFront(engine, entity.position, (entity.direction.direction + dirOffset) % 4, ability.range);
			targets = Utility.getEntitiesInSquares(engine, squares);
		}

		if(targets.length > 0) {
			entity.direction.direction = (entity.direction.direction + dirOffset) % 4;
			for(let t of targets) {
				if(t != entity && t.components.includes(component_combat)) {
					engine.sendEvent(event_melee_ability, {'entity': entity, 'target': t, 'ability': ability});
				}
			}
			engine.sendEvent(event_successful_action, {'action': entity.actions.currentAction, 'entity': entity });
		}
	}

	handleAOEAbility(engine, entity, ability) {
		let squares = Utility.getSquaresAround(engine, entity.position, ability.range);
		let targets = Utility.getEntitiesInSquares(engine, squares);
		for(let t of targets) {
			if(t != entity && t.components.includes(component_combat)) {
				engine.sendEvent(event_melee_ability, {'entity': entity, 'target': t, 'ability': ability});
			}
		}

		if(targets.length > 0) {
			engine.sendEvent(event_successful_action, {'action': entity.actions.currentAction, 'entity': entity });
		}
	}

	handleAOERangedAbility(engine, entity, ability) {
		console.log("aoe ranged: " + entity);

		engine.sendEvent(event_successful_action, {'action': entity.actions.currentAction, 'entity': entity });
	}

	handleSkillshotAbility(engine, entity, ability) {
		console.log("skillshot: " + entity);

		engine.sendEvent(event_successful_action, {'action': entity.actions.currentAction, 'entity': entity });
	}

	handleSmiteAbility(engine, entity, ability) {
		console.log("smite: " + entity);

		engine.sendEvent(event_successful_action, {'action': entity.actions.currentAction, 'entity': entity });
	}

}
