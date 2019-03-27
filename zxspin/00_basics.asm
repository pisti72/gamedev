org 30000
;http://clrhome.org/table/

main: 
      ld a,%00111000
      ld hl,count
      ld b,(hl)
      ld hl,attr

loop: ld (hl),a
      inc hl
      djnz loop

draw_plyr:
      ld hl,coord

      ld hl,bitmap
      ld de,screen
      ld b,8
loop1:
      ldi
      push hl
      ld hl,255
      add hl,de
      ex de,hl
      pop hl
      djnz loop1
      ret

      ld b,8
      ld hl,bitmap
      ld a,(hl)
      ld hl,screen
loop2:      ld (hl),a
      add hl,de
      djnz loop2
      ret

attr: equ $5800
screen: equ $4000
count: defb 32
coord: defb 0,0
bitmap: defb %01100110
        defb %11111111
        defb %10011111
        defb %10111111
        defb %11111111
        defb %01111110
        defb %00111100
        defb %00011000
