//JafarM

let state = "idle";

auto_reload("on");

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

function log_michaelk() {
    const data = {
        type: "log"
    };

    send_cm("MichaelK", data);
}

function log_leonidas() {
    const data = {
        type: "log"
    };

    send_cm("Leonidas", data);
}

function log_barryoseven() {
    const data = {
        type: "log"
    };

    send_cm("BarryOSeven", data);
}

add_top_button("michaelk_button", "MichaelK", log_michaelk);
add_top_button("leonidas_button", "Leonidas", log_leonidas);
add_top_button("barryoseven_button", "BarryOSeven", log_barryoseven);

function on_cm(name, data) {
	switch(data.type) {
        case "collect_money":
            handle_collect_money(data.player);
			break;
	}
}

function on_death() {
    game_log("We're dead, we should implement respawning here");
}

function handle_collect_money(player) {
    if (state !== "idle") {
        return;
    }

    if (is_moving(character)) {
		return;
    }

    state = "collect_money";

    smart_move({x: player.real_x, y: player.real_y, map: player.in}, function() {
        const data = {
            type: "send_money",
            name: character.name
        };
        
        state = "idle";
        send_cm(player.name, data);
    });
}

function buy_upgrade_scrolls() {
    if (state !== "idle") {
        return;
    }

    state = "buy_upgrade_scrolls";

    const upgradeScrollCount = quantity("scroll0");
	
	if (upgradeScrollCount === 0) {
		smart_move({to: "scrolls"}, function() {
            buy_with_gold("scroll0", 10);	
            state = "idle";
		});
		return;
	}
}

pull_code(on_code_updated);

setInterval(function() {
    if (character.rip) {
		respawn();	
    }
    
	if (is_moving(character)) {
		return;
    }
    
    buy_upgrade_scrolls();
}, 1000);

// github
const baseURL = "https://raw.githubusercontent.com/BarryOSeven/adventureland/master/";

const allFiles = [
    "1_jafarm.js",
    "2_michaelk.js",
    "3_leonidas.js",
    "4_barryoseven.js",
    "99_monster_determinator.js"
];

function pull_code(on_code_updated) {
	let updated = 0;
    parent.api_call("list_codes", {
        callback: function () {
            game_log("Updating from GitHub...");
            for (let file of allFiles) {
                let request = new XMLHttpRequest();
                request.open("GET", baseURL + file);
                request.onreadystatechange = function () {
                    if (request.readyState === 4 && request.status === 200) {
                        let codeObject = getCodeObject(file);
                        let data = {
                            name: codeObject.name,
                            slot: codeObject.slot,
                            code: request.responseText
                        };
                        
						parent.api_call("save_code", data);
						updated++;
						if (updated === allFiles.length) {
							game_log("Code succesfully updated");
							on_code_updated();
						}
                    }
                };
                request.send();
            }
        }
    });
}

function getCodeObject(file) {
    let codeObject;

    let arr = file.substring(0, file.length - 3).split("_");

    codeObject = {
        slot: arr[0],
        name: arr[1]
    };

    return codeObject;
}
