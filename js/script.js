window.addEventListener('DOMContentLoaded', () => {

    // Tabs
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

    function showContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showContent();

    tabsParent.addEventListener('click', (e) => {
        const target = e.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showContent(i);
                }
            });
        }
    });

    // Timer
    const deadline = '2023-12-31';

    function getTimeRemaining(endtime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());

        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor(t / 1000) % 60;

        }

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(number) {
        if (number >= 0 && number < 10) {
            return `0${number}`;
        } else {
            return number;
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
            }
        }
    }

    setClock('.timer', deadline);

    // Modal
    const modalOpenButton = document.querySelectorAll('[data-modal]'),
        modalWindow = document.querySelector('.modal'),
        modalTimerId = setTimeout(openModalWindow, 10000);

    function openModalWindow() {
        modalWindow.classList.add('show');
        modalWindow.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    function closeModalWindow() {
        modalWindow.classList.add('hide');
        modalWindow.classList.remove('show');
        document.body.style.overflow = '';
    }

    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModalWindow();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    modalOpenButton.forEach(btn => {
        btn.addEventListener('click', openModalWindow);
    });

    modalWindow.addEventListener('click', (e) => {
        if (e.target === modalWindow || e.target.getAttribute('data-close') == '') {
            closeModalWindow();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modalWindow.classList.contains('show')) {
            closeModalWindow();
        }
    });

    window.addEventListener('scroll', showModalByScroll);

    // Classes
    class MenuItem {
        constructor(source, alt, itemSubtitle, itemDescription, itemTotal, parentSelector, ...classes) {
            this.source = source;
            this.alt = alt;
            this.itemSubtitle = itemSubtitle;
            this.itemDescription = itemDescription;
            this.itemTotal = itemTotal;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 36;
            this.changeToUAH();
        }

        buildMenu() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML += `
                <img src="${this.source}" alt="${this.alt}">
                <h3 class="menu__item-subtitle">${this.itemSubtitle}</h3>
                <div class="menu__item-descr">${this.itemDescription}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.itemTotal}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }

        changeToUAH() {
            this.itemTotal *= this.transfer;
        }
    }

    const getMenuInfo = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Couldn't fetch ${url}, status: $${res.status}`);
        }

        return await res.json();
    };

    getMenuInfo('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuItem(img, altimg,title, descr, price, '.menu .container').buildMenu();
            });
        });

    // Forms
    const forms = document.querySelectorAll('form'),
        messages = {loading: 'img/form/spinner.svg',
                    success: 'Successfully send! We will contact you soon.',
                    failure: 'Something went wrong.'};

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
                headers: {
                    'Content-type': 'application/JSON'
                },
                body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const loadingSpinner = document.createElement('img');
            loadingSpinner.src = messages.loading;
            loadingSpinner.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', loadingSpinner);

            const formData = new FormData(form);
            
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showSuccessModal(messages.success);
                    loadingSpinner.remove();
                }).catch(() => {
                    showSuccessModal(messages.failure);
                }).finally(() => {
                    form.reset();
                });
        });
    }

    function showSuccessModal(message) {
        const oldModalDialog = document.querySelector('.modal__dialog');

        oldModalDialog.classList.add('hide');
        openModalWindow();

        const successModal = document.createElement('div');
        successModal.classList.add('modal__dialog');
        successModal.innerHTML = `
            <div class="modal__content">
                <div data-close class="modal__close">&times;</div>
                <div class="modal__title">${message}</div>
            </div>    
        `;

        document.querySelector('.modal').append(successModal);
        setTimeout(() => {
            successModal.remove();
            oldModalDialog.classList.add('show');
            oldModalDialog.classList.remove('hide');
            closeModalWindow();
        }, 4000);
    }

    // Slider
    const slider = document.querySelector('.offer__slider'),
        images = slider.querySelectorAll('.offer__slide'),
        sliderPrevBtn = slider.querySelector('.offer__slider-prev'),
        sliderNextBtn = slider.querySelector('.offer__slider-next'),
        totalSlides = slider.querySelector('#total'),
        currentSlide = slider.querySelector('#current'),
        sliderWrapper = slider.querySelector('.offer__slider-wrapper'),
        sliderField = slider.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(sliderWrapper).width;

    let currentSlideIndex = 1,
        offset = 0;

    totalSlides.innerHTML = images.length < 10 ? `0${images.length}` : images.length;
    addZeroToNumber(currentSlide, currentSlideIndex);

    sliderField.style.width = 100 * images.length + '%';
    sliderField.style.display = 'flex';
    sliderField.style.transition = '0.5s all';

    sliderWrapper.style.overflow = 'hidden';

    images.forEach(image => {
        image.style.width = width;
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
        dots = [];
    indicators.classList.add('slider-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicators);

    for (let i = 0; i < images.length; i++) {
        const dot = document.createElement('li');

        dot.setAttribute('data-slide-to', i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
        if (i == 0) {
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }

    sliderNextBtn.addEventListener('click', () => {
        if (offset == turnToDigitAndReplace(width) * (images.length - 1)) {
            offset = 0;
        } else {
            offset += turnToDigitAndReplace(width);
        }
        switchOffset(sliderField, offset);

        if (currentSlideIndex === images.length) {
            currentSlideIndex = 1;
        } else {
            currentSlideIndex++;
        }
        addZeroToNumber(currentSlide, currentSlideIndex);
        switchDots(dots, currentSlideIndex);
    });

    sliderPrevBtn.addEventListener('click', () => {
        if (offset == 0) {
            offset = turnToDigitAndReplace(width) * (images.length - 1);
        } else {
            offset -= turnToDigitAndReplace(width);
        }
        switchOffset(sliderField, offset);

        if (currentSlideIndex === 1) {
            currentSlideIndex = images.length;
        } else {
            currentSlideIndex--;
        }
        addZeroToNumber(currentSlide, currentSlideIndex);
        switchDots(dots, currentSlideIndex);
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = +e.target.getAttribute('data-slide-to');

            currentSlideIndex = slideTo;
            offset = turnToDigitAndReplace(width) * (slideTo - 1);

            switchOffset(sliderField, offset);
            addZeroToNumber(currentSlide, currentSlideIndex);
            switchDots(dots, currentSlideIndex);
        });
    });

    function addZeroToNumber(slide, index) {
        slide.innerHTML = index < 10 ? `0${index}` : index;
    }

    function switchDots(arr, index) {
        arr.forEach(dot => dot.style.opacity = '.5');
        arr[index - 1].style.opacity = 1;
    }

    function switchOffset(sliderField, offset) {
        sliderField.style.transform = `translateX(-${offset}px)`;
    }

    function turnToDigitAndReplace(str) {
        return +str.replace(/\D/g, '');
    }

    // Calculator
    const result = document.querySelector('.calculating__result span');

    let sex, height, weight, age, ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', sex);
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', ratio);
    }

    function calculateTotalCcal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____';
            return;
        }

        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 *height) - (5.7 * age)) * ratio);
        }
    }

    calculateTotalCcal();

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(element => {
            element.classList.remove(activeClass);
            if (element.getAttribute('id') === localStorage.getItem('sex')) {
                element.classList.add(activeClass);
            }
            if (element.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                element.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function getStaticInfo(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(element => {
            element.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', ratio);
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', sex);
                }
    
                elements.forEach(element => {
                    element.classList.remove(activeClass);
                });
                e.target.classList.add(activeClass);
    
                calculateTotalCcal();
            });
        });
    }

    getStaticInfo('#gender div', 'calculating__choose-item_active');
    getStaticInfo('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDynamicInfo(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';
            }

            switch(input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
                
            }

            calculateTotalCcal();
        });
    }

    getDynamicInfo('#height');
    getDynamicInfo('#weight');
    getDynamicInfo('#age');
});
