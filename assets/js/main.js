jQuery(function($){
    let quantity, type;
    const $output = $('[data-output]');
    const $range = $('input[data-quantity]');
    const rangeConfig = {
        'word': {quantity: 5, min: 1, max: 99},
        'sentence': {quantity: 3, min: 1, max: 15},
        'paragraph': {quantity: 2, min: 1, max: 25}
    };


    const set = (type, quantity) => $output.val(Lipsum.get(type, quantity));
    const change = type => {
        // update range slider
        $range.attr('min', rangeConfig[type].min);
        $range.attr('max', rangeConfig[type].max);
        quantity.updateLabels();

        // output
        set(type, quantity.val());
    };


    // range slider > quantity
    quantity = $range.rangeSlider({
        onChange: data => set(type.get().attr('data-type'), data.val)
    });

    // button group > type
    type = $('.btn-group').buttonGroupEffect({
        onClick: event => change($(event.target).attr('data-type'))
    });

    // on load
    change('word');
});