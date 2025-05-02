const items = document.querySelectorAll('.carousel-item');
let currentIndex = 0;

function rotateCarousel() {
    const current = items[currentIndex];
    const nextIndex = (currentIndex + 1) % items.length;
    const next = items[nextIndex];

    // Убираем текущий элемент вверх
    current.classList.remove('active');
    current.classList.add('prev');

    // Поднимаем следующий элемент
    next.classList.remove('next');
    next.classList.add('active');

    // После завершения анимации (1с) готовим следующий элемент
    setTimeout(() => {
        current.classList.remove('prev');
        current.classList.add('next');
    }, 1000);

    currentIndex = nextIndex;

    // Запускаем следующий цикл через 2 секунды после начала анимации
    setTimeout(rotateCarousel, 2000);
}

// Запускаем первый цикл через 2 секунды
setTimeout(rotateCarousel, 2000);

const popup = document.getElementById('popup');

// Ищем элементы внутри попапа вместо всего документа
const popupContent = popup.querySelector('.popup-content');
const popupTitle = popup.querySelector('.popup-header-title');
const contentContainer = popup.querySelector('#contentContainer');

//const popupTitle = document.getElementById('popup-header-title');
//const contentContainer = document.getElementById('contentContainer');

// Функция открытия попапа с последовательной анимацией
function openPopup(title, iconId, contentFile) {
    // Первый шаг: показываем фон
    popup.classList.add('active');
    // Разрешаем анимацию содержимого после того, как фон стал видимым
    setTimeout(() => {
        popupContent.style.transition = 'transform 0.5s cubic-bezier(0.3, 0, 0.2, 1)';
    }, 10);
    // Предотвращаем скролл основной страницы
    document.body.style.overflow = 'hidden';

    // Устанавливаем заголовок попапа
    popupTitle.querySelector('span').textContent = title;

    // Устанавливаем иконку
    popupTitle.querySelector('svg use').setAttribute('href', iconId);

    // Загружаем содержимое из файла
    fetch(contentFile)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка загрузки файла: ${response.status}`);
            }
            return response.text();
        })
        .then(content => {
            // Вставляем содержимое в контейнер
            contentContainer.innerHTML = content;
            
            // Отображаем попап
            popup.style.display = 'flex';
        })
        .catch(error => {
            console.error('Ошибка при загрузке содержимого:', error);
            contentContainer.innerHTML = `<p>Ошибка загрузки содержимого: ${error.message}</p>`;
            popup.style.display = 'flex';
        });

    popup.scrollTop = 0;
    popupContent.scrollTop = 0;
    contentContainer.scrollTop = 0;
}

// Функция закрытия попапа с последовательной анимацией
function closePopup() {
    // Сначала прячем содержимое
    popupContent.style.transform = 'translateY(100%)';
    
    // После завершения анимации содержимого, начинаем плавное исчезновение фона
    setTimeout(() => {
        // Не удаляем класс active, а просто устанавливаем непосредственно opacity в 0
        popup.style.opacity = '0';
        
        // Возвращаем скролл основной страницы
        document.body.style.overflow = '';
        
        // После плавного исчезновения фона полностью скрываем элемент
        setTimeout(() => {
            popup.classList.remove('active');
            popup.style.opacity = ''; // Сбрасываем inline стиль opacity
            
            // Сбрасываем стили для следующего открытия
            popupContent.style.transition = '';
            popupContent.style.transform = '';
        }, 300); // Длительность затухания фона
    }, 100); // Длительность анимации скрытия контента
}

function onToggleItem(item) {

    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    const contentInner = content.querySelector('.accordion-content-inner');
    
    const isActive = item.classList.toggle('active');
    
    // Set max-height for smooth animation
    if (isActive) {
        // Get the height of the content + padding
        const height = contentInner.offsetHeight;
        content.style.maxHeight = `${height}px`;
    } else {
        content.style.maxHeight = '0px';
    }          
}