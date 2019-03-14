
//Events
const event_game_start = 0, event_player_moved = 1;


//Actions
const action_none = -1, action_move_up = 0, action_move_right = 1, action_move_down = 2, action_move_left = 3, action_melee_attack = 4; 

const key_to_action = {
	"w": action_move_up,
	"a": action_move_left,
	"s": action_move_down,
	"d": action_move_right,
	"e": action_melee_attack
};

const action_priority = [];
action_priority[action_none] = 0,
	action_priority[action_move_up] = 1,
	action_priority[action_move_left] = 1,
	action_priority[action_move_down] = 1,
	action_priority[action_move_right] = 1,
	action_priority[action_melee_attack] = 2


//Systems

const system_input = 0, system_actions = 1, system_display = 2, system_animations = 3, system_movement = 4, system_combat = 5, system_vision = 6;

let id_to_system = {
	"system_input": 0
}
