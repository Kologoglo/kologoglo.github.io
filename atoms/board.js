var Board = {
    _data: []
};

Board.init = function() {
    for(var i = 0; i < Game.SIZE; i++) {
        this._data.push([]);
        for(var j = 0; j < Game.SIZE; j++) {
            var cell = {
                atoms: 0,
                limit: Board._getLimit(i, j)
            };
            this._data[i].push(cell);
        }
    }
}

Board._getLimit = function(x, y) {
    var limit = 4;

    if(x == 0 || x == Game.SIZE-1) limit--;
    if(y == 0 || y == Game.SIZE-1) limit--;
    
    return limit;
}

Board.getAtoms = function(x, y) {
    return this._data[x][y].atoms;
}

Board.addAtom = function(x, y) {
    var cell = this._data[x][y];
    cell.atoms++;

    if(cell.atoms > cell.limit) {
        var neighbors = this._getNeighbors(x, y);
        cell.atoms -= neighbors.length;

        for(var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
            var posX = neighbor[0];
            var posY = neighbor[1];
            
            this.addAtom(posX, posY);
        }
    }
}

Board._getNeighbors = function(x, y) {
    var n = [];

    if(x > 0) n.push([x-1, y]);
    if(x < Game.SIZE-1) n.push([x+1, y]);
    if(y > 0) n.push([x, y-1]);
    if(y < Game.SIZE-1) n.push([x, y+1]);

    return n;
}