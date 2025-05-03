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
// Листатель для десктопа

document.addEventListener('DOMContentLoaded', () => {
    // на тачах пусть будет нативный скролл

    const isLikelyMac = () => {
        if (navigator.userAgentData?.platform) {
          return navigator.userAgentData.platform.toLowerCase().includes('mac');
        }
        return navigator.userAgent.toLowerCase().includes('mac');
      };
    
    const isMacTrackpad = isLikelyMac() && window.matchMedia('(pointer: fine)').matches;

    if (window.matchMedia('(pointer: coarse)').matches) return;

    const viewport = document.querySelector('.embla__viewport');
    const container = viewport.querySelector('.embla__container');

    const embla = EmblaCarousel(viewport, {
      loop: false,
      align: 'start',
      dragFree: true,
      containScroll: 'trimSnaps',
      speed: 10,
      dragThreshold: 1
    });

    embla.on('pointerDown', ()  => container.classList.add('is-dragging'));
    embla.on('pointerUp',   ()  => container.classList.remove('is-dragging'));
    embla.on('pointerCancel', () => container.classList.remove('is-dragging'));
  });

/*
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.card-wrapper');
  
    if (window.matchMedia('(pointer: coarse)').matches) return;
  
    // Параметры подстройки
    const dragSensitivity   = 0.6;    // <1 — менее чувствительно, >1 — более
    const inertiaMultiplier = 0.8;    // <1 — инерция слабее
    const friction          = 0.0012; // чем больше — тем быстрее тормозит
  
    let pointerDown = false,
        startX = 0,
        scrollStart = 0,
        velocity = 0,
        lastTime = 0,
        lastX = 0,
        frame;
  
    const onDown = e => {
      pointerDown = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      scrollStart = slider.scrollLeft;
      lastX = e.pageX;
      lastTime = performance.now();
      velocity = 0;
      cancelAnimationFrame(frame);
      slider.setPointerCapture(e.pointerId);
    };
  
    const onMove = e => {
      if (!pointerDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const dx = x - startX;
      // применяем dragSensitivity
      slider.scrollLeft = scrollStart - dx * dragSensitivity;
  
      const now = performance.now();
      const dt = (now - lastTime) || 16;
      velocity = (e.pageX - lastX) / dt;
      lastX = e.pageX;
      lastTime = now;
    };
  
    const onUp = e => {
      if (!pointerDown) return;
      pointerDown = false;
      slider.classList.remove('active');
      slider.releasePointerCapture(e.pointerId);
  
      const step = () => {
        const now = performance.now();
        const dt = now - lastTime;
        lastTime = now;
  
        // инерционный с учётом множителя
        const move = velocity * dt * inertiaMultiplier;
        slider.scrollLeft -= move;
  
        // экспоненциальное трение
        velocity *= Math.exp(-friction * dt);
  
        // продолжать, пока скорость ощутима
        if (Math.abs(velocity) > 0.02) {
          frame = requestAnimationFrame(step);
        } else {
          // bounce
          const maxScroll = slider.scrollWidth - slider.clientWidth;
          let target = null;
          if (slider.scrollLeft < 0) target = 0;
          if (slider.scrollLeft > maxScroll) target = maxScroll;
          if (target !== null) {
            // простая анимация отскока
            const start = slider.scrollLeft;
            const dist  = target - start;
            const dur   = 300;
            let t0 = null;
            const easeOutCubic = t => (--t)*t*t+1;
            const animate = time => {
              if (!t0) t0 = time;
              const t = Math.min((time - t0)/dur, 1);
              slider.scrollLeft = start + dist * easeOutCubic(t);
              if (t < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          }
        }
      };
  
      frame = requestAnimationFrame(step);
    };
  
    slider.addEventListener('pointerdown',  onDown);
    slider.addEventListener('pointermove',  onMove, { passive: false });
    slider.addEventListener('pointerup',    onUp);
    slider.addEventListener('pointercancel', onUp);
  });
*/


