// Zabalo - Canvas-based JavaScript recreation
// Based on the original Java applet by Kőrösi Tibor

const TILE = 20;
const MAP_WIDTH = 30;
const MAP_HEIGHT = 26;
const MAX_PALYA = 6;
const START_LEVEL = 0; // Change this to test specific levels (0-5)
const SEB_LASSU = 14;
const SEB_NORMAL = 8;
const SEB_GYORS = 4;
const GYUMI_VAL = 980;
const GYUMI_HATAS = 300;

// Player class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.face = 4;
        this.dx = 0;
        this.dy = 0;
        this.speed = SEB_NORMAL;
        this.effectTimer = 0;
        this.score = 0;
        this.lives = 3;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setSpeed(speed) {
        this.speed = speed;
        this.effectTimer = GYUMI_HATAS;
    }

    updateEffect() {
        if (this.effectTimer > 0) {
            this.effectTimer--;
        } else {
            this.speed = SEB_NORMAL;
        }
    }

    move(gameMap, pressedKey, utem) {
        let dx_proba = 0;
        let dy_proba = 0;

        if (utem % this.speed === 0) {
            // Handle key press
            switch(pressedKey) {
                case 1: dx_proba = -1; dy_proba = 0; break;
                case 2: dx_proba = 1; dy_proba = 0; break;
                case 3: dy_proba = -1; dx_proba = 0; break;
                case 4: dy_proba = 1; dx_proba = 0; break;
            }

            // Handle wraparound
            if (this.x === 0 && dx_proba === -1) dx_proba = MAP_WIDTH;
            if (this.x === 0 && this.dx === -1) this.dx = MAP_WIDTH;
            if (this.x !== 0 && this.dx === MAP_WIDTH) this.dx = -1;

            if (this.x === MAP_WIDTH && dx_proba === 1) dx_proba = -MAP_WIDTH;
            if (this.x === MAP_WIDTH && this.dx === 1) this.dx = -MAP_WIDTH;
            if (this.x !== MAP_WIDTH && this.dx === -MAP_WIDTH) this.dx = 1;

            // Check wall collision
            if (gameMap.getTile(this.x + dx_proba, this.y + dy_proba) !== '1') {
                this.dx = dx_proba;
                this.dy = dy_proba;
            }

            // Check for gem
            if (gameMap.getTile(this.x + this.dx, this.y + this.dy) === '.') {
                gameMap.setTile(this.x + this.dx, this.y + this.dy, ' ');
                this.score += 10;
                gameMap.gemsRemaining--;
            }

            if (gameMap.getTile(this.x + this.dx, this.y + this.dy) === ' ') {
                this.x += this.dx;
                this.y += this.dy;

                if (this.dx === -1) {
                    this.face = this.face === 4 ? 5 : 4;
                }
                if (this.dx === 1) {
                    this.face = this.face === 6 ? 7 : 6;
                }
                if (this.dy === 1 || this.dy === -1) {
                    this.animate();
                }
            }

            if (this.x < 0) this.x = MAP_WIDTH;
            if (this.x > MAP_WIDTH) this.x = 0;
        }
    }

    animate() {
        switch (this.face) {
            case 4: this.face = 5; break;
            case 5: this.face = 4; break;
            case 6: this.face = 7; break;
            case 7: this.face = 6; break;
        }
    }

    render(ctx, elemek) {
        ctx.drawImage(elemek, this.face * TILE, 0, TILE, TILE, 
                     this.x * TILE, this.y * TILE, TILE, TILE);
    }
}

// Enemy class
class Enemy {
    constructor(x, y, faceIndex) {
        this.x = x;
        this.y = y;
        this.face = faceIndex;
        this.speed = SEB_NORMAL + 2;
        this.effectTimer = 0;
        this.seb_lassu = SEB_LASSU + 2;
        this.seb_normal = SEB_NORMAL + 2;
        this.seb_gyors = SEB_GYORS + 2;
    }

    setSpeed(speed) {
        this.speed = speed;
        this.effectTimer = GYUMI_HATAS;
    }

    updateEffect() {
        if (this.effectTimer > 0) {
            this.effectTimer--;
        } else {
            this.speed = this.seb_normal;
        }
    }

