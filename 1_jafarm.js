//JafarM

load_code(98, function() {
	game_log("Unable to run generics");
});

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

function send_items_michaelk() {
    const data = {
        type: "send_items",
        name: character.name
    };

    send_cm("MichaelK", data);
}

function send_items_leonidas() {
    const data = {
        type: "send_items",
        name: character.name
    };

    send_cm("Leonidas", data);
}

function send_items_barryoseven() {
    const data = {
        type: "send_items",
        name: character.name
    };

    send_cm("BarryOSeven", data);
}

add_top_button("michaelk_button", "MichaelK", send_items_michaelk);
add_top_button("leonidas_button", "Leonidas", send_items_leonidas);
add_top_button("barryoseven_button", "BarryOSeven", send_items_barryoseven);

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
    "98_generics.js",
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
