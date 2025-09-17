/// <summary>
/// arguments for figure event
/// </summary>
class FigureEventArgs {
    /// <summary>
    /// player
    /// </summary>
    player;

    /// <summary>
    /// figure for action
    /// </summary>
    figure;

    /// <summary>
    /// what to do with figure
    /// </summary>
    action;

    /// <summary>
    /// constructor
    /// </summary>
    constructor(p, f, a)
    {
        this.player = p;
        this.figure = f;
        this.action = a;
    }
}

/// <summary>
/// argument for parking event
/// </summary>
class ParkingEventArgs {
    /// <summary>
    /// position of parking zones
    /// </summary>
    positions;

    /// <summary>
    /// set or reset parking zones
    /// </summary>
    action;

    /// <summary>
    /// constructor
    /// </summary>
    constructor(p, a) {
        this.positions = p;
        this.action = a;
    }
};

/// <summary>
/// argument for finished event
/// </summary>
class FinishedEventArgs {
    /// <summary>
    /// player that has been finished
    /// </summary>
    player;

    /// <summary>
    /// constructor
    /// </summary>
    constructor( p = null)
    {
        this.player = p;
    }
};

/// <summary>
/// position in field
/// </summary>
class GamePoint
{
    /// <summary>
    /// constructor of position or copy
    /// </summary>
    /// <param name="col">
    /// column or point
    /// </param>
    /// <param name="row">
    /// row or undefined
    /// </param>
    constructor(col, row)
    {
        if( !row) {
            const p = col;
            this.Col = p.Col;
            this.Row = p.Row;
        } else {
            this.Col = col;
            this.Row = row;
        }
    }

    /// <summary>
    /// current column of point
    /// </summary>
    Col;

