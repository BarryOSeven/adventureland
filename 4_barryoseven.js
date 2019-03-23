// BarryOSeven
load_code(99, function() {
	game_log("Unable to run monster determinator");
});

function on_cm(name, data) {
	change_target(data);
}

setInterval(function(){
	if (character.max_hp - character.hp > 200) {
		use('hp');	
	}
	
	if (character.max_mp - character.mp > 300) {
		use('mp');	
	}
	
	loot();

	const merchant = get_player("JafarM");
	const goldOffset = 2000;
	if (is_player(merchant) && character.gold > goldOffset + 100) {
		send_gold("JafarM", character.gold - goldOffset);
	}
	
	if (character.rip) {
		respawn();	
	}
	
	if(character.rip || is_moving(character)) return;

	// buy mana potions
	if (quantity("mpot0") < 5) {
		smart_move({to:"potions", return: true}, function() {
			buy_with_gold("mpot0", 20);
			return;
		});
	}
	
	// buy health potions
	if (quantity("hpot0") < 5) {
		smart_move({to:"potions", return: true}, function() {
			buy_with_gold("hpot0", 20);
			return;
		});
	}
	
	const current_map = get_map();
	const monster_name = monster_array[0][0];
	const monster_type = monster_array[0][1];
	const monster_map_name = monster_array[0][3];
	
	if (current_map.name !== monster_map_name) {
		game_log("Moving to monster type: " + monster_type + " on map " + monster_map_name);
		smart_move({to: monster_type});
		return;
	}

	var target=get_targeted_monster();
	if (!target) {
		target = get_nearest_monster();

		// send target to support classes
		send_cm(["BarryOSeven", "Leonidas"], target);

		if(target) {
			change_target(target);
		} else {
			set_message("No Monsters");
			return;
		}	
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
		attack(target);
	}

},1000/4);
