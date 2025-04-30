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
    
    const closeBtn = document.querySelector('.modal-close');
    const generateBtn = document.querySelector('.generate-button');
    const passwordResult = document.getElementById('password-result');
    const copyBtn = document.querySelector('.copy-button');
    const copyNotification = document.querySelector('.copy-notification');
    const lengthSlider = document.getElementById('password-length');
    const lengthValue = document.getElementById('length-value');
    const uppercaseCheckbox = document.getElementById('include-uppercase');
    const lowercaseCheckbox = document.getElementById('include-lowercase');
    const numbersCheckbox = document.getElementById('include-numbers');
    const symbolsCheckbox = document.getElementById('include-symbols');
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

    // Установка начальных опций пароля
    lowercaseCheckbox.checked = true;
    uppercaseCheckbox.checked = true;
    numbersCheckbox.checked = true;
    symbolsCheckbox.checked = false;

    // Слушатели событий
    openModalBtn.addEventListener('click', function() {
        modal.classList.add('active');
        generatePassword();
    });

    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });

    // Закрытие модального окна при клике вне его содержимого
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });

    lengthSlider.addEventListener('input', function() {
        passwordLength = parseInt(this.value);
        lengthValue.textContent = passwordLength;
        generatePassword();
    });

    // Слушатели событий для чекбоксов
    const checkboxes = [uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, symbolsCheckbox];
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Убедимся, что хотя бы один чекбокс выбран
            if(!checkboxes.some(box => box.checked)) {
                this.checked = true;
            }
            generatePassword();
        });
    });

    generateBtn.addEventListener('click', generatePassword);

    copyBtn.addEventListener('click', copyToClipboard);

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
        const options = {
            length: passwordLength,
            hasUppercase: uppercaseCheckbox.checked,
            hasLowercase: lowercaseCheckbox.checked,
            hasNumbers: numbersCheckbox.checked,
            hasSymbols: symbolsCheckbox.checked
        };
        
        const charset = getCharset(options);
        if (charset.length === 0) return;
        
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
        
        passwordResult.textContent = password;
        updateStrengthIndicator(password);
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
        const password = passwordResult.textContent;
        if (!password) return;
        
        navigator.clipboard.writeText(password).then(() => {
            copyNotification.classList.add('show');
            
            setTimeout(() => {
                copyNotification.classList.remove('show');
            }, 2000);
        }).catch(err => {
            console.error('Ошибка при копировании: ', err);
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