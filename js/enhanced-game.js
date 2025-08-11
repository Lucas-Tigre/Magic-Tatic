// Magic Tactic - Enhanced Version with Visual Improvements
class EnhancedMagicTactic {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.currentScreen = 'main-menu';
        this.gameState = 'menu';
        
        // Map properties
        this.tileSize = 32; // Size of each tile in pixels
        this.mapWidth = 80; // Number of tiles wide
        this.mapHeight = 60; // Number of tiles high
        this.playerOffsetX = 0; // Offset for map scrolling
        this.playerOffsetY = 0; // Offset for map scrolling

        // Image assets
        this.images = {};
        this.imagesLoaded = 0;
        this.totalImages = 0;
        
        // Map data (simplified for now, will be expanded)
        // 0: grass, 1: forest_tree, 2: rock, 3: dead_tree, 4: barren_ground, 5: dark_ground, 6: dark_pillar, 7: house, 8: cabin
        this.mapData = this.generateMapData();

        // Player data
        this.player = {
            x: this.mapWidth * this.tileSize / 2, // Center of the map
            y: this.mapHeight * this.tileSize / 2, // Center of the map
            level: 1,
            exp: 0,
            expToNext: 100,
            hp: 100,
            maxHp: 100,
            mp: 50,
            maxMp: 50,
            attack: 10,
            defense: 5,
            speed: 8,
            gold: 0, // New: Gold for buying spells
            inventory: [], // New: Inventory system
            spells: [
                { name: 'Bola de Fogo', element: 'fire', damage: 15, cost: 8 },
                { name: 'Jato de Água', element: 'water', damage: 12, cost: 6 },
                { name: 'Cura Divina', element: 'light', heal: 20, cost: 10 }
            ]
        };
        
        // Enemies data with area assignments
        this.enemies = [
            { id: 1, name: 'Mago Negro do Fogo', x: 1200, y: 1500, area: 'destroyed', defeated: false, element: 'fire', hp: 60, maxHp: 60, attack: 10, defense: 3, speed: 6, drop: 'health_elixir' }, // Reduced attack
            { id: 2, name: 'Mago Negro da Água', x: 1800, y: 1600, area: 'destroyed', defeated: false, element: 'water', hp: 65, maxHp: 65, attack: 9, defense: 4, speed: 7, drop: 'mana_elixir' }, // Reduced attack
            { id: 3, name: 'Mago Negro da Terra', x: 1500, y: 1700, area: 'destroyed', defeated: false, element: 'earth', hp: 80, maxHp: 80, attack: 11, defense: 6, speed: 4, drop: 'health_elixir' }, // Reduced attack
            { id: 4, name: 'Mago Negro do Ar', x: 1700, y: 1400, area: 'destroyed', defeated: false, element: 'air', hp: 55, maxHp: 55, attack: 12, defense: 2, speed: 10, drop: 'mana_elixir' }, // Reduced attack
            { id: 5, name: 'Mago Negro das Trevas', x: 1600, y: 1800, area: 'destroyed', defeated: false, element: 'dark', hp: 70, maxHp: 70, attack: 13, defense: 5, speed: 8, drop: 'legendary_elixir' } // Reduced attack
        ];
        
        this.boss = {
            name: 'Rei das Trevas',
            x: 2500,
            y: 2500,
            area: 'dark_lair',
            defeated: false,
            element: 'dark',
            hp: 150,
            maxHp: 150,
            attack: 18,
            defense: 8,
            speed: 12,
            unlocked: false
        };
        
        this.currentEnemy = null;
        this.battleState = 'choosing';
        this.keys = {};
        this.spellEffects = [];
        this.shadows = []; // New: for dynamic shadows
        
        // Element effectiveness
        this.elementChart = {
            fire: { strong: ['water'], weak: ['earth'] },
            water: { strong: ['earth'], weak: ['air'] },
            earth: { strong: ['air'], weak: ['fire'] },
            air: { strong: ['fire'], weak: ['water'] },
            light: { strong: ['dark'], weak: ['dark'] },
            dark: { strong: ['light'], weak: ['light'] }
        };
        
