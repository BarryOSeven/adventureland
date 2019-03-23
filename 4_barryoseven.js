// BarryOSeven

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
	
	var target=get_targeted_monster();
	if(!target)
	{
		target=get_nearest_monster({min_xp:100,max_att:120});
		if(target) change_target(target);
		else
		{
			set_message("No Monsters");
			return;
		}
	}
	
	if(!in_attack_range(target))
	{
		smart_move(
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