    move(player, gameMap, enemies, utem) {
        if (utem % this.speed === 0) {
            let moved = false;

            if (player.x > this.x && 
                gameMap.getTile(this.x + 1, this.y) !== '1' && 
                !this.isEnemyAt(this.x + 1, this.y, enemies)) {
                this.x++;
                moved = true;
            }
            if (player.x < this.x && 
                gameMap.getTile(this.x - 1, this.y) !== '1' && 
                !this.isEnemyAt(this.x - 1, this.y, enemies)) {
                this.x--;
                moved = true;
            }
            if (player.y > this.y && 
                gameMap.getTile(this.x, this.y + 1) !== '1' && 
                !moved && 
                !this.isEnemyAt(this.x, this.y + 1, enemies)) {
                this.y++;
            }
            if (player.y < this.y && 
                gameMap.getTile(this.x, this.y - 1) !== '1' && 
                !moved && 
                !this.isEnemyAt(this.x, this.y - 1, enemies)) {
                this.y--;
            }
            this.animate();
        }
    }

    isEnemyAt(x, y, enemies) {
        return enemies.some(enemy => enemy !== this && enemy.x === x && enemy.y === y);
    }

    animate() {
        switch (this.face) {
            case 9: this.face = 8; break;
            case 8: this.face = 9; break;
            case 19: this.face = 18; break;
            case 18: this.face = 19; break;
        }
    }

    render(ctx, elemek) {
        ctx.drawImage(elemek, this.face * TILE, 0, TILE, TILE, 
                     this.x * TILE, this.y * TILE, TILE, TILE);
    }
}

// GameMap class
class GameMap {
    constructor() {
        this.tiles = [];
        this.gemsRemaining = 0;
        for (let i = 0; i <= MAP_WIDTH; i++) {
            this.tiles[i] = [];
        }
    }

    loadLevel(levelIndex) {
        this.gemsRemaining = 0;
        const level = Map.levels[levelIndex];
        const playerPos = { x: 0, y: 0 };
        const enemyPositions = [];

        for (let j = 0; j < level.length; j++) {
            for (let i = 0; i <= MAP_WIDTH; i++) {
                this.tiles[i][j] = level[j].charAt(i);

                if (this.tiles[i][j] === '2') {
                    playerPos.x = i;
                    playerPos.y = j;
                    this.tiles[i][j] = ' ';
                }
                if (this.tiles[i][j] === '3') {
                    enemyPositions.push({ x: i, y: j });
                    this.tiles[i][j] = '.';
                }
                if (this.tiles[i][j] === '.') {
                    this.gemsRemaining++;
                }
            }
        }

        return { playerPos, enemyPositions };
    }

    resetPositions(levelIndex) {
        const level = Map.levels[levelIndex];
        const playerPos = { x: 0, y: 0 };
        const enemyPositions = [];

        for (let j = 0; j < level.length; j++) {
            for (let i = 0; i <= MAP_WIDTH; i++) {
                const tile = level[j].charAt(i);
                
                if (tile === '2') {
                    playerPos.x = i;
                    playerPos.y = j;
                }
                if (tile === '3') {
                    enemyPositions.push({ x: i, y: j });
                }
            }
        }

        return { playerPos, enemyPositions };
    }

    getTile(x, y) {
        return this.tiles[x] ? this.tiles[x][y] : undefined;
    }

    setTile(x, y, value) {
        if (this.tiles[x]) {
            this.tiles[x][y] = value;
        }
    }

    render(ctx, elemek, levelIndex) {
        for (let j = 0; j <= MAP_HEIGHT; j++) {
            for (let i = 0; i <= MAP_WIDTH; i++) {
                if (this.tiles[i][j] === '1') {
                    ctx.drawImage(elemek, (levelIndex % 4) * TILE, 0, TILE, TILE, 
                                i * TILE, j * TILE, TILE, TILE);
                }
                if (this.tiles[i][j] === '.') {
                    ctx.drawImage(elemek, 10 * TILE, 0, TILE, TILE, 
                                i * TILE, j * TILE, TILE, TILE);
                }
            }
        }
    }
}

// Fruit/Powerup class
class Fruit {
    constructor() {
        this.type = 0;
        this.x = 0;
        this.y = 0;
        this.timer = 0;
    }

