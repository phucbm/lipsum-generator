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
     * @returns {{val: (function(): number), set: set, change: (function(): *), increase: (function(): void), decrease: (function(): void)}}
     */
    $.fn.rangeSlider = function(config){
        if($(this).attr('type') !== 'range') return;

        const options = {
            ...{
                step: 5,
                onChange: () => {
                }
            }, ...config
        };

        const set = (number) => {
            $(this).val(number);
            change();
        };
        const change = () => options.onChange({target: this, val: val()});
        const val = () => parseInt($(this).val());
        const increase = () => set(val() + options.step);
        const decrease = () => set(val() - options.step);

        // on change
        $(this).on('change', change);

        return {set, increase, decrease, val, change};
    };
});