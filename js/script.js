document.addEventListener('DOMContentLoaded', function() {
    
    // 1. КНОПКА НАВЕРХ
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) scrollTopBtn.classList.add('show');
            else scrollTopBtn.classList.remove('show');
        });
        scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // 2. ПОИСК И СОРТИРОВКА В КАТАЛОГЕ
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const sortSelect = document.getElementById('sortSelect');
    const grid = document.querySelector('.grid');
    
    if (searchInput && sortSelect && grid) {
        const cards = Array.from(grid.querySelectorAll('.card'));

        function updateCatalog() {
            const query = searchInput.value.toLowerCase();
            const sortValue = sortSelect.value;

            if (sortValue === 'name-asc') {
                cards.sort((a, b) => (a.querySelector('.card__title')?.textContent || '').localeCompare(b.querySelector('.card__title')?.textContent || ''));
            } else if (sortValue === 'name-desc') {
                cards.sort((a, b) => (b.querySelector('.card__title')?.textContent || '').localeCompare(a.querySelector('.card__title')?.textContent || ''));
            }

            grid.innerHTML = '';
            cards.forEach(card => {
                if (card.textContent.toLowerCase().includes(query)) {
                    card.style.display = 'flex';
                    grid.appendChild(card);
                } else {
                    card.style.display = 'none';
                }
            });
        }

        searchInput.addEventListener('input', updateCatalog);
        if (searchBtn) searchBtn.addEventListener('click', (e) => { e.preventDefault(); updateCatalog(); });
        sortSelect.addEventListener('change', updateCatalog);
    }

    // 3. СРАВНЕНИЕ ОФФЕРОВ
    const cardsForCompare = document.querySelectorAll('.card[data-offer-id]');
    if (cardsForCompare.length > 0) {
        let compareList = JSON.parse(localStorage.getItem('compareList')) || [];

        cardsForCompare.forEach(card => {
            const id = card.getAttribute('data-offer-id');
            const actions = card.querySelector('.card__actions');
            
            if (actions && id) {
                if (actions.querySelector('.btn-compare')) return;

                const btn = document.createElement('button');
                btn.className = 'btn btn--outline btn-compare';
                btn.setAttribute('data-id', id);
                btn.style.marginTop = '5px';
                btn.style.width = '100%';
                
                if (compareList.includes(id)) {
                    btn.textContent = 'В сравнении ✓';
                    btn.style.background = '#e0f2fe';
                } else {
                    btn.textContent = 'Сравнить';
                }
                
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (compareList.includes(id)) {
                        compareList = compareList.filter(item => item !== id);
                        btn.textContent = 'Сравнить';
                        btn.style.background = 'transparent';
                    } else {
                        if (compareList.length >= 3) {
                            alert('Можно сравнивать не более 3 офферов.');
                            return;
                        }
                        compareList.push(id);
                        btn.textContent = 'В сравнении ✓';
                        btn.style.background = '#e0f2fe';
                    }
                    localStorage.setItem('compareList', JSON.stringify(compareList));
                    updateComparePanel();
                });

                actions.appendChild(btn);
            }
        });

        function updateComparePanel() {
            let panel = document.getElementById('compare-panel');
            if (compareList.length > 0) {
                if (!panel) {
                    panel = document.createElement('div');
                    panel.id = 'compare-panel';
                    panel.style.cssText = 'position: fixed; bottom: 20px; left: 20px; background: #2563eb; color: #fff; padding: 15px; border-radius: 10px; z-index: 1000; display: flex; gap: 15px; align-items: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
                    document.body.appendChild(panel);
                }
                panel.innerHTML = `
                    <span>Выбрано: ${compareList.length}</span>
                    <button onclick="window.location.href='compare.html'" style="background: #fff; color: #2563eb; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;">Сравнить</button>
                    <button onclick="localStorage.removeItem('compareList'); location.reload();" style="background: transparent; color: #fff; border: 1px solid #fff; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Очистить</button>
                `;
            } else if (panel) {
                panel.remove();
            }
        }
        updateComparePanel();
    }

    // 4. COOKIE BANNER
    if (!localStorage.getItem('cookieConsent')) {
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.style.cssText = 'position: fixed; bottom: 0; left: 0; right: 0; background: #1e293b; color: #fff; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; z-index: 9999; font-size: 14px; flex-wrap: wrap; gap: 10px; box-shadow: 0 -4px 10px rgba(0,0,0,0.1);';
        banner.innerHTML = `
            <span style="max-width: 800px;">Мы используем файлы cookie для улучшения работы сайта. Продолжая просмотр, вы соглашаетесь с нашей <a href="/privacy.html" style="color: #93c5fd; text-decoration: underline;">политикой конфиденциальности</a>.</span>
            <button id="accept-cookies" style="background: #2563eb; color: #fff; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">Принять</button>
        `;
        document.body.appendChild(banner);

        document.getElementById('accept-cookies').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.remove();
        });
    }
});