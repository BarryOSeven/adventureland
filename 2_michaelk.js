// MichaelK
load_code(99, function() {
	game_log("Unable to run monster determinator");
});

setInterval(function(){
	if (character.max_hp - character.hp > 200) {
		use('hp');	
	}

	if ((character.max_mp - character.mp > 300) || (character.mp <= 3)) {
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
	const monster_map_name = monster_array[3];
	const monster_name = monster_array[0];
	game_log(current_map.name);
	if (current_map.name !== monster_map_name) {
		game_log("Moving to monster: " + monster_name);
		smart_move({to: monster_name});
		return;
	}

	target=get_nearest_monster({type: monster_array[0][1]});
	
	if(target) {
		change_target(target);
	} else {
		set_message("No Monsters");
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
		set_message("Attacking");
		attack(target);
	}

},1000/4);