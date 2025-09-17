// IT-Game Code
function activateDocument() {
    const g = document.getElementById("game");
    const gctx = g.getContext("2d");  
    const m = document.getElementById("menu");
    const mctx = m.getContext("2d");
    const f = document.getElementById("field");

    f.onload = function(e) {
        gctx.canvas.width = f.width;
        gctx.canvas.height = f.height;
        gctx.drawImage(f, 0, 0, f.width,f.height);

        mctx.canvas.width = f.width;
        mctx.canvas.height = 20;
    };

    const images = [ "new", "force", "jump", "ranking", "player", "sound" ];
    for( var i = 0; i < images.length; i++) {
        var icon = document.getElementById(images[i]);
        icon.index = i;
        icon.onload = function() {
            mctx.drawImage( this, this.index * 20, 0, this.width, this.height);
        }
    }
};

// set parking zones on field
function setParking(col,row) {

}


// --- end of file ---


