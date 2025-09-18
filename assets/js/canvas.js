/// <summary>
/// additional data of player
/// </summary>
class PlayerData
{
    /// <summary>
    /// number of dice rolls
    /// </summary>
    NumRolls;

    /// <summary>
    /// figures that can be tracked
    /// </summary>
    Figures;
};

/// <summary>
/// additional data of figure
/// </summary>
class FigureData
{
    /// <summary>
    /// background of the figure
    /// </summary>
    backGround;

    /// <summary>
    /// get back ground of figure from the field.
    /// </summary>
    /// <param name="rect">
    /// rectangle to get background from
    /// </param>
    /// <param name="game">
    /// shadow copy of the field
    /// </param>
    GetBackGround(rect, game) {
        this.DisposeBackGound();
        this.backGround = GameInternal.GetBackGround(rect, game);
    }

    /// <summary>
    /// set back ground of figure to field.
    /// </summary>
    /// <param name="rect">
    /// rectangle to set background to.
    /// </param>
    /// <param name="ctrl">
    /// control context of the field.
    /// </param>
    /// <param name="game">
    /// shadow copy of the game
    /// </param>
    SetBackGround(rect, ctrl, game) {
        if (!!this.backGround) {
            GameInternal.SetBackGround(this.backGround, rect, ctrl, game);
            this.DisposeBackGound();
        }
    }

    /// <summary>
    /// dispose figure backgound
    /// </summary>
    DisposeBackGound() {
        if (!!this.backGround) {
            backGround.Dispose();
            backGround = null;
        }
    }
};

/// <summary>
/// physical position of top left corner in field
/// </summary>
class FieldPosition {
    private Rectangle gameRect = new Rectangle();
    private Size gameSize = new Size();

    /// <summary>
    /// calculate position and size of game in client window
    /// </summary>
    constructor(sizeCanvas, sizeField)
    {
        const dx = Globals.MulDiv(sizeCanvas.Height, sizeField.Width, sizeField.Height);
        const dy = Globals.MulDiv(sizeCanvas.Width, sizeField.Height, sizeField.Width);
        if (sizeCanvas.Height > dy) {
            this.gameRect = new Rectangle(0, (sizeCanvas.Height - dy) / 2, sizeCanvas.Width, dy);
            this.gameSize = new Size(sizeCanvas.Width, sizeField.Width);
        } else {
            this.gameRect = new Rectangle((sizeCanvas.Width - dx) / 2, 0, dx, sizeCanvas.Height);
            this.gameSize = new Size(sizeCanvas.Height, sizeField.Height);
        }
    }

    /// <summary>
    /// calculate position on field
    /// </summary>
    /// <remarks>
    /// conider that field is a square
    /// </remarks>
    /// <param name="imgsize">
    /// size of position to determine position for.
    /// </param>
    /// <param name="pos">
    /// position from algorithm
    /// </param>
    /// <returns>
    /// position in client coordinates
    /// </returns>
    CalcPosition(imgsize, pos) {
        const w = Globals.MulDiv(imgsize.Width, this.gameSize.Width, this.gameSize.Height);
        const h = Globals.MulDiv(imgsize.Height, this.gameSize.Width, this.gameSize.Height);

        const x = this.gameRect.Left + Globals.MulDiv(pos.Col, this.gameSize.Width, this.gameSize.Height) - w / 2;
        const y = this.gameRect.Top + Globals.MulDiv(pos.Row, this.gameSize.Width, this.gameSize.Height) - h / 2;

        return { x, y, w, h }; // new Rectangle(x, y, w, h);
    }

    /// <summary>
    /// calculate position of an image in the field
    /// </summary>
    /// <param name="imgsize">
    /// size of an image
    /// </param>
    /// <returns>
    /// rectangle of the image
    /// </returns>
    CalcPosition(imgsize) {
        const w = Globals.MulDiv(imgsize.Width, this.gameSize.Width, this.gameSize.Height);
        const h = Globals.MulDiv(imgsize.Height, this.gameSize.Width, this.gameSize.Height);

        const x = this.gameRect.Left;
        const y = this.gameRect.Top;

        return { x, y, w, h }; // new Rectangle(x, y, w, h);
    }
}

