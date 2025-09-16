// IT-Game Code
function activateDocument() {
    const g = document.getElementById("game");
    const ctx = g.getContext("2d");
    
    const f = document.getElementById("field");
    
    f.onload = function(e) {
        ctx.canvas.width = f.width;
        ctx.canvas.height = f.height;
        ctx.drawImage(f, 0, 0, f.width,f.height);
    };
};


// --- end of file ---


