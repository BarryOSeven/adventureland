//JafarM

load_code(98, function() {
	game_log("Unable to run generics");
});

load_code(97, function() {
	game_log("Unable to run updates");
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

setInterval(function() {
	if (is_moving(character)) {
		return;
    }
    
    buy_upgrade_scrolls();
    buy_combine_scrolls();
}, 1000);
