/**
 * Button Group Effect
 * @param element - The wrapper element
 * @param config
 */
function buttonGroupEffect(element, config){
    const options = {
        ...{
            trigger: '.btn',
            activeIndex: 0,
            onChange: () => {
            }
        }, ...config
    };
    let active;
    const wrapper = element;
    const triggers = Array.from(wrapper.querySelectorAll(options.trigger));

    // indicator
    const indicator = document.createElement('i');
    indicator.className = 'btn-group-indicator';
    wrapper.prepend(indicator);

    const getButton = type => triggers.find(btn => btn.getAttribute('data-type') === type);
    const getType = () => active.getAttribute('data-type');

    // activate
    const activate = trigger => {
        trigger.classList.add('active');
        triggers.forEach(btn => {
            if(btn !== trigger) btn.classList.remove('active');
        });

        const parent = trigger.parentElement;
        indicator.style.height = trigger.offsetHeight + 'px';
        indicator.style.width = trigger.offsetWidth + 'px';
        indicator.style.left = parent.offsetLeft + 'px';

        active = trigger;
    };
    activate(triggers[options.activeIndex]);

    // on click
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (event) => {
            activate(trigger);
            options.onChange({type: getType(), target: trigger, event});
        });
    });

    return {
        set: type => activate(getButton(type)),
        get: () => active,
        getType
    };
}


/**
 * Range Slider
 * @param element - The input[type="range"] element
 * @param config
 * @returns {*}
 */
function rangeSlider(element, config){
    const input = element;
    if(input.getAttribute('type') !== 'range') return false;
    const options = {
        ...{
            step: 1,
            hasArrows: false,
            onChange: () => {
            }
        }, ...config
    };

    const val = () => parseInt(input.value);
    const min = () => parseInt(input.getAttribute('min'));
    const max = () => parseInt(input.getAttribute('max'));
    const increase = () => set(val() + options.step);
    const decrease = () => set(val() - options.step);

    // generate html - wrap input
    const innerDiv = document.createElement('div');
    innerDiv.className = 'range-slider-inner';
    input.parentNode.insertBefore(innerDiv, input);
    innerDiv.appendChild(input);

    const wrapper = input.closest('.range-slider');
    const inner = input.parentElement;

    // labels
    inner.insertAdjacentHTML('beforeend', `<div class="range-slider-label min edge">${min()}</div>`);
    inner.insertAdjacentHTML('beforeend', `<div class="range-slider-label max edge">${max()}</div>`);
    inner.insertAdjacentHTML('beforeend', `<div class="range-slider-label val">${val()}</div>`);

    // arrows
    if(options.hasArrows){
        wrapper.classList.add('range-slider-has-arrows');
        wrapper.insertAdjacentHTML('afterbegin', `<div class="range-slider-arrow down"><button></button></div>`);
        wrapper.insertAdjacentHTML('beforeend', `<div class="range-slider-arrow up"><button></button></div>`);

        wrapper.querySelector('.range-slider-arrow.down button').addEventListener('click', decrease);
        wrapper.querySelector('.range-slider-arrow.up button').addEventListener('click', increase);
    }

    // methods
    const set = (number, triggerEvent = true) => {
        input.value = number;
        if(triggerEvent){
            change();
        }else{
            updateLabels();
        }
    };
    const change = () => {
        options.onChange({target: input, val: val()});
        updateLabels();
    };
    const updateLabels = () => {
        const thumbHalfWidth = 15 * 0.5;
        const inputWidth = input.offsetWidth;
        const left = (((val() - min()) / (max() - min())) * ((inputWidth - thumbHalfWidth) - thumbHalfWidth)) + thumbHalfWidth;

        inner.querySelector('.range-slider-label.min').textContent = min();
        inner.querySelector('.range-slider-label.max').textContent = max();
        inner.querySelector('.range-slider-label.val').textContent = val();
        inner.querySelector('.range-slider-label.val').style.left = `${left}px`;
    };

    // on init
    updateLabels();

    // on change
    input.addEventListener('change', change);

    // on drag
    input.addEventListener('input', updateLabels);

    return {set, increase, decrease, val, change, updateLabels};
}


/**
 * Toast
 * @param config
 */
function toast(config){
    const options = {
        ...{
            wrapper: document.body,
            text: '',
            delay: 850, // ms
        }, ...config
    };
    const id = uniqueId();

    // html
    const toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.id = id;
    toastEl.textContent = options.text;
    options.wrapper.appendChild(toastEl);

    // position relative
    const wrapperPosition = window.getComputedStyle(options.wrapper).position;
    if(wrapperPosition === 'static'){
        options.wrapper.style.position = 'relative';
    }

    // show/hide
    setTimeout(() => {
        toastEl.classList.add('show');

        setTimeout(() => {
            toastEl.classList.add('vanish');

            setTimeout(() => {
                toastEl.remove();
            }, 300);
        }, options.delay);
    }, 1);
}


/**
 * Checkboxes
 * @param elements - NodeList of checkbox inputs
 * @param config
 * @returns {*}
 */
function checkboxes(elements, config){
    const inputs = Array.from(elements);
    if(inputs.length === 0 || inputs[0].getAttribute('type') !== 'checkbox') return false;
    const options = {
        ...{
            onChange: () => {
            }
        }, ...config
    };

    const getInput = checkbox => inputs.find(input => input.getAttribute('data-checkbox') === checkbox);
    const get = checkbox => {
        const input = typeof checkbox === 'string' ? getInput(checkbox) : checkbox;
        return {
            isChecked: is(input),
            checkbox: input.getAttribute('data-checkbox'),
            target: input
        };
    };
    const set = (checkbox, isChecked, trigger = true) => {
        const input = getInput(checkbox);
        if(input) input.checked = isChecked;
        if(trigger){
            change(input);
        }
    };
    const toggle = checkbox => set(checkbox, !is(checkbox));
    const is = checkbox => {
        const input = typeof checkbox === 'string' ? getInput(checkbox) : checkbox;
        return input ? input.checked : false;
    };
    const change = input => options.onChange(get(input));

    inputs.forEach(input => {
        input.addEventListener('change', function(){
            change(this);
        });
    });

    return {get, set, toggle, is};
}


/**
 * Dropdown control
 * @param element - The select element
 * @param config
 * @returns {boolean|{set: set, get: (function(): *)}}
 */
function dropdownControl(element, config){
    const select = element;
    if(select.tagName !== 'SELECT') return false;
    const options = {
        ...{
            onChange: () => {
            }
        }, ...config
    };

    const get = () => select.value;
    const set = (value, trigger = true) => {
        select.value = value;
        if(trigger){
            select.dispatchEvent(new Event('change'));
        }
    };

    select.addEventListener('change', () => {
        options.onChange(get());
    });

    return {get, set};
}