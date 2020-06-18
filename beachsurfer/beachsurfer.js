Surf.tiles = [
    {
        id: 'surf',
        x: 0,
        y: 0,
        width: 32,
        height: 32
    }
];


Surf.init();

for (var i = 0; i < 10; i++) {
    var random = Surf.getRandomXY();
    Surf.addActor(
        {
            name: 'wave',
            tile: 'surf',
            x: random.x,
            y: random.y,
            yd: 4,
            friction: 0
        }
    );
}

Surf.addActor(
    {
        name: 'player',
        tile: 'surf',
        x: Surf.getCenter().x,
        y: Surf.getCenter().y * 1.5,
        friction: 0.02
    }
);

update();
function update() {
    Surf.update();
    requestAnimationFrame(update);
}