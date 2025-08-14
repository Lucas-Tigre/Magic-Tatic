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
                { name: 'Rajada de Vento', element: 'air', damage: 13, cost: 7 },
                { name: 'Espinhos de Pedra', element: 'earth', damage: 14, cost: 7 },
                { name: 'Cura Divina', element: 'light', heal: 20, cost: 10 }
            ]
        };
        
        // Enemies data with area assignments (stats reduced for balance)
        this.enemies = [
            { id: 1, name: 'Mago Negro do Fogo', x: 1200, y: 1500, area: 'destroyed', defeated: false, element: 'fire', hp: 45, maxHp: 45, attack: 8, defense: 3, speed: 6, drop: 'health_elixir' },
            { id: 2, name: 'Mago Negro da Água', x: 1800, y: 1600, area: 'destroyed', defeated: false, element: 'water', hp: 50, maxHp: 50, attack: 7, defense: 4, speed: 7, drop: 'mana_elixir' },
            { id: 3, name: 'Mago Negro da Terra', x: 1500, y: 1700, area: 'destroyed', defeated: false, element: 'earth', hp: 60, maxHp: 60, attack: 9, defense: 6, speed: 4, drop: 'health_elixir' },
            { id: 4, name: 'Mago Negro do Ar', x: 1700, y: 1400, area: 'destroyed', defeated: false, element: 'air', hp: 40, maxHp: 40, attack: 10, defense: 2, speed: 10, drop: 'mana_elixir' },
            { id: 5, name: 'Mago Negro das Trevas', x: 1600, y: 1800, area: 'destroyed', defeated: false, element: 'dark', hp: 55, maxHp: 55, attack: 10, defense: 5, speed: 8, drop: 'legendary_elixir' }
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
        this.compass = document.getElementById('compass');
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
        document.getElementById("inventory-screen").classList.remove("active");

        // Set gameLoopRunning to false initially
        this.gameLoopRunning = false;
    }

    generateMapData() {
        const map = [];
        // The center of the "destroyed" area is conceptually at the bottom-right corner.
        const destroyedCenterX = this.mapWidth;
        const destroyedCenterY = this.mapHeight;
        // The maximum possible distance from this center is the top-left corner.
        const maxDist = Math.hypot(destroyedCenterX, destroyedCenterY);

        for (let y = 0; y < this.mapHeight; y++) {
            map[y] = [];
            for (let x = 0; x < this.mapWidth; x++) {
                // Calculate the distance of the current tile from the "destroyed" center.
                const distFromDestroyed = Math.hypot(x - destroyedCenterX, y - destroyedCenterY);

                // Normalize this distance to create a "destruction factor" from 0 (lush) to 1 (destroyed).
                // We do this by seeing how close it is to the center, relative to the max distance.
                const destructionFactor = (maxDist - distFromDestroyed) / maxDist;

                // The base tile is always grass.
                map[y][x] = 0;

                // Now, let's place features. We'll give each tile a chance to have a feature.
                const featureRand = Math.random();
                if (featureRand < 0.12) { // 12% chance for a feature to spawn on a grass tile.

                    // The type of feature depends on the destructionFactor.
                    if (Math.random() < destructionFactor) {
                        // If a random number is less than the factor, we are in a "more destroyed" zone.
                        // Place a destroyed-looking feature.
                        map[y][x] = Math.random() < 0.7 ? 3 : 4; // 70% chance of a dead tree, 30% for barren ground.
                    } else {
                        // Otherwise, we are in a "more lush" zone.
                        // Place a lush-looking feature.
                        map[y][x] = Math.random() < 0.8 ? 1 : 2; // 80% chance of a healthy tree, 20% for a rock.
                    }
                }
            }
        }

        // Manually place key structures after generation to ensure they are not overridden.
        // These are placed in the top-left, the most "lush" area.
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
            this.gameLoopRunning = true;
            this.gameLoop();
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
        document.getElementById('item-btn').addEventListener('click', () => this.showItemMenu());
        document.getElementById('defend-btn').addEventListener('click', () => this.playerDefend());
        document.getElementById('run-btn').addEventListener('click', () => this.playerRun());
        document.getElementById('back-to-actions-from-spell').addEventListener('click', () => this.hideSubMenus());
        document.getElementById('back-to-actions-from-item').addEventListener('click', () => this.hideSubMenus());
        
        // Level up buttons
        this.setupLevelUpListeners();
        document.getElementById('confirm-stats').addEventListener('click', () => this.confirmStatDistribution());
        
        // Inventory buttons
        document.getElementById('inventory-btn').addEventListener('click', () => this.showInventory());
        document.getElementById('close-inventory-btn').addEventListener('click', () => this.hideInventory());

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
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

    showInventory() {
        this.gameState = 'inventory';
        this.showScreen('inventory-screen');
        this.populateInventory();
    }

    hideInventory() {
        this.showScreen('game-screen');
        this.gameState = 'playing';
    }

    populateInventory() {
        const inventoryGrid = document.getElementById('inventory-items');
        inventoryGrid.innerHTML = ''; // Limpa os itens anteriores

        if (this.player.inventory.length === 0) {
            inventoryGrid.innerHTML = '<p style="color: #ccc; grid-column: 1 / -1; text-align: center;">O inventário está vazio.</p>';
            return;
        }

        const itemCounts = this.player.inventory.reduce((acc, itemName) => {
            acc[itemName] = (acc[itemName] || 0) + 1;
            return acc;
        }, {});

        for (const itemName in itemCounts) {
            const itemData = this.getItemData(itemName);
            if (!itemData) continue;

            const itemButton = document.createElement('button');
            itemButton.className = 'inventory-item-btn';
            itemButton.onclick = () => this.useItemFromInventory(itemName);

            // Adiciona uma classe 'disabled' se o item não for usável fora de combate.
            // Por enquanto, todos os elixires são usáveis.
            // if (!itemData.usableOutOfCombat) { itemButton.disabled = true; }

            itemButton.innerHTML = `
                <div class="inventory-item">
                    <span class="item-name">${itemData.name}</span>
                    <span class="item-count">x${itemCounts[itemName]}</span>
                </div>
            `;

            inventoryGrid.appendChild(itemButton);
        }
    }

    useItemFromInventory(itemName) {
        const item = this.getItemData(itemName);
        if (!item) return;

        // Futuramente, podemos adicionar uma propriedade 'usableOutOfCombat' nos dados do item.
        // if (!item.usableOutOfCombat) return;

        // Aplica o efeito
        if (item.effect.hp) {
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + item.effect.hp);
        }
        if (item.effect.mp) {
            this.player.mp = Math.min(this.player.maxMp, this.player.mp + item.effect.mp);
        }

        // Remove um item do inventário
        const itemIndex = this.player.inventory.indexOf(itemName);
        if (itemIndex > -1) {
            this.player.inventory.splice(itemIndex, 1);
        }

        // Atualiza a UI para refletir a mudança
        this.updateUI();
        this.populateInventory();
    }

    restartGame() {
        this.player = {
            ...this.player,
            x: this.mapWidth * this.tileSize / 2,
            y: this.mapHeight * this.tileSize / 2,
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
            gold: 0,
            inventory: [],
            statPoints: 0
        };
        
        this.enemies.forEach(e => {
            e.defeated = false;
            e.hp = e.maxHp;
        });
        
        this.boss.defeated = false;
        this.boss.unlocked = false;
        this.boss.hp = this.boss.maxHp;
        
        this.startGame();
    }

    gameLoop() {
        this.updateGame();
        requestAnimationFrame(() => this.gameLoop());
    }

    updateGame() {
        if (this.gameState === 'playing') {
            this.handleMovement();
            this.checkEnemyCollisions();
            this.updateCompass();
            this.draw();
        }
        // Always update UI regardless of state to reflect changes
        this.updateUI();
    }

    updateCompass() {
        if (!this.compass) return;

        const undefeatedEnemies = this.enemies.filter(e => !e.defeated);

        if (this.boss.unlocked && !this.boss.defeated) {
            undefeatedEnemies.push(this.boss);
        }

        if (undefeatedEnemies.length === 0) {
            this.compass.style.display = 'none';
            return;
        }

        this.compass.style.display = 'flex';

        let nearestEnemy = null;
        let minDistance = Infinity;

        for (const enemy of undefeatedEnemies) {
            const distance = Math.hypot(this.player.x - enemy.x, this.player.y - enemy.y);
            if (distance < minDistance) {
                minDistance = distance;
                nearestEnemy = enemy;
            }
        }

        if (nearestEnemy) {
            const angleRad = Math.atan2(nearestEnemy.y - this.player.y, nearestEnemy.x - this.player.x);
            const angleDeg = angleRad * 180 / Math.PI;
            // Adicionamos 90 graus porque a seta CSS aponta para cima (que é -90 graus no sistema de coordenadas do atan2)
            this.compass.style.transform = `rotate(${angleDeg + 90}deg)`;
        }
    }
    
    handleMovement() {
        const speed = 5;
        let newX = this.player.x;
        let newY = this.player.y;
        
        if (this.keys['ArrowUp'] || this.keys['w']) newY -= speed;
        if (this.keys['ArrowDown'] || this.keys['s']) newY += speed;
        if (this.keys['ArrowLeft'] || this.keys['a']) newX -= speed;
        if (this.keys['ArrowRight'] || this.keys['d']) newX += speed;
        
        newX = Math.max(this.tileSize / 2, Math.min(this.mapWidth * this.tileSize - this.tileSize / 2, newX));
        newY = Math.max(this.tileSize / 2, Math.min(this.mapHeight * this.tileSize - this.tileSize / 2, newY));
        
        this.player.x = newX;
        this.player.y = newY;
        
        this.playerOffsetX = this.player.x - this.canvas.width / 2;
        this.playerOffsetY = this.player.y - this.canvas.height / 2;

        this.playerOffsetX = Math.max(0, Math.min(this.mapWidth * this.tileSize - this.canvas.width, this.playerOffsetX));
        this.playerOffsetY = Math.max(0, Math.min(this.mapHeight * this.tileSize - this.canvas.height, this.playerOffsetY));
    }
    
    checkEnemyCollisions() {
        const playerRadius = 20;
        const enemyRadius = 25;
        
        for (const enemy of this.enemies) {
            if (!enemy.defeated) {
                const distance = Math.hypot(this.player.x - enemy.x, this.player.y - enemy.y);
                if (distance < playerRadius + enemyRadius) {
                    this.startBattle(enemy);
                    return;
                }
            }
        }
        
        const allEnemiesDefeated = this.enemies.every(e => e.defeated);
        if (allEnemiesDefeated && !this.boss.unlocked) {
            this.boss.unlocked = true;
        }

        if (this.boss.unlocked && !this.boss.defeated) {
            const distance = Math.hypot(this.player.x - this.boss.x, this.player.y - this.boss.y);
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
        this.setBattleBackground();
        this.setBattleMessage(`Um ${enemy.name} apareceu!`);
        this.updateBattleUI();
    }
    
    setBattleBackground() {
        const battleScreen = document.getElementById('battle-screen');
        let bgImage = 'url(assets/images/battle_bg_forest.png)';
        
        switch (this.currentEnemy.area) {
            case 'destroyed':
                bgImage = 'url(assets/images/battle_bg_destroyed_forest.png)';
                break;
            case 'dark_lair':
                bgImage = 'url(assets/images/battle_bg_dark_lair.png)';
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
    
    hideSubMenus() {
        document.getElementById('battle-actions').style.display = 'flex';
        document.getElementById('spell-menu').classList.add('hidden');
        document.getElementById('item-menu').classList.add('hidden');
    }

    showItemMenu() {
        document.getElementById('battle-actions').style.display = 'none';
        document.getElementById('item-menu').classList.remove('hidden');
        this.populateItemMenu();
    }

    populateItemMenu() {
        const itemList = document.getElementById('item-list');
        itemList.innerHTML = '';

        if (this.player.inventory.length === 0) {
            itemList.innerHTML = '<p>Nenhum item no inventário.</p>';
            return;
        }

        // Count item quantities
        const itemCounts = this.player.inventory.reduce((acc, item) => {
            acc[item] = (acc[item] || 0) + 1;
            return acc;
        }, {});

        for (const itemName in itemCounts) {
            const item = this.getItemData(itemName);
            if (!item) continue;

            const itemBtn = document.createElement('button');
            itemBtn.className = 'item-btn';
            itemBtn.innerHTML = `
                <span class="item-name">${item.name} (x${itemCounts[itemName]})</span>
                <span class="item-desc">${item.description}</span>
            `;
            itemBtn.onclick = () => this.useItem(itemName);
            itemList.appendChild(itemBtn);
        }
    }

    useItem(itemName) {
        const item = this.getItemData(itemName);
        if (!item) return;

        // Apply effect
        if (item.effect.hp) {
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + item.effect.hp);
        }
        if (item.effect.mp) {
            this.player.mp = Math.min(this.player.maxMp, this.player.mp + item.effect.mp);
        }

        // Remove one item from inventory
        const itemIndex = this.player.inventory.indexOf(itemName);
        if (itemIndex > -1) {
            this.player.inventory.splice(itemIndex, 1);
        }

        this.setBattleMessage(`Você usou ${item.name}!`);
        this.hideSubMenus();
        this.updateBattleUI();

        // Enemy takes its turn after player uses an item
        setTimeout(() => this.enemyTurn(), 1500);
    }

    getItemData(itemName) {
        const itemDatabase = {
            'health_elixir': {
                name: 'Elixir de Vida',
                description: 'Restaura 50 HP.',
                effect: { hp: 50 }
            },
            'mana_elixir': {
                name: 'Elixir de Mana',
                description: 'Restaura 30 MP.',
                effect: { mp: 30 }
            },
            'legendary_elixir': {
                name: 'Elixir Lendário',
                description: 'Restaura 100 HP e 50 MP.',
                effect: { hp: 100, mp: 50 }
            }
        };
        return itemDatabase[itemName];
    }
    
    populateSpellMenu() {
        const spellList = document.getElementById('spell-list');
        spellList.innerHTML = '';
        
        this.player.spells.forEach(spell => {
            const spellBtn = document.createElement('button');
            spellBtn.className = 'spell-btn';
            spellBtn.innerHTML = `<span class="spell-name">${spell.name}</span><span class="spell-cost">Custo: ${spell.cost} MP</span>`;
            
            if (this.player.mp >= spell.cost) {
                spellBtn.onclick = () => this.playerAttack(spell);
            } else {
                spellBtn.disabled = true;
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
        this.hideSubMenus();
        this.addSpellEffect(spell, 'player');
        
        if (spell.heal) {
            const healAmount = spell.heal;
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);
            this.setBattleMessage(`Você se curou em ${healAmount} de vida!`);
        } else {
            let damage = spell.damage + this.player.attack;
            const effectiveness = this.getElementEffectiveness(spell.element, this.currentEnemy.element);
            damage = Math.floor(damage * effectiveness);
            damage = Math.max(1, damage - this.currentEnemy.defense);
            this.currentEnemy.hp -= damage;
            
            let message = `Você usou ${spell.name} e causou ${damage} de dano!`;
            if (effectiveness > 1) message += ' É super efetivo!';
            if (effectiveness < 1) message += ' Não é muito efetivo...';
            this.setBattleMessage(message);
        }
        
        this.updateBattleUI();
        
        if (this.currentEnemy.hp <= 0) {
            setTimeout(() => this.endBattle(true), 1500);
        } else {
            setTimeout(() => this.enemyTurn(), 1500);
        }
    }
    
    addSpellEffect(spell, caster) {
        const battleScreen = document.getElementById('battle-screen');
        if (!battleScreen) return;

        let effectImageSrc = '';
        switch (spell.element) {
            case 'fire':
                effectImageSrc = 'assets/images/fire_spell_effect.png';
                break;
            case 'water':
                effectImageSrc = 'assets/images/water_spell_effect.png';
                break;
            case 'light': // This is used for healing
                effectImageSrc = 'assets/images/heal_spell_effect.png';
                break;
            case 'air':
                effectImageSrc = 'assets/images/lightning_spell_effect.png';
                break;
            case 'earth':
                effectImageSrc = 'assets/images/earthquake_spell_effect.png';
                break;
            case 'defense':
                effectImageSrc = 'assets/images/shield_spell_effect.png';
                break;
        }

        if (!effectImageSrc) return;

        const effectImg = document.createElement('img');
        effectImg.src = effectImageSrc;
        effectImg.className = 'spell-effect';

        let targetElement;
        if (spell.heal) {
            targetElement = document.getElementById('player-sprite');
        } else {
            targetElement = caster === 'player'
                ? document.getElementById('enemy-sprite')
                : document.getElementById('player-sprite');
        }

        if (!targetElement) return;

        const targetRect = targetElement.getBoundingClientRect();
        const battleRect = battleScreen.getBoundingClientRect();

        // Position the effect over the center of the target
        effectImg.style.left = `${targetRect.left - battleRect.left + (targetRect.width / 2) - 50}px`; // 50 is half of effect width
        effectImg.style.top = `${targetRect.top - battleRect.top + (targetRect.height / 2) - 50}px`; // 50 is half of effect height

        battleScreen.appendChild(effectImg);

        // Remove the effect element after the animation finishes (700ms)
        setTimeout(() => {
            if (effectImg.parentNode === battleScreen) {
                battleScreen.removeChild(effectImg);
            }
        }, 700);
    }
    
    playerDefend() {
        this.setBattleMessage('Você se defendeu e recuperou um pouco de mana!');
        this.player.mp = Math.min(this.player.maxMp, this.player.mp + 5);
        this.updateBattleUI();
        setTimeout(() => this.enemyTurn(), 1500);
    }
    
    playerRun() {
        this.setBattleMessage('Você fugiu da batalha!');
        setTimeout(() => this.endBattle(false), 1500);
    }
    
    enemyTurn() {
        if (this.currentEnemy.hp <= 0) return;
        
        const enemySpells = this.getEnemySpells(this.currentEnemy.element);
        const spell = enemySpells[Math.floor(Math.random() * enemySpells.length)];
        this.addSpellEffect(spell, 'enemy');
        
        let damage = spell.damage + this.currentEnemy.attack;
        const effectiveness = this.getElementEffectiveness(spell.element, 'light');
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
            this.battleState = 'choosing';
            this.setBattleMessage('Escolha sua ação!');
            document.getElementById('battle-actions').style.display = 'flex';
        }
    }
    
    getEnemySpells(element) {
        const spells = {
            fire: [{ name: 'Bola de Fogo', element: 'fire', damage: 12 }],
            water: [{ name: 'Jato de Água', element: 'water', damage: 10 }],
            earth: [{ name: 'Pedra Afiada', element: 'earth', damage: 14 }],
            air: [{ name: 'Vendaval', element: 'air', damage: 11 }],
            dark: [{ name: 'Sombra Negra', element: 'dark', damage: 15 }]
        };
        return spells[element] || [];
    }
    
    endBattle(isVictory) {
        if (isVictory) {
            this.setBattleMessage(`${this.currentEnemy.name} foi derrotado!`);
            this.currentEnemy.defeated = true;
            this.player.exp += 50;
            this.player.gold += 20;

            if (this.currentEnemy.drop) {
                this.player.inventory.push(this.currentEnemy.drop);
                this.setBattleMessage(`Você encontrou um ${this.currentEnemy.drop.replace('_', ' ')}!`);
            }

            if (this.player.exp >= this.player.expToNext) {
                this.levelUp();
                return;
            }
        }
        
        this.gameState = 'playing';
        this.showScreen('game-screen');
    }
    
    levelUp() {
        this.player.level++;
        this.player.exp -= this.player.expToNext;
        this.player.expToNext = Math.floor(this.player.expToNext * 1.5);
        this.player.statPoints = (this.player.statPoints || 0) + 3;

        this.setBattleMessage(`Você subiu para o nível ${this.player.level}!`);
        setTimeout(() => {
            this.showScreen('levelup-screen');
            this.updateLevelUpUI();
        }, 1500);
    }

    setupLevelUpListeners() {
        document.querySelectorAll('.stat-btn').forEach(button => {
            button.addEventListener('click', () => {
                const stat = button.dataset.stat;
                if (this.player.statPoints > 0) {
                    this.player.statPoints--;
                    switch (stat) {
                        case 'hp': this.player.maxHp += 10; this.player.hp += 10; break;
                        case 'mp': this.player.maxMp += 5; this.player.mp += 5; break;
                        case 'attack': this.player.attack++; break;
                        case 'defense': this.player.defense++; break;
                        case 'speed': this.player.speed++; break;
                    }
                    this.updateLevelUpUI();
                }
            });
        });
    }

    updateLevelUpUI() {
        document.getElementById('new-level').textContent = this.player.level;
        document.getElementById('stat-points').textContent = this.player.statPoints;
        document.getElementById('hp-points').textContent = this.player.maxHp;
        document.getElementById('mp-points').textContent = this.player.maxMp;
        document.getElementById('attack-points').textContent = this.player.attack;
        document.getElementById('defense-points').textContent = this.player.defense;
        document.getElementById('speed-points').textContent = this.player.speed;
    }

    confirmStatDistribution() {
        this.showScreen('game-screen');
        this.gameState = 'playing';
    }
    
    gameOver() {
        this.showScreen('gameover-screen');
        document.getElementById('gameover-title').textContent = 'Game Over';
        document.getElementById('gameover-message').textContent = 'Você foi derrotado!';
        this.gameState = 'gameover';
    }
    
    updateUI() {
        document.getElementById('player-hp-bar').style.width = `${(this.player.hp / this.player.maxHp) * 100}%`;
        document.getElementById('player-mp-bar').style.width = `${(this.player.mp / this.player.maxMp) * 100}%`;
        document.getElementById('player-hp-text').textContent = `${this.player.hp}/${this.player.maxHp}`;
        document.getElementById('player-mp-text').textContent = `${this.player.mp}/${this.player.maxMp}`;
        document.getElementById('player-level').textContent = `Nível: ${this.player.level}`;
        document.getElementById('player-exp').textContent = `EXP: ${this.player.exp}/${this.player.expToNext}`;

        if (this.gameState === 'battle') {
            this.updateBattleUI();
        }
    }

    updateBattleUI() {
        if (!this.currentEnemy) return;
        document.getElementById('battle-player-hp-bar').style.width = `${(this.player.hp / this.player.maxHp) * 100}%`;
        document.getElementById('battle-player-mp-bar').style.width = `${(this.player.mp / this.player.maxMp) * 100}%`;
        document.getElementById('battle-player-hp-text').textContent = `${this.player.hp}/${this.player.maxHp}`;
        document.getElementById('battle-player-mp-text').textContent = `${this.player.mp}/${this.player.maxMp}`;
        document.getElementById('enemy-name').textContent = this.currentEnemy.name;
        document.getElementById('enemy-hp-bar').style.width = `${(this.currentEnemy.hp / this.currentEnemy.maxHp) * 100}%`;
        document.getElementById('enemy-hp-text').textContent = `${this.currentEnemy.hp}/${this.currentEnemy.maxHp}`;
    }
    
    setBattleMessage(message) {
        document.getElementById('battle-message').textContent = message;
    }
    
    getElementEffectiveness(attackElement, defenseElement) {
        const chart = this.elementChart[attackElement];
        if (!chart) return 1;
        if (chart.strong.includes(defenseElement)) return 1.5;
        if (chart.weak.includes(defenseElement)) return 0.5;
        return 1;
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const tileColors = {
            0: '#228B22', // Grass - ForestGreen
            1: '#006400', // Tree - DarkGreen
            2: '#808080', // Rock - Gray
            3: '#8B4513', // Dead Tree - SaddleBrown
            4: '#F4A460', // Barren Ground - SandyBrown
            5: '#1C1C1C', // Dark Ground - Almost black
            6: '#4B0082', // Dark Pillar - Indigo
            7: '#A0522D', // House - Sienna
            8: '#A0522D'  // Cabin - Sienna
        };

        // Draw map tiles
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                const tileType = this.mapData[y][x];
                let tileImage;
                switch (tileType) {
                    case 0: tileImage = this.images.seamless_grass_tile; break;
                    case 1: tileImage = this.images.forest_tree_tile; break;
                    case 2: tileImage = this.images.rock_tile; break;
                    case 3: tileImage = this.images.dead_tree_tile; break;
                    case 4: tileImage = this.images.barren_ground_tile; break;
                    case 5: tileImage = this.images.dark_ground_tile; break;
                    case 6: tileImage = this.images.dark_pillar_tile; break;
                    case 7: tileImage = this.images.forest_house_tile; break;
                    case 8: tileImage = this.images.forest_cabin_tile; break;
                }
                
                const drawX = x * this.tileSize - this.playerOffsetX;
                const drawY = y * this.tileSize - this.playerOffsetY;

                if (tileImage && tileImage.naturalWidth > 0) {
                    this.ctx.drawImage(tileImage, drawX, drawY, this.tileSize, this.tileSize);
                } else {
                    // Fallback drawing
                    this.ctx.fillStyle = tileColors[tileType] || '#FFFFFF';
                    this.ctx.fillRect(drawX, drawY, this.tileSize, this.tileSize);
                }
            }
        }
        
        // Draw player
        const playerSprite = this.images.player_wizard_sprite;
        if (playerSprite && playerSprite.naturalWidth > 0) {
            this.ctx.drawImage(playerSprite, this.player.x - this.playerOffsetX - 24, this.player.y - this.playerOffsetY - 24, 48, 48);
        } else {
            this.ctx.fillStyle = 'blue';
            this.ctx.beginPath();
            this.ctx.arc(this.player.x - this.playerOffsetX, this.player.y - this.playerOffsetY, 20, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        // Draw enemies
        const enemySprite = this.images.dark_wizard_sprite;
        this.enemies.forEach(enemy => {
            if (!enemy.defeated) {
                if (enemySprite && enemySprite.naturalWidth > 0) {
                    this.ctx.drawImage(enemySprite, enemy.x - this.playerOffsetX - 24, enemy.y - this.playerOffsetY - 24, 48, 48);
                } else {
                    this.ctx.fillStyle = 'red';
                    this.ctx.beginPath();
                    this.ctx.arc(enemy.x - this.playerOffsetX, enemy.y - this.playerOffsetY, 25, 0, 2 * Math.PI);
                    this.ctx.fill();
                }
            }
        });
        
        // Draw boss
        const bossSprite = this.images.dark_king_sprite;
        if (this.boss.unlocked && !this.boss.defeated) {
            if (bossSprite && bossSprite.naturalWidth > 0) {
                this.ctx.drawImage(bossSprite, this.boss.x - this.playerOffsetX - 32, this.boss.y - this.playerOffsetY - 32, 64, 64);
            } else {
                this.ctx.fillStyle = '#4B0082'; // Indigo
                this.ctx.beginPath();
                this.ctx.arc(this.boss.x - this.playerOffsetX, this.boss.y - this.playerOffsetY, 30, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        }
    }
}

// Initialize enhanced game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new EnhancedMagicTactic();
});


