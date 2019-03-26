let state = "idle";
const request_merchant_on_gold = 15000;
const gold_offset = 2000;

add_top_button("log", "Log", () => {
    const data = {
        type: "log"
    };

    send_cm(["JafarM", "MichaelK", "Leonidas", "BarryOSeven"], data);
});

function on_cm(name, data) {
    const characters = ["JafarM", "MichaelK", "Leonidas", "BarryOSeven"];
    
    if (characters.indexOf(name) === -1) {
        return;
    }

	switch(data.type) {
		case "collect_money":
            handle_collect(name, data);
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
		case "log":
			handle_log();
			break;
	}
}

function handle_collect(name, data) {
    if (state !== "idle") {
        return;
    }

    if (is_moving(character)) {
		return;
    }

    state = "collect";

    smart_move({x: data.x, y: data.y, map: data.map}, function() {
        const dataSendMoney = {
            type: "send_money",
            name: character.name
        };
        send_cm(name, dataSendMoney);

        const dataSendItems = {
            type: "send_items",
            name: character.name
        }
        send_cm(name, dataSendItems);

        state = "idle";
    });
}

function handle_send_money(name) {
	send_gold(name, character.gold - gold_offset);
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

// logs character information to screen
function handle_log() {
	game_log("State: " + state);
	game_log("Gold: " + character.gold);
	for(var i=0;i<42;i++)
	{
		if(!character.items[i]) continue;
		const item=character.items[i];
		game_log(item.name);
	}
}

function handle_death() {
	state = "idle";
	setTimeout(respawn, 15000);
	return true;
}