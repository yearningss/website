document.addEventListener('DOMContentLoaded', function() {
    // Проверяем наличие элементов генератора паролей на странице
    const passwordGenerator = document.getElementById('password-generator-tool');
    if (!passwordGenerator) return;
    
    // Получаем необходимые элементы
    const passwordDisplay = document.getElementById('password-display');
    const passwordText = document.getElementById('password-text');
    const copyBtn = document.getElementById('copy-btn');
    const copyNotification = document.getElementById('copy-notification');
    const generateBtn = document.getElementById('generate-btn');
    const lengthSlider = document.getElementById('length-slider');
    const lengthValue = document.getElementById('length-value');
    const uppercaseToggle = document.getElementById('uppercase-toggle');
    const lowercaseToggle = document.getElementById('lowercase-toggle');
    const numbersToggle = document.getElementById('numbers-toggle');
    const symbolsToggle = document.getElementById('symbols-toggle');
    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthLabel = document.getElementById('strength-label');
    const modalTitle = document.getElementById('modal-title');
    
    // Элементы модального окна
    const modal = document.getElementById('password-modal');
    const modalOpenBtns = document.querySelectorAll('.modal-open-btn');
    const modalClose = document.getElementById('modal-close');
    
    // Набор символов для генерации пароля
    const charSets = {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };
    
    // Переводы для элементов интерфейса
    const translations = {
        ru: {
            title: 'Генератор паролей',
            length: 'Длина:',
            uppercase: 'Заглавные буквы (A-Z)',
            lowercase: 'Строчные буквы (a-z)',
            numbers: 'Цифры (0-9)',
            symbols: 'Специальные символы (!@#$%^&*)',
            generate: 'Сгенерировать пароль',
            copy: 'Скопировано!',
            strengthLabels: ['Очень слабый', 'Слабый', 'Средний', 'Хороший', 'Сильный', 'Очень сильный']
        },
        en: {
            title: 'Password Generator',
            length: 'Length:',
            uppercase: 'Uppercase letters (A-Z)',
            lowercase: 'Lowercase letters (a-z)',
            numbers: 'Numbers (0-9)',
            symbols: 'Special characters (!@#$%^&*)',
            generate: 'Generate Password',
            copy: 'Copied!',
            strengthLabels: ['Very weak', 'Weak', 'Medium', 'Good', 'Strong', 'Very strong']
        }
    };
    
    // Инициализация значений
    let passwordLength = parseInt(lengthSlider.value);
    lengthValue.textContent = passwordLength;
    
    // Изменение длины пароля при перемещении ползунка
    lengthSlider.addEventListener('input', function() {
        passwordLength = parseInt(this.value);
        lengthValue.textContent = passwordLength;
        updateStrengthMeter();
    });
    
    // Открытие модального окна
    modalOpenBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const currentLang = localStorage.getItem('preferredLanguage') || 'ru';
            updateModalLanguage(currentLang);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Предотвращаем прокрутку страницы
        });
    });
    
    // Закрытие модального окна
    modalClose.addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Возвращаем прокрутку страницы
    });
    
    // Закрытие по клику вне модального окна
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Закрытие по нажатию Esc
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Обновление языка интерфейса модального окна
    function updateModalLanguage(lang) {
        const text = translations[lang];
        modalTitle.textContent = text.title;
        generateBtn.textContent = text.generate;
        copyNotification.textContent = text.copy;
        
        // Обновляем содержимое других элементов, если необходимо
        document.querySelector('.password-length span:first-child').textContent = text.length;
        const labels = document.querySelectorAll('.option-group label');
        labels[0].innerHTML = `<input type="checkbox" id="uppercase-toggle" ${uppercaseToggle.checked ? 'checked' : ''}> ${text.uppercase}`;
        labels[1].innerHTML = `<input type="checkbox" id="lowercase-toggle" ${lowercaseToggle.checked ? 'checked' : ''}> ${text.lowercase}`;
        labels[2].innerHTML = `<input type="checkbox" id="numbers-toggle" ${numbersToggle.checked ? 'checked' : ''}> ${text.numbers}`;
        labels[3].innerHTML = `<input type="checkbox" id="symbols-toggle" ${symbolsToggle.checked ? 'checked' : ''}> ${text.symbols}`;
        
        // После обновления текста переназначаем DOM-элементы
        const newUppercaseToggle = document.getElementById('uppercase-toggle');
        const newLowercaseToggle = document.getElementById('lowercase-toggle'); 
        const newNumbersToggle = document.getElementById('numbers-toggle');
        const newSymbolsToggle = document.getElementById('symbols-toggle');
        
        // Обновляем обработчики событий для новых элементов
        [newUppercaseToggle, newLowercaseToggle, newNumbersToggle, newSymbolsToggle].forEach(toggle => {
            toggle.addEventListener('change', updateStrengthMeter);
        });
    }
    
    // Функция генерации пароля
    function generatePassword() {
        // Проверяем, что хотя бы один тип символов выбран
        const upperToggle = document.getElementById('uppercase-toggle');
        const lowerToggle = document.getElementById('lowercase-toggle');
        const numToggle = document.getElementById('numbers-toggle');
        const symToggle = document.getElementById('symbols-toggle');
        
        if (!upperToggle.checked && !lowerToggle.checked && 
            !numToggle.checked && !symToggle.checked) {
            // Если ничего не выбрано, выбираем строчные буквы по умолчанию
            lowerToggle.checked = true;
        }
        
        let charset = '';
        if (upperToggle.checked) charset += charSets.uppercase;
        if (lowerToggle.checked) charset += charSets.lowercase;
        if (numToggle.checked) charset += charSets.numbers;
        if (symToggle.checked) charset += charSets.symbols;
        
        let password = '';
        let hasRequiredChars = false;
        
        // Генерируем пароль и проверяем, что в нем есть символы всех выбранных типов
        while (!hasRequiredChars) {
            password = '';
            for (let i = 0; i < passwordLength; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                password += charset[randomIndex];
            }
            
            // Проверяем наличие символов всех выбранных типов
            hasRequiredChars = true;
            
            if (upperToggle.checked && !/[A-Z]/.test(password)) {
                hasRequiredChars = false;
                continue;
            }
            
            if (lowerToggle.checked && !/[a-z]/.test(password)) {
                hasRequiredChars = false;
                continue;
            }
            
            if (numToggle.checked && !/[0-9]/.test(password)) {
                hasRequiredChars = false;
                continue;
            }
            
            if (symToggle.checked && !/[^A-Za-z0-9]/.test(password)) {
                hasRequiredChars = false;
                continue;
            }
        }
        
        return password;
    }
    
    // Копирование пароля в буфер обмена
    copyBtn.addEventListener('click', function() {
        const password = passwordText.textContent;
        navigator.clipboard.writeText(password).then(() => {
            copyNotification.classList.add('show');
            setTimeout(() => {
                copyNotification.classList.remove('show');
            }, 2000);
        });
    });
    
    // Генерация пароля по нажатию кнопки
    generateBtn.addEventListener('click', function() {
        const newPassword = generatePassword();
        passwordText.textContent = newPassword;
        updateStrengthMeter();
        
        // Добавляем анимацию для обновления пароля
        passwordDisplay.classList.add('pulse');
        setTimeout(() => {
            passwordDisplay.classList.remove('pulse');
        }, 300);
    });
    
    // Обновление индикатора силы пароля
    function updateStrengthMeter() {
        const password = passwordText.textContent;
        if (!password) {
            setStrength(0, 'Генерируйте пароль');
            return;
        }
        
        let strength = 0;
        
        // Длина пароля
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        
        // Разнообразие символов
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        // Бонус за длину
        if (password.length >= 16) strength += 1;
        
        // Максимальная оценка - 5
        strength = Math.min(5, Math.floor(strength/2));
        
        const currentLang = localStorage.getItem('preferredLanguage') || 'ru';
        const labels = translations[currentLang].strengthLabels;
        const colors = ['#ff4d4d', '#ffaa4d', '#ffff4d', '#4dff4d', '#4da6ff', '#8080ff'];
        
        setStrength(strength, labels[strength]);
        
        function setStrength(level, label) {
            strengthLabel.textContent = label;
            
            for (let i = 0; i < strengthBars.length; i++) {
                if (i < level) {
                    strengthBars[i].style.backgroundColor = colors[level - 1];
                } else {
                    strengthBars[i].style.backgroundColor = '#e2e8f0';
                }
            }
        }
    }
    
    // Обновление силы пароля при изменении параметров
    const toggles = [uppercaseToggle, lowercaseToggle, numbersToggle, symbolsToggle];
    toggles.forEach(toggle => {
        toggle.addEventListener('change', updateStrengthMeter);
    });
    
    // Генерируем начальный пароль
    const initialPassword = generatePassword();
    passwordText.textContent = initialPassword;
    updateStrengthMeter();
}); 