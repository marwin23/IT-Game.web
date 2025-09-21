/// <summary>
/// global functions
/// </summary>
class Globals {
    /// <summary>
    /// multiplicate and diviate in one operation
    /// </summary>
    /// <param name="number">
    /// number to handle
    /// </param>
    /// <param name="numerator">
    /// multiplicator
    /// </param>
    /// <param name="denominator">
    /// diviator
    /// </param>
    /// <returns></returns>
    static MulDiv(number, numerator, denominator) {
        return Number(number * numerator) / denominator;
    };

    /// <summary>
    /// sleep awhile
    /// </summary>
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /// <summary>
    /// sychron play audio file
    /// </summary>
    static async play(m, b = 300) {
        return new Promise(resolve => {
                if( m != null) {
                    const d = Math.ceil(m.duration * 1000);
                    console.log("play", m.id, d);
                    m.play();
                    setTimeout(resolve, d < b ? b : d); // workaround
                } else {
                    console.log("play", b);
                    setTimeout(resolve, b);     // just sleep
                }
        })
    }
}

/// <summary>
/// rectangle
/// </summary>
class Rectangle {
    x; y; w; h;

    constructor( x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(x, y) {
        return this.x <= x && x <= this.x + this.w &&
               this.y <= y && y <= this.y + this.h;
    }
}

/// <summary>
/// internal functions for the game
/// </summary>
class GameInternal {
    /// <summary>
    /// get back ground of image from the field
    /// </summary>
    /// <param name="rect">
    /// rectangle to get background from
    /// </param>
    /// <param name="game">
    /// shadow copy of the field
    /// </param>
    /// <returns>
    /// bitmap for parking zone
    /// </returns>
    static GetBackGround(rect, game)
    {
        /*
        // create backgound image
        const back = new Bitmap(rect.Width, rect.Height, game);

        // obtain a graphic object from that bitmap
        using (var g = Graphics.FromImage(back))
        {
            var dest = new Rectangle(0, 0, rect.Width, rect.Height);
            g.DrawImage(game, dest, rect, GraphicsUnit.Pixel);
        }

        return back;
        */
    }

    /// <summary>
    /// set back ground of image to field.
    /// </summary>
    /// <param name="back">
    /// background image
    /// </param>
    /// <param name="rect">
    /// rectangle to set background to.
    /// </param>
    /// <param name="ctrl">
    /// shadow copy of the field.
    /// </param>
    /// <param name="game">
    /// shadow copy of game field
    /// </param>
    static SetBackGround(back, rect, ctrl, game)
    {
        if (!!back)
            DrawBitmap(back, rect, ctrl, game);
    }

    /// <summary>
    /// draw image to field
    /// </summary>
    /// <param name="image">
    /// image to draw on field
    /// </param>
    /// <param name="context">
    /// context to draw image
    /// </param>
    static DrawField(image, context) {
        console.log("DrawField", image);

        context.canvas.width = image.width;
        context.canvas.height = image.height;
        context.drawImage(image, 0, 0, image.width, image.height);
    }

    /// <summary>
    /// draw figure to field
    /// </summary>
    /// <param name="image">
    /// image to draw on field
    /// </param>
    /// <param name="context">
    /// context to draw image
    /// </param>
    /// <param name="position">
    /// position to draw image
    /// </param>
    /// <param name="index">
    /// player index to draw image
    /// </param>
    static DrawFigure(image, context, position, index) {
        console.log("DrawFigure", image, position);

        const w = image.width / Field.GameMaxPlayer();
        const h = image.height;
        const sx = index * w;
        const sy = 0;

        const x = position.x - w / 2;
        const y = position.y - h / 2;
        context.drawImage(image, sx,sy, w,h, x,y, w,h);
    }

    /// <summary>
    /// delete figure from field
    /// </summary>
    /// <param name="image">
    /// image field
    /// </param>
    /// <param name="context">
    /// context to draw image
    /// </param>
    /// <param name="position">
    /// position to draw image
    /// </param>
    /// <param name="index">
    /// player index to draw image
    /// </param>
    static DeleteFigure(image, back, context, position) {
        console.log("DeleteFigure", image, position);

        const w = back.width / Field.GameMaxPlayer();
        const h = back.height;
        const x = position.x - w / 2;
        const y = position.y - h / 2;
        context.drawImage(image, x,y, w,h, x,y, w,h);
    }

    /// <summary>
    /// draw parking sign to the field
    /// </summary>
    /// <param name="image">
    /// image to draw on field
    /// </param>
    /// <param name="context">
    /// context to draw image
    /// </param>
    /// <param name="position">
    /// position to draw image
    /// </param>
    static DrawParking(image, context, position) {
        console.log("DrawFigure", image, position);

        const w = image.width;
        const h = image.height;
        const x = position.x - w / 2;
        const y = position.y - h / 2;
        context.drawImage(image, x,y, w,h);
    }

