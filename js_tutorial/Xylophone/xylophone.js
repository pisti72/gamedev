/**
 * Title: Just a xylophone
 * Author: Istvan Szalontai
 * Created at: 2024-01-13
 * 
 */

magnify = 1

hand_div = f("hand")

hand = {
    x: 0,
    y: 0,
    isBeating: false,
    update: function () {
        let offset = 0
        if (this.isBeating) {
            offset = 50
        }
        if (this.y < 60) {
            this.y = 60
        }
        hand_div.style.left = (this.x - 30) + "px"
        hand_div.style.top = (this.y + offset - 30) + "px"
    }
}

notes = [
    { file: "assets/1.ogg", left: 94, right: 196 },
    { file: "assets/2.ogg", left: 196, right: 270 },
    { file: "assets/3.ogg", left: 270, right: 355 },
    { file: "assets/4.ogg", left: 355, right: 430 },
    { file: "assets/5.ogg", left: 430, right: 525 },
    { file: "assets/6.ogg", left: 525, right: 605 },
    { file: "assets/7.ogg", left: 605, right: 680 },
    { file: "assets/8.ogg", left: 680, right: 780 },
]

for (let i = 0; i < notes.length; i++) {
    let audio = document.createElement("audio");
    audio.src = notes[i].file
    notes[i].audio = audio
}

f("container").addEventListener('mousemove', function (event) {
    hand.x = event.pageX;
    hand.y = event.pageY;
    if (hand.isBeating) {
        for (let i = 0; i < notes.length; i++) {
            let note = notes[i]
            if (hand.x > note.left * magnify && hand.x <= note.right * magnify) {
                note.audio.play()
            }
        }
    }
    hand.update()
})

f("container").addEventListener('mousedown', function (event) {
    hand.isBeating = true
    for (let i = 0; i < notes.length; i++) {
        let note = notes[i]
        if (hand.x > note.left * magnify && hand.x <= note.right * magnify) {
            note.audio.currentTime = 0
            note.audio.play()
        }
    }
    hand.update()
})

f("container").addEventListener('mouseup', function (event) {
    hand.isBeating = false
    hand.update()
})

window.addEventListener("resize", function () {
    let w = document.body.clientWidth;
    let h = document.body.clientHeight;
    let board_div = f("board")
    let container = f("container")
    board_div.style.width = w + "px"
    board_div.style.height = h + "px"
    container.style.width = w + "px"
    container.style.height = h + "px"
    board_div.style.backgroundSize = w + "px " + h + "px"
    magnify = w / 900
    let hand_width = Math.floor(420 * magnify)
    let hand_height = Math.floor(420 * magnify)
    hand_div.style.width = hand_width + "px"
    hand_div.style.height = hand_height + "px"
})

function f(n) {
    return document.getElementById(n)
}
