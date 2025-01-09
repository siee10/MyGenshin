class JumpManager {
    constructor(game) {
        this.game = game;
        this.notes = [];  // 存储所有音符
        this.lanes = [160, 240, 320, 400];  // 四个轨道的X坐标
        this.hitY = 300;  // 判定线Y坐标
        this.speed = 3;   // 音符下落速度
    }

    async initializeDOM() {
        this.jumpContainer = document.getElementById('jumpContainer');
        this.app = new PIXI.Application();
        await this.app.init({ width: 640, height: 360, backgroundColor: 0x000000 });
        this.jumpContainer.appendChild(this.app.canvas);

        // 加载音符图片
        await PIXI.Assets.load('jump/img/test1.png');
        
        // 创建判定线
        const hitLine = new PIXI.Graphics();
        hitLine.lineStyle(4, 0x00FF00);  // 加粗判定线，使用亮绿色
        hitLine.moveTo(100, this.hitY);
        hitLine.lineTo(500, this.hitY);
        hitLine.endFill();
        this.app.stage.addChild(hitLine);

        // 创建轨道线
        const lanes = new PIXI.Graphics();
        lanes.lineStyle(2, 0x444444);  // 加粗轨道线，使用浅灰色
        this.lanes.forEach(x => {
            lanes.moveTo(x, 0);
            lanes.lineTo(x, 360);
        });
        lanes.endFill();
        this.app.stage.addChild(lanes);

        // 定期生成音符
        setInterval(() => this.createNote(), 1000);

        // 启动游戏循环
        this.app.ticker.add(() => this.gameLoop());
    }

    createNote() {
        // 随机选择一个轨道
        const lane = Math.floor(Math.random() * 4);
        const note = PIXI.Sprite.from('jump/img/test1.png');
        
        // 设置音符位置和属性
        note.x = this.lanes[lane];
        note.y = 0;
        note.anchor.set(0.5);
        note.scale.set(0.5);
        
        this.notes.push(note);
        this.app.stage.addChild(note);
    }

    gameLoop() {
        // 更新所有音符的位置
        for (let i = this.notes.length - 1; i >= 0; i--) {
            const note = this.notes[i];
            note.y += this.speed;

            // 如果音符超出屏幕，移除它
            if (note.y > 360) {
                this.app.stage.removeChild(note);
                this.notes.splice(i, 1);
            }
        }
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            let laneIndex;
            switch(e.key.toLowerCase()) {
                case 'd': laneIndex = 0; break;
                case 'f': laneIndex = 1; break;
                case 'j': laneIndex = 2; break;
                case 'k': laneIndex = 3; break;
                default: return;
            }

            // 检查是否有音符在判定范围内
            this.checkHit(laneIndex);
        });
    }

    checkHit(laneIndex) {
        const hitRange = 30;  // 判定范围
        
        for (let i = this.notes.length - 1; i >= 0; i--) {
            const note = this.notes[i];
            if (Math.abs(note.x - this.lanes[laneIndex]) < 10 && 
                Math.abs(note.y - this.hitY) < hitRange) {
                // 命中音符
                this.app.stage.removeChild(note);
                this.notes.splice(i, 1);
                this.showHitEffect(this.lanes[laneIndex], this.hitY);
                break;
            }
        }
    }

    showHitEffect(x, y) {
        const effect = new PIXI.Graphics();
        effect.beginFill(0xFFFFFF);
        effect.drawCircle(x, y, 20);
        effect.endFill();
        effect.alpha = 0.5;
        this.app.stage.addChild(effect);

        // 动画效果
        let alpha = 0.5;
        const fadeOut = () => {
            alpha -= 0.1;
            effect.alpha = alpha;
            if (alpha <= 0) {
                this.app.stage.removeChild(effect);
            } else {
                requestAnimationFrame(fadeOut);
            }
        };
        fadeOut();
    }
} 