function forms() {
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
}

module.exports = forms;
