/*
 *   https://www.irish-folk-songs.com/the-wheels-on-the-bus-go-round-and-round-tin-whistle-notes.html
 *   https://itch.io/jam/synth-jam
 * 
 *   https://virtualpiano.net/
 */
const VERSION = "v 0.1"

isRecording = false
recordingArray = []
recordingResult = ""
recordingNormalized = ""
isPlaying = false
counter = 0

const NOTE = 0
const HALFNOTE = 1
const DRUM = 2

const notes = [
  { idx: 0, id: "c4", idpressed: "c4pressed", key: "KeyZ", pressed: false, start: 0, end: 1.60, type: NOTE },
  { idx: 1, id: "d4", idpressed: "d4pressed", key: "KeyX", pressed: false, start: 1.71, end: 3.3, type: NOTE },
  { idx: 2, id: "e4", idpressed: "e4pressed", key: "KeyC", pressed: false, start: 3.42, end: 5.0, type: NOTE },
  { idx: 3, id: "f4", idpressed: "f4pressed", key: "KeyV", pressed: false, start: 5.13, end: 6.7, type: NOTE },
  { idx: 4, id: "g4", idpressed: "g4pressed", key: "KeyB", pressed: false, start: 6.84, end: 8.3, type: NOTE },
  { idx: 5, id: "a4", idpressed: "a4pressed", key: "KeyN", pressed: false, start: 8.56, end: 10.0, type: NOTE },
  { idx: 6, id: "b4", idpressed: "b4pressed", key: "KeyM", pressed: false, start: 10.27, end: 11.9, type: NOTE },
  { idx: 7, id: "cis4", idpressed: "cis4pressed", key: "KeyS", pressed: false, start: 13.70, end: 15.3, type: HALFNOTE },
  { idx: 8, id: "dis4", idpressed: "dis4pressed", key: "KeyD", pressed: false, start: 15.42, end: 17.0, type: HALFNOTE },
  { idx: 9, id: "fis4", idpressed: "fis4pressed", key: "KeyG", pressed: false, start: 17.13, end: 18.7, type: HALFNOTE },
  { idx: 10, id: "gis4", idpressed: "gis4pressed", key: "KeyH", pressed: false, start: 18.84, end: 20.4, type: HALFNOTE },
  { idx: 11, id: "ais4", idpressed: "ais4pressed", key: "KeyJ", pressed: false, start: 20.56, end: 22.1, type: HALFNOTE },
  { idx: 12, id: "c5", idpressed: "c5pressed", key: "KeyQ", pressed: false, start: 23.96, end: 25.0, type: NOTE },
  { idx: 13, id: "d5", idpressed: "d5pressed", key: "KeyW", pressed: false, start: 25.68, end: 27.3, type: NOTE },
  { idx: 14, id: "e5", idpressed: "e5pressed", key: "KeyE", pressed: false, start: 27.42, end: 29.0, type: NOTE },
  { idx: 15, id: "f5", idpressed: "f5pressed", key: "KeyR", pressed: false, start: 29.13, end: 30.7, type: NOTE },
  { idx: 16, id: "g5", idpressed: "g5pressed", key: "KeyT", pressed: false, start: 30.84, end: 32.3, type: NOTE },
  { idx: 17, id: "a5", idpressed: "a5pressed", key: "KeyY", pressed: false, start: 32.56, end: 34.0, type: NOTE },
  { idx: 18, id: "b5", idpressed: "b5pressed", key: "KeyU", pressed: false, start: 34.27, end: 35.9, type: NOTE },
  { idx: 19, id: "cis5", idpressed: "cis5pressed", key: "Digit2", pressed: false, start: 37.71, end: 39.0, type: HALFNOTE },
  { idx: 20, id: "dis5", idpressed: "dis5pressed", key: "Digit3", pressed: false, start: 39.42, end: 41.0, type: HALFNOTE },
  { idx: 21, id: "fis5", idpressed: "fis5pressed", key: "Digit5", pressed: false, start: 41.13, end: 42.7, type: HALFNOTE },
  { idx: 22, id: "gis5", idpressed: "gis5pressed", key: "Digit6", pressed: false, start: 42.85, end: 44.0, type: HALFNOTE },
  { idx: 23, id: "ais5", idpressed: "ais5pressed", key: "Digit7", pressed: false, start: 44.56, end: 46.3, type: HALFNOTE },

  { idx: 24, id: "snare", idpressed: "drum1", key: "KeyO", pressed: false, start: 47.99, end: 48.4, type: DRUM },
  { idx: 25, id: "hihat", idpressed: "drum2", key: "KeyP", pressed: false, start: 51.41, end: 51.9, type: DRUM },
  { idx: 26, id: "drum", idpressed: "drum3", key: "KeyL", pressed: false, start: 54.84, end: 55.6, type: DRUM },
  { idx: 27, id: "kick", idpressed: "drum4", key: "KeyK", pressed: false, start: 58.27, end: 58.7, type: DRUM },

]

createAudio()
createSongDivs()
createNoteDivs()

f("version").innerHTML = VERSION;

document.addEventListener("keydown", function (e) {
  //f("debug").innerHTML = e.code

  for (i = 0; i < notes.length; i++) {
    let note = notes[i]
    if (e.code == note.key && !note.pressed) {
      playNote(note)
      recordNote(note, "pressed")
    }
  }
  if (e.code == "Space") {
    recordingPressed()
  } else if (e.code == "Enter") {
    playingOn()
  }

  for (i = 0; i < songs.length; i++) {
    if (e.code == songs[i].key) {
      recordingArray = songs[i].sequence
      recordingNormalizer()
      playingOn()
    }
  }
})
document.addEventListener("keyup", function (e) {
  for (i = 0; i < notes.length; i++) {
    if (e.code == notes[i].key) {
      stopNote(notes[i])
      if (isRecording) {
        let snapshot = {
          event: "released",
          idx: i,
          timestamp: counter
        }
        recordingArray.push(snapshot)
      }
    }
  }
})

