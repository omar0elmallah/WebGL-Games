// إدارة المصادقة والمستخدمين
class AuthManager {
    constructor() {
        this.userId = null;
        this.userData = null;
        this.init();
    }

    init() {
        this.loadUser();
        this.updateUI();
    }

    // توليد معرف ضيف فريد
    generateGuestId() {
        return 'guest_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    }

    // تحميل بيانات المستخدم من localStorage
    loadUser() {
        this.userId = localStorage.getItem('guestId');
        
        if (!this.userId) {
            this.userId = this.generateGuestId();
            localStorage.setItem('guestId', this.userId);
            
            // إنشاء بيانات المستخدم الأولية
            this.userData = {
                userId: this.userId,
                username: 'ضيف',
                createdAt: new Date().toISOString(),
                lastSeen: new Date().toISOString(),
                library: [],
                preferences: {
                    theme: 'dark',
                    volume: 80
                },
                stats: {
                    totalPlayTime: 0,
                    gamesPlayed: 0
                },
                playHistory: []
            };
            
            this.saveUserData();
        } else {
            this.userData = JSON.parse(localStorage.getItem('userData') || '{}');
            
            // تحديث وقت آخر زيارة
            this.userData.lastSeen = new Date().toISOString();
            this.saveUserData();
        }
        
        console.log('User loaded:', this.userId);
    }

    // حفظ بيانات المستخدم
    saveUserData() {
        localStorage.setItem('userData', JSON.stringify(this.userData));
    }

    // تحديث واجهة المستخدم
    updateUI() {
        const greetingElement = document.getElementById('user-greeting');
        if (greetingElement) {
            greetingElement.textContent = `مرحبًا، ${this.userData.username}`;
        }

        const profileUsername = document.getElementById('profile-username');
        if (profileUsername) {
            profileUsername.textContent = this.userData.username;
        }

        const profileUserId = document.getElementById('profile-userid');
        if (profileUserId) {
            profileUserId.textContent = `معرف المستخدم: ${this.userId}`;
        }

        // تطبيق التفضيلات
        this.applyPreferences();
    }

    // تطبيق تفضيلات المستخدم
    applyPreferences() {
        const theme = this.userData.preferences.theme || 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.value = theme;
        }
        
        const volumeSlider = document.getElementById('volume-slider');
        if (volumeSlider) {
            volumeSlider.value = this.userData.preferences.volume || 80;
        }
    }

    // تحديث التفضيلات
    updatePreferences(newPreferences) {
        this.userData.preferences = { ...this.userData.preferences, ...newPreferences };
        this.saveUserData();
        this.applyPreferences();
    }

    // إضافة لعبة إلى المكتبة
    addToLibrary(gameId) {
        if (!this.userData.library.includes(gameId)) {
            this.userData.library.push(gameId);
            this.saveUserData();
            return true;
        }
        return false;
    }

    // إزالة لعبة من المكتبة
    removeFromLibrary(gameId) {
        const index = this.userData.library.indexOf(gameId);
        if (index > -1) {
            this.userData.library.splice(index, 1);
            this.saveUserData();
            return true;
        }
        return false;
    }

    // الحصول على مكتبة المستخدم
    getLibrary() {
        return this.userData.library || [];
    }

    // تسجيل جلسة لعب
    recordPlaySession(gameId, duration) {
        this.userData.stats.totalPlayTime += duration;
        this.userData.stats.gamesPlayed += 1;
        
        this.userData.playHistory.unshift({
            gameId,
            date: new Date().toISOString(),
            duration
        });
        
        // الاحتفاظ بآخر 50 جلسة فقط
        if (this.userData.playHistory.length > 50) {
            this.userData.playHistory = this.userData.playHistory.slice(0, 50);
        }
        
        this.saveUserData();
    }

    // مسح البيانات المحلية
    clearLocalData() {
        localStorage.removeItem('guestId');
        localStorage.removeItem('userData');
        location.reload();
    }
}

// إنشاء نسخة عامة من مدير المصادقة
const authManager = new AuthManager();
