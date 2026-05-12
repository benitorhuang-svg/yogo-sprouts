export function setupScrollSpyAndSticky() {
    const tabContainer = document.querySelector('.category-tabs');
    if (!tabContainer)
        return;
    const header = document.querySelector('.site-header');
    const announcement = document.querySelector('.announcement-bar');
    // Tab Bar Sticky offset calculations
    const headerHeight = header ? header.offsetHeight : 0;
    const announcementHeight = announcement ? announcement.offsetHeight : 0;
    const stickyTriggerPoint = announcementHeight;
    window.addEventListener('scroll', () => {
        // 1. Sticky Class toggle
        if (window.scrollY > stickyTriggerPoint) {
            tabContainer.classList.add('sticky-tabs');
            tabContainer.style.top = `${headerHeight}px`;
        }
        else {
            tabContainer.classList.remove('sticky-tabs');
            tabContainer.style.top = '0px';
        }
        // 2. ScrollSpy highlighters
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab && activeTab.dataset.category === 'favorites') {
            return;
        }
        const scrollPosition = window.scrollY + headerHeight + tabContainer.offsetHeight + 60;
        let currentActiveCat = 'all';
        const sections = document.querySelectorAll('.category-section');
        sections.forEach(sec => {
            const sectionEl = sec;
            const top = sectionEl.offsetTop;
            const height = sectionEl.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                currentActiveCat = sectionEl.dataset.category || 'all';
            }
        });
        // Handle bottom of page
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 10) {
            const lastSection = sections[sections.length - 1];
            if (lastSection) {
                currentActiveCat = lastSection.dataset.category || 'all';
            }
        }
        // Highlight tab button
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            const button = btn;
            if (button.dataset.category === currentActiveCat) {
                button.classList.add('active');
                // Auto scroll tabs track horizontally if overflowing on mobile
                const offsetLeft = button.offsetLeft;
                const containerWidth = tabContainer.clientWidth;
                const buttonWidth = button.clientWidth;
                tabContainer.scrollTo({
                    left: offsetLeft - (containerWidth / 2) + (buttonWidth / 2),
                    behavior: 'smooth'
                });
            }
            else {
                button.classList.remove('active');
            }
        });
    });
    // Dynamic Anchor jump scrolling
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const cat = e.currentTarget.dataset.category;
            if (!cat)
                return;
            // Clear search when clicking category tab
            const searchInput = document.getElementById('search-input');
            const clearBtn = document.getElementById('search-clear-btn');
            if (searchInput && searchInput.value) {
                searchInput.value = '';
                if (clearBtn)
                    clearBtn.style.display = 'none';
                const sections = document.querySelectorAll('.category-section');
                sections.forEach(sec => {
                    sec.classList.remove('hidden');
                    sec.querySelectorAll('.product-card').forEach(card => card.classList.remove('hidden'));
                });
            }
            // Handle Favorites virtual category filtering
            if (cat === 'favorites') {
                const favs = JSON.parse(localStorage.getItem('yogo_favorites') || '[]');
                const sections = document.querySelectorAll('.category-section');
                let totalFavoritesFound = 0;
                sections.forEach(sec => {
                    const cards = sec.querySelectorAll('.product-card');
                    let visibleCardsInSection = 0;
                    cards.forEach(card => {
                        const id = Number(card.dataset.id);
                        if (favs.includes(id)) {
                            card.classList.remove('hidden');
                            visibleCardsInSection++;
                            totalFavoritesFound++;
                        }
                        else {
                            card.classList.add('hidden');
                        }
                    });
                    if (visibleCardsInSection > 0) {
                        sec.classList.remove('hidden');
                    }
                    else {
                        sec.classList.add('hidden');
                    }
                });
                // Set active tab buttons manually
                document.querySelectorAll('.tab-btn').forEach(b => {
                    b.classList.toggle('active', b.dataset.category === 'favorites');
                });
                // Scroll to top of shop
                const shop = document.getElementById('shop');
                if (shop) {
                    window.scrollTo({
                        top: shop.offsetTop - headerHeight - tabContainer.offsetHeight - 10,
                        behavior: 'smooth'
                    });
                }
                const shopContainer = document.getElementById('shop');
                if (shopContainer) {
                    let emptyEl = document.getElementById('empty-favorites-msg');
                    if (!emptyEl) {
                        emptyEl = document.createElement('div');
                        emptyEl.id = 'empty-favorites-msg';
                        emptyEl.className = 'empty-state-card';
                        emptyEl.innerHTML = `
              <div class="empty-state-icon">❤️</div>
              <h3>目前沒有收藏的商品</h3>
              <p>點擊商品卡片右下角的 🤍 即可加入收藏清單喔！</p>
            `;
                        shopContainer.appendChild(emptyEl);
                    }
                    if (totalFavoritesFound === 0) {
                        emptyEl.classList.remove('hidden');
                    }
                    else {
                        emptyEl.classList.add('hidden');
                    }
                }
                return;
            }
            // Restore category visibility for any normal category click
            document.getElementById('empty-favorites-msg')?.classList.add('hidden');
            const sections = document.querySelectorAll('.category-section');
            sections.forEach(sec => {
                sec.classList.remove('hidden');
                sec.querySelectorAll('.product-card').forEach(card => card.classList.remove('hidden'));
            });
            // Handle 'all' -> scroll to top
            if (cat === 'all') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            const targetSection = document.getElementById(`section-${cat}`);
            if (targetSection) {
                const offsetPosition = targetSection.offsetTop - headerHeight - tabContainer.offsetHeight - 10;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
