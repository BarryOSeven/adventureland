// MichaelK

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

function call_party_members(monster_type) {
	// send cm to party members to join farming
	const data = {
		type: "move_to_farm_location",
		x: character.real_x,
		y: character.real_y,
		map: character.map
	}

	send_cm(["Leonidas", "BarryOSeven"], data);
}

function move_to_farm_location(monster_type) {
	if (state !== "idle") {
		return;
	}

	state = "moving_to_farm_location";

	smart_move({to: monster_type}, function() {
		state = "idle";
	});

	return;
}

setInterval(function() {
	loot();
	
	if(character.rip || is_moving(character)) {
		return;
	}

	if (state === "attacking" && character.gold > request_merchant_on_gold + gold_offset) {
		const data = {
			type: "collect_money",
			x: character.real_x,
			y: character.real_y,
			map: character.in
		};

		send_cm("JafarM", data);
	}
	
	use_potions();

	buy_potions();
	
	const current_map = get_map();
	// const monster_name = monster_array[0][0];
	const monster_type = monster_array[0][1];
	const monster_map_name = monster_array[0][3];
	const monster_boundary = monster_array[0][4];

	if (!is_in_boundary(monster_boundary, monster_map_name)) {
		move_to_farm_location(monster_type);
	}

	call_party_members(monster_type);
	
	use_charge();
	
	let target=get_targeted_monster();
	
	if (!target) {
		target = get_nearest_monster();
		// target = get_nearest_hostile({
		// 	exclude: names
		// });

		// if (!target) {
		// 	target = get_nearest_monster();
		// }

		if(target) {
			change_target(target);
		} else {
			set_message("No Monsters");
			return;
		}	
	}

	if (target) {
		// send target to support classes
		const data = {
			type: "target"
		};

		send_cm(["BarryOSeven", "Leonidas"], data);
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
		state = "attacking";
		set_message("Attacking");
		attack(target);
	}

},1000/4);
