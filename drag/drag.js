class DragManager {
    constructor() {
        this.initDraggable();
    }

    initDraggable() {
        const buttons = document.querySelectorAll('.draggable-button');
        const container = document.querySelector('.draggable-container');

        buttons.forEach((button, index) => {
            // 设置初始位置
            button.style.left = `${20 + index * 120}px`;
            button.style.top = '20px';

            button.addEventListener('dragstart', (e) => {
                button.classList.add('dragging');
                // 存储鼠标在按钮内的相对位置
                const rect = button.getBoundingClientRect();
                button.dataset.offsetX = e.clientX - rect.left;
                button.dataset.offsetY = e.clientY - rect.top;
            });

            button.addEventListener('dragend', (e) => {
                button.classList.remove('dragging');
                // 获取当前容器位置
                const containerRect = container.getBoundingClientRect();
                
                // 计算新位置，相对于容器
                const x = e.clientX - containerRect.left - parseInt(button.dataset.offsetX);
                const y = e.clientY - containerRect.top - parseInt(button.dataset.offsetY);
                
                // 限制在容器内
                const maxX = containerRect.width - button.offsetWidth;
                const maxY = containerRect.height - button.offsetHeight;
                
                button.style.left = `${Math.max(0, Math.min(maxX, x))}px`;
                button.style.top = `${Math.max(0, Math.min(maxY, y))}px`;
            });
        });

        container.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
    }
} 