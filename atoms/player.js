var Player = {};

Player.listen = function() {
    document.addEventListener("click", this.onclick);
}

Player.onclick = function(e) {
    // console.log(e.x + " " + e.y);
    var pos = Draw.getPosition(e.x, e.y);
    if(!pos) return;
    var x = pos[0];
    var y = pos[1];
    // console.log(x + ", " + y);
    Board.addAtom(x, y);
    Draw.all();
}