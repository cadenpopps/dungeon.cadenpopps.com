"use strict";

//constants
const UP = 0, RIGHT = 1, DOWN = 2, LEFT = 3;
const OPEN = 0, CLOSED = 1;
const entity_player = 0, entity_mob = 1;
const physical_solid = true, physical_non_solid = false;
const display_opaque = true, display_transparent = false;
const entity_active_range = 20;

//vision
const CENTER_SQUARE = 0, TOP_LEFT = 1, BOTTOM_RIGHT = 2, UPPER_BOUND = 3, LOWER_BOUND = 4;
const PERM = .5;

const xxcomp = [ 1, 0, 0, -1, -1, 0, 0, 1 ];
const xycomp = [ 0, 1, -1, 0, 0, -1, 1, 0 ];
const yxcomp = [ 0, 1, 1, 0, 0, -1, -1, 0 ];
const yycomp = [ 1, 0, 0, 1, -1, 0, 0, -1 ];



// lights
const light_range = 8, light_intensity = .07, light_red = 230, light_green = 150, light_blue = 0;
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
const 
texture_floor = 0,
	texture_wall = 1,
	texture_door_closed = 2,
	texture_door_open = 3,
	texture_loot_closed = 4,
	texture_loot_open = 5,
	texture_stair_up = 6,
	texture_stair_down = 7;

const HEART = 0;

//components
const 
component_position = 0,
	component_movement = 1,
	component_display = 2,
	component_animation = 3,
	component_actions = 4,
	component_physical = 5,
	component_sprint = 6,
	component_direction = 7,
	component_map = 8,
	component_health = 9,
	component_light = 10,
	component_strength = 11,
	component_intelligence = 12,
	component_magic = 13,
	component_level = 14,
	component_depth = 15,
	component_stair = 16,
	component_combat = 17,
	component_ai = 18;

//events
const 
event_new_game = 0,
	event_start_game = 1,
	event_first_level_initiated = 2,
	event_player_generated = 3,
	event_down_level = 4,
	event_up_level = 5,
	event_new_level = 6,
	event_window_resized = 7,

	event_player_moved = 10,
	event_entity_moved = 11,
	event_player_start_sprinting = 12,
	event_player_stop_sprinting = 13,
	event_open_door = 14,

	event_successful_action = 20,
	event_failed_action = 21,

	event_new_animation = 30,

	event_begin_combat = 40,
	event_end_combat = 41,
	event_entity_take_damage = 42,
	event_player_melee_attack = 43,
	event_player_spin_attack = 44,
	event_player_take_damage = 45,

	event_entity_spawned = 50,
	event_spawn_enemy_close = 51,

	event_game_over = 1000
;

//direction
const direction_up = 0, direction_right = 1, direction_down = 2, direction_left = 3;

//animations
const 
animation_idle = 0,
	animation_move_up = 1,
	animation_move_right = 2,
	animation_move_down = 3,
	animation_move_left = 4,
	animation_sprint_up = 5,
	animation_sprint_right = 6,
	animation_sprint_down = 7,
	animation_sprint_left = 8,
	animation_melee_attack_up = 9,
	animation_melee_attack_right = 10,
	animation_melee_attack_down = 11,
	animation_melee_attack_left = 12,
	animation_spin_attack = 13;

//Actions
const 
action_none = -1,
	action_move = 0,
	action_move_up = 1,
	action_move_right = 2,
	action_move_down = 3,
	action_move_left = 4,
	action_sprint = 10,
	action_sprint_up = 11,
	action_sprint_right = 12,
	action_sprint_down = 13,
	action_sprint_left = 14,
	action_melee_attack = 20,
	action_melee_attack_up = 21,
	action_melee_attack_right = 22,
	action_melee_attack_down = 23,
	action_melee_attack_left = 24,
	action_spin_attack = 25;

const key_to_action = {
	"w": action_move_up,
	"a": action_move_left,
	"s": action_move_down,
	"d": action_move_right,
	"e": action_melee_attack,
	"q": action_spin_attack
};

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
animation_strings_to_constants["animation_spin_attack"] = animation_spin_attack;

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
action_strings_to_constants["action_spin_attack"] = action_spin_attack;

const action_to_priority = [];
action_to_priority[action_none] = 0;

action_to_priority[action_move_up] = 3;
action_to_priority[action_move_left] = 3;
action_to_priority[action_move_down] = 3;
action_to_priority[action_move_right] = 3;

action_to_priority[action_melee_attack] = 4;
action_to_priority[action_spin_attack] = 4;

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

const action_to_length = [];
action_to_length[action_move_up] = 100;
action_to_length[action_move_right] = 100;
action_to_length[action_move_down] = 100;
action_to_length[action_move_left] = 100;

action_to_length[action_sprint] = 60;

action_to_length[action_melee_attack_up] = 200;
action_to_length[action_melee_attack_right] = 200;
action_to_length[action_melee_attack_down] = 200;
action_to_length[action_melee_attack_left] = 200;

action_to_length[action_spin_attack] = 250;

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
action_to_animation[action_spin_attack] = animation_spin_attack;
