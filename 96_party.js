let my_name;
const names = ["JafarM", "MichaelK", "Leonidas", "BarryOSeven"];

function on_party_invite(name) {
    if (names.indexOf(name) === -1) {
        return;
    }

    accept_party_invite(name);
}

function on_party_request(name) {
    if (names.indexOf(name) === -1) {
        return;
    }

    accept_party_request(name);
}

function send_party_invite() {
    if (my_name !== "JafarM") {
        send_party_invite("JafarM", false);
    }

    if (my_name !== "MichaelK") {
        send_party_invite("MichaelK", false);
    }

    if (my_name !== "Leonidas") {
        send_party_invite("Leonidas", false);
    }

    if (my_name !== "BarryOSeven") {
        send_party_invite("BarryOSeven", false);
    }
}

if (character.me) {
    my_name = character.name;
    send_party_invite();
}