/**
 * Lorem Ipsum Generator - Chrome extension
 * Copyright 2018 PHUCBM.COM
 */

app = {};
types = {};
quantity = {};
output = {};
options = {};
jQuery(document).ready(function ($) {
    /************************************
     * App
     ************************************/
    app.devstatus = true;
    app.log = function (text) {
        if (app.devstatus) console.log(text);
    };
    app.body = $('body.lorip2k18');
    app.sourceString = 'lorem ipsum dolor sit amet consectetur adipiscing elit integer nec odio praesent libero sed cursus ante dapibus diam nisi nulla quis sem at nibh elementum imperdiet duis sagittis mauris fusce tellus augue semper porta massa vestibulum lacinia arcu eget class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos curabitur sodales ligula in dignissim nunc tortor pellentesque aenean quam scelerisque maecenas mattis convallis tristique proin ut vel egestas porttitor morbi lectus risus iaculis suscipit luctus non ac turpis aliquet metus ullamcorper tincidunt euismod quisque volutpat condimentum velit nam urna neque a facilisi fringilla suspendisse potenti feugiat mi consequat sapien etiam ultrices justo eu magna lacus vitae pharetra auctor interdum primis faucibus orci et posuere cubilia curae molestie dui blandit congue pede facilisis laoreet donec viverra malesuada enim est pulvinar sollicitudin cras id nisl felis venenatis commodo ultricies accumsan pretium fermentum nullam purus aliquam mollis vivamus consectetuer si leo eros maximus gravida erat varius ex hendrerit lobortis tempus rutrum efficitur phasellus natoque penatibus magnis dis parturient montes nascetur ridiculus mus vehicula bibendum vulputate dictum finibus eleifend rhoncus placerat tempor ornare hac habitasse platea dictumst habitant senectus netus fames';
    app.random = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    app.getWords = function (quantity) {
        var minWord = 5, maxWord = 10,
            clone = app.sourceString.split(' '),
            result = '', key;

        // Random quantity if undefined
        if (typeof quantity === 'undefined') {
            quantity = app.random(minWord, maxWord);
        }
        while (quantity > 0 && clone.length >= 1) {
            // Get random word from source string
            key = app.random(0, clone.length - 1);
            result += clone[key];

            // If not last one, add connecting
            if (quantity !== 1) {
                result += ' ';
            }

            // Delete picked word to prevent duplicating
            clone.splice(key, 1);
            quantity--;
        }
        return result;
    };
    app.getSentences = function (quantity) {
        var minSentence = 2, maxSentence = 5,
            sentence = '',
            result = '';

        // Random quantity if undefined
        if (typeof quantity === 'undefined') {
            quantity = app.random(minSentence, maxSentence);
        }

        // Loop
        while (quantity > 0) {
            sentence = app.getWords();

            // Uppercase first letter
            sentence = sentence.substr(0, 1).toUpperCase() + sentence.substr(1);

            // Add full stop
            if (result.length === 0 && quantity === 1) {
                // A single sentence does not have full top
            } else {
                sentence += '.';
            }
            result += sentence;

            // If not last one, add connecting
            if (quantity !== 1) {
                result += ' ';
            }

            quantity--;
        }

        return result;
    };
    app.getParagraphs = function (quantity) {
        var result = [];

        // Loop get sentence
        while (quantity > 0) {
            result += app.getSentences();

            // If not last one, add connecting
            if (quantity !== 1) {
                result += '\n\n';
            }

            quantity--;
        }

        return result;
    };
    app.formatBeginWith = function (result) {
        var beginWithText = options.beginWith.text(),
            beginWithTextArray = beginWithText.split(' '),
            toBeFormattedArray = result.split(' '),
            toBeReplaced,
            sliceNum;

        // If result's words less than replace text
        if (toBeFormattedArray.length < beginWithTextArray.length) {
            sliceNum = toBeFormattedArray.length;
            beginWithText = beginWithText.split(/\s+/).slice(0, sliceNum).join(" ");
        }

        // Get the first n words
        toBeReplaced = result.split(/\s+/).slice(0, beginWithTextArray.length).join(" ");

        // Replace
        result = result.replace(toBeReplaced, beginWithText);

        return result;
    };

    /************************************
     * Types
     ************************************/
    types.$ = app.body.find("#types");
    types.$buttons = app.body.find("#types > button");
    types.$active = app.body.find("#types > button.active");
    types.getMax = function () {
        return parseInt(types.$active.attr('data-max'));
    };
    types.getType = function () {
        return types.$active.attr('data-type');
    };
    types.setActive = function ($button) {
        types.$buttons.removeClass('active');
        $button.addClass('active');
        types.$active = $button;
        quantity.resetRange();
        app.generateLorem();
    };
    // Change type on click
    types.$buttons.click(function () {
        types.setActive($(this));
    });
    types.initMouseWheelControl = function () {
        var begin = 0, end = types.$buttons.length - 1, currentIndex;
        types.$.on('mousewheel', function (event) {
            currentIndex = types.$active.index();
            // Value control
            if (event.deltaY > 0) {
                // Scroll up
                currentIndex++;
                if (currentIndex > end) {
                    currentIndex = end;
                }
            } else {
                // Scroll down
                currentIndex--;
                if (currentIndex < begin) {
                    currentIndex = begin;
                }
            }
            types.setActive(types.$buttons.eq(currentIndex));
        });
    };

    /************************************
     * Quantity
     ************************************/
    quantity.$ = app.body.find('input#quantity');
    quantity.$wrapper = app.body.find('#quantity-wrapper');
    quantity.getVal = function () {
        return parseInt(quantity.$.val());
    };
    quantity.onChange = function (method) {
        //app.log("method:" + method + " - val:" + quantity.getVal() + " - max:" + types.getMax());
        app.generateLorem();
    };
    quantity.initRangeSlider = function () {
        quantity.$.ionRangeSlider({
            min: 1,
            max: 99,
            onChange: function () {
                quantity.onChange('range');
            }
        });
        quantity.resetRange();
    };
    quantity.initMouseWheelControl = function () {
        quantity.$wrapper.on('mousewheel', function (event) {
            // Value control
            if (event.deltaY > 0) {
                // Scroll up
                quantity.setVal(quantity.getVal() + 1);
            } else {
                // Scroll down
                quantity.setVal(quantity.getVal() - 1);
            }

            // Trigger onchange
            quantity.onChange('mousewheel');
        });
    };
    quantity.setVal = function (val) {
        quantity.$.data("ionRangeSlider").update({
            from: val
        });
    };
    quantity.resetRange = function () {
        var max = types.getMax(),
            val = quantity.getVal() > max ? max : quantity.getVal();

        quantity.$.data("ionRangeSlider").update({
            min: 1,
            max: max,
            from: val
        });
    };
    quantity.init = function () {
        quantity.initRangeSlider();
        quantity.initMouseWheelControl();
    };

    /************************************
     * Output
     ************************************/
    output.$ = app.body.find('#output');
    output.$wrapper = app.body.find('#output-wrapper');

    output.setResult = function (result) {
        output.$.html(result);
    };
    output.clear = function () {
        output.$.html('');
    };
    output.$.click(function () {
        if($(this).val().length){
            output.$.select();
            document.execCommand("copy");
            app.body.toggleClass('result-copied');
            setTimeout(function () {
                app.body.toggleClass('result-copied');
            }, 800);
        }
    });

    /************************************
     * Options
     ************************************/
    options.$wrapper = app.body.find('#option-wrapper');
    options.beginWith = {};
    options.beginWith.$ = options.$wrapper.find('input#beginWith');
    options.beginWith.checked = function () {
        return options.beginWith.$.is(':checked');
    };
    options.beginWith.text = function () {
        return options.beginWith.$.attr('data-begin-text');
    };
    options.beginWith.$.click(function () {
        app.generateLorem();
    });

    /************************************
     * Run app
     ************************************/
    app.generateLorem = function () {
        var result;
        switch (types.getType()) {
            case 'word':
                result = app.getWords(quantity.getVal());
                break;
            case 'sentence':
                result = app.getSentences(quantity.getVal());
                break;
            case 'paragraph':
                result = app.getParagraphs(quantity.getVal());
                break;
            default:
                result = '';
                break;
        }

        // If is format begin with text
        if (options.beginWith.checked()) {
            result = app.formatBeginWith(result);
        }

        output.setResult(result);
    };

    app.build = function () {
        quantity.init();
        types.initMouseWheelControl();
        app.generateLorem();
    };
    app.build();

});