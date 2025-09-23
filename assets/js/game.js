/// <summary>
/// position in field
/// </summary>
class GamePoint {
    /// <summary>
    /// constructor of position or copy
    /// </summary>
    /// <param name="x">
    /// column or point
    /// </param>
    /// <param name="y">
    /// row or undefined
    /// </param>S
    constructor(x, y) {
        if( y == null) {
            const p = x;
            this.x = p.x;
            this.y = p.y;
        } else {
            this.x = x;
            this.y = y;
        }
    }

    /// <summary>
    /// current column of point
    /// </summary>
    x;

    /// <summary>
    /// current row
    /// </summary>
    y;

    /// <summary>
    /// check if two points are equal
    /// </summary>
    /// <param name="a">
    /// point 1
    /// </param>
    /// <param name="b">
    /// point 2
    /// </param>
    /// <returns>
    /// point 1 == point 2
    /// </returns>
    static Equals(a, b) {
        return a != null && b != null && 
               a.x == b.x && a.y == b.y;
    }
};

/// <summary>
/// figure on the game
/// </summary>
class GameFigure {
    /// <summary>
    /// construct figure for player
    /// or create test figure
    /// </summary>
    /// <param name="p">
    /// player to determine color
    /// </param>
    /// <param name="x">
    /// number of figure,
    /// column of the position
    /// </param>
    /// <param name="y">
    /// row of the position
    /// </param>
    constructor(p, x, y) {
        if( y == null) {
            if( x == null) {
                const f = p;
                this.Player = f.Player;         // just copy reference
                this.Number = f.Number;
                this.Position = new GamePoint(f.Position);
                this.TrackNumber = f.TrackNumber;
                this.InField = f.InField;
                this.InHouse = f.InHouse;

                this.GameIndex = f.GameIndex;
                this.HasSet = f.HasSet;
                this.Data = f.Data;
            } else {
                this.Player = p;
                this.Number = x;
                this.HasSet = false;
            }
            this.Test = false;
        } else {
            this.Player = p;
            this.Position = new GamePoint(x,y);
            this.Test = true;
            this.HasSet = false;
        }
    }

    /// <summary>
    /// test figure, avoid invoking events
    /// </summary>
    Test;

    /// <summary>
    /// owner player for the figure
    /// </summary>
    Player;

    /// <summary>
    /// number (1-GameMaxFigure)
    /// </summary>
    Number;

    /// <summary>
    /// current position
    /// </summary>
    Position;

    /// <summary>
    /// number of fields the figure has tracked
    /// </summary>
    TrackNumber;

    /// <summary>
    /// figure is in the field
    /// </summary>
    InField;

    /// <summary>
    /// figure is in the house
    /// </summary>
    InHouse;

    /// <summary>
    /// index of field position or house
    /// </summary>
    GameIndex;

    /// <summary>
    /// figure has been set
    /// </summary>
    HasSet;

    /// <summary>
    /// user data for figure
    /// </summary>
    Data;

    /// <summary>
    /// check if two figures have the same color
    /// </summary>
    /// <param name="f1">first figure</param>
    /// <param name="f2">second figure</param>
    /// <returns>equal color</returns>
    static HaveSameColor(f1, f2) {
        return Player.Equals(f1.Player.FieldPlayer, f2.Player.FieldPlayer);
    }

    /// <summary>
    /// check if two game figures are equal
    /// </summary>
    /// <param name="a">
    /// figure 1
    /// </param>
    /// <param name="b">
    /// figure 2
    /// </param>
    /// <returns>
    /// figure 1 == figure 2
    /// </returns>
    static Equals(a, b) {
        if (a == null || b == null)
            return false;

        if (a.Player != null && b.Player != null) {
            // ignore myself
            if (a.Number == b.Number &&
                GameFigure.HaveSameColor(a, b))
                return false;
        }

        if (GamePoint.Equals(a.Position, b.Position))
            return true;

        return false;
    }

    /// <summary>
    /// check if game figures are equal
    /// </summary>
    /// <param name="f">
    /// figure
    /// </param>
    Equals(f) {
        return GameFigure.Equals(this,f);
    }

