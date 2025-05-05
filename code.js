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
const popupHeaderPanel = popup.querySelector('.popup-header-panel');
const popupTitle = popup.querySelector('.popup-header-title');
const contentContainer = popup.querySelector('#contentContainer');

const blurEl = popup.querySelector('.blur-layer');

var popupIsOpen = false;

function openPopup(title, iconId, contentFile, action, isEnabledBlur = true) {
    // Первый шаг: показываем фон

    blurEl.style.display = isEnabledBlur ? 'block' : 'none';

    popupIsOpen = true;

    contentContainer.innerHTML = '';

    document.body.style.overflow = 'hidden';

    popupHeaderPanel.onclick = action;

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

function switchPopupContent(title, iconId, contentFile, action, isEnabledBlur = true) {
    
  // 1. Плавно скрываем старый контент
  popupContent.classList.remove('show');

  // 2. Ждём завершения перехода (обычно ~300ms)
  setTimeout(() => {
      blurEl.style.display = isEnabledBlur ? 'block' : 'none';

      // Очищаем старое содержимое
      contentContainer.innerHTML = '';

      // Обновляем заголовок
      popupTitle.querySelector('span').textContent = title;

      // Обновляем иконку
      popupTitle.querySelector('svg use').setAttribute('href', iconId);

      // Обновляем обработчик
      popupHeaderPanel.onclick = action;

      // Загружаем новое содержимое
      fetch(contentFile)
          .then(response => {
              if (!response.ok) {
                  throw new Error(`Ошибка загрузки файла: ${response.status}`);
              }
              return response.text();
          })
          .then(content => {
              contentContainer.innerHTML = content;

              // Плавно показываем новый контент
              requestAnimationFrame(() => {
                  popupContent.classList.add('show');
              });
          })
          .catch(error => {
              console.error('Ошибка при загрузке содержимого:', error);
              contentContainer.innerHTML = `<p>Ошибка загрузки содержимого: ${error.message}</p>`;
          });

      popup.scrollTop = popupContent.scrollTop = contentContainer.scrollTop = 0;

  }, 300); // Подстроить под transition-duration в CSS
}


// Функция закрытия попапа с последовательной анимацией
function closePopup() {

  popupIsOpen = false;

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
            
            contentContainer.innerHTML = '';

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


const OPTIONS = { 
    loop: false,
    dragFree: true,
    containScroll: 'trimSnaps',
    speed: 10,
    dragThreshold: 1
}

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
    removeButtonHandlers = addPrevNextBtnsClickHandlers(
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

function addPrevNextBtnsClickHandlers (emblaApi, prevBtn, nextBtn) {
    const scrollPrev = () => {
      emblaApi.scrollPrev()
    }
    const scrollNext = () => {
      emblaApi.scrollNext()
    }
  
    prevBtn.addEventListener('click', scrollPrev, false)
    nextBtn.addEventListener('click', scrollNext, false)
  
    const togglePrevNextBtnsState = () => {
      if (emblaApi.canScrollPrev()) {
        prevBtn.classList.remove('is-disabled')
      } else {
        prevBtn.classList.add('is-disabled')
      }
  
      if (emblaApi.canScrollNext()) {
        nextBtn.classList.remove('is-disabled')
      } else {
        nextBtn.classList.add('is-disabled')
      }
    }
  
    emblaApi
      .on('select', togglePrevNextBtnsState)
      .on('init', togglePrevNextBtnsState)
      .on('reInit', togglePrevNextBtnsState)
  
    // Возвращаем функцию очистки
    return () => {
      prevBtn.removeEventListener('click', scrollPrev, false)
      nextBtn.removeEventListener('click', scrollNext, false)
    }
  }

document.addEventListener('DOMContentLoaded', () => {
  initEmblaIfNeeded()
})

window.addEventListener('resize', () => {
  initEmblaIfNeeded()
})


function toggleOption(option) {
    const toggler = option.parentElement;
    const options = toggler.querySelectorAll('.toggler-option');
    const slider = toggler.querySelector('.toggler-slider');
    const isVertical = toggler.classList.contains('vertical');
    const index = parseInt(option.dataset.index);

    // Обновить data-selected
    toggler.dataset.selected = index;

    // Обновить классы
    options.forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');

    // Сдвинуть слайдер
    if (isVertical) {
        slider.style.transform = `translateY(${index * 100}%)`;
    } else {
        slider.style.transform = `translateX(${index * 100}%)`;
    }

    // Вызвать событие
    document.dispatchEvent(new CustomEvent('toggleChange', {
        detail: {
            togglerId: toggler.id,
            selectedIndex: index
        }
    }));
}


const actionButton = document.getElementById('actionButton');
const offerText = document.getElementById('offerText');

var tierSelect = false;

var card = 'russian';
var tier = 'tier1';

function choosePaymentMethod(cardType, option){

  card = cardType;

  const emailSection = document.getElementById('mailform');
  const tier1 = document.getElementById("tier-1");
  const tier2 = document.getElementById("tier-2");

  const tier1name = tier1.querySelector("h3");
  const tier1desc = tier1.querySelector(".tierdesc");

  const tier2name = tier2.querySelector("h3");
  const tier2desc = tier2.querySelector(".tierdesc");

  const emailInput = document.getElementById('email'); 

  if(cardType === "foreign"){
    emailSection.classList.remove('hidden');
    
    tier1name.textContent = '15';
    tier1name.parentElement.querySelector("span").textContent = '$';
    tier1desc.textContent = 'Один месяц, подписка';

    tier2name.textContent = '160';
    tier2name.parentElement.querySelector("span").textContent = '$';

    emailInput.setAttribute('required', '');
  }
  else{
    emailSection.classList.add('hidden');

    tier1name.textContent = '2900';
    tier1name.parentElement.querySelector("span").textContent = '₽';
    tier1desc.textContent = 'Три месяца, подписка';

    tier2name.textContent = '14900';
    tier2name.parentElement.querySelector("span").textContent = '₽';

    emailInput.removeAttribute('required');
  }

  toggleOption(option);

}

function chooseTier(tierType, option){

  tier = tierType;

  const option1Radio = document.getElementById('subOption1Radio');
  const option2Radio = document.getElementById('subOption2Radio');

  if(tierType === 'tier1'){
    option1Radio.checked = true;
  }
  else{
    option2Radio.checked = true;
  }

  toggleOption(option);
}

// Email validation function (re-introduced)
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}


let isSubmitting = false;
const form = document.getElementById('paymentForm');

form.addEventListener('submit', function(e) {
    // Prevent double submission
  if (isSubmitting) {
      e.preventDefault();
      return;
  }

  if(!tierSelect){
    e.preventDefault();

    tierSelect = true;

    var tout = 150;

    if(!popupIsOpen){
      openPopup("Выбор тарифа", "#icon-tier", "content/tiers.html", closeMainButton, false);
    }
    else{
      switchPopupContent("Выбор тарифа", "#icon-tier", "content/tiers.html", closeMainButton, false);
      tout = 250;
    }

    // Показываем текст о соглашении с офертой
    setTimeout(() => {
        actionButton.classList.add('clicked');
        offerText.classList.add('visible');
    }, tout);
  }
  else{

    if(card === 'foreign'){
      if (!validateEmail(emailInput.value)) {
        e.preventDefault();
        isSubmitting = false;
        // УВЕДОМЛЕНИЕ: ВВЕДИТЕ АДРЕС
      }
      else{
        isSubmitting = true;
        // тут отправляем
      }
    }
    else{

      isSubmitting = true;
      e.preventDefault();
    
      let redirectUrl = '';

      if(tier === "tier1"){
        redirectUrl = 'https://prosto.social/checkout/?add-to-cart=16611';
      }
      else{
        redirectUrl = 'https://prosto.social/checkout/?add-to-cart=1340';
      }

      setTimeout(() => { window.location.href = redirectUrl; }, 100);

    }

  }

});

function closeMainButton(){

  tierSelect = false;

  actionButton.classList.remove('clicked');
  offerText.classList.remove('visible');

  closePopup();
}