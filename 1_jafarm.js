//JafarM

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

pull_code(on_code_updated);

// collect money state
// buy scrolls state
// buy items state
// upgrade items state

const state = "collect_money_michaelk";

function handle_collect_money(name) {
    const player = get_player(name);
    game_log(JSON.stringify(player));
    const x = player.real_x;
    const y = player.real_y;

    smart_move({x: x, y: y}, function() {
        game_log("Moved to " + name);
    });
}

setInterval(function() {
	if (is_moving(character)) {
		return;
    }
    
    switch(state) {
        case "collect_money_michaelk":
            game_log("collect money_michaelk");
            handle_collect_money("MichaelK");
            break;
    }
    // go to MichaelK to collect money
        // send cm to send money

    // go to Leonidas to collect money
        // send cm to send money
    
    // go to BarryOSeven to collect money
        // send cm to send money

	const upgradeScrollCount = quantity("scroll0");
	
	if (upgradeScrollCount === 0) {
		smart_move({to: "scrolls"}, function() {
			buy_with_gold("scroll0", 10);	
		});
		return;
	}
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