    /// <summary>
    /// check if figure is at parking position
    /// </summary>
    /// <returns>
    /// figure is at parking position
    /// </returns>
    CheckParking() {
        for (const index of Field.FieldDescription.parking) {
            const pos = Field.FieldDescription.positions[index];
            console.log("CheckParking", pos, this.Position);
            if (GamePoint.Equals(this.Position, new GamePoint(pos)))
                return true;
        }

        return false;
    }

    /// <summary>
    /// check if figure at a start field
    /// </summary>
    /// <remarks>
    /// use for the text version
    /// </remarks>
    /// <param name="all">
    /// support all start field
    /// </param>
    /// <returns>
    /// figure is at the start field
    /// </returns>
    CheckStart(all = false) {
        if (all) {
            for (const p of Field.FieldDescription.players) {
                const pos = Field.FieldDescription.positions[p.start];
                if (GamePoint.Equals(this.Position, new GamePoint(pos)))
                    return true;
            }
        } else {
            const p = this.Player.FieldPlayer;
            const pos = Field.FieldDescription.positions[p.start];
            if (GamePoint.Equals(this.Position, new GamePoint(pos)))
                return true;
        }

        return false;
    }

    /// <summary>
    /// set figure to start position
    /// </summary>
    SetStart() {
        if (this.Player.FieldPlayer != null) {
            this.GameIndex = this.Player.FieldPlayer.start;
            this.Position = new GamePoint(Field.FieldDescription.positions[this.GameIndex]);
        }

        this.InField = true;
        this.TrackNumber = 0;

        console.log("SetStart", this);
    }

    /// <summary>
    /// set figure to corner position
    /// </summary>
    SetCorner() {
        if (this.Player.FieldPlayer != null)
            this.Position = new GamePoint(this.Player.FieldPlayer.figure[this.Number - 1]);

        this.InField = false;
        this.InHouse = false;
        this.TrackNumber = 0;

        console.log("SetCorner", this);
    }

    /// <summary>
    /// figure is defeated
    /// </summary>
    Defeated() {
        if (!this.Test)
            this.Player.Game.Canvas.OnFigure(this.Player, this, Game.FigureAction.Defeated);

        this.SetCorner();
    }

    /// <summary>
    /// track figure by 1 position
    /// </summary>
    /// <remarks>
    /// the figure is tracking if there is another figure at the next position
    /// </remarks>
    /// <returns>
    /// figure tracked
    /// </returns>
    Track() {
        if (!this.InField)          // figure at the corner
            return false;

        if (this.InHouse) {         // figure in the house
            // figure at the end of the house
            if (this.GameIndex == this.Player.FieldPlayer.house.length - 1)
                return false;

            this.Position = new GamePoint(this.Player.FieldPlayer.house[++this.GameIndex]);
        } else {                    // figure in the field
            // figure is ahead the house
            if (this.GameIndex == this.Player.FieldPlayer.Hahead) {  
                this.InHouse = true;
                this.GameIndex = 0;
                this.Position = new GamePoint(this.Player.FieldPlayer.house[this.GameIndex]);
            } else {
                this.GameIndex++;   // track figure
                if (this.GameIndex == Field.FieldDescription.positions.length)
                    this.GameIndex = 0;

                this.Position = new GamePoint(Field.FieldDescription.positions[this.GameIndex]);
            }
        }

        this.TrackNumber++;
        return true;                // figure tracked
    }

    /// <summary>
    /// set figure on the field
    /// </summary>
    /// <returns>
    /// figure has not been set before
    /// </returns>
    async Set() {
        console.log("Set", this.HasSet);

        const bSet = this.HasSet;
        this.HasSet = true;

        if (!this.Test) {
            this.Player.Game.Canvas.OnFigure(this.Player, this, Game.FigureAction.Set);
            if( this.InField && this.TrackNumber == 0)
                await this.Player.Game.Canvas.OnFigure(this.Player, this, Game.FigureAction.Start);
        }

        return !bSet;
    }

    /// <summary>
    /// delete figure from the field
    /// </summary>
    /// <returns>
    /// figure has been set before
    /// </returns>
    Delete() {
        const bSet = this.HasSet;
        this.HasSet = false;

        if (!this.Test)
            this.Player.Game.Canvas.OnFigure(this.Player, this, Game.FigureAction.Delete);

        return bSet;
    }
}

