// debug.js - файл для диагностики проблем с модальным окном
console.log('Debug.js загружен');

document.addEventListener('DOMContentLoaded', function() {
    console.log('Начало отладки модального окна');
    
    // Проверяем наличие необходимых элементов
    const passwordModal = document.getElementById('password-modal');
    console.log('Модальное окно password-modal:', passwordModal);
    
    const closeButtons = document.querySelectorAll('.modal-close');
    console.log('Найдено кнопок закрытия:', closeButtons.length);
    
    closeButtons.forEach((btn, index) => {
        console.log(`Кнопка закрытия ${index}:`, btn);
        
        // Добавляем отдельный обработчик для диагностики
        btn.addEventListener('click', function(event) {
            console.log(`Клик по кнопке закрытия ${index}`, event);
            
            // Ищем родительское модальное окно
            const modal = this.closest('.modal-overlay, .modal');
            console.log('Найдено родительское модальное окно:', modal);
            
            if (modal) {
                console.log('ID модального окна:', modal.id);
                console.log('Классы модального окна:', modal.className);
                console.log('Удаляем класс "active"');
                modal.classList.remove('active');
            }
        });
    });
    
    // Проверяем генератор паролей
    const passwordDisplay = document.getElementById('password-text');
    console.log('Элемент отображения пароля:', passwordDisplay);
    
    const generateButtons = document.querySelectorAll('.generate-btn, .generate-button');
    console.log('Найдено кнопок генерации:', generateButtons.length);
    
    generateButtons.forEach((btn, index) => {
        console.log(`Кнопка генерации ${index}:`, btn);
        
        // Добавляем отдельный обработчик для диагностики
        btn.addEventListener('click', function() {
            console.log(`Клик по кнопке генерации ${index}`);
            
            // Генерируем простой пароль для тестирования
            const testPassword = 'Test' + Math.floor(Math.random() * 10000);
            console.log('Тестовый пароль:', testPassword);
            
            if (passwordDisplay) {
                passwordDisplay.textContent = testPassword;
                console.log('Пароль отображен в интерфейсе');
            }
        });
    });
    
    // Добавляем глобальный обработчик для диагностики кликов
    document.addEventListener('click', function(event) {
        console.log('Клик по элементу:', event.target);
    }, true);
    
    console.log('Отладка инициализирована');
}); 