jQuery(function($){
    jQuery.fn.buttonGroupEffect = function(config){
        const options = {
            ...{
                trigger: 'button',
                activeIndex: 0,
                onClick: event => {
                }
            }, ...config
        };
        $(this).each(function(){
            const $wrapper = $(this);
            const $triggers = $wrapper.find(options.trigger);


            // indicator
            $wrapper.append('<i class="btn-group-indicator"></i>');
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
});