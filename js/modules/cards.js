function cards() {
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
}

export default cards;
