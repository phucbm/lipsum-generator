/**!
 * Lipsum Generator v3.0.0
 * https://github.com/phucbm/lipsum-generator
 * MIT License - Copyright (c) 2022 Minh-Phuc Bui
 */
;(function(Lipsum){
    const types = ['word', 'sentence', 'paragraph'];
    const sourceString = 'lorem ipsum dolor sit amet consectetur adipiscing elit integer nec odio praesent libero sed cursus ante dapibus diam nisi nulla quis sem at nibh elementum imperdiet duis sagittis mauris fusce tellus augue semper porta massa vestibulum lacinia arcu eget class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos curabitur sodales ligula in dignissim nunc tortor pellentesque aenean quam scelerisque maecenas mattis convallis tristique proin ut vel egestas porttitor morbi lectus risus iaculis suscipit luctus non ac turpis aliquet metus ullamcorper tincidunt euismod quisque volutpat condimentum velit nam urna neque a facilisi fringilla suspendisse potenti feugiat mi consequat sapien etiam ultrices justo eu magna lacus vitae pharetra auctor interdum primis faucibus orci et posuere cubilia curae molestie dui blandit congue pede facilisis laoreet donec viverra malesuada enim est pulvinar sollicitudin cras id nisl felis venenatis commodo ultricies accumsan pretium fermentum nullam purus aliquam mollis vivamus consectetuer si leo eros maximus gravida erat letius ex hendrerit lobortis tempus rutrum efficitur phasellus natoque penatibus magnis dis parturient montes nascetur ridiculus mus vehicula bibendum vulputate dictum finibus eleifend rhoncus placerat tempor ornare hac habitasse platea dictumst habitant senectus netus fames';
    const sourceArray = parseString(sourceString);
    const config = {
        'word': {quantity: 5, min: 1, max: 99},
        'sentence': {quantity: 3, from: 6, to: 12, min: 1, max: 15},
        'paragraph': {quantity: 2, from: 4, to: 8, min: 1, max: 25}
    };


    /**
     * Get array of word|sentence|paragraph
     * @param type
     * @param quantity
     * @returns {*}
     */
    function getArray(type = 'word', quantity = 5){
        if(!types.includes(type)){
            console.warn(`[${type}] is not supported!`);
            return;
        }

        quantity = quantity ?? config[type].quantity;
        const from = config[type].from;
        const to = config[type].to;
        const result = [];

        switch(type){
            case "word":
                let word = '';
                while(result.length < quantity){
                    word = sourceArray[random(0, sourceArray.length - 1)];
                    if(!result.includes(word)){
                        result.push(word);
                    }
                }
                break;
            case "sentence":
                while(result.length < quantity){
                    result.push(getArray('word', random(from, to)));
                }
                break;
            case "paragraph":
                while(result.length < quantity){
                    result.push(getArray('sentence', random(from, to)));
                }
                break;
        }

        return result;
    }


    /**
     * Get string from array of word|sentence|paragraph
     * @param type
     * @param quantity
     * @param array
     * @returns {string}
     */
    function getString(type = 'word', quantity = 5, array = []){
        array = array.length ? array : getArray(type, quantity);
        let result = '';

        switch(type){
            case "word":
                for(const word of array) result += word + ' ';
                break;
            case "sentence":
                for(const words of array){
                    result += capitalizeFirstLetter(getString("word", quantity, words)) + '. ';
                }
                break;
            case "paragraph":
                for(const sentences of array){
                    result += getString("sentence", quantity, sentences) + '\n\n';
                }
                break;
        }

        // remove the last white space
        result = result.trim();

        return result;
    }


    /**
     * Get lipsum
     * @param type
     * @param quantity
     * @returns {string}
     */
    Lipsum.get = (type = 'word', quantity = 5) => {
        return getString(type, quantity);
    };

})(window.Lipsum = window.Lipsum || {});