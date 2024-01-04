/*
 *   https://www.irish-folk-songs.com/the-wheels-on-the-bus-go-round-and-round-tin-whistle-notes.html
 *   https://itch.io/jam/synth-jam
 */
const VERSION = "v 0.1"

isRecording = false
recordingArray = []
recordingResult = ""
isPlaying = false
counter = 0

const notes = [
  { idx: 0, id: "c4", idpressed: "c4pressed", key: "KeyZ", audio: f("c4grand"), pressed: false, start: 0, end: 1.60 },
  { idx: 1, id: "d4", idpressed: "d4pressed", key: "KeyX", audio: f("d4grand"), pressed: false, start: 1.71, end: 3.3 },
  { idx: 2, id: "e4", idpressed: "e4pressed", key: "KeyC", audio: f("e4grand"), pressed: false, start: 3.42, end: 5.0 },
  { idx: 3, id: "f4", idpressed: "f4pressed", key: "KeyV", audio: f("f4grand"), pressed: false, start: 5.13, end: 6.7 },
  { idx: 4, id: "g4", idpressed: "g4pressed", key: "KeyB", audio: f("g4grand"), pressed: false, start: 6.84, end: 8.3 },
  { idx: 5, id: "a4", idpressed: "a4pressed", key: "KeyN", audio: f("a4grand"), pressed: false, start: 8.56, end: 10.0 },
  { idx: 6, id: "b4", idpressed: "b4pressed", key: "KeyM", audio: f("b4grand"), pressed: false, start: 10.27, end: 11.9 },
  { idx: 7, id: "c5", idpressed: "c5pressed", key: "Comma", audio: f("c5grand"), pressed: false, start: 11.98, end: 13.5 },
  { idx: 8, id: "cis4", idpressed: "cis4pressed", key: "KeyS", audio: f("cis4grand"), pressed: false, start: 15.42, end: 17.0 },
  { idx: 9, id: "dis4", idpressed: "dis4pressed", key: "KeyD", audio: f("dis4grand"), pressed: false, start: 17.13, end: 18.7 },
  { idx: 10, id: "fis4", idpressed: "fis4pressed", key: "KeyG", audio: f("fis4grand"), pressed: false, start: 18.84, end: 20.4 },
  { idx: 11, id: "gis4", idpressed: "gis4pressed", key: "KeyH", audio: f("gis4grand"), pressed: false, start: 20.56, end: 22.1 },
  { idx: 12, id: "ais4", idpressed: "ais4pressed", key: "KeyJ", audio: f("ais4grand"), pressed: false, start: 22.27, end: 23.7 },

]
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
  if (e.code == "KeyR") {
    recordingPressed()
  } else if (e.code == "KeyP") {
    playingOn()
  }

  for (i = 0; i < songs.length; i++) {
    if (e.code == songs[i].key) {
      recordingArray = songs[i].sequence
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