const request_merchant_on_gold = 15000;

function on_cm(name, data) {
    const characters = ["JafarM", "MichaelK", "Leonidas", "BarryOSeven"];
    
    if (characters.indexOf(name) === -1) {
        return;
    }

	switch(data.type) {
		case "collect_money":
			game_log("collecting money");
            handle_collect(data.player);
			break;
		case "target":
			change_target(data.target);
			break;
		case "send_money":
			handle_send_money(data.name);
			break;
		case "send_items":
			handle_send_items(data.name);
			break;
	}
}

function handle_collect(player) {
    if (state !== "idle") {
        return;
    }

    if (is_moving(character)) {
		return;
    }

    state = "collect";

    smart_move({x: player.real_x, y: player.real_y, map: player.in}, function() {
        const data = {
            type: "send_money",
            name: character.name
        };
        send_cm(player.name, data);

        const data = {
            type: "send_items",
            name: character.name
        }
        send_cm(player.name, data);

        state = "idle";
    });
}

function handle_send_money(name) {
	send_gold(name, character.gold - 2000);
}

function handle_send_items(name) {
	for(var i=0;i<42;i++)
	{
		if(!character.items[i]) continue;
		const item=character.items[i];
	
		if (item.name === "hpot0" || item.name === "mpot0") {
			continue;
		}
		
		send_item(name, i);
	}
}

// logs inventory to screen
function handle_log() {
	for(var i=0;i<42;i++)
	{
		if(!character.items[i]) continue;
		const item=character.items[i];
		game_log(item.name);
	}
}