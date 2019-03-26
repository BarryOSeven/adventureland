//JafarM

load_code(97, function() {
	game_log("Unable to run updates");
});

load_code(98, function() {
	game_log("Unable to run generics");
});

auto_reload("on");

add_top_button("log", "Log", () => {
    const data = {
        type: "log"
    };

    send_cm("JafarK", data);
    send_cm("MichaelK", data);
    send_cm("Leonidas", data);
    send_cm("BarryOSeven", data);
});

function on_code_updated() {
	start_character("MichaelK", 2);
	start_character("Leonidas", 3);
	start_character("BarryOSeven", 4);
}

function on_destroy() {
	stop_character("MichaelK");
	stop_character("Leonidas");
    stop_character("BarryOSeven");
}

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

setInterval(function() {
	if (is_moving(character)) {
		return;
    }
    
    buy_upgrade_scrolls();
}, 1000);