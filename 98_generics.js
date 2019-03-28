let state = "idle";
const request_merchant_on_gold = 15000;
const gold_offset = 2000;

const buy_potions_on_gold = 500;
const names = ["JafarM", "MichaelK", "Leonidas", "BarryOSeven"];
const currentPlayer = parent.parent.character.name;

auto_reload("on");

// temporary game loop
setInterval(function() {
	equip_strongest_items();
}, 30 * 1000);
// ------

add_top_button("log", "Log", () => {
    const data = {
        type: "log"
    };

    send_cm(["JafarM", "MichaelK", "Leonidas", "BarryOSeven"], data);
});

function locate_item(name) {
	for(var i=0; i<42; i++)
	{
		if(!character.items[i]) {
			continue;
		}

		const item = character.items[i];

		if (item.name === name) {
			return item;
		}
	}
}

function locate_item_slot(name) {
	for(var i=0; i<42; i++)
	{
		if(!character.items[i]) {
			continue;
		}

		const item = character.items[i];
		
		if (item.name === name) {
			return i;
		}
	}
}

function on_cm(name, data) {
    const characters = ["JafarM", "MichaelK", "Leonidas", "BarryOSeven"];
    
    if (characters.indexOf(name) === -1) {
        return;
    }

	switch(data.type) {
		case "collect_money":
            handle_collect(name, data);
			break;
		case "equip_item":
			handle_equip();
			break;
		case "target":
			handle_target(name)
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

function on_party_invite(name) {
    if (names.indexOf(name) === -1) {
        return;
    }

    accept_party_invite(name);
}

function on_party_request(name) {
    if (names.indexOf(name) === -1) {
        return;
    }

    accept_party_request(name);
}

function handle_equip() {
	equip_strongest_items();
}

function equip_strongest_items() {
	const class_of_character = character.ctype;

	for(var i=0; i<42; i++)
	{
		if(!character.items[i]) {
			continue;
		}
		
		const item = character.items[i];
		
		if (item.name === "hpot0" || item.name === "mpot0") {
			continue;
		}
		
		switch (item.name) {
			case "stramulet":
				if (class_of_character !== "warrior") {
					break;
				}
				equip_strongest_amulet(i, item);
				break;
			case "intamulet":
				if (class_of_character !== "mage") {
					break;
				}
				equip_strongest_amulet(i, item);
				break;
			case "dexamulet":
				if (class_of_character !== "ranger") {
					break;
				}
				equip_strongest_amulet(i, item);
				break;
			case "hpamulet":
				if (class_of_character !== "merchant") {
					break;
				}
				equip_strongest_amulet(i, item);
				break;
			case "wgloves":
				equip_strongest_gloves(i, item);
				break;
		}
	}

}

// armor + stat + resistance
function equip_strongest_gloves(slot, item) {
	const current_gloves = character.slots.gloves;

	const current_properties = item_properties(current_gloves);
	const current_value = current_properties.armor + current_properties.resistance + current_properties.stat;

	const properties = item_properties(item);
	const value = properties.armor + properties.resistance + properties.stat;
	
	if (!current_gloves) {
		equip(slot);
	}

	if (current_value < value) {
		unequip("gloves");
		equip(slot);
	}
}

function equip_strongest_amulet(slot, item) {
	const current_amulet = character.slots.amulet;

	if (!current_amulet) {
		equip(slot);
	}

	if (current_amulet.level < item.level) {
		unequip("amulet");
		equip(slot);
	}
}

function handle_target(name) {
	const leader = get_player(name);
	const target = get_target_of(leader);

	change_target(target);
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
		const item = character.items[i];
	
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
		const item = character.items[i];
		game_log(item.name);
	}
}

function handle_death() {
	state = "idle";
	setTimeout(respawn, 15000);
	return true;
}

function buy_potions() {
	// buy potions
	if (character.gold >= buy_potions_on_gold) {
		// buy mana potions
		if (quantity("mpot0") === 0) {
			smart_move({to:"potions", return: true}, function() {
				const potionCost = 20;
				const amount = Math.floor(character.gold / potionCost);
				buy_with_gold("mpot0", amount);
				return;
			});
		}
		
		// buy health potions
		if (quantity("hpot0") === 0) {
			smart_move({to:"potions", return: true}, function() {
				const potionCost = 20;
				const amount = Math.floor(character.gold / potionCost);
				buy_with_gold("hpot0", amount);
				return;
			});
		}
	}
}

function use_potions() {
	if (character.max_hp - character.hp > 200 && quantity("hpot0") > 0) {
		use('hp');	
	}

	if ((character.max_mp - character.mp > 300) || (character.mp <= 3) && quantity("mpot0") > 0) {
		use('mp');	
	}
}