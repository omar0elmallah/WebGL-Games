// إدارة تشغيل ألعاب WebGL
class GameManager {
    constructor() {
        this.currentGame = null;
        this.isPlaying = false;
        this.gameIframe = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createGameContainer();
    }

    // إنشاء حاوية اللعبة
    createGameContainer() {
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;

        this.gameIframe = document.createElement('iframe');
        this.gameIframe.id = 'webgl-game-frame';
        this.gameIframe.style.width = '100%';
        this.gameIframe.style.height = '100%';
        this.gameIframe.style.border = 'none';
        this.gameIframe.style.display = 'none';
        this.gameIframe.sandbox = 'allow-scripts allow-same-origin';
        
        gameContainer.appendChild(this.gameIframe);
    }

    // تشغيل لعبة
    launchGame(game) {
        this.currentGame = game;
        this.isPlaying = true;

        // تحديث واجهة المشغل
        document.getElementById('game-title').textContent = game.title;
        document.getElementById('game-player').classList.remove('hidden');

        // إغلاق النافذة المنبثقة
        document.getElementById('game-modal').classList.add('hidden');

        // تسجيل بدء الجلسة
        this.playSessionStartTime = Date.now();

        console.log(`تشغيل اللعبة: ${game.title}`);
        
        // 🔥 بدء اللعبة الحقيقية 🔥
        this.startRealGame(game);
    }

    // بدء لعبة حقيقية
    startRealGame(game) {
        const gameContainer = document.getElementById('game-container');
        
        // تنظيف الحاوية
        gameContainer.innerHTML = '';
        
        // إنشاء اللعبة حسب نوعها
        switch(game.id) {
            case 'space-runner':
                this.startSpaceRunner(game);
                break;
            case 'puzzle-master':
                this.startPuzzleGame(game);
                break;
            case 'soccer-champs':
                this.startSoccerGame(game);
                break;
            case 'simple-runner':
            default:
                this.startSimpleRunner(game);
                break;
        }
    }

    // لعبة الجري البسيطة
    startSimpleRunner(game) {
        const gameContainer = document.getElementById('game-container');
        
        gameContainer.innerHTML = `
            <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <h2 style="color:white; margin-bottom:20px; font-family:'Tajawal', sans-serif;">🏃 ${game.title}</h2>
                
                <canvas id="gameCanvas" width="800" height="400" 
                        style="border:3px solid white; border-radius:10px; background:#000; max-width:90%;"></canvas>
                
                <div style="margin-top:20px; color:white; text-align:center; font-family:'Tajawal', sans-serif;">
                    <p>🎯 الهدف: تجنب العقبات واجمع النقاط</p>
                    <p>🎮 التحكم: المسافة للقفز | ⬅️ ➡️ للحركة | A,D للتحريك</p>
                    <p id="gameScore" style="font-size:24px; font-weight:bold; margin-top:10px;">النقاط: 0</p>
                </div>
            </div>
        `;
        
        this.runSimpleRunnerGame();
    }

    // منطق لعبة الجري
    runSimpleRunnerGame() {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('gameScore');
        
        let score = 0;
        let gameRunning = true;
        
        // اللاعب
        const player = {
            x: 100,
            y: 300,
            width: 40,
            height: 40,
            velocityY: 0,
            jumping: false,
            color: '#3498db'
        };
        
        // العقبات
        const obstacles = [];
        
        // رسم اللاعب
        function drawPlayer() {
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, player.width, player.height);
            
            // رسم الوجه
            ctx.fillStyle = 'white';
            ctx.fillRect(player.x + 25, player.y + 8, 6, 6);
            ctx.fillRect(player.x + 10, player.y + 8, 6, 6);
            
            // رسم الابتسامة
            ctx.beginPath();
            ctx.arc(player.x + 20, player.y + 25, 8, 0, Math.PI);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // رسم العقبات
        function drawObstacles() {
            ctx.fillStyle = '#e74c3c';
            obstacles.forEach(obstacle => {
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                
                // تفاصيل العقبة
                ctx.fillStyle = '#c0392b';
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, 10);
            });
            ctx.fillStyle = '#e74c3c';
        }
        
