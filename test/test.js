class TestManager {
    constructor(game) {
        this.game = game;
    }

    initializeDOM() {
        this.testButtonD = document.getElementById('testButtonD');
        this.testButtonF = document.getElementById('testButtonF');
        this.testButtonJ = document.getElementById('testButtonJ');
        this.testButtonK = document.getElementById('testButtonK');
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'd':
                    this.testButtonD.classList.add('active');
                    break;
                case 'f':
                    this.testButtonF.classList.add('active');
                    break;
                case 'j':
                    this.testButtonJ.classList.add('active');
                    break;
                case 'k':
                    this.testButtonK.classList.add('active');
                    break;
            }
        });

        document.addEventListener('keyup', (e) => {
            switch(e.key.toLowerCase()) {
                case 'd':
                    this.testButtonD.classList.remove('active');
                    break;
                case 'f':
                    this.testButtonF.classList.remove('active');
                    break;
                case 'j':
                    this.testButtonJ.classList.remove('active');
                    break;
                case 'k':
                    this.testButtonK.classList.remove('active');
                    break;
            }
        });
    }
} 