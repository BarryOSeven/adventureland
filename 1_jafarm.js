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

function upgrade_items() {
    //
}

function go_to_basics(on_potion_location) {
    function on_in_main_town() {
        smart_move({to: "potions"}, on_potion_location);
    }

    smart_move("main", on_in_main_town);
}

function buy_item(item_name) {
    if (state !== "idle") {
        return;
    }

    state = "buying_items";

    function on_near_basics() {
        buy_with_gold(item_name, 1);
        state = "idle";
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
    upgrade_items();
}, 1000);
