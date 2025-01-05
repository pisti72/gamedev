const snd_enter = document.getElementById("snd_enter")
const snd_computer = document.getElementById("snd_computer")
snd_computer.loop = true
snd_computer.play()

var snd_typing = []
snd_typing[0] = document.getElementById("snd_typing1")
snd_typing[1] = document.getElementById("snd_typing2")
snd_typing[2] = document.getElementById("snd_typing3")
snd_typing_counter = 0

var snd_delete = []
snd_delete[0] = document.getElementById("snd_delete1")
snd_delete[1] = document.getElementById("snd_delete2")
snd_delete[2] = document.getElementById("snd_delete3")
snd_delete_counter = 0

const canvas = document.createElement("canvas")
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
const w = canvas.width = document.body.clientWidth;
const h = canvas.height = document.body.clientHeight;
const scanline_img = new Image()
//ctx.font = "30px noveau";
ctx.font = "30px flexi";
document.addEventListener("keydown", function (e) {
    keydown(e)
})

scanline_img.src = "scanline.png"

var t = 0
var thinking = 0
var input_txt = ""
var row = 1
var rows = []
var char_height = 30
game_loop()
function keydown(e) {
    if (e.key.length > 1) {
        if (e.key == "Backspace") {
            play_delete()
            input_txt = input_txt.substring(0, input_txt.length - 1)
        } else if (e.key == "Enter") {
            snd_enter.play()
            if (input_txt.length > 0 && thinking == 0) {
                row++
                rows.push(input_txt)
                row++
                var answer = process_input(input_txt)
                rows.push(answer.text)
                thinking = answer.thinking
                input_txt = ""
            }
        }
    } else {
        play_typing()
        input_txt += e.key
    }

}
function play_typing() {
    if (snd_typing_counter < snd_typing.length - 1) {
        snd_typing_counter++
    } else {
        snd_typing_counter = 0
    }
    snd_typing[snd_typing_counter].play()
}

function play_delete() {
    if (snd_delete_counter < snd_delete.length - 1) {
        snd_delete_counter++
    } else {
        snd_delete_counter = 0
    }
    snd_delete[snd_delete_counter].play()
}

function process_input(text) {
    let t = text.toLowerCase(text)
    let is_help = t.indexOf("help") != -1
    let is_hello = t.indexOf("hello") != -1 || t.indexOf("hi") != -1
    if (t.length < 10) {
        if (is_help) {
            return { text: "There is no help", thinking: 20 }
        }else if (is_hello) {
            return { text: "Hello my friend!", thinking: 20 }
        } else {
            return { text: "Sorry, I do not understand", thinking: 20 }
        }
    }else {
        return { text: "Sorry, I do not understand", thinking: 20 }
    }
}

function game_loop() {
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = "#0f0"
    var cursor = ""
    if (t % 60 > 30) {
        cursor = "_"
    }
    for (var i = 0; i < rows.length; i++) {
        var text = rows[i]
        if (i == (rows.length - 1) && thinking > 0) {
            var k = Math.floor(thinking / 20) % 3
            var dot = "..."
            if (k == 0) {
                dot = ".."
            } else if (k == 1) {
                dot = "."
            }
            text = "typing" + dot
        }
        ctx.fillText("  " + text, 10, 50 + i * char_height);
    }
    ctx.fillText("> " +
        input_txt + cursor, 10, 50 + (row - 1) * char_height);
    ctx.drawImage(scanline_img, 0, 0)
    t++
    if (thinking > 0) {
        thinking--
    }
    requestAnimationFrame(game_loop)
}