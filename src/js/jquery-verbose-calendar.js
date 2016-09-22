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

    var start_moment = function () {
        var output = new Date(d.getFullYear(), 0, 1);
        return output;
    };

    var end_moment = function () {
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
        // using the start and end date you won't be able use the 'year' and
        // 'show_arrows' option anymore because they conflict to each other
        // conceptually
        start_date: start_moment(),
        end_date: end_moment(),
        cell_show_speed: 3,
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
        this._register = {};

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
            if (this.mode() === 'range') {
                this.range_mode();
            } else {
                this.year_mode();
            }

            // Call print - who knows, maybe more will be added to the init function...
            this.print();
        },
        /**
         * Get the mode the plugin should operate in. This affects mainly how
         * the calendar is rendered
         * @returns {String} [year|range]
         */
        mode: function() {
            var _s = this.options.start_date;
            var _e = this.options.end_date;

            var c1 = (_e.getFullYear() - _s.getFullYear() === 0); // Same year
            var c2 = (_s.getMonth() === 0); // Jan
            var c3 = (_e.getMonth() === 11); // Dec

            var output = (c1 && c2 && c3) ? 'year' : 'range';

            return output;
        },
        year_mode: function() {
            this.set_year_element(this.options.start_date.getFullYear(), 0, 11);
        },
        range_mode: function() {
            var _s = this.options.start_date;
            var _e = this.options.end_date;
            var first_year_start_month = _s.getMonth();
            var last_year_end_month = _e.getMonth();

            for (var i = _s.getFullYear(); i <= _e.getFullYear(); i++) {
                if (i === _s.getFullYear()) {
                    this.set_year_element(i, first_year_start_month, 11);
                } else if (i === _e.getFullYear()) {
                    this.set_year_element(i, 0, last_year_end_month);
                } else {
                    this.set_year_element(i, 0, 11);
                }
            }
        },
        set_year_element: function (year, start_month, end_month) {

            // Set reference for calendar DOM object
            var $_calendar = $('<div class="calendar" data-year="' + year + '"></div>');

            // Let's append the year
            $.each(year.toString().split(''), function (i, o) {
                $_calendar.append('<div class="year"><span>' + o + '</span></div>');
            });

            // For future prove this should be put elsewhere, but putting here,
            // in most case, is fine.
            if ((this.mode() === 'year') && (pl.options.show_arrows === true)) {

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

                // If the current month is out of the month range, skip
                if (!((i >= start_month) && (i <= end_month))) {
                    return;
                }

                var lco = o.toLowerCase();

                // Create a scrollto marker
                $_calendar.append("<div class='" + lco + "'></div>");

                $.each(pl.options.month_array[i].split(''), function (i, o) {

                    // Looping over characters, apply them to divs
                    var $_month = $('<div class="cell bold"><span>' + o + '</span></div>');
                    $_calendar.append($_month);

                });

                // Add a clear for the floated elements
                $_calendar.append('<div class="clear-row"></div>');

                // Check for leap year
                if (i === 1) { // the second month of the year
                    if (pl.is_leap(year)) {
                        month_days[i] = 29;
                    } else {
                        month_days[i] = 28;
                    }
                }

                for (var j = 1; j <= parseInt(month_days[i]); j++) {

                    // Check for today
                    var today = '';
                    if ((pl.options.highlight_today) && (i === current.month) && (year === d.getFullYear())) {
                        if (j === current.day_of_month) {
                            today = 'today';
                        }
                    }

                    // Looping over numbers, apply them to divs
                    var $_day = $("<div data-date='" + (parseInt(i) + 1) + '/' + j + '/' + year + "' class='cell day " + today + "'><span>" + j + "</span></div>");
                    $_calendar.append($_day);
                }

                // Add a clear for the floated elements
                $_calendar.append('<div class="clear-row"></div>');
            });

            this._register[year] = $_calendar;
        },
        print: function(year) {
            var $element = $(this.element);
            var the_year = (year) ? parseInt(year) : parseInt(pl.options.year);

            // First, clear the element
            $element.empty();

            // Base on the mode, render differently
            if (this.mode() === 'range') {
                var container = $(this.element);

                $.each(this._register, function(idx,ele) {
                    container.append(ele);
                });
            } else {
                // The the register doesn't have the data yet, generate on the fly
                if (!this._register[the_year]) {
                    this.set_year_element(the_year, 0, 11);
                }

                $(this.element).append(this._register[the_year]);
            }

            // Loop over the elements and show them one by one.
            for (var k = 0; k < $('.cell').length; k++) {
                (function (j) {
                    setTimeout(function () {

                        // Fade the cells in
                        $($('.cell')[j]).fadeIn('fast');

                    }, (k * pl.options.cell_show_speed));
                })(k);
            }

            // Delegate the event handler
            $element.on('click', '.cell', function () {
                if (typeof pl.options.click_callback === 'function') {
                    var d = $(this).attr('data-date').split("/");
                    var dObj = {};
                    dObj.day = d[1];
                    dObj.month = d[0];
                    dObj.year = d[2];
                    pl.options.click_callback.call(this, dObj);
                }
            });

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
                        var _scrollTo = $(pl.element).find('.calendar[data-year=' + the_year + '] .' + pl.options.month_array[current.month].toLowerCase());
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
        is_leap: function (year) {
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
