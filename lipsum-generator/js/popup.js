let chromeStorageOn = typeof chrome.storage !== 'undefined',
    chromeSettings = {
        mode: 'word', // paragraph, sentence, word
        quantity: {
            'word': {number: 5},
            'sentence': {number: 3},
            'paragraph': {number: 2},
        },
        textTransform: 'capitalizeFirstWordInSentence',
        hasPrefix: false,
    };

function saveSettings() {
    if (chromeStorageOn) {
        chrome.storage.sync.set({lipsum: chromeSettings}, function () {
            //console.log('saveSettings');
        });
    }
}

function loadSettings(callback) {
    chrome.storage.sync.get(['lipsum'], function (result) {
        // for global access
        $('body').attr('data-lipsum-settings', JSON.stringify(result.lipsum));
    });

    setTimeout(function () {
        chromeSettings = JSON.parse($('body').attr('data-lipsum-settings'));
        callback();
    }, 10);
}

jQuery(document).ready(function ($) {
    let $lipsum = $('.lipsum-generator');

    function lipsumApp() {
        $lipsum.each(function () {
            let $wrapper = $(this),
                $indicator = $wrapper.find('[data-lipsum-generate-indicator]'),
                $rangeSlider = $wrapper.find('[data-lipsum-range]'),
                $copyTrigger = $wrapper.find('[data-lipsum-copy]'),
                $noti = $wrapper.find('[data-lipsum-noti]');


            // TEXT TRANSFORM
            let $textTransformSelect = $wrapper.find('.lipsum-generator__quick-settings__text-transform select'),
                currentTextTransform = chromeStorageOn ?
                    chromeSettings.textTransform :
                    $.lipsumGenerator.get('textTransform');

            // load settings
            $.lipsumGenerator.updateTextTransform(currentTextTransform);
            $textTransformSelect.val(currentTextTransform);

            // on select change
            $textTransformSelect.on('change', function () {
                let newTextTransform = $(this).val();

                // update chrome storage
                chromeSettings.textTransform = newTextTransform;
                saveSettings();

                // update text transform
                $.lipsumGenerator.updateTextTransform(newTextTransform);
            });

            // NICE SELECT
            $('.lipsum-generator-select select').each(function () {
                $(this).niceSelect();
            });

            // QUANTITY: on range slider update
            if ($rangeSlider.length) {
                $rangeSlider.ionRangeSlider({
                    onChange: function (data) {
                        let newQuantity = data.from;

                        // update quantity
                        $.lipsumGenerator.updateQuantity(newQuantity);

                        // update chrome storage
                        chromeSettings.quantity[chromeSettings.mode].number = newQuantity;
                        saveSettings();

                        // generate
                        $.lipsumGenerator.generate();
                    }
                });
            }

            // MODE: on button click
            let $buttons = $wrapper.find('[data-lipsum-generate]');
            if ($buttons.length) {
                $buttons.click(function (e) {
                    e.preventDefault();
                    let $this = $(this);

                    $buttons.removeClass('active');
                    $this.addClass('active');

                    // indicator
                    if ($indicator.length) {
                        $indicator.css({
                            'width': $this.outerWidth() + 'px',
                            'left': $this.position().left + 'px',
                        });
                    }

                    // update mode and get quantity as return data
                    let newMode = $this.attr('data-lipsum-generate'),
                        data = $.lipsumGenerator.updateMode(newMode),
                        currentModeQuantity = chromeStorageOn ?
                            chromeSettings.quantity[newMode].number :
                            data.number;

                    // update quantity
                    $.lipsumGenerator.updateQuantity(currentModeQuantity);

                    // update chrome storage
                    chromeSettings.mode = newMode;
                    saveSettings();

                    // update range slider
                    $rangeSlider.data("ionRangeSlider").update({
                        from: currentModeQuantity,
                        min: data.min,
                        max: data.max,
                    });

                    // generate
                    $.lipsumGenerator.generate();
                });

                let currentMode = chromeStorageOn ? chromeSettings.mode : 'word';
                $wrapper.find('[data-lipsum-generate="' + currentMode + '"]').trigger('click');
            }

            // PREFIX
            let $prefixCheckbox = $wrapper.find('[data-lipsum-prefix]'),
                hasPrefix = chromeStorageOn ?
                    chromeSettings.hasPrefix :
                    $.lipsumGenerator.updatePrefix().hasPrefix;

            // set prefix text
            $wrapper.find('[data-lipsum-prefix-text]').text($.lipsumGenerator.updatePrefix().prefix);

            // update prefix status
            if (hasPrefix) {
                $prefixCheckbox.addClass('active');
            }
            $.lipsumGenerator.updatePrefix(hasPrefix);

            // on check box change
            $prefixCheckbox.click(function () {
                let $this = $(this);

                $this.toggleClass('active');
                $.lipsumGenerator.updatePrefix($this.hasClass('active'));

                // update chrome storage
                chromeSettings.hasPrefix = $this.hasClass('active');
                saveSettings();
            });

            // COPY
            if ($copyTrigger.length) {
                $copyTrigger.click(function () {
                    if ($.lipsumGenerator.get('output').html().length) {
                        $.lipsumGenerator.get('output').select();
                        document.execCommand("copy");
                        document.getSelection().removeAllRanges();

                        // push copy notification
                        if ($noti.length) {
                            $noti.addClass('active');
                            setTimeout(function () {
                                $noti.removeClass('active');
                            }, 1000);
                        }
                    }
                });
            }
        });
    }

    if (chromeStorageOn) {
        // get settings from chrome storage
        loadSettings(function () {
            // run in callback due to delay when load settings from chrome storage
            lipsumApp();
            setTimeout(function () {
                $lipsum.removeClass('loading');
            }, 50);
        });
    } else {
        lipsumApp();
        $lipsum.removeClass('loading');
    }
});