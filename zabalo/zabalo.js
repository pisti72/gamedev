/*
var player = {
    x: 0,
    y: 0,
    face: 4,
    xd: 0,
    yd: 0,
    life: 0,
    pont: 0,
    gyors: 0,
    hatas_timer: 0
}
*/

const TITLE_INIC = 1;
const TITLE = 2;
const NEW_LEVEL_INIC = 3;
const NEW_LEVEL = 4;
const INGAME = 5;
const AGAIN_INIC = 6;
const AGAIN = 7;
const GAMEOVER = 8;
const CONGRATULATE = 9;
//int[] enemy_x=new int[20];	// Sz�rnyek x poz�ci�ja
//int[] enemy_y=new int[20];  //Sz�rnyek y poz�ci�ja
//int[] enemy_face=new int[20];	//Sz�rnyek megjelen�si alakja, anim�ci�ja
var enemy_gyors;	//Sz�rnyek aktu�lis sebess�ge
var enemy_hatas_timer = 0;	//Gy�m�lcs hat�s�nak az id�tartama a sz�rnyekre
var gyumi_micsoda;	//Milyen gy�m�lcs, 1P?
var gyumi_x;	//Gy�m�lcs x poz�ci�ja
var gyumi_y;	//Gy�m�lcs y poz�ci�ja
var gyumi_timer = 0;	//Meddig l�that� a gy�m�lcs, ha =0 akkor nincs semmi
var palya;	//p�lya sz�ma
var utem = 0;	//�ltal�nos �tem, ez szab�lyozza a sebess�geket. Pl.: l�p�s, anim�ci�
var szornyek;	//sz�rnyek sz�ma-1
var pressedkey;	//legut�bb lenyomott billenty�. �rt�ke: 1-5
var gamestate = TITLE_INIC;	//program vez�rl�shez haszn�lt
var kaja;	//az aktu�lis p�ly�n l�v� bogy�k sz�ma
var appletsize_x = 31 * 20; // Az applet sz�less�ge pixelben
var appletsize_y = 25 * 20; // Az applet magass�ga pixelben
var tile = 20; //egy k�pelem sz�less�ge, magass�ga pixelben
var mapWidth = 30; //p�lya sz�less�ge
var mapHeight = 24; //p�lya magass�ga
var maxpalya = 4; //p�ly�k sz�ma
var seb_lassu = 14; //h�rom f�le sebess�ge van a j�t�kosnak
var seb_normal = 8;
var seb_gyors = 4;
var gyumi_val = 980;//gyumi el�t�n�si val�sz�n�s�ge. 1000=lehetetlen
var gyumi_hatas = 300;//gyumi hat�s�nak ideje arra, aki felvette
var enemy_seb_lassu = seb_lassu + 2; //h�rom f�le sebess�ge van a sz�rnyeknek
var enemy_seb_normal = seb_normal + 2;
var enemy_seb_gyors = seb_gyors + 2;
var screen = document.getElementById('screen');

document.addEventListener("keydown", function (e) {
    keydown(e);
});
document.addEventListener("keyup", function (e) {
    keyup(e);
});

requestAnimationFrame(zabalo);

function keydown(e) {
    if (e.key == 'ArrowLeft') {
        pressedkey = 1;
    } else if (e.key == 'ArrowRight') {
        pressedkey = 2;
    } else if (e.key == 'ArrowUp') {
        pressedkey = 3;
    } else if (e.key == 'ArrowDown') {
        pressedkey = 4;
    } else {
        pressedkey = 5;
    }
}

function keyup(e) {

}