    spawn(gameMap) {
        if (Math.random() * 1000 > GYUMI_VAL && this.timer === 0) {
            this.type = Math.floor(Math.random() * 6);

            do {
                this.x = Math.floor(Math.random() * MAP_WIDTH);
                this.y = Math.floor(Math.random() * MAP_HEIGHT);
            } while (gameMap.getTile(this.x, this.y) === '1');

            this.timer = Math.floor(Math.random() * 400) + 200;
        }
    }

    update() {
        if (this.timer > 0) this.timer--;
    }

    checkCollision(player, enemies) {
        if (this.timer === 0) return;

        // Player collision
        if (player.x === this.x && player.y === this.y) {
            this.applyEffect(player);
            this.timer = 0;
            return;
        }

        // Enemy collision
        for (let enemy of enemies) {
            if (enemy.x === this.x && enemy.y === this.y) {
                this.applyEffectToEnemy(player, enemy);
                this.timer = 0;
                return;
            }
        }
    }

    applyEffect(player) {
        switch(this.type) {
            case 0: player.lives++; break;
            case 1: player.score += 1000; break;
            case 2: player.setSpeed(SEB_GYORS); break;
            case 3: player.setSpeed(SEB_LASSU); break;
        }
    }

    applyEffectToEnemy(player, enemy) {
        switch(this.type) {
            case 2: player.setSpeed(SEB_GYORS); break;
            case 3: player.setSpeed(SEB_LASSU); break;
            case 4: enemy.setSpeed(enemy.seb_gyors); break;
            case 5: enemy.setSpeed(enemy.seb_lassu); break;
        }
    }

    render(ctx, elemek) {
        if (this.timer > 0) {
            ctx.drawImage(elemek, (this.type + 11) * TILE, 0, TILE, TILE, 
                         this.x * TILE, this.y * TILE, TILE, TILE);
        }
    }
}

// UI Renderer class
class UIRenderer {
    static renderTitleScreen(ctx, elemek, canvasWidth, canvasHeight, utem) {
        // ZABÁLÓ text
        ctx.save();
        ctx.beginPath();
        ctx.rect((canvasWidth - 300) / 2, 150, 300, 66);
        ctx.clip();
        ctx.drawImage(elemek, 0, 20, 300, 66, 
                     (canvasWidth - 300) / 2, 150, 300, 66);
        ctx.restore();

        // Created by text
        ctx.save();
        ctx.beginPath();
        ctx.rect((canvasWidth - 200) / 2, 220, 240, 12);
        ctx.clip();
        ctx.drawImage(elemek, 0, 88, 240, 12, 
                     (canvasWidth - 200) / 2, 220, 240, 12);
        ctx.restore();

        // Instructions with blinking effect
        if ((utem % 4 > 1 && utem > 80) || (utem > 100 && utem < 224)) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(290, 260, 164, 113);
            ctx.clip();
            ctx.drawImage(elemek, 207, 182, 164, 113, 290, 260, 164, 113);
            ctx.restore();

            for (let i = 0; i < 6; i++) {
                ctx.drawImage(elemek, (11 + i) * TILE, 0, TILE, TILE, 
                            260, 253 + i * 20, TILE, TILE);
            }
        }
    }

    static renderPressEnter(ctx, elemek, canvasWidth, canvasHeight, utem) {
        if (utem % 32 > 12) {
            ctx.save();
            ctx.beginPath();
            ctx.rect((canvasWidth - 257) / 2, canvasHeight - 40, 257, 20);
            ctx.clip();
            ctx.drawImage(elemek, 0, 100, 257, 20, 
                         (canvasWidth - 257) / 2, canvasHeight - 40, 257, 20);
            ctx.restore();
        }
    }

    static renderNextLevel(ctx, elemek, canvasWidth, canvasHeight) {
        ctx.save();
        ctx.beginPath();
        ctx.rect((canvasWidth - 300) / 2, (canvasHeight - 29) / 2, 300, 29);
        ctx.clip();
        ctx.drawImage(elemek, 0, 121, 300, 29, 
                     (canvasWidth - 300) / 2, (canvasHeight - 29) / 2, 300, 29);
        ctx.restore();
    }

    static renderGameUI(ctx, elemek, canvasWidth, player) {
        // Score label
        ctx.save();
        ctx.beginPath();
        ctx.rect(10, 10, 120, 17);
        ctx.clip();
        ctx.drawImage(elemek, 345, 90, 120, 17, 10, 10, 120, 17);
        ctx.restore();

        // Lives
        for (let i = 1; i <= player.lives; i++) {
            ctx.drawImage(elemek, 17 * TILE, 0, TILE, TILE, 
                         canvasWidth + (i - player.lives - 1) * 26, 0, TILE, TILE);
        }

        // Score
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(player.score, 75, 27);
    }

    static renderGameOver(ctx, elemek, canvasWidth, canvasHeight) {
        ctx.save();
        ctx.beginPath();
        ctx.rect((canvasWidth - 198) / 2, (canvasHeight - 29) / 2, 198, 29);
        ctx.clip();
        ctx.drawImage(elemek, 209, 151, 198, 29, 
                     (canvasWidth - 198) / 2, (canvasHeight - 29) / 2, 198, 29);
        ctx.restore();
    }

    static renderCongratulations(ctx, elemek, canvasWidth, canvasHeight) {
        ctx.save();
        ctx.beginPath();
        ctx.rect((canvasWidth - 205) / 2, (canvasHeight - 83) / 2, 205, 83);
        ctx.clip();
        ctx.drawImage(elemek, 0, 152, 205, 83, 
                     (canvasWidth - 205) / 2, (canvasHeight - 83) / 2, 205, 83);
        ctx.restore();
    }
}

