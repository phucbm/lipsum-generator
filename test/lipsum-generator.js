jQuery(document).ready(function ($) {
    function lipsumGenerator(options) {
        // public
        let settings = $.extend({
            output: '', // jQuery element
            mode: 'word', // paragraph, sentence, word
            quantity: 5,
            capitalizeFirstWordInSentence: true,
            uppercase: false,
            capitalize: false,
        }, options);

        // private
        let lipsum = {
            source: 'lorem ipsum dolor sit amet consectetur adipiscing elit integer nec odio praesent libero sed cursus ante dapibus diam nisi nulla quis sem at nibh elementum imperdiet duis sagittis mauris fusce tellus augue semper porta massa vestibulum lacinia arcu eget class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos curabitur sodales ligula in dignissim nunc tortor pellentesque aenean quam scelerisque maecenas mattis convallis tristique proin ut vel egestas porttitor morbi lectus risus iaculis suscipit luctus non ac turpis aliquet metus ullamcorper tincidunt euismod quisque volutpat condimentum velit nam urna neque a facilisi fringilla suspendisse potenti feugiat mi consequat sapien etiam ultrices justo eu magna lacus vitae pharetra auctor interdum primis faucibus orci et posuere cubilia curae molestie dui blandit congue pede facilisis laoreet donec viverra malesuada enim est pulvinar sollicitudin cras id nisl felis venenatis commodo ultricies accumsan pretium fermentum nullam purus aliquam mollis vivamus consectetuer si leo eros maximus gravida erat letius ex hendrerit lobortis tempus rutrum efficitur phasellus natoque penatibus magnis dis parturient montes nascetur ridiculus mus vehicula bibendum vulputate dictum finibus eleifend rhoncus placerat tempor ornare hac habitasse platea dictumst habitant senectus netus fames',
            wordsInASentence: {from: 8, to: 15,},
            sentencesInAParagraph: {from: 4, to: 8,},
            // return source in array
            getSourceArray: function () {
                return lipsum.source.split(' ');
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
                const sourceArray = lipsum.getSourceArray();
                return sourceArray[lipsum.random(0, sourceArray.length - 1)];
            },
            // return an array of words
            getWordArray: function (quantity) {
                let result = [], word = '';

                // loop until have enough quantity
                while (result.length < quantity) {
                    word = lipsum.getWord();

                    if (!result.includes(word)) {
                        result.push(word);
                    }
                }

                return result;
            },
            // return an array of sentences
            getSentenceArray: function (quantity) {
                let result = [], words = [];

                // loop until have enough quantity
                while (result.length < quantity) {
                    words = lipsum.getWordArray(lipsum.random(lipsum.wordsInASentence.from, lipsum.wordsInASentence.to));
                    result.push(words);
                }

                return result;
            },
            // return an array of paragraphs
            getParagraphArray: function (quantity) {
                let result = [],
                    sentences = [];

                // loop until have enough quantity
                while (result.length < quantity) {
                    sentences = lipsum.getSentenceArray(lipsum.random(lipsum.sentencesInAParagraph.from, lipsum.sentencesInAParagraph.to));
                    result.push(sentences);
                }

                return result;
            },
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
            generate: function () {
                let result = '';

                switch (settings.mode) {
                    case 'word':
                        result = lipsum.getWordString(lipsum.getWordArray(settings.quantity));
                        break;
                    case 'sentence':
                        result = lipsum.getSentenceString(lipsum.getSentenceArray(settings.quantity));
                        break;
                    case 'paragraph':
                        result = lipsum.getParagraphString(lipsum.getParagraphArray(settings.quantity));
                        break;
                }

                settings.output.html(result);
            }
        }

        lipsum.generate();
    }


    // init
    $('[data-lipsum]').click(function (e) {
        e.preventDefault();
        let type = $(this).attr('data-lipsum');

        lipsumGenerator({
            output: $('#result'),
            mode: type,
            quantity: 2,
        });
    });
});