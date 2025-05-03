// Обёртываем в window, чтобы функция была глобальной
window.addPrevNextBtnsClickHandlers = function (emblaApi, prevBtn, nextBtn) {
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
