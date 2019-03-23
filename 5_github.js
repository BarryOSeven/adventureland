// github

const baseURL = "https://raw.githubusercontent.com/BarryOSeven/adventureland/master/";

const allFiles = [
    "1_jafarm.js",
    "2_michaelk.js",
    "3_leonidas.js",
    "4_barryoseven.js",
    "5_github.js"
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