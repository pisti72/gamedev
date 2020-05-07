var id = 0;

jQuery(document).ready(function ($) {
    $('body').terminal(function (command, term) {
        if (command == 'help') {
            term.echo("Lehetséges parancsok:\n'n' - Észak felé indulás\n's' - Dél felé indulás\n'w' - Nyugat felé indulás\n'e' - Kelet felé indulás\n'help' - Segítség kérése\n'map' - Térkép\n'download' - Forrás letőltése");
        } else if (command == 'n') {
            term.echo(moveRoom('n'));
        } else if (command == 's') {
            term.echo(moveRoom('s'));
        } else if (command == 'e') {
            term.echo(moveRoom('e'));
        } else if (command == 'w') {
            term.echo(moveRoom('w'));
        } else if (command == 'map') {
            window.open('budnightmap.png', '_blank');
        } else if (command == 'download') {
            window.open('BUDNIGHT_JF2016.ZIP');
        } else {
            term.echo("Nincs ilyen parancs, hogy " + command + "\nHa segítség kell írd be a help parancsot.");
        }
    }, {
        greetings: "BUDAPESTI ÉJSZAKA\n\nKészítette: Szalontai István JFHU 2016 alkalmából\n\nÜdvözöllek ebben a szöveges kalandjátékban.\nA játék célja, hogy megfejtsd mi történt veled az éjszaka.\n\n" + getRoom(),
        onBlur: function () {
            // prevent loosing focus
            return false;
        }
    });
});

function moveRoom(move) {
    room = data.room[id];
    if (move == 'n' && room.direction.north != undefined) {
        id = room.direction.north;
        return getRoom();
    } else if (move == 's' && room.direction.south != undefined) {
        id = room.direction.south;
        return getRoom();
    } else if (move == 'e' && room.direction.east != undefined) {
        id = room.direction.east;
        return getRoom();
    } else if (move == 'w' && room.direction.west != undefined) {
        id = room.direction.west;
        return getRoom();
    } else {
        return 'Ebbe az irányba nem mehetsz';
    }
}

function getRoom() {
    return data.room[id].title + "\n" + data.room[id].description;
}
