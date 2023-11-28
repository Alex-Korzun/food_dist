function openModalWindow(modalSelector, modalTimerId) {
    const modalWindow = document.querySelector(modalSelector);

    modalWindow.classList.add('show');
    modalWindow.classList.remove('hide');
    document.body.style.overflow = 'hidden';

    if (modalTimerId) {
        clearInterval(modalTimerId);
    }
}

function closeModalWindow(modalSelector) {
    const modalWindow = document.querySelector(modalSelector);

    modalWindow.classList.add('hide');
    modalWindow.classList.remove('show');
    document.body.style.overflow = '';
}

function modal(triggerSelector, modalSelector, modalTimerId) {
    // Modal
    const modalOpenButton = document.querySelectorAll(triggerSelector),
        modalWindow = document.querySelector(modalSelector);

    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModalWindow(modalSelector, modalTimerId);
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    modalOpenButton.forEach(btn => {
        btn.addEventListener('click', () => openModalWindow(modalSelector, modalTimerId));
    });

    modalWindow.addEventListener('click', (e) => {
        if (e.target === modalWindow || e.target.getAttribute('data-close') == '') {
            closeModalWindow(modalSelector);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modalWindow.classList.contains('show')) {
            closeModalWindow(modalSelector);
        }
    });

    window.addEventListener('scroll', showModalByScroll);
}

export default modal;
export {closeModalWindow};
export {openModalWindow};
