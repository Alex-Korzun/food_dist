import { openModalWindow, closeModalWindow } from "./modal";
import { postData } from "../services/services";

function forms(formSelector, modalTimerId) {
    // Forms
    const forms = document.querySelectorAll(formSelector),
    messages = {loading: 'img/form/spinner.svg',
                success: 'Successfully send! We will contact you soon.',
                failure: 'Something went wrong.'};

    forms.forEach(item => {
        bindPostData(item);
    });

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
        openModalWindow('.modal', modalTimerId);

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
            closeModalWindow('.modal');
        }, 4000);
    }
}

export default forms;
