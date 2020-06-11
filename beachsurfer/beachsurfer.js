Surf.tiles = [
    {
        id: 'player',
        x: 0,
        y: 0,
        width: 32,
        height: 32
    }
];

Surf.addActor(
    {
        tile: 'player',
        x: 20,
        y: 20,
        xd: 2,
        yd: 1,
    }
);
Surf.init();
update();
function update() {
    Surf.update();
    requestAnimationFrame(update);
}