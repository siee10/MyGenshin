class IdleGame {
    constructor() {
        // 初始化各个管理器
        this.collectManager = new CollectManager(this);
        this.wishManager = new WishManager(this);
        this.statsManager = new StatsManager(this);
        this.systemManager = new SystemManager(this);
        
        // 初始化基础UI
        this.initializeBaseDOM();
        this.initTabs();
        
        // 让各管理器初始化它们的UI
        this.collectManager.initializeDOM();
        this.wishManager.initializeDOM();
        this.statsManager.initializeDOM();
        this.systemManager.initializeDOM();
        
        // 统一绑定事件
        this.bindAllEvents();
        
        // 加载数据和启动自动功能
        this.systemManager.loadGame();
        this.systemManager.startAutoSave();
        
        // 初始更新显示
        this.updateDisplay();
    }

    // 添加统一的更新显示方法
    updateDisplay() {
        this.collectManager.updateDisplay();
        this.wishManager.updateDisplay();
        this.statsManager.updateDisplay();
    }

    bindAllEvents() {
        // 绑定各个管理器的事件
        this.collectManager.bindEvents();
        this.wishManager.bindEvents();
        this.systemManager.bindEvents();
        
        // 绑定标签切换事件
        this.initTabs();
    }

    initializeBaseDOM() {
        this.message = document.getElementById('message');
    }

    initTabs() {
        const tabs = document.querySelectorAll('.tab-button');
        const contents = document.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                const contentId = tab.dataset.tab;
                const content = document.querySelector(`.${contentId}-content`);
                if (content) {
                    content.classList.add('active');
                }
            });
        });
    }

    // 显示消息
    showMessage(text, type) {
        this.message.textContent = text;
        this.message.className = `message message-${type}`;
        setTimeout(() => {
            this.message.textContent = '';
            this.message.className = 'message';
        }, 2000);
    }

    // 创建浮动文字效果
    createFloatingText(text, button) {
        const floatingText = document.createElement('div');
        floatingText.className = 'floating-text';
        floatingText.textContent = text;
        
        const buttonRect = button.getBoundingClientRect();
        const randomX = Math.random() * 40 - 20;
        
        floatingText.style.left = `${buttonRect.left + buttonRect.width / 2 + randomX}px`;
        floatingText.style.top = `${buttonRect.top}px`;
        
        document.body.appendChild(floatingText);
        setTimeout(() => floatingText.remove(), 1000);
    }

    // 添加禁用所有按钮的方法
    disableAllButtons() {
        // 收集相关按钮
        this.collectManager.collectButton.disabled = true;
        this.collectManager.buyCollectorButton.disabled = true;
        this.collectManager.upgradeEfficiencyButton.disabled = true;
        
        // 祈愿相关按钮
        this.wishManager.singleWishButton.disabled = true;
        this.wishManager.tenWishButton.disabled = true;
        this.wishManager.characterPoolButton.disabled = true;
        this.wishManager.weaponPoolButton.disabled = true;
        
        // 系统相关按钮
        this.systemManager.saveButton.disabled = true;
        this.systemManager.loadButton.disabled = true;
        this.systemManager.resetButton.disabled = true;
        this.systemManager.exportButton.disabled = true;
        this.systemManager.importButton.disabled = true;
    }

    // 添加启用所有按钮的方法
    enableAllButtons() {
        // 收集相关按钮
        this.collectManager.collectButton.disabled = false;
        this.collectManager.buyCollectorButton.disabled = false;
        this.collectManager.upgradeEfficiencyButton.disabled = false;
        
        // 祈愿相关按钮
        this.wishManager.singleWishButton.disabled = false;
        this.wishManager.tenWishButton.disabled = false;
        this.wishManager.characterPoolButton.disabled = false;
        this.wishManager.weaponPoolButton.disabled = false;
        
        // 系统相关按钮
        this.systemManager.saveButton.disabled = false;
        this.systemManager.loadButton.disabled = false;
        this.systemManager.resetButton.disabled = false;
        this.systemManager.exportButton.disabled = false;
        this.systemManager.importButton.disabled = false;
    }
}