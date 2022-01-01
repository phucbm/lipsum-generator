jQuery(function($){
    let quantity, type;
    const $btnCopyText = $('[data-copy-text]');
    const $btnCopySlug = $('[data-copy-slug]');
    const $output = $('[data-output]');
    const $range = $('input[data-quantity]');
    const rangeConfig = {
        'word': {quantity: 5, min: 1, max: 99},
        'sentence': {quantity: 3, min: 1, max: 15},
        'paragraph': {quantity: 2, min: 1, max: 10}
    };


    const set = (type, quantity) => $output.val(Lipsum.get(type, quantity));
    const change = type => {
        // update button
        if(type === 'word'){
            $btnCopySlug.removeClass('disabled');
        }else{
            $btnCopySlug.addClass('disabled');
        }

        // update range slider
        if(rangeConfig[type]){
            $range.attr('min', rangeConfig[type].min);
            $range.attr('max', rangeConfig[type].max);
            quantity.updateLabels();
        }

        // output
        set(type, quantity.val());
    };


    // range slider > quantity
    quantity = $range.rangeSlider({
        onChange: data => set(type.get().attr('data-type'), data.val)
    });

    // button group > type
    type = $('.btn-group.is-indicator').buttonGroupEffect({
        onClick: event => change($(event.target).attr('data-type'))
    });

    // on load
    change('word');

    // button > copy text
    $btnCopyText.on('click', () => {
        copyValueToClipboard($output.val());
        $().toast({text: 'Text copied 🧡'});
    });

    // button > copy slug (type:word)
    $btnCopySlug.on('click', () => {
        copyValueToClipboard(stringToSlug($output.val()));
        $().toast({text: 'Slug copied 🧡'});
    });
});