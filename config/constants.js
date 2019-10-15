//constants
const UP = 0, RIGHT = 1, DOWN = 2, LEFT = 3;
const OPEN = 0, CLOSED = 1;
const entity_player = 0, entity_mob = 1;
const physical_solid = true, physical_non_solid = false;
const display_opaque = true, display_transparent = false;
const entity_active_range = 20;

// lights
const light_max = light_range = 8, light_intensity = .07, light_red = 230, light_green = 150, light_blue = 0;
const shadow_intensity = .08, shadow_red = 10, shadow_green = 5, shadow_blue = 25, shadow_max = .6;
const light_fill_string = "rgba(" + light_red + "," + light_green + "," + light_blue + ",";
const light_level_to_shadow = [];
light_level_to_shadow[0] = "rgba(" + 10 + ", " + 0 + ", " + 35 + ", 0.40";
light_level_to_shadow[1] = "rgba(" + 10 + ", " + 2 + ", " + 30 + ", 0.35";
light_level_to_shadow[2] = "rgba(" + 10 + ", " + 4 + ", " + 25 + ", 0.30";
light_level_to_shadow[3] = "rgba(" + 20 + ", " + 6 + ", " + 20 + ", 0.25";
light_level_to_shadow[4] = "rgba(" + 30 + ", " + 8 + ", " + 15 + ", 0.20";
light_level_to_shadow[5] = "rgba(" + 50 + ", " + 10 + ", " + 10 + ", 0.15";
light_level_to_shadow[6] = "rgba(" + 100 + ", " + 30 + ", " + 5 + ", 0.10";
light_level_to_shadow[7] = "rgba(" + 180 + ", " + 50 + ", " + 0 + ", 0.05";
light_level_to_shadow[8] = "rgba(" + 255 + ", " + 70 + ", " + 0 + ", 0.05";

//square constants
const FLOOR = 0, WALL = 1, DOOR = 2, STAIR_DOWN = 3, STAIR_UP = 4, LOOT = 5; 

//image constants
const HEART = 0;

//components
const component_position = 0, component_movement = 1, component_display = 2, component_animation = 3, component_actions = 4, component_physical = 5, component_sprint = 6, component_direction = 7, component_map = 8, component_health = 9, component_light = 10, component_strength = 11, component_intelligence = 12, component_magic = 13, component_level = 14, component_depth = 15, component_stair = 16, component_combat = 17, component_ai = 18;

//events
const event_new_game = 0, event_start_game = 1, event_first_level_initiated = 2, event_player_generated = 3, event_down_level = 4, event_up_level = 5, event_new_level = 6, event_player_moved = 7, event_entity_moved = 8, event_player_start_sprinting = 9, event_player_stop_sprinting = 10, event_open_door = 11, event_window_resized = 12, event_new_animation = 13, event_successful_action = 14, event_entity_take_damage = 15, event_begin_combat = 16, event_end_combat = 17;

//direction
const direction_up = 0, direction_right = 1, direction_down = 2, direction_left = 3;


//animations
const animation_idle = 0, animation_move_up = 1, animation_move_right = 2, animation_move_down = 3, animation_move_left = 4, animation_sprint_up = 5, animation_sprint_right = 6, animation_sprint_down = 7, animation_sprint_left = 8, animation_melee_attack_up = 9, animation_melee_attack_right = 10, animation_melee_attack_down = 11, animation_melee_attack_left = 12, animation_melee_attack_spin = 13;

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
animation_strings_to_constants["animation_melee_attack_up"] = animation_melee_attack_up;
animation_strings_to_constants["animation_melee_attack_right"] = animation_melee_attack_right;
animation_strings_to_constants["animation_melee_attack_down"] = animation_melee_attack_down;
animation_strings_to_constants["animation_melee_attack_left"] = animation_melee_attack_left;
animation_strings_to_constants["animation_melee_attack_spin"] = animation_melee_attack_spin;
// paul["animation_roll_up"] = animation_roll_up;
// paul["animation_roll_right"] = animation_roll_right;
// paul["animation_roll_down"] = animation_roll_down;
// paul["animation_roll_left"] = animation_roll_left;

//Actions
const action_none = -1, action_move = 0, action_move_up = 0, action_move_right = 1, action_move_down = 2, action_move_left = 3, action_sprint = 4, action_sprint_up = 4, action_sprint_right = 5, action_sprint_down = 6, action_sprint_left = 8, action_roll = 9, action_roll_up = 9, action_roll_right = 10, action_roll_down = 11, action_roll_left = 12, action_melee_attack_front = 13, action_melee_attack_up = 14, action_melee_attack_right = 15, action_melee_attack_down = 16, action_melee_attack_left = 17, action_melee_attack_spin = 18;

