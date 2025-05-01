// Генератор паролей - исправленная версия
document.addEventListener('DOMContentLoaded', function() {
    console.log('Запуск исправленного генератора паролей');
    
    // Получаем информацию о языке из localStorage
    let currentLanguage = localStorage.getItem('preferredLanguage') || 'ru';
    console.log('Начальный язык генератора:', currentLanguage);
    
    // Обработчик события изменения языка
    document.addEventListener('languageChanged', function(event) {
        console.log('Получено событие изменения языка:', event);
        
        // Обновляем текущий язык
        if (event && event.detail && event.detail.language) {
            currentLanguage = event.detail.language;
            console.log('Язык изменен на:', currentLanguage);
            
            // Повторно вызываем функцию обновления индикатора с текущим паролем
            if (passwordDisplay && passwordDisplay.textContent) {
                updatePasswordStrength(passwordDisplay.textContent);
            }
        }
    });
    
    // Находим кнопку генерации пароля
    const generatePasswordBtn = document.getElementById('generate-password');
    if (!generatePasswordBtn) {
        console.error('Кнопка "Сгенерировать пароль" не найдена!');
        return;
    }
    
    // Находим элемент для отображения пароля
    const passwordDisplay = document.getElementById('password-result') || 
                           document.querySelector('.password-text') || 
                           document.querySelector('.password-display div');
    if (!passwordDisplay) {
        console.error('Элемент для отображения пароля не найден!');
        return;
    }
    
    // Находим индикаторы надежности пароля
    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthText = document.getElementById('strength-text') || document.querySelector('.strength-text');
    
    // Находим элементы управления
    let lengthSlider = document.getElementById('password-length');
    const lengthValue = document.getElementById('length-value');
    
    // Проверяем и логируем состояние элементов для диагностики
    console.log('Элемент для отображения длины пароля:', lengthValue);
    console.log('Ползунок для регулировки длины пароля:', lengthSlider);
    
    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    
    // Настройки пароля по умолчанию
    let passwordSettings = {
        length: lengthSlider ? parseInt(lengthSlider.value) : 12,
        uppercase: uppercaseCheckbox ? uppercaseCheckbox.checked : true,
        lowercase: lowercaseCheckbox ? lowercaseCheckbox.checked : true,
        numbers: numbersCheckbox ? numbersCheckbox.checked : true,
        symbols: symbolsCheckbox ? symbolsCheckbox.checked : false
    };
    
    // Принудительно устанавливаем начальное значение длины пароля
    if (lengthValue) {
        lengthValue.textContent = passwordSettings.length;
        console.log('Установлено начальное значение длины пароля:', passwordSettings.length);
    }
    
    // Функция для принудительного обновления значения длины в интерфейсе
    function updateLengthDisplay() {
        const currentLength = lengthSlider ? parseInt(lengthSlider.value) : 12;
        
        // Пробуем найти все возможные элементы для отображения длины
        const lengthValueElements = [
            document.getElementById('length-value'),
            document.querySelector('.length-value'),
            document.querySelector('.password-length span:last-child')
        ].filter(Boolean);
        
        console.log('Найдены элементы для отображения длины:', lengthValueElements.length);
        
        // Обновляем все найденные элементы
        lengthValueElements.forEach(element => {
            if (element) {
                element.textContent = currentLength;
                console.log('Обновлен элемент отображения длины:', element);
            }
        });
        
        // Обновляем настройки
        passwordSettings.length = currentLength;
    }
    
    // Вызываем функцию обновления значения длины при загрузке
    updateLengthDisplay();
    
    // Обновляем отображение длины пароля при перемещении ползунка
    if (lengthSlider) {
        // Удаляем все существующие обработчики событий
        const newSlider = lengthSlider.cloneNode(true);
        lengthSlider.parentNode.replaceChild(newSlider, lengthSlider);
        
        // Обновляем ссылку на ползунок
        lengthSlider = newSlider;
        
        // Добавляем новые обработчики событий
        lengthSlider.addEventListener('input', function() {
            const newLength = parseInt(this.value);
            updateLengthDisplay();
            generatePassword();
        });
        
        // Дополнительный обработчик для события change
        lengthSlider.addEventListener('change', function() {
            updateLengthDisplay();
        });
    }
    
    // Добавляем обработчики для чекбоксов
    if (uppercaseCheckbox) {
        uppercaseCheckbox.addEventListener('change', function() {
            passwordSettings.uppercase = this.checked;
            // Проверяем, что хотя бы один тип символов выбран
            ensureAtLeastOneCharType();
            generatePassword();
        });
    }
    
    if (lowercaseCheckbox) {
        lowercaseCheckbox.addEventListener('change', function() {
            passwordSettings.lowercase = this.checked;
            ensureAtLeastOneCharType();
            generatePassword();
        });
    }
    
    if (numbersCheckbox) {
        numbersCheckbox.addEventListener('change', function() {
            passwordSettings.numbers = this.checked;
            ensureAtLeastOneCharType();
            generatePassword();
        });
    }
    
    if (symbolsCheckbox) {
        symbolsCheckbox.addEventListener('change', function() {
            passwordSettings.symbols = this.checked;
            ensureAtLeastOneCharType();
            generatePassword();
        });
    }
    
    // Функция для проверки, что хотя бы один тип символов выбран
    function ensureAtLeastOneCharType() {
        if (!passwordSettings.uppercase && 
            !passwordSettings.lowercase && 
            !passwordSettings.numbers && 
            !passwordSettings.symbols) {
            
            // Если ничего не выбрано, включаем строчные буквы
            if (lowercaseCheckbox) {
                lowercaseCheckbox.checked = true;
                passwordSettings.lowercase = true;
            } else {
                // Или любой другой доступный тип
                if (uppercaseCheckbox) {
                    uppercaseCheckbox.checked = true;
                    passwordSettings.uppercase = true;
                } else if (numbersCheckbox) {
                    numbersCheckbox.checked = true;
                    passwordSettings.numbers = true;
                } else if (symbolsCheckbox) {
                    symbolsCheckbox.checked = true;
                    passwordSettings.symbols = true;
                }
            }
            
            alert('Необходимо выбрать хотя бы один тип символов!');
        }
    }
    
    // Улучшенный генератор случайных чисел для большей безопасности
    function secureRandom() {
        let array = new Uint32Array(1);
        if (window.crypto && window.crypto.getRandomValues) {
            window.crypto.getRandomValues(array);
        } else {
            array[0] = Math.floor(Math.random() * 4294967296);
        }
        return array[0] / 4294967296;
    }
    
    // Добавляем обработчик для кнопки генерации пароля с предотвращением дублирования
    const originalBtn = generatePasswordBtn;
    if (originalBtn._hasClickHandler) {
        console.log('Кнопка уже имеет обработчик, не добавляем новый');
    } else {
        originalBtn._hasClickHandler = true;
        
        originalBtn.addEventListener('click', function(e) {
            console.log('Нажата кнопка генерации пароля');
            e.preventDefault();
            e.stopPropagation();
            
            // Добавляем класс для анимации
            this.classList.add('generating');
            
            // Добавляем анимацию для элемента с паролем
            if (passwordDisplay) {
                passwordDisplay.classList.add('pulse');
            }
            
            // Генерируем пароль
            generatePassword();
            
            // Убираем классы анимации через короткое время
            setTimeout(() => {
                this.classList.remove('generating');
                if (passwordDisplay) {
                    passwordDisplay.classList.remove('pulse');
                }
            }, 500);
            
            return false;
        });
    }
    
    // Функция для генерации пароля с использованием более безопасного генератора случайных чисел
    function generatePassword() {
        console.log('Запущена функция генерации пароля');
        
        // Получаем набор символов
        let charset = '';
        if (passwordSettings.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (passwordSettings.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (passwordSettings.numbers) charset += '0123456789';
        if (passwordSettings.symbols) charset += '!@#$%^&*()-_=+[]{}|;:\'",.<>/?`~';
        
        if (charset.length === 0) {
            console.error('Пустой набор символов!');
            charset = 'abcdefghijklmnopqrstuvwxyz'; // Запасной вариант
        }
        
        // Генерируем пароль с обеспечением наличия всех выбранных типов символов
        let password = '';
        
        // Сначала добавляем по одному символу каждого типа, чтобы гарантировать их наличие
        if (passwordSettings.uppercase) {
            const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            password += uppercaseChars.charAt(Math.floor(secureRandom() * uppercaseChars.length));
        }
        
        if (passwordSettings.lowercase) {
            const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
            password += lowercaseChars.charAt(Math.floor(secureRandom() * lowercaseChars.length));
        }
        
        if (passwordSettings.numbers) {
            const numberChars = '0123456789';
            password += numberChars.charAt(Math.floor(secureRandom() * numberChars.length));
        }
        
        if (passwordSettings.symbols) {
            const symbolChars = '!@#$%^&*()-_=+[]{}|;:\'",.<>/?`~';
            password += symbolChars.charAt(Math.floor(secureRandom() * symbolChars.length));
        }
        
        // Затем добавляем случайные символы до достижения нужной длины
        while (password.length < passwordSettings.length) {
            const randomIndex = Math.floor(secureRandom() * charset.length);
            password += charset.charAt(randomIndex);
        }
        
        // Перемешиваем символы в пароле для большей безопасности
        password = shuffleString(password);
        
        // Устанавливаем пароль в элемент
        passwordDisplay.textContent = password;
        console.log('Сгенерирован пароль длиной:', password.length);
        
        // Обновляем индикатор надежности
        updatePasswordStrength(password);
        
        return password;
    }
    
    // Функция для перемешивания строки (алгоритм Фишера-Йетса)
    function shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(secureRandom() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }
    
    // Функция для проверки текущего языка интерфейса
    function getCurrentLanguage() {
        // 1. Проверяем localStorage
        const storedLang = localStorage.getItem('preferredLanguage');
        if (storedLang) {
            console.log('Язык из localStorage:', storedLang);
            return storedLang;
        }
        
        // 2. Проверяем активные классы языковых кнопок
        const enButton = document.getElementById('btn-en');
        const ruButton = document.getElementById('btn-ru');
        
        if (enButton && enButton.classList.contains('active')) {
            console.log('Язык по активной кнопке: en');
            return 'en';
        }
        
        if (ruButton && ruButton.classList.contains('active')) {
            console.log('Язык по активной кнопке: ru');
            return 'ru';
        }
        
        // 3. Проверяем видимость языковых блоков
        const enContent = document.getElementById('content-en');
        const ruContent = document.getElementById('content-ru');
        
        if (enContent && getComputedStyle(enContent).display !== 'none') {
            console.log('Язык по видимому контенту: en');
            return 'en';
        }
        
        // По умолчанию возвращаем русский
        console.log('Используем язык по умолчанию: ru');
        return 'ru';
    }
    
    // Функция для обновления индикатора надежности
    function updatePasswordStrength(password) {
        if (!strengthBars || !strengthBars.length) return;
        
        // Оцениваем надежность пароля
        let score = 0;
        
        // Длина (до 40 баллов)
        score += Math.min(password.length * 3, 40);
        
        // Типы символов (до 60 баллов)
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSymbols = /[!@#$%^&*()-_=+[\]{}|;:'",.<>/?`~]/.test(password);
        
        if (hasUppercase) score += 10;
        if (hasLowercase) score += 10;
        if (hasNumbers) score += 15;
        if (hasSymbols) score += 25;
        
        // Сложность комбинации
        const typeCount = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;
        if (typeCount > 2) {
            score += (typeCount - 2) * 10;
        }
        
        // Сбрасываем стили индикатора
        strengthBars.forEach(bar => {
            bar.classList.remove('weak', 'medium', 'strong');
            bar.style.backgroundColor = '';
            bar.style.opacity = '0.3';
        });
        
        // Определяем класс надежности и количество активных полосок
        let strengthClass, barColor, strengthMessage;
        let activeBars = 0;
        
        // Определяем текущий язык
        const currentLang = getCurrentLanguage();
        console.log('Текущий язык при обновлении индикатора:', currentLang);
        
        // Строки для всех уровней надежности пароля на русском и английском
        const strengthTexts = {
            en: {
                veryWeak: 'Very Weak',
                weak: 'Weak',
                medium: 'Medium',
                strong: 'Strong',
                veryStrong: 'Very Strong'
            },
            ru: {
                veryWeak: 'Очень слабый',
                weak: 'Слабый',
                medium: 'Средний',
                strong: 'Сильный',
                veryStrong: 'Очень сильный'
            }
        };
        
        // Определяем тексты для текущего языка
        const texts = strengthTexts[currentLang] || strengthTexts.ru;
        
        if (score < 40) {
            strengthClass = 'weak';
            barColor = '#FF4D4D'; // Красный
            activeBars = 1;
            strengthMessage = texts.veryWeak;
        } else if (score < 60) {
            strengthClass = 'weak';
            barColor = '#FFA700'; // Оранжевый
            activeBars = 2;
            strengthMessage = texts.weak;
        } else if (score < 80) {
            strengthClass = 'medium';
            barColor = '#FFA700'; // Оранжевый
            activeBars = 3;
            strengthMessage = texts.medium;
        } else if (score < 90) {
            strengthClass = 'strong';
            barColor = '#43A047'; // Зеленый
            activeBars = 4;
            strengthMessage = texts.strong;
        } else {
            strengthClass = 'strong';
            barColor = '#43A047'; // Зеленый
            activeBars = 5;
            strengthMessage = texts.veryStrong;
            console.log('Максимальная надежность пароля, текст:', strengthMessage);
        }
        
        // Применяем стили к активным полоскам
        for (let i = 0; i < activeBars && i < strengthBars.length; i++) {
            strengthBars[i].classList.add(strengthClass);
            strengthBars[i].style.backgroundColor = barColor;
            strengthBars[i].style.opacity = '1';
        }
        
        // Обновляем текст надежности
        if (strengthText) {
            console.log('Устанавливаем текст надежности:', strengthMessage);
            strengthText.textContent = strengthMessage;
            strengthText.style.color = barColor;
        }
    }
    
    // Настраиваем копирование пароля
    const copyButton = document.getElementById('copy-password');
    const copyNotification = document.getElementById('copy-notification');
    
    if (copyButton) {
        copyButton.addEventListener('click', function() {
            const password = passwordDisplay.textContent;
            if (!password) return;
            
            navigator.clipboard.writeText(password)
                .then(() => {
                    if (copyNotification) {
                        copyNotification.classList.add('show');
                        setTimeout(() => {
                            copyNotification.classList.remove('show');
                        }, 2000);
                    }
                })
                .catch(err => {
                    console.error('Ошибка при копировании пароля:', err);
                    alert('Не удалось скопировать пароль');
                });
        });
    }
    
    // Функция для немедленного обновления значения слайдера и пересчета пароля
    function forceUIUpdate() {
        // Обновляем значение длины
        updateLengthDisplay();
        
        // Перегенерируем пароль если он уже был создан
        if (passwordDisplay && passwordDisplay.textContent) {
            generatePassword();
        }
    }
    
    // Добавляем глобальный обработчик события изменения языка
    document.addEventListener('languageChanged', function(event) {
        console.log('Обнаружено переключение языка, обновляем интерфейс');
        
        // Немного задержки, чтобы дать время на обновление localStorage
        setTimeout(() => {
            // Если уже есть сгенерированный пароль, обновляем оценку надежности
            if (passwordDisplay && passwordDisplay.textContent) {
                updatePasswordStrength(passwordDisplay.textContent);
            }
            
            // Принудительно обновляем все элементы интерфейса
            forceUIUpdate();
        }, 100);
    });
    
    // Начальная инициализация
    forceUIUpdate();
}); 