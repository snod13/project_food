function slider() {
  //Слайдер
  const prevSlide = document.querySelector('.offer__slider-prev'),
        nextSlide = document.querySelector('.offer__slider-next'),
        totalSlides = document.querySelector('#total'),
        currentSlide = document.querySelector('#current'),
        slideImgs = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;
  
  let idSlide = 1;
  let offset = 0;

  if (slideImgs.length < 10) {
    totalSlides.textContent = `0${slideImgs.length}`;
    currentSlide.textContent = `0${idSlide}`;
  } else {
    totalSlides.textContent = slideImgs.length;
    currentSlide.textContent = idSlide;
  }

  slidesField.style.width = 100 * slideImgs.length + '%';
  slidesField.style.display = 'flex';
  slidesField.style.transition = 'all 0.5s';

  slidesWrapper.style.overflow = 'hidden';

  slideImgs.forEach(slide => {
    slide.style.width = width;
  });

  slider.style.position = 'relative';

  const indicators = document.createElement('ol'),
        dots = [];

  indicators.classList.add('carousel-indicators');
  slider.append(indicators);

  for (let i = 0; i < slideImgs.length; i++) {
    const dot = document.createElement('li');
    dot.setAttribute('data-slide-to', i + 1);
    dot.classList.add('dot');
    if (i == 0){
      dot.style.opacity = 1;
    }
    indicators.append(dot);
    dots.push(dot);
  }

  function dotChangeOpacity(dots, id) {
    dots.forEach(dot => dot.style.opacity = '.5');
    dots[id - 1].style.opacity = '1';
  }

  function currentSlideChange(slides, id) {
    if (slides.length < 10) {
      currentSlide.textContent = `0${id}`;
    } else {
      currentSlide.textContent = id;
    }
  }

  function strToNum(str) {
    return +str.replace(/\D/g, '');
  }

  nextSlide.addEventListener('click', () => {
    if (offset == strToNum(width) * (slideImgs.length - 1)){
      offset = 0;
    } else {
      offset += strToNum(width);
    }

    slidesField.style.transform = `translateX(-${offset}px`;

    if (idSlide == slideImgs.length) {
      idSlide = 1;
    } else {
      idSlide ++;
    }

    currentSlideChange(slideImgs, idSlide);

    dotChangeOpacity(dots, idSlide);
  });

  prevSlide.addEventListener('click', () => {
    if (offset == 0){
      offset = strToNum(width) * (slideImgs.length - 1);
    } else {
      offset -= strToNum(width);
    }

    slidesField.style.transform = `translateX(-${offset}px`;

    if (idSlide == 1) {
      idSlide = slideImgs.length;
    } else {
      idSlide --;
    }

    currentSlideChange(slideImgs, idSlide);

    dotChangeOpacity(dots, idSlide);
  });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const slideTo = e.target.getAttribute('data-slide-to');

      idSlide = slideTo;
      offset = strToNum(width) * (slideTo - 1);

      slidesField.style.transform = `translateX(-${offset}px`;

      currentSlideChange(slideImgs, idSlide);

      dotChangeOpacity(dots, idSlide);
    });
  });
}

module.exports = slider;