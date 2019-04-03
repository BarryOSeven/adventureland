//JafarM

const amount_of_upgrade_scrolls_to_buy = 50;
const amount_of_combine_scrolls_to_buy = 50;

const minimum_amount_of_gold_to_upgrade = 50000;

load_code(98, () => {
	game_log("Unable to run generics");
});

load_code(97, () => {
	game_log("Unable to run updates");
});

load_code(96, () => {
    game_log("Unable to run party");
});

load_code(95, () => {
    game_log("Unable to run locations");
});

function buy_upgrade_scrolls(on_upgrade_scrolls_bought) {
    if (state !== "idle") {
        return;
    }

    state = "buy_upgrade_scrolls";

    function on_upgrade_location() {
        buy_with_gold("scroll0", amount_of_upgrade_scrolls_to_buy);	
        state = "idle";
        on_upgrade_scrolls_bought();
    }

    go_to_upgrade(on_upgrade_location);
}

function buy_combine_scrolls(on_combine_scrolls_bought) {
    if (state !== "idle") {
        return;
    }

    state = "buy_combine_scrolls";

    function on_upgrade_location() {
        buy_with_gold("cscroll0", amount_of_combine_scrolls_to_buy);	
        state = "idle";
        on_combine_scrolls_bought();
    }

    go_to_upgrade(on_upgrade_location);
}

function start_combine_item() {
    if (state !== "idle") {
        return;
    }

    if (quantity("cscroll0") === 0) {
        buy_combine_scrolls(() => {
            start_combine_item();
        });
	    return;
    }

    const items = get_combinable_items();

    let countObject = {};

    for (const itemObject of items) {
        const hash = itemObject.item.name + itemObject.item.level;

        if (!countObject[hash]) {
            countObject[hash] = {
                counter: 1,
                items: [itemObject]
            };
        } else {
            countObject[hash].counter = countObject[hash].counter + 1;
            countObject[hash].items.push(itemObject);
        }
    }

    let items_to_combine;
    for (const hash in countObject) {
        const countItem = countObject[hash];
        if (countItem.counter >= 3) {
            items_to_combine = countItem.items;
            break;
        }
    }

    if (items_to_combine) {
        state = "combine_items";
        combine_items(items_to_combine, () => {
            state = "idle";
        });
    }
}

function combine_items(items_to_combine, on_item_combined) {
    function on_upgrade_location() {
        const scroll_num = locate_item_slot("cscroll0");
        
        compound(items_to_combine[0].slot, items_to_combine[1].slot, items_to_combine[2].slot, scroll_num);
        on_item_combined();
    }

    go_to_upgrade(on_upgrade_location);
}

function get_upgradable_items() {
	const upgradable_items = [];

	for (let i=0; i<42 ;i++) {
		if(!character.items[i]) {
			continue;
		}
    
        const item = character.items[i];

		switch (item.name) {
            case "shield":
            case "bow":
            case "shoes":
            case "spear":
	        case "gloves":
            case "helmet":
            case "helmet1":
            case "wcap":
            case "wshoes":
	        case "wbreeches":
            case "wgloves":
            case "coat1":
            case "shoes1":
				upgradable_items.push(item);
				break;
		}
	}

	return upgradable_items;
}

function get_combinable_items() {
	const items = [];

	for (let i=0; i<42; i++) {
		if(!character.items[i]) {
			continue;
		}

		const item = character.items[i];

		switch(item.name) {
            case "intearring":
            case "dexearring":
            case "strearring":
            case "vitearring":
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

function start_upgrade_item() {
    if (state !== "idle") {
        return;
    }

    if (character.gold < minimum_amount_of_gold_to_upgrade) {
        return;
    }

    if (quantity("scroll0") === 0) {
        buy_upgrade_scrolls(() => {
            start_upgrade_item(item_name);
        });
        return;
    }

    // locate upgradable item
    const upgradable_items = get_upgradable_items();
    let item_to_upgrade;

    for (const upgradable_item of upgradable_items) {
        if (upgradable_item.level < parent.G.items[upgradable_item.name].grades[0]) {
            item_to_upgrade = upgradable_item;
        }
    }

    if (!item_to_upgrade) {
        return;
    }

    state = "item_upgrade";

    function on_item_upgraded() {
        state = "idle";
    }

    upgrade_item(item_to_upgrade, on_item_upgraded);
}

function upgrade_item(item_to_upgrade, on_item_upgraded) {
    function on_upgrade_location() {
        const item_num = locate_item_slot_by_item(item_to_upgrade);
        const scroll_num = locate_item_slot("scroll0");
        
        upgrade(item_num, scroll_num);
        on_item_upgraded();
    }

    go_to_upgrade(on_upgrade_location);
}

function go_to_upgrade(on_upgrade_location) {
    function on_in_main_town() {
        smart_move({to: "upgrade"}, on_upgrade_location);
    }

    const destination_map = "main";

    if (character.map !== destination_map) {
        smart_move(destination_map, on_in_main_town);
    } else {
        on_in_main_town();
    }
}

function go_to_exchange(on_exchange_location) {
    function on_in_main_town() {
        smart_move({to: "exchange"}, on_exchange_location);
    }

    const destination_map = "main";

    if (character.map !== destination_map) {
        smart_move(destination_map, on_in_main_town);
    } else {
        on_in_main_town();
    }
}

function go_to_basics(on_potion_location) {
    function on_in_main_town() {
        smart_move({to: "potions"}, on_potion_location);
    }

    const destination_map = "main";

    if (character.map !== destination_map) {
        smart_move(destination_map, on_in_main_town);
    } else {
        on_in_main_town();
    }
}

function buy_item(item_name, on_item_bought) {
    if (state !== "idle") {
        return;
    }

    state = "buying_items";

    function on_location() {
        buy_with_gold(item_name, 1);
        state = "idle";
        on_item_bought();
    }

    go_to_upgrade(on_location);
}

function equip_item(name, item_name) {
    // send item to other character
    // send cm with item id
}

function start_exchange_gems() {
    if (state !== "idle") {
        return;
    }

    let exchangable_item;
    for (let i=0; i<42; i++) {
        if (!character.items[i]) {
            continue;
        }

        const item = character.items[i];

        switch (item.name) {
            case "gem0":
            case "gem1":
            case "weaponbox":
            case "armorbox":
                exchangable_item = item;
                break;
        }
    }

    function on_exchange_location() {
        const slot = locate_item_slot(exchangable_item.name);
        exchange(slot);
        state = "idle";
    }

    if (exchangable_item) {
        state = "exchanging_gems";
        go_to_exchange(on_exchange_location);
    }
}

function start_exchange_seashells() {
    if (state !== "idle") {
        return;
    }

    const item_name = "seashell";

    function on_exchange_location() {
        const seashell_slot = locate_item_slot(item_name);
        
        exchange(seashell_slot);
        state = "idle";
    }

    if (quantity(item_name) >= 20) {
        state = "sell_seashells";

        smart_move(tristian_location, on_exchange_location);
    }
}

setInterval(function() {
	if (is_moving(character)) {
		return;
    }

    use_potions();
    buy_potions();

    start_combine_item();
    start_upgrade_item();
    start_exchange_seashells();
    start_exchange_gems();
}, 1000);