/// <summary>
/// player if of game
/// </summary>
class GamePlayer
{
    /// <summary>
    /// strategy for tracking figure
    /// </summary>
    static StrategyDefinition = Object.freeze({
        /// <summary>
        /// player is choosing
        /// </summary>
        Manual: 0,

        /// <summary>
        /// track one figure as far as possible
        /// </summary>
        One: 1,

        /// <summary>
        /// track all figures as far as possible
        /// </summary>
        All: 2
    });

    /// <summary>
    /// init player and
    /// copy constructor of player
    /// </summary>
    /// <param name="game">
    /// game, or playser
    /// </param>
    /// <param name="player">
    /// player index in field
    /// </param>
    constructor(game, player) {
        if( player == null) {
            console.log( "GamePlayer", game);
            const p = game;
            this.Game = p.Game;
            this.FieldPlayer = p.FieldPlayer;   // just copy reference
            this.Name = p.Name;
            this.Data = p.Data;

            this.Ranking = this.Ranking;
            this.Figures = p.Figures.filter(f => new GameFigure(f));
            this.Strategy = p.Strategy;
        } else {
            const l = Field.GameMaxPlayer();
            if (player >= 0 && player < l) {
                this.FieldPlayer = Field.FieldDescription.players[player];
                this.Name = this.FieldPlayer.color;
                this.Index = player;
            }

            this.Game = game;
            this.Strategy = GamePlayer.StrategyDefinition.Manual;
            this.CreateFigures();

            console.log( "GamePlayer", l, this);
        }
    }

    /// <summary>
    /// place figures on the field
    /// </summary>
    CreateFigures() {
        this.Figures = new Array();     // Field.GameMaxFigure
        for (var n = 1; n <= Field.GameMaxFigure; n++) {
            const f = new GameFigure(this, n);
            this.Game.Canvas.OnFigure(this, f, Game.FigureAction.Init);
            this.Figures.push(f);
        }

        console.log("CreateFigures");
    }

    /// <summary>
    /// check if two player have the same color
    /// </summary>
    /// <param name="p1">first player</param>
    /// <param name="p2">second player</param>
    /// <returns>
    /// player are equal
    /// </returns>
    static HaveSameColor(p1, p2) {
        console.log("HaveSameColor", p1.FieldPlayer, p2.FieldPlayer);
        return Player.Equals(p1.FieldPlayer, p2.FieldPlayer);
    }

    /// <summary>
    /// check if two players are equal
    /// </summary>
    /// <param name="a">
    /// first player
    /// </param>
    /// <param name="b">
    /// second player
    /// </param>
    /// <returns>
    /// players are equal
    /// </returns>
    static Equals(a, b) {
        if (!a || !b)
            return false;

        return a == b || GamePlayer.HaveSameColor(a, b);
    };

    /// <summary>
    /// check if players are equal
    /// </summary>
    /// <param name="a">
    /// player to compare
    /// </param>
    /// <returns>
    /// players are equal
    /// </returns>
    Equals(p) {
        return GamePlayer.Equals(this,p);
    };
    
    /// <summary>
    /// game where the player belongs to
    /// </summary>
    Game;

    /// <summary>
    /// field player where the player belongs to
    /// </summary>
    FieldPlayer;

    /// <summary>
    /// current player index in the field
    /// </summary>
    Index;

    /// <summary>
    /// name of player
    /// </summary>
    Name;

    /// <summary>
    /// user data
    /// </summary>
    Data;

    /// <summary>
    /// figures of the player
    /// </summary>
    // public List<GameFigure> Figures { get; private set; }
    Figures;

    /// <summary>
    /// ranking of the player
    /// </summary>
    Ranking;

    /// <summary>
    /// tracking strategy of the player
    /// </summary>
    Strategy;

    /// <summary>
    /// get figure by number
    /// </summary>
    /// <param name="number">
    /// number of figure
    /// </param>
    /// <returns>
    /// figure found
    /// </returns>
    GetFigure(number) {
        return this.Figures.find(f => f.Number == number);
    }

    /// <summary>
    /// set all figures into the field
    /// </summary>
    SetFigures() {
        console.log("SetFigures", this.Figures);

        for(var fig of this.Figures)
            fig.Set();
    }

    /// <summary>
    /// delete all figures from the field
    /// </summary>
    DeleteFigures() {
        for (var fig of this.Figures)
            fig.Delete();
    }

