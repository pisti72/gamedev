org 30000

screen:    equ $4000
attr:      equ $5800

row_12345: equ $f7fe
row_67890: equ $effe
row_qwert: equ $fbfe
row_yuiop: equ $dffe
row_asdfg: equ $fdfe
row_hjkle: equ $bffe
row_szxcv: equ $fefe
row_bnmss: equ $7ffe


main:
    ld a,%01111000
    ld(paper_color),a
    call paper
    ld hl,txt_abc
    call pixel_txt
    ld hl,txt_hello
    call pixel_txt
    ld hl,txt_digits
    call pixel_txt
gameloop:
    ld a,0
    ld (spr_idx),a
    ld a,(pl_x)
    ld (spr_x),a
    ld a,(pl_y)
    ld (spr_y),a
    ;call sprite
    call sprite2

;http://www.breakintoprogram.co.uk/computers/zx-spectrum/keyboard
    ;ld bc,row_qwert
    ld bc,row_asdfg     ;A
    in a,(c)
    ;and %00000001    ; check key Q
    and %00000001    ; check key W
    call z,pl_left
    ;ld bc,row_qwert
    ld bc,row_asdfg
    in a,(c)
    and %00000100     ;D
    ;and %00000010    ; check key W
    call z,pl_right
    ;ld bc,row_yuiop
    ld bc,row_qwert
    in a,(c)
    and %00000010     ;W
    ;and %00000001    ; check key P
    call z,pl_up
    ld bc,row_asdfg  
    ;ld bc,row_hjkle
    in a,(c)
    ;and %00000010    ; check key L
    and %00000010   ;S
    call z,pl_down

    ld a,1
    ld (spr_idx),a
    ld a,(pl_x)
    ld (spr_x),a
    ld a,(pl_y)
    ld (spr_y),a
    ;call sprite
    call sprite2
    halt

    ld bc,row_bnmss
    in a,(c)
    and %00000001    ; check key SPACE
    jp nz,gameloop
    ret

pl_x: db 16
pl_y: db 100

pl_left:
    ld hl,pl_x       ; remember, y is the horizontal coord!
    ld a,(hl)       ; what's the current value?
    cp 0           ; is it zero?
    ret z           ; yes - we can't go any further left.
    dec (hl)        ; subtract 1 from y coordinate.
    ret

pl_right:
    ld hl,pl_x      ; remember, y is the horizontal coord!
    ld a,(hl)       ; what's the current value?
    cp 240           ; is it at the right edge (31)?
    ret z           ; yes - we can't go any further left.
    inc (hl)        ; add 1 to y coordinate.
    ret
                ; Move player up.
pl_up:
    ld hl,pl_y      ; remember, x is the vertical coord!
    ld a,(hl)       ; what's the current value?
    cp 0            ; is it at upper limit (4)?
    ret z           ; yes - we can go no further then.
    dec (hl)        ; subtract 1 from x coordinate.
    ret
                ; Move player down.
pl_down:
    ld hl,pl_y      ; remember, x is the vertical coord!
    ld a,(hl)       ; what's the current value?
    cp 183           ; is it already at the bottom (21)?
    ret z           ; yes - we can't go down any more.
    inc (hl)        ; add 1 to x coordinate.
    ret

;change attr
paper_color:
    db 0
paper:
    ld bc,768
    ld hl,attr
    push hl
loop1:
    ld a,(paper_color)
    ld (hl),a
    inc hl
    dec bc
    ld a,b
    or c
    jr nz, loop1
    pop hl
    ret

;print at
spr_idx:
    db 1
spr_x:
    db 1
spr_y:
    db 9
spr_attr:
    db %00111010
sprite:
    ;calculate x
    ld a,(spr_x)
    ld d,0
    ld e,a
    ld hl,screen
    add hl,de
    ld a,(spr_y)
    ld e,a
    sla e ;x2
    sla e ;x4
    sla e ;x8
    sla e ;x16
    sla e ;x32
    and %11111000
    ld d,a
    add hl,de
    ld d,h
    ld e,l
    ld hl,spr_bmp
    ld a,(spr_idx)
    sla a
    sla a
    sla a
    ld c,a
    ld b,0
    add hl,bc
    ld b,9
    ld c,0
loop2:
    ldi
    push bc
    ex de,hl
    ld bc,$00ff
    add hl,bc
    ex de,hl
    pop bc
    djnz loop2
    ;attr
    ld hl,attr
    ld a,(spr_x)
    ld e,a
    ld d,0
    add hl,de
    ld a,(spr_y)
    ld e,a
    ld d,0
    sla e
    rl d
    sla e
    rl d
    sla e
    rl d
    sla e
    rl d
    sla e
    rl d
    add hl,de
    ld a,(spr_attr)
    ld (hl),a
    ret

