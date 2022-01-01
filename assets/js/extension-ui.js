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
            };
            activate($triggers.eq(options.activeIndex));

            // on click
            $triggers.on('click', function(event){
                options.onClick(event);
                activate($(this));
            });
        });
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

            $wrapper.find('.range-slider-label.val').text(val());
            $wrapper.find('.range-slider-label.val').css('left', `${left}px`);
        };

        // on init
        updateLabels();

        // on change
        $this.on('change', change);

        // on drag
        $this.on('input', updateLabels);

        return {set, increase, decrease, val, change};
    };
});