//sz�rnyek mozgat�sa
function move_enemy() {
    var actors = Map.actors;
    //console.log(actors.length);
    var player;
    var enemies = [];
    for (var i = 0; i < actors.length; i++) {
        var actor = actors[i];
        if (actor.name == 'player') {
            player = actor;
        } else if (actor.name == 'enemy') {
            enemies.push(actor);
        }
    }
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (utem % enemy_gyors == 0) {
            if (
                player.x > enemy.x &&
                Map.getBlock(enemy.x + 1, enemy.y) != "1" &&
                thereIsNoEnemy(enemy.x + 1, enemy.y)) {
                enemy.x++;
            } else if (
                player.x < enemy.x &&
                Map.getBlock(enemy.x - 1, enemy.y) != "1" &&
                thereIsNoEnemy(enemy.x - 1, enemy.y)) {
                enemy.x--;
            } else if (
                player.y > enemy.y &&
                Map.getBlock(enemy.x, enemy.y + 1) != "1" &&
                thereIsNoEnemy(enemy.x, enemy.y + 1)) {
                enemy.y++;
            } else if (
                player.y < enemy.y &&
                Map.getBlock(enemy.x, enemy.y - 1) != "1" &&
                thereIsNoEnemy(enemy.x, enemy.y - 1)) {
                enemy.y--;
            }
            //animation_enemy(i);
        }
    }
}

function thereIsNoEnemy(x, y) {
    var actor = Map.getActorFromHere(x, y);
    if (actor.name != 'enemy') {
        return true;
    }
    return false;
}

//Jatekos mozgatasa
function move_player() {
    var xd_proba = 0;
    var yd_proba = 0;
    var player = Map.getActorByName('player');
    if (utem % player.speed == 0) {
        //milyen gombot nyomt�l le?
        switch (pressedkey) {
            case 1: xd_proba = -1; yd_proba = 0; break;	//balra
            case 2: xd_proba = 1; yd_proba = 0; break;	//jobbra
            case 3: yd_proba = -1; xd_proba = 0; break;	//fel
            case 4: yd_proba = 1; xd_proba = 0; break;	//le
        }
        //mi van, ha a p�lya jobb vagy bal sz�l�n vagyunk?
        if ((player.x == 0) && (xd_proba == -1)) xd_proba = mapWidth;
        if ((player.x == 0) && (player.xd == -1)) player.xd = mapWidth;
        if ((player.x != 0) && (player.xd == mapWidth)) player.xd = -1;

        if ((player.x == mapWidth) && (xd_proba == 1)) xd_proba = -mapWidth;
        if ((player.x == mapWidth) && (player.xd == 1)) player.xd = -mapWidth;
        if ((player.x != mapWidth) && (player.xd == -mapWidth)) player.xd = 1;

        //falon nem tudunk �tmenni
        if (Map.getBlock(player.x + xd_proba, player.y + yd_proba) != "1") {
            player.xd = xd_proba;
            player.yd = yd_proba;
        }
        //bogy� van el�tt�nk?
        if (Map.getBlock(player.x + player.xd, player.y + player.yd) == ".") {
            Map.setBlock(' ', player.x + player.xd, player.y + player.yd);
            player.score += 10;
            kaja--;
        }
        if (Map.getBlock(player.x + player.xd, player.y + player.yd) == " ") {
            player.x += player.xd;
            player.y += player.yd;
        }

        if (player.x < 0) player.x = mapWidth;//ha kimegy�nk a bal oldalon, visszaj�v�nk a jobb oldalon
        if (player.x > mapWidth) player.x = 0;//ha kimegy�nk a jobb oldalon, visszaj�v�nk a bal oldalon
    }
}

function utkozes() {
    var player = Map.getActorByName('player');
    var actors = Map.actors;
    var enemies = [];
    for (var i = 0; i < actors.length; i++) {
        if (actors[i].name == 'enemy') {
            enemies.push(actors[i]);
        }
    }
    for (var i = 0; i < enemies.length; i++) {
        if (player.x == enemies[i].x && player.y == enemies[i].y) {
            player.life--;
            if (player.life < 0) {
                gamestate = GAMEOVER;
            } else {
                gamestate = AGAIN_INIC;
            }
            return true;
        }
    }
    return false;
}

function rand(n) {
    return Math.floor(Math.random() * n);
}

