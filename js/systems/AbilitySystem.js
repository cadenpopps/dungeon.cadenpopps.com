class AbilitySystem extends System {

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
		let squares = Utility.getSquaresInFront(engine, entity, ability.range);
		let targets = Utility.getEntitiesInSquares(engine, squares);

		engine.sendEvent(event_successful_action, {'action': entity.actions.currentAction, 'entity': entity });
	}

	handleAOEAbility(engine, entity, ability) {
		console.log("aoe: " + entity);

		engine.sendEvent(event_successful_action, {'action': entity.actions.currentAction, 'entity': entity });
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
