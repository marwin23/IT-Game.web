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

    constructor() {
        this.NumRolls = 0;
        this.Figures = null;
    }
};

/// <summary>
/// additional data of figure
/// </summary>
class FigureData
{
    /// <summary>
    /// background of the figure
    /// </summary>
    dummy;
};

/// <summary>
/// canvas of the menu
/// </summary>
class Menu {
    #images = [
        { n: "player", x: 0 },
        { n: "new", x: 20 },
        { n: "ranking", x: 40 },
        { n: "force", x: 60 },
        { n: "jump", x: 80 },
        { n: "dice3", x: 100 },
        { n: "sound", x: 120 },

        { n: "dice6", x: 150 },
        { n: "dice7", x: 170 },
        { n: "dice8", x: 190 },
        { n: "dice9", x: 210 },

        { n: "ball", x: 240 },
        { n: "point", x: 260 },
        { n: "smiley", x: 280 },
        { n: "star", x: 300 },

    ];

    #storage = [
        { n: "Players", d: "1,1,1,1" },
        { n: "Orange", d: "orange" },
        { n: "Yellow", d: "yellow" },
        { n: "Green", d: "green" },
        { n: "Blue", d: "blue" },

        { n: "Force",  d: false },
        { n: "Parking", d: true },
        { n: "Jump", d: false },
        { n: "Sound", d: true },
        { n: "MaxDice", d: 6 },
        { n: "Dice3", d: true },
        { n: "Figure", d: 0 }
    ];

    #game;
    #back;
    #color;

    /// <summary>
    /// return menu name selected.
    /// </summary>
    #CheckPoint(x,y) {
        console.log( "CheckPoint", x,y);

        for( const image of this.#images) {
            const r = new Rectangle(image.x, 2, 16, 16);
            if( r.contains( x, y)) {
                return image.n;
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
        mctx.globalAlpha = 1.0;

        for( var image of this.#images) {
            if(n === image.n) {
                mctx.strokeStyle = b ? this.#color : this.#back;
                mctx.lineWidth = 2;
                mctx.strokeRect( image.x -1, 1, 18, 18);

                image.c = b;
                break;
            }
        }
    }

    /// <summary>
    /// get check menu item
    /// </summary>
    GetCheck(n) {
        var r = false;
        for( const image of this.#images) {
            if(n === image.n) {
                r = image.c ?? false;
                break;
            }
        }
        console.log("GetCheck", n, r);
        return r;
    }

    constructor(g,c,b) {
        this.#InitStorage();

        const m = document.getElementById("menu");
        const mctx = m.getContext("2d");

        mctx.canvas.width = 400;
        mctx.canvas.height = 20;
        // mctx.scale(1.2,1.0);

        for( const image of this.#images) {
            var icon = document.getElementById(image.n);
            console.log( "Menu icon", icon.n);
            mctx.drawImage( icon, image.x, 2, icon.width, icon.height);
        }

        this.#game = g;
        this.#color = c;
        this.#back = b;
        m.onclick = this.#handleClick;
    }

    #handleClick = (ev) => {
        const n = this.#CheckPoint(ev.offsetX,ev.offsetY);
        if( !!n)
            this.#game.OnMenu(n);
    };

    #InitStorage() {
        // localStorage.clear();   // TEST

        for( const s of this.#storage) {
            localStorage.setItem(s.n, localStorage.getItem(s.n) ?? s.d);
        }
    }
};

/// <summary>
/// canvas of the game
/// </summary>
class Canvas {
    #game = new Game(this);
    #menu;      // menu canvas
    #context;   // context of canvas
    #id;        // id for timer event

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
    
    #canvas = document.getElementById("game");
    #text = document.getElementById("text");
    #color;         // foreground color
    #back;          // blackground color