function gyumikezelo() {
    if (rand(1000) % 1000 > gyumi_val && gyumi_timer == 0) {
        gyumi_micsoda = rand(1000) % 6;
        //addig keresg�lj�k a helyet a gy�m�lcsnek, am�g nem a falra dobjuk
        do {
            gyumi_x = rand(1000) % mapWidth;
            gyumi_y = rand(1000) % mapHeight;
        } while (Map.getCell(gyumi_x, gyumi_y) == "1");
        gyumi_timer = rand(1000) % 400 + 200;
    }
    //j�t�kos kapja el a gy�m�lcs�t
    if (gyumi_timer > 0) {
        if (player.x == gyumi_x && player.y == gyumi_y) {
            if (gyumi_micsoda == 0) {
                player.life++;
            } else if (gyumi_micsoda == 1) {
                player.pont += 1000;
            } else if (gyumi_micsoda == 2) {
                player.gyors = seb_gyors;
                player.hatas_timer = gyumi_hatas;
            } else if (gyumi_micsoda == 3) {
                player.gyors = seb_lassu;
                player.hatas_timer = gyumi_hatas;
            } else if (gyumi_micsoda == 4) {
                enemy_gyors = enemy_seb_gyors;
                enemy_hatas_timer = gyumi_hatas;
            } else if (gyumi_micsoda == 5) {
                enemy_gyors = enemy_seb_lassu;
                enemy_hatas_timer = gyumi_hatas;
            }
            gyumi_timer = 0;
        }
    }
    //sz�rny kapja el a gy�m�lcs�t
    if (gyumi_timer > 0) {
        for (var i = 0; i < enemies.length; i++) {
            if (enemies[i].x == gyumi_x && enemies[i].y == gyumi_y) {
                if (gyumi_micsoda == 2) {
                    player.gyors = seb_gyors;
                    player.hatas_timer = gyumi_hatas;
                }
                if (gyumi_micsoda == 3) {
                    player.gyors = seb_lassu;
                    player.hatas_timer = gyumi_hatas;
                }
                if (gyumi_micsoda == 4) {
                    enemy_gyors = enemy_seb_gyors;
                    enemy_hatas_timer = gyumi_hatas;
                }
                if (gyumi_micsoda == 5) {
                    enemy_gyors = enemy_seb_lassu;
                    enemy_hatas_timer = gyumi_hatas;
                }
                gyumi_timer = 0;
            }
        }
    }
    if (player.hatas_timer > 0) {
        player.hatas_timer--;
    } else {
        player.speed = seb_normal;
    }

    if (enemy_hatas_timer > 0) {
        enemy_hatas_timer--;
    } else {
        enemy_gyors = enemy_seb_normal;
    }

    if (gyumi_timer > 0) {
        gyumi_timer--;
    }
}

function palyamegcsinalva() {
    if (Map.gems == 0) {		//p�ly�t megcsin�ltuk?
        if (palya == maxpalya - 1) {
            gamestate = CONGRATULATE;
        } else {	//esetleg ez az utols� p�lya volt? --> gratul�ci�
            palya++;
            gamestate = NEW_LEVEL_INIC;//�j p�lya
        }
    }
}

function jatek() {	//gamestate=5
    move_enemy();		//ellens�g mozgat�sa
    move_player();		//j�t�kos mozgat�sa
    utkozes();			//�tk�z�s figyel�se az ellens�ggel
    //gyumikezelo();		//gy�m�lcs kihelyez�se, majd a vele val� �tk�z�s figyel�se
    palyamegcsinalva();	//p�lya megcsin�lva?
}

function jatekvege() {//gamestate=8
    if (pressedkey == 5) {
        pressedkey = 0;
        gamestate = TITLE_INIC;
    }
}

//nem kell! Törölni!
function megegyszer_inic() {//gamestate=6
    Map.copyLevelToBlock();
    gamestate = AGAIN;
}

function megegyszer() {//gamestate=7
    if (pressedkey == 5) {
        gamestate = INGAME;
    }
}

function ujpalya_inic() {		//gamestate=3
    gyumi_timer = 0;
    gamestate = NEW_LEVEL;
    console.log('NEW LEVEL');
}

function ujpalya() {
    if (pressedkey == 5 || palya == 0) {
        gamestate = INGAME;
    }
}

function gratulalok() {
    if (pressedkey == 5) {
        pressedkey = 0;
        gamestate = TITLE_INIC;
    }
}

