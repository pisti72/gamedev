Surf.tiles = [
    {
        id: 'surf',
        x: 8,
        y: 8,
        width: 20,
        height: 20
    },
    {
        id: 'surf2',
        x: 33,
        y: 2,
        width: 20,
        height: 27
    },
    {
        id: 'surf3',
        x: 54,
        y: 7,
        width: 37,
        height: 23
    },
    {
        id: 'surf4',
        x: 94,
        y: 1,
        width: 24,
        height: 43
    }
];

Surf.init();

Surf.addActor(
    {
        name: 'green',
        tile: 'surf',
        x: Surf.getCenter().x,
        y: Surf.getCenter().y,
        friction: 0.5
    }
);

Surf.addActor(
    {
        name: 'blue',
        tile: 'surf2',
        x: Surf.getCenter().x,
        y: Surf.getCenter().y,
        friction: 0.5
    }
);

Surf.addActor(
    {
        name: 'orange',
        tile: 'surf3',
        x: Surf.getCenter().x,
        y: Surf.getCenter().y,
        friction: 0.5
    }
);

Surf.addActor(
    {
        name: 'darkred',
        tile: 'surf4',
        x: Surf.getCenter().x,
        y: Surf.getCenter().y,
        friction: 0.5
    }
);

update();
function update() {
    Surf.update();
    if(Surf.tick(100)) {
        Surf.spawn('green');
    }
    requestAnimationFrame(update);
}