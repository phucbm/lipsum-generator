jQuery(function($){
    const $output = $('[data-output]');

    // button group > select type
    $('.btn-group').buttonGroupEffect({
        onClick: event => {
            const type = $(event.target).attr('data-type');
            $output.val(Lipsum.get(type, 1));
        }
    });

    // range slider > quantity
    const quantityRange = $('input[data-quantity]').rangeSlider({
        onChange: data => {
            console.log(data)
        }
    });
});