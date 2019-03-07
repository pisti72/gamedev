var map = [
    '                                                ',
    '                                                ',//14
    '                                                ',//15
    'GG                                            GG',//16
    '     GGG                                GGG     ',//17
    'GG                                            GG',//18
    '     GGGG                               GGG     ',//19
    'GG                                            GG',//20
    '                        L                       ',//21
    '   GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG    ',//22
    '   G                                    G       ',//23
    'GGGG     GGGG     GGGG     GGGG     GGGGG    GGG',//24
    '   G                                    G  X    ',//25 X=72
    '   GGGGGG    GGGGG    GGGGG    GGGGG    GGGG    ',//26
    '-  X                                          - ',//27 X=71 71 72
    'GGGG -     GG     GGGG     GGGG     GGGG     GGG',//28 70
    'GGGGGG   GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',//29
    '        G                                       ',//30
    '       G                                        ',//31
    '   GGGGG    -        GGGGGGGG    G              ',//32 69
    '         GGGGGGGGGGGGG       GGGGGGGGGG         ',//33
    'GG           GGGGGGGG                GGGGGGGGG  ',//34
    'GGGGG        GGGGGG                  G         -',//35 68
    'GGGGG        G              GGGG GG GG        GG',//36
    'GGGGGGGGGGGGGG GGGGGGGG     G-    G  G   GGGG  G',//37 46
    'GGGGGGGGGGGGG  G -   G      GGGGGGGG G-         ',//38 45 67
    'GGGGGGGGGGGGG GGGGGG G               GGGGGGGG   ',//39
    'GGGGGGGGGGGGG G -    G      GGG  GGGG          -',//40 44 66
    'GGGGGGGGGGGGG GGGGGG GGG   GGGGGGG          GGGG',//41
    'GGGGGGGGGGGGG GGGGGG-     -G          -     GGGG',//42 42 43 65
    'GGGGGGGGGGGGG GG   GGGGG  GG           GG    GGG',//43
    'GGGGGGGGGG     G       G  G                  GGG',//44
    'GGGGGGGGGG G  GG         GG       GG         GGG',//45
    '         G-G -GGGGG   G -G    GG             GGG',//46 41 47 48
    '            GGG       GGGG  -               -GGG',//47 63 64
    '                 G -GGGGGGGGGGGGGGG       GGGGGG',//48 40
    '   -     G G     GGGGGGGGGG           -GGGG    G',//49 39 62
    '     GGGGGXG  GGGGG      GG        GGGGGGGG    G',//50 X=48
    'GG       G-GGGGGGGG      GG  -  G     -        G',//51 49 60 61
    '         G-GGGGG         GGGGGGGGGGGGGGGGGGG    ',//52 50
    '   GG    G-GGG                      -     G    G',//53 51 55
    '        -G-G       GGGGGGGGGGGGGGGGGGGGG  G  -  ',//54 38 52 59
    '-      GGG-GGGGG -  G       GGGGGGGGG     GG    ',//55 37 53 54
    'GG    -G            G -GG                    -  ',//56 36 57 58
    '     GGG     GGGGGGGGGGGGGGGGGGGGGGGGGG        G',//57 56
    '     GGG     GG   GGG -                   G    G',//58 
    'XGGGGGGGGGGGGGG - GGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',//59 X=35 35
    '                                  -    -      -G',//60 31 32 34
    'GGGGGGGGGGGGGGGGGGGGGGGG      -G    G    G-    G',//61 30 33
    '                          GGGGGGGGGGGGGGGGGGGGGG',//62
    '           GGGGGGGGGGG      -G                  ',//63 29
    '   -  GGG            GGGGGGGGG                  ',//64 28
    'GGG    -                                        ',//65 27
    '           -                                    ',//66 26
    '     GG      -                        GGGGGGGGGG',//67 25
    '         GG   -                      GG        G',//68 24
    '              GG   -          GGGGGGGG    -    G',//69 20 23
    'GGGGG              GG         GG G G G   GG  GGG',//70
    '                       GG     G           G     ',//71
    '  G       G                   X           GGG   ',//72 X=22
    '  GGGGGGGGGGGGGGGGGGGGGGGGGGGGG GGGGG G   G     ',//73
    '          G-                  X       G   G    G',//74 X=20 22
    '          GGGG            GGGGGG-GGGG G  -G     ',//75 17 18
    '          GGGGGGG       GGGGGGG       G   GGGG  ',//76
    '          GGGGGGGGGG-GGGGGGGGGG-GGGGG G        -',//77 16 19 21
    '                  GGGGG       G       G        G',//78
    '                              G-GGGGG G      GGG',//79 15
    '                              G       G    GGGGG',//80
    '                              G GGGGG G  GGGGGGG',//81
    '                        G             GGGGGGGGGG',//82
    '            GGGGGGGGGGGGGGGGGGGGGGGGGGG-        ',//83 8
    '     GGGG            G        -      GGGGGG     ',//84 14
    'G                    X               G G        ',//85 X=8+6=14
    '                 G   G               G-X      GG',//86 X=2+6=8 9
    '    GGG   GGGGG  GGGGGGGG    GGG     G-G        ',//87 10
    'GGGGGGG   GGGGG                      G-GGGGG -  ',//88 7 11
    'GGGGGGGGGGGGGGG                  GGG G-GG       ',//89 12
    '                            G        G-GG    - G',//90 6 13
    '                  -         GGG        GG       ',//91 2
    '                                 GGGGGGGGGGG    ',//92
    '     GGG    GGG                      GGG--     G',//93 4 5
    '                                      GGGGGG    ',//94
    'GGG                                    G-       ',//95 3
    '    G     GG                           G       G',//96
    '    -     GG  GG        P         G    X        ',//97 X=2 1
    'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',//98
    'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',//99
    'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG'];//100