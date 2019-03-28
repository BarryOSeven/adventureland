//JafarM

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
    start_upgrade_item("bow");
});

function buy_upgrade_scrolls() {
    if (state !== "idle") {
        return;
    }

    const upgradeScrollCount = quantity("scroll0");
	
	if (upgradeScrollCount === 0) {
        state = "buy_upgrade_scrolls";

		smart_move({to: "scrolls"}, function() {
            buy_with_gold("scroll0", 10);	
            state = "idle";
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
            buy_with_gold("cscroll0", 10);	
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

    state = "item_upgrade";

    const upgrade_name = item_name;

    const item = locate_item(upgrade_name);

    if (item && item.level === 7) {
        return;
    }

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

    function on_near_basics() {
        buy_with_gold(item_name, 1);
        state = "idle";
        on_item_bought();
    }

    go_to_basics(on_near_basics);
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

    buy_upgrade_scrolls();
    buy_combine_scrolls();

    combine_items();
    // upgrade_items();
}, 1000);
