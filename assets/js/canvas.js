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
    #gameRect;
    #gameSize;

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
    #images = [
        { n: "player", x: 5 },
        { n: "new", x: 25 },
        { n: "force", x: 45 },
        { n: "jump", x: 65 },
        { n: "dice3", x: 85 },

        { n: "dice6", x: 110 },
        { n: "dice7", x: 130 },
        { n: "dice8", x: 150 },
        { n: "dice9", x: 170 },

        { n: "ball", x: 195 },
        { n: "point", x: 215 },
        { n: "smiley", x: 235 },
        { n: "star", x: 255 },

        { n: "ranking", x: 280 },
        { n: "sound", x: 300 }
    ];

    #game;

    /// <summary>
    /// return menu name selected.
    /// </summary>
    #CheckPoint(x,y) {
        for( var i = 0; i < this.#images.length; i++) {
            const r = new Rectangle(this.#images[i].x, 2, 16, 16);
            if( r.contains( x, y)) {
                return this.#images[i].n;
            }
        }
        return null;
    }

    /// <summary>
    /// set check menu item to activate
    /// </summary>
    SetCheck(n,b) {
        console.log("SetCheck", n, b);

        const m = document.getElementById("menu");
        const mctx = m.getContext("2d");

        for( var i = 0; i < this.#images.length; i++) {
            if(n === this.#images[i].n) {
                mctx.strokeStyle = b ? "black" : "#08218c";
                mctx.strokeRect( this.#images[i].x -1 , 1, 18, 18);
                this.#images[i].c = b;
                break;
            }
        }
    }

    /// <summary>
    /// get check menu item
    /// </summary>
    GetCheck(n) {
        var r = false;
        for( var i = 0; i < this.#images.length; i++) {
            if(n === this.#images[i].n) {
                r = this.#images[i].c;
                break;
            }
        }
        console.log("GetCheck", n, r);
        return r;
    }

    constructor(w,g) {
        const m = document.getElementById("menu");
        const mctx = m.getContext("2d");

        mctx.canvas.width = w;
        mctx.canvas.height = 20;

        for( var i = 0; i < this.#images.length; i++) {
            var icon = document.getElementById(this.#images[i].n);
            icon.pos = this.#images[i].x;
            icon.onload = function() {
                mctx.drawImage( this, this.pos, 2, this.width, this.height);           
            }
        }

        this.#game = g;
        m.onclick = this.#handleClick;
    }

    #handleClick = (ev) => {
        const n = this.#CheckPoint(ev.clientX,ev.clientY);
        if( !!n)
            this.#game.OnMenu(n);
    };
};

/// <summary>
/// canvas of the game
/// </summary>
class Canvas {
    #game = new Game(this);
    #menu;
    #context;

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


    #sndStart = document.getElementById("start");
    #sndMove = document.getElementById("move");
    #sndDefeat = document.getElementById("defeat");
    #sndOut = document.getElementById("out");
    #sndDice = document.getElementById("dice");

    #imgField = document.getElementById("field");
    #imgParking = document.getElementById("parking");
    #imgDice0 = document.getElementById("dice0");
    #imgDice1 = document.getElementById("dice1");
    #imgDice;

    #imgFigBall0 = document.getElementById("ball0");
    #imgFigBall1 = document.getElementById("ball1");
    #imgFigPoint0 = document.getElementById("point0");
    #imgFigPoint1 = document.getElementById("point1");
    #imgFigSmiley0 = document.getElementById("smiley0");
    #imgFigSmiley1 = document.getElementById("smiley1");
    #imgFigStar0 = document.getElementById("star0");
    #imgFigStar1 = document.getElementById("star1");
    #imgFig;

