document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен - инициализация скриптов');
    
    const btnRu = document.getElementById('btn-ru');
    const btnEn = document.getElementById('btn-en');
    const contentRu = document.getElementById('content-ru');
    const contentEn = document.getElementById('content-en');
    const moscowTimeEl = document.getElementById('moscow-time');
    const moscowTimeLabel = document.getElementById('moscow-time-label');
    const moscowTimeDigits = document.getElementById('moscow-time-digits');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;
    
    console.log('Элементы найдены:', {
        btnRu: Boolean(btnRu),
        btnEn: Boolean(btnEn),
        contentRu: Boolean(contentRu),
        contentEn: Boolean(contentEn),
        themeToggle: Boolean(themeToggle),
        themeIcon: Boolean(themeIcon)
    });
    
    // ИСПРАВЛЕНИЕ: Инициализация контейнеров с содержимым без дополнительных проверок
    if (contentRu && contentEn) {
        // Сначала скрываем оба контейнера напрямую через CSS
        contentRu.style.display = 'none';
        contentEn.style.display = 'none';
        contentRu.classList.remove('active');
        contentEn.classList.remove('active');
        
        // Получаем сохраненный язык
        let initialLang = localStorage.getItem('language') || localStorage.getItem('preferredLanguage') || 'ru';
        if (initialLang !== 'ru' && initialLang !== 'en') {
            initialLang = 'ru';
        }
        console.log('Инициализация языка:', initialLang);
        
        // Активируем соответствующий контейнер
        if (initialLang === 'ru') {
            contentRu.style.display = 'block';
            contentRu.classList.add('active');
            if (btnRu) btnRu.classList.add('active');
            if (btnEn) btnEn.classList.remove('active');
            document.title = 'Проекты yearningss';
        } else {
            contentEn.style.display = 'block';
            contentEn.classList.add('active');
            if (btnRu) btnRu.classList.remove('active');
            if (btnEn) btnEn.classList.add('active');
            document.title = 'yearningss Projects';
        }
        
        // Сохраняем текущий язык
        localStorage.setItem('language', initialLang);
        localStorage.setItem('preferredLanguage', initialLang);
        
        console.log('Контейнеры контента инициализированы:', {
            'ru-display': contentRu.style.display,
            'ru-class': contentRu.className,
            'en-display': contentEn.style.display,
            'en-class': contentEn.className
        });
    } else {
        console.error('Не удалось найти контейнеры контента');
    }
    
    // ИСПРАВЛЕНИЕ: Проверка и инициализация темы
    let savedTheme = localStorage.getItem('theme');
    if (!savedTheme || (savedTheme !== 'light' && savedTheme !== 'dark')) {
        savedTheme = 'light';
        localStorage.setItem('theme', savedTheme);
    }
    console.log('Инициализация темы:', savedTheme);
    
    // Устанавливаем тему
    document.body.setAttribute('data-theme', savedTheme);
    
    // Обновляем иконку темы
    if (themeIcon) {
        if (savedTheme === 'dark') {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
    
    // Добавляем обработчик для кнопки переключения темы
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.body.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            console.log('Переключение темы:', currentTheme, '->', newTheme);
            
            // Меняем атрибут темы
            document.body.setAttribute('data-theme', newTheme);
            
            // Обновляем иконку
            if (themeIcon) {
                if (newTheme === 'dark') {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                } else {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                }
            }
            
            // Сохраняем новую тему
            localStorage.setItem('theme', newTheme);
        });
    }
    
    // Добавляем обработчики переключения языка
    if (btnRu) {
        btnRu.addEventListener('click', function() {
            switchLanguage('ru');
        });
    }
    
    if (btnEn) {
        btnEn.addEventListener('click', function() {
            switchLanguage('en');
        });
    }
    
    // ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ ЯЗЫКА
    function switchLanguage(lang) {
        if (!contentRu || !contentEn) {
            console.error('Не удалось найти контейнеры контента');
            return;
        }
        
        console.log('Переключение языка на', lang);
        
        // Переключаем классы активности и видимость
        if (lang === 'ru') {
            contentRu.style.display = 'block';
            contentEn.style.display = 'none';
            contentRu.classList.add('active');
            contentEn.classList.remove('active');
            if (btnRu) btnRu.classList.add('active');
            if (btnEn) btnEn.classList.remove('active');
            document.title = 'Проекты yearningss';
        } else {
            contentRu.style.display = 'none';
            contentEn.style.display = 'block';
            contentRu.classList.remove('active');
            contentEn.classList.add('active');
            if (btnRu) btnRu.classList.remove('active');
            if (btnEn) btnEn.classList.add('active');
            document.title = 'yearningss Projects';
        }
        
        // Сохраняем выбранный язык
        localStorage.setItem('language', lang);
        localStorage.setItem('preferredLanguage', lang);
        
        // Обновляем тексты с атрибутами data-lang
        updateLocalizedTexts(lang);
        
        // Обновляем время Москвы
        updateMoscowTimeLabel(lang);
        
        // Создаем событие смены языка
        const event = new CustomEvent('languageChanged', { 
            detail: { language: lang },
            bubbles: true
        });
        document.dispatchEvent(event);
    }
    
    // Обновляем локализованные тексты
    function updateLocalizedTexts(lang) {
        const elements = document.querySelectorAll('[data-lang-ru], [data-lang-en]');
        
        elements.forEach(element => {
            if (lang === 'en' && element.hasAttribute('data-lang-en')) {
                element.textContent = element.getAttribute('data-lang-en');
            } else if (lang === 'ru' && element.hasAttribute('data-lang-ru')) {
                element.textContent = element.getAttribute('data-lang-ru');
            }
        });
        
        console.log('Локализованные тексты обновлены');
    }
    
    // Обновляем метку времени Москвы
    function updateMoscowTimeLabel(lang) {
        if (moscowTimeLabel) {
            moscowTimeLabel.textContent = lang === 'ru' ? 'Москва' : 'Moscow';
        }
    }
    
    // Инициализируем московское время
    function initMoscowTime() {
        if (!moscowTimeDigits) return;
        
        let html = '';
        // Часы
        for (let i = 0; i < 2; i++) {
            html += `<div class="time-unit" id="hour-${i}"><span class="new">0</span></div>`;
        }
        // Разделитель
        html += `<div class="time-colon">:</div>`;
        // Минуты
        for (let i = 0; i < 2; i++) {
            html += `<div class="time-unit" id="minute-${i}"><span class="new">0</span></div>`;
        }
        // Разделитель
        html += `<div class="time-colon">:</div>`;
        // Секунды
        for (let i = 0; i < 2; i++) {
            html += `<div class="time-unit" id="second-${i}"><span class="new">0</span></div>`;
        }
        
        moscowTimeDigits.innerHTML = html;
        
        // Инициализируем текст метки времени
        const currentLang = localStorage.getItem('language') || localStorage.getItem('preferredLanguage') || 'ru';
        updateMoscowTimeLabel(currentLang);
        
        // Запускаем обновление времени
        updateMoscowTime();
        setInterval(updateMoscowTime, 1000);
    }
    
    // Обновление московского времени
    function updateMoscowTime() {
        if (!moscowTimeDigits) return;
        
        const now = new Date();
        // Московское время (UTC+3)
        const moscowTime = new Date(now.getTime() + (3 * 60 * 60 * 1000 + now.getTimezoneOffset() * 60 * 1000));
        
        const hours = moscowTime.getHours().toString().padStart(2, '0');
        const minutes = moscowTime.getMinutes().toString().padStart(2, '0');
        const seconds = moscowTime.getSeconds().toString().padStart(2, '0');
        
        // Обновляем цифры
        updateTimeDigits('hour', hours);
        updateTimeDigits('minute', minutes);
        updateTimeDigits('second', seconds);
    }
    
    // Сохраняем предыдущие значения для анимации
    let prevTimeValues = {
        hour: ['0', '0'],
        minute: ['0', '0'],
        second: ['0', '0']
    };
    
    // Функция для обновления цифр времени
    function updateTimeDigits(unit, value) {
        const digits = value.split('');
        
        for (let i = 0; i < 2; i++) {
            const digitEl = document.getElementById(`${unit}-${i}`);
            if (!digitEl) continue;
            
            const currentDigit = digits[i];
            const prevDigit = prevTimeValues[unit][i];
            
            // Если цифра изменилась, анимируем
            if (currentDigit !== prevDigit) {
                // Создаем новый элемент для новой цифры
                const newDigit = document.createElement('span');
                newDigit.textContent = currentDigit;
                newDigit.className = 'new';
                
                // Обновляем старую цифру
                const oldDigit = digitEl.querySelector('span');
                if (oldDigit) {
                    oldDigit.className = 'old';
                }
                
                // Добавляем новую цифру
                digitEl.appendChild(newDigit);
                
                // Удаляем старую цифру после завершения анимации
                setTimeout(() => {
                    if (oldDigit && oldDigit.parentNode === digitEl) {
                        digitEl.removeChild(oldDigit);
                    }
                }, 300);
            }
        }
        
        // Сохраняем текущие значения
        prevTimeValues[unit] = digits;
    }
    
    // Инициализируем модальные окна
    initModalWindows();
    
    // Инициализируем московское время
    initMoscowTime();
    
    // Инициализируем локализованные тексты
    const currentLang = localStorage.getItem('language') || localStorage.getItem('preferredLanguage') || 'ru';
    updateLocalizedTexts(currentLang);
    
    // Инициализация модальных окон
    function initModalWindows() {
        const modalOpenButtons = document.querySelectorAll('.modal-open-btn');
        const modals = document.querySelectorAll('.modal-overlay, .modal');
        const closeButtons = document.querySelectorAll('.modal-close');
        
        // Добавляем обработчики событий для открытия модальных окон
        modalOpenButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const modalId = this.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                
                if (modal) {
                    modal.classList.add('active');
                    modal.style.display = 'flex';
                    
                    // Запускаем генерацию пароля, если это модальное окно для пароля
                    if (modalId === 'password-generator-modal' && typeof generatePassword === 'function') {
                        setTimeout(generatePassword, 100);
                    }
                    
                    // Если это QR модальное окно, активируем вкладку по умолчанию
                    if (modalId === 'qr-modal' && typeof updateTexts === 'function') {
                        updateTexts();
                        
                        setTimeout(() => {
                            const qrTabs = document.getElementById('qr-tabs');
                            if (qrTabs) {
                                const firstTab = qrTabs.querySelector('.tab[data-type="url"]') || qrTabs.querySelector('.tab');
                                if (firstTab && typeof activateTab === 'function') {
                                    activateTab(firstTab);
                                }
                            }
                        }, 200);
                    }
                }
            });
        });
        
        // Добавляем обработчики для закрытия модальных окон
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal-overlay, .modal');
                if (modal) {
                    modal.classList.remove('active');
                    modal.style.display = 'none';
                }
            });
        });
        
        // Закрытие модальных окон при клике вне содержимого
        modals.forEach(modal => {
            modal.addEventListener('click', function(event) {
                if (event.target === this) {
                    this.classList.remove('active');
                    this.style.display = 'none';
                }
            });
        });
    }
    
    // Добавляем анимацию для элементов при загрузке страницы
    document.querySelectorAll('.card, .profile, .feature, .project-card').forEach((el, index) => {
        el.style.opacity = '0';
        setTimeout(() => {
            el.style.transition = 'opacity 0.7s ease-out';
            el.style.opacity = '1';
        }, 100 + index * 50);
    });
    
    // Скрыть прелоадер
    setTimeout(() => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.classList.add('hidden');
            document.body.classList.remove('loading');
        }
    }, 1000);
}); 