/// <summary>
/// canvas of the menu
/// </summary>
class Menu {
    constructor(w) {
        const m = document.getElementById("menu");
        const mctx = m.getContext("2d");

        mctx.canvas.width = w;
        mctx.canvas.height = 20;

        const images = [ "new", "force", "jump", "ranking", "player", "sound" ];
        for( var i = 0; i < images.length; i++) {
            var icon = document.getElementById(images[i]);
            icon.index = i;
            icon.onload = function() {
                mctx.drawImage( this, this.index * 20, 0, this.width, this.height);           
            }
        }

        mctx.onclick = function(ev) {
            alert("menu");
            console.log(ev);
        }
    }
};

/// <summary>
/// canvas of the game
/// </summary>
class Canvas {
    private Game game = new Game();
    private Random rnd = new Random();          // for the dice
    private Bitmap bitmapGame;

    /// <summary>
    /// dice pips
    /// </summary>
    Dice;

    /// <summary>
    /// dice can be rolled
    /// </summary>
    DiceToSelect;

    /// <summary>
    /// figures can be selected
    /// </summary>
    FiguresToSelect;

    /// <summary>
    /// background for the dice
    /// </summary>
    backGroundDice;

    /// <summary>
    /// background for parking zone
    /// </summary>
    backGroundPark;

    _init = false;


    #sndStart = new Audio("assets/audio/start.wav");
    #sndMove = new SoundPlayer(Properties.Resources.Move);
    #sndDefeat = new SoundPlayer(Properties.Resources.Defeat);
    #sndDice = new SoundPlayer(Properties.Resources.Dice);

    #bmParking = new Bitmap(Properties.Resources.Parking);
    #imgDice0 = new ImageList();
    #imgDice1 = new ImageList();
    #imgDice;

    #imgFigBall0 = new ImageList();
    #imgFigBall1 = new ImageList();
    #imgFigPoint0 = new ImageList();
    #imgFigPoint1 = new ImageList();
    #imgFigSmiley0 = new ImageList();
    #imgFigSmiley1 = new ImageList();
    #imgFigStar0 = new ImageList();
    #imgFigStar1 = new ImageList();
    #imgFig;

    /// <summary>
    /// default constructor
    /// </summary>
    constructor()
    {
        Field.SetDescription();            // IT game field

        this.game.OnFigure += OnGameFigure;
        this.game.OnParking += OnGameParking;

        this.CheckDiceRoll();

        this.sndStart.Load();
        this.sndMove.Load();
        this.sndDefeat.Load();
        this.sndDice.Load();

        // set images
        this.imgDice0.ImageSize = new Size(32, 32);
        this.imgDice0.Images.AddStrip(Properties.Resources.Dice0);
        this.imgDice0.TransparentColor = Color.Magenta;

        this.imgDice1.ImageSize = new Size(32, 32);
        this.imgDice1.Images.AddStrip(Properties.Resources.Dice1);
        this.imgDice1.TransparentColor = Color.Magenta;
        this.imgDice = new[] { this.imgDice0, this.imgDice1 };

        this.imgFigBall0.ImageSize = new Size(21, 21);
        this.imgFigBall0.Images.AddStrip(Properties.Resources.FigBall0);
        this.imgFigBall0.TransparentColor = Color.Black;

        this.imgFigBall1.ImageSize = new Size(21, 21);
        this.imgFigBall1.Images.AddStrip(Properties.Resources.FigBall1);
        this.imgFigBall1.TransparentColor = Color.Black;

        this.imgFigPoint0.ImageSize = new Size(21, 21);
        this.imgFigPoint0.Images.AddStrip(Properties.Resources.FigPoint0);
        this.imgFigPoint0.TransparentColor = Color.Black;

        this.imgFigPoint1.ImageSize = new Size(21, 21);
        this.imgFigPoint1.Images.AddStrip(Properties.Resources.FigPoint1);
        this.imgFigPoint1.TransparentColor = Color.Black;

        this.imgFigSmiley0.ImageSize = new Size(21, 21);
        this.imgFigSmiley0.Images.AddStrip(Properties.Resources.FigSmiley0);
        this.imgFigSmiley0.TransparentColor = Color.Black;

        this.imgFigSmiley1.ImageSize = new Size(21, 21);
        this.imgFigSmiley1.Images.AddStrip(Properties.Resources.FigSmiley1);
        this.imgFigSmiley1.TransparentColor = Color.Black;

        this.imgFigStar0.ImageSize = new Size(21, 21);
        this.imgFigStar0.Images.AddStrip(Properties.Resources.FigStar0);
        this.imgFigStar0.TransparentColor = Color.Black;

        this.imgFigStar1.ImageSize = new Size(21, 21);
        this.imgFigStar1.Images.AddStrip(Properties.Resources.FigStar1);
        this.imgFigStar1.TransparentColor = Color.Black;

        this.imgFig = new[,]
        {
            { this.imgFigBall0, this.imgFigBall1 },
            { this.imgFigPoint0, this.imgFigPoint1 },
            { this.imgFigSmiley0, this.imgFigSmiley1 },
            { this.imgFigStar0, this.imgFigStar1 }
        };

        this.bmParking.MakeTransparent(Color.Magenta);
    }

