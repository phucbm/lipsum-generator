/*
// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});

// The body of this function will be execuetd as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}
*/


jQuery(document).ready(function ($) {
    $('.lipsum-generator').each(function () {
        let $wrapper = $(this),
            $buttons = $wrapper.find('[data-lipsum-generate]'),
            $indicator = $wrapper.find('[data-lipsum-generate-indicator]'),
            $rangeSlider = $wrapper.find('[data-lipsum-range]'),
            $copyTrigger = $wrapper.find('[data-lipsum-copy]'),
            $noti = $wrapper.find('[data-lipsum-noti]');


        // QUANTITY: on range slider update
        if ($rangeSlider.length) {
            $rangeSlider.ionRangeSlider({
                onChange: function (data) {
                    // update quantity
                    $.lipsumGenerator.updateQuantity(data.from);

                    // generate
                    $.lipsumGenerator.generate();
                }
            });
        }

        // GENERATE MODE: on button click
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
                let data = $.lipsumGenerator.updateMode($this.attr('data-lipsum-generate'));

                // update range slider
                $rangeSlider.data("ionRangeSlider").update({
                    from: data.number,
                    min: data.min,
                    max: data.max,
                });

                // generate
                $.lipsumGenerator.generate();
            });

            // trigger word generate
            $buttons.eq(0).trigger('click');
        }

        // TEXT TRANSFORM: on check box change
        /*let $textTransform = $wrapper.find('[data-lipsum-text-transform]');
        $textTransform.click(function () {
            let $this = $(this),
                type = $this.attr('data-lipsum-text-transform');

            if (!$this.hasClass('active')) {
                $textTransform.removeClass('active');
                $this.addClass('active');

                // update text transform
                $.lipsumGenerator.updateTextTransform(type);
            }
        });*/

        // update text transform default
        $.lipsumGenerator.updateTextTransform('capitalizeFirstWordInSentence');
        $wrapper.find('.lipsum-generator__quick-settings__text-transform select').on('change', function () {
            // update text transform
            $.lipsumGenerator.updateTextTransform($(this).val());
        });

        // NICE SELECT
        $('.lipsum-generator-select select').each(function () {
            $(this).niceSelect();
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
});