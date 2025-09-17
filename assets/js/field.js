/// <summary>
/// point in the field
/// </summary>
class Point {
    /// <summary>
    /// init member variables
    /// </summary>
    #x = 0;
    #y = 0;

    /// <summary>
    /// construct point
    /// </summary>
    /// <param name="x">
    /// column or point
    /// </param>
    /// <param name="y">
    /// row or undefined
    /// </param>
    constructor(x, y) {
        if( !y) {
            const p = x;
            this.x = p.x;
            this.y = p.y;
        } else {
            this.x = x;
            this.y = y;
        }
    }

    /// <summary>
    /// get for coordinates
    /// </summary>
    get Col() { return this.#x; }
    get Row() { return this.#y; }

    /// <summary>
    /// copy an array of point and create another
    /// </summary>
    /// <param name="p">
    /// array of points
    /// </param>
    /// <returns>
    /// copied array of points
    /// </returns>
    static CopyArray(ap) { return ap.slice(); }
};

/// <summary>
/// class for one player in field
/// </summary>
class Player {
    /// <summary>
    /// name of the color
    /// </summary>
    color;

    /// <summary>
    /// index coordinates for start position
    /// </summary>
    start;

    /// <summary>
    /// coordinates of the field house entrance ahead
    /// </summary>
    Hahead;

    /// <summary>
    /// coordinates of the positions in the house
    /// </summary>
    house;

    /// <summary>
    /// position of the figures
    /// </summary> 
    figure;

    /// <summary>
    /// coordinates of the dice roll position
    /// </summary>
    diceroll;

    /// <summary>
    /// copy constructor for one player
    /// </summary>
    /// <param name="p">
    /// player to copy
    /// </param>
    constructor(p) {
        this.name = p.name;
        this.start = p.start;
        this.Hahead = p.Hahead;
        this.house = Point.CopyArray(p.house);
        this.figure = Point.CopyArray(p.figure);
        this.diceroll = new Point(p.diceroll);
    };

    /// <summary>
    /// equal two players
    /// </summary>
    /// <param name="a">
    /// player 1
    /// </param>
    /// <param name="b">
    /// player 2
    /// </param>
    /// <returns>
    /// player1 == player2
    /// </returns>
    static Equals(a, b) { return a.name == b.name; }
};


/// <summary>
/// description of the field
/// </summary>
class Description {
    /// <summary>
    /// descripiton of the position in the field
    /// </summary>
    positions;

    /// <summary>
    /// description of the parking fields
    /// </summary>
    parking;

    /// <summary>
    /// starting values of the players
    /// </summary>
    players;
}

/// <summary>
/// this class describes the fields
/// </summary>
class Field {
    /// <summary>
    /// maximum numbers of figures for a player
    /// </summary>
    static GameMaxFigure = 4;

    /// <summary>
    /// description of the field in original coordinates 
    /// </summary>
    /// <remarks>
    /// maximum 400 x 400 pixel
    /// </remarks>
    static pointsIT = [
        new Point(136,176), new Point(117,160), new Point(97,145),
        new Point( 78,128), new Point( 97,110), new Point(116, 92),
        new Point(136, 73), new Point(153, 87), new Point(170,100),
        new Point(187,113), new Point(202, 94), new Point(218, 74), new Point(234, 55),
        new Point(249, 36), new Point(270, 51), new Point(290, 66),
        new Point(310, 81), new Point(295,101), new Point(282,122), new Point(267,143),
        new Point(253,164), new Point(274,177), new Point(294,190), new Point(314,204),
        new Point(335,217), new Point(325,238), new Point(316,257), new Point(307,278),
        new Point(296,299), new Point(274,282), new Point(252,265), new Point(229,248),
        new Point(207,231), new Point(192,253), new Point(178,274), new Point(163,296),
        new Point(148,317), new Point(133,339),
        new Point(118,361), new Point( 99,345), new Point( 79,329), new Point( 60,314),
        new Point( 41,298), new Point( 56,278), new Point( 73,257), new Point( 89,237),
        new Point(104,217), new Point(121,196)
    ];

    /// <summary>
    /// parking fields
    /// </summary>
    static parkingIT = [ 0, 12, 24, 36 ];

    /// <summary>
    /// description of the players for the IT-field
    /// </summary>
    static playersIT = [
        new Player(
            color = "orange",
            start = 29,             // index coordinates for start field
            Hahead = 27,            // coordinates of the field house entrance ahead
            house = [               // coordinates of the positions in the house
                new Point(290,263), new Point(280,241), new Point(270,218), new Point(260,196)
            ],
            figure = [              // data of the figures
                new Point(245,330), new Point(260,310), new Point(281,323), new Point(267,344)
            ],
            diceroll = new Point(315,335)   // coordinates of the dice roll position
        ),
        new Player(
            color = "yellow",
            start = 41,             // index coordinates for start field
            Hahead = 39,            // coordinates of the field house entrance ahead
            house = [               // coordinates of the positions in the house
                new Point(112,327), new Point(114,302), new Point(117,277), new Point(119,253)
            ],
            figure = [              // data of the figures
                new Point(21,358), new Point(37,338), new Point(57,354), new Point(40,374)
            ],
            diceroll = new Point(90,380)   // coordinates of the dice roll position
        ),
        new Player(
            color = "green",
            start = 5,              // index coordinates for start field
            Hahead = 3,             // coordinates of the field house entrance ahead
            house = [               // coordinates of the positions in the house
                new Point(116,129), new Point(141,130), new Point(166,131), new Point(190,132)
            ],
            figure = [              // data of the figures
                new Point(79,56), new Point(96,37), new Point(116,52), new Point(98,72)
            ],
            diceroll = new Point(50,75) // coordinates of the dice roll position
        ),
        new Player(
            color = "blue",
            start = 17,             // index coordinates for start field
            Hahead = 15,            // coordinates of the field house entrance ahead
            house = [               // coordinates of the positions in the house
                new Point(276,88), new Point(262,109), new Point(247,129), new Point(233,151)
            ],
            figure = [              // data of the figures
                new Point(347,80), new Point(368,93), new Point(354,115), new Point(333,101)
            ],
            diceroll = new Point(370,50)   // coordinates of the dice roll position
        ),
    ];

    /// <summary>
    /// descriptions of the field for IT game
    /// </summary>
    static fieldIT = new Description(
        this.positions = pointsIT,
        this.parking = parkingIT,
        this.players = playersIT
    );

    /// <summary>
    /// get description of the field
    /// </summary>
    static FieldDescription = fieldIT;

    /// <summary>
    /// get names of the available players
    /// </summary>
    /// <returns>
    /// array of player names
    /// </returns>
    static GetPlayerNames() {
        return Array.from(FieldDescription.players, (p => p.name));
    }
};

// --- end of file ---

