/// <reference path="jquery-1.7.1-vsdoc.js" >

; (function (factory) {

    if (typeof define === 'function' && define.amd)
        define(['jquery', 'jquery.accessWidgetToolkit.core'], factory);
    else
        factory(jQuery);

} (function ($, undefined) {

    $.accessWidgetToolkit.defineWidget({

        _widgetName: 'AccessButton',

        _inheritsFrom: 'AbstractAccessWidget',

        _options: {
            type: 'command',
            pressed: false
        },

        _create: function () {
            this.jQuery.attr('tabindex', '0')
.attr('role', 'button');

            this._setAsToggleButtonIfApplicable();

            this._super();
        },

        _setAsToggleButtonIfApplicable: function () {
            if (this._options.type === 'toggle') {
                var self = this;

                self.jQuery.attr('aria-pressed', this._options.pressed);

                self.clickOrActivate(function () {
                    var currentState = self._options.pressed ? false : true;
                    $(this).attr('aria-pressed', currentState);
                    self._options.pressed = currentState;
                });
            }
        },

        destroy: function () {
            this.jQuery.removeAttr('tabindex role aria-pressed');

            this._super();
        }

    });

}));
