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
    /// <param name="rect">
    /// bounding rectangle
    /// </param>
    /// <param name="ctrl">
    /// control to draw bitmap
    /// </param>
    /// <param name="game">
    /// shadow copy of game field
    /// </param>
    static DrawBitmap(image, rect, ctrl, game)
    {
        /*
        using (var g = ctrl.CreateGraphics())
            g.DrawImage(image, rect);

        // obtain a graphic object from gaming bitmap
        using (var g = Graphics.FromImage(game))
            g.DrawImage(image, rect);
        */
    }

    /// <summary>
    /// select players for game
    /// </summary>
    static SelectPlayers() {
        var players = Properties.Settings.Default.Players.Split(',')
                                        .Select(s => string.Equals(s, "1"))
                                        .ToArray();
        var dlg = new PlayerForm
        {
            OrangeName = Properties.Settings.Default.Orange,
            YellowName = Properties.Settings.Default.Yellow,
            GreenName = Properties.Settings.Default.Green,
            BlueName = Properties.Settings.Default.Blue,

            OrangeSelected = players[0],
            YellowSelected = players[1],
            GreenSelected = players[2],
            BlueSelected = players[3]
        };

        if (DialogResult.OK == dlg.ShowDialog())
        {
            Properties.Settings.Default.Orange = dlg.OrangeName;
            Properties.Settings.Default.Yellow = dlg.YellowName;
            Properties.Settings.Default.Green = dlg.GreenName;
            Properties.Settings.Default.Blue = dlg.BlueName;

            players[0] = dlg.OrangeSelected;
            players[1] = dlg.YellowSelected;
            players[2] = dlg.GreenSelected;
            players[3] = dlg.BlueSelected;

            Properties.Settings.Default.Players = string.Join(",", players.Select(p => p ? "1" : "0"));
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
            case 0: return Properties.Settings.Default.Orange;
            case 1: return Properties.Settings.Default.Yellow;
            case 2: return Properties.Settings.Default.Green;
            case 3: return Properties.Settings.Default.Blue;
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

