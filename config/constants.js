//constants
const UP = 0, RIGHT = 1, DOWN = 2, LEFT = 3;
const entity_player = 0, entity_mob = 1;
const light_max = light_range = 9, light_intensity = .05, light_red = 255, light_green = 200, light_blue = 30;
const shadow_intensity = .07, shadow_red = 10, shadow_green = 0, shadow_blue = 30, shadow_max = .4;

const light_fill_styles = [];

//Image constants
const HEART = 0;

//Commands
const command_move_entity = 0, command_roll_entity = 1, command_generate_level = 2, command_generate_player = 3, command_init = 4, command_clear_objects = 5, command_down_level = 6, command_up_level = 7;

//components
const component_position = 0, component_movement = 1, component_display = 2, component_animation = 3, component_actions = 4, component_physical = 5, component_sprint = 6, component_direction = 7, component_level = 8, component_health = 9, component_light = 10;


//events
const event_game_start = 0, event_player_moved = 1, event_entity_moved = 2, event_entity_sprinted = 3, event_player_startsprint = 4, event_player_stopsprint = 5, event_entity_rolled = 6, event_entity_failed_roll= 7, event_open_door = 8, event_down_level = 9, event_up_level = 10, event_window_resized = 11, event_new_level = 12;

//direction
const direction_up = 0, direction_right = 1, direction_down = 2, direction_left = 3;

//animations
const animation_idle = 0, animation_move_up = 1, animation_move_right = 2, animation_move_down = 3, animation_move_left = 4, animation_sprint_up = 5, animation_sprint_right = 6, animation_sprint_down = 7, animation_sprint_left = 8, animation_roll_up = 9, animation_roll_right = 10, animation_roll_down = 11, animation_roll_left = 12;

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

const action_length = [];
action_length[action_move] = 9;
action_length[action_sprint] = 4;
action_length[action_foward_attack] = 10;
action_length[action_spin_attack] = 10;
action_length[action_roll] = 6;
action_length[action_failed_roll] = 25;

const action_cooldown = [];
action_cooldown[action_move] = 0;
action_cooldown[action_sprint] = 0;
action_cooldown[action_foward_attack] = 10;
action_cooldown[action_spin_attack] = 10;
action_cooldown[action_roll] = 10;
action_cooldown[action_failed_roll] = 0;

const action_to_direction = [];
action_to_direction[action_move_up] = direction_up;
action_to_direction[action_move_right] = direction_right;
action_to_direction[action_move_down] = direction_down;
action_to_direction[action_move_left] = direction_left;

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