    /// <summary>
    /// delete parking sign from the field
    /// </summary>
    /// <param name="image">
    /// image to draw on field
    /// </param>
    /// <param name="context">
    /// context to draw image
    /// </param>
    /// <param name="position">
    /// position to draw image
    /// </param>
    static DeleteParking(image, back, context, position) {
        console.log("DeleteParking", image, position);

        const w = back.width;
        const h = back.height;
        const x = position.x - w / 2;
        const y = position.y - h / 2;
        context.drawImage(image, x,y, w,h, x,y, w,h);
    }

    /// <summary>
    /// draw dice to the field
    /// </summary>
    /// <param name="image">
    /// image to draw on field
    /// </param>
    /// <param name="context">
    /// context to draw image
    /// </param>
    /// <param name="position">
    /// position to draw image
    /// </param>
    /// <param name="index">
    /// dice index to draw image
    /// </param>
    static DrawDice(image, context, position, index) {
        console.log("DrawDice", image, position);

        const w = image.width / 9;
        const h = image.height;
        const sx = index * w;
        const sy = 0;

        const x = position.x - w / 2;
        const y = position.y - h / 2;
        context.drawImage(image, sx,sy, w,h, x,y, w,h);
    }

    /// <summary>
    /// delete dice from field
    /// </summary>
    /// <param name="image">
    /// image field
    /// </param>
    /// <param name="context">
    /// context to draw image
    /// </param>
    /// <param name="position">
    /// position to draw image
    /// </param>
    /// <param name="index">
    /// player index to draw image
    /// </param>
    static DeleteDice(image, back, context, position) {
        console.log("DeleteDice", image, position);

        const w = back.width / 9;
        const h = back.height;
        const x = position.x - w / 2;
        const y = position.y - h / 2;
        context.drawImage(image, x,y, w,h, x,y, w,h);
    }

    /// <summary>
    /// draw image to field
    /// </summary>
    /// <param name="image">
    /// image to draw on field
    /// </param>
    /// <param name="context">
    /// context to draw image
    /// </param>
    static DrawImage(image, context, position) {
        console.log("DrawImage", image, position);

        const x = position.x - image.width / 2;
        const y = position.y = image.height / 2;
        context.drawImage(image, x, y, image.width, image.height);
    }

    /// <summary>
    /// draw background image to field
    /// </summary>
    /// <param name="image">
    /// field image
    /// </param>
    /// <param name="back">
    /// image set before
    /// </param>
    /// <param name="context">
    /// context to draw image
    /// </param>
    static DrawBackground(image, back, context, position) {
        console.log("DrawBackground", back, position);

        const x = position.x - back.width / 2;
        const y = position.y = back.height / 2;
        context.drawImage(image, x, y, back.width, back.height);
    }

    /// <summary>
    /// select players for game
    /// </summary>
    static SelectPlayers() {
        const p = localStorage.getItem("Players");
        var players = Array.from(p.split(',').map( (p) => p == "1"));
        document.getElementById("orangeChk").checked = players[0];
        document.getElementById("orangeName").value = localStorage.getItem("Orange");
        document.getElementById("yellowChk").checked = players[2];
        document.getElementById("yellowName").value = localStorage.getItem("Yellow");
        document.getElementById("greenChk").checked = players[3];
        document.getElementById("greenName").value = localStorage.getItem("Green");
        document.getElementById("blueChk").checked = players[3];
        document.getElementById("blueName").value = localStorage.getItem("Blue");

        document.getElementById("playerForm").style.display = "block";
        document.getElementById("playerSubmit").onsubmit = (ev) => {
            ev.preventDefault(); 
            console.log("Submit", ev);

            localStorage.setItem("Orange", document.getElementById("orangeName").value);
            localStorage.setItem("Yellow", document.getElementById("yellowName").value);
            localStorage.setItem("Green", document.getElementById("greenName").value);
            localStorage.setItem("Blue", document.getElementById("blueName").value);

            players[0] = document.getElementById("orangeChk").checked;
            players[1] = document.getElementById("yellowChk").checked;
            players[2] = document.getElementById("greenChk").checked;
            players[3] = document.getElementById("blueChk").checked;
            localStorage.setItem("Players", players.map(p => p ? "1" : "0").join(','));

            document.getElementById("playerForm").style.display = "none";
            return true;
        }

        return false;
    }

    /// <summary>
    /// get user name for player according to player index
    /// </summary>
    /// <param name="p">
    /// player
    /// </param>
    /// <returns>
    /// players user name
    /// </returns>
    static GetPlayerName(p) {
        switch (p.Index) {
            case 0: return localStorage.getItem("Orange");
            case 1: return localStorage.getItem("Yellow");
            case 2: return localStorage.getItem("Green");
            case 3: return localStorage.getItem("Blue");
        }

        return null;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="rank"></param>
    /// <param name="owner"></param>
    static PrintRanking(rank, owner)
    {
        if (!rank)
            return;

        var dlg = new RankingForm();
        if (rank.length > 0) dlg.First = GetPlayerName(rank[0]);
        if (rank.length > 1) dlg.Second = GetPlayerName(rank[1]);
        if (rank.length > 2) dlg.Third = GetPlayerName(rank[2]);
        if (rank.length > 3) dlg.Forth = GetPlayerName(rank[3]);

        dlg.ShowDialog(owner);
    }
}

// --- end of file ---

