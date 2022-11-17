var Draw = {
    CELL: 60,
    LINE: 2,
    ATOM: 7,
    _ctx: null,
    width: 0,
    height: 0,
    cWidth: 0,
    cHeight: 0,
    _blink: false,
    POSITIONS: [
        null,
        [ [1/2, 1/2] ],
        [ [1/4, 1/4], [3/4, 3/4] ],
        [ [1/4, 1/4], [1/2, 1/2], [3/4, 3/4] ],
        [ [1/4, 1/4], [3/4, 1/4], [1/4, 3/4], [3/4, 3/4] ],
        [ [1/4, 1/4], [3/4, 1/4], [1/4, 3/4], [3/4, 3/4], [1/2, 1/2] ],
        [ [1/4, 1/4], [3/4, 1/4], [1/4, 3/4], [3/4, 3/4], [1/4, 1/2], [3/4, 1/2] ],
        [ [1/4, 1/4], [3/4, 1/4], [1/4, 3/4], [3/4, 3/4], [1/4, 1/2], [3/4, 1/2], [1/2, 1/2] ],
        [ [1/4, 1/4], [3/4, 1/4], [1/4, 3/4], [3/4, 3/4], [1/4, 1/2], [3/4, 1/2], [1/2, 1/4], [1/2, 3/4] ]
    ]
};

Draw.init = function() {
    var canvas = document.getElementById("canvas");
    // this.CELL += this.LINE;
    var size = Game.SIZE * (this.CELL+this.LINE) + this.LINE;

    canvas.width = size + 400;
    canvas.height = size;
    this._ctx = canvas.getContext("2d");
    this._ctx.lineWidth = 1;
    this.cWidth = canvas.width;
    this.cHeight = canvas.height;
    this.width = size;
    this.height = size;

    Draw._repaint();

    setInterval(this.blink.bind(this), 300);
}

Draw._repaint = function() {
    
    //wipe with background color
    // this._ctx.fillStyle = "#b5b5b5";
    // this._ctx.fillRect(0, 0, this.cWidth, this.cHeight);

    //wipe cell area
    // this._ctx.fillStyle = "#555555";
    // this._ctx.fillRect(0+5, 0+5, this.width+5, this.height+5);
    this._ctx.fillStyle = "#262626";
    this._ctx.fillRect(0, 0, this.width, this.height);

    //draw all cells
    for (var i = 0; i < Game.SIZE; i++) {
        for (var j = 0; j < Game.SIZE; j++) {
            this.cell(i, j);
        }
    }

    //draw stats
    this.stats();
}

Draw.cell = function(x, y) {
    //draw cell
    var size = this.CELL;
    var left = x * (this.CELL + this.LINE) + this.LINE;
    var top = y * (this.CELL + this.LINE) + this.LINE;
    var cellColor = x % 2 == 0 ? ( y % 2 == 0 ? "#b5b5b5" : "#d1d1d1" ) : (y % 2 == 1 ? "#b5b5b5" : "#d1d1d1" );
    this._ctx.fillStyle = cellColor;
    this._ctx.fillRect(left, top, size, size);
    
    //draw atoms
    var n = Board.getAtoms(x, y);
    if (!n) return;
    // if (n > 5) alert(n);
    var positions = this.POSITIONS[n];
    for (var i = 0; i < positions.length; i++) {
        var position = positions[i];
        var posX = position[0];
        var posY = position[1];
        var color = Score.getColor(Board.getPlayer(x, y));
        this._atom((x + posX) * (this.CELL+this.LINE), (y + posY) * (this.CELL+this.LINE), color);
    }

    //draw stats
    this.stats();
}

Draw._atom = function(x, y, color) {
    this._ctx.beginPath();

    this._ctx.moveTo(x + this.ATOM, y);
    this._ctx.arc(x, y, this.ATOM, 0, 2 * Math.PI, false);
    this._ctx.fillStyle = color;
    this._ctx.fill();

    this._ctx.stroke();
}

Draw.getPosition = function(x, y) {
    var rect = this._ctx.canvas.getBoundingClientRect();
    
    x -= rect.left;
    y -= rect.top;
    
    if(x < 0 || x > rect.width) return null;
    if(y < 0 || y > rect.height) return null;
    
    var cellX = Math.floor(x / (this.CELL+this.LINE));
    var cellY = Math.floor(y / (this.CELL+this.LINE));
    
    return [cellX, cellY];
}

