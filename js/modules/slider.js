function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {
    // Slider
    const slider = document.querySelector(container),
        images = slider.querySelectorAll(slide),
        sliderPrevBtn = slider.querySelector(prevArrow),
        sliderNextBtn = slider.querySelector(nextArrow),
        totalSlides = slider.querySelector(totalCounter),
        currentSlide = slider.querySelector(currentCounter),
        sliderWrapper = slider.querySelector(wrapper),
        sliderField = slider.querySelector(field),
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
}

export default slider;
