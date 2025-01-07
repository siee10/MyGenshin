class SystemManager {
    constructor(game) {
        this.game = game;
    }

    initializeDOM() {
        this.saveButton = document.getElementById('saveButton');
        this.loadButton = document.getElementById('loadButton');
        this.resetButton = document.getElementById('resetButton');
        this.exportButton = document.getElementById('exportButton');
        this.importButton = document.getElementById('importButton');
        this.importInput = document.getElementById('importInput');
    }

    bindEvents() {
        this.saveButton.addEventListener('click', () => this.manualSave());
        this.loadButton.addEventListener('click', () => this.manualLoad());
        this.resetButton.addEventListener('click', () => this.resetGame());
        this.exportButton.addEventListener('click', () => this.exportSave());
        this.importButton.addEventListener('click', () => this.importInput.click());
        this.importInput.addEventListener('change', (e) => this.importSave(e));
    }

    saveGame() {
        const gameData = {
            collect: this.game.collectManager.getData(),
            wish: this.game.wishManager.getData(),
            stats: this.game.statsManager.getStats()
        };
        localStorage.setItem('idleGameSave', JSON.stringify(gameData));
    }

    loadGame() {
        try {
            const savedGame = localStorage.getItem('idleGameSave');
            if (savedGame) {
                const gameData = JSON.parse(savedGame);
                this.game.collectManager.setData(gameData.collect || {});
                this.game.wishManager.setData(gameData.wish || {});
                this.game.statsManager.setStats(gameData.stats || {
                    fiveStar: 0,
                    fourStar: 0,
                    threeStar: 0,
                    total: 0
                });
            }
        } catch (error) {
            console.error('读取存档失败:', error);
            this.showMessage('读取存档失败！', 'wrong');
        }
    }

    startAutoSave() {
        setInterval(() => this.saveGame(), 10000); // 每10秒保存一次
    }

    manualSave() {
        this.saveGame();
        this.showMessage('游戏已保存！', 'success');
    }

    manualLoad() {
        if (confirm('确定要读取存档吗？未保存的进度将丢失。')) {
            this.loadGame();
            this.showMessage('存档已读取！', 'success');
        }
    }

    resetGame() {
        if (confirm('确定要重置游戏吗？所有进度将丢失！')) {
            localStorage.removeItem('idleGameSave');
            this.game.collectManager.setData({});
            this.game.wishManager.setData({});
            this.game.statsManager.setStats({
                fiveStar: 0,
                fourStar: 0,
                threeStar: 0,
                total: 0
            });
            this.showMessage('游戏已重置！', 'wrong');
        }
    }

    showMessage(text, type) {
        this.game.message.textContent = text;
        this.game.message.className = `message message-${type}`;
        setTimeout(() => {
            this.game.message.textContent = '';
            this.game.message.className = 'message';
        }, 2000);
    }

    exportSave() {
        const gameData = {
            collect: this.game.collectManager.getData(),
            wish: this.game.wishManager.getData(),
            stats: this.game.statsManager.getStats()
        };
        
        const blob = new Blob([JSON.stringify(gameData)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'game-save.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showMessage('存档已导出！', 'success');
    }

    importSave(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const gameData = JSON.parse(e.target.result);
                this.game.collectManager.setData(gameData.collect || {});
                this.game.wishManager.setData(gameData.wish || {});
                this.game.statsManager.setStats(gameData.stats || {
                    fiveStar: 0,
                    fourStar: 0,
                    threeStar: 0,
                    total: 0
                });
                this.showMessage('存档已导入！', 'success');
            } catch (error) {
                console.error('导入存档失败:', error);
                this.showMessage('导入存档失败！', 'wrong');
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // 清空输入，允许重复导入同一个文件
    }
} 