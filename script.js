document.addEventListener('DOMContentLoaded', function() {
    const btnRu = document.getElementById('btn-ru');
    const btnEn = document.getElementById('btn-en');
    const contentRu = document.getElementById('content-ru');
    const contentEn = document.getElementById('content-en');
    const moscowTimeEl = document.getElementById('moscow-time');
    const moscowTimeLabel = document.getElementById('moscow-time-label');
    const moscowTimeDigits = document.getElementById('moscow-time-digits');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Инициализация модальных окон
    const modalOpenButtons = document.querySelectorAll('.modal-open-btn');
    const modals = document.querySelectorAll('.modal-overlay, .modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    console.log('Найдено кнопок для открытия модальных окон:', modalOpenButtons.length);
    console.log('Найдено модальных окон:', modals.length);
    
    // Добавляем обработчики событий для открытия модальных окон
    modalOpenButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Предотвращаем переход по ссылке
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            console.log('Нажата кнопка открытия модального окна:', modalId);
            
            if (modal) {
                console.log('Открываем модальное окно:', modalId);
                modal.classList.add('active');
                
                // Проверяем, правильно ли отображается модальное окно
                if (window.getComputedStyle(modal).display === 'none') {
                    console.log('Принудительно устанавливаем стиль display для модального окна:', modalId);
                    // Используем flex для модальных окон
                    modal.style.display = 'flex';
                }
                
                // Дополнительный класс для поддержки устаревших стилей
                if (modal.classList.contains('modal-overlay')) {
                    modal.style.display = 'flex';
                }

                // Вызываем функцию генерации пароля, если это модальное окно для пароля
                if (modalId === 'password-modal' && typeof generatePassword === 'function') {
                    console.log('Запускаем генерацию пароля');
                    setTimeout(generatePassword, 100);
                }
                
                // Если это QR модальное окно, активируем вкладку по умолчанию
                if (modalId === 'qr-modal') {
                    console.log('Это QR-модальное окно');
                    // Принудительно устанавливаем display, если не задано стилями
                    modal.style.display = 'flex';
                    
                    // Пробуем активировать вкладку URL по умолчанию, если доступна функция activateTab
                    setTimeout(() => {
                        const qrTabs = document.getElementById('qr-tabs');
                        if (qrTabs) {
                            console.log('Найдены вкладки QR');
                            const firstTab = qrTabs.querySelector('.tab[data-type="url"]') || qrTabs.querySelector('.tab');
                            if (firstTab) {
                                console.log('Активируем первую вкладку QR');
                                if (typeof activateTab === 'function') {
                                    activateTab(firstTab);
                                } else {
                                    // Ручная активация вкладки, если функция недоступна
                                    const tabs = qrTabs.querySelectorAll('.tab');
                                    const contents = document.querySelectorAll('.tab-content');
                                    
                                    tabs.forEach(tab => tab.classList.remove('active'));
                                    contents.forEach(content => content.classList.remove('active'));
                                    
                                    firstTab.classList.add('active');
                                    const contentId = firstTab.getAttribute('data-type') + '-content';
                                    const content = document.getElementById(contentId);
                                    if (content) content.classList.add('active');
                                }
                            }
                        } else {
                            console.warn('Не найдены вкладки QR');
                        }
                    }, 200);
                }
            } else {
                console.warn('Модальное окно не найдено:', modalId);
            }
        });
    });
    
    // Добавляем обработчики для закрытия модальных окон
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Нажата кнопка закрытия модального окна');
            
            // Находим ближайшее модальное окно
            const modal = this.closest('.modal-overlay, .modal');
            if (modal) {
                console.log('Закрываем модальное окно с ID:', modal.id);
                modal.classList.remove('active');
                // Скрываем модальное окно полностью
                modal.style.display = 'none';
            } else {
                console.warn('Модальное окно не найдено для кнопки закрытия');
            }
        });
    });
    
    // Закрытие модальных окон при клике вне содержимого
    modals.forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === this) {
                console.log('Закрываем модальное окно по клику вне содержимого');
                this.classList.remove('active');
                // Скрываем модальное окно полностью
                this.style.display = 'none';
            }
        });
    });
    
    // Инициализация темы
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Обработчик для переключения темы
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    // Функция установки темы
    function setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        // Обновляем иконку
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
    
    // Создаем HTML-структуру для анимированных цифр часов
    function createTimeDigits() {
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
    }
    
    createTimeDigits();
    
    // Функция обновления московского времени
    function updateMoscowTime() {
        const now = new Date();
        // Московское время (UTC+3)
        const moscowTime = new Date(now.getTime() + (3 * 60 * 60 * 1000 + now.getTimezoneOffset() * 60 * 1000));
        
        const hours = moscowTime.getHours().toString().padStart(2, '0');
        const minutes = moscowTime.getMinutes().toString().padStart(2, '0');
        const seconds = moscowTime.getSeconds().toString().padStart(2, '0');
        
        const currentLang = localStorage.getItem('preferredLanguage') || 'ru';
        if (currentLang === 'ru') {
            moscowTimeLabel.textContent = 'Москва';
        } else {
            moscowTimeLabel.textContent = 'Moscow';
        }
        
        // Обновляем цифры с анимацией
        updateDigits('hour', hours);
        updateDigits('minute', minutes);
        updateDigits('second', seconds);
    }
    
    // Сохраняем предыдущее значение для анимации
    let prevTimeValues = {
        hour: ['0', '0'],
        minute: ['0', '0'],
        second: ['0', '0']
    };
    
    // Функция для анимации отдельных цифр
    function updateDigits(unit, value) {
        const digits = value.split('');
        
        for (let i = 0; i < 2; i++) {
            const currentDigit = digits[i];
            const prevDigit = prevTimeValues[unit][i];
            
            // Если цифра изменилась, анимируем
            if (currentDigit !== prevDigit) {
                const digitEl = document.getElementById(`${unit}-${i}`);
                
                // Создаем новый элемент для новой цифры
                const newDigit = document.createElement('span');
                newDigit.textContent = currentDigit;
                newDigit.className = 'new';
                
                // Обновляем старую цифру
                const oldDigit = digitEl.querySelector('span');
                oldDigit.className = 'old';
                
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
    
    // Обновляем время каждую секунду
    updateMoscowTime();
    setInterval(updateMoscowTime, 1000);
    
    // Устанавливаем язык из localStorage или используем русский по умолчанию
    const savedLang = localStorage.getItem('preferredLanguage') || 'ru';
    setLanguage(savedLang);
    
    // Обработчики событий для кнопок
    btnRu.addEventListener('click', function() {
        setLanguage('ru');
    });
    
    btnEn.addEventListener('click', function() {
        setLanguage('en');
    });
    
    // Функция установки языка
    function setLanguage(lang) {
        // Активируем контент выбранного языка
        if (lang === 'ru') {
            contentRu.classList.add('active');
            contentEn.classList.remove('active');
            btnRu.classList.add('active');
            btnEn.classList.remove('active');
        } else {
            contentEn.classList.add('active');
            contentRu.classList.remove('active');
            btnEn.classList.add('active');
            btnRu.classList.remove('active');
        }
        
        // Обновляем текст времени для выбранного языка
        updateMoscowTime();
        
        // Сохраняем выбор в localStorage
        localStorage.setItem('preferredLanguage', lang);
        
        // Добавляем анимацию для плавного перехода
        document.querySelectorAll('.feature, .project-card').forEach(el => {
            el.style.animation = 'fadeIn 0.5s ease-out forwards';
            el.style.animationDelay = Math.random() * 0.3 + 's';
        });
    }
    
    // Анимация элементов при прокрутке
    window.addEventListener('scroll', function() {
        const elements = document.querySelectorAll('.feature, .project-card, .profile');
        
        elements.forEach(el => {
            const position = el.getBoundingClientRect();
            
            // Проверяем, виден ли элемент в viewport
            if(position.top < window.innerHeight && position.bottom >= 0) {
                el.classList.add('animate');
            }
        });
    });
    
    // Проявление элементов страницы при загрузке
    document.querySelectorAll('.card, .profile, .feature, .project-card').forEach((el, index) => {
        el.style.opacity = '0';
        setTimeout(() => {
            el.style.transition = 'opacity 0.7s ease-out';
            el.style.opacity = '1';
        }, 100 + index * 100);
    });
    
    // Интерактивные эффекты для карточек проектов
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelectorAll('.btn').forEach(btn => {
                btn.style.transform = 'translateY(-5px)';
            });
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelectorAll('.btn').forEach(btn => {
                btn.style.transform = 'translateY(0)';
            });
        });
    });
    
    // Инициализация анимаций при загрузке страницы
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 100);
}); 