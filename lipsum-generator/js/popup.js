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

                // save setting
                $.lipsumGenerator.update('mode', $this.attr('data-lipsum-generate'));

                // generate
                $.lipsumGenerator.generate();
            });

            // trigger word generate
            $buttons.eq(0).trigger('click');
        }

        // QUANTITY: on range slider update
        if ($rangeSlider.length) {
            $rangeSlider.ionRangeSlider({
                onChange: function (data) {
                    // save setting
                    $.lipsumGenerator.update('quantity', data.from);

                    // generate
                    $.lipsumGenerator.generate();
                }
            });
        }

        // TEXT TRANSFORM: on check box change
        let $textTransform = $wrapper.find('[data-lipsum-text-transform]');
        $textTransform.click(function () {
            let $this = $(this),
                type = $this.attr('data-lipsum-text-transform');

            if (!$this.hasClass('active')) {
                $textTransform.removeClass('active');
                $this.addClass('active');

                // text transform
                $.lipsumGenerator.applyTextTransform(type);
            }
        });

        // COPY
        if ($copyTrigger.length) {
            $copyTrigger.click(function () {
                if ($.lipsumGenerator.get('output').html().length) {
                    $.lipsumGenerator.get('output').select();
                    document.execCommand("copy");

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