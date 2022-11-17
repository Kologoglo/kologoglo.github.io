var Player = {
    _current: 0
};

Player.startListening = function() {
    document.addEventListener("click", Player);
}

Player.stopListening = function() {
    document.removeEventListener("click", Player);
}

Player.handleEvent = function(e) {
    // console.log(e.x + " " + e.y);
    var pos = Draw.getPosition(e.x, e.y);
    if(!pos) return;
    var x = pos[0];
    var y = pos[1];
    // console.log(x + ", " + y);
    if (x >= Game.SIZE || y >= Game.SIZE) return;
    var existing = Board.getPlayer(x, y);
    if ( !(existing == -1 || existing == this._current) ) return;
    
    Score.addAtoms(this._current, 1);
    Board.addAtom(x, y, this._current);
    

    this._current = (this._current + 1) % Score.getPlayerCount();
    // Draw.stats();
    // var cp = document.getElementById("current-player");
    // var ca = document.getElementById("current");
    // // ca.style.color = Score.getColor(this._current);
    // cp.style.color = Score.getColor(this._current);
    // cp.innerHTML = Score.getPlayerName(this._current);
}