    /// <summary>
    /// set all figures into corner
    /// </summary>
    /// <param name="force">
    /// also set figure that not in the field
    /// </param>
    SetFiguresToCorner(force = false) {
        console.log("SetFiguresToCorner", force);

        if (force) {
            for(var fig of this.Figures)
                fig.SetCorner();
        } else {
            for(var fig of this.Figures.filter(f => f.InField))
                fig.SetCorner();
        }
    }

    /// <summary>
    /// get figure from corner
    /// </summary>
    /// <returns>
    /// figure
    /// </returns>
    GetFigureFromCorner() {
        return this.Figures.find(f => !f.InField);
    }

    /// <summary>
    /// check, if one figure is at the position of another figure
    /// </summary>
    /// <param name="fig">
    /// figure to check
    /// </param>
    /// <returns>
    /// figure, which shares the positions
    /// null, no figures shares the position
    /// </returns>
    CheckFigure(fig) {
        return this.Figures.find(f => f.Equals(fig));
    }

    /// <summary>
    /// determine number of figures in the house
    /// </summary>
    /// <returns>number of figures</returns>
    CheckHouse() {
        return this.Figures.filter(f => f.InHouse).length;
    }

    /// <summary>
    /// determine number of figures in the field
    /// </summary>
    /// <returns>number of figures</returns>
    CheckField() {
        const n = this.Figures.filter(f => f.InField && !f.InHouse).length;
        console.log("CheckField", n);
        return n;
    }

    /// <summary>
    /// check if all figures are in the house
    /// </summary>
    /// <returns>
    /// all figures in house
    /// </returns>
    CheckFinish() {
        return this.Figures.filter(f => f.InHouse).length === this.Figures.length;
    }
};

/// <summary>
/// description of the game
/// </summary>
class Game {
    /// <summary>
    /// action state of the figure
    /// </summary>
    static FigureAction = Object.freeze({
        /// <summary>
        /// default state
        /// </summary>
        None: 0,

        /// <summary>
        /// figure is about to be initialized
        /// </summary>
        Init: 1,

        /// <summary>
        /// figure is set on start
        /// </summary>
        Set: 2,

        /// <summary>
        /// figure is set
        /// </summary>
        Set: 3,

        /// <summary>
        /// figure is about to deleted from the field
        /// </summary>
        Delete: 4,

        /// <summary>
        /// figure is defeated
        /// </summary>
        Defeated: 5,

        /// <summary>
        /// process tracking figure
        /// </summary>
        Track: 6
    });


    /// <summary>
    /// canvas to call events
    /// </summary>
    Canvas;

    /// <summary>
    /// show or hide parking field
    /// </summary>
    Parking

    /// <summary>
    /// number of parking fields
    /// </summary>
    ParkingNumber

    /// <summary>
    /// players of the game
    /// </summary>
    Players;

    /// <summary>
    /// current ranking of the player
    /// </summary>
    Ranking;

    /// <summary>
    /// current tracking player 
    /// </summary>
    Player

    /// <summary>
    /// force defeating is active
    /// </summary>
    ForceDefeat

    /// <summary>
    /// jump in house is allowed
    /// </summary>
    JumpHouse;

    /// <summary>
    /// constructor
    /// </summary>
    /// <param name="c">
    /// canvas for events
    /// </param>
    constructor(c) {
        this.Canvas = c;
    }

    /// <summary>
    /// init game with players
    /// </summary>
    /// <param name="players">
    /// field index of players
    /// </param>
    SetPlayers(players) {
        if( players != null) {
            this.Players = Array.from(players.filter( (p) => p >= 0).map(c => new GamePlayer(this, c)));
            this.SetFiguresToCorner(true);          // set initial position
        } else {
            this.Players = null;
        }

        console.log("SetPlayers", players, this.Players);
    }

    /// <summary>
    /// get first or next player
    /// </summary>
    /// <param name="first">
    /// get first player
    /// </param>
    /// <returns>
    /// game continues
    /// </returns>
    SelectPlayer(first = false) {
        var run = false;

        var play = Array.from(this.Players.filter(p => !p.CheckFinish()));
        if (play.length > 0) {
            if (first) {
                // find first player in the game
                this.Player = play[0];
                run = true;
            } else {
                // no player active
                if (!this.Player)
                    run = this.SelectPlayer(true);  // get first player in game
                else
                {
                    var index = play.findIndex((p) => p.Equals(this.Player));
                    if (index < 0)                      // current player not found
                        run = this.SelectPlayer(true);  // get first player in game
                    else {
                        // next player
                        index++;
                        if (index >= play.length)
                            index = 0;

                        this.Player = play[index];
                        run = true;
                    }
                }
            }
        }

        // check if game is entriely finished
        if (!run)
            this.Canvas.OnFinished();

        return run;
    }