        // رسم الخلفية
        function drawBackground() {
            // خلفية متدرجة
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#2c3e50');
            gradient.addColorStop(1, '#34495e');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // الأرض
            ctx.fillStyle = '#27ae60';
            ctx.fillRect(0, 350, canvas.width, 50);
        }
        
        // إنشاء عقبة جديدة
        function createObstacle() {
            obstacles.push({
                x: canvas.width,
                y: 310,
                width: 20 + Math.random() * 30,
                height: 40,
                speed: 3 + Math.random() * 2
            });
        }
        
        // تحديث اللعبة
        function update() {
            if (!gameRunning) return;
            
            // جاذبية
            if (!player.jumping) {
                player.velocityY += 0.5;
            } else {
                player.velocityY -= 0.3;
                if (player.velocityY <= 0) {
                    player.jumping = false;
                }
            }
            
            player.y += player.velocityY;
            
            // التأكد من أن اللاعب على الأرض
            if (player.y > 310) {
                player.y = 310;
                player.velocityY = 0;
            }
            
            // تحديث العقبات
            for (let i = obstacles.length - 1; i >= 0; i--) {
                obstacles[i].x -= obstacles[i].speed;
                
                // كشف الاصطدام
                if (player.x < obstacles[i].x + obstacles[i].width &&
                    player.x + player.width > obstacles[i].x &&
                    player.y < obstacles[i].y + obstacles[i].height &&
                    player.y + player.height > obstacles[i].y) {
                    gameOver();
                    return;
                }
                
                // إزالة العقبات التي خرجت
                if (obstacles[i].x < -obstacles[i].width) {
                    obstacles.splice(i, 1);
                    score += 10;
                    scoreElement.textContent = `النقاط: ${score}`;
                }
            }
            
            // إنشاء عقبات جديدة
            if (Math.random() < 0.02) {
                createObstacle();
            }
        }
        
        // رسم كل شيء
        function draw() {
            drawBackground();
            drawPlayer();
            drawObstacles();
            
            // عرض النقاط
            ctx.fillStyle = 'white';
            ctx.font = 'bold 24px Arial';
            ctx.fillText(`🏆 النقاط: ${score}`, 20, 40);
        }
        
