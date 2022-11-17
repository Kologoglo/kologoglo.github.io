var Game = {
    SIZE: 8
};

Game.start = function() {
    Board.init();
    Score.init();
    Draw.init();
    Player.startListening();
}

Game.load = function() {
    var pixel_font = new FontFace('Public Pixel', 'url("PublicPixel-z84yD.ttf")');
    pixel_font.load().then(function(loaded_face) {
        document.fonts.add(loaded_face);
        Game.start();
    }).catch(function(error) {
        // error occurred
        console.error(error);
        // alert(error);
    });
}