spr2_y:
    db 3 ;not used


spr2_calc:
    ld hl,screen ;calculate y first
    ld a,(spr2_ytemp)
    ld b,a
    and %00000111 ;lower 3 bits go to D
    ld d,a
    ld a,b
    and %11000000 ;which 3rd? upper-mid-bottom
    srl a
    srl a
    srl a
    or d
    ld d,a
    ld a,(spr2_ytemp)
    and %00111000
    sla a
    sla a
    ld e,a
    add hl,de
    ld a,(spr_x) ;calculate x after
    srl a
    srl a
    srl a
    ld e,a
    ld d,0
    add hl,de
    ld (spr2_addr),hl
    ret
sprite2:
    ld a,(spr_y)
    ld (spr2_ytemp),a
    ld a,0
    ld (spr2_bmp_y),a
    ld hl,spr_bmp
    ld a,(spr_idx)
    sla a ;x8
    sla a
    sla a
    ld e,a
    ld d,0
    add hl,de
    ld (spr2_bmp_addr),hl
    ld a,(spr2_height)
    ld b,a
spr2_loop:
    push bc
    call spr2_calc
    ld hl,(spr2_bmp_addr)
    ld a,(spr2_bmp_y)
    ld e,a
    ld d,0
    add hl,de
    ld a,(hl)
    ld e,a
    ld d,0
    ld a,(spr_x)
    and %00000111
    jr z,spr2_skip
    ld b,a
spr2_loop2:
    srl e
    rr d
    djnz spr2_loop2
spr2_skip:
    ld hl,(spr2_addr)
    ld a,(hl)
    or e
    ld (hl),a
    inc hl; can be skipped too
    ld a,(hl)
    or d
    ld (hl),a
    ld hl,spr2_ytemp
    inc (hl)
    ld hl,spr2_bmp_y
    inc (hl)
    pop bc
    djnz spr2_loop
    ret
spr2_addr:
    dw 0
spr2_height:
    db 8
spr2_ytemp:
    db 0
spr2_bmp_y:
    db 0
spr2_bmp_addr:
    dw 0

txt_hello:
db 100
db 80
db "HELLO WORLD 2019@"
txt_abc:
db 10
db 10
db "HELLO WORLD ABCDEFGHIJKLMNOPQRSTUVWXYZ@"
txt_digits:
db 10
db 20
db "THESE ARE THE DIGITS 0123456789@"

pixel_txt:
    ld a,(hl)
    ld (spr_x),a
    inc hl
    ld a,(hl)
    ld (spr_y),a
    inc hl
pxltxt_loop4:
    ld a,(hl)
    push hl
    call pixel_letter
    pop hl
    ld a,(spr_x)
    ld c,a
    ld a,(pxltxt_width)
    add a,c
    ld (spr_x),a
    inc hl
    ld a,64
    cp (hl)
    jr nz, pxltxt_loop4
    ret
pixel_letter:
    cp 32
    jr nz,pxltxt_chk_digits
    ld a,6
    ld (pxltxt_width),a
    ret
pxltxt_chk_digits:
    cp 60
    jr c,pxltxt_digits
pxltxt_atoz:
    ld hl,fonts
    sub 65
    jr z,pxltxt_if_a
    jr pxltxt_skip2
pxltxt_digits:
    ld hl,digits
    sub 48
    jr z,pxltxt_if_a
pxltxt_skip2:      
    ld b,a
    ld de,7
pxltxt_loop3:
    add hl,de
    djnz pxltxt_loop3
pxltxt_if_a:
    ld (spr2_bmp_addr),hl
    ld a,(spr_y)
    ld (spr2_ytemp),a
    ld a,0
    ld (spr2_bmp_y),a
    ld b,6
pxltxt_loop:
    push bc
    call spr2_calc
    ld hl,(spr2_bmp_addr)
    ld a,(hl)
    ld (pxltxt_width),a
    inc hl
    ld a,(spr2_bmp_y)
    ld e,a
    ld d,0
    add hl,de
    ld a,(hl)
    ld e,a
    ld d,0
    ld a,(spr_x)
    and %00000111
    jr z,pxltxt_skip
    ld b,a
pxltxt_loop2:
    srl e
    rr d
    djnz pxltxt_loop2
