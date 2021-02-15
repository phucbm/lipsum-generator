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
        lowercase: true,
        capitalizeFirstWordInSentence: false,
        uppercase: false,
        capitalize: false,
        // set active or return the active
        prioritizeTextTransform: function (type) {
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
        applyTextTransform: function (type) {
            let string = settings.output.html();

            // if output has string
            if (string.length) {
                type = textTransform.prioritizeTextTransform(type);
                console.log('apply <' + type + '> for current string');

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
                console.warn('applyTextTransform() not execute due to empty string');
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
        mode: 'word', // paragraph, sentence, word
        quantity: 5,
        output: $('[data-lipsum-result]'), // jQuery element
        source: 'lorem ipsum dolor sit amet consectetur adipiscing elit integer nec odio praesent libero sed cursus ante dapibus diam nisi nulla quis sem at nibh elementum imperdiet duis sagittis mauris fusce tellus augue semper porta massa vestibulum lacinia arcu eget class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos curabitur sodales ligula in dignissim nunc tortor pellentesque aenean quam scelerisque maecenas mattis convallis tristique proin ut vel egestas porttitor morbi lectus risus iaculis suscipit luctus non ac turpis aliquet metus ullamcorper tincidunt euismod quisque volutpat condimentum velit nam urna neque a facilisi fringilla suspendisse potenti feugiat mi consequat sapien etiam ultrices justo eu magna lacus vitae pharetra auctor interdum primis faucibus orci et posuere cubilia curae molestie dui blandit congue pede facilisis laoreet donec viverra malesuada enim est pulvinar sollicitudin cras id nisl felis venenatis commodo ultricies accumsan pretium fermentum nullam purus aliquam mollis vivamus consectetuer si leo eros maximus gravida erat letius ex hendrerit lobortis tempus rutrum efficitur phasellus natoque penatibus magnis dis parturient montes nascetur ridiculus mus vehicula bibendum vulputate dictum finibus eleifend rhoncus placerat tempor ornare hac habitasse platea dictumst habitant senectus netus fames',
        wordsInASentence: {from: 8, to: 15,},
        sentencesInAParagraph: {from: 4, to: 8,},

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
                words = settings.getWordArray(helpers.random(settings.wordsInASentence.from, settings.wordsInASentence.to));
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
                sentences = settings.getSentenceArray(helpers.random(settings.sentencesInAParagraph.from, settings.sentencesInAParagraph.to));
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
            let result = typeof string !== 'undefined' ? string : '';

            // generate new string if result is empty
            if (!result.length) {
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
                console.log('generate new string, quantity=' + settings.quantity);
            } else {
                console.log('generate with given string');
            }


            settings.setOutput(result);

            result = textTransform.applyTextTransform();

            return result;
        },
        setOutput: function (result) {
            // assign result
            if (settings.output.length) {
                settings.output.html(result);
                console.log('setOutput() successful');
                console.log('------');
            } else {
                console.warn('Please set an output element.');
            }
        },
    };


    /**
     * Public methods
     */

    // $.lipsumGenerator.update(setting, value);
    obj.update = function (name, value) {
        console.log('update: settings[' + name + '] = ' + value);
        settings[name] = value;
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
            return textTransform.prioritizeTextTransform();
        }

        // return specific data
        return settings[data];
    };

    // $.lipsumGenerator.applyTextTransform(type);
    obj.applyTextTransform = function (type) {
        textTransform.applyTextTransform(type);
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

