actors = {
    stored: [],
    add: function (x, y) {
        this.stored.push({
            color: '#000',
            x: x,
            y: y
        })
    },
    get: function (n) {
        return this.stored[n];
    },
    test: function () {
        this.add(2, 3);
        this.add(4, 5);
        if (this.get(0).x = 2) {
            console.log('passed');
        } else { console.log('failed'); }
    }
}