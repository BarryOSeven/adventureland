// MichaelK

// used for monster determination
let target_index = 0;
const reset_target_index_time = 20; // minutes

load_code(98, function() {
	game_log("Unable to run generics");
});

load_code(97, function() {
	game_log("Unable to run updates");
});

load_code(99, function() {
	game_log("Unable to run monster determinator");
});

function use_charge() {
	if (can_use("charge")) {
	    use_skill("charge");	
	}	
}

function use_taunt() {
	if (can_use("taunt")) {
		use_skill("taunt");
	}
}

function call_party_members(monster_farm_location, monster_map_name) {
	// send cm to party members to join farming
	const data = {
		type: "move_to_farm_location",
		x: monster_farm_location.x,
		y: monster_farm_location.y,
		map: monster_map_name
	}

	send_cm(["Leonidas", "BarryOSeven"], data);
}

function move_to_farm_location(monster_farm_location, monster_map_name) {
	state = "moving_to_farm_location";

	const current_map_name = get_map().name;

	if (current_map_name !== monster_map_name) {
		smart_move(get_map_identifier(monster_map_name), function() {
			state = "idle";
		});
	} else {
		smart_move(monster_farm_location, function() {
			state = "idle";
		});
	}

	return;
}

function support_update_target(target) {
	// send target to support classes
	const data = {
		type: "target",
		target_id: target.id
	};

	send_cm(["BarryOSeven", "Leonidas"], data);
}

setInterval(function() {
	loot();
	
	if(manual_mode || character.rip || is_moving(character)) {
		return;
	}

	handle_collection();
	
	use_potions();

	buy_potions();
	
	const monster_type = monster_array[target_index][1];
	const monster_map_name = monster_array[target_index][3];
	const monster_boundary = monster_array[target_index][4];

	const monster_farm_location = get_center_location_of_boundary(monster_boundary);

	call_party_members(monster_farm_location, monster_map_name);

	if (!is_in_boundary(monster_boundary, monster_map_name)) {
		move_to_farm_location(monster_farm_location, monster_map_name);
		return;
	}
	
	use_charge();
	
	let target = get_targeted_monster();
	
	if (!target) {
		target = get_nearest_monster({
			type: monster_type
		});

		if (!target) {
			target = get_nearest_monster({
				min_xp: 100,
				max_att: (character.max_hp / 4)
			});
			// target_index++;

			// function reset_target_index() {
			// 	target_index = 0;
			// }

			// setTimeout(reset_target_index, reset_target_index_time * 60 * 1000);
		}

		if(target) {
			change_target(target);
		} else {
			set_message("No Monsters");
			return;
		}	
	}

	if (target) {
		state = "attacking";
		support_update_target(target);
	}

	if (!target) {
		state = "idle";
	}

	if(!in_attack_range(target))
	{
		move(
			character.x+(target.x-character.x)/2,
			character.y+(target.y-character.y)/2
		);
		// Walk half the distance
	}
	else if(can_attack(target))
	{
		set_message("Attacking");

		// if target of target !== me
		use_taunt();

		attack(target).then((data) => {
			reduce_cooldown("attack", character.ping);
		})
	}

},1000/4);
