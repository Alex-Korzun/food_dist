import tabs from './modules/tabs';
import modal from './modules/modal';
import timer from './modules/timer';
import calculator from './modules/calculator';
import cards from './modules/cards';
import forms from './modules/forms';
import slider from './modules/slider';
import { openModalWindow } from './modules/modal';

window.addEventListener('DOMContentLoaded', () => {
    const modalTimerId = setTimeout(() => openModalWindow('.modal', modalTimerId), 10000);

    tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
    modal('[data-modal]', '.modal', modalTimerId);
    timer('.timer', '2023-12-31');
    cards();
    calculator();
    forms('form', modalTimerId);
    slider({
        container: '.offer__slider',
        nextArrow: '.offer__slider-next',
        slide: '.offer__slide',
        prevArrow: '.offer__slider-prev',
        totalCounter: '#total',
        currentCounter: '#current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner'
    });
});
