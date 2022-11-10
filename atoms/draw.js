var Draw = {
    CELL: 60,
    LINE: 2,
    ATOM: 7,
    _context: null,
    POSITIONS: [
        null,
        [ [1/2, 1/2] ],
        [ [1/4, 1/4], [3/4, 3/4] ],
        [ [1/4, 1/4], [1/2, 1/2], [3/4, 3/4] ],
        [ [1/4, 1/4], [3/4, 1/4], [1/4, 3/4], [3/4, 3/4] ] 
    ]
};

Draw.init = function() {
    var canvas = document.getElementById("canvas");
    this.CELL += this.LINE;
    var size = Game.SIZE * (this.CELL) + this.LINE;

    canvas.width = size;
    canvas.height = size;
    this._context = canvas.getContext("2d");
    this._context.lineWidth = this.LINE;

    this.all();
}

Draw.all = function() {
    var width = this._context.canvas.width;
    var height = this._context.canvas.height;
    
    this._context.fillStyle = "#fff";
    this._context.fillRect(0, 0, width, height);

    this._lines();
    this._cells();
}

Draw._lines = function() {
    var width = this._context.canvas.width;
    var height = this._context.canvas.height;

    this._context.beginPath();
    // this._context.fillStyle = "#fff";
    for(var i = 0; i < Game.SIZE + 1; i++) {
        var y = i*this.CELL + this.LINE/2;
        this._context.moveTo(0, y);
        this._context.lineTo(width, y);
    }

    for(var i = 0; i < Game.SIZE + 1; i++) {
        var x = i*this.CELL + this.LINE/2;
        this._context.moveTo(x, 0);
        this._context.lineTo(x, height);
    }

    this._context.stroke();
}

Draw._cells = function() {
    for(var i = 0; i < Game.SIZE; i++) {
        for(var j = 0; j < Game.SIZE; j++) {
            this._cell(i, j, Board.getAtoms(i, j));
        }
    }
}

Draw._cell = function(x, y, n) {
    var positions = this.POSITIONS[n];
    if(!positions) return; // TODO
    for(var i = 0; i < positions.length; i++) {
        var position = positions[i];
        var posX = position[0];
        var posY = position[1];
        this._atom((x + posX) * this.CELL, (y + posY) * this.CELL);
    }
}

Draw._atom = function(x, y) {
    this._context.beginPath();

    this._context.moveTo(x + this.ATOM, y);
    this._context.arc(x, y, this.ATOM, 0, 2 * Math.PI, false);
    this._context.fillStyle = "blue";
    this._context.fill();

    this._context.stroke();
}

Draw.getPosition = function(x, y) {
    var rect = this._context.canvas.getBoundingClientRect();
    
    x -= rect.left;
    y -= rect.top;

    if(x < 0 || x > rect.width) return null;
    if(y < 0 || y > rect.height) return null;
    
    var cellX = Math.floor(x / this.CELL);
    var cellY = Math.floor(y / this.CELL);
    
    return [cellX, cellY];
}