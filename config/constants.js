//constants
const TITLE_SCREEN = false;
const LOADING_SCREEN_TIME = 20;
const DO_LEVEL_GEN = true;
const DEBUG_MODE = true;
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
const light_range = 10, light_max = light_range - 1;
const light_intensity = .25, light_red = 255, light_green = 190, light_blue = 0;
const shadow_intensity = .40, shadow_stop = 4, shadow_red = 10, shadow_green = 0, shadow_blue = 40;
const light_fill_string = 'rgba(' + light_red + ',' + light_green + ',' + light_blue + ',' + light_intensity + ')';

const light_level_to_light = [];
const light_level_to_shadow = [];
for(let i = 0; i < light_range; i++) {
	light_level_to_light.unshift('rgba(' +
		floor(light_red - ((light_red / (light_range - 1)) * i)) + ',' +
		floor(light_green - ((light_green / (light_range - 1)) * i)) + ',' +
		floor(light_blue - ((light_blue / (light_range - 1)) * i)) + ',' +
		(floor(100 * (light_intensity - ((light_intensity / (light_range - 1)) * i))) / 100) + ')');
	if(i > shadow_stop) {
		light_level_to_shadow.push('rgba(0,0,0,0)');
	}
	else {
		light_level_to_shadow.push('rgba(' +
			floor(shadow_red - ((shadow_red / shadow_stop) * i)) + ',' +
			floor(shadow_green - ((shadow_green / shadow_stop) * i)) + ',' +
			floor(shadow_blue - ((shadow_blue / shadow_stop) * i)) + ',' +
			(floor(100 * (shadow_intensity - ((shadow_intensity / shadow_stop) * i))) / 100) + ')');
	}
}

light_level_to_light[light_level_to_light.length - 1] = light_level_to_light[light_level_to_light.length - 2];

const light_level_player = 3, light_level_torch = light_max - 2;

// console.log(light_level_to_light);
// console.log(light_level_to_shadow);

//direction
const direction_up = 0, direction_right = 1, direction_down = 2, direction_left = 3;

//square constants
const square_floor = 0, square_wall = 1, square_door = 2, square_stair = 3, square_level_origin = 4;

//interactables
const interactable_door = 0, interactable_stair = 1;

//texture constants
const texture_floor = 0,
	texture_wall = 1,
	texture_door_closed = 2,
	texture_door_open = 3,
	texture_stair = 6,
	texture_level_origin = 7;

const texture_default = 0,
	texture_alt1 = 1,
	texture_alt2 = 2,
	texture_alt3 = 3,
	texture_alt4 = 4,
	texture_alt5 = 5,
	texture_alt6 = 6,
	texture_alt7 = 7,
	texture_alt8 = 8,
	texture_alt9 = 9,
	texture_side_top = 10,
	texture_side_right = 11,
	texture_side_bottom = 12,
	texture_side_left = 13,
	texture_in_corner_top_right = 14,
	texture_in_corner_bottom_right = 15,
	texture_in_corner_bottom_left = 16,
	texture_in_corner_top_left = 17,
	texture_out_corner_top_right = 18,
	texture_out_corner_bottom_right = 19,
	texture_out_corner_bottom_left = 20,
	texture_out_corner_top_left = 21,
	texture_U_top = 22,
	texture_U_right = 23,
	texture_U_bottom = 24,
	texture_U_left = 25,
	texture_cross = 26,
	texture_num_alts = 27;


const texture_probability_distribution = [];
texture_probability_distribution[0] = 55;
texture_probability_distribution[1] = texture_probability_distribution[0] + 34;
texture_probability_distribution[2] = texture_probability_distribution[1] + 21;
texture_probability_distribution[3] = texture_probability_distribution[2] + 13;
texture_probability_distribution[4] = texture_probability_distribution[3] + 8;
texture_probability_distribution[5] = texture_probability_distribution[4] + 5;
texture_probability_distribution[6] = texture_probability_distribution[5] + 3;
texture_probability_distribution[7] = texture_probability_distribution[6] + 2;
texture_probability_distribution[8] = texture_probability_distribution[7] + 1;
texture_probability_distribution[9] = texture_probability_distribution[8] + 1;

const texture_probability_max = texture_probability_distribution[texture_probability_distribution.length - 1];

const ui_heart = 0, ui_empty_heart = 1;

//components
const component_position = 0,
	component_movement = 1,
	component_display = 2,
	component_texture = 3,
	component_animation = 4,
	component_actions = 5,
	component_sprint = 6,
	component_direction = 7,
	component_map = 8,
	component_health = 9,
	component_light = 10,
	component_strength = 11,
	component_dexterity = 12,
	component_magic = 13,
	component_level = 14,
	component_depth = 15,
	component_stair = 16,
	component_combat = 17,
	component_ai = 18,
	component_light_emitter = 19,
	component_collision = 20,
	component_abilities = 21,
	component_controller = 22,
	component_interactable = 23;

