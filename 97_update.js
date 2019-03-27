const main_server_url = "http://localhost/";
const backup_server_url = "https://raw.githubusercontent.com/BarryOSeven/adventureland/master/";

const allFiles = [
    "1_jafarm.js",
    "2_michaelk.js",
    "3_leonidas.js",
    "4_barryoseven.js",
    "96_party.js",
    "97_update.js",
    "98_generics.js",
    "99_monster_determinator.js"
];

function on_code_updated() {
    if (currentPlayer !== "JafarM") {
        start_character("JafarM", 1);    
    }
    
    if (currentPlayer !== "MichaelK") {
        start_character("MichaelK", 2);
    }
    
    if (currentPlayer !== "Leonidas") {
        start_character("Leonidas", 3);
    }

    if (currentPlayer !== "BarryOSeven") {
        start_character("BarryOSeven", 4);
    }    
}

function on_destroy() {
    stop_character("JafarM");
    stop_character("MichaelK");
    stop_character("Leonidas");
    stop_character("BarryOSeven");
}

function do_server_check(server_url, on_server_up, on_server_down) {
	game_log("Performing update server check for " + server_url);
	const request = new XMLHttpRequest();
	request.open("GET", server_url + allFiles[0]);
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

function pull_code(server_url, on_code_updated) {
    let updated = 0;
    parent.api_call("list_codes", {
        callback: function () {
            game_log("Updating code from server " + server_url);
		
            for (let file of allFiles) {
                let request = new XMLHttpRequest();
                const timestamp = Date.now();
                request.open("GET", server_url + file + "?nocache=" + timestamp);
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

function on_main_server_up() {
    pull_code(main_server_url, on_code_updated);	
}
	
function on_main_server_down() {
    do_server_check(backup_server_url, on_backup_server_up, on_backup_server_down);
}

function on_backup_server_up() {
    pull_code(backup_server_url, on_code_updated);	
}

function on_backup_server_down() {
    on_code_updated();
}

do_server_check(main_server_url, on_main_server_up, on_main_server_down);