    /// <summary>
    /// current row
    /// </summary>
    Row;

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
    static Equals(a, b)
    {
        if (!a || !b)
            return false;

        return a.Col == b.Col && a.Row == b.Row;
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
    /// <param name="row">
    /// number of figure,
    /// row of the position
    /// </param>
    /// <param name="col">
    /// column of the position
    /// </param>
    constructor(p, row, col)
    {
        if( !col) {
            if( !row) {
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
                this.Number = row;
            }
        } else {
            this.Player = p;
            this.Position = new GamePoint(row, col);
            this.Test = true;
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
        return Field.Player.Equals(f1.Player.FieldPlayer, f2.Player.FieldPlayer);
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
        if (!a || !b)
            return false;

        if (!!a.Player && !!b.Player) {
            // ignore myself
            if (a.Number == b.Number &&
                HaveSameColor(a, b))
                return false;
        }

        if (GamePoint.Equals(a.Position, b.Position))
            return true;

        return false;
    }

    /// <summary>
    /// check if figure is at parking position
    /// </summary>
    /// <returns>
    /// figure is at parking position
    /// </returns>
    CheckParking() {
        for (var index of Field.FieldDescription.parking)
        {
            var pos = Field.FieldDescription.positions[index];
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
            for (const p of Field.FieldDescription.players)
            {
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
        if (!!this.Player.FieldPlayer) {
            this.GameIndex = this.Player.FieldPlayer.start;
            this.Position = new GamePoint(Field.FieldDescription.positions[this.GameIndex]);
        }

        this.InField = true;
        this.TrackNumber = 0;
    }

    /// <summary>
    /// set figure to corner position
    /// </summary>
    SetCorner() {
        if (!!this.Player.FieldPlayer)
            this.Position = new GamePoint(this.Player.FieldPlayer.figure[this.Number - 1]);

        this.InField = false;
        this.InHouse = false;
        this.TrackNumber = 0;
    }

    /// <summary>
    /// figure is defeated
    /// </summary>
    Defeated() {
        if (!this.Test)
            this.Player.Game.OnFigure(this, new FigureEventArgs(this.Player, this, FigureAction.Defeated));

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
            if (this.GameIndex == this.Player.FieldPlayer.house.Length - 1)
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
                if (this.GameIndex == Field.FieldDescription.positions.Length)
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
    Set() {
        const bSet = this.HasSet;
        this.HasSet = true;

        if (!this.Test)
            this.Player.Game.OnFigure(this, new FigureEventArgs(this.Player, this, FigureAction.Set));

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
            this.Player.Game.OnFigure(this, new FigureEventArgs(this.Player, this, FigureAction.Delete));

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
        if( !player) {
            const p = game;
            this.Game = p.Game;
            this.FieldPlayer = p.FieldPlayer;   // just copy reference
            this.Name = p.Name;
            this.Data = p.Data;

            this.Ranking = this.Ranking;
            this.Figures = p.Figures.filter(f => new GameFigure(f));
            this.Strategy = p.Strategy;
        } else {
            if (player >= 0 && player < Field.FieldDescription.players.Length) {
                this.FieldPlayer = Field.FieldDescription.players[player];
                this.Name = this.FieldPlayer.name;
                this.Index = player;
            }

            this.Game = game;
            this.Strategy = StrategyDefinition.Manual;
            this.CreateFigures();
        }
    }

    /// <summary>
    /// place figures on the field
    /// </summary>
    CreateFigures() {
        this.Figures = new Array();     // Field.GameMaxFigure
        for (var n = 1; n <= Field.GameMaxFigure; n++)
        {
            var f = new GameFigure(this, n);

            if (!!this.Game.OnFigure)
                this.Game.OnFigure(this, new FigureEventArgs(this, f, FigureAction.Init));

            this.Figures.push(f);
        }
    }

    /// <summary>
    /// check if two player have the same color
    /// </summary>
    /// <param name="p1">first player</param>
    /// <param name="p2">second player</param>
    /// <returns>
    /// player are equal
    /// </returns>
    static HaveSameColor(p1, p2)
    {
        return Field.Player.Equals(p1.FieldPlayer, p2.FieldPlayer);
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

        return a == b || HaveSameColor(a, b);
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
        if (force)
        {
            for(var fig of this.Figures)
                fig.SetCorner();
        }
        else
        {
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
        return this.Figures.filter(f => f.InHouse).Length;
    }

    /// <summary>
    /// determine number of figures in the field
    /// </summary>
    /// <returns>number of figures</returns>
    CheckField() {
        return this.Figures.filter(f => f.InField && !f.InHouse).Length;
    }

    /// <summary>
    /// check if all figures are in the house
    /// </summary>
    /// <returns>
    /// all figures in house
    /// </returns>
    CheckFinish() {
        return this.Figures
                    .filter(f => f.InHouse)
                    .Length === this.Figures.Length;
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
        /// figure is set
        /// </summary>
        Set: 2,

        /// <summary>
        /// figure is about to deleted from the field
        /// </summary>
        Delete: 3,

        /// <summary>
        /// figure is defeated
        /// </summary>
        Defeated: 4,

        /// <summary>
        /// process delay at tracking figure
        /// </summary>
        Delay: 5
    });


    /*
    /// <summary>
    /// event to handle figure
    /// </summary>
    public event EventHandler<FigureEventArgs> OnFigure;

    /// <summary>
    /// event to set or reset parking zones
    /// </summary>
    public event EventHandler<ParkingEventArgs> OnParking;

    /// <summary>
    /// event for finished player or game
    /// </summary>
    public event EventHandler<FinishedEventArgs> OnFinished;
*/


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
    /// constructor of the game
    /// </summary>
    constructor() {

    }

    /// <summary>
    /// constructor to init with players
    /// </summary>
    /// <param name="players">
    /// indices of player in the field
    /// </param>
    constructor(players) {
        this.SetPlayers(players);
    }

    /// <summary>
    /// init game with players
    /// </summary>
    /// <param name="players">
    /// field index of players
    /// </param>
    SetPlayers(players){
        this.Players = 
            new Array.from(
                players.filter( p => p >= 0),
                c => new GamePlayer(this, c));
        this.SetFiguresToCorner(true);          // set initial position
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

        var lstPlay = this.Players.filter(p => !p.CheckFinish());
        if (lstPlay.Length > 0)
        {
            if (first)
            {
                // find first player in the game
                this.Player = lstPlay[0];
                run = true;
            }
            else
            {
                // no player active
                if (!this.Player)
                    run = SelectPlayer(true);  // get first player in game
                else
                {
                    var index = lstPlay.IndexOf(this.Player);
                    if (index < 0)             // current player not found
                        run = SelectPlayer(true);  // get first player in game
                    else
                    {
                        // next player
                        index++;
                        if (index >= lstPlay.Count)
                            index = 0;

                        this.Player = lstPlay[index];
                        run = true;
                    }
                }
            }
        }

        // check if game is entriely finished
        if (!run && !!this.OnFinished)
            this.OnFinished(this, new FinishedEventArgs());

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
        if( !!this.Players)
            return null;

        return new Array.from( this.Players, p => p.CheckFigure(fig))
                        .find( f => f != null);
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
        var f = null;
        var numfig = 0;         // number of foreign figures to jump over

        var tf = new GameFigure(f1);
        tf.Test = true;

        for (var i = num; i > 0; i--)
        {
            if (!tf.Track())    // track figure
                return { num: -1, fd: null }

            f = this.CheckFigure(tf);
            if (!!f)
            {
                if (!this.JumpHouse && tf.InHouse)
                    return { num: -1, fd: null }

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
        if (!f)
            return { num: defeat ? -1 : numfig, fd: null };

        if (GameFigure.HaveSameColor(f, tf))
            return { num: -1, fd: null }

        if (this.Parking && f.CheckParking())   // if figure is at parking position
            return { num: -1, fd: null };

        return { num: numfig, fd: f };
    }

    /// <summary>
    /// set first figure of all players to start
    /// </summary>
    SetStart() {
        if (!!this.Players)
            for (var pl of this.Players)
                pl.Figures[0].SetStart();
    }

    /// <summary>
    /// set all figures into the field
    /// </summary>
    SetFigures() {
        if (!!this.Players)
            for (var pl of this.Players)
                pl.SetFigures();
    }

    /// <summary>
    /// delete all figures from the field
    /// </summary>
    DeleteFigures() {
        if (!!this.Players)
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
        if (!!this.Players)
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
        return this.Player.CheckField() == 0;
    }

    /// <summary>
    /// set or delete all parking position in the field
    /// </summary>
    /// <param name="p">
    /// new parking flag
    /// </param>
    SetParking(p) {
        var lstFig = new Array();   // Field.GameMaxFigure
        var lstPark = new Array();  // Field.FieldDescription.parking.Length
        for(var i in Field.FieldDescription.parking)
        {
            var pos = Field.FieldDescription.positions[i];
            var tf = new GameFigure(null, pos.Col, pos.Row);

            var f = this.CheckFigure(tf);
            if (!!f)    // if figure on a parking position
                lstFig.push(f);

            lstPark.push(new GamePoint(pos));
        }

        for(var f in lstFig)
            f.Delete(); // delete first

        this.OnParking?.Invoke(this, new ParkingEventArgs(lstPark, p));

        for(var f in lstFig)
            f.Set();    // set it again

        this.Parking = p;
        this.ParkingNumber = Field.FieldDescription.parking.Length;
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

        var lstRank = this.Players.filter(p => p.CheckFinish());
        lstRank.sort((p1, p2) => p1.Ranking - p2.Ranking);
        return lstRank;
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
    CheckTrackFigure(fig, last) {
        fig.Track();

        if (last)
        {
            var f2 = this.CheckFigure(fig);
            if (!f2)
            {
                fig.Set();
                if (this.Player.CheckFinish())
                {
                    this.Player.Ranking = ++this.Ranking;

                    if (!!this.OnFinished)
                        this.OnFinished(this, new FinishedEventArgs(this.Player));
                }
            }
            else
            {
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
    TrackFigure(fig, last) {
        fig.Delete();
        fig.Track();

        if (!last)
            fig.Set();
        else
        {
            var f2 = this.CheckFigure(fig);
            if (!f2)
            {
                fig.Set();
                if (this.Player.CheckFinish())
                {
                    this.Player.Ranking = ++this.Ranking;

                    if (!!this.OnFinished)
                        this.OnFinished( this, new FinishedEventArgs( this.Player));
                }
            }
            else
            {
                f2.Delete();            // delete figure from the field
                f2.Defeated();
                fig.Set();
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
    TrackFigure(fig, dice) {
        for (var i = 1; i <= dice; i++)
        {
            OnFigure?.BeginInvoke(this, new FigureEventArgs(this.Player, fig, FigureAction.Delay), null, i);

            this.TrackFigure(fig, i == dice);
        }
    };

    /// <summary>
    /// check strategy according to dice
    /// </summary>
    /// <returns>
    /// figures to track
    /// figures that can be defeated
    /// </returns>
    #CheckStrategy(dice) {
        num = this.Player.Figures.Count;

        var lstfd = new Array();   // figures to defeat Field.GameMaxFigure
        var lstft = new Array();   // figures to track Field.GameMaxFigure

        if (this.ForceDefeat || this.Player.Strategy != GamePlayer.StrategyDefinition.Manual)
        {
            // at first determine if other figures can be defeated
            for (var f in this.Player.Figures)
            {
                const res = this.CheckTrackFigure(f, dice, true);
                if( res.num >= 0)
                {
                    lstfd.push(res.fd);
                    lstft.push(f);
                }
            }

            if (lstft.Length > 0)
            {
                lstfd.sort((f1, f2) => f2.TrackNumber - f1.TrackNumber);
                return { ft: lstft, fd: lstfd }
            }
        }

        for(var f in this.Player.Figures)
        {
            const res = this.CheckTrackFigure(f, dice, false);
            if ( res.num >= 0)
            {
                lstfd.push(res.fd);
                lstft.push(f);
            }
        }

        switch (this.Player.Strategy)            // evaluate strategy
        {
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
    EvalDiceRoll(dice) {
        var track = true;   // figure can be tracked
        if (dice == 6)
        {
            var fig = this.Player.GetFigureFromCorner();
            if (!!fig)
            {
                track = false;      // do not track figure
                var tfig = new GameFigure(fig);
                tfig.Test = true;

                tfig.SetStart();

                var fig2 = this.CheckFigure(tfig);  // get figure at start positions
                if (!!fig2)         // if there is a figure
                {
                    if (GameFigure.HaveSameColor(fig2, tfig))
                    {
                        // track only this figure
                        return { ft: [ fig2 ], fd: null };
                    }
                    else
                    {
                        fig2.Delete();      // delete from start position
                        fig.Delete();       // delete figure from corner

                        fig.SetStart();
                        fig2.Defeated();    // figure defeated

                        fig.Set();          // set to start position
                        fig2.Set();
                    }
                }
                else        // figure set to start position
                {
                    fig.Delete();           // delete figure from corner
                    fig.SetStart();
                    fig.Set();              // set figure to start position
                }
            }
        }

        if (!track)                         // if figure cannot be tracked anymore
            return { ft: null, fd: null };

        return CheckStrategy(dice);
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

        var track = true;   // figure can be tracked
        if (dice == 6)
        {
            var fig = this.Player.GetFigureFromCorner();
            if (!!fig)
            {
                track = false;      // do not track figure
                var tfig = new GameFigure(fig);
                tfig.Test = true;
                tfig.SetStart();

                var fig2 = this.CheckFigure(tfig);  // get figure at start positions
                if (!!fig2)         // if there is a figure
                {
                    if (GameFigure.HaveSameColor(fig2, tfig)) {
                        // track only this figure
                        return { ft: [ fig2 ], fd: null, fs: null };
                    }
                    else {
                        fig.SetStart();
                        fdefeat = [ fig2 ];    // figure defeated
                        fset = fig;
                    }
                }
                else {          // figure set to start position
                    fig.SetStart();
                    fset = fig;
                }
            }
        }

        if (!track)                         // if figure cannot be tracked anymore
            return { ft: null, fd: null, fs: null };

        return CheckStrategy(dice);
    }
}

// --- end of file ---
