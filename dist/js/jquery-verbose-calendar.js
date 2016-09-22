/*
 * jquery-verbose-calendar v0.2.0 - 2016-09-22
 * https://github.com/phena109/jQuery-Verbose-Calendar#readme

MIT License

Copyright (C) 2016 phena109

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */
(function ($, window, document) {
    'use strict';

    // Globals
    var pluginName = 'calendar';
    var pl = null;
    var d = new Date();

    var current = {
        year: d.getFullYear(),
        month: d.getMonth(),
        day_of_month: d.getDate()
    };

    var start_moment = function() {
        var output = new Date(d.getFullYear(), 0, 1);
        return output;
    };

    var end_moment = function() {
        var output = new Date(d.getFullYear(), 11, 31, 23, 59, 59);
        return output;
    };

    // Defaults
    var defaults = {
        year: d.getFullYear(), // The year you want to display in (also ref: start_date and end_date)
        // tipsy_gravity become a fallback, but only support 'n','e','w','s'
        // because that's what supported in bootstrap
        tipsy_gravity: null,
        tooltip_placement: 'top',
        scroll_to_date: true,
        //
        // === New options ===
        show_arrows: true,
        highlight_today: true,
        month_array: [
            // Must be 12 of them or things will turn funny
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
        // using the start and end date you won't be able use the 'year' option
        // anymore because they conflict each other conceptually
//        start_date: start_moment(),
//        end_date: end_moment()
    };

    var month_days = [
        /*
        J   F   M   A   M   J   J   A   S   O   N   D */
        31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
    ];

    // Main Plugin Object
    function Calendar(element, options) {

        var tipsy_fallback_map = {
            // Tipsy's direction is relative to the tip itself rather than
            // the element.
            n: 'auto bottom',
            e: 'auto left',
            w: 'auto right',
            s: 'auto top'
        };

        pl = this;
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;

        // Old tipsy opion fallback handling code
        if (this.options.tipsy_gravity !== null) {
            var placement = this.options.tipsy_gravity.substr(0, 1);
            this.options.tooltip_placement = tipsy_fallback_map[placement];
        }

        // Begin
        this.init();
    }

    $.extend(Calendar.prototype, {
        init: function () {
            // Call print - who knows, maybe more will be added to the init function...
            this.print();
        },
        print: function (year) {
            // Pass in any year you damn like.
            var the_year = (year) ? parseInt(year) : parseInt(pl.options.year);

            // First, clear the element
            $(this.element).empty();

            $('.cell').css({
                display: 'none'
            });

            // Set reference for calendar DOM object
            var $_calendar = $('<div class="calendar"></div>');

            // Append parent div to the element
            $(this.element).append($_calendar);

            // Let's append the year
            $.each(the_year.toString().split(''), function (i, o) {
                $_calendar.append('<div class="year"><span>' + o + '</span></div>');
            });

            if (pl.options.show_arrows) {

                // DOM object reference for arrows
                var _arrow_obj = $('<div class="arrows"></div>');
                _arrow_obj.append('<div class="next"></div>');
                _arrow_obj.append('<div class="prev"></div>');

                // Navigation arrows
                $_calendar.append(_arrow_obj);

            }

            // Add a clear for the floated elements
            $_calendar.append('<div class="clear-row"></div>');

            // Loop over the month arrays, loop over the characters in teh string, and apply to divs.
            $.each(pl.options.month_array, function (i, o) {

                var lco = o.toLowerCase();

                // Create a scrollto marker
                $_calendar.append("<div class='" + lco + "'></div>");

                $.each(pl.options.month_array[i].split(''), function (i, o) {

                    // Looping over characters, apply them to divs
                    $_calendar.append('<div class="cell bold"><span>' + o + '</span></div>');

                });

                // Add a clear for the floated elements
                $_calendar.append('<div class="clear-row"></div>');

                // Check for leap year
                if (i === 1) { // the second month of the year
                    if (pl.isLeap(the_year)) {
                        month_days[i] = 29;
                    } else {
                        month_days[i] = 28;
                    }
                }

                for (var j = 1; j <= parseInt(month_days[i]); j++) {

                    // Check for today
                    var today = '';
                    if ((pl.options.highlight_today) && (i === current.month) && (the_year === d.getFullYear())) {
                        if (j === current.day_of_month) {
                            today = 'today';
                        }
                    }

                    // Looping over numbers, apply them to divs
                    $_calendar.append("<div data-date='" + (parseInt(i) + 1) + '/' + j + '/' + the_year + "' class='cell day " + today + "'><span>" + j + '</span></div>');
                }

                // Add a clear for the floated elements
                $_calendar.append('<div class="clear-row"></div>');
            });

            // Loop over the elements and show them one by one.
            for (var k = 0; k < $('.cell').length; k++) {
                (function (j) {
                    setTimeout(function () {

                        // Fade the cells in
                        $($('.cell')[j]).fadeIn('fast', function () {

                            $(this).on('click', function () {
                                if (typeof pl.options.click_callback === 'function') {
                                    var d = $(this).attr('data-date').split("/");
                                    var dObj = {};
                                    dObj.day = d[1];
                                    dObj.month = d[0];
                                    dObj.year = d[2];
                                    pl.options.click_callback.call(this, dObj);
                                }
                            });
                        });

                    }, (k * 3));
                })(k);
            }

            // Scroll to month
            if (the_year === current.year && pl.options.scroll_to_date) {
                var print_finished = false;
                var print_check = setInterval(function () {
                    print_finished = true;
                    $.each($(".cell"), function () {
                        if ($(this).css("display") === "none") {
                            print_finished = false;
                        }
                    });
                    if (print_finished) {
                        clearInterval(print_check);
                        var _scrollTo = $(pl.element).find('.' + pl.options.month_array[current.month].toLowerCase());
                        $(window).scrollTo(_scrollTo, 800);
                    }
                }, 200);
            }

            // Bootstrap tooltip
            $('.cell').tooltip({
                placement: pl.options.tooltip_placement,
                title: function () {
                    return pl.returnFormattedDate($(this).attr('data-date'));
                }
            });
        },
        isLeap: function (year) {
            var leap = 0;
            leap = ((new Date(year, 1, 29).getMonth()) === 1);
            return leap;
        },
        returnFormattedDate: function (date) {
            var returned_date;
            var d = new Date(date);
            var da = d.getDay();

            if (da === 1) {
                returned_date = 'Monday';
            } else if (da === 2) {
                returned_date = 'Tuesday';
            } else if (da === 3) {
                returned_date = 'Wednesday';
            } else if (da === 4) {
                returned_date = 'Thursday';
            } else if (da === 5) {
                returned_date = 'Friday';
            } else if (da === 6) {
                returned_date = 'Saturday';
            } else if (da === 0) {
                returned_date = 'Sunday';
            }

            return returned_date;
        }
    });

    // Previous / Next Year on click events
    $(document).on('click', '.next', function () {
        pl.options.year = parseInt(pl.options.year) + 1;

        pl.print(pl.options.year);
    });

    $(document).on('click', '.prev', function () {
        pl.options.year = parseInt(pl.options.year) - 1;

        pl.print(pl.options.year);
    });

    // Plugin Instantiation
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Calendar(this, options));
            }
        });
    };

})(jQuery, window, document);
