/// <reference path="jquery-1.7.1-vsdoc.js" >
(function (factory) {

    if (typeof define === 'function' && define.amd)
        define(['jquery'], factory);
    else
        factory(jQuery);
} (function ($, undefined) {

    function AbstractAccessWidget() {

    }

    AbstractAccessWidget.prototype = {

        _widgetName: undefined,

        _inheritsFrom: undefined,

        _focusableElement: undefined,

        _options: {
            accessibleLabel: undefined,
            accessibleDescription: undefined,
            disabled: false
        },

        _init: function (jQueryOrElement, theOptions) {
            this.jQuery = jQueryOrElement instanceof jQuery ? jQueryOrElement : $(jQueryOrElement);
            this._defaultOptions = this._options;
            this._options = $.isPlainObject(theOptions) ?
 $.extend(true, {}, this._defaultOptions, theOptions) :
 $.extend(true, {}, this._defaultOptions);

            this._ensurePreconditions();
            this._create();
        },

        _ensurePreconditions: function () {

        },

        _create: function () {
            var accessibleLabel = this._options.accessibleLabel,
            accessibleDescription = this._options.accessibleDescription,
            disabled = this._options.disabled;

            this.setAccessibleLabel(accessibleLabel);
            this.setAccessibleDescription(accessibleDescription);

            if (disabled)
                this.disable();
        },

        destroy: function () {
            this._getFocusableElement().removeAttr('aria-labelledby aria-describedby aria-disabled');

            this.jQuery.off('.awt')
.removeData(uncapitalizeFirstLetter(this._widgetName))
.children('[id^="awt"]')
.remove();
        },

        getDefaultOptions: function () {
            return $.extend(true, {}, this._defaultOptions);
        },

        getOptions: function () {
            return $.extend(true, {}, this._options);
        },

        getAccessibleLabel: function () {
            return this._options.accessibleLabel;
        },

        setAccessibleLabel: function (theLabel) {
            if (typeof theLabel === 'string') {
                var theLabelElement = $('[id*="awt-label-"]', this.jQuery).first();

                if (theLabelElement.length === 0) {
                    var theId = 'awt-label-' + uniqueIdentifier();

                    theLabelElement = $('<label/>')
                .attr('id', theId)
                .addClass('awt-hidden-accessible')
                .prependTo(this.jQuery);

                    var labeledBy = this._getFocusableElement().attr('aria-labelledby') !== undefined ?
                theId + ' ' + this._getFocusableElement().attr('aria-labelledby') :
                theId;

                    this._getFocusableElement().attr('aria-labelledby', labeledBy);
                }

                theLabelElement.text(theLabel);
                this._options.accessibleLabel = theLabel;
            }

            return this;
        },

        _getFocusableElement: function () {
            return this._focusableElement === undefined ? this.jQuery : this._focusableElement;
        },

        getAccessibleDescription: function () {
            return this._options.accessibleDescription;
        },

        setAccessibleDescription: function (theDescription) {
            if (typeof theDescription === 'string') {
                var theDescriptionElement = $('[id*="awt-description-"]', this.jQuery).first();

                if (theDescriptionElement.length === 0) {
                    var theId = 'awt-description-' + uniqueIdentifier();

                    theDescriptionElement = $('<span/>')
                .attr('id', theId)
                .hide()
                .appendTo(this.jQuery);

                    var describedBy = this._getFocusableElement().attr('aria-describedby') !== undefined ?
                this._getFocusableElement().attr('aria-describedby') + ' ' + theId :
                theId;

                    this._getFocusableElement().attr('aria-describedby', describedBy);
                }

                theDescriptionElement.text(theDescription);
                this._options.accessibleDescription = theDescription;
            }

            return this;
        },

        enable: function () {
            this._getFocusableElement().attr('aria-disabled', false);
            this._options.disabled = false;

            return this;
        },

        disable: function () {
            this._getFocusableElement().attr('aria-disabled', true);
            this._options.disabled = true;

            return this;
        },

        isDisabled: function () {
            return this._options.disabled;
        },

        clickOrActivate: function (theCallback) {
            var self = this;

            self._getFocusableElement().on(self._getFullEventName('click'), function (event) {
                if (self.isDisabled())
                    event.stopImmediatePropagation();
                else
                    theCallback.call(this, event);
            })
    .on(self._getFullEventName('keydown'), function (event) {
        if (!keys.isSomeModifierKeyPressed(event) && (event.which == keys.ENTER || event.which == keys.SPACE)) {
            if (self.isDisabled())
                event.stopImmediatePropagation();
            else
                theCallback.call(this, event);
        }
    });

            return self;
        },

        _getFullEventName: function (theEventName) {
            return theEventName + '.awt.' + uncapitalizeFirstLetter(this._widgetName);
        },

        _triggerEventOrAddCallback: function (target, eventName, theCallback) {
            var fullEventName = this._getFullEventName(eventName);

            if (theCallback === undefined)
                target.trigger(fullEventName);
            else if ($.isFunction(theCallback))
                target.on(fullEventName, function (event) {
                    theCallback.call(this, event);
                });

            return this;
        },

        _error: function (message) {
            $.error('[' + this._widgetName + ': ' + message + ']');
        }

    };

    AbstractAccessWidget.extend = function (prototype) {
        var _super = this.prototype, mergedPrototype = new this();

        for (var name in prototype) {

            mergedPrototype[name] = $.isPlainObject(prototype[name]) &&
            $.isPlainObject(_super[name]) ?
            $.extend(true, {}, _super[name], prototype[name]) :

            $.isFunction(prototype[name]) &&
    $.isFunction(_super[name]) ?
    (function (name, theFunction) {

        return function () {
            var temporary = this._super, theReturn;

            this._super = _super[name];
            theReturn = theFunction.apply(this, Array.prototype.slice.call(arguments));
            this._super = temporary;

            return theReturn;
        }
    } (name, prototype[name])) :
    prototype[name];
        }

        function newWidget(jQueryOrElement, options) {
            if (arguments.length)
                this._init(jQueryOrElement, options);
        }

        newWidget.prototype = mergedPrototype;

        newWidget.constructor = newWidget;

        newWidget.extend = AbstractAccessWidget.extend;

        return newWidget;
    }

    var uniqueIdentifier = (function () {
        var s4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        return function () {
            var compoundId = [];

            for (var i = 0; i < 8; i++) {
                compoundId.push(s4());
            }

            return compoundId.join('');
        }
    } ());

    var keys = {

        TAB: 9,

        ENTER: 13,

        ESCAPE: 27,

        SPACE: 32,

        PAGE_UP: 33,

        PAGE_DOWN: 34,

        END: 35,

        HOME: 36,

        LEFT_ARROW: 37,

        UP_ARROW: 38,

        RIGHT_ARROW: 39,

        DOWN_ARROW: 40,

        SHIFT_TAB: function (event) {
            return event.shiftKey && event.which == this.TAB;
        },

        isSomeModifierKeyPressed: function (event) {
            return event.altKey || event.shiftKey || event.ctrlKey || event.metaKey;
        },

        getCharacterOrNull: function (event) {
            return String.fromCharCode(event.which);
        }

    };

    var widgetClasses = {
        AbstractAccessWidget: AbstractAccessWidget
    };

    function defineWidget(prototype) {
        assertPreconditions(prototype);

        var widgetName = $.trim(prototype._widgetName),
    baseWidgetName = $.trim(prototype._inheritsFrom),
    baseWidget = baseWidgetName === undefined ?
    widgetClasses.AbstractAccessWidget :
    widgetClasses[baseWidgetName],
    newWidget = baseWidget.extend(prototype);

        if (!isAbstractWidget(widgetName)) {
            exposeAsJQueryPlugin(newWidget);
        }

        widgetClasses[widgetName] = newWidget;
    }

    function assertPreconditions(prototype) {
        if (!$.isPlainObject(prototype) || $.isEmptyObject(prototype))
            $.error('A valid non-empty plain object is required as the prototype for the new widget.');

        if (!prototype._widgetName)
            $.error('The widget name is missing in the prototype definition.');

        if (typeof prototype._inheritsFrom !== 'undefined' && typeof widgetClasses[prototype._inheritsFrom] === 'undefined')
            $.error(prototype._inheritsFrom + " doesn't exist in the Access Widget Toolkit internal namespace.");
    }

    function isAbstractWidget(widgetName) {
        return widgetName.substring(0, 8) === 'Abstract';
    }

    function exposeAsJQueryPlugin(theWidget) {
        var pluginName = uncapitalizeFirstLetter(theWidget.prototype._widgetName);

        $.fn[pluginName] = function (options) {

            if (!this.data(pluginName)) {
                var widgetInstance = new theWidget(this, options);

                this.data(pluginName, new Proxy(widgetInstance));
            }

            return this;
        }
    }

    function uncapitalizeFirstLetter(text) {
        return text.charAt(0).toLowerCase() + text.substring(1);
    }

    function Proxy(theWidgetInstance) {
        var publicInterface = {};

        for (var memberName in theWidgetInstance) {

            if (!isPrivateMember(memberName))
                publicInterface[memberName] = $.isFunction(theWidgetInstance[memberName]) ?
        (function (theWidgetMethod) {
            return function () {
                return theWidgetMethod.apply(theWidgetInstance, Array.prototype.slice.call(arguments));
            }
        } (theWidgetInstance[memberName])) :
        theWidgetInstance[memberName];
        }

        return publicInterface;
    }

    function isPrivateMember(memberName) {
        return memberName.charAt(0) === '_';
    }

    $.accessWidgetToolkit = $.accessWidgetToolkit || {};

    $.extend($.accessWidgetToolkit, {

        defineWidget: defineWidget,

        utilities: {
            uniqueIdentifier: uniqueIdentifier,
            keys: keys
        }

    });

}));
