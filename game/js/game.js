// Magic Tactic - Jogo de RPG por Turnos
class MagicTactic {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.currentScreen = 'main-menu';
        this.gameState = 'menu';
        
        // Player data
        this.player = {
            x: 400,
            y: 300,
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
            spells: [
                { name: 'Bola de Fogo', element: 'fire', damage: 15, cost: 8 },
                { name: 'Jato de Água', element: 'water', damage: 12, cost: 6 },
                { name: 'Cura Divina', element: 'light', heal: 20, cost: 10 }
            ]
        };
        
        // Enemies data
        this.enemies = [
            { id: 1, name: 'Mago Negro do Fogo', x: 200, y: 150, defeated: false, element: 'fire', hp: 60, maxHp: 60, attack: 12, defense: 3, speed: 6 },
            { id: 2, name: 'Mago Negro da Água', x: 600, y: 150, defeated: false, element: 'water', hp: 65, maxHp: 65, attack: 10, defense: 4, speed: 7 },
            { id: 3, name: 'Mago Negro da Terra', x: 200, y: 450, defeated: false, element: 'earth', hp: 80, maxHp: 80, attack: 14, defense: 6, speed: 4 },
            { id: 4, name: 'Mago Negro do Ar', x: 600, y: 450, defeated: false, element: 'air', hp: 55, maxHp: 55, attack: 16, defense: 2, speed: 10 },
            { id: 5, name: 'Mago Negro das Trevas', x: 400, y: 100, defeated: false, element: 'dark', hp: 70, maxHp: 70, attack: 18, defense: 5, speed: 8 }
        ];
        
        this.boss = {
            name: 'Rei das Trevas',
            x: 400,
            y: 50,
            defeated: false,
            element: 'dark',
            hp: 150,
            maxHp: 150,
            attack: 25,
            defense: 8,
            speed: 12,
            unlocked: false
        };
        
