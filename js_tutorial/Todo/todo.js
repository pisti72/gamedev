const KEY = "mytasks";
let colors = ["#FAA","#AFA","#FFA","#AFF"]
let mytasks = localStorage.getItem(KEY);
let input = document.getElementById("input");
if(!mytasks){
    console.log("nincs");
    localStorage.setItem(KEY, "invisible;My first task;My second task");
    mytasks = localStorage.getItem(KEY);
}

let tasks = mytasks.split(';');
createNotes();

function createNotes(){
    for(let i=1;i<tasks.length;i++){
        create(i,tasks[i])
    }
}

function add(){
    let text = input.value;
    tasks.push(text);
    create(tasks.length-1,text);
    input.value = "";
    save();
}

function create(i,text){
    let note = document.createElement("div");
    let att = document.createAttribute("class");
    att.value = "note";
    note.setAttributeNode(att);
    att = document.createAttribute("id");
    att.value = "note"+i;
    note.setAttributeNode(att);
    note.innerHTML=text;
    note.style.backgroundColor = colors[i%colors.length];
    let del = document.createElement("div");
    att = document.createAttribute("onclick");
    att.value = "remove("+i+")";
    del.setAttributeNode(att);
    att = document.createAttribute("class");
    att.value = "delete";
    del.setAttributeNode(att);
    del.innerHTML = "&#9587;";
    note.appendChild(del);
    document.body.appendChild(note);
}

function remove(n){
    tasks.splice(n, 1);
    document.getElementById("note"+n).remove();
    save();
}

function save() {
    let data = tasks.join(";");
    localStorage.setItem(KEY, data);
}