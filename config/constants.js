//Commands
const command_move_entity = 0, command_roll_entity = 1, command_generate_level = 2, command_generate_player = 3, command_init = 4, command_clear_objects = 5, command_down_level = 6, command_up_level = 7;

//Events
const event_game_start = 0, event_player_moved = 1, event_entity_moved = 2, event_entity_sprinted = 3, event_player_startSprint = 4, event_player_stopSprint = 5, event_entity_rolled = 6, event_entity_failed_roll= 7, event_open_door = 8, event_down_level = 9, event_up_level = 10;

//Direction
const direction_up = 0, direction_right = 1, direction_down = 2, direction_left = 3;

//Actions
const action_none = -1, action_move = 0, action_move_up = 1, action_move_right = 2, action_move_down = 3, action_move_left = 4, action_move_sprint = 5, action_foward_attack = 6, action_spin_attack = 7, action_roll = 8, action_failed_roll = 9 , action_floor = 10;

const key_to_action = {
	"w": action_move_up,
	"a": action_move_left,
	"s": action_move_down,
	"d": action_move_right,
	"e": action_foward_attack,
	"q": action_spin_attack,
	" ": action_roll,
	"n": action_floor
};

const action_priority = [];
action_priority[action_none] = 0;
action_priority[action_move_up] = 1;
action_priority[action_move_left] = 1;
action_priority[action_move_down] = 1;
action_priority[action_move_right] = 1;
action_priority[action_foward_attack] = 2;
action_priority[action_spin_attack] = 2;
action_priority[action_roll] = 3;
action_priority[action_floor] = 10;

const action_length = [];
action_length[action_move] = 9;
action_length[action_move_sprint] = 4;
action_length[action_foward_attack] = 10;
action_length[action_spin_attack] = 10;
action_length[action_roll] = 6;
action_length[action_failed_roll] = 25;
action_length[action_floor] = 0;

const action_cooldown = [];
action_cooldown[action_move] = 0;
action_cooldown[action_move_sprint] = 0;
action_cooldown[action_foward_attack] = 10;
action_cooldown[action_spin_attack] = 10;
action_cooldown[action_roll] = 10;
action_cooldown[action_failed_roll] = 0;

const action_to_direction = [];
action_to_direction[action_move_up] = direction_up;
action_to_direction[action_move_right] = direction_right;
action_to_direction[action_move_down] = direction_down;
action_to_direction[action_move_left] = direction_left;

