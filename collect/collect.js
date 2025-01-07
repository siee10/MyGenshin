class CollectManager {
    constructor(game) {
        this.game = game;
        this.primogems = 0;
        this.collectors = 0;
        this.basePerSecond = 1;
        this.efficiencyLevel = 1;
        this.collectorCost = 10;
        this.efficiencyCost = 20;
        
        // 启动自动收集
        this.startAutoCollect();
    }

    initializeDOM() {
        this.primogemsDisplay = document.getElementById('primogems');
        this.perSecondDisplay = document.getElementById('perSecond');
        this.collectorsDisplay = document.getElementById('collectors');
        this.collectorEfficiencyDisplay = document.getElementById('collectorEfficiency');
        
        this.collectButton = document.getElementById('collectButton');
        this.buyCollectorButton = document.getElementById('buyCollector');
        this.upgradeEfficiencyButton = document.getElementById('upgradeEfficiency');
    }

    bindEvents() {
        this.collectButton.addEventListener('click', () => this.collect());
        this.buyCollectorButton.addEventListener('click', () => this.buyCollector());
        this.upgradeEfficiencyButton.addEventListener('click', () => this.upgradeEfficiency());
    }

    updateDisplay() {
        this.primogemsDisplay.textContent = Math.floor(this.primogems);
        this.collectorsDisplay.textContent = this.collectors;
        
        const perSecond = this.collectors * this.basePerSecond * this.efficiencyLevel;
        this.perSecondDisplay.textContent = perSecond.toFixed(1);
        
        const collectorEfficiency = this.basePerSecond * this.efficiencyLevel;
        this.collectorEfficiencyDisplay.textContent = collectorEfficiency.toFixed(1);
        
        this.buyCollectorButton.disabled = this.primogems < this.collectorCost;
        this.upgradeEfficiencyButton.disabled = this.primogems < this.efficiencyCost;
    }

    collect() {
        const amount = this.basePerSecond * this.efficiencyLevel;
        this.primogems += amount;
        this.game.createFloatingText(`+${amount}`, this.collectButton);
        this.game.updateDisplay();
    }

    startAutoCollect() {
        setInterval(() => {
            const amount = this.collectors * this.basePerSecond * this.efficiencyLevel;
            if (amount > 0) {
                this.primogems += amount;
                this.game.updateDisplay();
            }
        }, 1000);
    }

    buyCollector() {
        if (this.primogems >= this.collectorCost) {
            this.primogems -= this.collectorCost;
            this.collectors++;
            this.collectorCost = Math.floor(this.collectorCost * 1.5);
            this.buyCollectorButton.textContent = `购买收集器 (💎${this.collectorCost})`;
            this.game.updateDisplay();
            this.game.showMessage('购买了一个自动收集器！', 'success');
        }
    }

    upgradeEfficiency() {
        if (this.primogems >= this.efficiencyCost) {
            this.primogems -= this.efficiencyCost;
            this.efficiencyLevel++;
            this.efficiencyCost = Math.floor(this.efficiencyCost * 2);
            this.upgradeEfficiencyButton.textContent = `提升效率 (💎${this.efficiencyCost})`;
            this.game.updateDisplay();
            this.game.showMessage('效率提升了！', 'success');
        }
    }

    getData() {
        return {
            primogems: this.primogems,
            collectors: this.collectors,
            collectorCost: this.collectorCost,
            efficiencyLevel: this.efficiencyLevel,
            efficiencyCost: this.efficiencyCost
        };
    }

    setData(data) {
        this.primogems = data.primogems || 0;
        this.collectors = data.collectors || 0;
        this.collectorCost = data.collectorCost || 10;
        this.efficiencyLevel = data.efficiencyLevel || 1;
        this.efficiencyCost = data.efficiencyCost || 50;
        
        this.buyCollectorButton.textContent = `购买收集器 (💎${this.collectorCost})`;
        this.upgradeEfficiencyButton.textContent = `提升效率 (💎${this.efficiencyCost})`;
        this.game.updateDisplay();
    }
} 