//JafarM 

// github
const baseURL = "https://raw.githubusercontent.com/BarryOSeven/adventureland/master/";

const allFiles = [
    "1_jafarm.js",
    "2_michaelk.js",
    "3_leonidas.js",
    "4_barryoseven.js"
];

function pull_code() {
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

pull_code();

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