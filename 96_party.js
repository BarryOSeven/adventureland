function send_party_invites() {
    send_party_invite("MichaelK", false);
    send_party_invite("Leonidas", false);
    send_party_invite("BarryOSeven", false);
}

setInterval(send_party_invites, 30 * 1000);
