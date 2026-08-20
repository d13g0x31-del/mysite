document.addEventListener('DOMContentLoaded', function() {
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const categoryCards = document.querySelectorAll('.category-card[data-filter-trigger]');
    const cards = document.querySelectorAll('.card');

    // Функция фильтрации
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
            document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Кнопка наверх
    const scrollTopBtn = document.getElementById('scrollTop');
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

});

// Калькулятор вклада
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

// Калькулятор займа
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