// Game configuration
const GAME_CONFIG = {
    skier: {
        emoji: '⛷️',
        width: 60,
        height: 60,
        hitbox: { x: 20, y: 15, w: 20, h: 30 }
    },
    tree: {
        emoji: '🌲',
        width: 60,
        height: 60,
        hitbox: { x: 15, y: 30, w: 30, h: 25 }
    },
    medal: {
        emoji: '🏅',
        width: 50,
        height: 50,
        hitbox: { x: 5, y: 5, w: 40, h: 40 }
    },
    flag: {
        emoji: '🚩',
        width: 50,
        height: 50,
        hitbox: { x: 10, y: 10, w: 35, h: 35 }
    }
};

class GameObject {
    constructor(type, x, y) {
        const config = GAME_CONFIG[type];
        this.type = type;
        this.element = document.createElement('div');
        this.element.className = 'game-object';
        this.element.textContent = config.emoji;
        this.element.style.fontSize = `${config.width}px`;
        this.element.style.lineHeight = '1';
        this.x = x;
        this.y = y;
        this.width = config.width;
        this.height = config.height;
        this.hitbox = config.hitbox;
        this.updatePosition();
        document.getElementById('game-container').appendChild(this.element);
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    checkCollision(other, offset1 = {}, offset2 = {}) {
        // Use hitbox from config if not provided
        const box1 = offset1.x !== undefined ? offset1 : this.hitbox;
        const box2 = offset2.x !== undefined ? offset2 : other.hitbox;

        const x1 = this.x + (box1.x || 0);
        const y1 = this.y + (box1.y || 0);
        const w1 = box1.w || this.width;
        const h1 = box1.h || this.height;

        const x2 = other.x + (box2.x || 0);
        const y2 = other.y + (box2.y || 0);
        const w2 = box2.w || other.width;
        const h2 = box2.h || other.height;

        return x1 < x2 + w2 && x1 + w1 > x2 && 
               y1 < y2 + h2 && y1 + h1 > y2;
    }

    remove() {
        this.element.remove();
    }
}

class SkiingGame {
    constructor() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.score = 0;
        this.hiscore = parseInt(localStorage.getItem('skiingHiscore')) || 0;
        this.speed = 2;
        this.speedTimer = 0;
        this.dx = 0;
        this.isGameRunning = false;

        this.hero = new GameObject('skier', this.width / 2 - 30, 100);
        this.objects = [];
        
        this.initObjects();
        this.setupEventListeners();
        this.updateScore(0); // Initialize score display with saved hiscore
    }

    startGame() {
        document.getElementById('start-modal').classList.remove('active');
        this.isGameRunning = true;
        this.start();
    }

    restartGame() {
        document.getElementById('gameover-modal').classList.remove('active');
        this.score = 0;
        this.speed = 2;
        this.speedTimer = 0;
        this.updateScore(0);
        
        // Reset all objects with proper spacing
        this.objects.forEach((item, index) => {
            item.obj.x = Math.random() * this.width;
            
            if (item.type === 'medal' || item.type === 'flag') {
                item.obj.y = this.height + Math.random() * this.height;
            } else {
                // Trees should be spaced out vertically
                const treeIndex = index - 2; // First 2 items are medal and flag
                item.obj.y = (treeIndex + 1) * this.height / 18 + this.height;
            }
            
            item.obj.updatePosition();
        });

        this.isGameRunning = true;
    }

    initObjects() {
        // Medal (gold coin replacement)
        this.objects.push({
            obj: new GameObject('medal', Math.random() * this.width, this.height + Math.random() * this.height),
            type: 'medal',
            scoreValue: 50
        });

        // Flag
        this.objects.push({
            obj: new GameObject('flag', Math.random() * this.width, this.height + Math.random() * this.height),
            type: 'flag',
            scoreValue: 10
        });

        // Trees (obstacles)
        for (let i = 0; i < 18; i++) {
            this.objects.push({
                obj: new GameObject('tree', Math.random() * this.width, (i + 1) * this.height / 18 + this.height),
                type: 'tree',
                scoreValue: 1
            });
        }
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            const previousX = this.hero.x;
            this.hero.x = Math.max(0, Math.min(this.width - this.hero.width, e.clientX - this.hero.width / 2));
            this.hero.y = Math.max(0, Math.min(this.height - 200, e.clientY - this.hero.height / 2));
            this.dx = previousX - this.hero.x;
            this.hero.updatePosition();
        });

        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        });
    }

    updateScore(points) {
        this.score += points;
        if (this.score > this.hiscore) {
            this.hiscore = this.score;
            localStorage.setItem('skiingHiscore', this.hiscore);
        }
        document.getElementById('score').textContent = `SCORE: ${this.score}`;
        document.getElementById('hiscore').textContent = `HISCORE: ${this.hiscore}`;
    }

    updateSpeed() {
        this.speedTimer++;
        if (this.speedTimer > 70) {
            this.speed += 0.1;
            this.speedTimer = 0;
        }
    }

    resetGame() {
        this.isGameRunning = false;
        document.getElementById('final-score').textContent = `Your score: ${this.score}`;
        document.getElementById('gameover-modal').classList.add('active');
    }

    update() {
        if (!this.isGameRunning) return;

        const scrollSpeed = this.speed + this.hero.y / 50;

        this.objects.forEach(item => {
            const obj = item.obj;
            
            // Move objects
            obj.y -= scrollSpeed;
            obj.x += this.dx;
            
            // Respawn when off screen
            if (obj.y < -99) {
                obj.x = Math.random() * this.width;
                obj.y = this.height + (item.type === 'medal' || item.type === 'flag' ? Math.random() * this.height : 0);
                this.updateScore(item.scoreValue);
            }
            
            obj.updatePosition();

            // Collision detection
            switch(item.type) {
                case 'tree':
                    if (obj.checkCollision(this.hero)) {
                        this.resetGame();
                    }
                    break;
                
                case 'medal':
                    if (obj.checkCollision(this.hero)) {
                        obj.x = Math.random() * this.width;
                        obj.y = this.height + Math.random() * this.height;
                        this.updateScore(50);
                    }
                    break;
                
                case 'flag':
                    if (obj.checkCollision(this.hero)) {
                        this.updateScore(10);
                    }
                    break;
            }
        });

        this.updateSpeed();
    }

    start() {
        const gameLoop = () => {
            this.update();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Start the game
let game;
window.addEventListener('load', () => {
    game = new SkiingGame();
});
