/*
 *  https://en.wikipedia.org/wiki/Tetromino
 *
 */
const TETROMINO=[
    {
        color:"#F44",
        name:"I",
        blocks:[
            [" X  ",
             " X  ",
             " X  ",
             " X  "],
                    ["    ",
                     "XXXX",
                     "    ",
                     "    "],
                         ["  X ",
                          "  X ",
                          "  X ",
                          "  X "],
                              ["    ",
                               "    ",
                               "XXXX",
                               "    "]]
    },
    {
        color:"#4F4",
        name:"T",
        blocks:[
            ["XXX",
             " X ",
             "   "],
                    ["  X",
                     " XX",
                     "  X"],
                        ["   ",
                         " X ",
                         "XXX"],
                            ["X  ",
                             "XX ",
                             "X  "]]
    },
    {
        color:"#44F",
        name:"S",
        blocks:[
            ["X  ",
             "XX ",
             " X "],
                    [" XX",
                     "XX ",
                     "   "],
                        [" X ",
                         " XX",
                         "  X"],
                            ["   ",
                             " XX",
                             "XX "]]
    },
    {
        color:"#FF4",
        name:"Z",
        blocks:[
            [" X ",
             "XX ",
             "X  "],
                    ["XX ",
                     " XX",
                     "   "],
                        ["  X",
                         " XX",
                         " X "],
                            ["   ",
                             "XX ",
                             " XX"]]
    },
    {
        color:"#F4F",
        name:"L",
        blocks:[
            [" X ",
             " X ",
             " XX"],
                    ["   ",
                     "XXX",
                     "X  "],
                        ["XX ",
                         " X ",
                         " X "],
                            ["  X",
                             "XXX",
                             "   "
                             ]]
    },
    {
        color:"#4FF",
        name:"J",
        blocks:[
            [" X ",
             " X ",
             "XX "],
                    ["X  ",
                     "XXX",
                     "   "],
                        [" XX",
                         " X ",
                         " X "],
                            ["   ",
                             "XXX",
                             "  X"]]
    },
    {
        color:"#FFF",
        name:"O",
        blocks:[
            ["XX",
             "XX"]]
    },
   /* {
        svg_index:7,
        color:"#4FF",
        name:"X",
        blocks:[
            [" X ",
             "XXX",
             " X "]]
    },*/
];

