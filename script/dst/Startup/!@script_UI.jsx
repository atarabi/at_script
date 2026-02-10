/**
 * @script_UI v0.3.0
 *
 *      v0.3.0(2026/02/06)  Switched to a custom fuzzy search
 *      v0.2.2(2025/04/02)  Switched to Types-for-Adobe
 *      v0.2.1(2024/11/14)  Fixed cache bug of FuzzySearch
 *      v0.2.0(2024/02/13)  Added custom
 *      v0.1.0(2023/08/28)
 */
(function () {
    $.global.Atarabi = $.global.Atarabi || {};
    var Atarabi = $.global.Atarabi;
    Atarabi.UI = (Atarabi.UI || {});
    var isArray = function (value) { return Object.prototype.toString.call(value) === '[object Array]'; };
    var isNumber = function (value) { return typeof value === 'number'; };
    var isString = function (value) { return typeof value === 'string'; };
    var isBoolean = function (value) { return typeof value === 'boolean'; };
    var isFunction = function (value) { return typeof value === 'function'; };
    var isGroupValue = function (value) {
        switch (value.type) {
            case 'panel':
            case 'group':
            case 'tabbedpanel':
            case 'tab':
                return true;
        }
        return false;
    };
    var isGroupEndValue = function (value) {
        switch (value.type) {
            case 'panelend':
            case 'groupend':
            case 'tabbedpanelend':
            case 'tabend':
                return true;
        }
        return false;
    };
    var isControlValue = function (value) {
        switch (value.type) {
            case 'checkbox':
            case 'radiobutton':
            case 'statictext':
            case 'edittext':
            case 'number':
            case 'slider':
            case 'color':
            case 'button':
                return true;
        }
        return false;
    };
    var isListValue = function (value) {
        switch (value.type) {
            case 'dropdownlist':
            case 'listbox':
                return true;
        }
        return false;
    };
    var isCustomValue = function (value) {
        switch (value.type) {
            case 'custom':
        }
        return false;
    };
    var generateUuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    var BuilderOptions = /** @class */ (function () {
        function BuilderOptions(win, title, options, uiFn) {
            this._keys = {};
            this.events = {};
            this.win = null;
            this.values = [];
            this.win = {
                win: win,
                title: title,
                options: options,
                uiFn: uiFn,
            };
        }
        BuilderOptions.prototype.checkKey = function (key) {
            if (this._keys[key]) {
                throw "Duplicate key: ".concat(key);
            }
            this._keys[key] = true;
        };
        // Events
        BuilderOptions.prototype.addEventListener = function (eventName, callback, uuidFn) {
            if (!this.events[eventName]) {
                this.events[eventName] = [];
            }
            var uuid = generateUuid();
            this.events[eventName].push({
                uuid: uuid,
                callback: callback,
            });
            if (uuidFn) {
                uuidFn(uuid);
            }
            return this;
        };
        // Groups
        BuilderOptions.prototype.addPanel = function (key, text, options, uiFn) {
            this.checkKey(key);
            this.values.push({
                type: 'panel',
                key: key,
                text: text,
                options: options,
                uiFn: uiFn,
            });
            return this;
        };
        BuilderOptions.prototype.addPanelEnd = function () {
            this.values.push({
                type: 'panelend',
            });
            return this;
        };
        BuilderOptions.prototype.addGroup = function (key, options, uiFn) {
            this.checkKey(key);
            this.values.push({
                type: 'group',
                key: key,
                options: options,
                uiFn: uiFn,
            });
            return this;
        };
        BuilderOptions.prototype.addGroupEnd = function () {
            this.values.push({
                type: 'groupend',
            });
            return this;
        };
        BuilderOptions.prototype.addTabbedPanel = function (key, text, options, uiFn) {
            this.checkKey(key);
            this.values.push({
                type: 'tabbedpanel',
                key: key,
                text: text,
                options: options,
                uiFn: uiFn,
            });
            return this;
        };
        BuilderOptions.prototype.addTabbedPanelEnd = function () {
            this.values.push({
                type: 'tabbedpanelend',
            });
            return this;
        };
        BuilderOptions.prototype.addTab = function (key, text, options, uiFn) {
            this.checkKey(key);
            this.values.push({
                type: 'tab',
                key: key,
                text: text,
                options: options,
                uiFn: uiFn,
            });
            return this;
        };
        BuilderOptions.prototype.addTabEnd = function () {
            this.values.push({
                type: 'tabend',
            });
            return this;
        };
        // Controls
        BuilderOptions.prototype.addCheckbox = function (key, defaultValue, text, options, uiFn) {
            this.checkKey(key);
            this.values.push({
                type: 'checkbox',
                key: key,
                defaultValue: defaultValue,
                text: text,
                options: options,
                uiFn: uiFn,
            });
            return this;
        };
        BuilderOptions.prototype.addRadioButton = function (key, defaultValue, text, options, uiFn) {
            this.checkKey(key);
            this.values.push({
                type: 'radiobutton',
                key: key,
                defaultValue: defaultValue,
                text: text,
                options: options,
                uiFn: uiFn,
            });
            return this;
        };
        BuilderOptions.prototype.addStaticText = function (key, defaultValue, options, uiFn) {
            this.checkKey(key);
            this.values.push({
                type: 'statictext',
                key: key,
                defaultValue: defaultValue,
                options: options,
                uiFn: uiFn,
            });
            return this;
        };
        BuilderOptions.prototype.addEditText = function (key, defaultValue, options, uiFn) {
            this.checkKey(key);
            this.values.push({
                type: 'edittext',
                key: key,
                defaultValue: defaultValue,
                options: options,
                uiFn: uiFn,
            });
            return this;
        };
        BuilderOptions.prototype.addNumber = function (key, value, options, uiFn) {
            if (value === void 0) { value = {}; }
            this.checkKey(key);
            this.values.push({
                type: 'number',
                key: key,
                value: value,
                options: options,
                uiFn: uiFn,
            });
            return this;
        };
        BuilderOptions.prototype.addSlider = function (key, value, options, uiFn) {
            if (value === void 0) { value = {}; }
            this.checkKey(key);
            this.values.push({
                type: 'slider',
                key: key,
                value: value,
                options: options,
                uiFn: uiFn,
            });
            return this;
        };
        BuilderOptions.prototype.addColor = function (key, defaultValue, options, uiFn) {
            this.checkKey(key);
            this.values.push({
                type: 'color',
                key: key,
                defaultValue: defaultValue,
                options: options,
                uiFn: uiFn,
            });
            return this;
        };
        BuilderOptions.prototype.addButton = function (key, defaultValue, options, uiFn) {
            this.checkKey(key);
            this.values.push({
                type: 'button',
                key: key,
                defaultValue: defaultValue,
                options: options,
                uiFn: uiFn,
            });
            return this;
        };
        BuilderOptions.prototype.addCustom = function (key, uiFn) {
            this.checkKey(key);
            this.values.push({
                type: 'custom',
                key: key,
                uiFn: uiFn,
            });
            return this;
        };
        // Lists
        BuilderOptions.prototype.addDropDownList = function (key, items, options, uiFn) {
            this.checkKey(key);
            this.values.push({
                type: 'dropdownlist',
                key: key,
                items: items,
                options: options,
                uiFn: uiFn,
            });
            return this;
        };
        BuilderOptions.prototype.addListBox = function (key, items, options, uiFn) {
            this.checkKey(key);
            this.values.push({
                type: 'listbox',
                key: key,
                items: items,
                options: options,
                uiFn: uiFn,
            });
            return this;
        };
        // Build
        BuilderOptions.prototype.build = function () {
            return new Builder(this);
        };
        return BuilderOptions;
    }());
    var Builder = /** @class */ (function () {
        function Builder(options) {
            this._values = {};
            this._events = {};
            this._events = options.events;
            this.build(options);
        }
        Builder.prototype.build = function (options) {
            var win = this._win = (options.win.win instanceof Panel || options.win.win instanceof Window) ? options.win.win : new Window(options.win.win, options.win.title, undefined, options.win.options);
            if (options.win.uiFn) {
                options.win.uiFn(win, this);
            }
            var container = win;
            var containerDepth = 0;
            var _loop_1 = function (value) {
                switch (value.type) {
                    // Group
                    case 'panel':
                        {
                            var ui = container = value.ui = container.add('panel', undefined, isString(value.text) ? value.text : value.key, value.options);
                            if (value.uiFn) {
                                value.uiFn(ui, this_1);
                            }
                            this_1._values[value.key] = value;
                            ++containerDepth;
                        }
                        break;
                    case 'panelend':
                        {
                            if (containerDepth === 0 || !(container instanceof Panel && container.type === 'panel')) {
                                throw "Unbalanced panel/panelend";
                            }
                            container = container.parent;
                            --containerDepth;
                        }
                        break;
                    case 'group':
                        {
                            var ui = container = value.ui = container.add('group', undefined, value.options);
                            if (value.uiFn) {
                                value.uiFn(ui, this_1);
                            }
                            this_1._values[value.key] = value;
                            ++containerDepth;
                        }
                        break;
                    case 'groupend':
                        {
                            if (containerDepth === 0 || !(container instanceof Group)) {
                                throw "Unbalanced group/groupend";
                            }
                            container = container.parent;
                            --containerDepth;
                        }
                        break;
                    case 'tabbedpanel':
                        {
                            var ui = value.ui = container.add('tabbedpanel', undefined, isString(value.text) ? value.text : value.key, value.options);
                            container = ui;
                            if (value.uiFn) {
                                value.uiFn(ui, this_1);
                            }
                            this_1._values[value.key] = value;
                            ++containerDepth;
                        }
                        break;
                    case 'tabbedpanelend':
                        {
                            if (containerDepth === 0 || !(container instanceof Panel && container.type === 'tabbedpanel')) {
                                throw "Unbalanced tabbedpanel/tabbedpanelend";
                            }
                            container = container.parent;
                            --containerDepth;
                        }
                        break;
                    case 'tab':
                        {
                            var ui = container = value.ui = container.add('tab', undefined, isString(value.text) ? value.text : value.key, value.options);
                            if (value.uiFn) {
                                value.uiFn(ui, this_1);
                            }
                            this_1._values[value.key] = value;
                            ++containerDepth;
                        }
                        break;
                    case 'tabend':
                        {
                            if (containerDepth === 0 || !(container instanceof Panel && container.type === 'tab')) {
                                throw "Unbalanced tab/tabend";
                            }
                            container = container.parent;
                            --containerDepth;
                        }
                        break;
                    // Controls
                    case 'checkbox':
                        {
                            var ui = value.ui = container.add('checkbox', undefined, isString(value.text) ? value.text : value.key, value.options);
                            if (isBoolean(value.defaultValue)) {
                                ui.value = value.defaultValue;
                            }
                            if (value.uiFn) {
                                value.uiFn(ui, this_1);
                            }
                            this_1._values[value.key] = value;
                        }
                        break;
                    case 'radiobutton':
                        {
                            var ui = value.ui = container.add('radiobutton', undefined, isString(value.text) ? value.text : value.key, value.options);
                            if (isBoolean(value.defaultValue)) {
                                ui.value = value.defaultValue;
                            }
                            if (value.uiFn) {
                                value.uiFn(ui, this_1);
                            }
                            this_1._values[value.key] = value;
                        }
                        break;
                    case 'statictext':
                        {
                            var ui = value.ui = container.add('statictext', undefined, isString(value.defaultValue) ? value.defaultValue : '', value.options);
                            if (value.uiFn) {
                                value.uiFn(ui, this_1);
                            }
                            this_1._values[value.key] = value;
                        }
                        break;
                    case 'edittext':
                        {
                            var ui = value.ui = container.add('edittext', undefined, isString(value.defaultValue) ? value.defaultValue : '', value.options);
                            if (value.uiFn) {
                                value.uiFn(ui, this_1);
                            }
                            this_1._values[value.key] = value;
                        }
                        break;
                    case 'number':
                        {
                            var _b = value.value, _c = _b.initialvalue, initialvalue_1 = _c === void 0 ? 0 : _c, _d = _b.minvalue, minvalue_1 = _d === void 0 ? -Number.MAX_VALUE : _d, _e = _b.maxvalue, maxvalue_1 = _e === void 0 ? Number.MAX_VALUE : _e;
                            var ui_1 = value.ui = container.add('edittext', undefined, "".concat(initialvalue_1), value.options);
                            value.value = {
                                initialvalue: initialvalue_1,
                                minvalue: minvalue_1,
                                maxvalue: maxvalue_1,
                            };
                            if (value.uiFn) {
                                value.uiFn(ui_1, this_1);
                            }
                            var onChange_1 = ui_1.onChange;
                            ui_1.onChange = function () {
                                if (/^([0-9\+\-\*\/eE\.\(\)]|\s)+$/.test(ui_1.text)) {
                                    try {
                                        var value_1 = eval(ui_1.text);
                                        if (isNumber(value_1)) {
                                            if (value_1 < minvalue_1) {
                                                ui_1.text = "".concat(minvalue_1);
                                            }
                                            else if (value_1 > maxvalue_1) {
                                                ui_1.text = "".concat(maxvalue_1);
                                            }
                                        }
                                        else {
                                            ui_1.text = "".concat(initialvalue_1);
                                        }
                                    }
                                    catch (e) {
                                        ui_1.text = "".concat(initialvalue_1);
                                    }
                                }
                                else {
                                    ui_1.text = "".concat(initialvalue_1);
                                }
                                if (isFunction(onChange_1)) {
                                    onChange_1.call(ui_1);
                                }
                            };
                            this_1._values[value.key] = value;
                        }
                        break;
                    case 'slider':
                        {
                            var _f = value.value, initialvalue = _f.initialvalue, minvalue = _f.minvalue, maxvalue = _f.maxvalue;
                            var ui = value.ui = container.add('slider', undefined, initialvalue, minvalue, maxvalue, value.options);
                            if (value.uiFn) {
                                value.uiFn(ui, this_1);
                            }
                            this_1._values[value.key] = value;
                        }
                        break;
                    case 'color':
                        {
                            var ui_2 = value.ui = container.add('button', undefined, undefined, value.options);
                            if (value.uiFn) {
                                value.uiFn(ui_2, this_1);
                            }
                            if (isArray(value.defaultValue)) {
                                var _g = value.defaultValue, red = _g[0], green = _g[1], blue = _g[2];
                                if (!isNumber(red)) {
                                    red = 1;
                                }
                                if (!isNumber(green)) {
                                    green = 1;
                                }
                                if (!isNumber(blue)) {
                                    blue = 1;
                                }
                                ui_2.value = [red, green, blue];
                            }
                            else {
                                ui_2.value = [1, 1, 1];
                            }
                            ui_2.onClick = function () {
                                var color = Atarabi.app.colorPicker(ui_2.value);
                                if (color) {
                                    ui_2.value = color;
                                    ui_2.notify('onDraw');
                                    if (isFunction(ui_2.onChange)) {
                                        ui_2.onChange();
                                    }
                                }
                            };
                            var clamp_1 = function (v) { return Math.max(0, Math.min(1, v)); };
                            ui_2.onDraw = function () {
                                var graphics = ui_2.graphics;
                                var size = ui_2.size;
                                var color = [clamp_1(ui_2.value[0]), clamp_1(ui_2.value[1]), clamp_1(ui_2.value[2]), 1];
                                if (!ui_2.enabled) {
                                    color[0] *= 0.1;
                                    color[1] *= 0.1;
                                    color[2] *= 0.1;
                                }
                                var brush = graphics.newBrush(graphics.BrushType.SOLID_COLOR, color);
                                graphics.rectPath(0, 0, size[0], size[1]);
                                graphics.fillPath(brush);
                            };
                            this_1._values[value.key] = value;
                        }
                        break;
                    case 'button':
                        {
                            var ui = value.ui = container.add('button', undefined, isString(value.defaultValue) ? value.defaultValue : value.key, value.options);
                            if (value.uiFn) {
                                value.uiFn(ui, this_1);
                            }
                            this_1._values[value.key] = value;
                        }
                        break;
                    case 'custom':
                        {
                            var result = value.uiFn(container, this_1);
                            value.options = result;
                            this_1._values[value.key] = value;
                        }
                        break;
                    // Lists
                    case 'dropdownlist':
                        {
                            var ui = value.ui = container.add('dropdownlist', undefined, value.items, value.options);
                            if (value.uiFn) {
                                value.uiFn(ui, this_1);
                            }
                            this_1._values[value.key] = value;
                        }
                        break;
                    case 'listbox':
                        {
                            var ui = value.ui = container.add('listbox', undefined, value.items, value.options);
                            if (value.uiFn) {
                                value.uiFn(ui, this_1);
                            }
                            this_1._values[value.key] = value;
                        }
                        break;
                    default:
                        throw "invalid type";
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = options.values; _i < _a.length; _i++) {
                var value = _a[_i];
                _loop_1(value);
            }
            if (options.win.options && options.win.options.resizeable) {
                if (!win.onResizing) {
                    win.onResizing = function () {
                        win.layout.resize();
                    };
                }
                if (!win.onResize) {
                    win.onResize = function () {
                        win.layout.resize();
                    };
                }
            }
            if (win instanceof Panel) {
                win.layout.layout(true);
            }
            else {
                win.center();
                win.show();
            }
        };
        // Events
        Builder.prototype.addEventListener = function (eventName, callback) {
            if (!this._events[eventName]) {
                this._events[eventName] = [];
            }
            var uuid = generateUuid();
            this._events[eventName].push({
                uuid: uuid,
                callback: callback,
            });
            return uuid;
        };
        Builder.prototype.removeEventListener = function (eventName, uuid) {
            var _event = this._events[eventName];
            if (!_event) {
                return false;
            }
            for (var i = 0; i < _event.length; i++) {
                var fn = _event[i];
                if (fn.uuid === uuid) {
                    _event.splice(i, 1);
                    return true;
                }
            }
            return false;
        };
        Builder.prototype.notify = function (eventName) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _event = this._events[eventName];
            if (!_event) {
                return;
            }
            for (var _a = 0, _event_1 = _event; _a < _event_1.length; _a++) {
                var fn = _event_1[_a];
                fn.callback.apply(fn, args);
            }
        };
        // Groups / Controls / Lists
        Builder.prototype.show = function (key) {
            var _value = this._values[key];
            if (!(isGroupEndValue(_value) || isCustomValue(_value))) {
                _value.ui.show();
            }
        };
        Builder.prototype.hide = function (key) {
            var _value = this._values[key];
            if (!(isGroupEndValue(_value) || isCustomValue(_value))) {
                _value.ui.hide();
            }
        };
        Builder.prototype.enable = function (key) {
            var _value = this._values[key];
            if (!(isGroupEndValue(_value) || isCustomValue(_value))) {
                _value.ui.enabled = true;
            }
        };
        Builder.prototype.disable = function (key) {
            var _value = this._values[key];
            if (!(isGroupEndValue(_value) || isCustomValue(_value))) {
                _value.ui.enabled = false;
            }
        };
        Builder.prototype.ui = function (key) {
            var _value = this._values[key];
            if (isGroupEndValue(_value) || isCustomValue(_value)) {
                return null;
            }
            return _value.ui;
        };
        Builder.prototype.get = function (key) {
            var _value = this._values[key];
            switch (_value.type) {
                case 'checkbox':
                case 'radiobutton':
                    return _value.ui.value;
                case 'statictext':
                case 'edittext':
                    return _value.ui.text;
                case 'number':
                    {
                        var result = _value.value.initialvalue;
                        if (/^([0-9\+\-\*\/eE\.\(\)]|\s)+$/.test(_value.ui.text)) {
                            try {
                                var v = eval(_value.ui.text);
                                if (isNumber(v)) {
                                    if (v < _value.value.minvalue) {
                                        result = _value.value.minvalue;
                                    }
                                    else if (v > _value.value.maxvalue) {
                                        result = _value.value.maxvalue;
                                    }
                                    else {
                                        result = v;
                                    }
                                }
                            }
                            catch (e) {
                                // pass
                            }
                        }
                        return result;
                    }
                case 'slider':
                    return _value.ui.value;
                case 'color':
                    return _value.ui.value;
                case 'button':
                    return _value.ui.text;
                case 'custom':
                    if (_value.options && isFunction(_value.options.get)) {
                        return _value.options.get();
                    }
                    else {
                        return null;
                    }
                case 'dropdownlist':
                case 'listbox':
                    {
                        var result = null;
                        var selection = _value.ui.selection;
                        if (selection) {
                            if (isArray(selection)) {
                                result = [];
                                for (var _i = 0, selection_1 = selection; _i < selection_1.length; _i++) {
                                    var item = selection_1[_i];
                                    result.push(item.text);
                                }
                            }
                            else {
                                result = selection.text;
                            }
                        }
                        return result;
                    }
            }
            return null;
        };
        Builder.prototype.set = function (key, value) {
            var _value = this._values[key];
            switch (_value.type) {
                case 'checkbox':
                case 'radiobutton':
                    {
                        if (!isBoolean(value)) {
                            throw 'value must be boolean';
                        }
                        _value.ui.value = value;
                    }
                    break;
                case 'statictext':
                case 'edittext':
                    {
                        if (!isString(value)) {
                            throw 'value must be string';
                        }
                        _value.ui.text = value;
                    }
                    break;
                case 'number':
                    {
                        if (!isNumber(value)) {
                            throw 'value must be number';
                        }
                        _value.ui.text = "".concat(Math.max(_value.value.minvalue, Math.min(_value.value.maxvalue, value)));
                    }
                    break;
                case 'slider':
                    {
                        if (!isNumber(value)) {
                            throw 'value must be number';
                        }
                        _value.ui.value = value;
                    }
                    break;
                case 'color':
                    {
                        if (!(isArray(value) && isNumber(value[0]) && isNumber(value[1]) && isNumber(value[2]))) {
                            throw 'value must be [number, number, number]';
                        }
                        _value.ui.value = [value[0], value[1], value[2]];
                        _value.ui.notify('onDraw');
                    }
                    break;
                case 'button':
                    {
                        if (!isString(value)) {
                            throw 'value must be string';
                        }
                        _value.ui.text = value;
                    }
                    break;
                case 'custom':
                    if (_value.options && isFunction(_value.options.set)) {
                        _value.options.set(value);
                    }
                    break;
                case 'dropdownlist':
                case 'listbox':
                    {
                        var texts = [];
                        if (value === null) {
                            // deselect all
                        }
                        else if (isString(value)) {
                            texts.push(value);
                        }
                        else if (typeof _value.ui.properties === 'object' && _value.ui.properties.multiselect === true && isArray(value)) {
                            for (var _i = 0, value_2 = value; _i < value_2.length; _i++) {
                                var text = value_2[_i];
                                if (isString(text)) {
                                    texts.push(text);
                                }
                                else {
                                    throw 'value must be string or string[]';
                                }
                            }
                        }
                        else {
                            throw 'value must be null, string or string[]';
                        }
                        for (var _a = 0, _b = _value.ui.items; _a < _b.length; _a++) {
                            var item = _b[_a];
                            var ok = false;
                            for (var _c = 0, texts_1 = texts; _c < texts_1.length; _c++) {
                                var text = texts_1[_c];
                                if (item.text === text) {
                                    ok = true;
                                    break;
                                }
                            }
                            item.selected = ok;
                        }
                    }
                    break;
            }
        };
        // Lists
        Builder.prototype.addItem = function (key, text, fn) {
            var _value = this._values[key];
            if (isListValue(_value)) {
                var item = _value.ui.add('item', text);
                if (fn) {
                    fn(item);
                }
            }
        };
        Builder.prototype.removeAll = function (key, index) {
            var _value = this._values[key];
            if (isListValue(_value)) {
                _value.ui.removeAll();
            }
        };
        // Groups / Lists
        Builder.prototype.remove = function (key, index) {
            var _value = this._values[key];
            if (isGroupValue(_value) || isListValue(_value)) {
                _value.ui.remove(index);
            }
        };
        // Window
        Builder.prototype.close = function () {
            if (this._win instanceof Window) {
                this._win.close();
            }
        };
        // Utility
        Builder.prototype.onInit = function (fn) {
            fn(this);
        };
        Builder.prototype.load = function (data, include) {
            if (include) {
                for (var key in data) {
                    var found = false;
                    for (var _i = 0, include_1 = include; _i < include_1.length; _i++) {
                        var inc = include_1[_i];
                        if (key === inc) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        delete data[key];
                    }
                }
            }
            for (var key in data) {
                var _data = data[key];
                var _value = this._values[key];
                if (!_value || _data.type !== _value.type) {
                    continue;
                }
                if (isControlValue(_value)) {
                    this.set(key, _data.value);
                }
                else if (isListValue(_value)) {
                    if (!_value.ui.items.length) {
                        _value.ui.removeAll();
                        for (var _a = 0, _b = _data.items; _a < _b.length; _a++) {
                            var item = _b[_a];
                            _value.ui.add('item', item);
                        }
                    }
                    this.set(key, _data.value);
                }
            }
        };
        Builder.prototype.loadFromFile = function (file, include) {
            if (!file.exists) {
                return;
            }
            file.encoding = 'utf-8';
            if (!file.open('r')) {
                throw "Unable to open file";
            }
            var body = file.read();
            file.close();
            var data = null;
            try {
                data = Atarabi.JSON.parse(body);
            }
            catch (e) {
                throw "Invalid data";
            }
            if (typeof data !== 'object') {
                throw "Invalid data";
            }
            this.load(data, include);
        };
        Builder.prototype.loadFromSetting = function (section, key, include) {
            if (!app.settings.haveSetting(section, key)) {
                return;
            }
            var data = null;
            try {
                data = Atarabi.JSON.parse(app.settings.getSetting(section, key));
            }
            catch (e) {
                throw "Invalid data";
            }
            if (typeof data !== 'object') {
                throw "Invalid data";
            }
            this.load(data, include);
        };
        Builder.prototype.generateSaveData = function (include) {
            var data = this.toJSON();
            if (include) {
                for (var key in data) {
                    var found = false;
                    for (var _i = 0, include_2 = include; _i < include_2.length; _i++) {
                        var inc = include_2[_i];
                        if (key === inc) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        delete data[key];
                    }
                }
            }
            return data;
        };
        Builder.prototype.saveToFile = function (file, include) {
            var data = this.generateSaveData(include);
            file.encoding = 'utf-8';
            if (!file.open('w')) {
                throw "Unable to open file";
            }
            file.write(Atarabi.JSON.stringify(data, undefined, 2));
            file.close();
        };
        Builder.prototype.saveToSetting = function (section, key, include) {
            var data = this.generateSaveData(include);
            app.settings.saveSetting(section, key, Atarabi.JSON.stringify(data));
        };
        Builder.prototype.toJSON = function () {
            var obj = {};
            for (var key in this._values) {
                var _value = this._values[key];
                if (isControlValue(_value)) {
                    obj[key] = {
                        type: _value.type,
                        value: this.get(key),
                    };
                }
                else if (isListValue(_value)) {
                    var items = [];
                    for (var _i = 0, _a = _value.ui.items; _i < _a.length; _i++) {
                        var item = _a[_i];
                        items.push(item.text);
                    }
                    obj[key] = {
                        type: _value.type,
                        value: this.get(key),
                        items: items,
                    };
                }
            }
            return obj;
        };
        return Builder;
    }());
    Atarabi.UI.Builder = BuilderOptions;
    /*
        Fuzzy Search
    */
    function assign(t) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
            var arg = args_1[_a];
            for (var p in arg)
                if (Object.prototype.hasOwnProperty.call(arg, p))
                    t[p] = arg[p];
        }
        return t;
    }
    var FuzzySearch = /** @class */ (function () {
        function FuzzySearch(items, keys, options) {
            if (options === void 0) { options = {}; }
            this._cache = {};
            this._cacheKeys = [];
            this.items = items;
            this.keyWeights = [];
            if (keys != null) {
                for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                    var k = keys_1[_i];
                    if (typeof k === "object" && k !== null && "key" in k) {
                        this.keyWeights.push({ key: k.key, weight: k.weight });
                    }
                    else {
                        this.keyWeights.push({ key: k, weight: 1 });
                    }
                }
            }
            this.options = assign({
                caseSensitive: false,
                sort: false,
                cache: false,
                maxCacheSize: 100,
            }, options);
        }
        FuzzySearch.prototype.search = function (query) {
            if (query === void 0) { query = ''; }
            query = query.replace(/^\s+|\s+$/g, "");
            if (!query)
                return this.items;
            var _a = this.options, caseSensitive = _a.caseSensitive, cache = _a.cache, sort = _a.sort, maxCacheSize = _a.maxCacheSize;
            query = caseSensitive ? query : query.toLowerCase();
            if (cache && Object.prototype.hasOwnProperty.call(this._cache, query)) {
                this.refreshCacheKey(query);
                return this._cache[query];
            }
            var matchedItems = [];
            var qChars = query.split('');
            for (var _i = 0, _b = this.items; _i < _b.length; _i++) {
                var item = _b[_i];
                var bestScore = -1;
                if (this.keyWeights.length === 0) {
                    if (typeof item !== "string")
                        continue;
                    var targetText = caseSensitive ? item : item.toLowerCase();
                    bestScore = this.calculateScore(targetText, query, qChars, item);
                }
                else {
                    for (var _c = 0, _d = this.keyWeights; _c < _d.length; _c++) {
                        var kw = _d[_c];
                        var value = item[kw.key];
                        if (typeof value !== "string")
                            continue;
                        var targetText = caseSensitive ? value : value.toLowerCase();
                        var score = this.calculateScore(targetText, query, qChars, value);
                        if (score > -1) {
                            score *= kw.weight;
                            if (score > bestScore)
                                bestScore = score;
                        }
                    }
                }
                if (bestScore > -1)
                    matchedItems.push({ item: item, score: bestScore });
            }
            if (sort) {
                matchedItems.sort(function (a, b) { return b.score - a.score; });
            }
            var result = [];
            for (var _e = 0, matchedItems_1 = matchedItems; _e < matchedItems_1.length; _e++) {
                var item = matchedItems_1[_e];
                result.push(item.item);
            }
            if (cache) {
                if (this._cacheKeys.length >= maxCacheSize) {
                    var oldestKey = this._cacheKeys.shift();
                    if (oldestKey != null)
                        delete this._cache[oldestKey];
                }
                this._cache[query] = result;
                this._cacheKeys.push(query);
            }
            return result;
        };
        FuzzySearch.prototype.refreshCacheKey = function (key) {
            var foundIndex = -1;
            for (var i = 0; i < this._cacheKeys.length; i++) {
                if (this._cacheKeys[i] === key) {
                    foundIndex = i;
                    break;
                }
            }
            if (foundIndex !== -1) {
                this._cacheKeys.splice(foundIndex, 1);
                this._cacheKeys.push(key);
            }
        };
        FuzzySearch.prototype.calculateScore = function (text, query, qChars, original) {
            var firstFoundIdx = text.indexOf(qChars[0]);
            if (firstFoundIdx === -1)
                return -1;
            if (text === query)
                return 100000;
            var score = 0;
            var textIdx = firstFoundIdx + 1;
            var lastFoundIdx = firstFoundIdx;
            var consecutiveCount = 0;
            if (firstFoundIdx === 0) {
                score += 500;
                if (text.indexOf(query) === 0)
                    score += 10000;
            }
            score += 100 - firstFoundIdx;
            for (var i = 1; i < qChars.length; i++) {
                var ch = qChars[i];
                var foundIdx = text.indexOf(ch, textIdx);
                if (foundIdx === -1)
                    return -1;
                var prevCh = text[foundIdx - 1];
                if (prevCh === ' ' || prevCh === '_' || prevCh === '.' || prevCh === '-') {
                    score += 250;
                }
                else {
                    var code = original.charCodeAt(foundIdx);
                    if (code >= 65 && code <= 90)
                        score += 250;
                }
                score += 100 - foundIdx;
                if (lastFoundIdx !== -1 && foundIdx === lastFoundIdx + 1) {
                    consecutiveCount++;
                    score += 200 * consecutiveCount;
                }
                else {
                    consecutiveCount = 0;
                }
                lastFoundIdx = foundIdx;
                textIdx = foundIdx + 1;
            }
            score += 100 - (lastFoundIdx - firstFoundIdx);
            score -= text.length; // length penalty
            return score;
        };
        return FuzzySearch;
    }());
    Atarabi.UI.FuzzySearch = function (haystack, keys, options) {
        if (options === void 0) { options = {}; }
        return new FuzzySearch(haystack, keys, options);
    };
})();
