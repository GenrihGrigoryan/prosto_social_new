const items = document.querySelectorAll('.carousel-item');
let currentIndex = 0;

function rotateCarousel() {
    const current = items[currentIndex];
    const nextIndex = (currentIndex + 1) % items.length;
    const next = items[nextIndex];

    current.classList.remove('active');
    current.classList.add('prev');

    next.classList.remove('next');
    next.classList.add('active');

    setTimeout(() => {
        current.classList.remove('prev');
        current.classList.add('next');
    }, 1000);

    currentIndex = nextIndex;

    setTimeout(rotateCarousel, 2000);
}

setTimeout(rotateCarousel, 2000);

const popup = document.getElementById('popup');

const popupContent = popup.querySelector('.popup-content');
const popupHeaderPanel = popup.querySelector('.popup-header-panel');
const popupTitle = popup.querySelector('.popup-header-title');
const contentContainer = popup.querySelector('#contentContainer');

const blurEl = popup.querySelector('.blur-layer');

var popupIsOpen = false;

function openPopup(title, iconId, contentFile, action, isEnabledBlur = true) {

    blurEl.style.display = isEnabledBlur ? 'block' : 'none';

    popupIsOpen = true;

    contentContainer.innerHTML = '';

    document.body.style.overflow = 'hidden';

    popupHeaderPanel.onclick = action;

    popupTitle.querySelector('span').textContent = title;

    popupTitle.querySelector('svg use').setAttribute('href', iconId);

    popup.classList.add('active');
    
    fetch(contentFile)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка загрузки файла: ${response.status}`);
            }
            return response.text();
        })
        .then(content => {
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
    
  popupContent.classList.remove('show');

  setTimeout(() => {
      blurEl.style.display = isEnabledBlur ? 'block' : 'none';

      contentContainer.innerHTML = '';

      popupTitle.querySelector('span').textContent = title;

      popupTitle.querySelector('svg use').setAttribute('href', iconId);

      popupHeaderPanel.onclick = action;

      fetch(contentFile)
          .then(response => {
              if (!response.ok) {
                  throw new Error(`Ошибка загрузки файла: ${response.status}`);
              }
              return response.text();
          })
          .then(content => {
              contentContainer.innerHTML = content;

              requestAnimationFrame(() => {
                  popupContent.classList.add('show');
              });
          })
          .catch(error => {
              console.error('Ошибка при загрузке содержимого:', error);
              contentContainer.innerHTML = `<p>Ошибка загрузки содержимого: ${error.message}</p>`;
          });

      popup.scrollTop = popupContent.scrollTop = contentContainer.scrollTop = 0;

  }, 300); 
}


function closePopup() {

  popupIsOpen = false;

    popupContent.classList.remove('show');
    
    setTimeout(() => {
        popup.style.opacity = '0';
        
        document.body.style.overflow = '';
        
        setTimeout(() => {
            popup.classList.remove('active');
            popup.style.opacity = ''; 
            
            contentContainer.innerHTML = '';

            popupContent.style.transition = '';
            popupContent.style.transform = '';
        }, 500); 
    }, 100);
}

function onToggleItem(item) {

    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    const contentInner = content.querySelector('.accordion-content-inner');
    
    const isActive = item.classList.toggle('active');
    
    if (isActive) {
        const height = contentInner.offsetHeight;
        content.style.maxHeight = `${height}px`;
    } else {
        content.style.maxHeight = '0px';
    }          
}

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

    embla.on('pointerDown', () => containerNode.classList.add('is-dragging'))
    embla.on('pointerUp', () => containerNode.classList.remove('is-dragging'))
    embla.on('pointerCancel', () => containerNode.classList.remove('is-dragging'))

    removeButtonHandlers = addPrevNextBtnsClickHandlers(
        embla,
        prevBtnNode,
        nextBtnNode
      )

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

    toggler.dataset.selected = index;

    options.forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');

    if (isVertical) {
        slider.style.transform = `translateY(${index * 100}%)`;
    } else {
        slider.style.transform = `translateX(${index * 100}%)`;
    }

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

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}


let isSubmitting = false;
const form = document.getElementById('paymentForm');

form.addEventListener('submit', function(e) {
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
      }
      else{
        isSubmitting = true;
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