    /// <summary>
    /// check, if one figure is at the other ones position
    /// </summary>
    /// <param name="fig">
    /// figure to check
    /// </param>
    /// <returns>
    /// figure, which shares the position
    /// null or undefined, no figure at the position
    /// </returns>
    CheckFigure(fig) {
        if( this.Players == null)
            return null;

        return this.Players.map( p => p.CheckFigure(fig)).find( f => f != null);
    }

    /// <summary>
    /// check if a figure can be tracked
    /// </summary>
    /// <param name="f1">
    /// figure to be checked
    /// </param>
    /// <param name="num">number of field positions</param>
    /// <param name="defeat">figure must be defeated if you can</param>
    /// <returns>
    /// number of another player jumped over figures
    /// defeated figure
    /// </returns>
    CheckTrackFigure(f1, num, defeat) {
        console.log( "CheckTrackFigure", f1, num, defeat);

        var f = null;
        var numfig = 0;         // number of foreign figures to jump over
        var res = { num: -1, fd: null };

        var tf = new GameFigure(f1);
        tf.Test = true;

        for (var i = num; i > 0; i--)
        {
            if (!tf.Track())    // track figure
                return res;

            f = this.CheckFigure(tf);
            if (f != null) {
                if (!this.JumpHouse && tf.InHouse)
                    return res;

                if (i > 1)              // if last field not reached
                {
                    // figure from another player
                    if (!GameFigure.HaveSameColor(tf, f))
                        numfig++;
                }
            }
        }

        // if there is not another figure on the same position
        // figure cannot be tracked if force defeat is active
        if (!f) {
            res.num = defeat ? -1 : numfig;
            return res;
        }

        if (GameFigure.HaveSameColor(f, tf))
            return res;

        if (this.Parking && f.CheckParking())   // if figure is at parking position
            return res;

        res.num = numfig;
        res.fd = f;
        console.log( "CheckTrackFigure", res);

        return res;
    }

    /// <summary>
    /// set first figure of all players to start
    /// </summary>
    SetStart() {
        console.log("SetStart", this.Players);

        if (this.Players != null)
            for (var pl of this.Players)
                pl.Figures[0].SetStart();
    }

    /// <summary>
    /// set all figures into the field
    /// </summary>
    SetFigures() {
        console.log("SetFigures", this.Players);

        if (this.Players != null)
            for (var pl of this.Players)
                pl.SetFigures();
    }

    /// <summary>
    /// delete all figures from the field
    /// </summary>
    DeleteFigures() {
        console.log("DeleteFigures", this.Players);

        if (this.Players != null)
            for (var pl of this.Players)
                pl.DeleteFigures();
    }

    /// <summary>
    /// set all figures to corner
    /// </summary>
    /// <param name="force">
    /// also set figures in corner that are not in the field
    /// </param>
    SetFiguresToCorner(force = false) {
        console.log( "SetFiguresToCorner", force);

        if (this.Players != null)
            for (var pl of this.Players)
                pl.SetFiguresToCorner(force);

        this.Ranking = 0;
    }

    /// <summary>
    /// set strategy for all players
    /// </summary>
    /// <remarks>
    /// this is for testing purpose
    /// </remarks>
    /// <param name="strategy">
    /// strategy to set
    /// </param>
    SetStrategy(strategy) {
        for(var pl in this.Players)
            pl.Strategy = strategy;
    }

    /// <summary>
    /// check if all figures of the current player are in the corner
    /// </summary>
    /// <returns>
    /// all figures are in the corner
    /// </returns>
    CheckCorner() {
        const r = this.Player.CheckField() === 0;
        console.log("CheckCorner", r, this.Player);
        return r;
    }