    /// <summary>
    /// default constructor
    /// </summary>
    constructor() {
        this._init = true;
        // Field.SetDescription();            // IT game field

        // set images
        this.#imgDice = [ this.#imgDice0, this.#imgDice1 ];

        this.#imgFig = [
            [ this.#imgFigBall0, this.#imgFigBall1 ],
            [ this.#imgFigPoint0, this.#imgFigPoint1 ],
            [ this.#imgFigSmiley0, this.#imgFigSmiley1 ],
            [ this.#imgFigStar0, this.#imgFigStar1 ]
        ];

        // colors
        this.#color = window.getComputedStyle( document.body ,null).getPropertyValue('color');
        this.#back = window.getComputedStyle( document.body ,null).getPropertyValue('background-color');

        this.#OnPaint();
        this.#context.scale(2,2);
        this.#menu = new Menu(this, this.#color, this.#back);

        this.#game.ForceDefeat = localStorage.getItem("Force") == "true";
        this.#game.Parking = localStorage.getItem("Parking") == "true";
        this.#game.JumpHouse = localStorage.getItem("Jump") == "true";

        this.#menu.SetCheck("new", false);
        this.#menu.SetCheck("force", this.#game.ForceDefeat);
        this.#menu.SetCheck("jump", this.#game.JumpHouse);
        this.#menu.SetCheck("dice3", localStorage.getItem("Dice3") == "true");
        this.#menu.SetCheck("sound", localStorage.getItem("Sound") == "true");

        document.getElementById("game").onmousedown = this.#OnMouseDown;
        this.#CheckFigure();
        this.#CheckDiceRoll();
        this._init = false;

        this.#OnPaint();
    }

    /// <summary>
    /// set toolbar icons according to settings
    /// </summary>
    #CheckFigure() {
        const fig = parseInt(localStorage.getItem("Figure"));
        this.#menu.SetCheck("ball", fig == 0);
        this.#menu.SetCheck("point", fig == 1);
        this.#menu.SetCheck("smiley", fig == 2);
        this.#menu.SetCheck("star", fig == 3);
        this.#OnPaint();
    }
    
    /// <summary>
    /// check toolbar icons according to settings
    /// </summary>
    #CheckDiceRoll() {
        const dice = parseInt(localStorage.getItem("MaxDice"));
        this.#menu.SetCheck("dice6", dice == 6);
        this.#menu.SetCheck("dice7", dice == 7);
        this.#menu.SetCheck("dice8", dice == 8);
        this.#menu.SetCheck("dice9", dice == 9);
    }

    /// <summary>
    /// initialize game
    /// </summary>
    #InitGame() {
        console.log("InitGame 1");

        this._init = true;
        const ps = localStorage.getItem("Players");
        this.#game.SetPlayers(ps);

        for (var p of this.#game.Players)
            p.Data = new PlayerData();

        this.#menu.SetCheck("new", true);
        this._init = false;

        console.log("InitGame 2", ps);

        document.body.onbeforeunload = () => { return true; };
    }

    /// <summary>
    /// initialize game
    /// </summary>
    #ShutGame() {
        document.body.onbeforeunload = null;
        clearTimeout(this.#id);
        this.#id = null;
        this.#menu.SetCheck("new", false);
        this.#game.SetPlayers(null);
        this.Dice = 0;
        this.#text.innerText = "---";
        this.#OnPaint();
    };
    
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

        const fig = parseInt(localStorage.getItem("Figure"));
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
            for (var f of this.#game.Player.Figures)
                this.#DeleteFigure(this.#game.Player, f);
        } else {
            for (var f of figures)
                this.#DeleteFigure(this.#game.Player, f);
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
        if (select) {
            var name = GameInternal.GetPlayerName(p);
            this.#text.innerText = `${name}: roll dice.`;
        }
        else
            this.#text.innerText = "---";
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
        const max = localStorage.getItem("MaxDice");
        return Math.floor(Math.random() * max + 1);
    }

    /// <summary>
    /// check rolling dice.
    /// </summary>
    async #EvalDiceRoll() {
        var hit = true;

        if (this.#game.Player == null)
            return;

        const pd = this.#game.Player.Data; // PlayerData;
        if (pd == null)
            return;

        const name = GameInternal.GetPlayerName(this.#game.Player);
        const sound = this.#menu.GetCheck("sound");

        this.Dice = this.#RollDice();
        // this.#DeleteDice(this.#game.Player);
        this.#SetDice(this.#game.Player, this.Dice, false);
        await Globals.play(sound ? this.#sndDice : null);

        const res = await this.#game.EvalDiceRoll(this.Dice);
        if (res.ft != null)    // figure already has been tracked
        {
            pd.Figures = res.ft;

            if (pd.Figures.length == 0) {
                if( this.#menu.GetCheck("dice3") && this.#game.CheckCorner()) {
                    pd.NumRolls++;
                    console.log("NumRolls", pd.NumRolls);
                    if (pd.NumRolls < 3)
                    {
                        // this.#DeleteDice(this.#game.Player);
                        this.#SetDice(this.#game.Player, this.Dice, true);

                        if( this.#game.Player.Strategy > GamePlayer.StrategyDefinition.Manual) {
                            this.#id = setTimeout( this.#OnTime, 500);
                        }
                        return;
                    }
                }
            } else if (pd.Figures.length == 1) {
                const f = pd.Figures[0];
                this.#text.innerText = `${name}: track figure ${f.Number}.`;
                await this.#game.TrackFigure(f, this.Dice);
            } else {
                // computer plays
                if( this.#game.Player.Strategy > GamePlayer.StrategyDefinition.Manual) {
                    const f = pd.Figures[0];
                    this.#text.innerText = `${name}: track figure ${f.Number}.`;
                    await this.#game.TrackFigure(f, this.Dice);
                } else {
                    // set figures to select
                    this.#DeleteFigures(pd.Figures);
                    this.#SetFigures(pd.Figures, true);
                    this.#text.innerText = `${name}: select figure to be tracked.`

                    hit = false;
                }
            }
        }

        return hit;
    }

    /// <summary>
    /// select next player
    /// </summary>
    #NextPlayer() {
        var next = true;

        if (this.#game.Player == null)
            return;

        const pd = this.#game.Player.Data; // PlayerData;
        if (pd == null)
            return;

        pd.NumRolls = 0;
        this.#id = null;

        this.#DeleteDice(this.#game.Player);

        if (this.Dice == 6)
            this.#SetDice(this.#game.Player, this.Dice, true);
        else {
            // next player
            if (!this.#game.SelectPlayer()) {
                this.#text.innerText = "Game finished!";
                this.#PrintRanking();
                this.#ShutGame();
                next = false;
            } else {
                this.#SetDice(this.#game.Player, this.Dice, true);
            }
        }

        if( next) {
            // computer plays
            if( this.#game.Player.Strategy > GamePlayer.StrategyDefinition.Manual) {
                this.#id = setTimeout( this.#OnTime, 0);
            }
        }
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

        if (p) {          // set parking zones
            for( const c of l)
                GameInternal.DrawParking(this.#imgParking, this.#context, c);
        } else {           // delete parking zones
            for( const c of l)
                GameInternal.DeleteParking(this.#imgField, this.#imgParking, this.#context, c);
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

        const sound = this.#menu.GetCheck("sound");

        switch (a) {
            case Game.FigureAction.Init:
                f.Data = new FigureData();
                break;

            case Game.FigureAction.Set:
                this.#SetFigure(p, f);
                break;

            case Game.FigureAction.Start:
                if (!this._init && sound)
                    await Globals.play(this.#sndStart);
                break;

            case Game.FigureAction.Delete:
                this.#DeleteFigure(p, f);
                break;

            case Game.FigureAction.Track:
                Globals.sleep(0);   // update

                if (!this._init) {
                    await Globals.play(sound ? this.#sndMove : null);
                }
                break;

            case Game.FigureAction.Defeated:
                if (!this._init && sound)
                    await Globals.play(this.#sndDefeat);
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
        /*
        if( p == null)
            this.#ShutGame();
        */
    }

    #OnPaint() {
        console.log("OnPaint");

        if( this._init) {
            this.#context = this.#canvas.getContext("2d");
        } else {
            GameInternal.DrawField(this.#imgField, this.#context);

            const park = localStorage.getItem("Parking") === "true";
            this.#game.SetFigures();
            this.#game.SetParking(park);
            this.#SetDice(this.#game.Player, this.Dice, true);
        }
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
    #OnMouseDown = async(e) => {
        var hit = false;
        console.log("OnMouseDown", e, this);

        if( this.#id != null)
            return;

        if (this.#game.Player == null)
            return;

        const pd = this.#game.Player.Data; // PlayerData;
        if (pd == null)
            return;

        const name = GameInternal.GetPlayerName(this.#game.Player);

        if (this.#IsDice(this.#game.Player, e.offsetX, e.offsetY)) {
            hit = await this.#EvalDiceRoll();
        } else {
            const f = this.#GetFigure(pd.Figures, e.offsetX, e.offsetY);
            if (f != null) {
                hit = true;
                this.#DeleteFigures(pd.Figures);
                this.#SetFigures(pd.Figures);

                this.#text.innerText = `${name}: track figure ${f.Number}.`;
                await this.#game.TrackFigure(f, this.Dice);
            }
        }

        if (hit) {
            this.#NextPlayer();
        }
    }

    /// <summary>
    /// automatic dice on on computer plays
    /// </summary>
    #OnTime = async(e) => {
        console.log("OnMouseDown", e, this);

        clearTimeout(this.#id);
        this.#id == null;

        if( await this.#EvalDiceRoll())
           this.#NextPlayer();
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
                if( !this.#menu.GetCheck("new")) {
                    this.#InitGame();

                    this.#game.SelectPlayer(true);
                    this.Dice = this.#RollDice();
                    this.#OnPaint();

                    // computer plays
                    if( this.#game.Player != null && 
                        this.#game.Player.Strategy > GamePlayer.StrategyDefinition.Manual) {
                        this.#id = setTimeout( this.#OnTime, 0);
                    }
                } else {
                    GameInternal.QueryStop( () => { this.#ShutGame() });
                }
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
    #PrintRanking() {
        const rank = this.#game.GetRanking();
        GameInternal.PrintRanking(rank);
    }
};

// --- end of file ---
