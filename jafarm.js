//JafarM

load_code("github", function() {
	game_log("Error while pulling code");
});

auto_reload("on");

start_character("MichaelK", 2);
start_character("Leonidas", 3);
start_character("BarryOSeven", 4);

function on_destroy() {
	stop_character("MichaelK");
	stop_character("Leonidas");
    stop_character("BarryOSeven");
}

setInterval(function() {
	if (is_moving(character)) {
		return;
	}
	
	const upgradeScrollCount = quantity("scroll0");
	
	if (upgradeScrollCount < 10) {
		smart_move({to: "scrolls"}, function() {
			buy_with_gold("scroll0");	
		});
		return;
	}
}, 1000);