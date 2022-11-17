var Score = {
    _players: [
        {
            name: "PLAYER1",
            color: "#e31414",
            score: 0,
            atoms: 0
        },
        {
            name: "PLAYER2",
            color: "#0764f7",
            score: 0,
            atoms: 0
        }
    ],
    _isGameOver: false,
    _winner: -1,
    _moves: 0
};

Score.init = function() {
    // var card = document.getElementsByClassName("stats")[0];
    // for (var i = 0; i < this._players.length; i++) {
    //     var player = this._players[i];
    //     player.node = document.createElement("span");
    //     player.node.innerHTML = player.score;
        
    //     var p = document.createElement("p");
    //     p.style.color = player.color;
    //     p.appendChild(document.createTextNode(player.name + ": "));
    //     p.appendChild(player.node);


    //     card.appendChild(p);
    // }
  
    // //
    // var cp = document.getElementById("current-player");
    // var ca = document.getElementById("current");
    // // ca.style.color = Score.getColor(this._current);
    // cp.style.color = this.getColor(Player._current);
    // cp.innerHTML = this.getPlayerName(Player._current);
}

Score.getColor = function(player) {
    return this._players[player].color;
}

Score.getPlayerName = function(player) {
    return this._players[player].name;
}

Score.getPlayerCount = function() {
    return this._players.length;
}

Score.getScore = function(player) {
    return this._players[player].score;
}

Score.getMoves = function() {
    return this._moves;
}

Score.move = function() {
    this._moves++;
}

Score.getAtoms = function(player) {
    return this._players[player].atoms;
}

Score.getWinner = function() {
    return this._winner;
}

Score.addAtoms = function(player, n) {
    if (player == -1) return;
    // console.log("player: " + player + " n: " + n);
    // console.log(n);
    this._players[player].atoms += n;
}

Score.addPoint = function(player) {
    if (player == -1) return;

    var obj = this._players[player];
    obj.score++;
    // obj.node.innerHTML = obj.score;

    if (obj.score >= Game.SIZE*Game.SIZE) {
        this._isGameOver = true;
        Player.stopListening();
        this._winner = player;
        // alert("Game Over!");
    }
}

Score.removePoint = function(player) {
    if (player == -1) return;

    var obj = this._players[player];
    obj.score--;
    // obj.node.innerHTML = obj.score;
}

Score.isGameOver = function() {
    return this._isGameOver;
}