//events
const event_new_game = 0,
	event_reset_game = 1,
	event_window_resized = 2,

	event_level_generated = 3,
	event_player_generated = 4,
	event_down_level = 5,
	event_new_level = 6,
	event_new_player = 7,
	event_entities_loaded = 8,
	event_begin_level = 9,

	event_player_moved = 10,
	event_entity_moved = 11,
	event_player_start_sprinting = 12,
	event_player_stop_sprinting = 13,
	event_open_door = 14,

	event_successful_action = 20,
	event_failed_action = 21,

	event_new_animation = 30,
	event_hitstun = 31,

	event_begin_combat = 40,
	event_end_combat = 41,
	event_melee_ability = 42,
	event_aoe_ability = 43,
	event_aoe_ranged_ability = 44,
	event_skillshot_ability = 45,
	event_smite_ability = 46,

	event_entity_spawned = 50,
	event_spawn_enemy_close = 51,

	event_entity_take_damage = 60,
	event_player_take_damage = 61,

	event_title_screen = 999,
	event_game_over = 1000
;

const event_to_string = [];
	event_to_string[0]= "event_new_game";
	event_to_string[1]= "event_reset_game";
	event_to_string[2]= "event_window_resized";
	event_to_string[3]= "event_level_generated";
	event_to_string[4]= "event_player_generated";
	event_to_string[5]= "event_down_level";
	event_to_string[6]= "event_new_level";
	event_to_string[8]= "event_entities_loaded";
	event_to_string[9]= "event_begin_level";
	event_to_string[10]= "event_player_moved";
	event_to_string[11]= "event_entity_moved";
	event_to_string[12]= "event_player_start_sprinting";
	event_to_string[13]= "event_player_stop_sprinting";
	event_to_string[14]= "event_open_door";
	event_to_string[20]= "event_successful_action";
	event_to_string[21]= "event_failed_action";
	event_to_string[30]= "event_new_animation";
	event_to_string[31]= "event_hitstun";
	event_to_string[40]= "event_begin_combat";
	event_to_string[41]= "event_end_combat";
	event_to_string[42]= "event_melee_ability";
	event_to_string[43]= "event_aoe_ability";
	event_to_string[44]= "event_aoe_ranged_ability";
	event_to_string[45]= "event_skillshot_ability";
	event_to_string[46]= "event_smite_ability";
	event_to_string[50]= "event_entity_spawned";
	event_to_string[51]= "event_spawn_enemy_close";
	event_to_string[60]= "event_entity_take_damage";
	event_to_string[61]= "event_player_take_damage";
	event_to_string[999]= "event_title_screen";
	event_to_string[1000]= "event_game_over"




// Actions
const action_none = 0,

	action_move = 10,
	action_move_up = 11,
	action_move_right = 12,
	action_move_down = 13,
	action_move_left = 14,

	action_ability_primary = 20,
	action_ability_secondary = 21,
	action_ability_special = 22

	// action_ability_one = 20,
	// action_ability_two = 21,
	// action_ability_three = 22
;

// Entity constants
const class_warrior = 0,
	class_mage = 1,
	class_rogue = 2,
	entity_skeleton = 3,
	boss_blob = 4 ;

// Entity defaults
// PLAYER
const DEFAULT_PLAYER_SIZE = 1;
const DEFAULT_PLAYER_HEALTH = 100;
const DEFAULT_PLAYER_ATTACK_DAMAGE = 10;
const DEFAULT_PLAYER_MAGIC_DAMAGE = 10;
const DEFAULT_PLAYER_ARMOR = 10;
const DEFAULT_PLAYER_ACTIONS = [
	action_move_up,
	action_move_right,
	action_move_down,
	action_move_left,
	action_ability_primary,
	action_ability_secondary,
	action_ability_special
];

const DEFAULT_CONTROLLER_LAYOUT = {}
DEFAULT_CONTROLLER_LAYOUT[87] = action_move_up;  		//w
DEFAULT_CONTROLLER_LAYOUT[68] = action_move_right;  	//d
DEFAULT_CONTROLLER_LAYOUT[83] = action_move_down; 		//s
DEFAULT_CONTROLLER_LAYOUT[65] = action_move_left; 		//a
DEFAULT_CONTROLLER_LAYOUT
DEFAULT_CONTROLLER_LAYOUT[38] = action_move_up;
DEFAULT_CONTROLLER_LAYOUT[39] = action_move_right
DEFAULT_CONTROLLER_LAYOUT[40] = action_move_down;
DEFAULT_CONTROLLER_LAYOUT[37] = action_move_left;
DEFAULT_CONTROLLER_LAYOUT
DEFAULT_CONTROLLER_LAYOUT[49] = action_ability_primary;    	//1
DEFAULT_CONTROLLER_LAYOUT[50] = action_ability_secondary;   //2
DEFAULT_CONTROLLER_LAYOUT[51] = action_ability_special; 	//3

//ENEMY
const DEFAULT_ENEMY_SIZE = 1;
const DEFAULT_ENEMY_HEALTH = 50;
const DEFAULT_ENEMY_ATTACK_DAMAGE = 10;
const DEFAULT_ENEMY_MAGIC_DAMAGE = 10;
const DEFAULT_ENEMY_ARMOR = 10;
const DEFAULT_ENEMY_ACTIONS = [
	action_move_up,
	action_move_right,
	action_move_down,
	action_move_left
]


