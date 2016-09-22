# jQuery Verbose Calendar


From the original author (John Patrick Given) [github.com/iamjpg](https://github.com/iamjpg):
```
Why another jQuery calendar? I needed something very specific for a personal project which led me to created this calendar. After making it I thought it was pretty neat-o :)

Perhaps someone else will find it useful.
```
Yes, now I do find it useful and so I am having my own fork.

This is also my first proper (and possibly actively maintained) open source project

# Credit

The original plugin uses Tipsy (http://onehackoranother.com) and jQuery.ScrollTo (http://flesler.blogspot.com/2007/10/jqueryscrollto.html). For Tipsy, I have updated the calendar to use Bootstrap Tooltip. Reason being Tipsy is not actively maintained anymore and Bootstrap Tooltip is the brain child of the Tipsy, share the same look and feel and have similar options to Tipsy.

# Installation
Bower:
```
bower install jquery-verbose-calendar
```
Composer (with extra package fxp/composer-asset-plugin)
```
composer require bower-asset/jquery-verbose-calendar
```

# Usage
```javascript
    $(document).ready(function() {
    	$("#calendar-container").calendar({
			tipsy_gravity: 's', // How do you want to anchor the tipsy notification? (n / s / e / w)
			click_callback: function(date) {
                console.log(date);
            }, // Callback to return the clicked date object
			year: "2012", // Optional start year, defaults to current year - pass in a year - Integer or String
			scroll_to_date: false // Scroll to the current day?
		});
	});
 ```

NOTE: the current usage example is sourced from the original version. While it still work, as far as I hand tested. If things it is broken, please do raise a ticket and let me know.
# Options

| Option | Possible Value | Default | Explanation |
| --- | --- | --- | --- |
| year | | | The year you want to display in (also ref: start_date and end_date) |
| tipsy_gravity | 'n','e','w','s' | 's' | tipsy_gravity become a fallback, but only support 'n','e','w','s'. because that's what supported in bootstrap |
| tooltip_placement | 'top','bottom','left','right' | 'top' | The new tipsy_gravity option and it take precedent than tooltip_placement. if using tooltip_placement, this will become the option to feed to bootstrap tooptip library |
| scroll_to_date | true, false | true | this option is set to true for backward compatibility purpose because the original plugin is default to true |
| show_arrows | true, false | true | As the option implied. (also ref: start_date and end_date) |
| highlight_today | true, false | true | As the option implied. (also ref: start_date and end_date) |
| month_array || ['January', 'February', 'March', 'April', 'May', 'June',            'July', 'August', 'September', 'October', 'November', 'December'] | To customise what text to show for the months. Note: Must be 12 of them or things will turn funny |
| cell_show_speed || 3 | The speed coefficuent determines how fast/slow the date cells and month cells shows up |
| start_date ||||
| end_date ||||

# License (MIT)

Copyright (C) 2012~2016 John Patrick Given, phena109

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

