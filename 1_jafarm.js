//JafarM

const amount_of_upgrade_scrolls_to_buy = 50;
const amount_of_combine_scrolls_to_buy = 50;

const minimum_amount_of_gold_to_upgrade = 50000;

load_code(98, function() {
	game_log("Unable to run generics");
});

load_code(97, function() {
	game_log("Unable to run updates");
});

load_code(96, function() {
    game_log("Unable to run party");
});

add_top_button("upgrade", "Upgrade", () => {
    start_upgrade_item("shoes");
});

function buy_upgrade_scrolls(on_upgrade_scrolls_bought) {
    if (state !== "idle") {
        return;
    }

    const upgradeScrollCount = quantity("scroll0");
	
	if (upgradeScrollCount === 0) {
        state = "buy_upgrade_scrolls";

		smart_move({to: "scrolls"}, function() {
            buy_with_gold("scroll0", amount_of_upgrade_scrolls_to_buy);	
            state = "idle";
            on_upgrade_scrolls_bought();
		});
		return;
	}
}

function buy_combine_scrolls() {
    if (state !== "idle") {
        return;
    }

    const combineScrollCount = quantity("cscroll0");
	
	if (combineScrollCount === 0) {
        state = "buy_combine_scrolls";

		smart_move({to: "scrolls"}, function() {
            buy_with_gold("cscroll0", amount_of_combine_scrolls_to_buy);	
            state = "idle";
		});
		return;
	}
}

function combine_items() {
    // check for combinable items
    // set state to combine_items

    // if three amulets of same strength
        // go to combine guy
        // combine items until level x
}

function start_upgrade_item(item_name) {
    if (state !== "idle") {
        return;
    }

    if (character.gold < minimum_amount_of_gold_to_upgrade) {
        game_log("Not enough gold to upgrade (50000)");
        return;
    }

    if (quantity("scroll0") === 0) {
        buy_upgrade_scrolls(() => {
            start_upgrade_item(item_name);
        });
        return;
    }

    const upgrade_name = item_name;

    const item = locate_item(upgrade_name);

    if (item && item.level === 7) {
        return;
    }

    state = "item_upgrade";

    function on_item_upgraded() {
        state = "idle";
        start_upgrade_item(item_name);
    }

    function on_item_bought() {
        state = "item_upgrade";
        upgrade_item(upgrade_name, on_item_upgraded)
    }

    if (quantity(upgrade_name) === 0) {
        state = "idle";
        buy_item(upgrade_name, on_item_bought);
    } else {
        upgrade_item(upgrade_name, on_item_upgraded);
    }
}

function upgrade_item(item_name, on_item_upgraded) {
    function on_upgrade_location() {
        const item_num = locate_item_slot(item_name);
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

setInterval(function() {
	if (is_moving(character)) {
		return;
    }

    // buy_item("sword");
    // equip_item("MichaelK", "str")

    buy_combine_scrolls();

    combine_items();
    // upgrade_items();
}, 1000);
