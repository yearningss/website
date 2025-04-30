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
    
    // Языковые строки
    const translations = {
        ru: {
            title: 'Генератор паролей',
            passwordCopied: 'Скопировано!',
            generateButton: 'Сгенерировать пароль',
            copyButton: 'Копировать',
            lengthLabel: 'Длина:',
            options: {
                uppercase: 'Заглавные буквы (A-Z)',
                lowercase: 'Строчные буквы (a-z)',
                numbers: 'Цифры (0-9)',
                symbols: 'Специальные символы (!@#$%^&*)'
            },
            strengthLabel: 'Оценка надежности',
            strengthText: {
                veryWeak: 'Очень слабый',
                weak: 'Слабый',
                medium: 'Средний',
                strong: 'Сильный',
                veryStrong: 'Очень сильный'
            },
            errors: {
                noOptions: 'Выберите хотя бы один тип символов'
            }
        },
        en: {
            title: 'Password Generator',
            passwordCopied: 'Copied!',
            generateButton: 'Generate Password',
            copyButton: 'Copy',
            lengthLabel: 'Length:',
            options: {
                uppercase: 'Uppercase Letters (A-Z)',
                lowercase: 'Lowercase Letters (a-z)',
                numbers: 'Numbers (0-9)',
                symbols: 'Special Characters (!@#$%^&*)'
            },
            strengthLabel: 'Password Strength',
            strengthText: {
                veryWeak: 'Very Weak',
                weak: 'Weak',
                medium: 'Medium',
                strong: 'Strong',
                veryStrong: 'Very Strong'
            },
            errors: {
                noOptions: 'Please select at least one character type'
            }
        }
    };
    
    // Определяем элементы в модальном окне
    const closeBtn = document.getElementById('modal-close') || document.querySelector('.modal-close');
    const generateBtn = document.getElementById('generate-btn');
    const modalTitle = document.querySelector('#password-modal .modal-title');
    
    // Ищем элемент для отображения пароля, проверяя различные возможные ID
    let passwordResult = document.getElementById('password-text');
    console.log('Элемент для отображения пароля (password-text):', passwordResult);
    
    // Если не нашли по основному ID, ищем по альтернативным ID или классам
    if (!passwordResult) {
        passwordResult = document.getElementById('password-result');
        console.log('Альтернативный элемент для отображения пароля (password-result):', passwordResult);
    }
    
    if (!passwordResult) {
        const passwordElements = document.querySelectorAll('.password-text');
        console.log('Найдены элементы по классу password-text:', passwordElements.length);
        if (passwordElements.length > 0) {
            passwordResult = passwordElements[0];
        }
    }
    
    const copyBtn = document.getElementById('copy-btn');
    const copyNotification = document.getElementById('copy-notification');
    const lengthSlider = document.getElementById('length-slider');
    const lengthValue = document.getElementById('length-value');
    const lengthLabel = document.querySelector('.password-length span:first-child');
    const uppercaseCheckbox = document.getElementById('uppercase-toggle');
    const uppercaseLabel = uppercaseCheckbox ? uppercaseCheckbox.parentElement.querySelector('span') : null;
    const lowercaseCheckbox = document.getElementById('lowercase-toggle');
    const lowercaseLabel = lowercaseCheckbox ? lowercaseCheckbox.parentElement.querySelector('span') : null;
    const numbersCheckbox = document.getElementById('numbers-toggle');
    const numbersLabel = numbersCheckbox ? numbersCheckbox.parentElement.querySelector('span') : null;
    const symbolsCheckbox = document.getElementById('symbols-toggle');
    const symbolsLabel = symbolsCheckbox ? symbolsCheckbox.parentElement.querySelector('span') : null;
    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthLabel = document.querySelector('.strength-label');
    const strengthText = document.getElementById('strength-text') || document.querySelector('.strength-text');
    const ruLangBtn = document.getElementById('btn-ru');
    const enLangBtn = document.getElementById('btn-en');
    
    // Языковые элементы
    const langRu = document.querySelectorAll('.lang-ru');
    const langEn = document.querySelectorAll('.lang-en');
    const hasLanguageElements = langRu.length > 0 && langEn.length > 0;

    console.log('Элемент для отображения пароля (passwordResult):', passwordResult);
    
    if (!passwordResult) {
        // Дополнительная проверка - ищем все элементы, которые могут быть контейнером для пароля
        console.log('Элемент password-text не найден, ищем альтернативы...');
        const possiblePasswordElements = document.querySelectorAll('.password-text, #password-result, #password-text');
        console.log('Возможные элементы для отображения пароля:', possiblePasswordElements);
        
        if (possiblePasswordElements.length > 0) {
            // Используем первый найденный элемент как альтернативу
            console.log('Используем альтернативный элемент:', possiblePasswordElements[0]);
            passwordResult = possiblePasswordElements[0];
        }
    }

    // Инициализация состояния
    let passwordLength = parseInt(lengthSlider?.value || 16);
    if (lengthValue) lengthValue.textContent = passwordLength;

    // Получаем предпочтительный язык пользователя
    let currentLanguage = localStorage.getItem('preferredLanguage') || 'ru';
    
    // Функция для получения перевода
    function getText(key, defaultText = '') {
        const keys = key.split('.');
        let translation = translations[currentLanguage];
        
        for (const k of keys) {
            if (!translation || translation[k] === undefined) {
                console.warn(`Translation not found for key: ${key} in language ${currentLanguage}`);
                return defaultText || key;
            }
            translation = translation[k];
        }
        
        return translation;
    }
    
    // Функция для прикрепления обработчиков событий к чекбоксам
    function attachCheckboxHandlers() {
        const checkboxes = [uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, symbolsCheckbox]
            .filter(checkbox => checkbox !== null);
        
        checkboxes.forEach(checkbox => {
            // Удаляем старые обработчики (если есть)
            checkbox.removeEventListener('change', checkboxChangeHandler);
            
            // Добавляем новый обработчик
            checkbox.addEventListener('change', checkboxChangeHandler);
        });
    }
    
    // Обработчик изменения чекбокса
    function checkboxChangeHandler() {
        // Убедимся, что хотя бы один чекбокс выбран
        const checkboxes = [uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, symbolsCheckbox]
            .filter(cb => cb !== null);
        
        if(!checkboxes.some(box => box.checked)) {
            this.checked = true;
            alert(getText('errors.noOptions'));
        }
        generatePassword();
    }
    
    // Функция для обновления всех текстов на странице
    function updateUITexts() {
        if (modalTitle) modalTitle.textContent = getText('title');
        if (copyNotification) copyNotification.textContent = getText('passwordCopied');
        if (generateBtn) generateBtn.textContent = getText('generateButton');
        if (copyBtn && copyBtn.textContent) copyBtn.textContent = getText('copyButton');
        if (lengthLabel) lengthLabel.textContent = getText('lengthLabel');
        
        // Обновляем тексты чекбоксов - новый подход с data-атрибутами
        const checkboxLabels = document.querySelectorAll('.option-group label');
        
        checkboxLabels.forEach(label => {
            const checkbox = label.querySelector('input[type="checkbox"]');
            if (checkbox) {
                const type = checkbox.id.replace('-toggle', '');
                // Сохраняем состояние чекбокса
                const isChecked = checkbox.checked;
                
                // Сохраняем чекбокс
                const checkboxClone = checkbox.cloneNode(true);
                checkboxClone.checked = isChecked; // Восстанавливаем состояние
                
                // Обновляем текст метки
                label.innerHTML = '';
                label.appendChild(checkboxClone);
                label.appendChild(document.createTextNode(' ' + getText(`options.${type}`)));
                
                // Восстанавливаем ссылки на чекбоксы
                if (checkboxClone.id === 'uppercase-toggle') uppercaseCheckbox = checkboxClone;
                if (checkboxClone.id === 'lowercase-toggle') lowercaseCheckbox = checkboxClone;
                if (checkboxClone.id === 'numbers-toggle') numbersCheckbox = checkboxClone;
                if (checkboxClone.id === 'symbols-toggle') symbolsCheckbox = checkboxClone;
            }
        });
        
        // Заново прикрепляем обработчики к чекбоксам
        attachCheckboxHandlers();
        
        // Обновляем тексты блока с оценкой надежности
        if (strengthLabel) strengthLabel.textContent = getText('strengthLabel');
        
        // Если есть сгенерированный пароль, обновляем отображение его надежности
        if (passwordResult && passwordResult.textContent) {
            updateStrengthIndicator(passwordResult.textContent);
        }
    }
    
    // Функция обработки изменения языка
    function handleLanguageChange() {
        currentLanguage = localStorage.getItem('preferredLanguage') || 'ru';
        updateUITexts();
    }
    
    // Добавляем слушатель события изменения языка
    document.addEventListener('languageChanged', handleLanguageChange);

    // Применяем начальный язык
    updateUITexts();
    
    // Функция для переключения языка
    function switchLanguage(lang) {
        // Применяем выбранный язык
        currentLanguage = lang;
        localStorage.setItem('preferredLanguage', lang);
        
        // Обновляем UI
        updateUITexts();
        
        // Если на странице есть языковые элементы, обновляем их видимость
        if (hasLanguageElements) {
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
    }

    // Проверяем все элементы управления
    if (!closeBtn) console.warn('Кнопка закрытия не найдена!');
    if (!generateBtn) console.warn('Кнопка генерации не найдена!');
    if (!lengthSlider) console.warn('Слайдер длины пароля не найден!');
    
    // Установка начальных опций пароля
    if (lowercaseCheckbox) lowercaseCheckbox.checked = true;
    if (uppercaseCheckbox) uppercaseCheckbox.checked = true;
    if (numbersCheckbox) numbersCheckbox.checked = true;
    if (symbolsCheckbox) symbolsCheckbox.checked = false;

    // Прикрепляем обработчики событий к чекбоксам
    attachCheckboxHandlers();

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

    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            console.log('Генерируем пароль по клику на кнопку');
            
            // Добавляем класс для анимации кнопки
            this.classList.add('generating');
            
            // Показываем анимацию на элементе с паролем
            if (passwordResult) {
                passwordResult.classList.add('pulse');
            }
            
            // Генерируем пароль
            generatePassword();
            
            // Убираем классы анимации через короткое время
            setTimeout(() => {
                this.classList.remove('generating');
                if (passwordResult) {
                    passwordResult.classList.remove('pulse');
                }
            }, 500);
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', copyToClipboard);
    }

    // Слушатели для переключения языка
    if (ruLangBtn) {
        ruLangBtn.addEventListener('click', function() {
            switchLanguage('ru');
            
            // Создаем и диспатчим событие изменения языка
            const event = new CustomEvent('languageChanged', { detail: { language: 'ru' } });
            document.dispatchEvent(event);
        });
    }

    if (enLangBtn) {
        enLangBtn.addEventListener('click', function() {
            switchLanguage('en');
            
            // Создаем и диспатчим событие изменения языка
            const event = new CustomEvent('languageChanged', { detail: { language: 'en' } });
            document.dispatchEvent(event);
        });
    }

    // Функция генерации пароля
    function generatePassword() {
        console.log('Запущена функция generatePassword');
        
        // Повторная проверка/поиск элемента отображения пароля (на случай, если он был добавлен позже)
        if (!passwordResult) {
            passwordResult = document.getElementById('password-text') || 
                             document.getElementById('password-result') ||
                             document.querySelector('.password-text');
            console.log('Повторный поиск элемента для отображения пароля:', passwordResult);
        }
        
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
        console.log('Обновляем индикатор надежности пароля');
        
        if (!strengthBars || strengthBars.length === 0) {
            console.warn('Элементы индикатора надежности не найдены');
            // Ищем элементы индикатора надежности, если они еще не найдены
            const newStrengthBars = document.querySelectorAll('.strength-bar');
            if (newStrengthBars.length > 0) {
                console.log('Нашли элементы индикатора надежности:', newStrengthBars.length);
                // Используем найденные элементы
                strengthBars = newStrengthBars;
            } else {
                return;
            }
        }
        
        const strength = calculatePasswordStrength(password);
        console.log('Рассчитанная надежность пароля:', strength);
        
        // Сбросить все классы
        strengthBars.forEach(bar => {
            bar.classList.remove('weak', 'medium', 'strong');
            // Сбрасываем дополнительные стили
            bar.style.backgroundColor = '';
            bar.style.opacity = '0.3';
        });
        
        let strengthClass = '';
        let activeBars = 0;
        let barColor = '';
        let strengthKey = '';
        
        if (strength < 40) {
            strengthClass = 'weak';
            barColor = '#FF4D4D'; // Красный
            activeBars = 1;
            strengthKey = 'strengthText.veryWeak';
        } else if (strength < 60) {
            strengthClass = 'weak';
            barColor = '#FFA700'; // Оранжевый
            activeBars = 2;
            strengthKey = 'strengthText.weak';
        } else if (strength < 80) {
            strengthClass = 'medium';
            barColor = '#FFA700'; // Оранжевый
            activeBars = 3;
            strengthKey = 'strengthText.medium';
        } else if (strength < 90) {
            strengthClass = 'strong';
            barColor = '#43A047'; // Зеленый
            activeBars = 4;
            strengthKey = 'strengthText.strong';
        } else {
            strengthClass = 'strong';
            barColor = '#43A047'; // Зеленый
            activeBars = 5;
            strengthKey = 'strengthText.veryStrong';
        }
        
        console.log('Класс надежности пароля:', strengthClass, 'активных полосок:', activeBars);
        
        // Добавить соответствующий класс к активным полоскам
        for (let i = 0; i < activeBars && i < strengthBars.length; i++) {
            strengthBars[i].classList.add(strengthClass);
            strengthBars[i].style.backgroundColor = barColor;
            strengthBars[i].style.opacity = '1';
        }
        
        // Обновляем текст надежности, если есть соответствующий элемент
        if (strengthText) {
            strengthText.textContent = getText(strengthKey);
            strengthText.style.color = barColor;
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

    // Генерация пароля при загрузке
    generatePassword();
});