jQuery(document).ready(function ($) {
    function lipsumGenerator(options) {
        // public
        let settings = $.extend({
            wrapper: '', // jQuery element
            countCharacter: '', // jQuery element
            hasPrefix: false,
            prefix: 'lorem ipsum dolor sit amet',
            capitalizeFirstWordInSentence: true,
            uppercase: false,
            capitalize: false,
        }, options);

        // private
        let lipsum = {
            quantity: 5,
            output: settings.wrapper.find('[data-lipsum-result]'), // jQuery element
            copy: settings.wrapper.find('[data-lipsum-copy]'), // jQuery element
            button: settings.wrapper.find('[data-lipsum-generate]'), // jQuery element
            noti: settings.wrapper.find('[data-lipsum-noti]'), // jQuery element
            indicator: settings.wrapper.find('[data-lipsum-generate-indicator]'), // jQuery element
            range: settings.wrapper.find('[data-lipsum-range]'), // jQuery element
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
                const sourceArray = lipsum.parseString(lipsum.source);
                return sourceArray[lipsum.random(0, sourceArray.length - 1)];
            },
            // apply filter prefix for array of words
            filterPrefix: function (wordArray) {
                let prefixArray = lipsum.parseString(settings.prefix);

                for (let i = 0; i < Math.min(wordArray.length, prefixArray.length); i++) {
                    wordArray[i] = prefixArray[i];
                }

                return wordArray;
            },
            // count character
            countCharacter: function (string) {
                let count = string.length,
                    unit = ' character' + (count > 1 ? 's' : '');
                return count + unit;
            },
            /** Get array object in a certain quantity **/
            getWordArray: function (quantity) {
                let result = [], word = '';

                // loop until have enough quantity
                while (result.length < quantity) {
                    word = lipsum.getWord();

                    if (!result.includes(word)) {
                        result.push(word);
                    }
                }

                // add prefix
                if (settings.hasPrefix) {
                    result = lipsum.filterPrefix(result);
                }

                return result;
            },
            getSentenceArray: function (quantity) {
                let result = [], words = [];

                // loop until have enough quantity
                while (result.length < quantity) {
                    words = lipsum.getWordArray(lipsum.random(lipsum.wordsInASentence.from, lipsum.wordsInASentence.to));
                    result.push(words);
                }

                // add prefix
                if (settings.hasPrefix) {
                    result[0] = lipsum.filterPrefix(result[0]);
                }

                return result;
            },
            getParagraphArray: function (quantity) {
                let result = [],
                    sentences = [];

                // loop until have enough quantity
                while (result.length < quantity) {
                    sentences = lipsum.getSentenceArray(lipsum.random(lipsum.sentencesInAParagraph.from, lipsum.sentencesInAParagraph.to));
                    result.push(sentences);
                }

                // add prefix
                if (settings.hasPrefix) {
                    result[0][0] = lipsum.filterPrefix(result[0][0]);
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
                        word = lipsum.capitalizeFirstLetter(word);
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
                        words[0] = lipsum.capitalizeFirstLetter(words[0]);
                    }

                    // convert
                    space = i > 0 ? ' ' : space;
                    result += space + lipsum.getWordString(words) + period;
                }

                return result;
            },
            getParagraphString: function (object) {
                let result = '', breakParagraph = '\n\n';

                for (let i = 0; i < object.length; i++) {
                    // convert
                    breakParagraph = i < object.length - 1 ? breakParagraph : '';
                    result += lipsum.getSentenceString(object[i]) + breakParagraph;
                }

                return result;
            },
            /** Update all settings before generate **/
            updateSettings: function () {
                console.log(lipsum.mode);
            },
            /** Generate lipsum base on settings **/
            generate: function () {
                lipsum.updateSettings();

                let result = '';

                // generate
                switch (lipsum.mode) {
                    case 'word':
                        result = lipsum.getWordString(lipsum.getWordArray(lipsum.quantity));
                        break;
                    case 'sentence':
                        result = lipsum.getSentenceString(lipsum.getSentenceArray(lipsum.quantity));
                        break;
                    case 'paragraph':
                        result = lipsum.getParagraphString(lipsum.getParagraphArray(lipsum.quantity));
                        break;
                    default:
                        console.warn('Undefined lipsum generate type.');
                }

                // assign result
                if (lipsum.output) {
                    lipsum.output.html(result);
                } else {
                    console.warn('Please set an output element.');
                }

                // assign count
                if (settings.countCharacter.length) {
                    settings.countCharacter.html(lipsum.countCharacter(result));
                }
            },
            copyResultToClipboard: function () {
                if (lipsum.output.html().length) {
                    lipsum.output.select();
                    document.execCommand("copy");

                    // push notification
                    if (lipsum.noti.length) {
                        lipsum.noti.addClass('active');
                        setTimeout(function () {
                            lipsum.noti.removeClass('active');
                        }, 1000);
                    }
                }
            },
        }

        // on button click
        if (lipsum.button.length) {
            lipsum.button.click(function (e) {
                e.preventDefault();
                let $this = $(this);

                lipsum.button.removeClass('active');
                $this.addClass('active');

                // indicator
                if (lipsum.indicator.length) {
                    lipsum.indicator.css({
                        'width': $this.outerWidth() + 'px',
                        'left': $this.position().left + 'px',
                    });
                }

                // save mode
                lipsum.mode = $this.attr('data-lipsum-generate');

                // run
                lipsum.generate();
            });

            // trigger word generate
            lipsum.button.eq(2).trigger('click');
        }

        // on range slider update
        if (lipsum.range.length) {
            lipsum.range.ionRangeSlider({
                onChange: function (data) {
                    // save quantity
                    lipsum.quantity = data.from;

                    // run
                    lipsum.generate();
                }
            });
        }

        // copy
        if (lipsum.copy.length) {
            lipsum.copy.click(function () {
                lipsum.copyResultToClipboard();
            });
        }
    }


    $('.lipsum-generator').each(function () {
        let $wrapper = $(this);

        // init lipsum generator
        lipsumGenerator({
            wrapper: $wrapper,
        });
    });
});