class Zabalo {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = (MAP_WIDTH + 1) * TILE;
        this.canvas.height = (MAP_HEIGHT + 1) * TILE;
        
        // Game objects
        this.player = null;
        this.enemies = [];
        this.gameMap = new GameMap();
        this.fruit = new Fruit();
        
        // Game state
        this.currentLevel = 0;
        this.utem = 0;
        this.pressedkey = 0;
        this.gamestate = 1;
        
        // Timing for consistent game speed
        this.lastTime = 0;
        this.accumulator = 0;
        this.timestep = 20; // 20ms per game tick (50 FPS)
        
        // Load sprite image
        this.elemek = new Image();
        this.elemek.src = 'sprites_20x20.png';
        this.elemek.onload = () => {
            this.init();
        };
        
        this.setupKeyboard();
    }
    
    setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.pressedkey = 1;
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    this.pressedkey = 2;
                    e.preventDefault();
                    break;
                case 'ArrowUp':
                    this.pressedkey = 3;
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    this.pressedkey = 4;
                    e.preventDefault();
                    break;
                case 'Enter':
                    this.pressedkey = 5;
                    e.preventDefault();
                    break;
            }
        });
    }
    
    init() {
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }
    
    gameLoop(currentTime) {
        requestAnimationFrame((time) => this.gameLoop(time));
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        this.accumulator += deltaTime;
        
        // Fixed timestep update
        while (this.accumulator >= this.timestep) {
            this.update();
            this.accumulator -= this.timestep;
        }
        
        this.render();
    }
    
    update() {
        switch(this.gamestate) {
            case 1: this.focim_inic(); break;
            case 2: this.focim(); break;
            case 3: this.ujpalya_inic(); break;
            case 4: this.ujpalya(); break;
            case 5: this.jatek(); break;
            case 6: this.megegyszer_inic(); break;
            case 7: this.megegyszer(); break;
            case 8: this.jatekvege(); break;
            case 9: this.gratulalok(); break;
        }
        
        this.utem++;
        if (this.utem >= 255) this.utem = 0;
    }
    
    jatek() {
        // Move enemies
        this.enemies.forEach(enemy => {
            enemy.move(this.player, this.gameMap, this.enemies, this.utem);
            enemy.updateEffect();
        });
        
        // Move player
        this.player.move(this.gameMap, this.pressedkey, this.utem);
        this.player.updateEffect();
        
        // Check collision with enemies
        this.utkozes();
        
        // Handle fruit
        this.fruit.spawn(this.gameMap);
        this.fruit.checkCollision(this.player, this.enemies);
        this.fruit.update();
        
        // Check level completion
        this.palyamegcsinalva();
    }
    
    utkozes() {
        const collision = this.enemies.some(enemy => 
            this.player.x === enemy.x && this.player.y === enemy.y
        );
        
        if (collision) {
            this.player.lives--;
            if (this.player.lives < 0) {
                this.gamestate = 8; // Game over
            } else {
                this.gamestate = 6; // Restart level
            }
        }
    }
    
    palyamegcsinalva() {
        if (this.gameMap.gemsRemaining === 0) {
            if (this.currentLevel === MAX_PALYA - 1) {
                this.gamestate = 9; // Congratulations
            } else {
                this.currentLevel++;
                this.gamestate = 3; // Next level
            }
        }
    }
    
    jatekvege() {
        if (this.pressedkey === 5) {
            this.pressedkey = 0;
            this.gamestate = 1;
        }
    }
    
    megegyszer_inic() {
        const { playerPos, enemyPositions } = this.gameMap.resetPositions(this.currentLevel);
        this.player.setPosition(playerPos.x, playerPos.y);
        this.player.dx = 0;
        this.player.dy = 0;
        this.enemies = enemyPositions.map((pos, i) => {
            const faceIndex = this.currentLevel % 2 === 0 ? 8 + (i % 2) : 18 + (i % 2);
            return new Enemy(pos.x, pos.y, faceIndex);
        });
        this.gamestate = 7;
    }
    
    megegyszer() {
        if (this.pressedkey === 5) this.gamestate = 5;
    }
    
    ujpalya_inic() {
        this.fruit.timer = 0;
        const { playerPos, enemyPositions } = this.gameMap.loadLevel(this.currentLevel);
        
        this.player = new Player(playerPos.x, playerPos.y);
        this.enemies = enemyPositions.map((pos, i) => {
            const faceIndex = this.currentLevel % 2 === 0 ? 8 + (i % 2) : 18 + (i % 2);
            return new Enemy(pos.x, pos.y, faceIndex);
        });
        
        this.gamestate = 4;
    }
    
    ujpalya() {
        if (this.pressedkey === 5 || this.currentLevel === 0) {
            this.gamestate = 5;
        }
    }
    
    gratulalok() {
        if (this.pressedkey === 5) {
            this.pressedkey = 0;
            this.gamestate = 1;
        }
    }
    
    focim_inic() {
        this.currentLevel = START_LEVEL;
        this.gamestate = 2;
        
        const { playerPos, enemyPositions } = this.gameMap.loadLevel(this.currentLevel);
        this.player = new Player(playerPos.x, playerPos.y);
        this.player.lives = 3;
        this.player.score = 0;
        
        this.enemies = enemyPositions.map((pos, i) => 
            new Enemy(pos.x, pos.y, (i % 2 === 0) ? 8 : 9)
        );
        
        this.fruit.timer = 0;
    }
    
    focim() {
        if (this.pressedkey === 5) {
            this.gamestate = 3;
            this.currentLevel = START_LEVEL;
        }
    }
    
    render() {
        this.ctx.fillStyle = '#808080';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw map
        this.gameMap.render(this.ctx, this.elemek, this.currentLevel);
        
        // Draw player
        if (this.player) {
            this.player.render(this.ctx, this.elemek);
        }
        
        // Draw enemies
        this.enemies.forEach(enemy => enemy.render(this.ctx, this.elemek));
        
        // Draw fruit
        this.fruit.render(this.ctx, this.elemek);
        
        // Draw UI based on game state
        if (this.gamestate === 2) {
            UIRenderer.renderTitleScreen(this.ctx, this.elemek, 
                this.canvas.width, this.canvas.height, this.utem);
        }
        
        if ([2, 4, 7, 8, 9].includes(this.gamestate)) {
            UIRenderer.renderPressEnter(this.ctx, this.elemek, 
                this.canvas.width, this.canvas.height, this.utem);
        }
        
        if (this.gamestate === 4 && this.currentLevel > 0) {
            UIRenderer.renderNextLevel(this.ctx, this.elemek, 
                this.canvas.width, this.canvas.height);
        }
        
        if ([5, 7, 8, 9].includes(this.gamestate)) {
            UIRenderer.renderGameUI(this.ctx, this.elemek, 
                this.canvas.width, this.player);
        }
        
        if (this.gamestate === 8) {
            UIRenderer.renderGameOver(this.ctx, this.elemek, 
                this.canvas.width, this.canvas.height);
        }
        
        if (this.gamestate === 9) {
            UIRenderer.renderCongratulations(this.ctx, this.elemek, 
                this.canvas.width, this.canvas.height);
        }
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Zabalo();
});