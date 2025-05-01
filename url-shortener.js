// URL Shortener Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('URL Shortener: Initializing...');
    
    // Получаем элементы модального окна и формы
    const shortenerModal = document.getElementById('url-shortener-modal');
    const shortenerButtons = document.querySelectorAll('.url-shortener-btn');
    const closeButtons = shortenerModal ? shortenerModal.querySelectorAll('.close-modal') : [];
    const shortenerForm = document.getElementById('shortener-form');
    
    // Проверки наличия обязательных элементов
    if (!shortenerModal) {
        console.error('URL Shortener: Modal element not found!');
        return;
    }
    
    if (!shortenerForm) {
        console.error('URL Shortener: Form element not found!');
        return;
    }
    
    // Получаем остальные элементы формы
    const longUrlInput = document.getElementById('long-url');
    const clearUrlBtn = document.getElementById('clear-url-btn');
    const serviceSelect = document.getElementById('shortener-service');
    const apiKeyContainer = document.getElementById('api-key-container');
    const apiKeyInput = document.getElementById('api-key');
    const toggleApiKeyBtn = document.getElementById('toggle-api-key');
    const saveApiKeyCheck = document.getElementById('save-api-key');
    const customDomainContainer = document.getElementById('custom-domain-container');
    const customDomainInput = document.getElementById('custom-domain');
    const customSlugCheck = document.getElementById('customize-url');
    const customSlugContainer = document.getElementById('custom-slug-container');
    const customSlugInput = document.getElementById('custom-slug');
    const shortenBtn = document.getElementById('shorten-btn');
    const shortenerError = document.getElementById('shortener-error');
    const shortenedUrlContainer = document.getElementById('shortened-url-container');
    const shortenedUrl = document.getElementById('shortened-url');
    const copyBtn = document.getElementById('copy-btn');
    const openBtn = document.getElementById('open-btn');
    const qrBtn = document.getElementById('qr-btn');
    const shortUrlQrContainer = document.getElementById('short-url-qr-container');
    const shortUrlQrCode = document.getElementById('short-url-qr-code');
    const historyContainer = document.getElementById('shortener-history-container');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const historyList = document.getElementById('shortener-history');
    
    console.log('URL Shortener: Elements initialized');
    
    // Тексты интерфейса на разных языках
    const uiTexts = {
        ru: {
            modalTitle: 'Сокращение ссылок',
            longUrlLabel: 'Длинная ссылка:',
            longUrlPlaceholder: 'Введите длинный URL для сокращения',
            clearUrlBtn: 'Очистить',
            serviceLabel: 'Сервис сокращения:',
            tinyUrl: 'TinyURL',
            bitly: 'Bit.ly',
            rebrandly: 'Rebrand.ly',
            custom: 'Пользовательский',
            apiKeyLabel: 'API ключ:',
            apiKeyPlaceholder: 'Введите ваш API ключ',
            saveApiKey: 'Сохранить API ключ',
            customDomainLabel: 'Домен:',
            customDomainPlaceholder: 'Введите домен (напр. your-domain.com)',
            customSlugLabel: 'Использовать свой идентификатор',
            customSlugPlaceholder: 'Введите свой идентификатор',
            customSlugHint: 'Буквы, цифры и дефисы (напр. "my-link")',
            shortenBtn: 'Сократить URL',
            processingBtn: 'Обработка...',
            resultHeader: 'Сокращенная ссылка:',
            qrHeader: 'QR-код для короткой ссылки:',
            copyBtn: 'Копировать',
            openBtn: 'Открыть',
            qrBtn: 'QR-код',
            historyHeader: 'История сокращений',
            clearHistoryBtn: 'Очистить историю',
            noHistory: 'История пуста',
            confirmClearHistory: 'Вы уверены, что хотите очистить историю сокращений?'
        },
        en: {
            modalTitle: 'URL Shortener',
            longUrlLabel: 'Long URL:',
            longUrlPlaceholder: 'Enter a long URL to shorten',
            clearUrlBtn: 'Clear',
            serviceLabel: 'Shortening Service:',
            tinyUrl: 'TinyURL',
            bitly: 'Bit.ly',
            rebrandly: 'Rebrand.ly',
            custom: 'Custom',
            apiKeyLabel: 'API Key:',
            apiKeyPlaceholder: 'Enter your API key',
            saveApiKey: 'Save API key',
            customDomainLabel: 'Domain:',
            customDomainPlaceholder: 'Enter domain (e.g. your-domain.com)',
            customSlugLabel: 'Use custom identifier',
            customSlugPlaceholder: 'Enter your custom identifier',
            customSlugHint: 'Letters, numbers, and hyphens (e.g. "my-link")',
            shortenBtn: 'Shorten URL',
            processingBtn: 'Processing...',
            resultHeader: 'Shortened URL:',
            qrHeader: 'QR Code for Short URL:',
            copyBtn: 'Copy',
            openBtn: 'Open',
            qrBtn: 'QR Code',
            historyHeader: 'Shortening History',
            clearHistoryBtn: 'Clear History',
            noHistory: 'History is empty',
            confirmClearHistory: 'Are you sure you want to clear your shortening history?'
        }
    };

    // Функция обновления текстов интерфейса
    function updateUiTexts() {
        console.log('URL Shortener: Updating UI texts');
        const lang = getCurrentLanguage();
        const texts = uiTexts[lang];
        
        try {
            // Обновление заголовка модального окна
            document.querySelectorAll('[data-lang-ru="Сокращение ссылок"]').forEach(el => {
                el.textContent = texts.modalTitle;
            });
            
            // Обновление текстов формы
            document.querySelectorAll('[data-lang-ru="Длинная ссылка:"]').forEach(el => {
                el.textContent = texts.longUrlLabel;
            });
            
            if (longUrlInput) {
                longUrlInput.placeholder = texts.longUrlPlaceholder;
                // Также проверяем атрибуты для placeholder
                if (longUrlInput.hasAttribute('data-lang-ru-placeholder')) {
                    const ruPlaceholder = longUrlInput.getAttribute('data-lang-ru-placeholder');
                    const enPlaceholder = longUrlInput.getAttribute('data-lang-en-placeholder');
                    longUrlInput.placeholder = lang === 'ru' ? ruPlaceholder : (enPlaceholder || '');
                }
            }
            
            if (clearUrlBtn) {
                clearUrlBtn.setAttribute('title', texts.clearUrlBtn);
            }
            
            document.querySelectorAll('[data-lang-ru="Сервис сокращения:"]').forEach(el => {
                el.textContent = texts.serviceLabel;
            });
            
            // Обновление опций сервиса
            if (serviceSelect) {
                Array.from(serviceSelect.options).forEach(option => {
                    switch(option.value) {
                        case 'tinyurl':
                            option.textContent = texts.tinyUrl;
                            break;
                        case 'bitly':
                            option.textContent = texts.bitly;
                            break;
                        case 'rebrandly':
                            option.textContent = texts.rebrandly;
                            break;
                        case 'custom':
                            option.textContent = texts.custom;
                            break;
                    }
                });
            }
            
            document.querySelectorAll('[data-lang-ru="API ключ:"]').forEach(el => {
                el.textContent = texts.apiKeyLabel;
            });
            
            if (apiKeyInput) {
                apiKeyInput.placeholder = texts.apiKeyPlaceholder;
            }
            
            document.querySelectorAll('[data-lang-ru="Сохранить API ключ"]').forEach(el => {
                el.textContent = texts.saveApiKey;
            });
            
            document.querySelectorAll('[data-lang-ru="Домен:"]').forEach(el => {
                el.textContent = texts.customDomainLabel;
            });
            
            if (customDomainInput) {
                customDomainInput.placeholder = texts.customDomainPlaceholder;
                // Также проверяем атрибуты для placeholder
                if (customDomainInput.hasAttribute('data-lang-ru-placeholder')) {
                    const ruPlaceholder = customDomainInput.getAttribute('data-lang-ru-placeholder');
                    const enPlaceholder = customDomainInput.getAttribute('data-lang-en-placeholder');
                    customDomainInput.placeholder = lang === 'ru' ? ruPlaceholder : (enPlaceholder || '');
                }
            }
            
            document.querySelectorAll('[data-lang-ru="Настроить короткую ссылку"]').forEach(el => {
                el.textContent = texts.customSlugLabel;
            });
            
            if (customSlugInput) {
                customSlugInput.placeholder = texts.customSlugPlaceholder;
                // Также проверяем атрибуты для placeholder
                if (customSlugInput.hasAttribute('data-lang-ru-placeholder')) {
                    const ruPlaceholder = customSlugInput.getAttribute('data-lang-ru-placeholder');
                    const enPlaceholder = customSlugInput.getAttribute('data-lang-en-placeholder');
                    customSlugInput.placeholder = lang === 'ru' ? ruPlaceholder : (enPlaceholder || '');
                }
            }
            
            document.querySelectorAll('.custom-slug-hint').forEach(el => {
                el.textContent = texts.customSlugHint;
            });
            
            // Обновление кнопки сокращения, если она не в процессе выполнения
            if (shortenBtn) {
                if (!shortenBtn.disabled) {
                    // Проверяем наличие data-lang атрибутов
                    if (shortenBtn.hasAttribute('data-lang-ru')) {
                        shortenBtn.textContent = lang === 'ru' ? 
                            shortenBtn.getAttribute('data-lang-ru') : 
                            shortenBtn.getAttribute('data-lang-en') || texts.shortenBtn;
                    } else {
                        const btnSpan = shortenBtn.querySelector('span');
                        if (btnSpan) {
                            if (btnSpan.hasAttribute('data-lang-ru')) {
                                btnSpan.textContent = lang === 'ru' ? 
                                    btnSpan.getAttribute('data-lang-ru') : 
                                    btnSpan.getAttribute('data-lang-en') || 'Shorten';
                            } else {
                                btnSpan.textContent = texts.shortenBtn;
                            }
                        } else {
                            shortenBtn.textContent = texts.shortenBtn;
                        }
                    }
                } else {
                    const spinnerIcon = '<i class="fas fa-spinner fa-spin"></i> ';
                    shortenBtn.innerHTML = spinnerIcon + texts.processingBtn;
                }
            }
            
            document.querySelectorAll('[data-lang-ru="Сокращенная ссылка:"]').forEach(el => {
                el.textContent = texts.resultHeader;
            });
            
            document.querySelectorAll('[data-lang-ru="QR-код для короткой ссылки:"]').forEach(el => {
                el.textContent = texts.qrHeader;
            });
            
            if (copyBtn) copyBtn.setAttribute('title', texts.copyBtn);
            if (openBtn) openBtn.setAttribute('title', texts.openBtn);
            if (qrBtn) qrBtn.setAttribute('title', texts.qrBtn);
            
            document.querySelectorAll('[data-lang-ru="История сокращений"]').forEach(el => {
                el.textContent = texts.historyHeader;
            });
            
            document.querySelectorAll('[data-lang-ru="Очистить историю"]').forEach(el => {
                el.textContent = texts.clearHistoryBtn;
            });
            
            // Обновление истории
            renderHistory();
            
            console.log('URL Shortener: UI texts updated successfully');
        } catch (error) {
            console.error('URL Shortener: Error updating UI texts:', error);
        }
    }

    // Открытие модального окна
    shortenerButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('URL Shortener: Opening modal');
            shortenerModal.classList.add('show');
            document.body.classList.add('modal-open');
            resetShortenerForm();
        });
    });

    // Кнопки с data-modal="url-shortener-modal"
    document.querySelectorAll('[data-modal="url-shortener-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            console.log('URL Shortener: Opening modal via data-modal attribute');
            shortenerModal.classList.add('show');
            document.body.classList.add('modal-open');
            resetShortenerForm();
        });
    });

    // Закрытие модального окна
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('URL Shortener: Closing modal via close button');
            shortenerModal.classList.remove('show');
            document.body.classList.remove('modal-open');
        });
    });

    // Закрытие при клике вне модального окна
    shortenerModal.addEventListener('click', function(e) {
        if (e.target === shortenerModal) {
            console.log('URL Shortener: Closing modal via outside click');
            shortenerModal.classList.remove('show');
            document.body.classList.remove('modal-open');
        }
    });

    // Очистка поля ввода URL
    clearUrlBtn.addEventListener('click', function() {
        longUrlInput.value = '';
        longUrlInput.focus();
    });

    // Изменение сервиса для сокращения
    serviceSelect.addEventListener('change', function() {
        const selectedService = this.value;
        
        // Показываем/скрываем контейнер API ключа
        if (['bitly', 'rebrandly', 'custom'].includes(selectedService)) {
            apiKeyContainer.style.display = 'block';
            
            // Загружаем сохраненный API ключ, если есть
            const savedApiKey = localStorage.getItem(`${selectedService}_api_key`);
            if (savedApiKey) {
                apiKeyInput.value = savedApiKey;
                saveApiKeyCheck.checked = true;
            } else {
                apiKeyInput.value = '';
                saveApiKeyCheck.checked = false;
            }
            
            // Устанавливаем подсказку для API ключа
            switch(selectedService) {
                case 'bitly':
                    apiKeyInput.placeholder = 'Введите ваш Bit.ly API ключ';
                    break;
                case 'rebrandly':
                    apiKeyInput.placeholder = 'Введите ваш Rebrandly API ключ';
                    break;
                case 'custom':
                    apiKeyInput.placeholder = 'Введите API ключ, если требуется';
                    break;
            }
        } else {
            apiKeyContainer.style.display = 'none';
        }
        
        // Показываем/скрываем контейнер для пользовательского домена
        customDomainContainer.style.display = selectedService === 'custom' ? 'block' : 'none';
    });

    // Переключение видимости API ключа
    toggleApiKeyBtn.addEventListener('click', function() {
        const type = apiKeyInput.type === 'password' ? 'text' : 'password';
        apiKeyInput.type = type;
        toggleApiKeyBtn.innerHTML = type === 'password' ? 
            '<i class="fas fa-eye"></i>' : 
            '<i class="fas fa-eye-slash"></i>';
    });

    // Переключение контейнера для пользовательского slug
    customSlugCheck.addEventListener('change', function() {
        customSlugContainer.style.display = this.checked ? 'block' : 'none';
        if (this.checked) {
            customSlugInput.focus();
        }
    });

    // Обработка отправки формы
    shortenerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('URL Shortener: Form submitted');
        
        // Определяем текущий язык и тексты
        const currentLang = getCurrentLanguage();
        const texts = uiTexts[currentLang];
        
        // Скрываем предыдущие результаты и ошибки
        shortenedUrlContainer.style.display = 'none';
        shortUrlQrContainer.style.display = 'none';
        if (shortenerError) shortenerError.style.display = 'none';
        
        // Получаем значения из формы
        const longUrl = longUrlInput.value.trim();
        const service = serviceSelect.value;
        const apiKey = apiKeyInput ? apiKeyInput.value.trim() : '';
        const customDomain = customDomainInput ? customDomainInput.value.trim() : '';
        const useCustomSlug = customSlugCheck ? customSlugCheck.checked : false;
        const customSlug = customSlugInput ? customSlugInput.value.trim() : '';
        
        console.log('URL Shortener: Processing URL with service:', service);
        
        // Валидация URL
        if (!longUrl) {
            const errorMsg = currentLang === 'ru' ? 
                'Пожалуйста, введите URL для сокращения' : 
                'Please enter a URL to shorten';
            showError(errorMsg);
            return;
        }
        
        if (!isValidUrl(longUrl)) {
            const errorMsg = currentLang === 'ru' ? 
                'Пожалуйста, введите корректный URL, включая http:// или https://' : 
                'Please enter a valid URL, including http:// or https://';
            showError(errorMsg);
            return;
        }
        
        // Проверка API ключа для сервисов, которым он нужен
        if (['bitly', 'rebrandly'].includes(service) && !apiKey) {
            const serviceName = service === 'bitly' ? 'Bit.ly' : 'Rebrandly';
            const errorMsg = currentLang === 'ru' ? 
                `Для работы с ${serviceName} необходим API ключ` : 
                `An API key is required for ${serviceName}`;
            showError(errorMsg);
            return;
        }
        
        // Проверка домена для пользовательского сервиса
        if (service === 'custom' && !customDomain) {
            const errorMsg = currentLang === 'ru' ? 
                'Пожалуйста, введите домен для сервиса сокращения URL' : 
                'Please enter a domain for the URL shortening service';
            showError(errorMsg);
            return;
        }
        
        // Проверка пользовательского slug
        if (useCustomSlug && !customSlug) {
            const errorMsg = currentLang === 'ru' ? 
                'Пожалуйста, введите пользовательский идентификатор (slug)' : 
                'Please enter a custom identifier (slug)';
            showError(errorMsg);
            return;
        }
        
        // Сохраняем API ключ, если пользователь этого хочет
        if (saveApiKeyCheck && saveApiKeyCheck.checked && apiKey && ['bitly', 'rebrandly', 'custom'].includes(service)) {
            localStorage.setItem(`${service}_api_key`, apiKey);
        } else if (saveApiKeyCheck && !saveApiKeyCheck.checked && ['bitly', 'rebrandly', 'custom'].includes(service)) {
            localStorage.removeItem(`${service}_api_key`);
        }
        
        // Показываем индикатор загрузки
        if (shortenBtn) {
            shortenBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${texts.processingBtn || 'Processing...'}`;
            shortenBtn.disabled = true;
        }
        
        // Вызываем соответствующий API для сокращения URL
        shortenUrl(longUrl, service, apiKey, customDomain, useCustomSlug ? customSlug : null)
            .then(result => {
                console.log('URL Shortener: API result:', result);
                if (result.success) {
                    // Показываем результат
                    if (shortenedUrl) {
                        console.log('Setting shortened URL to:', result.shortUrl);
                        shortenedUrl.value = result.shortUrl;
                        shortenedUrl.setAttribute('data-url', result.shortUrl);
                    } else {
                        console.error('Shortened URL element not found');
                    }
                    
                    if (shortenedUrlContainer) {
                        shortenedUrlContainer.style.display = 'block';
                    } else {
                        console.error('Shortened URL container not found');
                    }
                    
                    // Добавляем в историю
                    addToHistory(longUrl, result.shortUrl);
                } else {
                    const defaultError = currentLang === 'ru' ? 
                        'Произошла ошибка при сокращении URL' : 
                        'An error occurred while shortening the URL';
                    showError(result.error || defaultError);
                }
            })
            .catch(error => {
                console.error('URL Shortener: Error occurred:', error);
                const errorPrefix = currentLang === 'ru' ? 
                    'Не удалось сократить URL: ' : 
                    'Failed to shorten URL: ';
                showError(errorPrefix + error.message);
            })
            .finally(() => {
                // Восстанавливаем кнопку
                if (shortenBtn) {
                    shortenBtn.innerHTML = texts.shortenBtn || 'Shorten URL';
                    shortenBtn.disabled = false;
                }
            });
    });

    // Копирование короткого URL
    copyBtn.addEventListener('click', function() {
        if (!shortenedUrl) return;
        
        // Используем поле value для копирования
        const url = shortenedUrl.value || shortenedUrl.getAttribute('data-url');
        if (!url) {
            console.error('No URL to copy');
            return;
        }
        
        console.log('Copying URL:', url);
        navigator.clipboard.writeText(url)
            .then(() => {
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
                
                // Показываем уведомление о копировании
                const notification = document.getElementById('short-url-copy-notification');
                if (notification) {
                    notification.style.display = 'block';
                    setTimeout(() => {
                        notification.style.display = 'none';
                    }, 2000);
                }
            })
            .catch(err => {
                console.error('Ошибка при копировании: ', err);
            });
    });

    // Открытие короткого URL
    openBtn.addEventListener('click', function() {
        if (!shortenedUrl) return;
        
        // Используем поле value для получения URL
        const url = shortenedUrl.value || shortenedUrl.getAttribute('data-url');
        if (!url) {
            console.error('No URL to open');
            return;
        }
        
        console.log('Opening URL:', url);
        window.open(url, '_blank');
    });

    // Генерация QR кода
    qrBtn.addEventListener('click', function() {
        if (!shortenedUrl || !shortUrlQrCode) return;
        
        // Используем поле value для получения URL
        const url = shortenedUrl.value || shortenedUrl.getAttribute('data-url');
        if (!url) {
            console.error('No URL for QR code');
            return;
        }
        
        console.log('Generating QR code for URL:', url);
        
        // Проверяем, загружена ли библиотека QRCode
        if (typeof QRCode !== 'undefined') {
            // Очищаем предыдущий QR код
            shortUrlQrCode.innerHTML = '';
            
            // Генерируем новый QR код
            new QRCode(shortUrlQrCode, {
                text: url,
                width: 128,
                height: 128,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
            
            if (shortUrlQrContainer) {
                shortUrlQrContainer.style.display = 'block';
            }
        } else {
            showError('Не удалось загрузить библиотеку QR кода');
        }
    });

    // Очистка истории
    clearHistoryBtn.addEventListener('click', function() {
        const currentLang = getCurrentLanguage();
        const confirmMessage = uiTexts[currentLang].confirmClearHistory;
        
        if (confirm(confirmMessage)) {
            localStorage.removeItem('url_shortener_history');
            renderHistory();
        }
    });

    // Функция сокращения URL
    async function shortenUrl(longUrl, service, apiKey = '', customDomain = '', customSlug = null) {
        try {
            let result;
            
            switch(service) {
                case 'tinyurl':
                    result = await shortenWithTinyUrl(longUrl, customSlug);
                    break;
                case 'bitly':
                    result = await shortenWithBitly(longUrl, apiKey);
                    break;
                case 'rebrandly':
                    result = await shortenWithRebrandly(longUrl, apiKey, customSlug);
                    break;
                case 'custom':
                    result = await shortenWithCustomService(longUrl, customDomain, apiKey, customSlug);
                    break;
                default:
                    const currentLang = getCurrentLanguage();
                    const errorMessage = currentLang === 'ru' ? 'Неподдерживаемый сервис' : 'Unsupported service';
                    return { success: false, error: errorMessage };
            }
            
            return result;
        } catch (error) {
            console.error('Ошибка при сокращении URL:', error);
            return { success: false, error: error.message };
        }
    }

    // Сокращение через TinyURL
    async function shortenWithTinyUrl(longUrl, customSlug = null) {
        try {
            let url = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`;
            
            if (customSlug) {
                url += `&alias=${encodeURIComponent(customSlug)}`;
            }
            
            const response = await fetch(url);
            const currentLang = getCurrentLanguage();
            
            if (!response.ok) {
                const errorPrefix = currentLang === 'ru' ? 'Ошибка API TinyURL:' : 'TinyURL API Error:';
                throw new Error(`${errorPrefix} ${response.status}`);
            }
            
            const shortUrl = await response.text();
            
            if (shortUrl.includes('Error') || shortUrl === longUrl) {
                const errorMessage = currentLang === 'ru' ? 'Не удалось сократить URL' : 'Failed to shorten URL';
                return { 
                    success: false, 
                    error: shortUrl.includes('Error') ? shortUrl : errorMessage 
                };
            }
            
            return { success: true, shortUrl };
        } catch (error) {
            console.error('TinyURL error:', error);
            return { success: false, error: error.message };
        }
    }

    // Сокращение через Bit.ly
    async function shortenWithBitly(longUrl, apiKey) {
        try {
            const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ long_url: longUrl })
            });
            
            const data = await response.json();
            const currentLang = getCurrentLanguage();
            
            if (!response.ok) {
                const errorPrefix = currentLang === 'ru' ? 'Ошибка API Bit.ly:' : 'Bit.ly API Error:';
                throw new Error(data.message || `${errorPrefix} ${response.status}`);
            }
            
            return { success: true, shortUrl: data.link };
        } catch (error) {
            console.error('Bit.ly error:', error);
            return { success: false, error: error.message };
        }
    }

    // Сокращение через Rebrandly
    async function shortenWithRebrandly(longUrl, apiKey, customSlug = null) {
        try {
            const body = { 
                destination: longUrl,
                domain: { fullName: "rebrand.ly" }
            };
            
            if (customSlug) {
                body.slashtag = customSlug;
            }
            
            const response = await fetch('https://api.rebrandly.com/v1/links', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': apiKey
                },
                body: JSON.stringify(body)
            });
            
            const data = await response.json();
            const currentLang = getCurrentLanguage();
            
            if (!response.ok) {
                const errorPrefix = currentLang === 'ru' ? 'Ошибка API Rebrandly:' : 'Rebrandly API Error:';
                throw new Error(data.message || `${errorPrefix} ${response.status}`);
            }
            
            return { success: true, shortUrl: data.shortUrl };
        } catch (error) {
            console.error('Rebrandly error:', error);
            return { success: false, error: error.message };
        }
    }

    // Сокращение через пользовательский сервис
    async function shortenWithCustomService(longUrl, domain, apiKey = '', customSlug = null) {
        try {
            // Простое формирование короткой ссылки для демонстрации
            // В реальном приложении здесь должна быть реализация специфичная для выбранного сервиса
            const shortUrl = `https://${domain}/${customSlug || generateRandomSlug()}`;
            
            return { success: true, shortUrl };
        } catch (error) {
            console.error('Custom service error:', error);
            return { success: false, error: error.message };
        }
    }

    // Вспомогательные функции
    function isValidUrl(url) {
        try {
            const parsedUrl = new URL(url);
            return ['http:', 'https:'].includes(parsedUrl.protocol);
        } catch (e) {
            return false;
        }
    }

    function generateRandomSlug(length = 6) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        
        return result;
    }

    function showError(message) {
        console.error('URL Shortener Error:', message);
        const errorElement = document.getElementById('shortener-error');
        const errorMessageElement = document.getElementById('error-message');
        
        if (errorMessageElement) {
            errorMessageElement.textContent = message;
        } else if (errorElement) {
            errorElement.textContent = message;
        }
        
        if (errorElement) {
            errorElement.style.display = 'block';
        }
    }

    function getCurrentLanguage() {
        return localStorage.getItem('lang') || 'ru';
    }

    function resetShortenerForm() {
        shortenerForm.reset();
        shortenedUrlContainer.style.display = 'none';
        shortUrlQrContainer.style.display = 'none';
        shortenerError.style.display = 'none';
        customSlugContainer.style.display = 'none';
        apiKeyContainer.style.display = 'none';
        customDomainContainer.style.display = 'none';
        
        // Обновляем текст кнопки в соответствии с языком
        const currentLang = getCurrentLanguage();
        shortenBtn.innerHTML = uiTexts[currentLang].shortenBtn;
    }

    // Работа с историей сокращений
    function addToHistory(originalUrl, shortUrl) {
        let history = getHistory();
        
        // Добавляем новую запись
        history.unshift({
            original: originalUrl,
            short: shortUrl,
            date: new Date().toISOString()
        });
        
        // Ограничиваем историю 10 записями
        history = history.slice(0, 10);
        
        // Сохраняем обновленную историю
        localStorage.setItem('url_shortener_history', JSON.stringify(history));
        
        // Обновляем отображение истории
        renderHistory();
    }

    function getHistory() {
        const historyJson = localStorage.getItem('url_shortener_history');
        return historyJson ? JSON.parse(historyJson) : [];
    }

    function renderHistory() {
        const history = getHistory();
        const currentLang = getCurrentLanguage();
        const texts = uiTexts[currentLang];
        
        // Показываем или скрываем контейнер истории
        historyContainer.style.display = history.length > 0 ? 'block' : 'none';
        
        // Очищаем список
        historyList.innerHTML = '';
        
        if (history.length === 0) {
            historyList.innerHTML = `<div class="no-history">${texts.noHistory}</div>`;
            return;
        }
        
        // Добавляем каждую запись
        history.forEach(item => {
            const date = new Date(item.date);
            const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-item-details">
                    <div class="history-item-short" title="${item.short}">${item.short}</div>
                    <div class="history-item-original" title="${item.original}">${truncateUrl(item.original, 40)}</div>
                    <div class="history-item-date">${formattedDate}</div>
                </div>
                <div class="history-item-actions">
                    <button class="copy-btn" title="${texts.copyBtn}">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="open-btn" title="${texts.openBtn}">
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                </div>
            `;
            
            // Обработчики для кнопок
            const copyButton = historyItem.querySelector('.copy-btn');
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(item.short)
                    .then(() => {
                        copyButton.innerHTML = '<i class="fas fa-check"></i>';
                        setTimeout(() => {
                            copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                        }, 2000);
                    });
            });
            
            const openButton = historyItem.querySelector('.open-btn');
            openButton.addEventListener('click', () => {
                window.open(item.short, '_blank');
            });
            
            historyList.appendChild(historyItem);
        });
    }

    function truncateUrl(url, maxLength) {
        if (url.length <= maxLength) return url;
        return url.substring(0, maxLength - 3) + '...';
    }

    // Инициализация
    serviceSelect.dispatchEvent(new Event('change'));
    renderHistory();
    updateUiTexts(); // Инициализируем тексты при загрузке

    // Обработка события смены языка
    document.addEventListener('languageChanged', function(e) {
        updateUiTexts();
    });
}); 