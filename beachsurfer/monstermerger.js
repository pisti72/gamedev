Surf.tiles = [
    {
        id: 'surf',
        x: 0,
        y: 0,
        width: 16,
        height: 16
    }
];

Surf.init();

Surf.addActor(
    {
        name: 'monster',
        tile: 'surf',
        x: Surf.getCenter().x,
        y: Surf.getCenter().y,
        friction: 0.5
    }
);

update();
function update() {
    Surf.update();
    requestAnimationFrame(update);
}