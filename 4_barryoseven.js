// BarryOSeven

load_code(98, function() {
	game_log("Unable to run generics");
});

load_code(97, function() {
	game_log("Unable to run updates");
});

setInterval(function(){
	loot();
	
	if(character.rip || is_moving(character)) return;

	handle_collection();

	use_potions();

	buy_potions();

	let target=get_targeted_monster();

	if (target) {
		state = "attacking";
	}

	if (!target) {
		state = "idle";
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
		set_message("Attacking");
		attack(target).then((data) => {
			reduce_cooldown("attack", character.ping);
		});
	}

},1000/4);