    /// <summary>
    /// disposes the game field
    /// </summary>
    public void DisposeGame()
    {
        if( !(this.bitmapGame is null))
        {
            this.bitmapGame.Dispose();
            this.bitmapGame = null;
        }
    }

    /// <summary>
    /// set toolbar icons according to settings
    /// </summary>
    #CheckFigure() {
        const fig = Properties.Settings.Default.Figure;
        this.tsbFigureBall.Checked = (fig == 0);
        this.tsbFigurePoint.Checked = (fig == 1);
        this.tsbFigureSmiley.Checked = (fig == 2);
        this.tsbFigureStar.Checked = (fig == 3);
        this.tscGame.ContentPanel.Invalidate();
    }
    
    /// <summary>
    /// check toolbar icons according to settings
    /// </summary>
    #CheckDiceRoll() {
        const dice = Properties.Settings.Default.MaxDice;
        this.tsbDice6.Checked = (dice == 6);
        this.tsbDice7.Checked = (dice == 7);
        this.tsbDice8.Checked = (dice == 8);
        this.tsbDice9.Checked = (dice == 9);
    }

    /// <summary>
    /// initialize game
    /// </summary>
    #InitGame() {
        this._init = true;
        var ps = Properties.Settings.Default.Players;
        var players = ps
            .Split(',')
            .Select((s, i) => string.Equals(s, "1") ? i : -1)
            .ToArray();
        this.game.SetPlayers(players);

        for (var p of this.game.Players)
            p.Data = new PlayerData();

        this._init = false;
    }

    /// <summary>
    /// set figure on field.
    /// </summary>
    /// <param name="p">
    /// player to set the figure for.
    /// </param>
    /// <param name="f">
    /// figure
    /// </param>
    /// <param name="select">
    /// set figures to select.
    /// </param>
    #SetFigure(p, f, select = false) {
        var fig = Properties.Settings.Default.Figure;
        var img = this.imgFig[fig, select ? 1 : 0].Images[p.Index];
        var fp = new FieldPosition(
            this.tscGame.ContentPanel.Size,
            Properties.Resources.Field.Size);
        var rect = fp.CalcPosition(img.Size, f.Position);
        var fd = f.Data as FigureData;
        if (!!fd)
            fd.GetBackGround(rect, this.bitmapGame);

        GameInternal.DrawBitmap(img, rect, tscGame.ContentPanel, this.bitmapGame);
    }

    /// <summary>
    /// delete figure from field
    /// </summary>
    /// <param name="p">
    /// player to set the figure for.
    /// </param>
    /// <param name="f">
    /// figure
    /// </param>
    #DeleteFigure(p, f) {
        var fd = f.Data;
        if( !!fd) {
            var img = this.imgFig[0,0].ImageSize;
            var fp = new FieldPosition(
                this.tscGame.ContentPanel.Size,
                Properties.Resources.Field.Size);
            var rect = fp.CalcPosition(img, f.Position);
            fd.SetBackGround(rect, this.tscGame.ContentPanel, this.bitmapGame);
        }
    }

    /// <summary>
    /// set figures of current player on the field
    /// </summary>
    /// <param name="figures">
    /// figures to set. null, set all figures of current player.
    /// </param>
    /// <param name="select">
    /// show figures for selection
    /// </param>
    #SetFigures(figures = null, select = false) {
        this.FiguresToSelect = select;

        if (!figures) {
            for (var f of this.game.Player.Figures)
                this.#SetFigure(this.game.Player, f, select);
        } else {
            for (var f of figures)
                this.#SetFigure(this.game.Player, f, select);
        }
    }

    /// <summary>
    /// delete figures of current player
    /// </summary>
    /// <param name="figures">
    /// figures to delete. null, delete all figures of current player.
    /// </param>
    #DeleteFigures( figures = null) {
        if (!figures) {
            for (var f of this.game.Player.Figures)
                this.#DeleteFigure(this.game.Player, f);
        } else {
            for (var f of figures)
                this.#DeleteFigure(this.game.Player, f);
        }
    }

    /// <summary>
    /// dispose background of figures
    /// </summary>
    DisposeFigures() {
        if (!!this.game.Players)
            for (var p of this.game.Players)
                for (var f of p.Figures) {
                    var fd = f.Data; //  as FigureData;
                    if (!!fd)
                        fd.DisposeBackGound();
                }
    }

    /// <summary>
    /// get figure according to position
    /// </summary>
    /// <param name="figures">
    /// figures to check.
    /// </param>
    /// <param name="pos">
    /// mouse position
    /// </param>
    /// <returns>
    /// figure, null if no figure is selected
    /// </returns>
    private Game.GameFigure GetFigure(Game.GameFigure[] figures, Point pos)
    {
        if (!this.FiguresToSelect)
            return null;

        if (!(figures is null))
        {
            var sz = this.imgFig[0,0].ImageSize;
            var fp = new FieldPosition(
                this.tscGame.ContentPanel.Size,
                Properties.Resources.Field.Size);

            foreach (var f in figures)
            {
                var rt = fp.CalcPosition(sz, f.Position);
                if (rt.Contains(pos))
                    return f;
            }
        }

        return null;
    }

    /// <summary>
    /// set dice for player
    /// </summary>
    /// <param name="p">
    /// player to set the dice for.
    /// </param>
    /// <param name="dice">
    /// number of dice rolls.
    /// </param>
    /// <param name="select">
    /// user can throw the dice.
    /// </param>
    #SetDice( p, dice, select = false) {
        if (!p || dice == 0)
            return;

        var img = this.imgDice[select ? 1 : 0].Images[dice - 1];
        this.DiceToSelect = select;

        var fp = new FieldPosition(
            this.tscGame.ContentPanel.Size,
            Properties.Resources.Field.Size);

        var rect = fp.CalcPosition(img.Size, p.FieldPlayer.diceroll);
        this.backGroundDice = GameInternal.GetBackGround(rect, this.bitmapGame);

        GameInternal.DrawBitmap(img, rect, tscGame.ContentPanel, this.bitmapGame);

        if (select) {
            var name = GameInternal.GetPlayerName(p);
            this.tssGame.Text = string.Format("{0}: roll dice.", name);
        }
        else
            this.tssGame.Text = string.Empty;
    }

    /// <summary>
    /// delete the dice from field
    /// </summary>
    /// <param name="p">
    /// player to delete the dice for.
    /// </param>
    #DeleteDice(p) {
        if (!!this.backGroundDice) {
            var img = this.imgDice[0].ImageSize;
            var fp = new FieldPosition(
                this.tscGame.ContentPanel.Size,
                Properties.Resources.Field.Size);
            var rect = fp.CalcPosition(img, p.FieldPlayer.diceroll);
            GameInternal.SetBackGround(this.backGroundDice, rect, tscGame.ContentPanel, this.bitmapGame);
            this.DisposeDice();
        }
    }

    /// <summary>
    /// dispose background of dice.
    /// </summary>
    #DisposeDice() {
        if (!!this.backGroundDice) {
            this.backGroundDice.Dispose();
            this.backGroundDice = null;
        }
    }

    /// <summary>
    /// determine if point is in dice.
    /// </summary>
    /// <param name="p">
    /// current player.
    /// </param>
    /// <param name="point">
    /// point in screen coordinates.
    /// </param>
    /// <returns>
    /// point is in dice.
    /// </returns>
    #IsDice(p, point)
    {
        if (!this.DiceToSelect)
            return false;

        var sz = this.imgDice1.ImageSize;
        var fp = new FieldPosition(
            this.tscGame.ContentPanel.Size,
            Properties.Resources.Field.Size);
        var rt = fp.CalcPosition(sz, p.FieldPlayer.diceroll);

        return rt.Contains(point);
    }

    /// <summary>
    /// roll the dice with random generator.
    /// </summary>
    /// <returns>
    /// number of dice pips.
    /// </returns>
    #RollDice() {
        return rnd.Next(1, Properties.Settings.Default.MaxDice + 1);
    }

    /// <summary>
    /// set or delete parking zones in field.
    /// </summary>
    /// <param name="sender">
    /// class where the event came from.
    /// </param>
    /// <param name="e">
    /// arguments of event.
    /// </param>
    #OnGameParking(object sender, Game.ParkingEventArgs e)
    {
        var size = this.bmParking.Size;
        var fp = new FieldPosition(
                    this.tscGame.ContentPanel.Size,
                    Properties.Resources.Field.Size);

        if (e.action)          // set parking zones
        {
            this.backGroundPark = new Bitmap[e.positions.Length];
            var i = 0;
            for (var rect of e.positions.Select(pos => fp.CalcPosition(size, pos)))
            {
                this.backGroundPark[i++] = GameInternal.GetBackGround(rect, this.bitmapGame);
                GameInternal.DrawBitmap(this.bmParking, rect, tscGame.ContentPanel, this.bitmapGame);
            }
        }
        else            // delete parking zones
        {
            if (!!this.backGroundPark)
            {
                var i = 0;
                for (var rect of e.positions.Select(pos => fp.CalcPosition(size, pos)))
                {
                    var park = this.backGroundPark[i++];
                    GameInternal.SetBackGround(park, rect, tscGame.ContentPanel, this.bitmapGame);
                }

                this.DisposePark();
            }
        }
    }

    /// <summary>
    /// erase parking backgound
    /// </summary>
    #DisposePark() {
        if( !!this.backGroundPark)
        {
            for (var park of this.backGroundPark)
                park.Dispose();

            this.backGroundPark = null;
        }
    }

    /// <summary>
    /// event functions while tracking figure.
    /// </summary>
    /// <param name="sender">
    /// sender of the control
    /// </param>
    /// <param name="e">
    /// arguements of the event.
    /// </param>
    #OnGameFigure(object sender, Game.FigureEventArgs e)
    {
        switch (e.action)
        {
            case FigureAction.Init:
                e.figure.Data = new FigureData();
                break;

            case FigureAction.Set:
                this.SetFigure(e.player, e.figure);
                if (!this._init && Properties.Settings.Default.Sound)
                    if (e.figure.InField && e.figure.TrackNumber == 0)
                        sndStart.PlaySync();
                break;

            case FigureAction.Delete:
                this.DeleteFigure(e.player, e.figure);
                break;

            case FigureAction.Delay:
                Application.DoEvents();     // perform paint events
                if (!this._init)
                {
                    if (Properties.Settings.Default.Sound)
                        sndMove.PlaySync();
                    else
                        Thread.Sleep(300);
                }
                break;

            case FigureAction.Defeated:
                if (!this._init && Properties.Settings.Default.Sound)
                    sndDefeat.PlaySync();
                break;
        }
    }

    /// <summary>
    /// initialize game form 
    /// </summary>
    /// <param name="sender">
    /// sender, game form
    /// </param>
    /// <param name="e">
    /// event argumnent (not used here)
    /// </param>
    private void GameForm_Load(object sender, EventArgs e)
    {
        this._init = true;
        this.tsbRollDice3.Checked = Properties.Settings.Default.Dice3;
        this.tsbSound.Checked = Properties.Settings.Default.Sound;
        this.tsbJump.Checked = Properties.Settings.Default.Jump;
        this.tsbForceDefeat.Checked = Properties.Settings.Default.ForceDefeat;
        this.tsbParking.Checked = Properties.Settings.Default.Parking;

        this.game.ForceDefeat = this.tsbForceDefeat.Checked;
        this.game.JumpHouse = this.tsbJump.Checked;

        this.CheckFigure();
        this.CheckDiceRoll();

        this._init = false;
    }

    /// <summary>
    /// game form is about to be closed
    /// </summary>
    /// <param name="sender">
    /// sender, game form
    /// </param>
    /// <param name="e">
    /// event argument (not used here).
    /// </param>
    private void GameForm_FormClosing(object sender, FormClosingEventArgs e)
    {
    }

    /// <summary>
    /// called if form is about to be resized
    /// </summary>
    /// <param name="sender">
    /// sender, game form
    /// </param>
    /// <param name="e">
    /// event argument (not used here).
    /// </param>
    private void GameForm_Resize(object sender, EventArgs e)
    {
    }

    /// <summary>
    /// graphical paint of the field, figures and other stuff
    /// </summary>
    /// <param name="sender">
    /// sender, content panel (??)
    /// </param>
    /// <param name="e">
    /// event argument, not used here.
    /// </param>
    private void Game_ContentPanel_Paint(object sender, PaintEventArgs e)
    {
        if (!(this.bitmapGame is null))
            this.bitmapGame.Dispose();

        // delete parking field and figures
        this.DisposeDice();
        this.DisposeFigures();
        this.DisposePark();

        // create backgound image
        var rectTarget = this.tscGame.ContentPanel.ClientRectangle;
        this.bitmapGame = new Bitmap(rectTarget.Width, rectTarget.Height, e.Graphics);
        var bm = Properties.Resources.Field;
        var fp = new FieldPosition( this.tscGame.ContentPanel.Size, bm.Size);
        var rect = fp.CalcPosition(bm.Size);

        using (var g = Graphics.FromImage(this.bitmapGame))
        {
            g.DrawImage(bm, rect);
            e.Graphics.DrawImage(bm, rect);
        }

        this.game.SetFigures();
        this.game.SetParking(Properties.Settings.Default.Parking);
        this.SetDice(this.game.Player, this.Dice, true);
    }

    /// <summary>
    /// mouse click in game field
    /// </summary>
    /// <param name="sender">
    /// sender, content panel (??)
    /// </param>
    /// <param name="e">
    /// event argument (not used here)
    /// </param>
    private void Game_ContentPanel_MouseDown(object sender, MouseEventArgs e)
    {
        var hit = false;

        if ( e.Button == MouseButtons.Left)
        {
            if (e.Clicks == 1)
            {
                if (!this.game.Player)
                    return;

                const pd = this.game.Player.Data; // as PlayerData;
                if (!pd)
                    return;

                const name = GameInternal.GetPlayerName(this.game.Player);

                if (this.IsDice(this.game.Player, e.Location))
                {
                    hit = true;

                    this.Dice = this.RollDice();
                    this.DeleteDice(this.game.Player);
                    this.SetDice(this.game.Player, this.Dice);

                    if (Properties.Settings.Default.Sound)
                        sndDice.PlaySync();

                    const res = game.EvalDiceRoll(this.Dice);
                    if (!!res.ft)    // figure already has been tracked
                    {
                        pd.Figures = res.ft;

                        if (pd.Figures.Length == 0) {
                            if (this.tsbRollDice3.Checked && game.CheckCorner()) {
                                pd.NumRolls++;
                                if (pd.NumRolls < 3)
                                {
                                    this.DeleteDice(this.game.Player);
                                    this.SetDice(this.game.Player, this.Dice, true);
                                    return;
                                }
                            }
                        } else if (pd.Figures.Length == 1) {
                            var f = pd.Figures[0];
                            this.tssGame.Text = string.Format("{0}: track figure {1}.", name, f.Number);
                            this.game.TrackFigure(f, this.Dice);
                        }
                        else
                        {
                            // set figures to select
                            this.DeleteFigures(pd.Figures);
                            this.SetFigures(pd.Figures, true);
                            this.tssGame.Text = string.Format("{0}: select figure to track.", name);

                            hit = false;
                        }
                    }
                }
                else
                {
                    const f = this.GetFigure(pd.Figures, e.Location);
                    if (!!f)
                    {
                        hit = true;
                        this.DeleteFigures(pd.Figures);
                        this.SetFigures(pd.Figures);
                        this.tssGame.Text = string.Empty;

                        this.tssGame.Text = string.Format("{0}: track figure {1}.", name, f.Number);
                        this.game.TrackFigure(f, this.Dice);
                    }
                }

                if (hit)
                {
                    pd.NumRolls = 0;

                    this.DeleteDice(this.game.Player);

                    if (this.Dice == 6)
                        this.SetDice(this.game.Player, this.Dice, true);
                    else
                    {
                        if (!game.SelectPlayer())
                        {
                            this.tssGame.Text = "Game finished!";
                            this.PrintRanking();
                        }
                        else
                            this.SetDice(this.game.Player, this.Dice, true);
                    }
                }
            }
        }
    }

    /// <summary>
    /// user starts new game, by toolbar
    /// </summary>
    /// <param name="sender">
    /// sender, tool tip button
    /// </param>
    /// <param name="e">
    /// event argument (not used here)
    /// </param>
    private void NewGame_Click(object sender, EventArgs e)
    {
        this.InitGame();

        this.game.SelectPlayer(true);
        this.Dice = this.RollDice();
        this.tscGame.ContentPanel.Invalidate();
    }

    /// <summary>
    /// select players in the game (before new game)
    /// </summary>
    /// <param name="sender">
    /// sender, tool tip button
    /// </param>
    /// <param name="e">
    /// event argument (not used here)
    /// </param>
    private void Player_Click(object sender, EventArgs e)
    {
        if( GameInternal.SelectPlayers())
            this.InitGame();
    }

    /// <summary>
    /// print ranking dialog
    /// </summary>
    private void PrintRanking()
    {
        var rank = this.game.GetRanking();
        GameInternal.PrintRanking(rank, this);
    }

    /// <summary>
    /// user press tool strip button, to show ranking
    /// </summary>
    /// <param name="sender">
    /// sender, tool tip button
    /// </param>
    /// <param name="e">
    /// event argument (not used here)
    /// </param>
    private void Ranking_Click(object sender, EventArgs e)
    {
        this.PrintRanking();
    }

    /// <summary>
    /// 6 dice selected
    /// </summary>
    /// <param name="sender">
    /// sender, tool tip button
    /// </param>
    /// <param name="e">
    /// event argument (not used here)
    /// </param>
    private void Dice6_Click(object sender, EventArgs e)
    {
        Properties.Settings.Default.MaxDice = 6;
        this.CheckDiceRoll();
    }

    /// <summary>
    /// 7 dice is selected
    /// </summary>
    /// <param name="sender">
    /// sender, tool tip button
    /// </param>
    /// <param name="e">
    /// event argument (not used here)
    /// </param>
    private void Dice7_Click(object sender, EventArgs e)
    {
        Properties.Settings.Default.MaxDice = 7;
        this.CheckDiceRoll();
    }

    /// <summary>
    /// 8 dice is selected
    /// </summary>
    /// <param name="sender">
    /// sender, tool tip button
    /// </param>
    /// <param name="e">
    /// event argument (not used here)
    /// </param>
    private void Dice8_Click(object sender, EventArgs e)
    {
        Properties.Settings.Default.MaxDice = 8;
        this.CheckDiceRoll();
    }

    /// <summary>
    /// 9 dice is selected
    /// </summary>
    /// <param name="sender">
    /// sender, tool tip button
    /// </param>
    /// <param name="e">
    /// event argument (not used here)
    /// </param>
    private void Dice9_Click(object sender, EventArgs e)
    {
        Properties.Settings.Default.MaxDice = 9;
        this.CheckDiceRoll();
    }

    /// <summary>
    /// force defeat option is activated or deactivated
    /// </summary>
    /// <param name="sender">
    /// sender, tool tip button
    /// </param>
    /// <param name="e">
    /// event argument (not used here)
    /// </param>
    private void ForceDefeat_Click(object sender, EventArgs e)
    {
        this.tsbForceDefeat.Checked = !this.tsbForceDefeat.Checked;
        Properties.Settings.Default.ForceDefeat = this.tsbForceDefeat.Checked;
        this.game.ForceDefeat = this.tsbForceDefeat.Checked;
    }

    /// <summary>
    /// roll dice 3 times if all figured are in the start field
    /// </summary>
    /// <param name="sender">
    /// sender, tool tip button
    /// </param>
    /// <param name="e">
    /// event argument (not used here)
    /// </param>
    private void RollDice3_Click(object sender, EventArgs e)
    {
        this.tsbRollDice3.Checked = !this.tsbRollDice3.Checked;
        Properties.Settings.Default.Dice3 = this.tsbRollDice3.Checked;
    }

    /// <summary>
    /// allow jump of figures in the house
    /// </summary>
    /// <param name="sender">
    /// sender, tool tip button
    /// </param>
    /// <param name="e">
    /// event argument (not used here)
    /// </param>
    private void Jump_Click(object sender, EventArgs e)
    {
        this.tsbJump.Checked = !this.tsbJump.Checked;
        Properties.Settings.Default.Jump = this.tsbJump.Checked;
        this.game.JumpHouse = this.tsbJump.Checked;
    }

    /// <summary>
    /// activate or deactivate parking fields
    /// </summary>
    /// <param name="sender">
    /// sender, tool tip button
    /// </param>
    /// <param name="e">
    /// event argument (not used here)
    /// </param>
    private void Parking_Click(object sender, EventArgs e)
    {
        this.tsbParking.Checked = !this.tsbParking.Checked;
        Properties.Settings.Default.Parking = this.tsbParking.Checked;
        this.tscGame.ContentPanel.Invalidate();
    }

    /// <summary>
    /// enable or disable sound
    /// </summary>
    /// <param name="sender">
    /// sender, tool tip button
    /// </param>
    /// <param name="e">
    /// event argument (not used here)
    /// </param>
    private void Sound_Click(object sender, EventArgs e)
    {
        this.tsbSound.Checked = !this.tsbSound.Checked;
        Properties.Settings.Default.Sound = this.tsbSound.Checked;
    }

    /// <summary>
    /// figures are balls
    /// </summary>
    /// <param name="sender">
    /// sender, tool tip button
    /// </param>
    /// <param name="e">
    /// event argument (not used here)
    /// </param>
    private void FigureBall_Click(object sender, EventArgs e)
    {
        Properties.Settings.Default.Figure = 0;
        this.CheckFigure();
    }

    /// <summary>
    /// figures are points
    /// </summary>
    /// <param name="sender">
    /// sender, tool tip button
    /// </param>
    /// <param name="e">
    /// event argument (not used here)
    /// </param>
    private void FigurePoint_Click(object sender, EventArgs e)
    {
        Properties.Settings.Default.Figure = 1;
        this.CheckFigure();
    }

    /// <summary>
    /// figures are smileys
    /// </summary>
    /// <param name="sender">
    /// sender, tool tip button
    /// </param>
    /// <param name="e">
    /// event argument (not used here)
    /// </param>
    private void FigureSmiley_Click(object sender, EventArgs e)
    {
        Properties.Settings.Default.Figure = 2;
        this.CheckFigure();
    }

    /// <summary>
    /// figures are stars
    /// </summary>
    /// <param name="sender">
    /// sender, tool tip button
    /// </param>
    /// <param name="e">
    /// event argument (not used here)
    /// </param>
    private void FigureStar_Click(object sender, EventArgs e)
    {
        Properties.Settings.Default.Figure = 3;
        this.CheckFigure();
    }

    /// <summary>
    /// show about box
    /// </summary>
    /// <param name="sender">
    /// sender, tool tip button
    /// </param>
    /// <param name="e">
    /// event argument (not used here)
    /// </param>
    private void About_Click(object sender, EventArgs e)
    {
        var dlg = new AboutForm();
        dlg.ShowDialog(this);
    }
}

// --- end of file ---
