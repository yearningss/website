document.addEventListener('DOMContentLoaded', function() {
    // Проверяем наличие элементов генератора паролей на странице
    const passwordGenerator = document.getElementById('password-generator');
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
    
    // Набор символов для генерации пароля
    const charSets = {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
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
    
    // Функция генерации пароля
    function generatePassword() {
        // Проверяем, что хотя бы один тип символов выбран
        if (!uppercaseToggle.checked && !lowercaseToggle.checked && 
            !numbersToggle.checked && !symbolsToggle.checked) {
            // Если ничего не выбрано, выбираем строчные буквы по умолчанию
            lowercaseToggle.checked = true;
        }
        
        let charset = '';
        if (uppercaseToggle.checked) charset += charSets.uppercase;
        if (lowercaseToggle.checked) charset += charSets.lowercase;
        if (numbersToggle.checked) charset += charSets.numbers;
        if (symbolsToggle.checked) charset += charSets.symbols;
        
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
            
            if (uppercaseToggle.checked && !/[A-Z]/.test(password)) {
                hasRequiredChars = false;
                continue;
            }
            
            if (lowercaseToggle.checked && !/[a-z]/.test(password)) {
                hasRequiredChars = false;
                continue;
            }
            
            if (numbersToggle.checked && !/[0-9]/.test(password)) {
                hasRequiredChars = false;
                continue;
            }
            
            if (symbolsToggle.checked && !/[^A-Za-z0-9]/.test(password)) {
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
        
        const labels = ['Очень слабый', 'Слабый', 'Средний', 'Хороший', 'Сильный', 'Очень сильный'];
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