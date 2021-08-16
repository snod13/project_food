'use strict';

document.addEventListener('DOMContentLoaded', () => {
  //Табы 
  const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

  function hideTabContent() {
    tabsContent.forEach(item => {
      item.classList.add('hide');
      item.classList.remove('show', 'fade');
    });

    tabs.forEach(item => {
      item.classList.remove('tabheader__item_active');
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].classList.add('show', 'fade');
    tabsContent[i].classList.remove('hide');
    tabs[i].classList.add('tabheader__item_active');
  }

  hideTabContent();
  showTabContent();

  tabsParent.addEventListener('click', (e) => {
    const target = e.target;

    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  //Таймер
  const deadline = '2021-08-11';

  function getTimeRemaining(endtime) {
    const t = Date.parse(endtime) - Date.parse(new Date()),
          days = Math.floor(t / (1000 * 60 * 60 * 24)),
          hours = Math.floor((t / (1000 * 60 * 60) % 24)),
          minutes = Math.floor((t / 1000 / 60) % 60),
          seconds = Math.floor((t / 1000) % 60);
    
    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
          days = timer.querySelector('#days'),
          hours = timer.querySelector('#hours'),
          minutes = timer.querySelector('#minutes'),
          seconds = timer.querySelector('#seconds'),
          timeInterval = setInterval(updateClock, 1000);
    
    updateClock();

    function updateClock() {
      const t = getTimeRemaining(endtime);

      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval);
        days.innerHTML = '0';
        hours.innerHTML = '0';
        minutes.innerHTML = '0';
        seconds.innerHTML = '0';
      }
    }
  }

  setClock('.timer', deadline);

  //Модальное окно
  const modal = document.querySelector('.modal'),
        trigerBtn = document.querySelectorAll('[data-modal]');

  function openModal() {
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimerId);
  }

  function closeModal() {
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  trigerBtn.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribute('data-close') == '') {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === "Escape" && modal.classList.contains('show')) {
      closeModal();
    }
  });

  const modalTimerId = setTimeout(openModal, 5000);

  function showModalByScroll() {
    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      openModal();
      window.removeEventListener('scroll', showModalByScroll);
    }
  }

  window.addEventListener('scroll', showModalByScroll);

  //Карточки
  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;    
      this.alt = alt;    
      this.title = title;    
      this.descr = descr;    
      this.price = price;
      this.transfer = 27;
      this.parent = document.querySelector(parentSelector);
      this.classes = classes;
      this.changeToUAH();    
    }

    changeToUAH() {
      this.price = this.price * this.transfer;
    }

    render() {
      const element = document.createElement('div');
      if (this.classes.length === 0) {
        this.classes = 'menu__item';
        element.classList.add(this.classes);
      } else {
        this.classes.forEach(className => element.classList.add(className));
      }
      element.innerHTML = `
          <img src=${this.src} alt=${this.alt}>
          <h3 class="menu__item-subtitle">${this.title}</h3>
          <div class="menu__item-descr">${this.descr}</div>
          <div class="menu__item-divider"></div>
          <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
          </div>
      `;
      this.parent.append(element);
    }
  }

  const getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Couldnt fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  };

  getResource('http://localhost:3000/menu')
    .then(data => {
      data.forEach(({img, altimg, title, descr, price}) => {
        new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
      });
    });

  // axios.get('http://localhost:3000/menu')
  //   .then(data => {
  //     data.data.forEach(({img, altimg, title, descr, price}) => {
  //             new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
  //           });
  //   });

  //Forms

  const forms = document.querySelectorAll('form');

  const message = {
    loading: 'icons/spinner.svg',
    success: 'Спасибо! Скоро мы с вами свяжемся',
    failure: 'Произошли технические шоколадки'
  };

  forms.forEach(form => {
    bindPostData(form);
  });

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: data
    });

    return await res.json();
  };

  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
      `;
      form.insertAdjacentElement('afterend', statusMessage);

      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData('http://localhost:3000/requests', json)
      .then(data => {
        console.log(data);
        showThanksModal(message.success);
        
        statusMessage.remove();
      }).catch(() => {
        showThanksModal(message.failure);
      }).finally(() => form.reset());
    });
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');

    prevModalDialog.classList.add('hide');
    openModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
      <div class="modal__content">
        <div class="modal__close" data-close>&times;</div>
        <div class="modal__title">${message}</div>
      </div>
    `;

    modal.append(thanksModal);
    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.add('show');
      prevModalDialog.classList.remove('hide');
      closeModal();
    }, 4000);
  }

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

  nextSlide.addEventListener('click', () => {
    if (offset == +width.slice(0, width.length - 2) * (slideImgs.length - 1)){
      offset = 0;
    } else {
      offset += +width.slice(0, width.length - 2);
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
      offset = +width.slice(0, width.length - 2) * (slideImgs.length - 1);
    } else {
      offset -= +width.slice(0, width.length - 2);
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
      offset = +width.slice(0, width.length - 2) * (slideTo - 1);

      slidesField.style.transform = `translateX(-${offset}px`;

      currentSlideChange(slideImgs, idSlide);

      dotChangeOpacity(dots, idSlide);
    });
  });

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
});