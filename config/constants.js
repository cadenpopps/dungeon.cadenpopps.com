//constants
const UP = 0, RIGHT = 1, DOWN = 2, LEFT = 3;
const entity_player = 0, entity_mob = 1;

// lights
const light_max = light_range = 8, light_intensity = .07, light_red = 230, light_green = 150, light_blue = 0;
const shadow_intensity = .08, shadow_red = 10, shadow_green = 5, shadow_blue = 25, shadow_max = .6;
const light_level_to_shadow = new Array(light_max);
const light_fill_string = "rgba(" + light_red + "," + light_green + "," + light_blue + ",";

//square constants
const FLOOR = 0, WALL = 1, DOOR = 2, STAIR_DOWN = 3, STAIR_UP = 4, LOOT = 5; 

//image constants
const HEART = 0;

//components
const component_position = 0, component_movement = 1, component_display = 2, component_animation = 3, component_actions = 4, component_physical = 5, component_sprint = 6, component_direction = 7, component_map = 8, component_health = 9, component_light = 10, component_strength = 11, component_intelligence = 12, component_magic = 13, component_level = 14, component_depth = 15, component_stair = 16;

//events
const event_new_game = 0, event_start_game = 1, event_first_level_initiated = 2, event_player_generated = 3, event_down_level = 4, event_up_level = 5, event_new_level = 6, event_player_moved = 7, event_entity_moved = 8, event_player_start_sprinting = 9, event_player_stop_sprinting = 10, event_open_door = 11, event_window_resized = 12;

//direction
const direction_up = 0, direction_right = 1, direction_down = 2, direction_left = 3;

//animations
const animation_idle = 0, animation_move_up = 1, animation_move_right = 2, animation_move_down = 3, animation_move_left = 4, animation_sprint_up = 5, animation_sprint_right = 6, animation_sprint_down = 7, animation_sprint_left = 8, animation_roll_up = 9, animation_roll_right = 10, animation_roll_down = 11, animation_roll_left = 12;

const animation_strings_to_constants = [];
animation_strings_to_constants["animation_idle"] = animation_idle;
animation_strings_to_constants["animation_move_up"] = animation_move_up;
animation_strings_to_constants["animation_move_right"] = animation_move_right;
animation_strings_to_constants["animation_move_down"] = animation_move_down;
animation_strings_to_constants["animation_move_left"] = animation_move_left;
animation_strings_to_constants["animation_sprint_up"] = animation_sprint_up;
animation_strings_to_constants["animation_sprint_right"] = animation_sprint_right;
animation_strings_to_constants["animation_sprint_down"] = animation_sprint_down;
animation_strings_to_constants["animation_sprint_left"] = animation_sprint_left;
// paul["animation_roll_up"] = animation_roll_up;
// paul["animation_roll_right"] = animation_roll_right;
// paul["animation_roll_down"] = animation_roll_down;
// paul["animation_roll_left"] = animation_roll_left;

//Actions
const action_none = -1, action_move = 0, action_move_up = 0, action_move_right = 1, action_move_down = 2, action_move_left = 3, action_sprint = 4, action_sprint_up = 4, action_sprint_right = 5, action_sprint_down = 6, action_sprint_left = 8, action_roll = 9, action_roll_up = 9, action_roll_right = 10, action_roll_down = 11, action_roll_left = 12, action_foward_attack = 13, action_spin_attack = 14,  action_failed_roll = 15; 

const key_to_action = {
	"w": action_move_up,
	"a": action_move_left,
	"s": action_move_down,
	"d": action_move_right,
	"e": action_foward_attack,
	"q": action_spin_attack,
	" ": action_roll,
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

// const action_length = [];
// action_length[action_move_up] = 5;
// action_length[action_move_right] = 5;
// action_length[action_move_down] = 5;
// action_length[action_move_left] = 5;
// action_length[action_sprint] = 0;
// action_length[action_sprint] = 4;
// action_length[action_foward_attack] = 10;
// action_length[action_spin_attack] = 10;
// action_length[action_roll] = 6;
// action_length[action_failed_roll] = 25;

const action_cooldown = [];
action_cooldown[action_move_up] = 6;
action_cooldown[action_move_right] = 6;
action_cooldown[action_move_down] = 6;
action_cooldown[action_move_left] = 6;
action_cooldown[action_sprint_up] = 4;
action_cooldown[action_sprint_right] = 4;
action_cooldown[action_sprint_down] = 4;
action_cooldown[action_sprint_left] = 4;
action_cooldown[action_foward_attack] = 10;
action_cooldown[action_spin_attack] = 10;
action_cooldown[action_roll] = 10;
action_cooldown[action_failed_roll] = 0;

const action_to_direction = [];
// action_to_direction[action_move_up] = direction_up;
// action_to_direction[action_move_right] = direction_right;
// action_to_direction[action_move_down] = direction_down;
// action_to_direction[action_move_left] = direction_left;

const direction_to_action = [];
direction_to_action[action_move + direction_up] = action_move_up;
direction_to_action[action_move + direction_right] = action_move_right;
direction_to_action[action_move + direction_down] = action_move_down;
direction_to_action[action_move + direction_left] = action_move_left;
direction_to_action[action_roll + direction_up] = action_roll_up;
direction_to_action[action_roll + direction_right] = action_roll_right;
direction_to_action[action_roll + direction_down] = action_roll_down;
direction_to_action[action_roll + direction_left] = action_roll_left;

const action_to_animation = [];
action_to_animation[action_none] = animation_idle;
action_to_animation[action_move_up] = animation_move_up;
action_to_animation[action_move_right] = animation_move_right;
action_to_animation[action_move_down] = animation_move_down;
action_to_animation[action_move_left] = animation_move_left;
action_to_animation[action_sprint_up] = animation_sprint_up;
action_to_animation[action_sprint_right] = animation_sprint_right;
action_to_animation[action_sprint_down] = animation_sprint_down;
action_to_animation[action_sprint_left] = animation_sprint_left;
action_to_animation[action_roll_up] = animation_roll_up;
action_to_animation[action_roll_right] = animation_roll_right;
action_to_animation[action_roll_down] = animation_roll_down;
action_to_animation[action_roll_left] = animation_roll_left;
