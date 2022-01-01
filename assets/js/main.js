jQuery(function($){
    // button group > select type
    $('.btn-group').buttonGroupEffect({
        onClick: event => {
            const type = $(event.target).attr('data-type');
            if(type){
                console.log(type)
            }
        }
    });

    // range slider > quantity
    const quantityRange = $('input[data-quantity]').rangeSlider({
        onChange: data => {
            console.log(data)
        }
    });
    setInterval(() => {
        quantityRange.increase()
    }, 1000)
});