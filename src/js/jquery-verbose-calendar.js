(function ($, window, document) {
    'use strict';

    // Globals
    var pluginName = 'calendar';
    var pl = null;
    var d = new Date();

    // Defaults
    var defaults = {
        d: d,
        year: d.getFullYear(),
        today: d.getDate(),
        month: d.getMonth(),
        current_year: d.getFullYear(),
        // tipsy_gravity become a fallback, but only support 'n','e','w','s'
        // because that's what supported in bootstrap
        tipsy_gravity: null,
        tooltip_placement: 'top',
        scroll_to_date: true
    };

    var month_array = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    var month_days = [
        '31', // jan
        '28', // feb
        '31', // mar
        '30', // apr
        '31', // may
        '30', // june
        '31', // july
        '31', // aug
        '30', // sept
        '31', // oct
        '30', // nov
        '31' // dec
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

            // DOM object reference for arrows
            var _arrow_obj = $('<div class="arrows"></div>');
            _arrow_obj.append('<div class="next"></div>');
            _arrow_obj.append('<div class="prev"></div>');

            // Navigation arrows
            $_calendar.append(_arrow_obj);

            // Add a clear for the floated elements
            $_calendar.append('<div class="clear-row"></div>');

            // Loop over the month arrays, loop over the characters in teh string, and apply to divs.
            $.each(month_array, function (i, o) {

                var lco = o.toLowerCase();

                // Create a scrollto marker
                $_calendar.append("<div class='" + lco + "'></div>");

                $.each(month_array[i].split(''), function (i, o) {

                    // Looping over characters, apply them to divs
                    $_calendar.append('<div class="cell bold"><span>' + o + '</span></div>');

                });

                // Add a clear for the floated elements
                $_calendar.append('<div class="clear-row"></div>');

                // Check for leap year
                if (lco === 'february') {
                    if (pl.isLeap(the_year)) {
                        month_days[i] = 29;
                    } else {
                        month_days[i] = 28;
                    }
                }

                for (var j = 1; j <= parseInt(month_days[i]); j++) {

                    // Check for today
                    var today = '';
                    if (i === pl.options.month && the_year === d.getFullYear()) {
                        if (j === pl.options.today) {
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
                                if (typeof pl.options.click_callback == 'function') {
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
            if (the_year === pl.options.current_year && pl.options.scroll_to_date) {
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
                        $(window).scrollTo($('#' + month_array[pl.options.month]), 800);
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
            leap = new Date(year, 1, 29).getMonth() == 1;
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
