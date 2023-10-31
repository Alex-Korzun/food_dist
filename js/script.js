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

    new MenuItem(
        'img/tabs/vegy.jpg',
        'vegy', 
        'Меню "Фитнес"', 'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        6,
        '.menu .container'
        ).buildMenu();

    new MenuItem(
        'img/tabs/elite.jpg',
        'elite',
        'Меню “Премиум”', 'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        15,
        '.menu .container'
        ).buildMenu();

    new MenuItem(
        'img/tabs/post.jpg',
        'post',
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        12,
        '.menu .container'
        ).buildMenu();

    // Forms
    const forms = document.querySelectorAll('form'),
        messages = {loading: 'img/form/spinner.svg',
                    success: 'Successfully send! We will contact you soon.',
                    failure: 'Something went wrong.'};

    forms.forEach(item => {
        postData(item);
    });

    function postData (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const loadingSpinner = document.createElement('img');
            loadingSpinner.src = messages.loading;
            loadingSpinner.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', loadingSpinner);

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');

            const data = new FormData(form);

            request.send(data);

            request.addEventListener('load', () => {
                if (request.status === 200) {
                    showSuccessModal(messages.success);
                    form.reset();
                    loadingSpinner.remove();
                } else {
                    showSuccessModal(messages.failure);
                }
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
});