        // انتهاء اللعبة
        function gameOver() {
            gameRunning = false;
            
            ctx.fillStyle = 'rgba(231, 76, 60, 0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = 'white';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('💀 انتهت اللعبة!', canvas.width / 2, canvas.height / 2 - 50);
            
            ctx.font = '36px Arial';
            ctx.fillText(`النتيجة النهائية: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
            
            ctx.font = '24px Arial';
            ctx.fillText('اضغط R لإعادة اللعب', canvas.width / 2, canvas.height / 2 + 80);
        }
        
        // التحكم بالمفاتيح
        const keys = {};
        
        window.addEventListener('keydown', (e) => {
            keys[e.key] = true;
            
            // مسافة للقفز
            if (e.code === 'Space') {
                if (!player.jumping && player.y === 310) {
                    player.jumping = true;
                    player.velocityY = 12;
                }
            }
            
            // R لإعادة اللعب
            if ((e.key === 'r' || e.key === 'R') && !gameRunning) {
                score = 0;
                obstacles.length = 0;
                player.x = 100;
                player.y = 310;
                gameRunning = true;
                scoreElement.textContent = `النقاط: 0`;
            }
            
            // السهم الأيمن
            if (e.code === 'ArrowRight' && gameRunning) {
                player.x += 7;
                if (player.x > canvas.width - player.width) {
                    player.x = canvas.width - player.width;
                }
            }
            
            // السهم الأيسر
            if (e.code === 'ArrowLeft' && gameRunning) {
                player.x -= 7;
                if (player.x < 0) {
                    player.x = 0;
                }
            }
            
            // WASD للتحكم البديل
            if ((e.key === 'd' || e.key === 'D') && gameRunning) {
                player.x += 7;
                if (player.x > canvas.width - player.width) {
                    player.x = canvas.width - player.width;
                }
            }
            
            if ((e.key === 'a' || e.key === 'A') && gameRunning) {
                player.x -= 7;
                if (player.x < 0) {
                    player.x = 0;
                }
            }
        });
        
        window.addEventListener('keyup', (e) => {
            keys[e.key] = false;
        });
        
        // دورة اللعبة
        function gameLoop() {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }
        
        // بدء اللعبة
        gameLoop();
        
        // إنشاء أول عقبة بعد ثانيتين
        setTimeout(() => {
            if (gameRunning) {
                createObstacle();
            }
        }, 2000);
    }

    // لعبة الفضاء
    startSpaceRunner(game) {
        const gameContainer = document.getElementById('game-container');
        
        gameContainer.innerHTML = `
            <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#000;">
                <h2 style="color:#6c5ce7; margin-bottom:20px; font-family:'Tajawal', sans-serif;">🚀 ${game.title}</h2>
                
                <canvas id="spaceCanvas" width="800" height="400" 
                        style="border:2px solid #6c5ce7; background:#000; max-width:90%;"></canvas>
                
                <div style="margin-top:20px; color:#a29bfe; text-align:center; font-family:'Tajawal', sans-serif;">
                    <p>🎯 تحكم بالمركبة الفضائية وتجنب الكويكبات</p>
                    <p>🎮 التحكم: ⬆️ ⬇️ ⬅️ ➡️ للحركة | المسافة لإطلاق النار</p>
                    <p id="spaceScore" style="font-size:24px; font-weight:bold; margin-top:10px; color:#fd79a8;">النقاط: 0</p>
                </div>
            </div>
        `;
        
        this.runSpaceGame();
    }

    // منطق لعبة الفضاء
    runSpaceGame() {
        const canvas = document.getElementById('spaceCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('spaceScore');
        
        let score = 0;
        let gameRunning = true;
        
        // المركبة الفضائية
        const spaceship = {
            x: 100,
            y: 200,
            width: 50,
            height: 30,
            speed: 5,
            color: '#6c5ce7'
        };
        
        // الطلقات
        const bullets = [];
        
        // الكويكبات
        const asteroids = [];
        
        // رسم المركبة
        function drawSpaceship() {
            ctx.fillStyle = spaceship.color;
            
            // جسم المركبة
            ctx.beginPath();
            ctx.moveTo(spaceship.x, spaceship.y + spaceship.height / 2);
            ctx.lineTo(spaceship.x + spaceship.width, spaceship.y);
            ctx.lineTo(spaceship.x + spaceship.width, spaceship.y + spaceship.height);
            ctx.closePath();
            ctx.fill();
            
            // الزجاج الأمامي
            ctx.fillStyle = '#a29bfe';
            ctx.fillRect(spaceship.x + 35, spaceship.y + 10, 10, 10);
        }
        
        // رسم الطلقات
        function drawBullets() {
            ctx.fillStyle = '#fd79a8';
            bullets.forEach(bullet => {
                ctx.fillRect(bullet.x, bullet.y, 10, 4);
            });
        }
        
        // رسم الكويكبات
        function drawAsteroids() {
            ctx.fillStyle = '#636e72';
            asteroids.forEach(asteroid => {
                ctx.beginPath();
                ctx.arc(asteroid.x, asteroid.y, asteroid.size, 0, Math.PI * 2);
                ctx.fill();
            });
        }
        
        // رسم الخلفية
        function drawSpaceBackground() {
            // الفضاء
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // النجوم
            ctx.fillStyle = 'white';
            for (let i = 0; i < 50; i++) {
                const x = (i * 20) % canvas.width;
                const y = (i * 15) % canvas.height;
                ctx.beginPath();
                ctx.arc(x, y, Math.random() * 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // إطلاق طلقة
        function shoot() {
            bullets.push({
                x: spaceship.x + spaceship.width,
                y: spaceship.y + spaceship.height / 2 - 2,
                speed: 8
            });
        }
        
        // إنشاء كويكب
        function createAsteroid() {
            asteroids.push({
                x: canvas.width,
                y: Math.random() * canvas.height,
                size: 15 + Math.random() * 20,
                speed: 2 + Math.random() * 3
            });
        }
        
        // تحديث اللعبة
        function update() {
            if (!gameRunning) return;
            
            // تحديث الطلقات
            for (let i = bullets.length - 1; i >= 0; i--) {
                bullets[i].x += bullets[i].speed;
                
                // كشف اصطدام الطلقات بالكويكبات
                for (let j = asteroids.length - 1; j >= 0; j--) {
                    const dx = bullets[i].x - asteroids[j].x;
                    const dy = bullets[i].y - asteroids[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < asteroids[j].size) {
                        // إزالة الكويكب والطلقة
                        asteroids.splice(j, 1);
                        bullets.splice(i, 1);
                        score += 50;
                        scoreElement.textContent = `النقاط: ${score}`;
                        break;
                    }
                }
                
                // إزالة الطلقات التي خرجت
                if (bullets[i].x > canvas.width) {
                    bullets.splice(i, 1);
                }
            }
            
            // تحديث الكويكبات
            for (let i = asteroids.length - 1; i >= 0; i--) {
                asteroids[i].x -= asteroids[i].speed;
                
                // كشف اصطدام المركبة بالكويكب
                const dx = spaceship.x - asteroids[i].x;
                const dy = spaceship.y - asteroids[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < asteroids[i].size + 20) {
                    gameOver();
                    return;
                }
                
                // إزالة الكويكبات التي خرجت
                if (asteroids[i].x < -asteroids[i].size) {
                    asteroids.splice(i, 1);
                }
            }
            
            // إنشاء كويكبات جديدة
            if (Math.random() < 0.015) {
                createAsteroid();
            }
        }
        
        // رسم كل شيء
        function draw() {
            drawSpaceBackground();
            drawSpaceship();
            drawBullets();
            drawAsteroids();
            
            // عرض النقاط
            ctx.fillStyle = '#fd79a8';
            ctx.font = 'bold 24px Arial';
            ctx.fillText(`🚀 النقاط: ${score}`, 20, 40);
        }
        
        // انتهاء اللعبة
        function gameOver() {
            gameRunning = false;
            
            ctx.fillStyle = 'rgba(108, 92, 231, 0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = 'white';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('💥 انتهت اللعبة!', canvas.width / 2, canvas.height / 2 - 50);
            
            ctx.font = '36px Arial';
            ctx.fillText(`النتيجة: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
            
            ctx.font = '24px Arial';
            ctx.fillText('اضغط R لإعادة اللعب', canvas.width / 2, canvas.height / 2 + 80);
        }
        
        // التحكم بالمفاتيح
        const keys = {};
        
        window.addEventListener('keydown', (e) => {
            keys[e.key] = true;
            
            // إطلاق النار
            if (e.code === 'Space' && gameRunning) {
                shoot();
            }
            
            // R لإعادة اللعب
            if ((e.key === 'r' || e.key === 'R') && !gameRunning) {
                score = 0;
                asteroids.length = 0;
                bullets.length = 0;
                spaceship.x = 100;
                spaceship.y = 200;
                gameRunning = true;
                scoreElement.textContent = `النقاط: 0`;
            }
        });
        
        window.addEventListener('keyup', (e) => {
            keys[e.key] = false;
        });
        
        // التحكم المستمر
        function handleControls() {
            if (!gameRunning) return;
            
            if (keys['ArrowUp'] || keys['w'] || keys['W']) {
                spaceship.y -= spaceship.speed;
                if (spaceship.y < 0) spaceship.y = 0;
            }
            
            if (keys['ArrowDown'] || keys['s'] || keys['S']) {
                spaceship.y += spaceship.speed;
                if (spaceship.y > canvas.height - spaceship.height) spaceship.y = canvas.height - spaceship.height;
            }
            
            if (keys['ArrowRight'] || keys['d'] || keys['D']) {
                spaceship.x += spaceship.speed;
                if (spaceship.x > canvas.width - spaceship.width) spaceship.x = canvas.width - spaceship.width;
            }
            
            if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
                spaceship.x -= spaceship.speed;
                if (spaceship.x < 0) spaceship.x = 0;
            }
        }
        
