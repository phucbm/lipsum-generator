/**
 * Lorem Ipsum Generator - Chrome extension
 * Copyright 2018 PHUCBM.COM
 */

app = {};
quantity = {};
output = {};
jQuery(document).ready(function ($) {
    /************************************
     * App
     ************************************/
    app.devstatus = true;
    app.log = function (text) {
        if (app.devstatus) console.log(text);
    };
    app.body = $('body.lorip2k18');

    /************************************
     * Types
     ************************************/

    /************************************
     * Quantity
     ************************************/
    quantity.$ = app.body.find('#quantity > input');
    quantity.$wrapper = app.body.find('#quantity');
    quantity.val = function () {
        return parseInt(quantity.$.val());
    };
    quantity.initRangeSlider = function () {
        quantity.$.ionRangeSlider({
            min: 1,
            max: 99
        });
    };
    quantity.initMouseWheelControl = function () {
        app.body.add(quantity.$wrapper).add(output.$).on('mousewheel', function (event) {
            if (event.deltaY > 0) {
                // Scroll up
                quantity.updateVal(quantity.val() + 1);
            } else {
                // Scroll down
                quantity.updateVal(quantity.val() - 1);
            }
        });
    };
    quantity.updateVal = function (val) {
        quantity.$.data("ionRangeSlider").update({
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
    output.$ = app.body.find('textarea#output');

    output.init = function () {
    };

    /************************************
     * Run app
     ************************************/
    app.build = function () {
        quantity.init();
    };
    app.build();

});