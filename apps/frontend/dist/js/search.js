import { PRODUCTS } from "./data.js";
import { logAnalyticsEvent } from "./analytics.js";
export function initSearch() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('search-clear-btn');
    if (!searchInput)
        return;
    let searchTimeout = null;
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        if (clearBtn) {
            clearBtn.style.display = query ? 'block' : 'none';
        }
        filterProducts(query);
        // Debounce logging of search queries to Analytics to avoid flooding (C1. Firebase Analytics)
        if (searchTimeout)
            window.clearTimeout(searchTimeout);
        if (query.length >= 2) {
            searchTimeout = window.setTimeout(() => {
                logAnalyticsEvent('search', { search_term: query });
            }, 800);
        }
    });
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearBtn.style.display = 'none';
            filterProducts('');
            searchInput.focus();
        });
    }
}
export function filterProducts(query) {
    const sections = document.querySelectorAll('.category-section');
    sections.forEach(section => {
        const cards = section.querySelectorAll('.product-card');
        let visibleCount = 0;
        cards.forEach(card => {
            const id = Number(card.dataset.id);
            const product = PRODUCTS.find(p => p.id === id);
            if (!product)
                return;
            const nameMatch = product.name.toLowerCase().includes(query);
            const specMatch = product.spec.toLowerCase().includes(query);
            const featuresMatch = product.features.some(f => f.toLowerCase().includes(query));
            if (nameMatch || specMatch || featuresMatch || !query) {
                card.classList.remove('hidden');
                visibleCount++;
            }
            else {
                card.classList.add('hidden');
            }
        });
        if (visibleCount > 0 || !query) {
            section.classList.remove('hidden');
        }
        else {
            section.classList.add('hidden');
        }
    });
}
