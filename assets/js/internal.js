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
    /// control to draw image
    /// </param>
    static DrawImage(image, context, position) {
        console.log("DrawImage", image, position);

        const x = position.x - image.width / 2;
        const y = position.y = image.height / 2;
        context.drawImage(image, x, y, image.width, image.height);
    }

    /// <summary>
    /// select players for game
    /// </summary>
    static SelectPlayers() {
        const p = localStorage.getItem("Players") ?? "1,1,1,1";
        var players = p.split(',').map( (p) => p == "1");
        document.getElementById("orangeChk").checked = players[0];
        document.getElementById("orangeName").value = localStorage.getItem("Orange") ?? "orange";
        document.getElementById("yellowChk").checked = players[2];
        document.getElementById("yellowName").value = localStorage.getItem("Yellow") ?? "yellow";
        document.getElementById("greenChk").checked = players[3];
        document.getElementById("greenName").value = localStorage.getItem("Green") ?? "green";
        document.getElementById("blueChk").checked = players[3];
        document.getElementById("blueName").value = localStorage.getItem("Blue") ?? "blue";

        document.getElementById("playerForm").style.display = "block";
        document.getElementById("playerSubmit").onsubmit = (ev) => {
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
        if (rank.Length > 0) dlg.First = GetPlayerName(rank[0]);
        if (rank.Length > 1) dlg.Second = GetPlayerName(rank[1]);
        if (rank.Length > 2) dlg.Third = GetPlayerName(rank[2]);
        if (rank.Length > 3) dlg.Forth = GetPlayerName(rank[3]);

        dlg.ShowDialog(owner);
    }
}

// --- end of file ---