const entity_string_to_constant = [];
entity_string_to_constant['warrior'] = class_warrior;
entity_string_to_constant['mage'] = class_mage;
entity_string_to_constant['rogue'] = class_rogue;
entity_string_to_constant['skeleton'] = entity_skeleton;
entity_string_to_constant['blob'] = boss_blob;


// Animations
const animation_idle = 0,
	animation_move_up = 1,
	animation_move_right = 2,
	animation_move_down = 3,
	animation_move_left = 4,
	animation_no_animations_yet = 1000;

const animation_strings_to_constants = [];

animation_strings_to_constants['animation_idle'] = animation_idle;

animation_strings_to_constants['animation_move_up'] = animation_move_up;
animation_strings_to_constants['animation_move_right'] = animation_move_right;
animation_strings_to_constants['animation_move_down'] = animation_move_down;
animation_strings_to_constants['animation_move_left'] = animation_move_left;


// const action_string_to_constant = [];
// action_string_to_constant['action_none'] = action_none;

// action_string_to_constant['action_move_up'] = action_move_up;
// action_string_to_constant['action_move_right'] = action_move_right;
// action_string_to_constant['action_move_down'] = action_move_down;
// action_string_to_constant['action_move_left'] = action_move_left;

// action_string_to_constant['action_ability_one'] = action_ability_one;
// action_string_to_constant['action_ability_two'] = action_ability_two;
// action_string_to_constant['action_ability_three'] = action_ability_three;

const keyCode_to_action = [];
keyCode_to_action[87] = action_move_up;  		//w
keyCode_to_action[68] = action_move_right;  	//d
keyCode_to_action[83] = action_move_down; 		//s
keyCode_to_action[65] = action_move_left; 		//a
//arrows
keyCode_to_action[38] = action_move_up;
keyCode_to_action[39] = action_move_right
keyCode_to_action[40] = action_move_down;
keyCode_to_action[37] = action_move_left;

keyCode_to_action[49] = action_ability_primary;    	//1
keyCode_to_action[50] = action_ability_secondary;   //2
keyCode_to_action[51] = action_ability_special; 	//3

// keyCode_to_action[49] = action_ability_one;    	//1
// keyCode_to_action[50] = action_ability_two;    	//2
// keyCode_to_action[51] = action_ability_three; 	//3


const action_to_priority = [];
action_to_priority[action_none] = 0;

action_to_priority[action_move_up] = 3;
action_to_priority[action_move_left] = 3;
action_to_priority[action_move_down] = 3;
action_to_priority[action_move_right] = 3;

action_to_priority[action_ability_primary] = 4;
action_to_priority[action_ability_secondary] = 4;
action_to_priority[action_ability_special] = 4;
// action_to_priority[action_ability_one] = 4;
// action_to_priority[action_ability_two] = 4;
// action_to_priority[action_ability_three] = 4;

const action_to_direction = [];
action_to_direction[action_move_up] = direction_up;
action_to_direction[action_move_right] = direction_right;
action_to_direction[action_move_down] = direction_down;
action_to_direction[action_move_left] = direction_left;

// const direction_to_movement = [];
// direction_to_movement[direction_up] = action_move_up;
// direction_to_movement[direction_right] = action_move_right;
// direction_to_movement[direction_down] = action_move_down;
// direction_to_movement[direction_left] = action_move_left;

const action_to_animation = [];

action_to_animation[action_none] = animation_idle;

action_to_animation[action_move_up] = animation_move_up;
action_to_animation[action_move_right] = animation_move_right;
action_to_animation[action_move_down] = animation_move_down;
action_to_animation[action_move_left] = animation_move_left;

// Ability types
const ability_type_melee = 0,
	ability_type_aoe = 1,
	ability_type_aoe_ranged = 2,
	ability_type_skillshot = 3,
	ability_type_smite = 4
;

const ability_type_string_to_constant = [];
ability_type_string_to_constant['melee'] = ability_type_melee;
ability_type_string_to_constant['aoe'] = ability_type_aoe;
ability_type_string_to_constant['aoe_ranged'] = ability_type_aoe_ranged;
ability_type_string_to_constant['skillshot'] = ability_type_skillshot;
ability_type_string_to_constant['smite'] = ability_type_smite;


// Abilities
const ability_slash = 0,
	ability_spin_attack = 1,
	ability_judgement_day = 2

// ability_spin_attack = 3,
// ability_spin_attack = 4,
// ability_spin_attack = 5,
// ability_spin_attack = 6,
// ability_spin_attack = 7,
// ability_spin_attack = 8,

;

const ability_string_to_constant = [];
ability_string_to_constant['Slash'] = ability_slash;
ability_string_to_constant['Spin Attack'] = ability_spin_attack;
ability_string_to_constant['Judgement Day'] = ability_judgement_day;
