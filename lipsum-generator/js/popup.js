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
            $noti = $wrapper.find('[data-lipsum-noti]'),
            $checkboxUpdate = $wrapper.find('[data-lipsum-checkbox]');

        // init lipsum generator
        $.lipsumGenerator.init();

        // on button click
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

                // save mode
                $.lipsumGenerator.update('mode', $this.attr('data-lipsum-generate'));

                // run
                $.lipsumGenerator.generate();
            });

            // trigger word generate
            $buttons.eq(2).trigger('click');
        }

        // on range slider update
        if ($rangeSlider.length) {
            $rangeSlider.ionRangeSlider({
                onChange: function (data) {
                    // save quantity
                    $.lipsumGenerator.update('quantity', data.from);

                    // run
                    $.lipsumGenerator.generate();
                }
            });
        }

        // copy
        if ($copyTrigger.length) {
            $copyTrigger.click(function () {
                if ($.lipsumGenerator.get('output').html().length) {
                    $.lipsumGenerator.get('output').select();
                    document.execCommand("copy");

                    // push notification
                    if ($noti.length) {
                        $noti.addClass('active');
                        setTimeout(function () {
                            $noti.removeClass('active');
                        }, 1000);
                    }
                }
            });
        }

        // update settings
        $checkboxUpdate.click(function () {
            let $this = $(this),
                setting = $this.attr('data-lipsum-checkbox');
            $this.toggleClass('active');

            $.lipsumGenerator.update(setting, $this.hasClass('active'));
        });
    });
});