        // دورة اللعبة
        function gameLoop() {
            handleControls();
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }
        
        // بدء اللعبة
        gameLoop();
    }

    // لعبة كرة القدم
    startSoccerGame(game) {
        const gameContainer = document.getElementById('game-container');
        
        gameContainer.innerHTML = `
            <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(#27ae60, #2ecc71);">
                <h2 style="color:white; margin-bottom:20px; font-family:'Tajawal', sans-serif;">⚽ ${game.title}</h2>
                
                <canvas id="soccerCanvas" width="800" height="400" 
                        style="border:3px solid white; background:#27ae60; max-width:90%;"></canvas>
                
                <div style="margin-top:20px; color:white; text-align:center; font-family:'Tajawal', sans-serif;">
                    <p>🎯 سجل أهداف في المرمى وتجنب المدافع</p>
                    <p>🎮 التحكم: WASD للحركة | المسافة للركلة</p>
                    <p id="soccerScore" style="font-size:24px; font-weight:bold; margin-top:10px;">الأهداف: 0</p>
                </div>
            </div>
        `;
        
        this.runSoccerGame();
    }

    // لعبة الألغاز
    startPuzzleGame(game) {
        const gameContainer = document.getElementById('game-container');
        
        gameContainer.innerHTML = `
            <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(#00cec9, #81ecec);">
                <h2 style="color:#2d3436; margin-bottom:20px; font-family:'Tajawal', sans-serif;">🧩 ${game.title}</h2>
                
                <div id="puzzleBoard" style="display:grid; grid-template-columns:repeat(4, 80px); grid-gap:5px; background:#fff; padding:10px; border-radius:10px;"></div>
                
                <div style="margin-top:20px; color:#2d3436; text-align:center; font-family:'Tajawal', sans-serif;">
                    <p>🎯 رتب الأرقام بالترتيب الصحيح</p>
                    <p id="movesCount" style="font-size:24px; font-weight:bold; margin-top:10px;">عدد الحركات: 0</p>
                    <button id="shuffleBtn" style="margin-top:10px; padding:10px 20px; background:#00b894; color:white; border:none; border-radius:5px; cursor:pointer;">
                        خلط جديد
                    </button>
                </div>
            </div>
        `;
        
        this.runPuzzleGame();
    }

    // إغلاق اللعبة
    closeGame() {
        if (this.isPlaying && this.currentGame) {
            const sessionDuration = Math.floor((Date.now() - this.playSessionStartTime) / 1000);
            authManager.recordPlaySession(this.currentGame.id, sessionDuration);
            
            console.log(`Game session ended. Duration: ${sessionDuration} seconds`);
        }

        this.isPlaying = false;
        
        // إيقاف iframe
        if (this.gameIframe) {
            this.gameIframe.src = 'about:blank';
            this.gameIframe.style.display = 'none';
        }
        
        this.currentGame = null;
        document.getElementById('game-player').classList.add('hidden');

        // الخروج من وضع ملء الشاشة
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }

        // تحديث الإحصائيات
        if (storeManager) {
            storeManager.updateStats();
        }
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
}

// إنشاء نسخة عامة من مدير الألعاب
const gameManager = new GameManager();