        this.init();
    }
    
    init() {
        this.loadImages();
        this.setupEventListeners();
        this.canvas = document.getElementById("game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 800; // Fixed viewport size
        this.canvas.height = 600; // Fixed viewport size

        // Initial player offset to center the player on the screen
        this.playerOffsetX = this.player.x - this.canvas.width / 2;
        this.playerOffsetY = this.player.y - this.canvas.height / 2;

        // Ensure loading screen is active initially
        document.getElementById("loading-screen").classList.add("active");
        document.getElementById("main-menu").classList.remove("active");
        document.getElementById("game-screen").classList.remove("active");
        document.getElementById("battle-screen").classList.remove("active");
        document.getElementById("instructions-screen").classList.remove("active");
        document.getElementById("levelup-screen").classList.remove("active");
        document.getElementById("gameover-screen").classList.remove("active");

        // Set gameLoopRunning to false initially
        this.gameLoopRunning = false;
    }

    generateMapData() {
        const map = [];
        for (let y = 0; y < this.mapHeight; y++) {
            map[y] = [];
            for (let x = 0; x < this.mapWidth; x++) {
                // Forest area (top left quadrant)
                if (x < this.mapWidth / 2 && y < this.mapHeight / 2) {
                    if (Math.random() < 0.05) map[y][x] = 1; // Trees
                    else if (Math.random() < 0.02) map[y][x] = 2; // Rocks
                    else map[y][x] = 0; // Grass
                } 
                // Destroyed forest area (bottom right quadrant)
                else if (x >= this.mapWidth / 2 && y >= this.mapHeight / 2) {
                    if (Math.random() < 0.05) map[y][x] = 3; // Dead trees
                    else if (Math.random() < 0.02) map[y][x] = 4; // Barren ground
                    else map[y][x] = 0; // Grass (still some grass)
                }
                // Transition area (top right and bottom left quadrants)
                else {
                    if (Math.random() < 0.03) map[y][x] = 1; // Trees
                    else if (Math.random() < 0.01) map[y][x] = 3; // Dead trees
                    else map[y][x] = 0; // Grass
                }
            }
        }

        // Add houses in the forest area
        map[5][5] = 7; // House
        map[10][15] = 8; // Cabin

        return map;
    }
    
    loadImages() {
        const imageList = [
            'player_wizard_sprite.png',
            'dark_wizard_sprite.png',
            'dark_king_sprite.png',
            'forest_tree_tile.png',
            'seamless_grass_tile.png', // New grass tile
            'rock_tile.png',
            'dead_tree_tile.png',
            'barren_ground_tile.png',
            'dark_ground_tile.png',
            'dark_pillar_tile.png',
            'fire_spell_effect.png',
            'water_spell_effect.png',
            'heal_spell_effect.png',
            'lightning_spell_effect.png', // New spell effect
            'earthquake_spell_effect.png', // New spell effect
            'shield_spell_effect.png', // New spell effect
            'battle_bg_forest.png',
            'battle_bg_destroyed_forest.png',
            'battle_bg_dark_lair.png',
            'forest_house_tile.png', // New house tile
            'forest_cabin_tile.png', // New cabin tile
            'cloud_shadow_overlay.png', // New shadow effect
            'tree_shadow_overlay.png' // New shadow effect
        ];
        
        this.totalImages = imageList.length;
        
        imageList.forEach(imageName => {
            const img = new Image();
            img.onload = () => {
                this.imagesLoaded++;
                if (this.imagesLoaded === this.totalImages) {
                    this.finishLoading();
                }
            };
            img.onerror = () => {
                // If image fails to load, still count it to prevent infinite loading
                this.imagesLoaded++;
                console.warn(`Failed to load image: ${imageName}`);
                if (this.imagesLoaded === this.totalImages) {
                    this.finishLoading();
                }
            };
            img.src = `assets/images/${imageName}`;
            this.images[imageName.replace('.png', '')] = img;
        });
    }
    
    finishLoading() {
        // Hide loading screen and show main menu
        document.getElementById("loading-screen").classList.remove("active");
        this.showScreen("main-menu");
        this.updateUI();
    }
    
    startGame() {
        this.showScreen("game-screen");
        this.gameState = "playing";
        // Only start the game loop if it's not already running
        if (!this.gameLoopRunning) {
            this.startGameLoop();
            this.gameLoopRunning = true;
        }
    }
    
    setupEventListeners() {
        // Menu buttons
        document.getElementById("start-game").addEventListener("click", () => this.startGame());
        document.getElementById("instructions").addEventListener("click", () => this.showInstructions());
        document.getElementById('back-to-menu').addEventListener('click', () => this.showMainMenu());
        document.getElementById('restart-game').addEventListener('click', () => this.restartGame());
        document.getElementById('back-to-main').addEventListener('click', () => this.showMainMenu());
        
        // Battle buttons
        document.getElementById('attack-btn').addEventListener('click', () => this.showSpellMenu());
        document.getElementById('defend-btn').addEventListener('click', () => this.playerDefend());
        document.getElementById('run-btn').addEventListener('click', () => this.playerRun());
        document.getElementById('back-to-actions').addEventListener('click', () => this.hideSpellMenu());
        
        // Level up buttons
        document.getElementById('confirm-stats').addEventListener('click', () => this.confirmStatDistribution());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (this.gameState === 'playing') {
                // No direct movement here, handled in updateGameLoop
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }
    
    getCurrentArea() {
        // Determine current area based on player position on the large map
        const playerMapX = this.player.x;
        const playerMapY = this.player.y;

        if (playerMapX < this.mapWidth * this.tileSize / 2 && playerMapY < this.mapHeight * this.tileSize / 2) {
            return 'forest';
        } else if (playerMapX >= this.mapWidth * this.tileSize / 2 && playerMapY >= this.mapHeight * this.tileSize / 2) {
            return 'destroyed';
        } else if (playerMapX >= this.mapWidth * this.tileSize * 0.7 && playerMapY >= this.mapHeight * this.tileSize * 0.7) { // Example for dark lair
            return 'dark_lair';
        }
        return 'forest'; // Default
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;
    }
    
    showMainMenu() {
        this.showScreen('main-menu');
        this.gameState = 'menu';
    }
    
    showInstructions() {
        this.showScreen('instructions-screen');
    }
       startGame() {
        this.showScreen("game-screen");
        this.gameState = "playing";
        // Only start the game loop if it's not already running
        if (!this.gameLoopRunning) {
            this.startGameLoop();
            this.gameLoopRunning = true;
        }
    }
    
    startGameLoop() {
        // This function will be called only once when the game starts
        const gameLoop = () => {
            if (this.gameState === 'playing') {
                this.updateGameLoop();
            }
            requestAnimationFrame(gameLoop);
        };
        requestAnimationFrame(gameLoop);
    }
    
    setupEventListeners() {
        // Menu buttons
        document.getElementById("start-game").addEventListener("click", () => this.startGame());
        document.getElementById("instructions").addEventListener("click", () => this.showInstructions());
            expToNext: 100,
            hp: 100,
            maxHp: 100,
            mp: 50,
            maxMp: 50,
            attack: 10,
            defense: 5,
            speed: 8,
            gold: 0,
            inventory: [],
            spells: [
                { name: 'Bola de Fogo', element: 'fire', damage: 15, cost: 8 },
                { name: 'Jato de Água', element: 'water', damage: 12, cost: 6 },
                { name: 'Cura Divina', element: 'light', heal: 20, cost: 10 }
            ]
        };
        
        // Reset enemies
        this.enemies.forEach(enemy => {
            enemy.defeated = false;
            enemy.hp = enemy.maxHp;
        });
        
        this.boss.defeated = false;
        this.boss.unlocked = false;
        this.boss.hp = this.boss.maxHp;
        
        this.startGame();
    }
    
    startGameLoop() {
        this.updateGameLoop();
        requestAnimationFrame(() => this.startGameLoop());
    }

    updateGameLoop() {
        if (this.gameState === 'playing') {
            this.handleMovement();
            this.checkEnemyCollisions();
            this.updateSpellEffects();
            this.updateUI();
            this.draw();
        }
    }
    
    handleMovement() {
        const speed = 5; // Increased speed for better feel
        let newX = this.player.x;
        let newY = this.player.y;
        
        if (this.keys['ArrowUp'] || this.keys['w']) newY -= speed;
        if (this.keys['ArrowDown'] || this.keys['s']) newY += speed;
        if (this.keys['ArrowLeft'] || this.keys['a']) newX -= speed;
        if (this.keys['ArrowRight'] || this.keys['d']) newX += speed;
        
        // Keep player within map bounds
        newX = Math.max(this.tileSize / 2, Math.min(this.mapWidth * this.tileSize - this.tileSize / 2, newX));
        newY = Math.max(this.tileSize / 2, Math.min(this.mapHeight * this.tileSize - this.tileSize / 2, newY));
        
        this.player.x = newX;
        this.player.y = newY;
        
        // Update player offset for smooth scrolling
        this.playerOffsetX = this.player.x - this.canvas.width / 2;
        this.playerOffsetY = this.player.y - this.canvas.height / 2;

        // Clamp offsets to map boundaries
        this.playerOffsetX = Math.max(0, Math.min(this.mapWidth * this.tileSize - this.canvas.width, this.playerOffsetX));
        this.playerOffsetY = Math.max(0, Math.min(this.mapHeight * this.tileSize - this.canvas.height, this.playerOffsetY));
    }
    
    checkEnemyCollisions() {
        const playerRadius = 20;
        const enemyRadius = 25;
        
        // Check regular enemies in current area
        this.enemies.forEach(enemy => {
            if (!enemy.defeated) { // Check all enemies, not just current area
                const distance = Math.sqrt(
                    Math.pow(this.player.x - enemy.x, 2) + 
                    Math.pow(this.player.y - enemy.y, 2)
                );
                
                if (distance < playerRadius + enemyRadius) {
                    this.startBattle(enemy);
                }
            }
        });
        
        // Check boss (only if unlocked and all other enemies defeated)
        const allEnemiesDefeated = this.enemies.every(enemy => enemy.defeated);
        if (allEnemiesDefeated && !this.boss.defeated) {
            this.boss.unlocked = true; // Unlock boss after all enemies are defeated
            const distance = Math.sqrt(
                Math.pow(this.player.x - this.boss.x, 2) + 
                Math.pow(this.player.y - this.boss.y, 2)
            );
            
            if (distance < playerRadius + 30) {
                this.startBattle(this.boss);
            }
        }
    }
    
    startBattle(enemy) {
        this.currentEnemy = enemy;
        this.gameState = 'battle';
        this.battleState = 'choosing';
        this.showScreen('battle-screen');
        this.updateBattleUI();
        this.setBattleBackground();
        this.setBattleMessage(`Um ${enemy.name} apareceu!`);
    }
    
    setBattleBackground() {
        const battleScreen = document.getElementById('battle-screen');
        let bgImage = '';
        
        // Determine background based on enemy's area, not player's currentArea
        switch (this.currentEnemy.area) {
            case 'forest':
                bgImage = 'url(assets/images/battle_bg_forest.png)';
                break;
            case 'destroyed':
                bgImage = 'url(assets/images/battle_bg_destroyed_forest.png)';
                break;
            case 'dark_lair':
                bgImage = 'url(assets/images/battle_bg_dark_lair.png)';
                break;
            default:
                bgImage = 'url(assets/images/battle_bg_forest.png)'; // Fallback
                break;
        }
        
        battleScreen.style.backgroundImage = bgImage;
        battleScreen.style.backgroundSize = 'cover';
        battleScreen.style.backgroundPosition = 'center';
    }
    
    showSpellMenu() {
        document.getElementById('battle-actions').style.display = 'none';
        document.getElementById('spell-menu').classList.remove('hidden');
        this.populateSpellMenu();
    }
    
    hideSpellMenu() {
        document.getElementById('battle-actions').style.display = 'flex';
        document.getElementById('spell-menu').classList.add('hidden');
    }
    
    populateSpellMenu() {
        const spellList = document.getElementById('spell-list');
        spellList.innerHTML = '';
        
        this.player.spells.forEach((spell, index) => {
            const spellBtn = document.createElement('button');
            spellBtn.className = 'spell-btn';
            spellBtn.innerHTML = `
                <span class="spell-name">${spell.name}</span>
                <span class="spell-cost">Custo: ${spell.cost} MP</span>
            `;
            
            if (this.player.mp >= spell.cost) {
                spellBtn.addEventListener('click', () => this.playerAttack(spell));
            } else {
                spellBtn.disabled = true;
                spellBtn.style.opacity = '0.5';
            }
            
            spellList.appendChild(spellBtn);
        });
    }
    
    playerAttack(spell) {
        if (this.player.mp < spell.cost) {
            this.setBattleMessage('Mana insuficiente!');
            return;
        }
        
        this.player.mp -= spell.cost;
        this.hideSpellMenu();
        
        // Add spell effect
        this.addSpellEffect(spell, 'player');
        
        if (spell.heal) {
            // Healing spell
            const healAmount = spell.heal;
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);
            this.setBattleMessage(`Você se curou em ${healAmount} pontos de vida!`);
        } else {
            // Attack spell
            let damage = spell.damage + this.player.attack;
            
            // Apply element effectiveness
            const effectiveness = this.getElementEffectiveness(spell.element, this.currentEnemy.element);
            damage = Math.floor(damage * effectiveness);
            
            // Apply enemy defense
            damage = Math.max(1, damage - this.currentEnemy.defense);
            
            this.currentEnemy.hp -= damage;
            
            let message = `Você usou ${spell.name} e causou ${damage} de dano!`;
            if (effectiveness > 1) message += ' É super efetivo!';
            if (effectiveness < 1) message += ' Não é muito efetivo...';
            
            this.setBattleMessage(message);
        }
        
        this.updateBattleUI();
        
        if (this.currentEnemy.hp <= 0) {
            setTimeout(() => this.enemyDefeated(), 1500);
        } else {
            setTimeout(() => this.enemyTurn(), 1500);
        }
    }
    
    addSpellEffect(spell, caster) {
        const effect = {
            spell: spell,
            caster: caster,
            duration: 60, // frames
            frame: 0
        };
        this.spellEffects.push(effect);
    }
    
    updateSpellEffects() {
        this.spellEffects = this.spellEffects.filter(effect => {
            effect.frame++;
            return effect.frame < effect.duration;
        });
    }
    
    playerDefend() {
        this.setBattleMessage('Você se defendeu e recuperou um pouco de mana!');
        this.player.mp = Math.min(this.player.maxMp, this.player.mp + 5);
        this.updateBattleUI();
        setTimeout(() => this.enemyTurn(), 1500);
    }
    
    playerRun() {
        this.setBattleMessage('Você fugiu da batalha!');
        setTimeout(() => {
            this.gameState = 'playing';
            this.showScreen('game-screen');
            // No need to call startGameLoop here, it's already running
        }, 1500);
    }
    
    enemyTurn() {
        if (this.currentEnemy.hp <= 0) return;
        
        // Simple AI: attack with random spell
        const enemySpells = this.getEnemySpells(this.currentEnemy.element);
        const spell = enemySpells[Math.floor(Math.random() * enemySpells.length)];
        
        // Add enemy spell effect
        this.addSpellEffect(spell, 'enemy');
        
        let damage = spell.damage + this.currentEnemy.attack;
        const effectiveness = this.getElementEffectiveness(spell.element, 'light'); // Assume player is light element
        damage = Math.floor(damage * effectiveness);
        damage = Math.max(1, damage - this.player.defense);
        
        this.player.hp -= damage;
        
        let message = `${this.currentEnemy.name} usou ${spell.name} e causou ${damage} de dano!`;
        if (effectiveness > 1) message += ' É super efetivo!';
        
        this.setBattleMessage(message);
        this.updateBattleUI();
        
        if (this.player.hp <= 0) {
            setTimeout(() => this.gameOver(), 1500);
        } else {
            setTimeout(() => {
                this.battleState = 'choosing';
                this.setBattleMessage('Escolha sua ação!');
            }, 1500);
        }
    }
    
    getEnemySpells(element) {
        const spells = {
            fire: [{ name: 'Bola de Fogo', element: 'fire', damage: 12 }],
            water: [{ name: 'Jato de Água', element: 'water', damage: 10 }],
            earth: [{ name: 'Pedra Afiada', element: 'earth', damage: 14 }], // New spell for earth enemy
            air: [{ name: 'Vendaval', element: 'air', damage: 11 }], // New spell for air enemy
            dark: [{ name: 'Sombra Negra', element: 'dark', damage: 15 }] // New spell for dark enemy
        };
        return spells[element] || [];
    }
    
    enemyDefeated() {
        this.setBattleMessage(`${this.currentEnemy.name} foi derrotado!`);
        this.currentEnemy.defeated = true;
        this.player.exp += 50; // Gain experience
        this.player.gold += 20; // Gain gold

        // Item drop chance
        if (this.currentEnemy.drop) {
            this.player.inventory.push(this.currentEnemy.drop);
            this.setBattleMessage(`Você encontrou um ${this.currentEnemy.drop.replace('_', ' ')}!`);
        }

        this.checkLevelUp();
        this.updateUI();
        
        setTimeout(() => {
            this.gameState = 'playing';
            this.showScreen('game-screen');
            // No need to call startGameLoop here, it's already running
        }, 1500);
    }
    
    checkLevelUp() {
        if (this.player.exp >= this.player.expToNext) {
            this.player.level++;
            this.player.exp -= this.player.expToNext;
            this.player.expToNext = Math.floor(this.player.expToNext * 1.5);
            this.player.statPoints += 3; // Gain stat points
            this.setBattleMessage(`Você subiu para o nível ${this.player.level}!`);
            this.showScreen('level-up-screen');
            this.updateStatPointsUI();
        }
    }
    
    updateStatPointsUI() {
        document.getElementById('stat-points-available').textContent = this.player.statPoints;
        document.getElementById('hp-points').textContent = this.player.maxHp;
        document.getElementById('mp-points').textContent = this.player.maxMp;
        document.getElementById('attack-points').textContent = this.player.attack;
        document.getElementById('defense-points').textContent = this.player.defense;
        document.getElementById('speed-points').textContent = this.player.speed;

        document.querySelectorAll('.stat-btn').forEach(button => {
            button.onclick = () => {
                if (this.player.statPoints > 0) {
                    const stat = button.dataset.stat;
                    this.player.statPoints--;
                    switch (stat) {
                        case 'hp': this.player.maxHp += 10; this.player.hp += 10; break;
                        case 'mp': this.player.maxMp += 5; this.player.mp += 5; break;
                        case 'attack': this.player.attack += 1; break;
                        case 'defense': this.player.defense += 1; break;
                        case 'speed': this.player.speed += 1; break;
                    }
                    this.updateStatPointsUI();
                }
            };
        });
    }

    confirmStatDistribution() {
        this.showScreen('game-screen');
        this.gameState = 'playing';
        this.updateUI();
    }
    
    gameOver() {
        this.setBattleMessage('Você foi derrotado!');
        this.showScreen('gameover-screen');
        this.gameState = 'gameover';
    }
    
    updateUI() {
        // Update HUD
        document.getElementById('player-hp').style.width = `${(this.player.hp / this.player.maxHp) * 100}%`;
        document.getElementById('player-mana').style.width = `${(this.player.mp / this.player.maxMp) * 100}%`;
        document.getElementById('player-level').textContent = `Nível: ${this.player.level}`;
        document.getElementById('player-exp').textContent = `EXP: ${this.player.exp}/${this.player.expToNext}`;
        document.getElementById('player-gold').textContent = `Ouro: ${this.player.gold}`;

        // Update battle UI
        if (this.currentEnemy) {
            document.getElementById('enemy-name').textContent = this.currentEnemy.name;
            document.getElementById('enemy-hp').style.width = `${(this.currentEnemy.hp / this.currentEnemy.maxHp) * 100}%`;
        }
    }
    
    setBattleMessage(message) {
        document.getElementById('battle-message').textContent = message;
    }
    
    getElementEffectiveness(attackElement, defenseElement) {
        const chart = this.elementChart[attackElement];
        if (!chart) return 1; // No specific effectiveness
        
        if (chart.strong.includes(defenseElement)) return 1.5; // Super effective
        if (chart.weak.includes(defenseElement)) return 0.5; // Not very effective
        
        return 1; // Normal effectiveness
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw map tiles with scrolling
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                const tileType = this.mapData[y][x];
                let tileImage = null;
                switch (tileType) {
                    case 0: tileImage = this.images.seamless_grass_tile; break; // New grass
                    case 1: tileImage = this.images.forest_tree_tile; break;
                    case 2: tileImage = this.images.rock_tile; break;
                    case 3: tileImage = this.images.dead_tree_tile; break;
                    case 4: tileImage = this.images.barren_ground_tile; break;
                    case 5: tileImage = this.images.dark_ground_tile; break;
                    case 6: tileImage = this.images.dark_pillar_tile; break;
                    case 7: tileImage = this.images.forest_house_tile; break; // House
                    case 8: tileImage = this.images.forest_cabin_tile; break; // Cabin
                }
                
                if (tileImage) {
                    this.ctx.drawImage(
                        tileImage,
                        x * this.tileSize - this.playerOffsetX,
                        y * this.tileSize - this.playerOffsetY,
                        this.tileSize,
                        this.tileSize
                    );
                }
            }
        }

        // Draw dynamic shadows (example, needs more sophisticated logic for movement)
        if (this.images.cloud_shadow_overlay) {
            this.ctx.globalAlpha = 0.3; // Semi-transparent
            this.ctx.drawImage(this.images.cloud_shadow_overlay, 100 - this.playerOffsetX, 100 - this.playerOffsetY, 64, 64);
            this.ctx.drawImage(this.images.tree_shadow_overlay, 300 - this.playerOffsetX, 200 - this.playerOffsetY, 48, 48);
            this.ctx.globalAlpha = 1;
        }
        
        // Draw player
        if (this.images.player_wizard_sprite) {
            this.ctx.drawImage(
                this.images.player_wizard_sprite,
                this.player.x - this.playerOffsetX - 24, // Center player sprite
                this.player.y - this.playerOffsetY - 24,
                48,
                48
            );
        } else {
            // Fallback circle
            this.ctx.fillStyle = 'blue';
            this.ctx.beginPath();
            this.ctx.arc(this.player.x - this.playerOffsetX, this.player.y - this.playerOffsetY, 20, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        // Draw enemies
        this.enemies.forEach(enemy => {
            if (!enemy.defeated) {
                if (this.images.dark_wizard_sprite) {
                    this.ctx.drawImage(
                        this.images.dark_wizard_sprite,
                        enemy.x - this.playerOffsetX - 24,
                        enemy.y - this.playerOffsetY - 24,
                        48,
                        48
                    );
                } else {
                    // Fallback circle
                    this.ctx.fillStyle = 'red';
                    this.ctx.beginPath();
                    this.ctx.arc(enemy.x - this.playerOffsetX, enemy.y - this.playerOffsetY, 25, 0, 2 * Math.PI);
                    this.ctx.fill();
                }
            }
        });
        
        // Draw boss
        if (this.boss.unlocked && !this.boss.defeated) {
            if (this.images.dark_king_sprite) {
                this.ctx.drawImage(
                    this.images.dark_king_sprite,
                    this.boss.x - this.playerOffsetX - 32, // Center boss sprite
                    this.boss.y - this.playerOffsetY - 32,
                    64,
                    64
                );
            } else {
                // Fallback circle
                this.ctx.fillStyle = '#4B0082';
                this.ctx.beginPath();
                this.ctx.arc(this.boss.x - this.playerOffsetX, this.boss.y - this.playerOffsetY, 30, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        }
    }
    
    drawSpellEffects() {
        this.spellEffects.forEach(effect => {
            const alpha = 1 - (effect.frame / effect.duration);
            this.ctx.globalAlpha = alpha;
            
            let effectImage = null;
            switch (effect.spell.element) {
                case 'fire':
                    effectImage = this.images.fire_spell_effect;
                    break;
                case 'water':
                    effectImage = this.images.water_spell_effect;
                    break;
                case 'light':
                    effectImage = this.images.heal_spell_effect;
                    break;
                case 'air': // New spell effect
                    effectImage = this.images.lightning_spell_effect;
                    break;
                case 'earth': // New spell effect
                    effectImage = this.images.earthquake_spell_effect;
                    break;
                case 'defense': // New spell effect
                    effectImage = this.images.shield_spell_effect;
                    break;
            }
            
            if (effectImage) {
                // Position effects relative to the canvas, not map
                const targetX = effect.caster === 'player' ? this.canvas.width / 4 : this.canvas.width * 3 / 4;
                const targetY = this.canvas.height / 2;

                this.ctx.drawImage(effectImage, targetX - 32, targetY - 32, 64, 64);
            }
            
            this.ctx.globalAlpha = 1;
        });
    }
}

// Initialize enhanced game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new EnhancedMagicTactic();
});