function focim_inic() {//gamestate=1
    Map.level = 4;
    Map.copyLevelToBlock();
    var player = Map.getActorByName('player');
    player.life = 3;
    player.score = 0;
    gamestate = TITLE;
    player.speed = seb_normal;
    enemy_gyors = enemy_seb_normal;
    player.hatas_timer = 0;
    enemy_hatas_timer = 0;
    gyumi_timer = 0;
}

function focim() {//2
    if (pressedkey == 5) {
        gamestate = NEW_LEVEL_INIC;
    }
}

function zabalo() {
    switch (gamestate) {
        case TITLE_INIC: focim_inic(); break;
        case TITLE: focim(); break;
        case NEW_LEVEL_INIC: ujpalya_inic(); break;
        case NEW_LEVEL: ujpalya(); break;
        case INGAME: jatek(); break;
        case AGAIN_INIC: megegyszer_inic(); break;
        case AGAIN: megegyszer(); break;
        case GAMEOVER: jatekvege(); break;
        case CONGRATULATE: gratulalok(); break;
    }

    utem++;
    if (utem >= 255) {
        utem = 0;
    }

    screen.innerHTML = Map.render();
    requestAnimationFrame(zabalo);
}

function drawOthers() {
    if (gamestate == TITLE) {//F�c�m kirajzol�sa
        //ZAB�L� felirat
        g.setClip((appletsize_x - 300) / 2, 150, 300, 66);
        g.drawImage(elemek, (appletsize_x - 300) / 2, 150 - 20, this);
        //K�sz�tette...
        g.setClip((appletsize_x - 200) / 2, 220, 240, 12);
        g.drawImage(elemek, (appletsize_x - 200) / 2, 220 - 88, this);
        //Ismertet�
        if ((utem % 4 > 1 && utem > 80) || ((utem > 100) && (utem < 224))) {
            g.setClip(290, 260, 164, 113);
            g.drawImage(elemek, 290 - 207, 260 - 182, this);
            for (var i = 0; i < 6; i++)
                sprite(g, 11 + i, 260, 253 + i * 20);
        }
    }
    if (gamestate == TITLE ||
        gamestate == NEW_LEVEL ||
        gamestate == AGAIN ||
        gamestate == GAMEOVER ||
        gamestate == CONGRATULATE) {
        //Kezd�shez...
        if (utem % 32 > 12) {
            g.setClip((appletsize_x - 257) / 2, appletsize_y - 20 - 20, 257, 20);
            g.drawImage(elemek, (appletsize_x - 257) / 2, appletsize_y - 20 - 20 - 100, this);
        }
    }
    if (gamestate == NEW_LEVEL && palya > 0) {//K�vetkez� p�lya felirat
        g.setClip((appletsize_x - 300) / 2, (appletsize_y - 29) / 2, 300, 29);
        g.drawImage(elemek, (appletsize_x - 300) / 2, (appletsize_y - 29) / 2 - 121, this);
    }
    if (gamestate == INGAME ||
        gamestate == AGAIN ||
        gamestate == GAMEOVER ||
        gamestate == CONGRATULATE) {
        g.setClip(10, 10, 120, 17);//Pont
        g.drawImage(elemek, 10 - 345, 10 - 90, this);
        for (var i = 1; i <= player.life; i++)//�letek
            sprite(g, 17, appletsize_x + (i - elet - 1) * 26, 0);
        g.setClip(0, 0, appletsize_x, appletsize_y);
        g.drawString("" + pont, 10 + 65, 10 + 17);//Pontsz�m
    }
    if (gamestate == GAMEOVER) {
        g.setClip((appletsize_x - 198) / 2, (appletsize_y - 29) / 2, 198, 29);
        g.drawImage(elemek, (appletsize_x - 198) / 2 - 209, (appletsize_y - 29) / 2 - 151, this);
    }
    if (gamestate == 9) {//Gratul�ci� felirat
        g.setClip((appletsize_x - 205) / 2, (appletsize_y - 83) / 2, 205, 83);
        g.drawImage(elemek, (appletsize_x - 205) / 2, (appletsize_y - 83) / 2 - 152, this);
    }
}

