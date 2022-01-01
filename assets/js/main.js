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
});