class StatsManager {
    constructor(game) {
        this.game = game;
        this.stats = {
            fiveStar: 0,
            fourStar: 0,
            threeStar: 0,
            total: 0
        };
    }

    initializeDOM() {
        this.fiveStarCount = document.getElementById('fiveStarCount');
        this.fourStarCount = document.getElementById('fourStarCount');
        this.threeStarCount = document.getElementById('threeStarCount');
        this.fiveStarRate = document.getElementById('fiveStarRate');
        this.fourStarRate = document.getElementById('fourStarRate');
        this.threeStarRate = document.getElementById('threeStarRate');
        this.totalPulls = document.getElementById('totalPulls');
    }

    updateDisplay() {
        this.fiveStarCount.textContent = this.stats.fiveStar;
        this.fourStarCount.textContent = this.stats.fourStar;
        this.threeStarCount.textContent = this.stats.threeStar;
        this.totalPulls.textContent = this.stats.total;

        if (this.stats.total > 0) {
            this.fiveStarRate.textContent = 
                `${(this.stats.fiveStar / this.stats.total * 100).toFixed(1)}%`;
            this.fourStarRate.textContent = 
                `${(this.stats.fourStar / this.stats.total * 100).toFixed(1)}%`;
            this.threeStarRate.textContent = 
                `${(this.stats.threeStar / this.stats.total * 100).toFixed(1)}%`;
        }
    }

    updateWishStats(rarity) {
        if (rarity) {
            this.stats.total++;
            switch(rarity) {
                case 'five-star':
                    this.stats.fiveStar++;
                    break;
                case 'four-star':
                    this.stats.fourStar++;
                    break;
                case 'three-star':
                    this.stats.threeStar++;
                    break;
            }
        }

        this.updateDisplay();
    }

    getStats() {
        return this.stats;
    }

    setStats(stats) {
        this.stats = stats;
        this.updateWishStats(null);
    }
} 