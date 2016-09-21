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
        tipsy_gravity: 's',
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
        pl = this;
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;

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

            // Append parent div to the element
            $(this.element).append('<div id="calendar"></div>');

            // Set reference for calendar DOM object
            var $_calendar = $('#calendar');

            // Let's append the year
            $.each(the_year.toString().split(''), function (i, o) {
                $_calendar.append('<div class="year"><span>' + o + '</span></div>');
            });

            // Navigation arrows
            $_calendar.append('<div id="arrows"></div>');

            // DOM object reference for arrows
            var $_arrows = $('#arrows');
            $_arrows.append('<div class="next"></div>');
            $_arrows.append('<div class="prev"></div>');

            // Add a clear for the floated elements
            $_calendar.append('<div class="clear"></div>');

            // Loop over the month arrays, loop over the characters in teh string, and apply to divs.
            $.each(month_array, function (i, o) {

                // Create a scrollto marker
                $_calendar.append("<div id='" + o + "'></div>");

                $.each(month_array[i].split(''), function (i, o) {

                    // Looping over characters, apply them to divs
                    $_calendar.append('<div class="cell bold"><span>' + o + '</span></div>');

                });

                // Add a clear for the floated elements
                $_calendar.append('<div class="clear"></div>');

                // Check for leap year
                if (o === 'February') {
                    if (pl.isLeap(the_year)) {
                        month_days[i] = 29;
                    } else {
                        month_days[i] = 28;
                    }
                }

                for (var j = 1; j <= parseInt(month_days[i]); j++) {

                    //
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
                $_calendar.append('<div class="clear"></div>');
            });

            // Loop over the elements and show them one by one.
            for (var k = 0; k < $('.cell').length; k++) {
                (function (j) {
                    setTimeout(function () {

                        // Fade the cells in
                        $($('.cell')[j]).fadeIn('fast', function () {

                            // Set titles for tipsy once in DOM
                            $(this).attr('original-title', pl.returnFormattedDate($(this).attr('data-date')));

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

            // Tipsy
            $('.cell').tipsy({
                gravity: pl.options.tipsy_gravity
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



// DELETE THIS IF YOU ALREADY SOURCE TIPSY ------------------------------------
// tipsy, facebook style tooltips for jquery
// version 1.0.0a
// (c) 2008-2010 jason frame [jason@onehackoranother.com]
// released under the MIT license

(function ($) {

    function maybeCall(thing, ctx) {
        return (typeof thing == 'function') ? (thing.call(ctx)) : thing;
    }
    ;

    function Tipsy(element, options) {
        this.$element = $(element);
        this.options = options;
        this.enabled = true;
        this.fixTitle();
    }
    ;

    Tipsy.prototype = {
        show: function () {
            var title = this.getTitle();
            if (title && this.enabled) {
                var $tip = this.tip();

                $tip.find('.tipsy-inner')[this.options.html ? 'html' : 'text'](title);
                $tip[0].className = 'tipsy'; // reset classname in case of dynamic gravity
                $tip.remove().css({
                    top: 0,
                    left: 0,
                    visibility: 'hidden',
                    display: 'block'
                }).prependTo(document.body);

                var pos = $.extend({}, this.$element.offset(), {
                    width: this.$element[0].offsetWidth,
                    height: this.$element[0].offsetHeight
                });

                var actualWidth = $tip[0].offsetWidth,
                        actualHeight = $tip[0].offsetHeight,
                        gravity = maybeCall(this.options.gravity, this.$element[0]);

                var tp;
                switch (gravity.charAt(0)) {
                    case 'n':
                        tp = {
                            top: pos.top + pos.height + this.options.offset,
                            left: pos.left + pos.width / 2 - actualWidth / 2
                        };
                        break;
                    case 's':
                        tp = {
                            top: pos.top - actualHeight - this.options.offset,
                            left: pos.left + pos.width / 2 - actualWidth / 2
                        };
                        break;
                    case 'e':
                        tp = {
                            top: pos.top + pos.height / 2 - actualHeight / 2,
                            left: pos.left - actualWidth - this.options.offset
                        };
                        break;
                    case 'w':
                        tp = {
                            top: pos.top + pos.height / 2 - actualHeight / 2,
                            left: pos.left + pos.width + this.options.offset
                        };
                        break;
                }

                if (gravity.length == 2) {
                    if (gravity.charAt(1) == 'w') {
                        tp.left = pos.left + pos.width / 2 - 15;
                    } else {
                        tp.left = pos.left + pos.width / 2 - actualWidth + 15;
                    }
                }

                $tip.css(tp).addClass('tipsy-' + gravity);
                $tip.find('.tipsy-arrow')[0].className = 'tipsy-arrow tipsy-arrow-' + gravity.charAt(0);
                if (this.options.className) {
                    $tip.addClass(maybeCall(this.options.className, this.$element[0]));
                }

                if (this.options.fade) {
                    $tip.stop().css({
                        opacity: 0,
                        display: 'block',
                        visibility: 'visible'
                    }).animate({
                        opacity: this.options.opacity
                    });
                } else {
                    $tip.css({
                        visibility: 'visible',
                        opacity: this.options.opacity
                    });
                }
            }
        },
        hide: function () {
            if (this.options.fade) {
                this.tip().stop().fadeOut(function () {
                    $(this).remove();
                });
            } else {
                this.tip().remove();
            }
        },
        fixTitle: function () {
            var $e = this.$element;
            if ($e.attr('title') || typeof ($e.attr('original-title')) != 'string') {
                $e.attr('original-title', $e.attr('title') || '').removeAttr('title');
            }
        },
        getTitle: function () {
            var title, $e = this.$element,
                    o = this.options;
            this.fixTitle();
            var title, o = this.options;
            if (typeof o.title == 'string') {
                title = $e.attr(o.title == 'title' ? 'original-title' : o.title);
            } else if (typeof o.title == 'function') {
                title = o.title.call($e[0]);
            }
            title = ('' + title).replace(/(^\s*|\s*$)/, '');
            return title || o.fallback;
        },
        tip: function () {
            if (!this.$tip) {
                this.$tip = $('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>');
            }
            return this.$tip;
        },
        validate: function () {
            if (!this.$element[0].parentNode) {
                this.hide();
                this.$element = null;
                this.options = null;
            }
        },
        enable: function () {
            this.enabled = true;
        },
        disable: function () {
            this.enabled = false;
        },
        toggleEnabled: function () {
            this.enabled = !this.enabled;
        }
    };

    $.fn.tipsy = function (options) {

        if (options === true) {
            return this.data('tipsy');
        } else if (typeof options == 'string') {
            var tipsy = this.data('tipsy');
            if (tipsy) {
                tipsy[options]();
            }
            return this;
        }

        options = $.extend({}, $.fn.tipsy.defaults, options);

        function get(ele) {
            var tipsy = $.data(ele, 'tipsy');
            if (!tipsy) {
                tipsy = new Tipsy(ele, $.fn.tipsy.elementOptions(ele, options));
                $.data(ele, 'tipsy', tipsy);
            }
            return tipsy;
        }

        function enter() {
            var tipsy = get(this);
            tipsy.hoverState = 'in';
            if (options.delayIn == 0) {
                tipsy.show();
            } else {
                tipsy.fixTitle();
                setTimeout(function () {
                    if (tipsy.hoverState == 'in') {
                        tipsy.show();
                    }
                }, options.delayIn);
            }
        }
        ;

        function leave() {
            var tipsy = get(this);
            tipsy.hoverState = 'out';
            if (options.delayOut == 0) {
                tipsy.hide();
            } else {
                setTimeout(function () {
                    if (tipsy.hoverState == 'out') {
                        tipsy.hide();
                    }
                }, options.delayOut);
            }
        }
        ;

        if (!options.live)
            this.each(function () {
                get(this);
            });

        if (options.trigger != 'manual') {
            var binder = options.live ? 'live' : 'bind';
            var eventIn = options.trigger == 'hover' ? 'mouseenter' : 'focus';
            var eventOut = options.trigger == 'hover' ? 'mouseleave' : 'blur';
            this[binder](eventIn, enter)[binder](eventOut, leave);
        }

        return this;

    };

    $.fn.tipsy.defaults = {
        className: null,
        delayIn: 0,
        delayOut: 0,
        fade: false,
        fallback: '',
        gravity: 'n',
        html: false,
        live: false,
        offset: 0,
        opacity: 0.8,
        title: 'title',
        trigger: 'hover'
    };

    // Overwrite this method to provide options on a per-element basis.
    // For example, you could store the gravity in a 'tipsy-gravity' attribute:
    // return $.extend({}, options, {gravity: $(ele).attr('tipsy-gravity') || 'n' });
    // (remember - do not modify 'options' in place!)
    $.fn.tipsy.elementOptions = function (ele, options) {
        return $.metadata ? $.extend({}, options, $(ele).metadata()) : options;
    };

    $.fn.tipsy.autoNS = function () {
        return $(this).offset().top > ($(document).scrollTop() + $(window).height() / 2) ? 's' : 'n';
    };

    $.fn.tipsy.autoWE = function () {
        return $(this).offset().left > ($(document).scrollLeft() + $(window).width() / 2) ? 'e' : 'w';
    };

    /**
     * yields a closure of the supplied parameters, producing a function that takes
     * no arguments and is suitable for use as an autogravity function like so:
     *
     * @param margin (int) - distance from the viewable region edge that an
     *        element should be before setting its tooltip's gravity to be away
     *        from that edge.
     * @param prefer (string, e.g. 'n', 'sw', 'w') - the direction to prefer
     *        if there are no viewable region edges effecting the tooltip's
     *        gravity. It will try to vary from this minimally, for example,
     *        if 'sw' is preferred and an element is near the right viewable
     *        region edge, but not the top edge, it will set the gravity for
     *        that element's tooltip to be 'se', preserving the southern
     *        component.
     */
    $.fn.tipsy.autoBounds = function (margin, prefer) {
        return function () {
            var dir = {
                ns: prefer[0],
                ew: (prefer.length > 1 ? prefer[1] : false)
            },
            boundTop = $(document).scrollTop() + margin,
                    boundLeft = $(document).scrollLeft() + margin,
                    $this = $(this);

            if ($this.offset().top < boundTop)
                dir.ns = 'n';
            if ($this.offset().left < boundLeft)
                dir.ew = 'w';
            if ($(window).width() + $(document).scrollLeft() - $this.offset().left < margin)
                dir.ew = 'e';
            if ($(window).height() + $(document).scrollTop() - $this.offset().top < margin)
                dir.ns = 's';

            return dir.ns + (dir.ew ? dir.ew : '');
        };
    };

})(jQuery);
