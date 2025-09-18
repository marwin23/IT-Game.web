// IT-Game Code
function activateDocument() {
    const g = document.getElementById("game");
    const gctx = g.getContext("2d");  
    const f = document.getElementById("field");

    f.onload = function(e) {
        gctx.canvas.width = f.width;
        gctx.canvas.height = f.height;
        gctx.drawImage(f, 0, 0, f.width,f.height);
    };

    const m = new Menu(f.width);

};

// set parking zones on field
function setParking(col,row) {

}


// --- end of file ---


