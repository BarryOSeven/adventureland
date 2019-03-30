function send_party_invites() {
    if (!parent.party["MichaelK"]) {
        send_party_invite("MichaelK", false);
    }
    if (!parent.party["Leonidas"]) {
        send_party_invite("Leonidas", false);
    }
    if (!parent.party["BarryOSeven"]) {
        send_party_invite("BarryOSeven", false);
    }
}

setInterval(send_party_invites, 5 * 1000);