    /// <summary>
    /// set or delete all parking position in the field
    /// </summary>
    /// <param name="p">
    /// new parking flag
    /// </param>
    SetParking(p) {
        var figs = new Array();   // Field.GameMaxFigure
        var park = new Array();  // Field.FieldDescription.parking.length
        for(const i of Field.FieldDescription.parking) {
            const pos = Field.FieldDescription.positions[i];
            const tf = new GameFigure(null, pos.x, pos.y);

            const f = this.CheckFigure(tf);
            if (f != null)          // if figure on a parking position
                figs.push(f);

            park.push(new GamePoint(pos));
        }

        for(var f in figs)
            f.Delete(); // delete first

        this.Canvas.OnParking( park, p);

        for(var f in figs)
            f.Set();    // set it again

        this.Parking = p;
        this.ParkingNumber = Field.FieldDescription.parking.length;
    }

    /// <summary>
    /// get ranking of the players
    /// </summary>
    /// <returns>
    /// player in ascending order
    /// </returns>
    GetRanking() {
        if (!this.Players)
            return [];

        var ranking = this.Players.filter(p => p.CheckFinish());
        ranking.sort((p1, p2) => p1.Ranking - p2.Ranking);
        return ranking;
    }

    /// <summary>
    /// track figure by 1 position
    /// </summary>
    /// <param name="fig">
    /// figur to track
    /// </param>
    /// <param name="last">
    /// last field
    /// </param>
    /// <return>
    /// defeated figure
    /// </return>
    CheckTrackFigureByOne(fig, last) {
        fig.Track();

        if (last) {
            var f2 = this.CheckFigure(fig);
            if (!f2) {
                fig.Set();
                if (this.Player.CheckFinish()) {
                    this.Player.Ranking = ++this.Ranking;
                    this.Canvas.OnFinished(this.Player);
                }
            } else {
                fig.Set();
            }

            return f2;
        }

        return null;
    }

    /// <summary>
    /// track figure by 1 position
    /// </summary>
    /// <param name="fig">
    /// figur to track
    /// </param>
    /// <param name="last">
    /// last field
    /// </param>
    async TrackFigureByOne(fig, last) {
        fig.Delete();

        const f1 = this.CheckFigure(fig);
        if( f1 != null) {
            f1.Set();
        } else {
            if (this.Parking && fig.CheckParking())   // if figure was at parking position
                this.Canvas.OnParking( [fig.Position], true);
        }

        fig.Track();
        
        if (!last) {
            fig.Set();
            await this.Canvas.OnFigure(this.Player, fig, Game.FigureAction.Track);
        } else {
            const f2 = this.CheckFigure(fig);
            if (f2 == null) {
                fig.Set();
                await this.Canvas.OnFigure(this.Player, fig, Game.FigureAction.Track);
                
                if (this.Player.CheckFinish()) {
                    this.Player.Ranking = ++this.Ranking;
                    this.Canvas.OnFinished( this.Player);
                }
            }
            else
            {
                f2.Delete();            // delete figure from the field
                f2.Defeated();
                fig.Set();
                await this.Canvas.OnFigure(this.Player, fig, Game.FigureAction.Track);
                f2.Set();
            }
        }
    }

    /// <summary>
    /// track figure on the field
    /// </summary>
    /// <param name="fig">
    /// figure to track
    /// </param>
    /// <param name="dice">
    /// number of dice pips
    /// </param>
    async TrackFigure(fig, dice) {
        for (var i = 1; i <= dice; i++)
            await this.TrackFigureByOne(fig, i == dice);
    };

    /// <summary>
    /// check strategy according to dice
    /// </summary>
    /// <returns>
    /// figures to track
    /// figures that can be defeated
    /// </returns>
    #CheckStrategy(dice) {
        var lstfd = new Array();   // figures to defeat Field.GameMaxFigure
        var lstft = new Array();   // figures to track Field.GameMaxFigure

        if (this.ForceDefeat || this.Player.Strategy != GamePlayer.StrategyDefinition.Manual) {
            // at first determine if other figures can be defeated
            for (var f of this.Player.Figures) {
                const res = this.CheckTrackFigure(f, dice, true);
                console.log( "CheckTrackFigure", res);
                if( res.num >= 0) {
                    lstfd.push(res.fd);
                    lstft.push(f);
                }
            }

            if (lstft.length > 0) {
                lstfd.sort((f1, f2) => f2.TrackNumber - f1.TrackNumber);
                return { ft: lstft, fd: lstfd }
            }
        }

