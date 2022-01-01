/**!
 * Lipsum Generator v3.0.0
 * https://github.com/phucbm/lipsum-generator
 * MIT License - Copyright (c) 2022 Minh-Phuc Bui
 */
;(function(Lipsum){
    const sourceString = 'lorem ipsum dolor sit amet consectetur adipiscing elit integer nec odio praesent libero sed cursus ante dapibus diam nisi nulla quis sem at nibh elementum imperdiet duis sagittis mauris fusce tellus augue semper porta massa vestibulum lacinia arcu eget class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos curabitur sodales ligula in dignissim nunc tortor pellentesque aenean quam scelerisque maecenas mattis convallis tristique proin ut vel egestas porttitor morbi lectus risus iaculis suscipit luctus non ac turpis aliquet metus ullamcorper tincidunt euismod quisque volutpat condimentum velit nam urna neque a facilisi fringilla suspendisse potenti feugiat mi consequat sapien etiam ultrices justo eu magna lacus vitae pharetra auctor interdum primis faucibus orci et posuere cubilia curae molestie dui blandit congue pede facilisis laoreet donec viverra malesuada enim est pulvinar sollicitudin cras id nisl felis venenatis commodo ultricies accumsan pretium fermentum nullam purus aliquam mollis vivamus consectetuer si leo eros maximus gravida erat letius ex hendrerit lobortis tempus rutrum efficitur phasellus natoque penatibus magnis dis parturient montes nascetur ridiculus mus vehicula bibendum vulputate dictum finibus eleifend rhoncus placerat tempor ornare hac habitasse platea dictumst habitant senectus netus fames';
    const sourceArray = parseString(sourceString);

    function capitalize(string, force){
        string = force ? string.toLowerCase() : string;
        return string.replace(/(\b)([a-zA-Z])/g, function(firstLetter){
            return firstLetter.toUpperCase();
        });
    }

    function capitalizeFirstLetter(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    // return array of words from string
    function parseString(string){
        return string.replace(/[^a-zA-Z ]/g, '').trim().split(' ');
    }

    // get a random integer in range [min;max]
    function random(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // get a random word
    function getWord(){
        return sourceArray[random(0, sourceArray.length - 1)];
    }


    function getArray(config){
        const options = {
            ...{
                type: 'word',
                quantity: 10,
                from: 5,
                to: 10
            }, ...config
        };
        const result = [];

        switch(options.type){
            case "word":
                let word = '';
                // loop until have enough quantity
                while(result.length < options.quantity){
                    word = getWord();
                    if(!result.includes(word)){
                        result.push(word);
                    }
                }
                break;
            case "sentence":
                let words = [];
                // loop until have enough quantity
                while(result.length < options.quantity){
                    words = getArray({type: 'word', quantity: random(options.from, options.to)});
                    result.push(words);
                }
                break;
            case "paragraph":
                let sentences = [];
                // loop until have enough quantity
                while(result.length < options.quantity){
                    sentences = getArray({type: 'sentence', quantity: random(options.from, options.to)});
                    result.push(sentences);
                }
                break;
        }

        return result;
    }

    function getString(config){
        const options = {
            ...{
                type: 'word',
                array: []
            }, ...config
        };
        let result = '';

        switch(options.type){
            case "word":
                for(const word of options.array){
                    result += word + ' ';
                }
                break;
            case "sentence":
                for(const words of options.array){
                    result += capitalizeFirstLetter(getString({type: 'word', array: words})) + '. ';
                }
                break;
            case "paragraph":
                for(const sentences of options.array){
                    result += getString({type: 'sentence', array: sentences}) + '\n\n';
                }
                break;
        }

        // remove the last white space
        result = result.trim();

        return result;
    }

    Lipsum.getWords = quantity => {
        return getString({
            type: 'word',
            array: getArray({type: 'word', quantity})
        });
    }


    Lipsum.getSentences = quantity => {
        return getString({
            type: 'sentence',
            array: getArray({type: 'sentence', quantity})
        });
    }

    Lipsum.getParagraphs = quantity => {
        return getString({
            type: 'paragraph',
            array: getArray({type: 'paragraph', quantity})
        });
    }

})(window.Lipsum = window.Lipsum || {});