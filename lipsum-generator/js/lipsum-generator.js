(function ($) {
    "use strict";

    let obj = {}, settings = {}, helpers = {}, textTransform = {};

    /**
     * Helper functions
     */
    helpers = {
        capitalize: function (string, force) {
            string = force ? string.toLowerCase() : string;
            return string.replace(/(\b)([a-zA-Z])/g,
                function (firstLetter) {
                    return firstLetter.toUpperCase();
                });
        },
        capitalizeFirstLetter: function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        // return array of words from string
        parseString: function (string) {
            return string.replace(/[^a-zA-Z ]/g, '').trim().split(' ');
        },
        // get a random integer in range [min;max]
        random: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        // get a random word
        getWord: function () {
            const sourceArray = helpers.parseString(settings.source);
            return sourceArray[helpers.random(0, sourceArray.length - 1)];
        },
    };


    /**
     * Text transform
     */
    textTransform = {
        list: [
            'capitalizeFirstWordInSentence',
            'uppercase', 'capitalize', 'lowercase'
        ],
        lowercase: false,
        capitalizeFirstWordInSentence: false,
        uppercase: false,
        capitalize: false,
        // set active or return the active
        prioritize: function (type) {
            if (typeof type !== 'undefined') {
                // active the given one, reset others
                for (let i = 0; i < textTransform.list.length; i++) {
                    textTransform[textTransform.list[i]] = textTransform.list[i] === type;
                }
                return type;
            } else {
                // return the active one
                for (let i = 0; i < textTransform.list.length; i++) {
                    if (textTransform[textTransform.list[i]]) {
                        return textTransform.list[i];
                    }
                }
            }
        },
        update: function (type) {
            let string = settings.output.html();

            // if output has string
            if (string.length) {
                type = textTransform.prioritize(type);
                settings.log('apply <' + type + '> for current string');

                switch (type) {
                    case 'capitalizeFirstWordInSentence':
                        if (settings.mode === 'word') {
                            string = helpers.capitalizeFirstLetter(string.toLowerCase());
                        } else {
                            let sentences = string.toLowerCase().split('.'),
                                result = '';

                            for (let i = 0; i < sentences.length; i++) {
                                if (sentences[i].length) {
                                    if (sentences[i].charAt(0) === ' ') {
                                        // first letter is a white space
                                        result += ' ' + helpers.capitalizeFirstLetter(sentences[i].trim());
                                    } else if (sentences[i].charAt(0) === '\n' && sentences[i].charAt(1) === '\n') {
                                        // new lines
                                        result += '\n\n' + helpers.capitalizeFirstLetter(sentences[i].trim().replace(/(\r\n|\n|\r)/gm, ""));
                                    } else {
                                        result += helpers.capitalizeFirstLetter(sentences[i]);
                                    }
                                    result += '.';
                                }
                            }
                            string = result;
                        }
                        break;
                    case 'uppercase':
                        string = string.toUpperCase();
                        break;
                    case 'capitalize':
                        string = helpers.capitalize(string, true);
                        break;
                    default:
                        string = string.toLowerCase();
                }

                settings.setOutput(string);
            } else {
                console.warn('updateTextTransform() not execute due to empty string');
            }
        },

        // PREFIX

        hasPrefix: false,
        prefix: 'lorem ipsum dolor sit amet',

        // apply filter prefix for array of words
        filterPrefix: function (wordArray) {
            let prefixArray = helpers.parseString(textTransform.prefix);

            for (let i = 0; i < Math.min(wordArray.length, prefixArray.length); i++) {
                wordArray[i] = prefixArray[i];
            }

            return wordArray;
        },
    };


    /**
     * Settings and functions
     */
    settings = {
        dev: true,
        log: function (string) {
            if (settings.dev) {
                console.log(string);
            }
        },
        mode: 'word', // paragraph, sentence, word
        quantity: {
            'word': {number: 5, min: 1, max: 99},
            'sentence': {number: 3, from: 6, to: 12, min: 1, max: 15}, // from/to: number of words in a sentence
            'paragraph': {number: 2, from: 4, to: 8, min: 1, max: 25}, // from/to: number of sentences in a paragraph
        },
        // get quantity base on current mode
        getQuantity: function (data) {
            if (typeof data === 'undefined') {
                // return number by default
                return settings.quantity[settings.mode].number;
            } else {
                // return range from/to
                if (settings.mode !== 'word' && (data === 'from' || data === 'to')) {
                    return settings.quantity[settings.mode][data];
                }
            }
        },

        output: $('[data-lipsum-result]'), // jQuery element
        source: 'lorem ipsum dolor sit amet consectetur adipiscing elit integer nec odio praesent libero sed cursus ante dapibus diam nisi nulla quis sem at nibh elementum imperdiet duis sagittis mauris fusce tellus augue semper porta massa vestibulum lacinia arcu eget class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos curabitur sodales ligula in dignissim nunc tortor pellentesque aenean quam scelerisque maecenas mattis convallis tristique proin ut vel egestas porttitor morbi lectus risus iaculis suscipit luctus non ac turpis aliquet metus ullamcorper tincidunt euismod quisque volutpat condimentum velit nam urna neque a facilisi fringilla suspendisse potenti feugiat mi consequat sapien etiam ultrices justo eu magna lacus vitae pharetra auctor interdum primis faucibus orci et posuere cubilia curae molestie dui blandit congue pede facilisis laoreet donec viverra malesuada enim est pulvinar sollicitudin cras id nisl felis venenatis commodo ultricies accumsan pretium fermentum nullam purus aliquam mollis vivamus consectetuer si leo eros maximus gravida erat letius ex hendrerit lobortis tempus rutrum efficitur phasellus natoque penatibus magnis dis parturient montes nascetur ridiculus mus vehicula bibendum vulputate dictum finibus eleifend rhoncus placerat tempor ornare hac habitasse platea dictumst habitant senectus netus fames',

        /** Get array object in a certain quantity **/
        getWordArray: function (quantity) {
            let result = [], word = '';

            // loop until have enough quantity
            while (result.length < quantity) {
                word = helpers.getWord();

                if (!result.includes(word)) {
                    result.push(word);
                }
            }

            // add prefix
            if (textTransform.hasPrefix) {
                result = textTransform.filterPrefix(result);
            }

            return result;
        },
        getSentenceArray: function (quantity) {
            let result = [], words = [];

            // loop until have enough quantity
            while (result.length < quantity) {
                words = settings.getWordArray(helpers.random(settings.getQuantity('from'), settings.getQuantity('to')));
                result.push(words);
            }

            // add prefix
            if (textTransform.hasPrefix) {
                result[0] = textTransform.filterPrefix(result[0]);
            }

            return result;
        },
        getParagraphArray: function (quantity) {
            let result = [],
                sentences = [];

            // loop until have enough quantity
            while (result.length < quantity) {
                sentences = settings.getSentenceArray(helpers.random(settings.getQuantity('from'), settings.getQuantity('to')));
                result.push(sentences);
            }

            // add prefix
            if (textTransform.hasPrefix) {
                result[0][0] = textTransform.filterPrefix(result[0][0]);
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
                    word = helpers.capitalizeFirstLetter(word);
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
        generate: function (string) {
            let result = typeof string !== 'undefined' ? string : '',
                quantity;

            // generate new string if result is empty
            if (!result.length) {
                quantity = settings.getQuantity();
                switch (settings.mode) {
                    case 'word':
                        result = settings.getWordString(settings.getWordArray(quantity));
                        break;
                    case 'sentence':
                        result = settings.getSentenceString(settings.getSentenceArray(quantity));
                        break;
                    case 'paragraph':
                        result = settings.getParagraphString(settings.getParagraphArray(quantity));
                        break;
                    default:
                        console.warn('Undefined lipsum generate type.');
                }
                settings.log('generate new string, quantity=' + quantity);
            } else {
                settings.log('generate with given string');
            }


            settings.setOutput(result);

            result = textTransform.update();

            return result;
        },
        setOutput: function (result) {
            // assign result
            if (settings.output.length) {
                settings.output.html(result);
                settings.log('setOutput() successful');
                settings.log('------');
            } else {
                console.warn('Please set an output element.');
            }
        },
    };


    /**
     * Public methods
     */

    // $.lipsumGenerator.updateQuantity(number);
    obj.updateQuantity = function (number) {
        settings.log('updateQuantity: ' + number);
        settings.quantity[settings.mode].number = number;
    };

    // $.lipsumGenerator.updateMode(mode);
    obj.updateMode = function (mode) {
        settings.log('updateMode: ' + mode);
        settings.mode = mode;

        return settings.quantity[settings.mode];
    };

    // $.lipsumGenerator.generate();
    obj.generate = function () {
        obj.result = settings.generate();
    };

    // $.lipsumGenerator.get(data);
    obj.get = function (data) {
        if (typeof data === 'undefined') {
            // return all settings
            return settings;
        } else if (data === 'textTransform') {
            // return active text transform
            return textTransform.prioritize();
        }

        // return specific data
        return settings[data];
    };

    // $.lipsumGenerator.updateTextTransform(type);
    obj.updateTextTransform = function (type) {
        textTransform.update(type);
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

