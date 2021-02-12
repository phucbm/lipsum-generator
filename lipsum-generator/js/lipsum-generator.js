(function ($) {
    "use strict";

    let obj = {},
        pluginActive = false,
        settings = {
            hasPrefix: false,
            prefix: 'lorem ipsum dolor sit amet',
            capitalizeFirstWordInSentence: true,
            uppercase: false,
            capitalize: false,
            quantity: 5,
            output: $('[data-lipsum-result]'), // jQuery element
            mode: 'word', // paragraph, sentence, word
            source: 'lorem ipsum dolor sit amet consectetur adipiscing elit integer nec odio praesent libero sed cursus ante dapibus diam nisi nulla quis sem at nibh elementum imperdiet duis sagittis mauris fusce tellus augue semper porta massa vestibulum lacinia arcu eget class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos curabitur sodales ligula in dignissim nunc tortor pellentesque aenean quam scelerisque maecenas mattis convallis tristique proin ut vel egestas porttitor morbi lectus risus iaculis suscipit luctus non ac turpis aliquet metus ullamcorper tincidunt euismod quisque volutpat condimentum velit nam urna neque a facilisi fringilla suspendisse potenti feugiat mi consequat sapien etiam ultrices justo eu magna lacus vitae pharetra auctor interdum primis faucibus orci et posuere cubilia curae molestie dui blandit congue pede facilisis laoreet donec viverra malesuada enim est pulvinar sollicitudin cras id nisl felis venenatis commodo ultricies accumsan pretium fermentum nullam purus aliquam mollis vivamus consectetuer si leo eros maximus gravida erat letius ex hendrerit lobortis tempus rutrum efficitur phasellus natoque penatibus magnis dis parturient montes nascetur ridiculus mus vehicula bibendum vulputate dictum finibus eleifend rhoncus placerat tempor ornare hac habitasse platea dictumst habitant senectus netus fames',
            wordsInASentence: {from: 8, to: 15,},
            sentencesInAParagraph: {from: 4, to: 8,},
            // return array of words from string
            parseString: function (string) {
                return string.replace(/[^a-zA-Z ]/g, '').trim().split(' ');
            },
            // get a random integer in range [min;max]
            random: function (min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            },
            capitalizeFirstLetter: function (string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            },
            // get a random word
            getWord: function () {
                const sourceArray = settings.parseString(settings.source);
                return sourceArray[settings.random(0, sourceArray.length - 1)];
            },
            // apply filter prefix for array of words
            filterPrefix: function (wordArray) {
                let prefixArray = settings.parseString(settings.prefix);

                for (let i = 0; i < Math.min(wordArray.length, prefixArray.length); i++) {
                    wordArray[i] = prefixArray[i];
                }

                return wordArray;
            },
            /** Get array object in a certain quantity **/
            getWordArray: function (quantity) {
                let result = [], word = '';

                // loop until have enough quantity
                while (result.length < quantity) {
                    word = settings.getWord();

                    if (!result.includes(word)) {
                        result.push(word);
                    }
                }

                // add prefix
                if (settings.hasPrefix) {
                    result = settings.filterPrefix(result);
                }

                return result;
            },
            getSentenceArray: function (quantity) {
                let result = [], words = [];

                // loop until have enough quantity
                while (result.length < quantity) {
                    words = settings.getWordArray(settings.random(settings.wordsInASentence.from, settings.wordsInASentence.to));
                    result.push(words);
                }

                // add prefix
                if (settings.hasPrefix) {
                    result[0] = settings.filterPrefix(result[0]);
                }

                return result;
            },
            getParagraphArray: function (quantity) {
                let result = [],
                    sentences = [];

                // loop until have enough quantity
                while (result.length < quantity) {
                    sentences = settings.getSentenceArray(settings.random(settings.sentencesInAParagraph.from, settings.sentencesInAParagraph.to));
                    result.push(sentences);
                }

                // add prefix
                if (settings.hasPrefix) {
                    result[0][0] = settings.filterPrefix(result[0][0]);
                }

                return result;
            },
            /** Get string from array object **/
            getWordString: function (object) {
                let result = '', space = '',
                    word;

                for (let i = 0; i < object.length; i++) {
                    word = object[i];

                    // format: capitalize
                    if (settings.capitalize) {
                        word = settings.capitalizeFirstLetter(word);
                    }

                    // format: uppercase
                    if (settings.uppercase) {
                        word = word.toUpperCase();
                    }

                    // convert
                    space = i > 0 ? ' ' : space;
                    result += space + word;
                }

                return result;
            },
            getSentenceString: function (object) {
                let result = '', space = '', period = '.',
                    words;

                for (let i = 0; i < object.length; i++) {
                    words = object[i];

                    // format
                    if (settings.capitalizeFirstWordInSentence) {
                        words[0] = settings.capitalizeFirstLetter(words[0]);
                    }

                    // convert
                    space = i > 0 ? ' ' : space;
                    result += space + settings.getWordString(words) + period;
                }

                return result;
            },
            getParagraphString: function (object) {
                let result = '', breakParagraph = '\n\n';

                for (let i = 0; i < object.length; i++) {
                    // convert
                    breakParagraph = i < object.length - 1 ? breakParagraph : '';
                    result += settings.getSentenceString(object[i]) + breakParagraph;
                }

                return result;
            },
            /** Generate lipsum base on settings **/
            generate: function () {
                let result = '';

                // generate
                switch (settings.mode) {
                    case 'word':
                        result = settings.getWordString(settings.getWordArray(settings.quantity));
                        break;
                    case 'sentence':
                        result = settings.getSentenceString(settings.getSentenceArray(settings.quantity));
                        break;
                    case 'paragraph':
                        result = settings.getParagraphString(settings.getParagraphArray(settings.quantity));
                        break;
                    default:
                        console.warn('Undefined lipsum generate type.');
                }

                // assign result
                if (settings.output.length) {
                    settings.output.html(result);
                } else {
                    console.warn('Please set an output element.');
                }

                return result;
            },
        };

    // Public Method: $.lipsumGenerator.init(options);
    obj.init = function (options) {
        pluginActive = true;
        obj.update(options);
    };

    // Public Method: $.lipsumGenerator.update(setting, value);
    obj.update = function (name, value) {
        settings[name] = value;
    };

    // Public Method: $.lipsumGenerator.generate();
    obj.generate = function () {
        obj.result = settings.generate();
    };

    // Public Method: $.lipsumGenerator.getOutput();
    obj.get = function (data) {
        return settings[data];
    };

    // APIs
    //obj.output = settings.output;

    // Events
    /*let scrollDirection = $.Event("scrollDirection");
    $w.trigger(scrollDirection);*/

    // assign to jQuery.lipsumGenerator if jQuery is loaded
    if (jQuery) {
        jQuery.lipsumGenerator = obj;
    }
})(jQuery);