for (i = 0; i < notes.length; i++) {
  let note = notes[i]
  f(note.idpressed).addEventListener("mousedown", function (e) {
    if (!note.pressed) {
      playNote(note)
      recordNote(note, "pressed")
    }
  })

  f(note.idpressed).addEventListener("mouseup", function (e) {
    stopNote(note)
    recordNote(note, "released")
  })
}

for (i = 0; i < songs.length; i++) {
  let song = songs[i]
  f(song.button).addEventListener("mousedown", function (e) {
    recordingArray = song.sequence
    playingOn()
  })
}

f("recording_button").addEventListener("mousedown", function (e) {
  recordingPressed()
})

f("playing_button").addEventListener("mousedown", function (e) {
  playingOn()
})


update()

function createAudio() {
  const audio = document.createElement("audio");
  audio.src = "notes/all_audio.ogg"
  //audio.play()
  //console.log("played")
  //document.body.appendChild(audio);
  for (i = 0; i < notes.length; i++) {
    let note = notes[i]
    note.audio = audio.cloneNode(false)
  }
}

function createSongDivs() {
  for (i = 0; i < songs.length; i++) {
    div_button = document.createElement("div");
    div_button.id = "song" + (i + 1)
    div_button.className = "button"
    f("songs_container").appendChild(div_button)
    div_text = document.createElement("div");
    div_text.innerHTML = "[" + songs[i].symbol + "] " + songs[i].name
    div_text.id = "song" + (i + 1) + "_text"
    div_text.className = "white_text"
    f("songs_container").appendChild(div_text)
  }
}

function createNoteDivs() {
  for (i = 0; i < notes.length; i++) {
    let note = notes[i]
    if(note.type == NOTE){
      div = document.createElement("div");
      div.id = note.id
      div.className = "note"
      div.innerHTML = note.id.toUpperCase()
      f("notes-image").appendChild(div)
      div = document.createElement("div");
      div.id = note.id + "pressed"
      div.className = "note-pressed"
      f("notes-pressed").appendChild(div)
    }else if(note.type == HALFNOTE){
      div = document.createElement("div");
      div.id = note.id
      div.className = "halfnote"
      f("halfnotes-image").appendChild(div)
      div = document.createElement("div");
      div.id = note.id + "pressed"
      div.className = "halfnote-pressed"
      f("halfnotes-pressed").appendChild(div)
    }
  }
}

function recordingPressed() {
  if (!isPlaying) {
    if (isRecording) {
      isRecording = false
      recordingResult = JSON.stringify(recordingArray)
      visible("recording")
      hide("recording_on")
    } else {
      isRecording = true
      playingOff()
      recordingArray = []
    }
  }
}

function recordingNormalizer() {
  differences = []
  for (i = 0; i < recordingArray.length - 1; i++) {
    d = recordingArray[i + 1].timestamp - recordingArray[i].timestamp
    differences.push(d)
  }
}

function playingOn() {
  isPlaying = true
  counter = 0
}

function playingOff() {
  isPlaying = false
  visible("playing")
  hide("playing_on")
  counter = 0
}

function recordNote(note, e) {
  if (isRecording) {
    if (recordingArray.length == 0) {
      counter = 0;
    }
    let snapshot = {
      event: e,
      idx: note.idx,
      timestamp: counter
    }
    recordingArray.push(snapshot)
  }
}

function playNote(note) {
  //f("debug").innerHTML = note.idx
  f(note.idpressed).style.backgroundColor = "rgba(20,20,20,.3)"
  note.audio.currentTime = note.start;
  note.audio.play()
  note.pressed = true
}

function stopNote(note) {
  f(note.idpressed).style.backgroundColor = "rgba(20,20,20,0)"
  note.pressed = false
}

function update() {
  //f("debug").innerHTML = recordingArray.length
  //f("recording").innerHTML = isRecording
  //f("playing").innerHTML = isPlaying
  for (i = 0; i < notes.length; i++) {
    let note = notes[i]
    if (note.audio.currentTime > note.end) {
      note.audio.currentTime = note.audio.duration
    }
  }

  if (isRecording) {
    if (counter % 60 > 30) {
      visible("recording")
      hide("recording_on")
    } else {
      hide("recording")
      visible("recording_on")
    }
  }

  if (isPlaying) {
    if (recordingArray.length == 0) {
      playingOff()
    } else {
      if (counter % 60 > 30) {
        visible("playing")
        hide("playing_on")
      } else {
        hide("playing")
        visible("playing_on")
      }
      for (i = 0; i < recordingArray.length; i++) {
        let snapshot = recordingArray[i]
        if (snapshot.timestamp == counter) {
          if (snapshot.event == "pressed") {
            playNote(notes[snapshot.idx])
          } else {
            stopNote(notes[snapshot.idx])
          }
          if (i == recordingArray.length - 1) {
            playingOff()
          }
        }
      }
    }

  }
  counter++;
  requestAnimationFrame(update)
}

function hide(n) {
  f(n).style.display = "none";
}

function visible(n) {
  f(n).style.display = "block";
}

function f(n) {
  return document.getElementById(n)
}