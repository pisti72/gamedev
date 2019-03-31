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
    ld ix, vars
    ld a,%01111000
    ld(paper_color),a
    call paper
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
pl_y: db 12

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
    db 3


spr2_calc:
    ld hl,screen ;calculate y first
    ld a,(ix+scr_y)
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
    ld a,(ix+scr_y)
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
    ld (ix + scr_y),a
    ld (ix + bmp_y),0
    ld b,8
spr2_loop:
    push bc
    call spr2_calc
    ld hl,spr_bmp
    ld a,(spr_idx)
    sla a ;x8
    sla a
    sla a
    ld e,a
    ld d,0
    add hl,de
    ld e,(ix + bmp_y)
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
    ld a,e
    ld hl,(spr2_addr)
    ld (hl),a
    inc hl
    ld a,d
    ld (hl),a
    inc (ix+scr_y);
    inc (ix+bmp_y);
    pop bc
    djnz spr2_loop
    ret
spr2_addr:
    dw 0  

scr_y: equ 0
bmp_y: equ 1

vars:
    db 0 ;0 scr_y
    db 0 ;1 bmp_y

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



