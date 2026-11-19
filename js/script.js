document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // ФИЛЬТРАЦИЯ
    // ============================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const categoryCards = document.querySelectorAll('.category-card[data-filter-trigger]');
    const cards = document.querySelectorAll('.card');

    function applyFilter(filterValue) {
        filterButtons.forEach(btn => {
            if (btn.getAttribute('data-filter') === filterValue) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        cards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filterValue === 'all' || filterValue === category) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            applyFilter(filterValue);
        });
    });

    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter-trigger');
            applyFilter(filterValue);
            const catalog = document.getElementById('catalog');
            if (catalog) {
                catalog.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // КНОПКА НАВЕРХ
    // ============================================
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});

// ============================================
// КАЛЬКУЛЯТОР ВКЛАДА
// ============================================
function calcDeposit() {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    const rate = parseFloat(document.getElementById('depositRate').value);
    const term = parseInt(document.getElementById('depositTerm').value);
    const result = document.getElementById('depositResult');

    if (!amount || !rate || !term || amount <= 0 || rate <= 0 || term <= 0) {
        result.textContent = 'Пожалуйста, заполните все поля корректно.';
        result.classList.add('show');
        return;
    }

    const income = amount * (rate / 100) * (term / 12);
    const total = amount + income;

    result.innerHTML = `
        <b>Доход:</b> ${income.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽<br>
        <b>Итоговая сумма:</b> ${total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽
    `;
    result.classList.add('show');
}

// ============================================
// КАЛЬКУЛЯТОР ЗАЙМА
// ============================================
function calcLoan() {
    const amount = parseFloat(document.getElementById('loanAmount').value);
    const rate = parseFloat(document.getElementById('loanRate').value);
    const term = parseInt(document.getElementById('loanTerm').value);
    const result = document.getElementById('loanResult');

    if (!amount || !rate || !term || amount <= 0 || rate <= 0 || term <= 0) {
        result.textContent = 'Пожалуйста, заполните все поля корректно.';
        result.classList.add('show');
        return;
    }

    const overpayment = amount * (rate / 100) * term;
    const total = amount + overpayment;

    result.innerHTML = `
        <b>Переплата:</b> ${overpayment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽<br>
        <b>К возврату:</b> ${total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽
    `;
    result.classList.add('show');
}

// --- Cookie Banner ---
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('cookieConsent')) {
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.style.cssText = 'position: fixed; bottom: 0; left: 0; right: 0; background: #1e293b; color: #fff; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; z-index: 9999; font-size: 14px; flex-wrap: wrap; gap: 10px;';
        banner.innerHTML = `
            <span>Мы используем файлы cookie для улучшения работы сайта. Продолжая просмотр, вы соглашаетесь с нашей <a href="/privacy.html" style="color: #93c5fd; text-decoration: underline;">политикой конфиденциальности</a>.</span>
            <button id="accept-cookies" style="background: #2563eb; color: #fff; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">Принять</button>
        `;
        document.body.appendChild(banner);

        document.getElementById('accept-cookies').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.remove();
        });
    }
});

// --- Логика сравнения ---
document.addEventListener('DOMContentLoaded', () => {
    // Загружаем сохраненный список сравнения
    let compareList = JSON.parse(localStorage.getItem('compareList')) || [];

    // Обновляем внешний вид всех кнопок при загрузке
    document.querySelectorAll('.btn-compare').forEach(btn => {
        const id = btn.getAttribute('data-id');
        if (compareList.includes(id)) {
            btn.textContent = 'В сравнении ✓';
            btn.classList.add('active');
        }
    });

    // Обработчик клика
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-compare')) {
            const btn = e.target;
            const id = btn.getAttribute('data-id');
            
            if (compareList.includes(id)) {
                // Удаляем из сравнения
                compareList = compareList.filter(item => item !== id);
                btn.textContent = 'Сравнить';
                btn.classList.remove('active');
            } else {
                // Добавляем в сравнение
                if (compareList.length >= 3) {
                    alert('Можно сравнивать не более 3 офферов одновременно.');
                    return;
                }
                compareList.push(id);
                btn.textContent = 'В сравнении ✓';
                btn.classList.add('active');
            }
            
            // Сохраняем в localStorage
            localStorage.setItem('compareList', JSON.stringify(compareList));
            updateComparePanel();
        }
    });

    // Панель сравнения (можно добавить на страницу)
    function updateComparePanel() {
        let panel = document.getElementById('compare-panel');
        if (compareList.length > 0) {
            if (!panel) {
                panel = document.createElement('div');
                panel.id = 'compare-panel';
                panel.style.cssText = 'position: fixed; bottom: 20px; left: 20px; background: #2563eb; color: #fff; padding: 15px; border-radius: 10px; z-index: 1000; box-shadow: 0 4px 15px rgba(0,0,0,0.2);';
                document.body.appendChild(panel);
            }
            panel.innerHTML = `
                <span>Выбрано для сравнения: ${compareList.length}</span>
                <button onclick="window.location.href='/compare.html'" style="margin-left: 15px; background: #fff; color: #2563eb; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Сравнить</button>
                <button onclick="localStorage.removeItem('compareList'); location.reload();" style="margin-left: 10px; background: transparent; color: #fff; border: 1px solid #fff; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Очистить</button>
            `;
        } else if (panel) {
            panel.remove();
        }
    }

    // ============================================