Draw.stats = function() {
    // var left = Game.SIZE*(this.CELL+this.LINE)+this.LINE;
    //wipe stats
    this._ctx.fillStyle = "#b5b5b5";
    this._ctx.fillRect(this.width, 0, this.cWidth-this.width, this.cHeight);
    this._ctx.font = "20px Public Pixel";
    
    //Chain Reaction
    var header = "Chain Reaction";
    var hx = this.width + 50;
    var hy = 50;
    this._ctx.fillStyle = "#555555";
    this._ctx.fillRect(hx+7, hy+7, 335, 25);
    this._ctx.fillStyle = "#ffffff";
    this._ctx.fillRect(hx, hy, 335, 25);
    this._ctx.fillStyle = "red";
    this._ctx.fillText(header, hx + 30, hy + 21);


    this._ctx.font = "15px Public Pixel";
    //player one
    var atoms1 = Score.getAtoms(0);
    var tatoms1 = atoms1 + "";
    if (atoms1 < 10) tatoms1 = "0" + tatoms1;
    if (atoms1 < 100) tatoms1 = "0" + tatoms1;
    this._ctx.fillStyle = Score.getColor(0);
    this._ctx.fillText("Player One: " + Score.getPlayerName(0), hx+30, 150);
    this._ctx.fillText("Atoms: " + tatoms1, hx+70, 180);
    this._ctx.fillText("Score: " + Score.getScore(0), hx+70, 210);
    
    //moves
    var moves = Score.getMoves();
    var tmoves = moves + "";
    if (moves < 10) tmoves = "0" + tmoves;
    if (moves < 100) tmoves = "0" + tmoves;
    this._ctx.fillStyle = "green";
    this._ctx.fillText("Moves: " + tmoves, hx+100, 270);

    //player two
    var atoms2 = Score.getAtoms(1);
    var tatoms2 = atoms2 + "";
    if (atoms2 < 10) tatoms2 = "0" + tatoms2;
    if (atoms2 < 100) tatoms2 = "0" + tatoms2;
    this._ctx.fillStyle = Score.getColor(1);
    this._ctx.fillText("Player Two: " + Score.getPlayerName(1), hx+30, 330);
    this._ctx.fillText("Atoms: " + tatoms2, hx+70, 360);
    this._ctx.fillText("Score: " + Score.getScore(1), hx+70, 390);

    
    //current player
    // this._atom(this.width+200, this.cHeight-50, Score.getColor(Player._current));

    if (this._blink && !Score.isGameOver()) {
        // console.log("ok");
        this._ctx.fillStyle = Score.getColor(Player._current);
        if (Player._current == 0)
            this._ctx.fillRect(hx+30, 150+5, 160 /*300*/, 5);
        else if (Player._current == 1)
            this._ctx.fillRect(hx+30, 330+5, 160, 5);
    }


    //game over
    if (!Score.isGameOver()) return;
    this._ctx.font = "20px Public Pixel";
    this._ctx.fillStyle = "#444444";
    this._ctx.fillRect(100+5, 140+5, 300+5, 150+5);
    this._ctx.fillStyle = "#777777";
    this._ctx.fillRect(100, 140, 300, 150);
    this._ctx.fillStyle = "#ffffff";
    this._ctx.fillText("GAME OVER!", 100+55, 150+50);
    this._ctx.font = "15px Public Pixel";
    this._ctx.fillStyle = "#ffffff";
    this._ctx.fillText("Winner: " + Score.getPlayerName(Score.getWinner()), 100+20, 150+120);
}

Draw.blink = function() {
    this._blink = !this._blink;

    this.stats();
}

// Draw._lines = function() {
//     var width = this._ctx.canvas.width;
//     var height = this._ctx.canvas.height;

//     this._ctx.beginPath();
//     // this._ctx.fillStyle = "#fff";
//     for(var i = 0; i < Game.SIZE + 1; i++) {
//         var y = i*this.CELL + this.LINE/2;
//         this._ctx.moveTo(0, y);
//         this._ctx.lineTo(width, y);
//     }

//     for(var i = 0; i < Game.SIZE + 1; i++) {
//         var x = i*this.CELL + this.LINE/2;
//         this._ctx.moveTo(x, 0);
//         this._ctx.lineTo(x, height);
//     }

//     this._ctx.stroke();
// }

// Draw._cells = function() {
//     for(var i = 0; i < Game.SIZE; i++) {
//         for(var j = 0; j < Game.SIZE; j++) {
//             this._cell(i, j, Board.getAtoms(i, j));
//         }
//     }
// }