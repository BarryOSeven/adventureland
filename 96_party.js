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
    send_party_invite("JafarM", false);
    send_party_invite("MichaelK", false);
    send_party_invite("Leonidas", false);
    send_party_invite("BarryOSeven", false);
}

send_party_invite();