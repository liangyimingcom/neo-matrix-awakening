// 数字雨效果
class MatrixRain {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container = document.getElementById('matrix-rain');
        this.container.appendChild(this.canvas);
        
        this.resize();
        this.drops = [];
        this.chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        
        this.initDrops();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / 20);
    }
    
    initDrops() {
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.random() * -100;
        }
    }
    
    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '15px monospace';
        
        for (let i = 0; i < this.drops.length; i++) {
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            const x = i * 20;
            const y = this.drops[i] * 20;
            
            this.ctx.fillText(char, x, y);
            
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// 场景管理器
class SceneManager {
    constructor() {
        this.currentScene = 'awakening-scene';
        this.scenes = {
            'awakening-scene': document.getElementById('awakening-scene'),
            'pill-choice-scene': document.getElementById('pill-choice-scene'),
            'matrix-scene': document.getElementById('matrix-scene'),
            'dream-scene': document.getElementById('dream-scene'),
            'real-world-scene': document.getElementById('real-world-scene'),
            'nebuchadnezzar-scene': document.getElementById('nebuchadnezzar-scene'),
            'training-scene': document.getElementById('training-scene'),
            'the-one-scene': document.getElementById('the-one-scene')
        };
        
        this.initEventListeners();
    }
    
    switchScene(sceneId) {
        // 隐藏当前场景
        this.scenes[this.currentScene].classList.remove('active');
        
        // 延迟显示新场景
        setTimeout(() => {
            this.scenes[sceneId].classList.add('active');
            this.currentScene = sceneId;
        }, 1000);
    }
    
    initEventListeners() {
        // 使用更安全的事件绑定方式
        this.bindEvent('wake-up-btn', () => {
            console.log('觉醒按钮被点击');
            this.playSound('wake');
            this.switchScene('pill-choice-scene');
        });
        
        this.bindEvent('red-pill', () => {
            console.log('红色药丸被选择');
            this.playSound('choice');
            this.createMatrixEffect();
            setTimeout(() => {
                this.switchScene('matrix-scene');
            }, 2000);
        });
        
        this.bindEvent('blue-pill', () => {
            console.log('蓝色药丸被选择');
            this.playSound('choice');
            this.createDreamEffect();
            setTimeout(() => {
                this.switchScene('dream-scene');
            }, 2000);
        });

        this.bindEvent('continue-btn', () => {
            console.log('继续觉醒按钮被点击');
            this.playSound('transition');
            this.createRealWorldTransition();
            setTimeout(() => {
                this.switchScene('real-world-scene');
            }, 3000);
        });

        this.bindEvent('stand-up-btn', () => {
            console.log('站起来按钮被点击');
            this.playSound('awakening');
            this.createShipTransition();
            setTimeout(() => {
                this.switchScene('nebuchadnezzar-scene');
            }, 2500);
        });

        this.bindEvent('training-btn', () => {
            console.log('开始训练按钮被点击');
            this.playSound('training');
            this.switchScene('training-scene');
        });

        this.bindEvent('download-skills-btn', () => {
            console.log('下载技能按钮被点击');
            this.downloadSkills();
        });

        this.bindEvent('save-humanity-btn', () => {
            console.log('拯救人类按钮被点击');
            this.playSound('victory');
            this.createVictoryEffect();
        });
    }
    
    bindEvent(elementId, callback) {
        const element = document.getElementById(elementId);
        if (element) {
            // 添加多种事件监听以确保兼容性
            element.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                callback();
            });
            
            element.addEventListener('touchstart', (e) => {
                e.preventDefault();
                callback();
            });
            
            // 添加视觉反馈
            element.addEventListener('mousedown', () => {
                element.style.transform = 'scale(0.95)';
            });
            
            element.addEventListener('mouseup', () => {
                element.style.transform = 'scale(1)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'scale(1)';
            });
        } else {
            console.warn(`元素 ${elementId} 未找到`);
        }
    }
    
    playSound(type) {
        try {
            // 创建音效（使用Web Audio API）
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // 确保音频上下文已启动
            if (audioContext.state === 'suspended') {
                audioContext.resume().then(() => {
                    this.createSound(audioContext, type);
                }).catch(err => {
                    console.log('音频播放失败，但不影响功能:', err);
                });
            } else {
                this.createSound(audioContext, type);
            }
        } catch (error) {
            console.log('音频不可用，但不影响功能:', error);
        }
    }
    
    createSound(audioContext, type) {
        try {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            switch(type) {
                case 'wake':
                    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.5);
                    break;
                case 'choice':
                    oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.3);
                    break;
                case 'transition':
                    oscillator.frequency.setValueAtTime(330, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(660, audioContext.currentTime + 0.8);
                    break;
                case 'awakening':
                    oscillator.frequency.setValueAtTime(110, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 1.0);
                    break;
                case 'training':
                    oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(784, audioContext.currentTime + 0.4);
                    break;
                case 'victory':
                    oscillator.frequency.setValueAtTime(659, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(1318, audioContext.currentTime + 1.2);
                    break;
            }
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.0);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1.2);
        } catch (error) {
            console.log('音频播放失败:', error);
        }
    }
    
    createMatrixEffect() {
        // 创建矩阵转换效果
        const body = document.body;
        body.style.filter = 'hue-rotate(120deg) contrast(1.5)';
        
        setTimeout(() => {
            body.style.filter = 'none';
        }, 2000);
        
        // 添加闪烁效果
        this.createFlashEffect('#00ff00');
    }
    
    createDreamEffect() {
        // 创建梦境效果
        const body = document.body;
        body.style.filter = 'blur(2px) brightness(0.7)';
        
        setTimeout(() => {
            body.style.filter = 'none';
        }, 2000);
        
        // 添加蓝色闪烁效果
        this.createFlashEffect('#0066ff');
    }
    
    createRealWorldTransition() {
        // 创建真实世界转换效果
        const body = document.body;
        body.style.filter = 'invert(1) hue-rotate(180deg) contrast(2)';
        
        // 添加震动效果
        body.style.animation = 'shake 0.5s infinite';
        
        setTimeout(() => {
            body.style.filter = 'sepia(0.3) contrast(1.2)';
            body.style.animation = 'none';
        }, 2000);
        
        setTimeout(() => {
            body.style.filter = 'none';
        }, 3000);
        
        this.createFlashEffect('#ff0000');
    }
    
    createShipTransition() {
        // 创建飞船转换效果
        const body = document.body;
        body.style.filter = 'brightness(0.3) contrast(1.5)';
        
        setTimeout(() => {
            body.style.filter = 'hue-rotate(90deg) brightness(0.8)';
        }, 1000);
        
        setTimeout(() => {
            body.style.filter = 'none';
        }, 2500);
        
        this.createFlashEffect('#00ff00');
    }
    
    downloadSkills() {
        const skills = ['kungfu', 'weapons', 'hacking', 'matrix'];
        let currentSkill = 0;
        
        const downloadInterval = setInterval(() => {
            if (currentSkill < skills.length) {
                const skillElement = document.querySelector(`[data-skill="${skills[currentSkill]}"] .progress`);
                const skillName = document.querySelector(`[data-skill="${skills[currentSkill]}"] span`);
                
                // 添加下载效果
                skillName.style.color = '#ffff00';
                skillName.textContent += ' - 下载中...';
                
                // 进度条动画
                let progress = 0;
                const progressInterval = setInterval(() => {
                    progress += Math.random() * 20;
                    if (progress >= 100) {
                        progress = 100;
                        clearInterval(progressInterval);
                        
                        // 完成效果
                        skillName.style.color = '#00ff00';
                        skillName.textContent = skillName.textContent.replace(' - 下载中...', ' - 完成!');
                        this.playSound('training');
                        
                        currentSkill++;
                        if (currentSkill >= skills.length) {
                            clearInterval(downloadInterval);
                            setTimeout(() => {
                                this.switchScene('the-one-scene');
                            }, 1500);
                        }
                    }
                    skillElement.style.width = progress + '%';
                }, 100);
                
            }
        }, 2000);
    }
    
    createVictoryEffect() {
        // 创建胜利特效
        const body = document.body;
        
        // 金色光芒效果
        body.style.filter = 'brightness(1.5) saturate(2) hue-rotate(45deg)';
        
        // 创建粒子效果
        this.createParticleEffect();
        
        // 显示胜利消息
        setTimeout(() => {
            this.showVictoryMessage();
        }, 2000);
        
        setTimeout(() => {
            body.style.filter = 'none';
        }, 5000);
    }
    
    createParticleEffect() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    left: ${Math.random() * window.innerWidth}px;
                    top: ${Math.random() * window.innerHeight}px;
                    width: 4px;
                    height: 4px;
                    background: #ffd700;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    box-shadow: 0 0 10px #ffd700;
                    animation: particleFloat 3s ease-out forwards;
                `;
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 3000);
            }, i * 100);
        }
    }
    
    showVictoryMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: #ffd700;
            padding: 3rem;
            border-radius: 15px;
            border: 3px solid #ffd700;
            text-align: center;
            z-index: 10000;
            font-family: 'Orbitron', monospace;
            box-shadow: 0 0 50px #ffd700;
            animation: victoryPulse 2s infinite;
        `;
        
        message.innerHTML = `
            <h1 style="font-size: 3rem; margin-bottom: 1rem; text-shadow: 0 0 20px #ffd700;">任务完成</h1>
            <p style="font-size: 1.5rem; margin-bottom: 2rem;">你已成为救世主</p>
            <p style="font-size: 1.2rem; color: #ffffff;">人类获得了自由</p>
            <button onclick="location.reload()" style="
                margin-top: 2rem;
                background: linear-gradient(45deg, #ffd700, #ffaa00);
                color: #000;
                border: none;
                padding: 15px 30px;
                font-size: 1.2rem;
                border-radius: 8px;
                cursor: pointer;
                font-family: 'Orbitron', monospace;
                font-weight: bold;
            ">重新开始</button>
        `;
        
        document.body.appendChild(message);
    }
    
    createFlashEffect(color) {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${color};
            opacity: 0.8;
            z-index: 9999;
            pointer-events: none;
            animation: flash 0.5s ease-out;
        `;
        
        // 添加闪烁动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes flash {
                0% { opacity: 0.8; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            document.body.removeChild(flash);
            document.head.removeChild(style);
        }, 500);
    }
}

// 终端ASCII艺术
class TerminalArt {
    constructor() {
        this.createTerminal();
    }
    
    createTerminal() {
        // 在控制台显示ASCII艺术
        const neoArt = `
    ███╗   ███╗ █████╗ ████████╗██████╗ ██╗██╗  ██╗
    ████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██║╚██╗██╔╝
    ██╔████╔██║███████║   ██║   ██████╔╝██║ ╚███╔╝ 
    ██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║ ██╔██╗ 
    ██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║██║██╔╝ ██╗
    ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝
    
    ███╗   ██╗███████╗ ██████╗     
    ████╗  ██║██╔════╝██╔═══██╗    
    ██╔██╗ ██║█████╗  ██║   ██║    
    ██║╚██╗██║██╔══╝  ██║   ██║    
    ██║ ╚████║███████╗╚██████╔╝    
    ╚═╝  ╚═══╝╚══════╝ ╚═════╝     
        `;
        
        console.log('%c' + neoArt, 'color: #00ff00; font-family: monospace;');
        console.log('%c欢迎来到矩阵世界...', 'color: #00ff00; font-size: 16px; font-weight: bold;');
        console.log('%c选择你的命运:', 'color: #ffffff; font-size: 14px;');
        console.log('%c🔴 红色药丸 - 看到真相', 'color: #ff0000; font-size: 12px;');
        console.log('%c🔵 蓝色药丸 - 回到梦境', 'color: #0066ff; font-size: 12px;');
    }
}

// 键盘控制
class KeyboardController {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.initKeyboardEvents();
    }
    
    initKeyboardEvents() {
        document.addEventListener('keydown', (event) => {
            switch(event.code) {
                case 'Space':
                    if (this.sceneManager.currentScene === 'awakening-scene') {
                        document.getElementById('wake-up-btn').click();
                    }
                    break;
                case 'KeyR':
                    if (this.sceneManager.currentScene === 'pill-choice-scene') {
                        document.getElementById('red-pill').click();
                    }
                    break;
                case 'KeyB':
                    if (this.sceneManager.currentScene === 'pill-choice-scene') {
                        document.getElementById('blue-pill').click();
                    }
                    break;
                case 'KeyC':
                    if (this.sceneManager.currentScene === 'matrix-scene') {
                        document.getElementById('continue-btn').click();
                    }
                    break;
                case 'KeyS':
                    if (this.sceneManager.currentScene === 'real-world-scene') {
                        document.getElementById('stand-up-btn').click();
                    }
                    break;
                case 'KeyT':
                    if (this.sceneManager.currentScene === 'nebuchadnezzar-scene') {
                        document.getElementById('training-btn').click();
                    }
                    break;
                case 'KeyD':
                    if (this.sceneManager.currentScene === 'training-scene') {
                        document.getElementById('download-skills-btn').click();
                    }
                    break;
                case 'KeyH':
                    if (this.sceneManager.currentScene === 'the-one-scene') {
                        document.getElementById('save-humanity-btn').click();
                    }
                    break;
                case 'Escape':
                    // 重置到开始场景
                    this.sceneManager.switchScene('awakening-scene');
                    break;
            }
        });
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成，开始初始化...');
    
    // 启动数字雨
    new MatrixRain();
    console.log('数字雨效果已启动');
    
    // 启动场景管理器
    const sceneManager = new SceneManager();
    console.log('场景管理器已启动');
    
    // 启动键盘控制
    new KeyboardController(sceneManager);
    console.log('键盘控制已启动');
    
    // 显示终端艺术
    new TerminalArt();
    console.log('终端艺术已显示');
    
    // 添加加载完成提示
    setTimeout(() => {
        console.log('%c系统已就绪。按空格键开始觉醒...', 'color: #00ff00; font-size: 14px;');
        console.log('%c或者直接点击"觉醒"按钮开始体验！', 'color: #00ff00; font-size: 12px;');
    }, 1000);
    
    // 添加全局错误处理
    window.addEventListener('error', (e) => {
        console.error('发生错误:', e.error);
    });
});

// 添加鼠标跟踪效果
document.addEventListener('mousemove', (e) => {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 2px;
        height: 2px;
        background: #00ff00;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 10px #00ff00;
        animation: cursorFade 1s ease-out forwards;
    `;
    
    document.body.appendChild(cursor);
    
    setTimeout(() => {
        if (cursor.parentNode) {
            cursor.parentNode.removeChild(cursor);
        }
    }, 1000);
});

// 添加光标淡出动画
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    @keyframes cursorFade {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0); }
    }
`;
document.head.appendChild(cursorStyle);