        this.currentEnemy = null;
        this.battleState = 'choosing';
        this.keys = {};
        
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
        this.setupEventListeners();
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.updateUI();
    }
    
    setupEventListeners() {
        // Menu buttons
        document.getElementById('start-game').addEventListener('click', () => this.startGame());
        document.getElementById('instructions').addEventListener('click', () => this.showInstructions());
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
                this.handleMovement();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
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
        this.showScreen('game-screen');
        this.gameState = 'playing';
        this.startGameLoop();
    }
    
    restartGame() {
        // Reset player
        this.player = {
            x: 400,
            y: 300,
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
        this.updateUI();
        this.draw();
        
        if (this.gameState === 'playing') {
            requestAnimationFrame(() => this.startGameLoop());
        }
    }
    
    handleMovement() {
        const speed = 3;
        let newX = this.player.x;
        let newY = this.player.y;
        
        if (this.keys['ArrowUp'] || this.keys['w']) newY -= speed;
        if (this.keys['ArrowDown'] || this.keys['s']) newY += speed;
        if (this.keys['ArrowLeft'] || this.keys['a']) newX -= speed;
        if (this.keys['ArrowRight'] || this.keys['d']) newX += speed;
        
        // Keep player within bounds
        newX = Math.max(20, Math.min(780, newX));
        newY = Math.max(20, Math.min(580, newY));
        
        this.player.x = newX;
        this.player.y = newY;
        
        // Check for enemy collisions
        this.checkEnemyCollisions();
    }
    
    checkEnemyCollisions() {
        const playerRadius = 20;
        const enemyRadius = 25;
        
        // Check regular enemies
        this.enemies.forEach(enemy => {
            if (!enemy.defeated) {
                const distance = Math.sqrt(
                    Math.pow(this.player.x - enemy.x, 2) + 
                    Math.pow(this.player.y - enemy.y, 2)
                );
                
                if (distance < playerRadius + enemyRadius) {
                    this.startBattle(enemy);
                }
            }
        });
        
        // Check boss (only if unlocked)
        if (this.boss.unlocked && !this.boss.defeated) {
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
        this.setBattleMessage(`Um ${enemy.name} apareceu!`);
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
            this.startGameLoop();
        }, 1500);
    }
    
    enemyTurn() {
        if (this.currentEnemy.hp <= 0) return;
        
        // Simple AI: attack with random spell
        const enemySpells = this.getEnemySpells(this.currentEnemy.element);
        const spell = enemySpells[Math.floor(Math.random() * enemySpells.length)];
        
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
            earth: [{ name: 'Terremoto', element: 'earth', damage: 14 }],
            air: [{ name: 'Rajada de Vento', element: 'air', damage: 11 }],
            dark: [{ name: 'Bola Sombria', element: 'dark', damage: 16 }]
        };
        return spells[element] || spells.dark;
    }
    
    getElementEffectiveness(attackElement, defenseElement) {
        if (!this.elementChart[attackElement]) return 1;
        
        if (this.elementChart[attackElement].strong.includes(defenseElement)) {
            return 1.5;
        }
        if (this.elementChart[attackElement].weak.includes(defenseElement)) {
            return 0.75;
        }
        return 1;
    }
    
    enemyDefeated() {
        this.currentEnemy.defeated = true;
        const expGain = 25 + (this.currentEnemy.maxHp / 4);
        this.player.exp += expGain;
        
        this.setBattleMessage(`${this.currentEnemy.name} foi derrotado! Você ganhou ${expGain} EXP!`);
        
        // Check if all regular enemies are defeated
        const allEnemiesDefeated = this.enemies.every(enemy => enemy.defeated);
        if (allEnemiesDefeated && !this.boss.unlocked) {
            this.boss.unlocked = true;
            setTimeout(() => {
                this.setBattleMessage('O caminho para o Rei das Trevas foi liberado!');
            }, 2000);
        }
        
        // Check for level up
        if (this.player.exp >= this.player.expToNext) {
            setTimeout(() => this.levelUp(), 3000);
        } else {
            setTimeout(() => {
                this.gameState = 'playing';
                this.showScreen('game-screen');
                this.startGameLoop();
            }, 3000);
        }
        
        // Check for game completion
        if (this.currentEnemy === this.boss) {
            setTimeout(() => this.gameWon(), 3000);
        }
    }
    
    levelUp() {
        this.player.level++;
        this.player.exp -= this.player.expToNext;
        this.player.expToNext = Math.floor(this.player.expToNext * 1.2);
        
        this.showScreen('levelup-screen');
        document.getElementById('new-level').textContent = this.player.level;
        this.resetStatDistribution();
    }
    
    resetStatDistribution() {
        this.statPoints = 3;
        this.tempStats = { hp: 0, mp: 0, attack: 0, defense: 0, speed: 0 };
        document.getElementById('stat-points').textContent = this.statPoints;
        
        // Reset display
        Object.keys(this.tempStats).forEach(stat => {
            document.getElementById(`${stat}-points`).textContent = '0';
        });
        
        // Add event listeners to stat buttons
        document.querySelectorAll('.stat-btn').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true)); // Remove old listeners
        });
        
        document.querySelectorAll('.stat-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const stat = e.target.dataset.stat;
                if (this.statPoints > 0) {
                    this.statPoints--;
                    this.tempStats[stat]++;
                    document.getElementById('stat-points').textContent = this.statPoints;
                    document.getElementById(`${stat}-points`).textContent = this.tempStats[stat];
                }
            });
        });
    }
    
    confirmStatDistribution() {
        // Apply stat increases
        this.player.maxHp += this.tempStats.hp * 10;
        this.player.hp += this.tempStats.hp * 10;
        this.player.maxMp += this.tempStats.mp * 5;
        this.player.mp += this.tempStats.mp * 5;
        this.player.attack += this.tempStats.attack * 2;
        this.player.defense += this.tempStats.defense * 2;
        this.player.speed += this.tempStats.speed;
        
        this.gameState = 'playing';
        this.showScreen('game-screen');
        this.startGameLoop();
    }
    
    gameOver() {
        this.showScreen('gameover-screen');
        document.getElementById('gameover-title').textContent = 'Game Over';
        document.getElementById('gameover-message').textContent = 'Você foi derrotado!';
    }
    
    gameWon() {
        this.showScreen('gameover-screen');
        document.getElementById('gameover-title').textContent = 'Vitória!';
        document.getElementById('gameover-title').style.color = '#ffd700';
        document.getElementById('gameover-message').textContent = 'Você derrotou o Rei das Trevas e salvou a floresta!';
    }
    
    setBattleMessage(message) {
        document.getElementById('battle-message').textContent = message;
    }
    
    updateUI() {
        // Update HUD
        document.getElementById('player-hp-text').textContent = `${this.player.hp}/${this.player.maxHp}`;
        document.getElementById('player-mp-text').textContent = `${this.player.mp}/${this.player.maxMp}`;
        document.getElementById('player-level').textContent = `Nível: ${this.player.level}`;
        document.getElementById('player-exp').textContent = `EXP: ${this.player.exp}/${this.player.expToNext}`;
        
        // Update bars
        const hpPercent = (this.player.hp / this.player.maxHp) * 100;
        const mpPercent = (this.player.mp / this.player.maxMp) * 100;
        
        document.getElementById('player-hp-bar').style.width = `${hpPercent}%`;
        document.getElementById('player-mp-bar').style.width = `${mpPercent}%`;
    }
    
    updateBattleUI() {
        // Update enemy info
        document.getElementById('enemy-name').textContent = this.currentEnemy.name;
        document.getElementById('enemy-hp-text').textContent = `${this.currentEnemy.hp}/${this.currentEnemy.maxHp}`;
        
        // Update player battle info
        document.getElementById('battle-player-hp-text').textContent = `${this.player.hp}/${this.player.maxHp}`;
        document.getElementById('battle-player-mp-text').textContent = `${this.player.mp}/${this.player.maxMp}`;
        
        // Update bars
        const enemyHpPercent = (this.currentEnemy.hp / this.currentEnemy.maxHp) * 100;
        const playerHpPercent = (this.player.hp / this.player.maxHp) * 100;
        const playerMpPercent = (this.player.mp / this.player.maxMp) * 100;
        
        document.getElementById('enemy-hp-bar').style.width = `${enemyHpPercent}%`;
        document.getElementById('battle-player-hp-bar').style.width = `${playerHpPercent}%`;
        document.getElementById('battle-player-mp-bar').style.width = `${playerMpPercent}%`;
        
        // Update sprites
        document.getElementById('enemy-sprite').textContent = this.getEnemyEmoji(this.currentEnemy.element);
        document.getElementById('player-sprite').textContent = '🧙‍♂️';
    }
    
    getEnemyEmoji(element) {
        const emojis = {
            fire: '🔥',
            water: '💧',
            earth: '🌍',
            air: '💨',
            dark: '🌑'
        };
        return emojis[element] || '👤';
    }
    
    draw() {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(0, 0, 800, 600);
        
        // Draw forest background pattern
        this.ctx.fillStyle = '#1F5F1F';
        for (let i = 0; i < 800; i += 40) {
            for (let j = 0; j < 600; j += 40) {
                if ((i + j) % 80 === 0) {
                    this.ctx.fillRect(i, j, 20, 20);
                }
            }
        }
        
        // Draw path
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(350, 0, 100, 600);
        
        // Draw enemies
        this.enemies.forEach(enemy => {
            if (!enemy.defeated) {
                this.ctx.fillStyle = '#8B0000';
                this.ctx.beginPath();
                this.ctx.arc(enemy.x, enemy.y, 25, 0, 2 * Math.PI);
                this.ctx.fill();
                
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.font = '20px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('👤', enemy.x, enemy.y + 7);
            }
        });
        
        // Draw boss (if unlocked)
        if (this.boss.unlocked && !this.boss.defeated) {
            this.ctx.fillStyle = '#4B0082';
            this.ctx.beginPath();
            this.ctx.arc(this.boss.x, this.boss.y, 30, 0, 2 * Math.PI);
            this.ctx.fill();
            
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('👑', this.boss.x, this.boss.y + 8);
        }
        
        // Draw player
        this.ctx.fillStyle = '#0000FF';
        this.ctx.beginPath();
        this.ctx.arc(this.player.x, this.player.y, 20, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🧙‍♂️', this.player.x, this.player.y + 5);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new MagicTactic();
});