    /// <summary>
    /// default constructor
    /// </summary>
    constructor() {
        // Field.SetDescription();            // IT game field

        // set images
        this.#imgDice = [ this.#imgDice0, this.#imgDice1 ];

        this.#imgFig = [
            [ this.#imgFigBall0, this.#imgFigBall1 ],
            [ this.#imgFigPoint0, this.#imgFigPoint1 ],
            [ this.#imgFigSmiley0, this.#imgFigSmiley1 ],
            [ this.#imgFigStar0, this.#imgFigStar1 ]
        ];

        this.#OnPaint();
        this.#menu = new Menu(this.#context.canvas.width, this);
        this.#CheckDiceRoll();

        document.getElementById("game").onmousedown = this.#OnMouseDown;
    }

    /// <summary>
    /// set toolbar icons according to settings
    /// </summary>
    #CheckFigure() {
        const fig = parseInt(localStorage.getItem("Figure")) ?? 0;
        this.#menu.SetCheck("ball", fig == 0);
        this.#menu.SetCheck("point", fig == 1);
        this.#menu.SetCheck("smiley", fig == 2);
        this.#menu.SetCheck("star", fig == 3);
    }
    
    /// <summary>
    /// check toolbar icons according to settings
    /// </summary>
    #CheckDiceRoll() {
        const dice = parseInt(localStorage.getItem("MaxDice")) ?? 6;
        this.#menu.SetCheck("dice6", dice == 6);
        this.#menu.SetCheck("dice7", dice == 7);
        this.#menu.SetCheck("dice8", dice == 8);
        this.#menu.SetCheck("dice9", dice == 9);
    }

    /// <summary>
    /// initialize game
    /// </summary>
    #InitGame() {
        this._init = true;
        var ps = localStorage.getItem("Players") ?? "1,1,1,1";
        var players = Array.from(ps.split(',').entries().map( p => p[1] == "1" ? p[0] : -1));
        this.#game.SetPlayers(players);

        for (var p of this.#game.Players)
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
        console.log("SetFigure", p, f, select);

        const fig = parseInt(localStorage.getItem("Figure") ?? 0);
        const img = this.#imgFig[fig][select ? 1 : 0];
     
        GameInternal.DrawFigure(img, this.#context, f.Position, p.Index);
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
        const fd = f.Data;
        if( fd != null) {
            const img = this.#imgFig[0][0];
            GameInternal.DeleteFigure(this.#imgField, img, this.#context, f.Position);
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
        console.log("SetFigures", figures, select);

        this.FiguresToSelect = select;

        if (figures == null) {
            for (var f of this.#game.Player.Figures)
                this.#SetFigure(this.#game.Player, f, select);
        } else {
            for (var f of figures)
                this.#SetFigure(this.#game.Player, f, select);
        }
    }

    /// <summary>
    /// delete figures of current player
    /// </summary>
    /// <param name="figures">
    /// figures to delete. null, delete all figures of current player.
    /// </param>
    #DeleteFigures( figures = null) {
        console.log("DeleteFigures", figures);

        if (figures == null) {
            for (var f of this.game.Player.Figures)
                this.#DeleteFigure(this.#game.Player, f);
        } else {
            for (var f of figures)
                this.#DeleteFigure(this.#game.Player, f);
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
    /// <param name="x,y">
    /// mouse position
    /// </param>
    /// <returns>
    /// figure, null if no figure is selected
    /// </returns>
    #GetFigure(figures, x,y) {
        if (this.FiguresToSelect && figures != null) {
            const sz = this.#imgFig[0][0];
            for (var f of figures) {
                const pos = f.Position;
                const size = this.#imgFig[0][0].height;
                const rect = new Rectangle( pos.x - size / 2, pos.y - size / 2, size, size);
                console.log("GetFigure", rect);
                if( rect.contains(x,y))
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
        if (p == null || dice == 0)
            return;

        const img = this.#imgDice[select ? 1 : 0];
        this.DiceToSelect = select;

        GameInternal.DrawDice(img, this.#context, p.FieldPlayer.diceroll, dice - 1);
/*
        if (select) {
            var name = GameInternal.GetPlayerName(p);
            this.tssGame.Text = string.Format("{0}: roll dice.", name);
        }
        else
            this.tssGame.Text = string.Empty;
*/
    }

    /// <summary>
    /// delete the dice from field
    /// </summary>
    /// <param name="p">
    /// player to delete the dice for.
    /// </param>
    #DeleteDice(p) {
        GameInternal.DeleteDice(this.#imgField, this.#imgDice[0], this.#context, p.FieldPlayer.diceroll);
    }

    /// <summary>
    /// determine if point is in dice.
    /// </summary>
    /// <param name="p">
    /// current player.
    /// </param>
    /// <param name="x,y">
    /// point in screen coordinates.
    /// </param>
    /// <returns>
    /// point is in dice.
    /// </returns>
    #IsDice(p, x, y) {
        var ret = false;
        if (this.DiceToSelect) {
            const pos = p.FieldPlayer.diceroll;
            const size = this.#imgDice1.height;
            const rect = new Rectangle( pos.x - size / 2, pos.y - size / 2, size, size);
            console.log("IsDice", rect);
            ret = rect.contains(x,y);
        }
        console.log("IsDice", ret, x,y);
        return ret;
    }

    /// <summary>
    /// roll the dice with random generator.
    /// </summary>
    /// <returns>
    /// number of dice pips.
    /// </returns>
    #RollDice() {
        const max = localStorage.getItem("MaxDice") ?? 6;
        return Math.floor(Math.random() * max + 1);
    }

    /// <summary>
    /// set or delete parking zones in field.
    /// </summary>
    /// <param name="l">
    /// list of parking coordinates.
    /// </param>
    /// <param name="p">
    /// parking flag.
    /// </param>
    OnParking(l,p) {
        console.log("OnParking", l,p);

        var size = this.#imgParking.Size;
        if (p)          // set parking zones
        {
            this.backGroundPark = new Bitmap[e.positions.Length];
            var i = 0;
            for (var rect of e.positions.Select(pos => fp.CalcPosition(size, pos)))
            {
                this.backGroundPark[i++] = GameInternal.GetBackGround(rect, this.bitmapGame);
                GameInternal.DrawParking(this.#imgParking, rect, tscGame.ContentPanel, this.bitmapGame);
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

                this.#DisposePark();
            }
        }
    }

    /// <summary>
    /// erase parking backgound
    /// </summary>
    #DisposePark() {
        if( !!this.backGroundPark) {
            for (var park of this.backGroundPark)
                park.Dispose();

            this.backGroundPark = null;
        }
    }

    /// <summary>
    /// event functions while tracking figure.
    /// </summary>
    /// <param name="p">
    /// game player
    /// </param>
    /// <param name="f">
    /// figure to handle
    /// </param>
    /// <param name="a">
    /// action to do
    /// </param>
    async OnFigure(p,f,a) {
        console.log( "OnFigure", p, f, a);

        switch (a) {
            case Game.FigureAction.Init:
                f.Data = new FigureData();
                break;

            case Game.FigureAction.Set:
                this.#SetFigure(p, f);
                if (!this._init && this.#menu.GetCheck("sound"))
                    if (f.InField && f.TrackNumber == 0)
                        this.#sndStart.play();
                break;

            case Game.FigureAction.Delete:
                this.#DeleteFigure(p, f);
                break;

            case Game.FigureAction.Delay:
                if (!this._init) {
                    if (this.#menu.GetCheck("sound"))
                        this.#sndMove.play();

                    await Globals.sleep(300);                    
                }
                break;

            case Game.FigureAction.Defeated:
                if (!this._init && this.#menu.GetCheck("sound"))
                    this.#sndDefeat.play();
                break;
        }
    }

    /// <summary>
    /// game finished
    /// </summary>
    /// <param name="p">
    /// player finished
    /// </param>
    OnFinished(p) {

    }

    /*
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
        this.#DisposeDice();
        this.#DisposeFigures();
        this.#DisposePark();

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
    */

    #OnPaint() {
        console.log("OnPaint");

        const g = document.getElementById("game");
        this.#context = g.getContext("2d");
        GameInternal.DrawField(this.#imgField, this.#context);

        const park = (localStorage.getItem("Parking") ?? "false") == "true";
        this.#game.SetFigures();
        this.#game.SetParking(park);
        this.#SetDice(this.#game.Player, this.Dice, true);
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
    #OnMouseDown = (e) => {
        console.log("OnMouseDown", e, this);

        var hit = false;

        if (this.#game.Player == null)
            return;

        const pd = this.#game.Player.Data; // PlayerData;
        if (pd == null)
            return;

        const name = GameInternal.GetPlayerName(this.#game.Player);

        if (this.#IsDice(this.#game.Player, e.offsetX, e.offsetY)) {
            hit = true;

            this.Dice = this.#RollDice();
            this.#DeleteDice(this.#game.Player);
            this.#SetDice(this.#game.Player, this.Dice);

            if (this.#menu.GetCheck("sound"))
                this.#sndDice.play();

            const res = this.#game.EvalDiceRoll(this.Dice);
            if (res.ft != null)    // figure already has been tracked
            {
                pd.Figures = res.ft;

                if (pd.Figures.length == 0) {
                    if( this.#menu.GetCheck("dice3") && game.CheckCorner()) {
                        pd.NumRolls++;
                        if (pd.NumRolls < 3)
                        {
                            this.#DeleteDice(this.#game.Player);
                            this.#SetDice(this.#game.Player, this.Dice, true);
                            return;
                        }
                    }
                } else if (pd.Figures.length == 1) {
                    var f = pd.Figures[0];
                    // this.tssGame.Text = string.Format("{0}: track figure {1}.", name, f.Number);
                    this.#game.TrackFigure(f, this.Dice);
                } else {
                    // set figures to select
                    this.#DeleteFigures(pd.Figures);
                    this.#SetFigures(pd.Figures, true);
                    // this.tssGame.Text = string.Format("{0}: select figure to track.", name);

                    hit = false;
                }
            }
        } else {
            const f = this.#GetFigure(pd.Figures, e.offsetX, e.offsetY);
            if (f != null) {
                hit = true;
                this.#DeleteFigures(pd.Figures);
                this.#SetFigures(pd.Figures);
                this.tssGame.Text = string.Empty;

                // this.tssGame.Text = string.Format("{0}: track figure {1}.", name, f.Number);
                this.#game.TrackFigure(f, this.Dice);
            }
        }

        if (hit) {
            pd.NumRolls = 0;

            this.#DeleteDice(this.#game.Player);

            if (this.Dice == 6)
                this.#SetDice(this.#game.Player, this.Dice, true);
            else {
                if (!this.#game.SelectPlayer()) {
                    // this.tssGame.Text = "Game finished!";
                    this.#PrintRanking();
                } else
                    this.#SetDice(this.#game.Player, this.Dice, true);
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
    OnMenu(n) {
        console.log("OnMenu", n);

        switch(n) {
            case "new": {
                this.#InitGame();

                this.#game.SelectPlayer(true);
                this.Dice = this.#RollDice();
                this.#OnPaint();
            }
            break;

            case "player": {
                if( GameInternal.SelectPlayers())
                    this.#InitGame();
            }
            break;

            case "ranking": {
                this.#PrintRanking();
            }
            break;

            case "dice6": {
                localStorage.setItem("MaxDice", 6);
                this.#CheckDiceRoll();
            }
            break;

            case "dice7": {
                localStorage.setItem("MaxDice", 7);
                this.#CheckDiceRoll();
            }
            break;

            case "dice8": {
                localStorage.setItem("MaxDice", 8);
                this.#CheckDiceRoll();
            }
            break;

            case "dice9": {
                localStorage.setItem("MaxDice", 9);
                this.#CheckDiceRoll();
            }
            break;

            case "force" : {
                const c = !this.#menu.GetCheck(n);
                this.#menu.SetCheck(n, c)
                localStorage.setItem("ForceDefeat", c);
                this.#game.ForceDefeat = c;
            }
            break;

            case "dice3": {
                const c = !this.#menu.GetCheck(n);
                this.#menu.SetCheck(n, c)
                localStorage.setItem("Dice3", c);
            }
            break;

            case "jump": {
                const c = !this.#menu.GetCheck(n);
                this.#menu.SetCheck(n, c)
                localStorage.setItem("Jump", c);
                this.#game.JumpHouse = c;
            }
            break;

            case "parking": {
                const c = !this.#menu.GetCheck(n);
                this.#menu.SetCheck(n, c)
                localStorage.setItem("Parking", c);
            }
            break;

            case "sound": {
                const c = !this.#menu.GetCheck(n);
                this.#menu.SetCheck(n, c)
                localStorage.setItem("Sound", c);
            }
            break;

            case "ball": {
                localStorage.setItem("Figure", 0);
                this.#CheckFigure();
            }
            break;

            case "point": {
                localStorage.setItem("Figure", 1);
                this.#CheckFigure();
            }
            break;

            case "smiley": {
                localStorage.setItem("Figure", 2);
                this.#CheckFigure();
            }
            break;

            case "star": {
                localStorage.setItem("Figure", 3);
                this.#CheckFigure();
            }
            break;
        }
    }

    /// <summary>
    /// print ranking dialog
    /// </summary>
    #PrintRanking()
    {
        const rank = this.#game.GetRanking();
        GameInternal.PrintRanking(rank, this);
    }
};

// --- end of file ---
