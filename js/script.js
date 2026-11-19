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
