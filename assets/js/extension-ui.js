jQuery(function($){
    /**
     * Button Group Effect
     * @param config
     */
    $.fn.buttonGroupEffect = function(config){
        const options = {
            ...{
                trigger: '.btn',
                activeIndex: 0,
                onChange: () => {
                }
            }, ...config
        };
        let $active;
        const $wrapper = $(this);
        const $triggers = $wrapper.find(options.trigger);


        // indicator
        $wrapper.prepend('<i class="btn-group-indicator"></i>');
        const $indicator = $wrapper.find('.btn-group-indicator');

        const getButton = type => $triggers.filter(`[data-type="${type}"]`);
        const getType = () => $active.attr('data-type');

        // activate
        const activate = $trigger => {
            $trigger.addClass('active');
            $triggers.not($trigger).removeClass('active');

            $indicator.css({
                height: $trigger.outerHeight(),
                width: $trigger.outerWidth(),
                left: $trigger.parent().position().left + 'px',
            });

            $active = $trigger;
        };
        activate($triggers.eq(options.activeIndex));

        // on click
        $triggers.on('click', function(event){
            activate($(this));
            options.onChange({type: getType(), target: $(this), event});
        });

        return {
            set: type => activate(getButton(type)),
            get: () => $active,
            getType
        };
    };


    /**
     * Range Slider
     * @param config
     * @returns {*}
     */
    $.fn.rangeSlider = function(config){
        const $this = $(this);
        if($this.attr('type') !== 'range') return false;
        const options = {
            ...{
                step: 1,
                hasArrows: false,
                onChange: () => {
                }
            }, ...config
        };

        const val = () => parseInt($this.val());
        const min = () => parseInt($this.attr('min'));
        const max = () => parseInt($this.attr('max'));
        const increase = () => set(val() + options.step);
        const decrease = () => set(val() - options.step);

        // generate html
        $this.wrapAll('<div class="range-slider-inner">');
        const $wrapper = $this.closest('.range-slider');
        const $inner = $this.parent();

        // labels
        $inner.append(`<div class="range-slider-label min edge">${min()}</div>`);
        $inner.append(`<div class="range-slider-label max edge">${max()}</div>`);
        $inner.append(`<div class="range-slider-label val">${val()}</div>`);

        // arrows
        if(options.hasArrows){
            $wrapper.addClass('range-slider-has-arrows');
            $wrapper.prepend(`<div class="range-slider-arrow down"><button></button></div>`);
            $wrapper.append(`<div class="range-slider-arrow up"><button></button></div>`);

            $wrapper.find('.range-slider-arrow.down button').on('click', decrease);
            $wrapper.find('.range-slider-arrow.up button').on('click', increase);
        }

        // methods
        const set = (number, triggerEvent = true) => {
            $this.val(number);
            if(triggerEvent){
                change();
            }else{
                updateLabels();
            }
        };
        const change = () => {
            options.onChange({target: this, val: val()});
            updateLabels();
        };
        const updateLabels = () => {
            const thumbHalfWidth = 15 * 0.5;
            const left = (((val() - min()) / (max() - min())) * (($this.width() - thumbHalfWidth) - thumbHalfWidth)) + thumbHalfWidth;

            $inner.find('.range-slider-label.min').text(min());
            $inner.find('.range-slider-label.max').text(max());
            $inner.find('.range-slider-label.val').text(val());
            $inner.find('.range-slider-label.val').css('left', `${left}px`);
        };

        // on init
        updateLabels();

        // on change
        $this.on('change', change);

        // on drag
        $this.on('input', updateLabels);

        return {set, increase, decrease, val, change, updateLabels};
    };


    /**
     * Toast
     * @param config
     */
    $.fn.toast = function(config){
        const options = {
            ...{
                wrapper: $('body'),
                text: '',
                delay: 850, // ms
            }, ...config
        };
        const id = uniqueId();

        // html
        options.wrapper.append(`<div class="toast" id="${id}">${options.text}</div>`);
        const $toast = options.wrapper.find(`#${id}`);


        // position relative
        if(options.wrapper.css('position') === 'static'){
            options.wrapper.css('position', 'relative');
        }

        // show/hide
        setTimeout(() => {
            $toast.addClass('show');

            setTimeout(() => {
                $toast.addClass('vanish');

                setTimeout(() => {
                    $toast.detach();
                }, 300);
            }, options.delay);
        }, 1);
    }


    /**
     * Checkboxes
     * @param config
     * @returns {*}
     */
    $.fn.checkboxes = function(config){
        const $this = $(this);
        if($this.attr('type') !== 'checkbox') return false;
        const options = {
            ...{
                onChange: () => {
                }
            }, ...config
        };


        const getInput = checkbox => $this.filter(`[data-checkbox="${checkbox}"]`);
        const get = checkbox => {
            const $input = typeof checkbox === 'string' ? getInput(checkbox) : checkbox;
            return {
                isChecked: is(checkbox),
                checkbox: $input.attr('data-checkbox'),
                target: $input
            };
        };
        const set = (checkbox, isChecked) => {
            getInput(checkbox).prop("checked", isChecked);
            change();
        };
        const toggle = checkbox => set(checkbox, !is(checkbox));
        const is = checkbox => getInput(checkbox).is(':checked');
        const change = () => options.onChange(get($(this)));


        $this.on('change', change);

        return {get, set, toggle, is};
    };


    /**
     * Dropdown control
     * @param config
     * @returns {boolean|{set: set, get: (function(): *)}}
     */
    $.fn.dropdownControl = function(config){
        const $this = $(this);
        if(!$this.is('select')) return false;
        const options = {
            ...{
                onChange: () => {
                }
            }, ...config
        };

        const get = () => $this.val();
        const set = value => {
            $this.val(value);
            $this.trigger('change');
        };

        $this.on('change', () => {
            options.onChange(get());
        });

        return {get, set};
    }
});