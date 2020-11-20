import $ from 'jquery';

if ($.fn.findBack === undefined) {
    $.fn.extend({
        findBack: selector => this.find(selector).addBack(selector),
    });
}
