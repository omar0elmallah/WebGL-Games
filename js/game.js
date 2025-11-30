// إدارة تشغيل الألعاب
class GameManager {
    constructor() {
        this.currentGame = null;
        this.isPlaying = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // إغلاق المشغل
        const closeButton = document.getElementById('close-game');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.closeGame();
            });
        }

        // ملء الشاشة
        const fullscreenButton = document.getElementById('fullscreen-toggle');
        if (fullscreenButton) {
            fullscreenButton.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }

        // محاكاة اللعب
        const simulateButton = document.getElementById('simulate-play');
        if (simulateButton) {
            simulateButton.addEventListener('click', () => {
                this.simulatePlaySession();
            });
        }

        // حفظ اللعبة
        const saveButton = document.getElementById('save-game');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                this.saveGame();
            });
        }

        // تحميل اللعبة
        const loadButton = document.getElementById('load-game');
        if (loadButton) {
            loadButton.addEventListener('click', () => {
                this.loadGame();
            });
        }

        // إغلاق النافذة المنبثقة
        const closeModal = document.getElementById('close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                document.getElementById('game-modal').classList.add('hidden');
            });
        }

        // إغلاق النافذة المنبثقة بالنقر خارجها
        document.getElementById('game-modal').addEventListener('click', (e) => {
            if (e.target.id === 'game-modal') {
                document.getElementById('game-modal').classList.add('hidden');
            }
        });
    }

    // تشغيل لعبة
    launchGame(game) {
        this.currentGame = game;
        this.isPlaying = true;

        // تحديث واجهة المشغل
        document.getElementById('game-title').textContent = game.title;
        document.getElementById('game-player').classList.remove('hidden');

        // إغلاق النافذة المنبثقة إذا كانت مفتوحة
        document.getElementById('game-modal').classList.add('hidden');

        // تسجيل بدء الجلسة
        this.playSessionStartTime = Date.now();

        console.log(`Launching game: ${game.title}`);
        
        // في التطبيق الحقيقي، سيتم تحميل WebGL هنا
        // this.loadWebGLGame(game.webglUrl);
    }

    // إغلاق اللعبة
    closeGame() {
        if (this.isPlaying && this.currentGame) {
            // تسجيل نهاية الجلسة
            const sessionDuration = Math.floor((Date.now() - this.playSessionStartTime) / 1000);
            authManager.recordPlaySession(this.currentGame.id, sessionDuration);
            
            console.log(`Game session ended. Duration: ${sessionDuration} seconds`);
        }

        this.isPlaying = false;
        this.currentGame = null;
        document.getElementById('game-player').classList.add('hidden');

        // الخروج من وضع ملء الشاشة إذا كان نشطًا
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }

        // تحديث الإحصائيات في الواجهة
        if (storeManager) {
            storeManager.updateStats();
        }
    }

    // تبديل وضع ملء الشاشة
    toggleFullscreen() {
        const gameContainer = document.getElementById('game-container');
        
        if (!document.fullscreenElement) {
            if (gameContainer.requestFullscreen) {
                gameContainer.requestFullscreen();
            } else if (gameContainer.webkitRequestFullscreen) {
                gameContainer.webkitRequestFullscreen();
            } else if (gameContainer.msRequestFullscreen) {
                gameContainer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    // محاكاة جلسة لعب
    simulatePlaySession() {
        if (!this.currentGame) return;

        // محاكاة اللعب لمدة 30-120 ثانية
        const duration = Math.floor(Math.random() * 90) + 30;
        
        // تسجيل الجلسة
        authManager.recordPlaySession(this.currentGame.id, duration);
        
        alert(`محاكاة جلسة لعب لمدة ${duration} ثانية للعبة ${this.currentGame.title}`);
        
        // تحديث الإحصائيات
        if (storeManager) {
            storeManager.updateStats();
        }
        
        // إغلاق المشغل بعد المحاكاة
        setTimeout(() => {
            this.closeGame();
        }, 2000);
    }

    // حفظ اللعبة (محاكاة)
    saveGame() {
        if (!this.currentGame) return;
        alert(`تم حفظ تقدمك في ${this.currentGame.title} (ميزة تجريبية)`);
    }

    // تحميل اللعبة (محاكاة)
    loadGame() {
        if (!this.currentGame) return;
        alert(`تم تحميل آخر حفظ لـ ${this.currentGame.title} (ميزة تجريبية)`);
    }

    // تحميل لعبة WebGL (للاستخدام المستقبلي)
    loadWebGLGame(url) {
        // في التطبيق الحقيقي، سيتم تحميل ملفات WebGL هنا
        // وإعداد iframe أو canvas لتشغيل اللعبة
        console.log('Loading WebGL game from:', url);
        
        // مثال لتحميل iframe
        /*
        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = `
            <iframe src="${url}" width="100%" height="100%" frameborder="0" 
                    sandbox="allow-scripts allow-same-origin">
            </iframe>
        `;
        */
    }
}

// إنشاء نسخة عامة من مدير الألعاب
const gameManager = new GameManager();
