// إدارة المتجر وعرض الألعاب
class StoreManager {
    constructor() {
        this.games = [];
        this.filteredGames = [];
        this.currentFilters = {
            search: '',
            category: '',
            sort: 'popular'
        };
        this.init();
    }

    async init() {
        await this.loadGames();
        this.setupEventListeners();
        this.renderStore();
        this.renderFeaturedGames();
    }

    // تحميل بيانات الألعاب
    async loadGames() {
        try {
            // في التطبيق الحقيقي، سيتم جلب البيانات من API
            // هنا نستخدم بيانات وهمية
            this.games = [
                {
                    id: 'space-runner',
                    title: 'Space Runner',
                    description: 'لعبة منصات مليئة بالتحديات في الفضاء الخارجي. تجنب الكويكبات واجمع النقاط!',
                    category: 'action',
                    image: 'https://via.placeholder.com/300x150/6c5ce7/ffffff?text=Space+Runner',
                    size: '45 MB',
                    players: '1',
                    rating: 4.5,
                    isFeatured: true,
                    webglUrl: '#'
                },
                {
                    id: 'puzzle-master',
                    title: 'Puzzle Master',
                    description: 'اختبر مهاراتك المنطقية في هذه اللعبة المليئة بالألغاز المثيرة.',
                    category: 'puzzle',
                    image: 'https://via.placeholder.com/300x150/00b894/ffffff?text=Puzzle+Master',
                    size: '32 MB',
                    players: '1',
                    rating: 4.2,
                    isFeatured: true,
                    webglUrl: '#'
                },
                {
                    id: 'soccer-champs',
                    title: 'Soccer Champs',
                    description: 'لعبة كرة قدم واقعية مع فرق وملاعب متعددة. كن البطل!',
                    category: 'sports',
                    image: 'https://via.placeholder.com/300x150/0984e3/ffffff?text=Soccer+Champs',
                    size: '68 MB',
                    players: '1-2',
                    rating: 4.7,
                    isFeatured: false,
                    webglUrl: '#'
                },
                {
                    id: 'adventure-quest',
                    title: 'Adventure Quest',
                    description: 'انطلق في رحلة ملحمية عبر العوالم السحرية واكتشف الكنوز المخفية.',
                    category: 'adventure',
                    image: 'https://via.placeholder.com/300x150/e17055/ffffff?text=Adventure+Quest',
                    size: '85 MB',
                    players: '1',
                    rating: 4.8,
                    isFeatured: true,
                    webglUrl: '#'
                },
                {
                    id: 'racing-extreme',
                    title: 'Racing Extreme',
                    description: 'سباقات سيارات عالية السرعة مع جرافيك واقعي وتحديات مثيرة.',
                    category: 'action',
                    image: 'https://via.placeholder.com/300x150/d63031/ffffff?text=Racing+Extreme',
                    size: '76 MB',
                    players: '1-4',
                    rating: 4.3,
                    isFeatured: false,
                    webglUrl: '#'
                },
                {
                    id: 'memory-challenge',
                    title: 'Memory Challenge',
                    description: 'اختبر ذاكرتك مع مستويات متعددة من الصعوبة وتصميم جميل.',
                    category: 'puzzle',
                    image: 'https://via.placeholder.com/300x150/00cec9/ffffff?text=Memory+Challenge',
                    size: '28 MB',
                    players: '1',
                    rating: 4.0,
                    isFeatured: false,
                    webglUrl: '#'
                },
                {
                    id: 'simple-runner',
                    title: 'لعبة الجري السريعة',
                    description: 'اجري وتجنب العوائق وحقق أعلى النقاط!',
                    category: 'action',
                    image: 'https://via.placeholder.com/300x150/3498db/ffffff?text=🏃+لعبة+الجري',
                    size: '2 MB',
                    players: '1',
                    rating: 4.3,
                    isFeatured: true,
                    localPath: 'simple-game',  // اسم المجلد
                    type: 'webgl'
                }

                
                
            ];
            
            this.filteredGames = [...this.games];
        } catch (error) {
            console.error('Error loading games:', error);
            this.games = [];
            this.filteredGames = [];
        }
    }

    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // البحث
        const searchInput = document.getElementById('search-games');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
                this.filterGames();
            });
        }

        // الفلترة حسب الفئة
        const categoryFilter = document.getElementById('filter-category');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.filterGames();
            });
        }

        // الترتيب
        const sortSelect = document.getElementById('sort-games');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentFilters.sort = e.target.value;
                this.filterGames();
            });
        }
    }

    // تصفية الألعاب
    filterGames() {
        let filtered = [...this.games];

        // البحث
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase();
            filtered = filtered.filter(game => 
                game.title.toLowerCase().includes(searchTerm) || 
                game.description.toLowerCase().includes(searchTerm)
            );
        }

        // الفلترة حسب الفئة
        if (this.currentFilters.category) {
            filtered = filtered.filter(game => game.category === this.currentFilters.category);
        }

        // الترتيب
        switch (this.currentFilters.sort) {
            case 'newest':
                // في التطبيق الحقيقي، سيكون هناك تاريخ إصدار
                break;
            case 'name':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'popular':
            default:
                filtered.sort((a, b) => b.rating - a.rating);
                break;
        }

        this.filteredGames = filtered;
        this.renderStore();
    }

    // عرض الألعاب في المتجر
    renderStore() {
        const storeGrid = document.getElementById('store-games-grid');
        if (!storeGrid) return;

        if (this.filteredGames.length === 0) {
            storeGrid.innerHTML = '<p class="no-games">لا توجد ألعاب تطابق معايير البحث.</p>';
            return;
        }

        storeGrid.innerHTML = this.filteredGames.map(game => `
            <div class="game-card" data-game-id="${game.id}">
                <img src="${game.image}" alt="${game.title}" class="game-image">
                <div class="game-info">
                    <h3 class="game-title">${game.title}</h3>
                    <p class="game-description">${game.description}</p>
                    <div class="game-meta">
                        <span>${this.getCategoryName(game.category)}</span>
                        <span>${game.size}</span>
                        <span>⭐ ${game.rating}</span>
                    </div>
                    <div class="game-actions">
                        <button class="btn-primary view-game" data-game-id="${game.id}">عرض</button>
                        <button class="btn-secondary add-to-library-btn" data-game-id="${game.id}">إضافة</button>
                    </div>
                </div>
            </div>
        `).join('');

        // إضافة مستمعي الأحداث للأزرار
        this.addGameCardEventListeners();
    }

    // عرض الألعاب المميزة
    renderFeaturedGames() {
        const featuredGrid = document.getElementById('featured-games-grid');
        if (!featuredGrid) return;

        const featuredGames = this.games.filter(game => game.isFeatured).slice(0, 3);
        
        if (featuredGames.length === 0) return;

        featuredGrid.innerHTML = featuredGames.map(game => `
            <div class="game-card" data-game-id="${game.id}">
                <img src="${game.image}" alt="${game.title}" class="game-image">
                <div class="game-info">
                    <h3 class="game-title">${game.title}</h3>
                    <p class="game-description">${game.description}</p>
                    <div class="game-meta">
                        <span>${this.getCategoryName(game.category)}</span>
                        <span>${game.size}</span>
                        <span>⭐ ${game.rating}</span>
                    </div>
                    <div class="game-actions">
                        <button class="btn-primary view-game" data-game-id="${game.id}">عرض</button>
                        <button class="btn-secondary add-to-library-btn" data-game-id="${game.id}">إضافة</button>
                    </div>
                </div>
            </div>
        `).join('');

        // تحديث الإحصائيات
        this.updateStats();

        // إضافة مستمعي الأحداث للأزرار
        this.addGameCardEventListeners();
    }

    // إضافة مستمعي الأحداث لبطاقات الألعاب
    addGameCardEventListeners() {
        // أزرار عرض اللعبة
        document.querySelectorAll('.view-game').forEach(button => {
            button.addEventListener('click', (e) => {
                const gameId = e.target.dataset.gameId;
                this.showGameDetails(gameId);
            });
        });

        // أزرار إضافة إلى المكتبة
        document.querySelectorAll('.add-to-library-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const gameId = e.target.dataset.gameId;
                this.addGameToLibrary(gameId);
            });
        });
    }

    // عرض تفاصيل اللعبة
    showGameDetails(gameId) {
        const game = this.games.find(g => g.id === gameId);
        if (!game) return;

        // تحديث النافذة المنبثقة
        document.getElementById('modal-game-title').textContent = game.title;
        document.getElementById('modal-game-image').src = game.image;
        document.getElementById('modal-game-image').alt = game.title;
        document.getElementById('modal-game-description').textContent = game.description;
        document.getElementById('modal-game-category').textContent = `الفئة: ${this.getCategoryName(game.category)}`;
        document.getElementById('modal-game-size').textContent = `الحجم: ${game.size}`;
        document.getElementById('modal-game-players').textContent = `اللاعبون: ${game.players}`;

        // إعداد أزرار الإجراءات
        const playButton = document.getElementById('play-game');
        const addButton = document.getElementById('add-to-library');
        const downloadButton = document.getElementById('download-game');

        playButton.onclick = () => gameManager.launchGame(game);
        addButton.onclick = () => this.addGameToLibrary(gameId);
        downloadButton.onclick = () => this.downloadGame(gameId);

        // إظهار النافذة المنبثقة
        document.getElementById('game-modal').classList.remove('hidden');
    }

    // إضافة لعبة إلى المكتبة
    addGameToLibrary(gameId) {
        const success = authManager.addToLibrary(gameId);
        if (success) {
            alert('تمت إضافة اللعبة إلى مكتبتك بنجاح!');
            // تحديث عرض المكتبة إذا كانت مفتوحة
            if (libraryManager) {
                libraryManager.renderLibrary();
            }
        } else {
            alert('هذه اللعبة موجودة بالفعل في مكتبتك!');
        }
    }

    // تحميل اللعبة (محاكاة)
    downloadGame(gameId) {
        alert('سيبدأ تحميل اللعبة قريبًا... (هذه ميزة تجريبية)');
        // في التطبيق الحقيقي، سيتم تنزيل ملفات WebGL
    }

    // الحصول على اسم الفئة بالعربية
    getCategoryName(category) {
        const categories = {
            'action': 'أكشن',
            'adventure': 'مغامرة',
            'puzzle': 'ألغاز',
            'sports': 'رياضة'
        };
        return categories[category] || category;
    }

    // تحديث الإحصائيات
    updateStats() {
        const totalGames = document.getElementById('total-games');
        const totalPlaytime = document.getElementById('total-playtime');
        const activeUsers = document.getElementById('active-users');

        if (totalGames) totalGames.textContent = this.games.length;
        if (totalPlaytime) totalPlaytime.textContent = Math.floor(authManager.userData.stats.totalPlayTime / 3600);
        if (activeUsers) activeUsers.textContent = Math.floor(Math.random() * 1000) + 500; // رقم عشوائي للعرض
    }
}

// إنشاء نسخة عامة من مدير المتجر
const storeManager = new StoreManager();
































// في store.js داخل loadGames() أضف:
