document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, находимся ли мы на странице с генератором паролей
    
    // Элементы DOM
    const openModalBtn = document.getElementById('open-modal-btn');
    const modal = document.getElementById('password-modal');
    
    // Если основные элементы отсутствуют, завершаем инициализацию
    if (!modal) {
        console.info('Password generator modal not found on page, skipping initialization');
        return;
    }
    
    // Определяем элементы в модальном окне
    const closeBtn = document.getElementById('modal-close') || document.querySelector('.modal-close');
    const generateBtn = document.getElementById('generate-btn');
    const passwordResult = document.getElementById('password-text');
    const copyBtn = document.getElementById('copy-btn');
    const copyNotification = document.getElementById('copy-notification');
    const lengthSlider = document.getElementById('length-slider');
    const lengthValue = document.getElementById('length-value');
    const uppercaseCheckbox = document.getElementById('uppercase-toggle');
    const lowercaseCheckbox = document.getElementById('lowercase-toggle');
    const numbersCheckbox = document.getElementById('numbers-toggle');
    const symbolsCheckbox = document.getElementById('symbols-toggle');
    const strengthBars = document.querySelectorAll('.strength-bar');
    const ruLangBtn = document.getElementById('btn-ru');
    const enLangBtn = document.getElementById('btn-en');
    
    // Языковые элементы
    const langRu = document.querySelectorAll('.lang-ru');
    const langEn = document.querySelectorAll('.lang-en');
    const hasLanguageElements = langRu.length > 0 && langEn.length > 0;

    // Инициализация состояния
    let passwordLength = parseInt(lengthSlider.value);
    lengthValue.textContent = passwordLength;

    // Установка начального языка
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'ru';
    
    // Применяем язык только если есть языковые элементы
    if (hasLanguageElements) {
        switchLanguage(savedLanguage);
    }

    // Проверяем все элементы управления
    if (!closeBtn) console.warn('Кнопка закрытия не найдена!');
    if (!generateBtn) console.warn('Кнопка генерации не найдена!');
    if (!passwordResult) console.warn('Элемент для отображения пароля не найден!');
    if (!lengthSlider) console.warn('Слайдер длины пароля не найден!');
    
    // Установка начальных опций пароля
    if (lowercaseCheckbox) lowercaseCheckbox.checked = true;
    if (uppercaseCheckbox) uppercaseCheckbox.checked = true;
    if (numbersCheckbox) numbersCheckbox.checked = true;
    if (symbolsCheckbox) symbolsCheckbox.checked = false;

    // Слушатели событий
    if (openModalBtn) {
        openModalBtn.addEventListener('click', function() {
            console.log('Открываем модальное окно');
            modal.classList.add('active');
            generatePassword();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            console.log('Закрываем модальное окно');
            modal.classList.remove('active');
        });
    }

    // Закрытие модального окна при клике вне его содержимого
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            console.log('Закрываем модальное окно по клику вне');
            modal.classList.remove('active');
        }
    });

    if (lengthSlider) {
        lengthSlider.addEventListener('input', function() {
            passwordLength = parseInt(this.value);
            if (lengthValue) lengthValue.textContent = passwordLength;
            generatePassword();
        });
    }

    // Слушатели событий для чекбоксов
    const checkboxes = [uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, symbolsCheckbox]
        .filter(checkbox => checkbox !== null);
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Убедимся, что хотя бы один чекбокс выбран
            if(!checkboxes.some(box => box.checked)) {
                this.checked = true;
            }
            generatePassword();
        });
    });

    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            console.log('Генерируем пароль по клику на кнопку');
            generatePassword();
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', copyToClipboard);
    }

    // Слушатели для переключения языка
    if (ruLangBtn) {
        ruLangBtn.addEventListener('click', function() {
            switchLanguage('ru');
            localStorage.setItem('preferredLanguage', 'ru');
        });
    }

    if (enLangBtn) {
        enLangBtn.addEventListener('click', function() {
            switchLanguage('en');
            localStorage.setItem('preferredLanguage', 'en');
        });
    }

    // Функция генерации пароля
    function generatePassword() {
        console.log('Запущена функция generatePassword');
        
        // Если нет чекбоксов или passwordResult, выходим
        if (checkboxes.length === 0 || !passwordResult) {
            console.warn('Нет чекбоксов или элемента для отображения пароля');
            return;
        }
        
        const options = {
            length: passwordLength,
            hasUppercase: uppercaseCheckbox ? uppercaseCheckbox.checked : true,
            hasLowercase: lowercaseCheckbox ? lowercaseCheckbox.checked : true,
            hasNumbers: numbersCheckbox ? numbersCheckbox.checked : true,
            hasSymbols: symbolsCheckbox ? symbolsCheckbox.checked : false
        };
        
        console.log('Настройки генерации пароля:', options);
        
        const charset = getCharset(options);
        if (charset.length === 0) {
            console.warn('Пустой набор символов');
            return;
        }
        
        let password = '';
        let meetsRequirements = false;
        
        // Генерация пароля, который соответствует всем выбранным требованиям
        while (!meetsRequirements) {
            password = '';
            for (let i = 0; i < options.length; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                password += charset[randomIndex];
            }
            
            // Проверка, что пароль соответствует всем требованиям
            meetsRequirements = validatePassword(password, options);
        }
        
        console.log('Сгенерирован пароль:', password);
        passwordResult.textContent = password;
        
        if (strengthBars && strengthBars.length > 0) {
            updateStrengthIndicator(password);
        }
    }

    // Получение набора символов для пароля
    function getCharset(options) {
        let charset = '';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?`~';
        
        if (options.hasLowercase) charset += lowercaseChars;
        if (options.hasUppercase) charset += uppercaseChars;
        if (options.hasNumbers) charset += numberChars;
        if (options.hasSymbols) charset += symbolChars;
        
        return charset;
    }

    // Проверка, что пароль соответствует требованиям
    function validatePassword(password, options) {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSymbols = /[!@#$%^&*()\-_=+\[{\]}\\\|;:'",<.>/?`~]/.test(password);
        
        return (!options.hasUppercase || hasUppercase) &&
               (!options.hasLowercase || hasLowercase) &&
               (!options.hasNumbers || hasNumbers) &&
               (!options.hasSymbols || hasSymbols);
    }

    // Оценка надежности пароля
    function calculatePasswordStrength(password) {
        if (!password) return 0;
        
        let score = 0;
        
        // Длина пароля (10 баллов за каждый символ, максимум 80 баллов)
        score += Math.min(8, password.length) * 10;
        
        // Дополнительные баллы за более длинные пароли
        if (password.length > 8) {
            score += (password.length - 8) * 5; // 5 баллов за каждый дополнительный символ
        }
        
        // Наличие разных типов символов
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSymbols = /[!@#$%^&*()\-_=+\[{\]}\\\|;:'",<.>/?`~]/.test(password);
        
        if (hasUppercase) score += 15;
        if (hasLowercase) score += 15;
        if (hasNumbers) score += 15;
        if (hasSymbols) score += 25;
        
        // Бонус за комбинации разных типов символов
        let typesCount = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;
        if (typesCount > 2) {
            score += (typesCount - 2) * 15;
        }
        
        return Math.min(100, score);
    }

    // Обновление индикатора надежности пароля
    function updateStrengthIndicator(password) {
        const strength = calculatePasswordStrength(password);
        
        // Сбросить все классы
        strengthBars.forEach(bar => {
            bar.classList.remove('weak', 'medium', 'strong');
        });
        
        let strengthClass = '';
        let activeBars = 0;
        
        if (strength < 40) {
            strengthClass = 'weak';
            activeBars = 1;
        } else if (strength < 80) {
            strengthClass = 'medium';
            activeBars = 3;
        } else {
            strengthClass = 'strong';
            activeBars = 5;
        }
        
        // Добавить соответствующий класс к активным полоскам
        for (let i = 0; i < activeBars; i++) {
            strengthBars[i].classList.add(strengthClass);
        }
    }

    // Копирование пароля в буфер обмена
    function copyToClipboard() {
        console.log('Запущена функция копирования пароля');
        
        if (!passwordResult) {
            console.warn('Элемент с паролем не найден');
            return;
        }
        
        const password = passwordResult.textContent;
        if (!password) {
            console.warn('Нет пароля для копирования');
            return;
        }
        
        console.log('Копируем пароль:', password);
        
        navigator.clipboard.writeText(password).then(() => {
            console.log('Пароль скопирован успешно');
            
            if (copyNotification) {
                // Проверяем оба варианта класса для совместимости с разными версиями HTML
                copyNotification.classList.add('show');
                
                setTimeout(() => {
                    copyNotification.classList.remove('show');
                }, 2000);
            }
        }).catch(err => {
            console.error('Ошибка при копировании:', err);
        });
    }

    // Переключение языка
    function switchLanguage(lang) {
        // Если на странице нет языковых элементов, выходим
        if (!hasLanguageElements) {
            return;
        }
        
        if (lang === 'ru') {
            langRu.forEach(el => el.style.display = 'block');
            langEn.forEach(el => el.style.display = 'none');
            if (ruLangBtn) ruLangBtn.classList.add('active');
            if (enLangBtn) enLangBtn.classList.remove('active');
        } else {
            langRu.forEach(el => el.style.display = 'none');
            langEn.forEach(el => el.style.display = 'block');
            if (ruLangBtn) ruLangBtn.classList.remove('active');
            if (enLangBtn) enLangBtn.classList.add('active');
        }
    }

    // Генерация пароля при загрузке
    generatePassword();
});