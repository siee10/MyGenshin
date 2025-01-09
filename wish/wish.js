class WishManager {
    constructor(game) {
        this.game = game;
        this.currentPool = 'character';
        this.isWishing = false;
        this.wishCost = 160;
        this.pityCounter4 = 0;
        this.pityCounter5 = 0;
        this.pity4StarThreshold = 10;
        this.pity5StarThreshold = 90;
        
        this.loadCharacterData();
    }

    initializeDOM() {
        this.wishResults = document.getElementById('wishResults');
        this.singleWishButton = document.getElementById('singleWish');
        this.tenWishButton = document.getElementById('tenWish');
        this.characterPoolButton = document.getElementById('characterPool');
        this.weaponPoolButton = document.getElementById('weaponPool');
        this.pity4Display = document.getElementById('pity4');
        this.pity5Display = document.getElementById('pity5');
    }

    bindEvents() {
        this.singleWishButton.addEventListener('click', () => this.wish(1));
        this.tenWishButton.addEventListener('click', () => this.wish(10));
        this.characterPoolButton.addEventListener('click', () => this.switchPool('character'));
        this.weaponPoolButton.addEventListener('click', () => this.switchPool('weapon'));
    }

    updateDisplay() {
        this.pity4Display.textContent = this.pityCounter4;
        this.pity5Display.textContent = this.pityCounter5;
        
        this.singleWishButton.disabled = this.game.collectManager.primogems < this.wishCost;
        this.tenWishButton.disabled = this.game.collectManager.primogems < (this.wishCost * 10);
    }

    async loadCharacterData() {
        try {
            const response = await fetch('pools.json');
            this.pools = await response.json();
        } catch (error) {
            console.error('加载奖池数据失败:', error);
            this.pools = {
                character: {
                    five_stars: ['5星角色加载失败'],
                    four_stars: ['4星角色加载失败']
                },
                weapon: {
                    five_stars: ['5星武器加载失败'],
                    four_stars: ['4星武器加载失败'],
                    three_stars: ['3星武器加载失败']
                }
            };
        }
    }

    switchPool(poolType) {
        this.currentPool = poolType;
        this.characterPoolButton.classList.toggle('active', poolType === 'character');
        this.weaponPoolButton.classList.toggle('active', poolType === 'weapon');
        this.wishResults.innerHTML = '';
    }

    wish(count) {
        if (this.isWishing) return;
        
        const totalCost = this.wishCost * count;
        if (this.game.collectManager.primogems >= totalCost) {
            this.isWishing = true;
            this.game.collectManager.primogems -= totalCost;
            this.game.updateDisplay();
            
            this.game.disableAllButtons();
            this.wishResults.innerHTML = '';
            
            let completedAnimations = 0;
            
            // 创建一个Promise来处理所有的祈愿动画
            const wishPromises = Array(count).fill().map((_, i) => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        const result = this.getWishResult(count);
                        this.showWishResult(result);
                        resolve();
                    }, i * 100);
                });
            });

            // 等待所有祈愿动画完成
            Promise.all(wishPromises).then(() => {
                this.isWishing = false;
                this.game.enableAllButtons();
            });
        } else {
            this.game.showMessage('原石不足！', 'wrong');
        }
    }

    getWishResult() {
        this.pityCounter4++;
        this.pityCounter5++;
        
        let result = {
            rarity: null,
            name: null
        };
        
        if (this.pityCounter5 >= this.pity5StarThreshold) {
            result.rarity = 'five-star';
            result.name = this.getRandomCharacter('five_stars');
            this.pityCounter5 = 0;
            this.pityCounter4 = 0;
        } else if (this.pityCounter4 >= this.pity4StarThreshold) {
            result.rarity = 'four-star';
            result.name = this.getRandomCharacter('four_stars');
            this.pityCounter4 = 0;
        } else {
            const random = Math.random() * 100;
            if (random <= 0.6) {
                result.rarity = 'five-star';
                result.name = this.getRandomCharacter('five_stars');
                this.pityCounter5 = 0;
                this.pityCounter4 = 0;
            } else if (random <= 5.7) {
                result.rarity = 'four-star';
                result.name = this.getRandomCharacter('four_stars');
                this.pityCounter4 = 0;
            } else {
                result.rarity = 'three-star';
                result.name = this.getRandomCharacter('three_stars');
            }
        }
        
        this.game.updateDisplay();
        return result;
    }

    getRandomCharacter(rarity) {
        if (!this.pools || !this.pools[this.currentPool]) {
            return '加载中...';
        }
        const pool = this.pools[this.currentPool];
        
        if (this.currentPool === 'character' && rarity === 'three_stars') {
            return this.pools.weapon.three_stars[
                Math.floor(Math.random() * this.pools.weapon.three_stars.length)
            ];
        }
        
        if (!pool[rarity]) {
            return '未知物品';
        }
        
        const list = pool[rarity];
        return list[Math.floor(Math.random() * list.length)];
    }

    showWishResult(result) {
        const item = document.createElement('div');
        item.className = `wish-item ${result.rarity}`;
        
        const name = document.createElement('span');
        name.className = 'character-name';
        name.textContent = result.name;
        item.appendChild(name);

        if (result.rarity === 'five-star' || result.rarity === 'four-star') {
            const starEffect = document.createElement('div');
            starEffect.className = 'star-effect';
            item.appendChild(starEffect);
        }
        
        const poolType = this.currentPool === 'character' ? '角色' : '武器';
        if (result.rarity === 'five-star') {
            this.game.showMessage(`⭐⭐⭐⭐⭐ 金！${poolType}：${result.name}`, 'success');
            document.body.classList.add('five-star-effect');
            setTimeout(() => document.body.classList.remove('five-star-effect'), 500);
        } else if (result.rarity === 'four-star') {
            this.game.showMessage(`⭐⭐⭐⭐ 紫！${poolType}：${result.name}`, 'success');
        }
        
        this.wishResults.appendChild(item);
        this.game.statsManager.updateWishStats(result.rarity);
    }

    getData() {
        return {
            pityCounter4: this.pityCounter4,
            pityCounter5: this.pityCounter5
        };
    }

    setData(data) {
        this.pityCounter4 = data.pityCounter4 || 0;
        this.pityCounter5 = data.pityCounter5 || 0;
        this.game.updateDisplay();
    }
} 