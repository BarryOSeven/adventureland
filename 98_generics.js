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

function locate_combinable_items() {
	const items = [];

	for (let i=0; i<42; i++) {
		if(!character.items[i]) {
			continue;
		}

		const item = character.items[i];

		switch(item.name) {
			case "ringsj":
			case "hpbelt":
			case "hpamulet":
			case "dexamulet":
			case "intamulet":
			case "stramulet":
				const itemObject = {
					item: item,
					slot: i
				};

				items.push(itemObject);
				break;
		}
		
	}

	return items;
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
		case "move_to_farm_location":
			handle_move_to_farm_location(data.x, data.y, data.map);
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

function handle_move_to_farm_location(x, y, map) {
	if (state !== "idle") {
		return;
	}

	const range = 10;
	if (is_in_range(x, y, map, range)) {
		return;
	}

	state = "moving_to_farm_location";

	smart_move({x: x, y: y, map: map}, function() {
		state = "attacking"
	});
}

function is_in_boundary(boundary, map) {
	const current_map = get_map();

	if (current_map.name !== map) {
		return false;
	}

	const x_min = boundary[0];
	const y_min = boundary[1];
	const x_max = boundary[2];
	const y_max = boundary[3];

	if (character.real_x > x_min &&
		character.real_x < x_max &&
		character.real_y > y_min &&
		character.real_y < y_max) {
			return true;
	}

	return false;
}

function is_in_range(x, y, map, range) {
	const current_map = get_map();

	if (current_map !== map) {
		return false;
	}

	const character_x = character.real_x;
	const x_delta = Math.abs(character_x - x);
	
	if (x_delta > range) {
		return false;
	}

	const character_y = character.real_y;
	const y_delta = Math.abs(character_y - y);
	
	if (y_delta > range) {
		return false;
	}

	return true;
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
				equip_strongest("gloves", i, item);
				break;
			case "pants":
			case "wbreeches":
				equip_strongest("pants", i, item);
				break;
			case "staff":
				if (class_of_character !== "mage") {
					break;
				}
				equip_strongest("mainhand", i, item);
				break;
			case "bow":
				if (class_of_character !== "ranger") {
					break;
				}
				equip_strongest("mainhand", i, item);
				break;
			case "blade":
				if (class_of_character !== "warrior") {
					break;
				}
				equip_strongest("mainhand", i, item);
				break;
			case "helmet":
				equip_strongest("helmet", i, item);
				break;
			case "shoes":
				equip_strongest("shoes", i, item);
				break;
			case "coat":
				equip_strongest("chest", i, item);
				break;
			case "wshield":
				if (class_of_character !== "mage") {
					break;
				} else
				if (class_of_character !== "ranger") {
					break;
				}
				equip_strongest("offhand", i, item);
				break;
			case "quiver":
				if (class_of_character !== "ranger") {
					break;
				}
				equip_strongest("offhand", i, item);
				break;
			case "dexbelt":
				if (class_of_character !== "ranger") {
					break;
				}
				equip_strongest("belt", i, item);
				break;
			case "intbelt":
				if (class_of_character !== "mage") {
					break;
				}
				equip_strongest("belt", i, item);
				break;
			case "strbelt":
				if (class_of_character !== "warrior") {
					break;
				}
				equip_strongest("belt", i, item);
				break;
			// book of knowledge
			case "wbook0":
				if (class_of_character !== "mage") {
					break;
				}
				equip_strongest("offhand", i, item);
				break;
			case "strring":
				if (class_of_character !== "warrior") {
					break;
				}
				equip_strongest_ring(i, item);
				break;
			case "strearring":
				if (class_of_character !== "warrior") {
					break;
				}
				equip_strongest_earring(i, item);
				break;
			case "intring":
				if (class_of_character !== "mage") {
					break;
				}
				equip_strongest_ring(i, item);
				break;
			case "intearring":
				if (class_of_character !== "mage") {
					break;
				}
				equip_strongest_earring(i, item);
				break;
			case "dexring":
				if (class_of_character !== "ranger") {
					return;
				}
				equip_strongest_ring(i, item);
				break;
			case "dexearring":
				if (class_of_character !== "ranger") {
					return;
				}
				equip_strongest_earring(i, item);
				break;
		}
	}

}

function equip_strongest_ring(slot, item) {
	const current_ring_1 = character.slots.ring1;
	const current_ring_2 = character.slots.ring2;

	const properties_1 = item_properties(current_ring_1);
	const current_value_1 = calculate_value(properties_1);

	const properties2 = item_properties(current_ring_2);
	const current_value_2 = calculate_value(properties2);

	if (current_value_1 < current_value_2) {
		equip_strongest("ring1", slot, item);
	} else {
		equip_strongest("ring2", slot, item);
	}
}

function equip_strongest_earring(slot, item) {
	const current_earring_1 = character.slots.ring1;
	const current_earring_2 = character.slots.ring2;

	const properties_1 = item_properties(current_earring_1);
	const current_value_1 = calculate_value(properties_1);

	const properties_2 = item_properties(current_earring_2);
	const current_value_2 = calculate_value(properties_2);

	if (current_value_1 < current_value_2) {
		equip_strongest("earring1", slot, item);
	} else {
		equip_strongest("earring2", slot, item);
	}
}

function calculate_value(item_stats) {
	let value = 0;

	for (const stat in item_stats) {
		if (stat === "hp" || stat === "mp") {
			value += item_stats[stat] / 100; // normalize high values
		} else
		if (character.ctype === "mage" && stat === "int") {
			value += 2 * item_stats[stat];
		} else
		if (character.ctype === "warrior" && stat === "str") {
			value += 2 * item_stats[stat];
		} else
		if (character.ctype === "ranger" && stat === "dex") {
			value += 2 * item_stats[stat];
		} else
		if (character.ctype === "merchant" && stat === "vit") {
			value += 2 * item_stats[stat];
		} else {
			value += item_stats[stat];
		}
	}

	return value;
}

function equip_strongest(characterslot, slot, item) {
	const currently_wearing = character.slots[characterslot];

	const current_properties = item_properties(currently_wearing);
	const current_value = calculate_value(current_properties);

	const properties = item_properties(item);
	const value = calculate_value(properties);

	if (!currently_wearing) {
		equip(slot);
	}

	if (current_value < value) {
		unequip(characterslot);
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