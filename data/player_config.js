{
	"warrior": {
		"sprint_threshhold": 3,
		"sprint_speed": 6,
		"health": 100,
		"attackDamage": 20,
		"magicDamage": 0,
		"armor": 10,
		"abilities": [
			{
				"abilityName": "Slash",
				"abilityType": "melee",
				"damageType": "attack",
				"baseDamage": 10,
				"range": 2
			},
			{
				"abilityName": "Spin attack",
				"abilityType": "aoe",
				"damageType": "attack",
				"baseDamage": 7,
				"range": 1
			},
			{
				"abilityName": "Judgement day",
				"abilityType": "smite",
				"damageType": "attack",
				"baseDamage": 50,
				"range": 8
			}
		],
		"animations": {
			"animation_idle": [
				{"ox": 0, "oy": 0, "sprite": null},
				{"ox": 0, "oy": 0, "sprite": null},
				{"ox": 0, "oy": 0, "sprite": null},
				{"ox": 0, "oy": 0, "sprite": null}
			],
			"animation_move_up": [
				{"ox": 0, "oy": 0.95, "sprite": null},
				{"ox": 0, "oy": 0.9, "sprite": null},
				{"ox": 0, "oy": 0.8, "sprite": null},
				{"ox": 0, "oy": 0.6, "sprite": null},
				{"ox": 0, "oy": 0.4, "sprite": null},
				{"ox": 0, "oy": 0.2, "sprite": null},
				{"ox": 0, "oy": 0.1, "sprite": null},
				{"ox": 0, "oy": 0.05, "sprite": null}
			],
			"animation_move_right": [
				{"ox": -0.95, "oy": 0, "sprite": null},
				{"ox": -0.9,  "oy": 0, "sprite": null},
				{"ox": -0.8,  "oy": 0, "sprite": null},
				{"ox": -0.6,  "oy": 0, "sprite": null},
				{"ox": -0.4,  "oy": 0, "sprite": null},
				{"ox": -0.2,  "oy": 0, "sprite": null},
				{"ox": -0.1,  "oy": 0, "sprite": null},
				{"ox": -0.05, "oy": 0, "sprite": null}
			],
			"animation_move_down": [
				{"ox": 0, "oy": -0.95, "sprite": null},
				{"ox": 0, "oy": -0.9,  "sprite": null},
				{"ox": 0, "oy": -0.8,  "sprite": null},
				{"ox": 0, "oy": -0.6,  "sprite": null},
				{"ox": 0, "oy": -0.4,  "sprite": null},
				{"ox": 0, "oy": -0.2,  "sprite": null},
				{"ox": 0, "oy": -0.1,  "sprite": null},
				{"ox": 0, "oy": -0.05, "sprite": null}
			],
			"animation_move_left": [
				{"ox": 0.95, "oy": 0, "sprite": null},
				{"ox": 0.9,  "oy": 0, "sprite": null},
				{"ox": 0.8,  "oy": 0, "sprite": null},
				{"ox": 0.6,  "oy": 0, "sprite": null},
				{"ox": 0.4,  "oy": 0, "sprite": null},
				{"ox": 0.2,  "oy": 0, "sprite": null},
				{"ox": 0.1,  "oy": 0, "sprite": null},
				{"ox": 0.05, "oy": 0, "sprite": null}
			]
		}
	},
	"mage": {
		"sprint_threshhold": 2,
		"health": 8,
		"attackDamage": 0,
		"magicDamage": 15,
		"armor": 8,
		"abilities": [
			{
				"abilityName": "Slash",
				"abilityType": "melee",
				"damageType": "attack",
				"baseDamage": "10"
			},
			{
				"abilityName": "Spin attack",
				"abilityType": "aoe",
				"damageType": "attack",
				"baseDamage": "5"
			},
			{
				"abilityName": "Judgement day",
				"abilityType": "smite",
				"damageType": "attack",
				"baseDamage": "50"
			}
		],
		"animations": {
			"animation_idle": [
				{"ox": 0, "oy": 0, "sprite": null},
				{"ox": 0, "oy": 0, "sprite": null},
				{"ox": 0, "oy": 0, "sprite": null},
				{"ox": 0, "oy": 0, "sprite": null},
				{"ox": 0, "oy": 0, "sprite": null},
				{"ox": 0, "oy": 0, "sprite": null},
				{"ox": 0, "oy": 0, "sprite": null},
				{"ox": 0, "oy": 0, "sprite": null}
			],
			"animation_move_up": [
				{"ox": 0, "oy": 0.95, "sprite": null},
				{"ox": 0, "oy": 0.9, "sprite": null},
				{"ox": 0, "oy": 0.8, "sprite": null},
				{"ox": 0, "oy": 0.6, "sprite": null},
				{"ox": 0, "oy": 0.4, "sprite": null},
				{"ox": 0, "oy": 0.2, "sprite": null},
				{"ox": 0, "oy": 0.1, "sprite": null},
				{"ox": 0, "oy": 0.05, "sprite": null}
			],
			"animation_move_right": [
				{"ox": -0.95, "oy": 0, "sprite": null},
				{"ox": -0.9,  "oy": 0, "sprite": null},
				{"ox": -0.8,  "oy": 0, "sprite": null},
				{"ox": -0.6,  "oy": 0, "sprite": null},
				{"ox": -0.4,  "oy": 0, "sprite": null},
				{"ox": -0.2,  "oy": 0, "sprite": null},
				{"ox": -0.1,  "oy": 0, "sprite": null},
				{"ox": -0.05, "oy": 0, "sprite": null}
			],
			"animation_move_down": [
				{"ox": 0, "oy": -0.95, "sprite": null},
				{"ox": 0, "oy": -0.9,  "sprite": null},
				{"ox": 0, "oy": -0.8,  "sprite": null},
				{"ox": 0, "oy": -0.6,  "sprite": null},
				{"ox": 0, "oy": -0.4,  "sprite": null},
				{"ox": 0, "oy": -0.2,  "sprite": null},
				{"ox": 0, "oy": -0.1,  "sprite": null},
				{"ox": 0, "oy": -0.05, "sprite": null}
			],
			"animation_move_left": [
				{"ox": 0.95, "oy": 0, "sprite": null},
				{"ox": 0.9,  "oy": 0, "sprite": null},
				{"ox": 0.8,  "oy": 0, "sprite": null},
				{"ox": 0.6,  "oy": 0, "sprite": null},
				{"ox": 0.4,  "oy": 0, "sprite": null},
				{"ox": 0.2,  "oy": 0, "sprite": null},
				{"ox": 0.1,  "oy": 0, "sprite": null},
				{"ox": 0.05, "oy": 0, "sprite": null}
			]
		}
	},
	"rogue": {
		"sprint_threshhold": 2,
		"health": 7,
		"attackDamage": 12,
		"magicDamage": 8,
		"armor": 10,
		"abilities": [
			{
				"abilityName": "Slash",
				"abilityType": "melee",
				"damageType": "attack",
				"baseDamage": "10"
			},
			{
				"abilityName": "Spin attack",
				"abilityType": "aoe",
				"damageType": "attack",
				"baseDamage": "5"
			},
			{
				"abilityName": "Judgement day",
				"abilityType": "smite",
				"damageType": "attack",
				"baseDamage": "50"
			}
		],
		"animations": {
			"animation_idle": [
				{"ox": 0, "oy": 0, "sprite": null},
				{"ox": 0, "oy": 0, "sprite": null},
				{"ox": 0, "oy": 0, "sprite": null},
				{"ox": 0, "oy": 0, "sprite": null},
				{"ox": 0, "oy": 0, "sprite": null},
				{"ox": 0, "oy": 0, "sprite": null},
				{"ox": 0, "oy": 0, "sprite": null},
				{"ox": 0, "oy": 0, "sprite": null}
			],
			"animation_move_up": [
				{"ox": 0, "oy": 0.95, "sprite": null},
				{"ox": 0, "oy": 0.9, "sprite": null},
				{"ox": 0, "oy": 0.8, "sprite": null},
				{"ox": 0, "oy": 0.6, "sprite": null},
				{"ox": 0, "oy": 0.4, "sprite": null},
				{"ox": 0, "oy": 0.2, "sprite": null},
				{"ox": 0, "oy": 0.1, "sprite": null},
				{"ox": 0, "oy": 0.05, "sprite": null}
			],
			"animation_move_right": [
				{"ox": -0.95, "oy": 0, "sprite": null},
				{"ox": -0.9,  "oy": 0, "sprite": null},
				{"ox": -0.8,  "oy": 0, "sprite": null},
				{"ox": -0.6,  "oy": 0, "sprite": null},
				{"ox": -0.4,  "oy": 0, "sprite": null},
				{"ox": -0.2,  "oy": 0, "sprite": null},
				{"ox": -0.1,  "oy": 0, "sprite": null},
				{"ox": -0.05, "oy": 0, "sprite": null}
			],
			"animation_move_down": [
				{"ox": 0, "oy": -0.95, "sprite": null},
				{"ox": 0, "oy": -0.9,  "sprite": null},
				{"ox": 0, "oy": -0.8,  "sprite": null},
				{"ox": 0, "oy": -0.6,  "sprite": null},
				{"ox": 0, "oy": -0.4,  "sprite": null},
				{"ox": 0, "oy": -0.2,  "sprite": null},
				{"ox": 0, "oy": -0.1,  "sprite": null},
				{"ox": 0, "oy": -0.05, "sprite": null}
			],
			"animation_move_left": [
				{"ox": 0.95, "oy": 0, "sprite": null},
				{"ox": 0.9,  "oy": 0, "sprite": null},
				{"ox": 0.8,  "oy": 0, "sprite": null},
				{"ox": 0.6,  "oy": 0, "sprite": null},
				{"ox": 0.4,  "oy": 0, "sprite": null},
				{"ox": 0.2,  "oy": 0, "sprite": null},
				{"ox": 0.1,  "oy": 0, "sprite": null},
				{"ox": 0.05, "oy": 0, "sprite": null}
			]
		}
	}
}
