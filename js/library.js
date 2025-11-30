// إدارة المكتبة الشخصية
class LibraryManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderLibrary();
    }

    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // تحديث المكتبة عند تبديل الصفحات
        document.addEventListener('pageChanged', () => {
            this.renderLibrary();
        });
    }

    // عرض المكتبة
    renderLibrary() {
        const libraryGrid = document.getElementById('library-games-grid');
        const libraryCount = document.getElementById('library-count');
        const lastPlayed = document.getElementById('last-played');

        if (!libraryGrid) return;

        const userLibrary = authManager.getLibrary();
        const libraryGames = storeManager.games.filter(game => 
            userLibrary.includes(game.id)
        );

        // تحديث العداد
        if (libraryCount) {
            libraryCount.textContent = libraryGames.length;
        }

        // تحديث آخر لعبة
        if (lastPlayed && authManager.userData.playHistory.length > 0) {
            const lastGameId = authManager.userData.playHistory[0].gameId;
            const lastGame = storeManager.games.find(g => g.id === lastGameId);
            if (lastGame) {
                lastPlayed.textContent = lastGame.title;
            }
        }

        if (libraryGames.length === 0) {
            libraryGrid.innerHTML = `
                <div class="empty-library">
                    <p>مكتبتك فارغة حالياً</p>
                    <p>اذهب إلى <a href="#" data-page="store">المتجر</a> لإضافة ألعاب إلى مكتبتك</p>
                </div>
            `;
            
            // إضافة مستمع حدث للرابط
            const storeLink = libraryGrid.querySelector('a');
            if (storeLink) {
                storeLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    app.navigateToPage('store');
                });
            }
            
            return;
        }

        libraryGrid.innerHTML = libraryGames.map(game => `
            <div class="game-card" data-game-id="${game.id}">
                <img src="${game.image}" alt="${game.title}" class="game-image">
                <div class="game-info">
                    <h3 class="game-title">${game.title}</h3>
                    <p class="game-description">${game.description}</p>
                    <div class="game-meta">
                        <span>${storeManager.getCategoryName(game.category)}</span>
                        <span>${game.size}</span>
                        <span>⭐ ${game.rating}</span>
                    </div>
                    <div class="game-actions">
                        <button class="btn-primary play-game" data-game-id="${game.id}">تشغيل</button>
                        <button class="btn-secondary remove-from-library" data-game-id="${game.id}">إزالة</button>
                    </div>
                </div>
            </div>
        `).join('');

        // إضافة مستمعي الأحداث
        this.addLibraryEventListeners();
    }

    // إضافة مستمعي الأحداث لمكتبة الألعاب
    addLibraryEventListeners() {
        // أزرار تشغيل اللعبة
        document.querySelectorAll('.play-game').forEach(button => {
            button.addEventListener('click', (e) => {
                const gameId = e.target.dataset.gameId;
                const game = storeManager.games.find(g => g.id === gameId);
                if (game) {
                    gameManager.launchGame(game);
                }
            });
        });

        // أزرار إزالة من المكتبة
        document.querySelectorAll('.remove-from-library').forEach(button => {
            button.addEventListener('click', (e) => {
                const gameId = e.target.dataset.gameId;
                this.removeGameFromLibrary(gameId);
            });
        });
    }

    // إزالة لعبة من المكتبة
    removeGameFromLibrary(gameId) {
        const success = authManager.removeFromLibrary(gameId);
        if (success) {
            this.renderLibrary();
            alert('تمت إزالة اللعبة من مكتبتك');
        }
    }
}

// إنشاء نسخة عامة من مدير المكتبة
const libraryManager = new LibraryManager();
