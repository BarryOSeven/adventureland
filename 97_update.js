const baseURL = "http://localhost/";

const allFiles = [
    "1_jafarm.js",
    "2_michaelk.js",
    "3_leonidas.js",
    "4_barryoseven.js",
    "97_update.js",
    "98_generics.js",
    "99_monster_determinator.js"
];

function on_code_updated() {
    	start_character("JafarM", 1);
	start_character("MichaelK", 2);
	start_character("Leonidas", 3);
	start_character("BarryOSeven", 4);
}

function on_destroy() {
    	stop_character("JafarM");
	stop_character("MichaelK");
	stop_character("Leonidas");
    	stop_character("BarryOSeven");
}

function do_server_check(on_server_up, on_server_down) {
	game_log("Performing update server check");
	const request = new XMLHttpRequest();
	request.open("GET", baseURL + allFiles[0]);
	request.onreadystatechange = function () {
	    if (request.readyState === 4 && request.status === 200) {
		game_log("Server up: pulling code");
		on_server_up();
	    } else
	    if (request.readyState === 4) {
		game_log("Server down: continuing");
	        on_server_down();
	    }
	}
	request.send();
}

function pull_code(on_code_updated) {
    let updated = 0;
    parent.api_call("list_codes", {
        callback: function () {
            game_log("Updating code from server...");
		
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

function on_server_up() {
    pull_code(on_code_updated);	
}
	
function on_server_down() {
    on_code_updated();
}

do_server_check(on_server_up, on_server_down);
