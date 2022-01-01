jQuery(function($){
    // button group > select type
    $('.btn-group').buttonGroupEffect({
        onClick: event => {
            const type = $(event.target).attr('data-type');
            if(type){
                $().toast({
                    text: type
                });
                if(type === 'word'){
                    console.log(Lipsum.getWords(10))
                }
                if(type === 'sentence'){
                    console.log(Lipsum.getSentences(3))
                }
                if(type === 'paragraph'){
                    console.log(Lipsum.getParagraphs(2))
                }
            }
        }
    });

    // range slider > quantity
    const quantityRange = $('input[data-quantity]').rangeSlider({
        onChange: data => {
            console.log(data)
        }
    });
});