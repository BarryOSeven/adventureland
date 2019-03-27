// Leonidas

load_code(98, function() {
	game_log("Unable to run generics");
});

load_code(97, function() {
	game_log("Unable to run updates");
});

load_code(99, function() {
	game_log("Unable to run monster determinator");
});

load_code(96, function() {
    game_log("Unable to run party");
});

function use_huntersmark(target) {
	if (can_use("huntersmark")) {
		use_skill("huntersmark", target);	
	}
}

let target;

setInterval(function(){	
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
	const monster_name = monster_array[0][0];
	const monster_type = monster_array[0][1];
	const monster_map_name = monster_array[0][3];
	
	if (current_map.name !== monster_map_name) {
		state = "idle";
		game_log("Moving to monster type: " + monster_type + " on map " + monster_map_name);
		smart_move({to: monster_type});
		return;
	}

	let target=get_targeted_monster();
	
	if (target) {
		use_huntersmark(target);
	}
	
	if (!target) {
		set_message("Waiting for target");
		return;
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
