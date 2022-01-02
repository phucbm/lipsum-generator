jQuery(function($){
    let quantityControl, typeControl, checkboxesControl, textTransformControl;
    const $btnCopyText = $('[data-copy-text]');
    const $btnCopySlug = $('[data-copy-slug]');
    const $outputWrapper = $('.output-wrapper');
    const $output = $('[data-output]');
    const $outputLength = $('[data-output-length]');
    const $range = $('input[data-quantity]');
    const rangeConfig = {
        'word': {quantity: 5, min: 1, max: 99},
        'sentence': {quantity: 3, min: 1, max: 15},
        'paragraph': {quantity: 2, min: 1, max: 10}
    };


    const set = (type = typeControl.getType(), quantity = quantityControl.val()) => {
        const options = {
            type, quantity, hasPrefix: checkboxesControl.is('prefix'),
            textTransform: textTransformControl.get()
        };
        const val = Lipsum.get(options);

        // set output
        $output.val(val);

        $outputLength.text(val.length);
    };

    /**
     * Change typeControl
     * @param type
     */
    const changeType = type => {
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
            quantityControl.updateLabels();
        }

        // output
        set(type);
    };


    // range slider > quantity
    quantityControl = $range.rangeSlider({onChange: () => set()});

    // button group > typeControl
    typeControl = $('.btn-group.is-indicator').buttonGroupEffect({
        onClick: event => changeType($(event.target).attr('data-type'))
    });

    // checkboxes > options
    checkboxesControl = $('[data-checkbox]').checkboxes({
        onChange: data => {
            if(data.checkbox === 'prefix'){
                set();
            }
        }
    });

    // select > textTransformControl
    textTransformControl = $('[data-text-transform]').dropdownControl({
        onChange: () => set()
    });

    // on load
    changeType('word');

    // button > copy text
    $btnCopyText.on('click', () => {
        copyValueToClipboard($output.val());
        $().toast({text: 'Text copied 🧡', wrapper: $outputWrapper});
    });

    // button > copy slug (type:word)
    $btnCopySlug.on('click', () => {
        copyValueToClipboard(stringToSlug($output.val()));
        $().toast({text: 'Slug copied 🧡', wrapper: $outputWrapper});
    });
});