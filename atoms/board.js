var Board = {
    DELAY: 200,
    _data: [],
    _criticals: []
};

Board.init = function() {
    for(var i = 0; i < Game.SIZE; i++) {
        this._data.push([]);
        for(var j = 0; j < Game.SIZE; j++) {
            var cell = {
                atoms: 0,
                limit: Board._getLimit(i, j),
                player: -1
            };
            this._data[i].push(cell);
        }
    }
}

Board._getLimit = function(x, y) {
    // var limit = 4;

    // if(x == 0 || x == Game.SIZE-1) limit--;
    // if(y == 0 || y == Game.SIZE-1) limit--;
    var limit = this._getNeighbors(x, y).length;
    return limit;
}

Board._getNeighbors = function(x, y) {
    var n = [];

    if(x > 0) n.push([x-1, y]);
    if(x < Game.SIZE-1) n.push([x+1, y]);
    if(y > 0) n.push([x, y-1]);
    if(y < Game.SIZE-1) n.push([x, y+1]);

    return n;
}

Board.getAtoms = function(x, y) {
    return this._data[x][y].atoms;
}

Board.getPlayer = function(x, y) {
    return this._data[x][y].player;
}

Board.addAtom = function(x, y, player) {
    Score.move();
    this._addAndCheck(x, y, player);

    if(Score.isGameOver()) return;
    else if (this._criticals.length > 0) {
        Player.stopListening();
        setTimeout(this._explode.bind(this), this.DELAY);
    }
}

Board._addAndCheck = function(x, y, player) {
    var cell = this._data[x][y];
    
    Score.removePoint(cell.player);
    Score.addPoint(player);
    
    // Score.addAtoms(cell.player, -cell.atoms);
    cell.atoms++;
    cell.player = player;
    // Score.addAtoms(player, cell.atoms);
    // Score.addAtoms(player, 1);
    
    Draw.cell(x, y);

    if (cell.atoms > cell.limit) {
        for (var i = 0; i < this._criticals.length; i++) {
            var tmp = this._criticals[i];
            if (tmp[0] == x && tmp[1] == y) return;
        }
        this._criticals.push([x, y]);
    }
}

Board._explode = function() {
    var pair = this._criticals.shift();
    var x = pair[0];
    var y = pair[1];
    var cell = this._data[x][y];

    var neighbors = this._getNeighbors(x, y);
    cell.atoms -= neighbors.length;
    Draw.cell(x, y);

    for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];
        var posX = neighbor[0];
        var posY = neighbor[1];
        
        if (Score.isGameOver()) continue;
        var p = this.getPlayer(posX, posY);
        if (p != -1 && p != cell.player) { // another player's atoms
            Score.addAtoms(p, -this.getAtoms(posX, posY));
            Score.addAtoms(cell.player, this.getAtoms(posX, posY));
        }
        this._addAndCheck(posX, posY, cell.player);
    }

    if (Score.isGameOver()) return;
    else if (this._criticals.length > 0) {
        setTimeout(this._explode.bind(this), this.DELAY);
    } else {
        Player.startListening();
    }
    
}
