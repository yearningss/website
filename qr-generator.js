document.addEventListener('DOMContentLoaded', function() {
    // Элементы интерфейса QR-генератора
    const qrModal = document.getElementById('qr-modal');
    const closeQrModalBtn = document.getElementById('qr-modal-close');
    const tabsContainer = document.getElementById('qr-tabs');
    const tabButtons = tabsContainer ? tabsContainer.querySelectorAll('.tab') : [];
    const tabContents = document.querySelectorAll('.tab-content');
    const generateQrBtn = document.getElementById('generate-qr-btn');
    const downloadQrBtn = document.getElementById('qr-download-btn');
    const qrResult = document.getElementById('qr-result');
    
    // Параметры QR-кода
    const qrSize = document.getElementById('qr-size');
    const qrColor = document.getElementById('qr-color');
    const qrBackground = document.getElementById('qr-background');
    const qrErrorCorrection = document.getElementById('qr-error-correction');
    
    // Предпросмотр цветов
    const qrColorPreview = document.getElementById('qr-color-preview');
    const qrBgPreview = document.getElementById('qr-bg-preview');
    
    // Объект для хранения текущего QR-кода
    let currentQrCode = null;

    // Инициализация переключения вкладок
    if (tabButtons.length > 0) {
        tabButtons.forEach(tab => {
            tab.addEventListener('click', () => {
                // Удаляем активный класс со всех вкладок
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Добавляем активный класс выбранной вкладке
                tab.classList.add('active');
                
                // Показываем соответствующий контент
                const type = tab.getAttribute('data-type');
                document.getElementById(`${type}-content`).classList.add('active');
            });
        });
    }
    
    // Обработчики для предпросмотра цветов
    if (qrColor && qrColorPreview) {
        qrColor.addEventListener('input', function() {
            qrColorPreview.style.backgroundColor = this.value;
        });
    }
    
    if (qrBackground && qrBgPreview) {
        qrBackground.addEventListener('input', function() {
            qrBgPreview.style.backgroundColor = this.value;
        });
    }
    
    // Закрытие модального окна
    if (closeQrModalBtn && qrModal) {
        closeQrModalBtn.addEventListener('click', function() {
            qrModal.classList.remove('active');
        });
        
        // Закрытие модального окна по клику вне его содержимого
        window.addEventListener('click', function(event) {
            if (event.target === qrModal) {
                qrModal.classList.remove('active');
            }
        });
    }
    
    // Функция для создания QR-кода
    function generateQrCode() {
        // Очищаем контейнер
        if (qrResult) {
            qrResult.innerHTML = '';
            
            // Получаем текущую активную вкладку
            const activeTab = document.querySelector('.tab.active');
            if (!activeTab) return;
            
            const type = activeTab.getAttribute('data-type');
            let qrData = '';
            
            // Формируем данные в зависимости от типа QR-кода
            switch (type) {
                case 'url':
                    const urlInput = document.getElementById('qr-url');
                    qrData = urlInput.value.trim();
                    if (!qrData) {
                        alert('Пожалуйста, введите URL');
                        return;
                    }
                    break;
                    
                case 'text':
                    const textInput = document.getElementById('qr-text');
                    qrData = textInput.value.trim();
                    if (!qrData) {
                        alert('Пожалуйста, введите текст');
                        return;
                    }
                    break;
                    
                case 'email':
                    const emailInput = document.getElementById('qr-email');
                    const subjectInput = document.getElementById('qr-email-subject');
                    const bodyInput = document.getElementById('qr-email-body');
                    
                    const email = emailInput.value.trim();
                    const subject = subjectInput.value.trim();
                    const body = bodyInput.value.trim();
                    
                    if (!email) {
                        alert('Пожалуйста, введите email');
                        return;
                    }
                    
                    qrData = `mailto:${email}`;
                    if (subject || body) {
                        qrData += '?';
                        if (subject) qrData += `subject=${encodeURIComponent(subject)}`;
                        if (subject && body) qrData += '&';
                        if (body) qrData += `body=${encodeURIComponent(body)}`;
                    }
                    break;
                    
                case 'phone':
                    const phoneInput = document.getElementById('qr-phone');
                    const phone = phoneInput.value.trim();
                    
                    if (!phone) {
                        alert('Пожалуйста, введите номер телефона');
                        return;
                    }
                    
                    qrData = `tel:${phone.replace(/\D/g, '')}`;
                    break;
                    
                case 'sms':
                    const smsPhoneInput = document.getElementById('qr-sms-phone');
                    const smsMessageInput = document.getElementById('qr-sms-message');
                    
                    const smsPhone = smsPhoneInput.value.trim();
                    const smsMessage = smsMessageInput.value.trim();
                    
                    if (!smsPhone) {
                        alert('Пожалуйста, введите номер телефона');
                        return;
                    }
                    
                    qrData = `smsto:${smsPhone.replace(/\D/g, '')}`;
                    if (smsMessage) {
                        qrData += `:${encodeURIComponent(smsMessage)}`;
                    }
                    break;
                    
                case 'vcard':
                    const nameInput = document.getElementById('qr-vcard-name');
                    const orgInput = document.getElementById('qr-vcard-org');
                    const vcardPhoneInput = document.getElementById('qr-vcard-phone');
                    const vcardEmailInput = document.getElementById('qr-vcard-email');
                    const addressInput = document.getElementById('qr-vcard-address');
                    const websiteInput = document.getElementById('qr-vcard-website');
                    
                    const name = nameInput.value.trim();
                    if (!name) {
                        alert('Пожалуйста, введите имя');
                        return;
                    }
                    
                    // Формируем vCard
                    qrData = 'BEGIN:VCARD\nVERSION:3.0\n';
                    
                    // Разделяем имя на части (предполагается формат "Фамилия Имя")
                    const nameParts = name.split(' ');
                    if (nameParts.length >= 2) {
                        qrData += `N:${nameParts[0]};${nameParts.slice(1).join(' ')};;;\n`;
                    } else {
                        qrData += `N:${name};;;;\n`;
                    }
                    
                    qrData += `FN:${name}\n`;
                    
                    if (orgInput.value.trim()) {
                        qrData += `ORG:${orgInput.value.trim()}\n`;
                    }
                    
                    if (vcardPhoneInput.value.trim()) {
                        qrData += `TEL:${vcardPhoneInput.value.trim()}\n`;
                    }
                    
                    if (vcardEmailInput.value.trim()) {
                        qrData += `EMAIL:${vcardEmailInput.value.trim()}\n`;
                    }
                    
                    if (addressInput.value.trim()) {
                        qrData += `ADR:;;${addressInput.value.trim()};;;;\n`;
                    }
                    
                    if (websiteInput.value.trim()) {
                        qrData += `URL:${websiteInput.value.trim()}\n`;
                    }
                    
                    qrData += 'END:VCARD';
                    break;
                    
                case 'wifi':
                    const ssidInput = document.getElementById('qr-wifi-name');
                    const passwordInput = document.getElementById('qr-wifi-password');
                    const typeSelect = document.getElementById('qr-wifi-type');
                    const hiddenCheckbox = document.getElementById('qr-wifi-hidden');
                    
                    const ssid = ssidInput.value.trim();
                    const password = passwordInput.value.trim();
                    const encType = typeSelect.value;
                    const hidden = hiddenCheckbox.checked;
                    
                    if (!ssid) {
                        alert('Пожалуйста, введите имя сети (SSID)');
                        return;
                    }
                    
                    qrData = 'WIFI:';
                    qrData += `S:${ssid};`;
                    qrData += `T:${encType};`;
                    
                    if (password && encType !== 'nopass') {
                        qrData += `P:${password};`;
                    }
                    
                    if (hidden) {
                        qrData += 'H:true;';
                    }
                    
                    qrData += ';';
                    break;
                    
                case 'geo':
                    const latInput = document.getElementById('qr-geo-latitude');
                    const lonInput = document.getElementById('qr-geo-longitude');
                    
                    const lat = latInput.value.trim();
                    const lon = lonInput.value.trim();
                    
                    if (!lat || !lon) {
                        alert('Пожалуйста, введите координаты');
                        return;
                    }
                    
                    qrData = `geo:${lat},${lon}`;
                    break;
                
                default:
                    alert('Пожалуйста, выберите тип QR-кода');
                    return;
            }
            
            // Получаем параметры QR-кода
            const size = parseInt(qrSize.value) || 200;
            const color = qrColor.value || '#000000';
            const bgColor = qrBackground.value || '#FFFFFF';
            const errorLevel = qrErrorCorrection.value || 'M';
            
            // Проверяем длину данных
            const maxQRLength = getMaxLengthForErrorLevel(errorLevel, getDataType(qrData));
            if (qrData.length > maxQRLength) {
                showError(`Данные слишком длинные для QR-кода (${qrData.length} символов, максимум ${maxQRLength})`);
                
                // Если это текст или vCard, предлагаем использовать разные уровни коррекции или разделить данные
                if (type === 'text' || type === 'vcard') {
                    const optimizedErrorLevel = suggestErrorLevel(qrData.length);
                    if (optimizedErrorLevel) {
                        showInfo(`Попробуйте установить уровень коррекции ошибок '${optimizedErrorLevel}' для больших данных`);
                        // Добавляем кнопку для автоматического изменения уровня коррекции
                        addActionButton(`Изменить уровень на '${optimizedErrorLevel}'`, () => {
                            if (qrErrorCorrection) {
                                qrErrorCorrection.value = optimizedErrorLevel;
                                generateQrCode();
                            }
                        });
                    } else {
                        showInfo("Данные слишком длинные для одного QR-кода");
                        // Предлагаем автоматически разделить данные
                        addActionButton("Разделить на несколько QR-кодов", () => {
                            splitAndGenerateQRCodes(qrData, type);
                        });
                    }
                } else {
                    showInfo("Попробуйте сократить данные или снизить уровень коррекции ошибок");
                }
                return;
            }
            
            // Создаем QR-код, если библиотека доступна
            if (typeof QRCode !== 'undefined') {
                try {
                    // Если QR-код уже существует, уничтожаем его
                    if (currentQrCode) {
                        qrResult.innerHTML = '';
                    }
                    
                    // Обертываем создание QR-кода в блок try-catch для обработки ошибок
                    try {
                        // Создаем новый QR-код
                        currentQrCode = new QRCode(qrResult, {
                            text: qrData,
                            width: size,
                            height: size,
                            colorDark: color,
                            colorLight: bgColor,
                            correctLevel: getQRErrorCorrectionLevel(errorLevel)
                        });
                        
                        // Показываем кнопку загрузки
                        if (downloadQrBtn) {
                            downloadQrBtn.style.display = 'inline-block';
                        }
                        
                        clearMessages();
                        console.log('QR-код успешно создан:', qrData);
                    } catch (error) {
                        handleQRCodeError(error, qrData, type);
                    }
                } catch (error) {
                    console.error('Ошибка при создании QR-кода:', error);
                    showError(`Ошибка при создании QR-кода: ${error.message}`);
                }
            } else {
                console.error('Библиотека QRCode не найдена');
                showError('Библиотека QRCode не загружена');
            }
        }
    }
    
    // Функция для обработки ошибок QR-кода
    function handleQRCodeError(error, data, type) {
        console.error('Ошибка при создании QR-кода:', error);
        
        if (error.message.includes('too long')) {
            // Обработка ошибки "Too long data"
            showError('Данные слишком длинные для QR-кода');
            
            // Предложение решений в зависимости от типа QR-кода
            if (type === 'text' || type === 'vcard') {
                showInfo('Попробуйте сократить контент или разделить данные на несколько QR-кодов');
            } else if (type === 'wifi' && data.includes('P:')) {
                showInfo('Попробуйте использовать более короткий пароль WiFi');
            } else {
                showInfo('Сократите информацию или удалите необязательные поля');
            }
            
            // Предложение изменить уровень коррекции
            showInfo('Также можно попробовать снизить уровень коррекции ошибок до "L" для увеличения емкости QR-кода');
        } else {
            showError(`Ошибка при создании QR-кода: ${error.message}`);
        }
    }
    
    // Функция для определения типа данных
    function getDataType(data) {
        if (data.startsWith('http') || data.startsWith('www')) return 'alphanumeric';
        if (data.startsWith('BEGIN:VCARD')) return 'binary';
        if (data.startsWith('WIFI:')) return 'binary';
        if (data.startsWith('mailto:')) return 'alphanumeric';
        if (data.startsWith('tel:') || data.startsWith('sms:') || data.startsWith('geo:')) return 'numeric';
        if (/^[0-9]+$/.test(data)) return 'numeric';
        if (/^[0-9A-Z $%*+\-./:]+$/.test(data)) return 'alphanumeric';
        return 'binary';
    }
    
    // Функция для получения максимальной длины данных для QR-кода в зависимости от уровня коррекции ошибок
    function getMaxLengthForErrorLevel(errorLevel, dataType) {
        // Приблизительные максимальные длины для разных типов данных и уровней коррекции
        const maxLengths = {
            L: { // Низкий уровень коррекции (7%)
                numeric: 7089,
                alphanumeric: 4296,
                binary: 2953
            },
            M: { // Средний уровень коррекции (15%)
                numeric: 5596,
                alphanumeric: 3391,
                binary: 2331
            },
            Q: { // Средне-высокий уровень коррекции (25%)
                numeric: 3993,
                alphanumeric: 2420,
                binary: 1663
            },
            H: { // Высокий уровень коррекции (30%)
                numeric: 3057,
                alphanumeric: 1852,
                binary: 1273
            }
        };
        
        return maxLengths[errorLevel][dataType] || 1000; // По умолчанию возвращаем безопасное значение
    }
    
    // Функция для предложения оптимального уровня коррекции ошибок
    function suggestErrorLevel(dataLength) {
        if (dataLength <= 1273) return 'H'; // Высокий уровень коррекции
        if (dataLength <= 1663) return 'Q'; // Средне-высокий уровень
        if (dataLength <= 2331) return 'M'; // Средний уровень
        if (dataLength <= 2953) return 'L'; // Низкий уровень
        return null; // Данные слишком длинные для любого уровня
    }
    
    // Функция для отображения ошибки
    function showError(message) {
        const errorElement = document.createElement('p');
        errorElement.className = 'qr-error';
        errorElement.textContent = message;
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontWeight = 'bold';
        
        if (qrResult) {
            qrResult.appendChild(errorElement);
        }
    }
    
    // Функция для отображения информационного сообщения
    function showInfo(message) {
        const infoElement = document.createElement('p');
        infoElement.className = 'qr-info';
        infoElement.textContent = message;
        infoElement.style.color = '#3498db';
        
        if (qrResult) {
            qrResult.appendChild(infoElement);
        }
    }
    
    // Функция для очистки сообщений
    function clearMessages() {
        if (qrResult) {
            const messages = qrResult.querySelectorAll('.qr-error, .qr-info');
            messages.forEach(msg => msg.remove());
        }
    }
    
    // Функция для скачивания QR-кода
    function downloadQrCode() {
        const qrImage = qrResult.querySelector('img');
        if (qrImage) {
            // Создаем временную ссылку для скачивания
            const link = document.createElement('a');
            
            // Получаем активную вкладку для именования файла
            const activeTab = document.querySelector('.tab.active');
            const type = activeTab ? activeTab.getAttribute('data-type') : 'qrcode';
            
            link.download = `qrcode-${type}-${new Date().toISOString().slice(0, 10)}.png`;
            link.href = qrImage.src;
            document.body.appendChild(link);
            
            // Имитируем клик для скачивания
            link.click();
            
            // Удаляем временную ссылку
            document.body.removeChild(link);
        } else {
            alert('Сначала нужно сгенерировать QR-код');
        }
    }
    
    // Обработчик события для кнопки генерации QR-кода
    if (generateQrBtn) {
        generateQrBtn.addEventListener('click', generateQrCode);
    }
    
    // Обработчик события для кнопки скачивания QR-кода
    if (downloadQrBtn) {
        downloadQrBtn.addEventListener('click', downloadQrCode);
        
        // По умолчанию скрываем кнопку скачивания, пока не будет создан QR-код
        downloadQrBtn.style.display = 'none';
    }
    
    // Инициализация цветов предпросмотра
    if (qrColorPreview && qrColor) {
        qrColorPreview.style.backgroundColor = qrColor.value;
    }
    
    if (qrBgPreview && qrBackground) {
        qrBgPreview.style.backgroundColor = qrBackground.value;
    }
    
    // Обработчик событий изменения размера QR-кода
    if (qrSize) {
        qrSize.addEventListener('input', function() {
            // Обновляем размер только если QR-код уже был создан и есть что перегенерировать
            if (currentQrCode && qrResult.querySelector('img')) {
                generateQrCode();
            }
        });
    }
    
    // Обработчики событий для изменения цветов и уровня коррекции ошибок
    if (qrColor) {
        qrColor.addEventListener('change', function() {
            if (currentQrCode && qrResult.querySelector('img')) {
                generateQrCode();
            }
        });
    }
    
    if (qrBackground) {
        qrBackground.addEventListener('change', function() {
            if (currentQrCode && qrResult.querySelector('img')) {
                generateQrCode();
            }
        });
    }
    
    if (qrErrorCorrection) {
        qrErrorCorrection.addEventListener('change', function() {
            if (currentQrCode && qrResult.querySelector('img')) {
                generateQrCode();
            }
        });
    }
    
    // Функция для добавления кнопки действия под сообщением об ошибке
    function addActionButton(buttonText, callback) {
        const buttonElement = document.createElement('button');
        buttonElement.className = 'qr-action-btn';
        buttonElement.textContent = buttonText;
        buttonElement.style.backgroundColor = '#3498db';
        buttonElement.style.color = '#fff';
        buttonElement.style.border = 'none';
        buttonElement.style.borderRadius = '4px';
        buttonElement.style.padding = '8px 12px';
        buttonElement.style.margin = '10px 0';
        buttonElement.style.cursor = 'pointer';
        
        buttonElement.addEventListener('click', callback);
        
        if (qrResult) {
            qrResult.appendChild(buttonElement);
        }
    }
    
    // Функция для разделения больших данных на несколько QR-кодов
    function splitAndGenerateQRCodes(data, type) {
        // Очищаем контейнер
        qrResult.innerHTML = '';
        
        // Определяем максимальную длину для низкого уровня коррекции
        const chunkSize = getMaxLengthForErrorLevel('L', getDataType(data)) - 50; // Оставляем запас
        
        // Разбиваем данные на части
        const chunks = [];
        
        // Для текста разбиваем по границам слов, если возможно
        if (type === 'text') {
            let currentChunk = '';
            const words = data.split(' ');
            
            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                const potentialChunk = currentChunk ? currentChunk + ' ' + word : word;
                
                if (potentialChunk.length <= chunkSize) {
                    currentChunk = potentialChunk;
                } else {
                    if (currentChunk) {
                        chunks.push(currentChunk);
                        currentChunk = word;
                    } else {
                        // Если одно слово слишком длинное, разбиваем его
                        for (let j = 0; j < word.length; j += chunkSize) {
                            chunks.push(word.substr(j, chunkSize));
                        }
                    }
                }
            }
            
            if (currentChunk) {
                chunks.push(currentChunk);
            }
        } 
        // Для vCard разбиваем по строкам
        else if (type === 'vcard') {
            // Парсим vCard для более умного разделения
            const lines = data.split('\n');
            let header = 'BEGIN:VCARD\nVERSION:3.0\n';
            let footer = 'END:VCARD';
            
            // Извлекаем основные данные (имя, организация)
            let essentials = [];
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('N:') || lines[i].startsWith('FN:') || lines[i].startsWith('ORG:')) {
                    essentials.push(lines[i]);
                }
            }
            
            // Группируем остальные поля
            let otherFields = lines.filter(line => 
                !line.startsWith('BEGIN:') && 
                !line.startsWith('VERSION:') && 
                !line.startsWith('END:') && 
                !essentials.includes(line)
            );
            
            // Создаем первую часть с основной информацией
            let currentCard = header + essentials.join('\n') + '\n';
            
            // Добавляем остальные поля до предела размера
            for (let i = 0; i < otherFields.length; i++) {
                const field = otherFields[i];
                if ((currentCard + field + '\n' + footer).length <= chunkSize) {
                    currentCard += field + '\n';
                } else {
                    // Добавляем текущую часть и начинаем новую
                    chunks.push(currentCard + footer);
                    currentCard = header + essentials.join('\n') + '\n' + field + '\n';
                }
            }
            
            // Добавляем последнюю часть
            if (currentCard !== header) {
                chunks.push(currentCard + footer);
            }
        }
        // Для других типов данных просто разбиваем на части
        else {
            for (let i = 0; i < data.length; i += chunkSize) {
                chunks.push(data.substr(i, chunkSize));
            }
        }
        
        // Показываем информацию о количестве частей
        showInfo(`Данные разделены на ${chunks.length} QR-кода. Переключайтесь между ними с помощью кнопок ниже:`);
        
        // Создаем контейнер для QR-кодов и навигации
        const qrContainer = document.createElement('div');
        qrContainer.className = 'qr-split-container';
        qrContainer.style.textAlign = 'center';
        
        // Создаем контейнер для текущего QR-кода
        const currentQrContainer = document.createElement('div');
        currentQrContainer.className = 'qr-current-container';
        currentQrContainer.style.margin = '15px 0';
        
        // Добавляем индикатор текущей части
        const partIndicator = document.createElement('div');
        partIndicator.className = 'qr-part-indicator';
        partIndicator.style.margin = '10px 0';
        partIndicator.style.fontWeight = 'bold';
        
        // Создаем навигационные кнопки
        const navContainer = document.createElement('div');
        navContainer.className = 'qr-nav-container';
        navContainer.style.display = 'flex';
        navContainer.style.justifyContent = 'center';
        navContainer.style.gap = '10px';
        navContainer.style.margin = '10px 0';
        
        // Добавляем кнопки для навигации между частями
        let currentPartIndex = 0;
        
        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Предыдущий';
        prevBtn.className = 'qr-nav-btn prev';
        prevBtn.style.padding = '8px 12px';
        prevBtn.style.backgroundColor = '#e0e0e0';
        prevBtn.style.border = 'none';
        prevBtn.style.borderRadius = '4px';
        prevBtn.style.cursor = 'pointer';
        
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Следующий';
        nextBtn.className = 'qr-nav-btn next';
        nextBtn.style.padding = '8px 12px';
        nextBtn.style.backgroundColor = '#e0e0e0';
        nextBtn.style.border = 'none';
        nextBtn.style.borderRadius = '4px';
        nextBtn.style.cursor = 'pointer';
        
        // Функция для обновления отображаемого QR-кода
        function updateCurrentQRCode() {
            currentQrContainer.innerHTML = '';
            partIndicator.textContent = `Часть ${currentPartIndex + 1} из ${chunks.length}`;
            
            // Получаем текущие параметры QR-кода
            const size = parseInt(qrSize.value) || 200;
            const color = qrColor.value || '#000000';
            const bgColor = qrBackground.value || '#FFFFFF';
            
            // Используем низкий уровень коррекции для максимальной емкости
            try {
                new QRCode(currentQrContainer, {
                    text: chunks[currentPartIndex],
                    width: size,
                    height: size,
                    colorDark: color,
                    colorLight: bgColor,
                    correctLevel: QRCode.CorrectLevel.L
                });
                
                // Обновляем состояние кнопок
                prevBtn.disabled = currentPartIndex === 0;
                prevBtn.style.opacity = currentPartIndex === 0 ? '0.5' : '1';
                nextBtn.disabled = currentPartIndex === chunks.length - 1;
                nextBtn.style.opacity = currentPartIndex === chunks.length - 1 ? '0.5' : '1';
            } catch (error) {
                currentQrContainer.innerHTML = `<p style="color: red;">Ошибка при создании QR-кода: ${error.message}</p>`;
            }
        }
        
        // Добавляем обработчики событий для кнопок
        prevBtn.addEventListener('click', () => {
            if (currentPartIndex > 0) {
                currentPartIndex--;
                updateCurrentQRCode();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentPartIndex < chunks.length - 1) {
                currentPartIndex++;
                updateCurrentQRCode();
            }
        });
        
        // Собираем интерфейс
        navContainer.appendChild(prevBtn);
        navContainer.appendChild(nextBtn);
        
        qrContainer.appendChild(partIndicator);
        qrContainer.appendChild(currentQrContainer);
        qrContainer.appendChild(navContainer);
        
        // Добавляем кнопку для скачивания всех QR-кодов
        const downloadAllBtn = document.createElement('button');
        downloadAllBtn.textContent = 'Скачать все QR-коды';
        downloadAllBtn.className = 'qr-download-all-btn';
        downloadAllBtn.style.padding = '8px 12px';
        downloadAllBtn.style.backgroundColor = '#3498db';
        downloadAllBtn.style.color = 'white';
        downloadAllBtn.style.border = 'none';
        downloadAllBtn.style.borderRadius = '4px';
        downloadAllBtn.style.cursor = 'pointer';
        downloadAllBtn.style.marginTop = '15px';
        
        downloadAllBtn.addEventListener('click', () => {
            // Создаем временный элемент для сообщения о скачивании
            const downloadMsg = document.createElement('div');
            downloadMsg.textContent = 'Подготовка файлов для скачивания...';
            downloadMsg.style.margin = '10px 0';
            downloadMsg.style.color = '#3498db';
            qrContainer.appendChild(downloadMsg);
            
            // Запускаем процесс скачивания с задержкой для каждого QR-кода
            let downloadIndex = 0;
            
            function downloadNext() {
                if (downloadIndex < chunks.length) {
                    const tempContainer = document.createElement('div');
                    document.body.appendChild(tempContainer);
                    
                    try {
                        new QRCode(tempContainer, {
                            text: chunks[downloadIndex],
                            width: parseInt(qrSize.value) || 200,
                            height: parseInt(qrSize.value) || 200,
                            colorDark: qrColor.value || '#000000',
                            colorLight: qrBackground.value || '#FFFFFF',
                            correctLevel: QRCode.CorrectLevel.L
                        });
                        
                        // Создаем ссылку для скачивания
                        setTimeout(() => {
                            const img = tempContainer.querySelector('img');
                            if (img) {
                                const link = document.createElement('a');
                                link.href = img.src;
                                link.download = `qrcode-${type}-part-${downloadIndex+1}-of-${chunks.length}.png`;
                                link.click();
                            }
                            
                            // Удаляем временный контейнер
                            document.body.removeChild(tempContainer);
                            
                            // Обновляем сообщение о скачивании
                            downloadMsg.textContent = `Скачивание: ${downloadIndex+1} из ${chunks.length}`;
                            
                            // Переходим к следующему QR-коду
                            downloadIndex++;
                            setTimeout(downloadNext, 800); // Добавляем задержку между скачиваниями
                        }, 300);
                    } catch (error) {
                        console.error('Ошибка при подготовке QR-кода для скачивания:', error);
                        downloadMsg.textContent = `Ошибка при скачивании части ${downloadIndex+1}: ${error.message}`;
                        document.body.removeChild(tempContainer);
                    }
                } else {
                    // Все QR-коды скачаны
                    downloadMsg.textContent = `Все ${chunks.length} QR-кода успешно скачаны!`;
                    setTimeout(() => {
                        downloadMsg.style.opacity = '0';
                        downloadMsg.style.transition = 'opacity 1s';
                        setTimeout(() => downloadMsg.remove(), 1000);
                    }, 3000);
                }
            }
            
            // Начинаем процесс скачивания
            downloadNext();
        });
        
        qrContainer.appendChild(downloadAllBtn);
        
        // Добавляем контейнер в результат
        qrResult.appendChild(qrContainer);
        
        // Показываем первый QR-код
        updateCurrentQRCode();
        
        // Показываем кнопку скачивания
        if (downloadQrBtn) {
            downloadQrBtn.style.display = 'inline-block';
        }
    }
    
    // Функция для получения корректного уровня коррекции ошибок для библиотеки QRCode
    function getQRErrorCorrectionLevel(level) {
        const correctionLevels = {
            'L': QRCode.CorrectLevel.L,
            'M': QRCode.CorrectLevel.M,
            'Q': QRCode.CorrectLevel.Q,
            'H': QRCode.CorrectLevel.H
        };
        
        return correctionLevels[level] || QRCode.CorrectLevel.M;
    }
}); 