pxltxt_skip:
    ld a,e
    ld hl,(spr2_addr)
    ld a,(hl)
    or e
    ld (hl),a
    inc hl; can be skipped too
    ld a,(hl)
    or d
    ld (hl),a
    ld hl,spr2_ytemp
    inc (hl)
    ld hl,spr2_bmp_y
    inc (hl)
    pop bc
    djnz pxltxt_loop
    ret
pxltxt_x:
    db 0
pxltxt_width:
    db 0



;graphics
spr_bmp:
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000

db %00111100
db %01001110
db %11011111
db %11111111
db %11111111
db %11111111
db %01111110
db %00111100

db %01100110
db %10011111
db %10111111
db %10111111
db %11111111
db %01111110
db %00111100
db %00011000

fonts:
;A-65
db 6
db %01110000
db %11011000
db %11011000
db %11111000
db %11011000
db %11011000
;B
db 6
db %11110000
db %11011000
db %11110000
db %11011000
db %11011000
db %11110000
;C
db 6
db %01110000
db %11011000
db %11000000
db %11000000
db %11011000
db %01110000
;D
db 6
db %11110000
db %11011000
db %11011000
db %11011000
db %11011000
db %11110000
;E
db 6
db %11111000
db %11000000
db %11110000
db %11000000
db %11000000
db %11111000
;F
db 6
db %11111000
db %11000000
db %11110000
db %11000000
db %11000000
db %11000000
;G
db 6
db %01110000
db %11011000
db %11000000
db %11011000
db %11011000
db %01111000
;H
db 6
db %11011000
db %11011000
db %11111000
db %11011000
db %11011000
db %11011000
;I
db 3
db %11000000
db %11000000
db %11000000
db %11000000
db %11000000
db %11000000
;J
db 5
db %00110000
db %00110000
db %00110000
db %00110000
db %00110000
db %11100000
;K
db 6
db %11011000
db %11011000
db %11110000
db %11011000
db %11011000
db %11011000
;L
db 6
db %11000000
db %11000000
db %11000000
db %11000000
db %11000000
db %11111000
;M
db 8
db %11000110
db %11101110
db %11111110
db %11010110
db %11000110
db %11000110
;N
db 7
db %11001100
db %11101100
db %11111100
db %11011100
db %11001100
db %11001100
;O
db 6
db %01110000
db %11011000
db %11011000
db %11011000
db %11011000
db %01110000
;P
db 6
db %11110000
db %11011000
db %11011000
db %11110000
db %11000000
db %11000000
;Q
db 6
db %01110000
db %11011000
db %11011000
db %11011000
db %10110000
db %01011000
;R
db 6
db %11110000
db %11011000
db %11011000
db %11110000
db %11011000
db %11011000
;S
db 6
db %01110000
db %11000000
db %01110000
db %00011000
db %11011000
db %01110000
;T
db 7
db %11111100
db %00110000
db %00110000
db %00110000
db %00110000
db %00110000
;U
db 6
db %11011000
db %11011000
db %11011000
db %11011000
db %11011000
db %01110000
;V
db 6
db %11011000
db %11011000
db %11011000
db %11111000
db %01110000
db %00100000
;W
db 8
db %11000110
db %11010110
db %11010110
db %11111110
db %01101100
db %01101100
;X
db 6
db %11011000
db %11011000
db %01110000
db %11011000
db %11011000
db %11011000
;Y
db 7
db %11001100
db %11001100
db %01111000
db %00110000
db %00110000
db %00110000
;Z
db 6
db %11111000
db %00011000
db %00110000
db %01100000
db %11000000
db %11111000
digits:
;0-48
db 6
db %01110000
db %11011000
db %11011000
db %11011000
db %11011000
db %01110000
;1
db 4
db %01100000
db %11100000
db %01100000
db %01100000
db %01100000
db %01100000
;2
db 6
db %01110000
db %11011000
db %00011000
db %00110000
db %01100000
db %11111000
;3
db 6
db %01110000
db %11011000
db %00110000
db %00011000
db %11011000
db %01110000
;4
db 6
db %00011000
db %00111000
db %01011000
db %11011000
db %11111000
db %00011000
;5
db 6
db %11111000
db %11000000
db %11110000
db %00011000
db %11011000
db %01110000
;6
db 6
db %01110000
db %11000000
db %11110000
db %11011000
db %11011000
db %01110000
;7
db 6
db %11111000
db %00011000
db %00110000
db %01100000
db %01100000
db %01100000
;8
db 6
db %01110000
db %11011000
db %01110000
db %11011000
db %11011000
db %01110000
;9
db 6
db %01110000
db %11011000
db %11011000
db %01111000
db %00011000
db %01110000


db %11011000
db %11011000
db %11011000
db %11011000
db %01110000