const action_strings_to_constants = [];
action_strings_to_constants["action_none"] = action_none;
action_strings_to_constants["action_move_up"] = action_move_up;
action_strings_to_constants["action_move_right"] = action_move_right;
action_strings_to_constants["action_move_down"] = action_move_down;
action_strings_to_constants["action_move_left"] = action_move_left;
action_strings_to_constants["action_sprint_up"] = action_sprint_up;
action_strings_to_constants["action_sprint_right"] = action_sprint_right;
action_strings_to_constants["action_sprint_down"] = action_sprint_down;
action_strings_to_constants["action_sprint_left"] = action_sprint_left;
action_strings_to_constants["action_melee_attack_up"] = action_melee_attack_up;
action_strings_to_constants["action_melee_attack_right"] = action_melee_attack_right;
action_strings_to_constants["action_melee_attack_down"] = action_melee_attack_down;
action_strings_to_constants["action_melee_attack_left"] = action_melee_attack_left;
action_strings_to_constants["action_melee_attack_spin"] = action_melee_attack_spin;

const key_to_action = {
	"w": action_move_up,
	"a": action_move_left,
	"s": action_move_down,
	"d": action_move_right,
	"1": action_melee_attack_front,
	"2": action_melee_attack_spin
	// " ": action_roll,
};

const action_priority = [];
action_priority[action_none] = 0;
action_priority[action_move_up] = 1;
action_priority[action_move_left] = 1;
action_priority[action_move_down] = 1;
action_priority[action_move_right] = 1;
action_priority[action_melee_attack_up] = 2;
action_priority[action_melee_attack_right] = 2;
action_priority[action_melee_attack_down] = 2;
action_priority[action_melee_attack_left] = 2;
action_priority[action_melee_attack_spin] = 2;
action_priority[action_roll] = 3;

const movement_to_sprint = [];
movement_to_sprint[action_move_up] = action_sprint_up;
movement_to_sprint[action_move_right] = action_sprint_right;
movement_to_sprint[action_move_down] = action_sprint_down;
movement_to_sprint[action_move_left] = action_sprint_left;

const sprint_to_movement = [];
sprint_to_movement[action_sprint_up] = action_move_up;
sprint_to_movement[action_sprint_right] = action_move_right;
sprint_to_movement[action_sprint_down] = action_move_down;
sprint_to_movement[action_sprint_left] = action_move_left;

const action_length = [];
action_length[action_move_up] = 100;
action_length[action_move_right] = 100;
action_length[action_move_down] = 100;
action_length[action_move_left] = 100;

action_length[action_sprint_up] = 55;
action_length[action_sprint_right] = 55;
action_length[action_sprint_down] = 55;
action_length[action_sprint_left] = 55;

action_length[action_melee_attack_up] = 200;
action_length[action_melee_attack_right] = 200;
action_length[action_melee_attack_down] = 200;
action_length[action_melee_attack_left] = 200;
action_length[action_melee_attack_spin] = 250;

const action_to_direction = [];
action_to_direction[action_move_up] = direction_up;
action_to_direction[action_move_right] = direction_right;
action_to_direction[action_move_down] = direction_down;
action_to_direction[action_move_left] = direction_left;
action_to_direction[action_sprint_up] = direction_up;
action_to_direction[action_sprint_right] = direction_right;
action_to_direction[action_sprint_down] = direction_down;
action_to_direction[action_sprint_left] = direction_left;

const direction_to_attack = [];
direction_to_attack[direction_up] = action_melee_attack_up;
direction_to_attack[direction_right] = action_melee_attack_right;
direction_to_attack[direction_down] = action_melee_attack_down;
direction_to_attack[direction_left] = action_melee_attack_left;

const direction_to_movement = [];
direction_to_movement[direction_up] = action_move_up;
direction_to_movement[direction_right] = action_move_right;
direction_to_movement[direction_down] = action_move_down;
direction_to_movement[direction_left] = action_move_left;

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
action_to_animation[action_melee_attack_up] = animation_melee_attack_up;
action_to_animation[action_melee_attack_right] = animation_melee_attack_right;
action_to_animation[action_melee_attack_down] = animation_melee_attack_down;
action_to_animation[action_melee_attack_left] = animation_melee_attack_left;
action_to_animation[action_melee_attack_spin] = animation_melee_attack_spin;