        for(var f of this.Player.Figures) {
            const res = this.CheckTrackFigure(f, dice, false);
            console.log( "CheckTrackFigure", res);
            if ( res.num >= 0) {
                lstfd.push(res.fd);
                lstft.push(f);
            }
        }

        switch (this.Player.Strategy) {            // evaluate strategy
            case GamePlayer.StrategyDefinition.One:
                lstft.sort((f1, f2) => f2.TrackNumber - f1.TrackNumber);
                break;

            case GamePlayer.StrategyDefinition.All:
                lstft.sort((f1, f2) => f1.TrackNumber - f2.TrackNumber);
                break;
        }

        return { ft: lstft, fd: lstfd }
    }

    /// <summary>
    /// evaluate dice roll
    /// </summary>
    /// <remarks>
    /// If the dice roll is 6, a figure is set from the corner to the start position.
    /// If there is a figure from another player, it will be defeated.
    /// If there is a figure which belong to me, it will be tracked by 6 fields
    /// although a own figure is defeated.
    /// If the dice roll is not a 6 or no figure is at the corner anymore,
    /// the figures are determined which can be tracked.
    /// </remarks>
    /// <param name="dice">
    /// number of dice pips to track
    /// </param>
    /// <returns>
    /// Figures that can be tracked.
    /// Null if one already has been tracked.
    /// figures to defeat
    /// </returns>
    async EvalDiceRoll(dice) {
        var track = true;   // figure can be tracked
        if (dice == 6) {
            var fig = this.Player.GetFigureFromCorner();
            if (fig != null)
            {
                track = false;      // do not track figure
                var tfig = new GameFigure(fig);
                tfig.Test = true;

                tfig.SetStart();

                var fig2 = this.CheckFigure(tfig);  // get figure at start positions
                if (fig2 != null)           // if there is a figure
                {
                    if (GameFigure.HaveSameColor(fig2, tfig)) {
                        // track only this figure
                        return { ft: [ fig2 ], fd: null };
                    } else {
                        fig2.Delete();      // delete from start position
                        fig.Delete();       // delete figure from corner

                        fig.SetStart();
                        fig2.Defeated();    // figure defeated

                        await fig.Set();    // set to start position
                        await fig2.Set();
                    }
                } else {                    // figure set to start position
                    fig.Delete();           // delete figure from corner
                    fig.SetStart();
                    await fig.Set();              // set figure to start position
                }
            }
        }

        if (!track)                         // if figure cannot be tracked anymore
            return { ft: null, fd: null };

        return this.#CheckStrategy(dice);
    }

    /// <summary>
    /// check dice roll. This function is for async behaviour.
    /// </summary>
    /// <remarks>
    /// If the dice roll is 6, a figure is set from the corner to the start position.
    /// If there is a figure from another player, it will be defeated.
    /// If there is a figure which belong to me, it will be tracked by 6 fields
    /// although a own figure is defeated.
    /// If the dice roll is not a 6 or no figure is at the corner anymore,
    /// the figures are determined which can be tracked.
    /// </remarks>
    /// <param name="dice">
    /// number of dice pips to track
    /// </param>
    /// <returns>
    /// Figures that can be tracked.
    /// Null if one already has been tracked.
    /// figures to defeat
    /// figure to set
    /// </returns>
    CheckDiceRoll(dice) {
        fdefeat = null;
        fset = null;

        var track = true;           // figure can be tracked
        if (dice == 6) {
            var fig = this.Player.GetFigureFromCorner();
            if (fig != null) {
                track = false;      // do not track figure
                var tfig = new GameFigure(fig);
                tfig.Test = true;
                tfig.SetStart();

                var fig2 = this.CheckFigure(tfig);  // get figure at start positions
                if (fig2 != null)                   // if there is a figure
                {
                    if (GameFigure.HaveSameColor(fig2, tfig)) {
                        // track only this figure
                        return { ft: [ fig2 ], fd: null, fs: null };
                    }
                    else {
                        fig.SetStart();
                        fdefeat = [ fig2 ];     // figure defeated
                        fset = fig;
                    }
                } else {                        // figure set to start position
                    fig.SetStart();
                    fset = fig;
                }
            }
        }

        if (!track)                         // if figure cannot be tracked anymore
            return { ft: null, fd: null, fs: null };

        return this.#CheckStrategy(dice);
    }
}

// --- end of file ---
