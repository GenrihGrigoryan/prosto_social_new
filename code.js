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

function openPopup(title, iconId, contentFile) {
    // Первый шаг: показываем фон

    contentContainer.innerHTML = '';

    document.body.style.overflow = 'hidden';

    // Устанавливаем заголовок попапа
    popupTitle.querySelector('span').textContent = title;

    // Устанавливаем иконку
    popupTitle.querySelector('svg use').setAttribute('href', iconId);

    popup.classList.add('active');
    
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
            
            requestAnimationFrame(() => {
                popupContent.classList.add('show');
            });        
        })
        .catch(error => {
            console.error('Ошибка при загрузке содержимого:', error);
            contentContainer.innerHTML = `<p>Ошибка загрузки содержимого: ${error.message}</p>`;
            popup.style.display = 'flex';
        });

    popup.scrollTop = popupContent.scrollTop = contentContainer.scrollTop = 0;
}

// Функция закрытия попапа с последовательной анимацией
function closePopup() {
    // Сначала прячем содержимое
    popupContent.classList.remove('show');
    
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
        }, 500); // Длительность затухания фона
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

//--------

    /*
    const isLikelyMac = () => {
        if (navigator.userAgentData?.platform) {
          return navigator.userAgentData.platform.toLowerCase().includes('mac');
        }
        return navigator.userAgent.toLowerCase().includes('mac');
      };
    
    const isMacTrackpad = isLikelyMac() && window.matchMedia('(pointer: fine)').matches;
    */

// Листатель для десктопа

//import EmblaCarousel from 'embla-carousel';


const OPTIONS = { dragFree: true, containScroll: 'trimSnaps' }

let embla = null
let removeButtonHandlers = null

function initEmblaIfNeeded() {
  const emblaNode = document.querySelector('.embla')
  const viewportNode = emblaNode.querySelector('.embla__viewport')
  const containerNode = viewportNode.querySelector('.embla__container')
  const prevBtnNode = emblaNode.querySelector('.embla__button--prev')
  const nextBtnNode = emblaNode.querySelector('.embla__button--next')
  const snapDisplayNode = emblaNode.querySelector('.embla__selected-snap-display')

  /*
  // Не инициализировать на тач-устройствах
  if (window.matchMedia('(pointer: coarse)').matches) {
    if (embla) {
      embla.destroy()
      embla = null
      if (removeButtonHandlers) {
        removeButtonHandlers()
        removeButtonHandlers = null
      }
    }
    return
  }
*/

  const viewportWidth = viewportNode.offsetWidth
  const containerWidth = containerNode.scrollWidth
  const needsCarousel = containerWidth > viewportWidth

  if (embla && !needsCarousel) {
    embla.destroy()
    embla = null
    if (removeButtonHandlers) {
      removeButtonHandlers()
      removeButtonHandlers = null
    }
    containerNode.classList.remove('is-dragging')
    return
  }

  if (!embla && needsCarousel) {
    embla = EmblaCarousel(viewportNode, OPTIONS)

    // Drag-класс
    embla.on('pointerDown', () => containerNode.classList.add('is-dragging'))
    embla.on('pointerUp', () => containerNode.classList.remove('is-dragging'))
    embla.on('pointerCancel', () => containerNode.classList.remove('is-dragging'))

    // Кнопки и индикатор
    removeButtonHandlers = window.addPrevNextBtnsClickHandlers(
        embla,
        prevBtnNode,
        nextBtnNode
      )
    //updateSelectedSnapDisplay(embla, snapDisplayNode)

    embla.on('destroy', () => {
      if (removeButtonHandlers) {
        removeButtonHandlers()
        removeButtonHandlers = null
      }
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initEmblaIfNeeded()
})

window.addEventListener('resize', () => {
  initEmblaIfNeeded()
})
