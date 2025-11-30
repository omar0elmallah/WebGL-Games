// التطبيق الرئيسي - تنسيق كل المكونات
class App {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.navigateToPage('home');
        this.applyUserPreferences();
    }

    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // التنقل بين الصفحات
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.navigateToPage(page);
            });
        });

        // تبديل الثيم
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // اختيار الثيم من القائمة
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                authManager.updatePreferences({ theme: e.target.value });
            });
        }

        // التحكم في الصوت
        const volumeSlider = document.getElementById('volume-slider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                authManager.updatePreferences({ volume: e.target.value });
            });
        }

        // مسح البيانات المحلية
        const clearDataButton = document.getElementById('clear-data');
        if (clearDataButton) {
            clearDataButton.addEventListener('click', () => {
                if (confirm('هل أنت متأكد من رغبتك في مسح جميع بياناتك المحلية؟ سيتم إعادة تحميل الصفحة.')) {
                    authManager.clearLocalData();
                }
            });
        }

        // التشغيل السريع
        const quickPlayButton = document.getElementById('quick-play');
        if (quickPlayButton) {
            quickPlayButton.addEventListener('click', () => {
                this.quickPlay();
            });
        }

        // إغلاق النافذة المنبثقة بمفتاح ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.getElementById('game-modal').classList.add('hidden');
                
                if (gameManager.isPlaying) {
                    gameManager.closeGame();
                }
            }
        });
    }

    // التنقل بين الصفحات
    navigateToPage(page) {
        // إخفاء جميع الصفحات
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });

        // إزالة النشاط من جميع روابط التنقل
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // إظهار الصفحة المطلوبة
        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // تفعيل رابط التنقل المناسب
        const targetLink = document.querySelector(`.nav-link[data-page="${page}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        }

        this.currentPage = page;

        // إطلاق حدث تغيير الصفحة
        document.dispatchEvent(new CustomEvent('pageChanged', { detail: { page } }));

        // تحديث المحتوى حسب الصفحة
        this.updatePageContent(page);
    }

    // تحديث محتوى الصفحة
    updatePageContent(page) {
        switch (page) {
            case 'profile':
                this.updateProfilePage();
                break;
            case 'library':
                if (libraryManager) {
                    libraryManager.renderLibrary();
                }
                break;
        }
    }

    // تحديث صفحة الملف الشخصي
    updateProfilePage() {
        const profilePlaytime = document.getElementById('profile-playtime');
        const profileGames = document.getElementById('profile-games');

        if (profilePlaytime) {
            profilePlaytime.textContent = `${Math.floor(authManager.userData.stats.totalPlayTime / 3600)} ساعة`;
        }

        if (profileGames) {
            profileGames.textContent = authManager.userData.stats.gamesPlayed;
        }
    }

    // تطبيق تفضيلات المستخدم
    applyUserPreferences() {
        // تم التطبيق في authManager
    }

    // تبديل الثيم
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        authManager.updatePreferences({ theme: newTheme });
    }

    // تشغيل سريع (عشوائي)
    quickPlay() {
        const availableGames = storeManager.games.filter(game => 
            authManager.getLibrary().includes(game.id)
        );

        if (availableGames.length === 0) {
            alert('مكتبتك فارغة! اذهب إلى المتجر لإضافة ألعاب أولاً.');
            this.navigateToPage('store');
            return;
        }

        const randomGame = availableGames[Math.floor(Math.random() * availableGames.length)];
        gameManager.launchGame(randomGame);
    }
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
