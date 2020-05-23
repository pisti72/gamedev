BS.sprite = [
    {
        letter: '0',
        shape: [
            'wwwwwwww',
            'w      w',
            'w      w',
            'w      w',
            'w      w',
            'w      w',
            'w      w',
            'wwwwwwww',
        ]
    },
    {
        letter: 'p',
        shape: [
            '..0000..',
            '.0.00.0.',
            '00.00.00',
            '00000000',
            '00000000',
            '00.00.00',
            '.00..00.',
            '..0000..',
        ]
    },
    {
        letter: 'e',
        shape: [
            '..y00y..',
            '.0.00.0.',
            '00.00.00',
            '00000000',
            '00000000',
            '00.00.00',
            '.00..00.',
            '..0000..',
        ]
    }
];
BS.text = [
    {
        letter: 's',
        align: BS.LEFT,
        data: 'SCORE: 000000'
    },
    {
        letter: 'h',
        align: BS.RIGHT,
        data: 'HIGH: 000000'
    },
    {
        letter: 't',
        align: BS.CENTER,
        data: 'PRESS START'
    },
]
BS.stage = [
    {
        name: 'title',
        paper: 'b',
        shape: [
            '                               ',
            '                               ',
            ' 0 000 0 0 000 00  000 00  000 ',
            ' 1 1 1 1 1 1 1 1 1 1   1 1 1   ',
            ' 2 2 2 2 2 2 2 2 2 22  22  222 ',
            ' 3 3 3 3 3 333 3 3 3   3 3   3 ',
            ' 4 4 4  4  4 4 44  444 4 4 444 ',
            '                               ',
            '              t                ',
        ],
        run: function(){
            if(BS.KEY_SPACE){
                BS.stage = 'ingame';
            }
        }
    },
    {
        name: 'ingame',
        paper: 'b',
        shape: [
            ' s                  h ',
            '    e e e e e e e     ',
            '                      ',
            '    e f e f e f e     ',
            '                      ',
            '    e e e e e e e     ',
            '                      ',
            '                      ',
            '    S     S     S     ',
            '          p           ',
        ],
        run: function(){
            if(BS.hero.died){
                BS.stage = 'gameover';
            }
        }
    }
];
BS.hero = {
    x: 0,
    y: 0,
    speed: 2,
    left: BS.KEY_A,
    right: BS.KEY_D,
    letter: 'p'
}
BS.enemies = [
    {
        letter: 'e'
    }
];
BS.start();
BS.stage = 'title';
update();
function update() {
    BS.update();
    requestAnimationFrame(update);
}