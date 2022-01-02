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
                onClick: event => {
                }
            }, ...config
        };
        let $active;
        $(this).each(function(){
            const $wrapper = $(this);
            const $triggers = $wrapper.find(options.trigger);


            // indicator
            $wrapper.prepend('<i class="btn-group-indicator"></i>');
            const $indicator = $wrapper.find('.btn-group-indicator');

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
                options.onClick(event);
                activate($(this));
            });
        });

        return {
            get: () => $active,
            getType: () => $active.attr('data-type')
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
                step: 5,
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
        const $wrapper = $this.parent();

        // labels
        $wrapper.append(`<div class="range-slider-label min edge">${min()}</div>`);
        $wrapper.append(`<div class="range-slider-label max edge">${max()}</div>`);
        $wrapper.append(`<div class="range-slider-label val">${val()}</div>`);

        // methods
        const set = (number) => {
            $this.val(number);
            change();
        };
        const change = () => {
            options.onChange({target: this, val: val()});
            updateLabels();
        };
        const updateLabels = () => {
            const thumbHalfWidth = 15 * 0.5;
            const left = (((val() - min()) / (max() - min())) * (($this.width() - thumbHalfWidth) - thumbHalfWidth)) + thumbHalfWidth;

            $wrapper.find('.range-slider-label.min').text(min());
            $wrapper.find('.range-slider-label.max').text(max());
            $wrapper.find('.range-slider-label.val').text(val());
            $wrapper.find('.range-slider-label.val').css('left', `${left}px`);
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
                delay: 700, // ms
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