// ПОИСК И СОРТИРОВКА (ИСПРАВЛЕНО)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const grid = document.querySelector('.grid'); // Ищем любую сетку на странице
    
    if (searchInput && sortSelect && grid) {
        const cards = Array.from(grid.querySelectorAll('.card'));

        function updateCatalog() {
            const query = searchInput.value.toLowerCase();
            const sortValue = sortSelect.value;

            let visibleCards = cards.filter(card => {
                return card.textContent.toLowerCase().includes(query);
            });

            if (sortValue === 'name-asc') {
                visibleCards.sort((a, b) => {
                    const aText = a.querySelector('.card__title')?.textContent || '';
                    const bText = b.querySelector('.card__title')?.textContent || '';
                    return aText.localeCompare(bText);
                });
            } else if (sortValue === 'name-desc') {
                visibleCards.sort((a, b) => {
                    const aText = a.querySelector('.card__title')?.textContent || '';
                    const bText = b.querySelector('.card__title')?.textContent || '';
                    return bText.localeCompare(aText);
                });
            }

            grid.innerHTML = '';
            visibleCards.forEach(card => grid.appendChild(card));
        }

        searchInput.addEventListener('input', updateCatalog);
        sortSelect.addEventListener('change', updateCatalog);
    }
});

// ============================================
// ПОИСК И СОРТИРОВКА
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const grid = document.querySelector('.grid');
    
    // Если мы не на странице каталога, просто выходим
    if (!searchInput || !sortSelect || !grid) return;

    const cards = Array.from(grid.querySelectorAll('.card'));

    function updateCatalog() {
        const query = searchInput.value.toLowerCase();
        const sortValue = sortSelect.value;

        // 1. Сортировка
        if (sortValue === 'name-asc') {
            cards.sort((a, b) => {
                const aText = a.querySelector('.card__title')?.textContent || '';
                const bText = b.querySelector('.card__title')?.textContent || '';
                return aText.localeCompare(bText);
            });
        } else if (sortValue === 'name-desc') {
            cards.sort((a, b) => {
                const aText = a.querySelector('.card__title')?.textContent || '';
                const bText = b.querySelector('.card__title')?.textContent || '';
                return bText.localeCompare(aText);
            });
        }

        // 2. Фильтрация и перерисовка
        grid.innerHTML = '';
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(query)) {
                card.style.display = 'flex'; // Или 'block' в зависимости от вашей верстки
                grid.appendChild(card);
            } else {
                card.style.display = 'none';
            }
        });
    }

    searchInput.addEventListener('input', updateCatalog);
    sortSelect.addEventListener('change', updateCatalog);
});

// ============================================
// СРАВНЕНИЕ ОФФЕРОВ
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, есть ли вообще карточки на странице
    const cards = document.querySelectorAll('.card[data-offer-id]');
    if (cards.length === 0) return;

    let compareList = JSON.parse(localStorage.getItem('compareList')) || [];

    cards.forEach(card => {
        const id = card.getAttribute('data-offer-id');
        const actions = card.querySelector('.card__actions');
        
        if (actions && id) {
            // Проверяем, нет ли уже кнопки (чтобы не дублировать)
            if (actions.querySelector('.btn-compare')) return;

            const btn = document.createElement('button');
            btn.className = 'btn btn--outline btn-compare';
            btn.setAttribute('data-id', id);
            btn.style.marginTop = '5px';
            btn.style.width = '100%'; // На всякий случай
            
            if (compareList.includes(id)) {
                btn.textContent = 'В сравнении ✓';
                btn.style.background = '#e0f2fe';
            } else {
                btn.textContent = 'Сравнить';
            }
            
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // Защита от перезагрузки
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
                panel.style.cssText = 'position: fixed; bottom: 20px; left: 20px; background: #2563eb; color: #fff; padding: 15px; border-radius: 10px; z-index: 1000; display: flex; gap: 15px; align-items: center;';
                document.body.appendChild(panel);
            }
            panel.innerHTML = `
                <span>Выбрано: ${compareList.length}</span>
                <button onclick="window.location.href='compare.html'" style="background: #fff; color: #2563eb; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;">Сравнить</button>
            `;
        } else if (panel) {
            panel.remove();
        }
    }
    updateComparePanel();
});
