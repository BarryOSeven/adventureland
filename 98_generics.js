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
			case "gloves":
			case "wgloves":
				equip_strongest_gloves(i, item);
				break;
			case "pants":
			case "wbreeches":
				equip_strongest_pants(i, item);
				break;
			case "staff":
				if (class_of_character !== "mage") {
					break;
				}
				equip_strongest_mainhand(i, item);
				break;
			case "bow":
				if (class_of_character !== "ranger") {
					break;
				}
				equip_strongest_mainhand(i, item);
				break;
			case "blade":
				if (class_of_character !== "warrior") {
					break;
				}
				equip_strongest_mainhand(i, item);
				break;
			case "helmet":
				equip_strongest_helmet(i, item);
				break;
			case "shoes":
				equip_strongest_shoes(i, item);
				break;
			case "coat":
				equip_strongest_chest(i, item);
				break;
			case "wshield":
				if (class_of_character !== "mage") {
					break;
				} else
				if (class_of_character !== "ranger") {
					break;
				}
				equip_strongest_offhand(i, item);
				break;
		}
	}

}

function equip_strongest_mainhand(slot, item) {
	const current_mainhand = character.slots.mainhand;

	if (!current_mainhand) {
		equip(slot);
	}

	if (current_mainhand.level < item.level) {
		unequip("mainhand");
		equip(slot);
	}
}

function calculate_value(item_stats) {
	let value = 0;

	for (const stat in item_stats) {
		value += item_stats[stat];
	}

	return value;
}

// armor + stat + resistance
function equip_strongest_gloves(slot, item) {
	const current_gloves = character.slots.gloves;

	const current_properties = item_properties(current_gloves);
	const current_value = calculate_value(current_properties);

	const properties = item_properties(item);
	const value = calculate_value(properties);
	
	if (!current_gloves) {
		equip(slot);
	}

	if (current_value < value) {
		unequip("gloves");
		equip(slot);
	}
}

function equip_strongest_offhand(slot, item) {
	const current_offhand = character.slots.offhand;

	const current_properties = item_properties(current_offhand);
	const current_value = calculate_value(current_properties);

	const properties = item_properties(item);
	const value = calculate_value(properties);
	
	if (!current_offhand) {
		equip(slot);
	}

	if (current_value < value) {
		unequip("offhand");
		equip(slot);
	}
}

// armor + stat + resistance
function equip_strongest_helmet(slot, item) {
	const current_helmet = character.slots.helmet;

	const current_properties = item_properties(current_helmet);
	const current_value = calculate_value(current_properties);

	const properties = item_properties(item);
	const value = calculate_value(properties);
	
	if (!current_helmet) {
		equip(slot);
	}

	if (current_value < value) {
		unequip("helmet");
		equip(slot);
	}
}

// armor + stat + resistance
function equip_strongest_shoes(slot, item) {
	const current_shoes = character.slots.shoes;

	const current_properties = item_properties(current_shoes);
	const current_value = calculate_value(current_properties);

	const properties = item_properties(item);
	const value = calculate_value(properties);
	
	if (!current_shoes) {
		equip(slot);
	}

	if (current_value < value) {
		unequip("shoes");
		equip(slot);
	}
}

// armor + stat + resistance
function equip_strongest_chest(slot, item) {
	const current_chest = character.slots.chest;

	const current_properties = item_properties(current_chest);
	const current_value = calculate_value(current_properties);

	const properties = item_properties(item);
	const value = calculate_value(properties);
	
	if (!current_chest) {
		equip(slot);
	}

	if (current_value < value) {
		unequip("chest");
		equip(slot);
	}
}


// armor + stat + resistance + speed
function equip_strongest_pants(slot, item) {
	const current_pants = character.slots.pants;

	const current_properties = item_properties(current_pants);
	const current_value = calculate_value(current_properties);

	const properties = item_properties(item);
	const value = calculate_value(properties);
	
	if (!current_pants) {
		equip(slot);
	}

	if (current_value < value) {
		unequip("pants");
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