/**
 * @script_UI v0.3.0
 * 
 *      v0.3.0(2026/02/06)  Switched to a custom fuzzy search
 *      v0.2.2(2025/04/02)  Switched to Types-for-Adobe
 *      v0.2.1(2024/11/14)  Fixed cache bug of FuzzySearch
 *      v0.2.0(2024/02/13)  Added custom
 *      v0.1.0(2023/08/28)
 */
(() => {

    $.global.Atarabi = $.global.Atarabi || {};

    var Atarabi: Atarabi = $.global.Atarabi; Atarabi.UI = (Atarabi.UI || {}) as any;

    const isArray = (value: any): value is any[] => Object.prototype.toString.call(value) === '[object Array]';

    const isNumber = (value: any): value is number => typeof value === 'number';

    const isString = (value: any): value is string => typeof value === 'string';

    const isBoolean = (value: any): value is boolean => typeof value === 'boolean';

    const isFunction = (value: any): value is Function => typeof value === 'function';

    /*
        UI BUilder
    */
    interface PanelValue {
        type: 'panel',
        key: string;
        text: string;
        options: Atarabi.UI.PanelOptions;
        uiFn?: (ui: Panel, emitter: Atarabi.UI.EventEmitter) => void;
        ui?: Panel;
    }

    interface PanelEndValue {
        type: 'panelend',
    }

    interface GroupValue {
        type: 'group',
        key: string;
        options: Atarabi.UI.GroupOptions;
        uiFn?: (ui: Group, emitter: Atarabi.UI.EventEmitter) => void;
        ui?: Group;
    }

    interface GroupEndValue {
        type: 'groupend',
    }

    interface TabbedPanelValue {
        type: 'tabbedpanel',
        key: string;
        text: string;
        options: Atarabi.UI.TabbedPanelOptions;
        uiFn?: (ui: TabbedPanel, emitter: Atarabi.UI.EventEmitter) => void;
        ui?: TabbedPanel;
    }

    interface TabbedPanelEndValue {
        type: 'tabbedpanelend',
    }

    interface TabValue {
        type: 'tab',
        key: string;
        text: string;
        options: Atarabi.UI.TabOptions;
        uiFn?: (ui: Tab, emitter: Atarabi.UI.EventEmitter) => void;
        ui?: Tab;
    }

    interface TabEndValue {
        type: 'tabend',
    }

    interface CheckboxValue {
        type: 'checkbox';
        key: string;
        defaultValue: boolean;
        text: string;
        options: Atarabi.UI.CheckboxOptions;
        uiFn?: (ui: Checkbox, emitter: Atarabi.UI.EventEmitter) => void;
        ui?: Checkbox;
    }

    interface RadioButtonValue {
        type: 'radiobutton';
        key: string;
        defaultValue: boolean;
        text: string;
        options: Atarabi.UI.RadioButtonOptions;
        uiFn?: (ui: RadioButton, emitter: Atarabi.UI.EventEmitter) => void;
        ui?: RadioButton;
    }

    interface StaticTextValue {
        type: 'statictext';
        key: string;
        defaultValue: string;
        options: Atarabi.UI.StaticTextOptions;
        uiFn?: (ui: StaticText, emitter: Atarabi.UI.EventEmitter) => void;
        ui?: StaticText;
    }

    interface EditTextValue {
        type: 'edittext';
        key: string;
        defaultValue: string;
        options: Atarabi.UI.EditTextOptions;
        uiFn?: (ui: EditText, emitter: Atarabi.UI.EventEmitter) => void;
        ui?: EditText;
    }

    interface NumberValue {
        type: 'number';
        key: string;
        value: { initialvalue?: number; minvalue?: number; maxvalue?: number; };
        options: Atarabi.UI.NumberOptions;
        uiFn?: (ui: Atarabi.UI.NumberUI, emitter: Atarabi.UI.EventEmitter) => void;
        ui?: EditText;
    }

    interface SliderValue {
        type: 'slider';
        key: string;
        value: { initialvalue?: number; minvalue?: number; maxvalue?: number; };
        options: Atarabi.UI.SliderOptions;
        uiFn?: (ui: Slider, emitter: Atarabi.UI.EventEmitter) => void;
        ui?: Slider;
    }

    type ColorButton = Button & { value: Atarabi.Color; onChange: Function };

    interface ColorValue {
        type: 'color';
        key: string;
        defaultValue: Atarabi.Color;
        options: Atarabi.UI.ColorOptions;
        uiFn?: (ui: Atarabi.UI.ColorUI, emitter: Atarabi.UI.EventEmitter) => void;
        ui?: ColorButton;
    }

    interface ButtonValue {
        type: 'button';
        key: string;
        defaultValue: string;
        options: Atarabi.UI.ButtonOptions;
        uiFn?: (ui: Button, emitter: Atarabi.UI.EventEmitter) => void;
        ui?: Button;
    }

    interface DropDownListValue {
        type: 'dropdownlist';
        key: string;
        items: string[];
        options: Atarabi.UI.DropDownListOptions;
        uiFn?: (ui: DropDownList, emitter: Atarabi.UI.EventEmitter) => void;
        ui?: DropDownList;
    }

    interface ListBoxValue {
        type: 'listbox';
        key: string;
        items: string[];
        options: Atarabi.UI.ListBoxOptions;
        uiFn?: (ui: ListBox, emitter: Atarabi.UI.EventEmitter) => void;
        ui?: ListBox;
    }

    interface CustomValue {
        type: 'custom';
        key: string;
        uiFn?: (container: Window | Panel | Group, emitter: Atarabi.UI.EventEmitter) => Atarabi.UI.CustomOptions<any>;
        options?: Atarabi.UI.CustomOptions<any>;
    }

    type Value = PanelValue | PanelEndValue | GroupValue | GroupEndValue | TabbedPanelValue | TabbedPanelEndValue | TabValue | TabEndValue | CheckboxValue | RadioButtonValue | StaticTextValue | EditTextValue | NumberValue | SliderValue | ColorValue | ButtonValue | DropDownListValue | ListBoxValue | CustomValue;

    const isGroupValue = (value: Value): value is PanelValue | GroupValue | TabbedPanelValue | TabValue => {
        switch (value.type) {
            case 'panel':
            case 'group':
            case 'tabbedpanel':
            case 'tab':
                return true;
        }
        return false;
    };

    const isGroupEndValue = (value: Value): value is PanelEndValue | GroupEndValue | TabbedPanelEndValue | TabEndValue => {
        switch (value.type) {
            case 'panelend':
            case 'groupend':
            case 'tabbedpanelend':
            case 'tabend':
                return true;
        }
        return false;
    };

    const isControlValue = (value: Value): value is CheckboxValue | RadioButtonValue | StaticTextValue | EditTextValue | NumberValue | SliderValue | ColorValue | ButtonValue => {
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

    const isListValue = (value: Value): value is DropDownListValue | ListBoxValue => {
        switch (value.type) {
            case 'dropdownlist':
            case 'listbox':
                return true;
        }
        return false;
    };

    const isCustomValue = (value: Value): value is CustomValue => {
        switch (value.type) {
            case 'custom':
        }
        return false;
    };

    const generateUuid = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }) as Atarabi.Uuid;
    };

    type BuilderJsonData = { [key: string]: { type: string; value: any; items?: string[]; } };

    class BuilderOptions<Groups = {}, Controls = {}, Lists = {}, UIs = {}, Stack extends string[] = []> {
        private _keys: { [key: string]: boolean } = {};
        events: { [eventName: string]: { uuid: Atarabi.Uuid; callback: Function; }[] } = {};
        win: {
            win: Window | Panel | 'palette' | 'dialog';
            title?: string;
            options?: Atarabi.UI.WindowOptions;
            uiFn?: (win: Window | Panel, emitter: Atarabi.UI.EventEmitter) => void;
        } = null;
        values: Value[] = [];
        constructor(win: Window | Panel | 'palette' | 'dialog', title?: string, options?: Atarabi.UI.WindowOptions, uiFn?: (win: Window | Panel, emitter: Atarabi.UI.EventEmitter) => void) {
            this.win = {
                win,
                title,
                options,
                uiFn,
            };
        }
        private checkKey(key: string) {
            if (this._keys[key]) {
                throw `Duplicate key: ${key}`;
            }
            this._keys[key] = true;
        }
        // Events
        addEventListener(eventName: string, callback: Function, uuidFn?: (uuid: Atarabi.Uuid) => void): this {
            if (!this.events[eventName]) {
                this.events[eventName] = [];
            }
            const uuid = generateUuid();
            this.events[eventName].push({
                uuid,
                callback,
            });
            if (uuidFn) {
                uuidFn(uuid);
            }
            return this;
        }
        // Groups
        addPanel<K extends string>(key: K, text?: string, options?: Atarabi.UI.PanelOptions, uiFn?: (ui: Panel) => void): K extends keyof UIs ? never : BuilderOptions<Groups & { [P in K]: never; }, Controls, Lists, UIs & { [P in K]: Panel; }, Unshift<Stack, 'Panel'>> {
            this.checkKey(key);
            this.values.push({
                type: 'panel',
                key,
                text,
                options,
                uiFn,
            });
            return this as any;
        }
        addPanelEnd(): Head<Stack> extends 'Panel' ? BuilderOptions<Groups, Controls, Lists, UIs, Tail<Stack>> : never {
            this.values.push({
                type: 'panelend',
            });
            return this as any;
        }
        addGroup<K extends string>(key: K, options?: Atarabi.UI.GroupOptions, uiFn?: (ui: Group) => void): K extends keyof UIs ? never : BuilderOptions<Groups & { [P in K]: never; }, Controls, Lists, UIs & { [P in K]: Group; }, Unshift<Stack, 'Group'>> {
            this.checkKey(key);
            this.values.push({
                type: 'group',
                key,
                options,
                uiFn,
            });
            return this as any;
        }
        addGroupEnd(): Head<Stack> extends 'Group' ? BuilderOptions<Groups, Controls, Lists, UIs, Tail<Stack>> : never {
            this.values.push({
                type: 'groupend',
            });
            return this as any;
        }
        addTabbedPanel<K extends string>(key: K, text?: string, options?: Atarabi.UI.TabbedPanelOptions, uiFn?: (ui: TabbedPanel) => void): K extends keyof UIs ? never : BuilderOptions<Groups & { [P in K]: never; }, Controls, Lists, UIs & { [P in K]: TabbedPanel; }, Unshift<Stack, 'TabbedPanel'>> {
            this.checkKey(key);
            this.values.push({
                type: 'tabbedpanel',
                key,
                text,
                options,
                uiFn,
            });
            return this as any;
        }
        addTabbedPanelEnd(): Head<Stack> extends 'TabbedPanel' ? BuilderOptions<Groups, Controls, Lists, UIs, Tail<Stack>> : never {
            this.values.push({
                type: 'tabbedpanelend',
            });
            return this as any;
        }
        addTab<K extends string>(key: K, text?: string, options?: Atarabi.UI.TabOptions, uiFn?: (ui: Tab) => void): K extends keyof UIs ? never : BuilderOptions<Groups & { [P in K]: never; }, Controls, Lists, UIs & { [P in K]: Tab; }, Unshift<Stack, 'Tab'>> {
            this.checkKey(key);
            this.values.push({
                type: 'tab',
                key,
                text,
                options,
                uiFn,
            });
            return this as any;
        }
        addTabEnd(): Head<Stack> extends 'Tab' ? BuilderOptions<Groups, Controls, Lists, UIs, Tail<Stack>> : never {
            this.values.push({
                type: 'tabend',
            });
            return this as any;
        }
        // Controls
        addCheckbox<K extends string>(key: K, defaultValue?: boolean, text?: string, options?: Atarabi.UI.CheckboxOptions, uiFn?: (ui: Checkbox) => void): K extends keyof UIs ? never : BuilderOptions<Groups, Controls & { [P in K]: boolean; }, Lists, UIs & { [P in K]: Checkbox; }, Stack> {
            this.checkKey(key);
            this.values.push({
                type: 'checkbox',
                key,
                defaultValue,
                text,
                options,
                uiFn,
            });
            return this as any;
        }
        addRadioButton<K extends string>(key: K, defaultValue?: boolean, text?: string, options?: Atarabi.UI.RadioButtonOptions, uiFn?: (ui: RadioButton) => void): K extends keyof UIs ? never : BuilderOptions<Groups, Controls & { [P in K]: boolean; }, Lists, UIs & { [P in K]: RadioButton; }, Stack> {
            this.checkKey(key);
            this.values.push({
                type: 'radiobutton',
                key,
                defaultValue,
                text,
                options,
                uiFn,
            });
            return this as any;
        }
        addStaticText<K extends string>(key: K, defaultValue?: string, options?: Atarabi.UI.StaticTextOptions, uiFn?: (ui: StaticText) => void): K extends keyof UIs ? never : BuilderOptions<Groups, Controls & { [P in K]: string; }, Lists, UIs & { [P in K]: StaticText; }, Stack> {
            this.checkKey(key);
            this.values.push({
                type: 'statictext',
                key,
                defaultValue,
                options,
                uiFn,
            });
            return this as any;
        }
        addEditText<K extends string>(key: K, defaultValue?: string, options?: Atarabi.UI.EditTextOptions, uiFn?: (ui: EditText) => void): K extends keyof UIs ? never : BuilderOptions<Groups, Controls & { [P in K]: string; }, Lists, UIs & { [P in K]: EditText; }, Stack> {
            this.checkKey(key);
            this.values.push({
                type: 'edittext',
                key,
                defaultValue,
                options,
                uiFn,
            });
            return this as any;
        }
        addNumber<K extends string>(key: K, value: { initialvalue?: number; minvalue?: number; maxvalue?: number; } = {}, options?: Atarabi.UI.NumberOptions, uiFn?: (ui: Atarabi.UI.NumberUI) => void): K extends keyof UIs ? never : BuilderOptions<Groups, Controls & { [P in K]: number; }, Lists, UIs & { [P in K]: Atarabi.UI.NumberUI; }, Stack> {
            this.checkKey(key);
            this.values.push({
                type: 'number',
                key,
                value,
                options,
                uiFn,
            });
            return this as any;
        }
        addSlider<K extends string>(key: K, value: { initialvalue?: number; minvalue?: number; maxvalue?: number; } = {}, options?: Atarabi.UI.SliderOptions, uiFn?: (ui: Slider) => void): K extends keyof UIs ? never : BuilderOptions<Groups, Controls & { [P in K]: number; }, Lists, UIs & { [P in K]: Slider; }, Stack> {
            this.checkKey(key);
            this.values.push({
                type: 'slider',
                key,
                value,
                options,
                uiFn,
            });
            return this as any;
        }
        addColor<K extends string>(key: K, defaultValue?: Atarabi.Color, options?: Atarabi.UI.ColorOptions, uiFn?: (ui: Atarabi.UI.ColorUI) => void): K extends keyof UIs ? never : BuilderOptions<Groups, Controls & { [P in K]: Atarabi.Color; }, Lists, UIs & { [P in K]: Atarabi.UI.ColorUI; }, Stack> {
            this.checkKey(key);
            this.values.push({
                type: 'color',
                key,
                defaultValue,
                options,
                uiFn,
            });
            return this as any;
        }
        addButton<K extends string>(key: K, defaultValue?: string, options?: Atarabi.UI.ButtonOptions, uiFn?: (ui: Button) => void): K extends keyof UIs ? never : BuilderOptions<Groups, Controls & { [P in K]: string; }, Lists, UIs & { [P in K]: Button; }, Stack> {
            this.checkKey(key);
            this.values.push({
                type: 'button',
                key,
                defaultValue,
                options,
                uiFn,
            });
            return this as any;
        }
        addCustom<K extends string, CustomValue = any>(key: K, uiFn: (container: Window | Panel | Group, emitter: Atarabi.UI.EventEmitter) => Atarabi.UI.CustomOptions<CustomValue>): K extends keyof UIs ? never : BuilderOptions<Groups, Controls & { [P in K]: CustomValue; }, Lists, UIs, Stack> {
            this.checkKey(key);
            this.values.push({
                type: 'custom',
                key,
                uiFn,
            });
            return this as any;
        }
        // Lists
        addDropDownList<K extends string>(key: K, items?: string[], options?: Atarabi.UI.DropDownListOptions, uiFn?: (ui: DropDownList) => void): K extends keyof UIs ? never : BuilderOptions<Groups, Controls, Lists & { [P in K]: string | string[]; }, UIs & { [P in K]: DropDownList; }, Stack> {
            this.checkKey(key);
            this.values.push({
                type: 'dropdownlist',
                key,
                items,
                options,
                uiFn,
            });
            return this as any;
        }
        addListBox<K extends string>(key: K, items?: string[], options?: Atarabi.UI.ListBoxOptions, uiFn?: (ui: ListBox) => void): K extends keyof UIs ? never : BuilderOptions<Groups, Controls, Lists & { [P in K]: string | string[]; }, UIs & { [P in K]: ListBox; }, Stack> {
            this.checkKey(key);
            this.values.push({
                type: 'listbox',
                key,
                items,
                options,
                uiFn,
            });
            return this as any;
        }
        // Build
        build() {
            return new Builder<Groups, Controls, Lists, UIs>(this);
        }
    }

    class Builder<Groups = {}, Controls = {}, Lists = {}, UIs = {}> implements Atarabi.UI.Builder<Groups, Controls, Lists, UIs> {
        private _values: { [key: string]: Value } = {};
        private _events: { [eventName: string]: { uuid: Atarabi.Uuid; callback: Function; }[] } = {};
        private _win: Panel | Window;
        constructor(options: BuilderOptions<Groups, Controls, Lists, UIs, any>) {
            this._events = options.events;
            this.build(options);
        }
        private build(options: BuilderOptions<Groups, Controls, Lists, UIs, any>) {
            const win = this._win = (options.win.win instanceof Panel || options.win.win instanceof Window) ? options.win.win : new Window(options.win.win, options.win.title, undefined, options.win.options);
            if (options.win.uiFn) {
                options.win.uiFn(win, this);
            }

            type Container = Window | Atarabi.UI.GroupUI;
            let container: Container = win;
            let containerDepth = 0;

            for (const value of options.values) {
                switch (value.type) {
                    // Group
                    case 'panel':
                        {
                            const ui = container = value.ui = container.add('panel', undefined, isString(value.text) ? value.text : value.key, value.options);
                            if (value.uiFn) {
                                value.uiFn(ui, this);
                            }
                            this._values[value.key] = value;
                            ++containerDepth;
                        }
                        break;
                    case 'panelend':
                        {
                            if (containerDepth === 0 || !(container instanceof Panel && container.type === 'panel')) {
                                throw `Unbalanced panel/panelend`;
                            }
                            container = container.parent as Container;
                            --containerDepth;
                        }
                        break;
                    case 'group':
                        {
                            const ui = container = value.ui = container.add('group', undefined, value.options);
                            if (value.uiFn) {
                                value.uiFn(ui, this);
                            }
                            this._values[value.key] = value;
                            ++containerDepth;
                        }
                        break;
                    case 'groupend':
                        {
                            if (containerDepth === 0 || !(container instanceof Group)) {
                                throw `Unbalanced group/groupend`;
                            }
                            container = container.parent as Container;
                            --containerDepth;
                        }
                        break;
                    case 'tabbedpanel':
                        {
                            const ui = value.ui = container.add('tabbedpanel', undefined, isString(value.text) ? value.text : value.key, value.options);
                            container = ui as any as Panel;
                            if (value.uiFn) {
                                value.uiFn(ui, this);
                            }
                            this._values[value.key] = value;
                            ++containerDepth;
                        }
                        break;
                    case 'tabbedpanelend':
                        {
                            if (containerDepth === 0 || !(container instanceof Panel && container.type === 'tabbedpanel')) {
                                throw `Unbalanced tabbedpanel/tabbedpanelend`;
                            }
                            container = container.parent as Container;
                            --containerDepth;
                        }
                        break;
                    case 'tab':
                        {
                            const ui = container = value.ui = (container as any as TabbedPanel).add('tab', undefined, isString(value.text) ? value.text : value.key, value.options);
                            if (value.uiFn) {
                                value.uiFn(ui, this);
                            }
                            this._values[value.key] = value;
                            ++containerDepth;
                        }
                        break;
                    case 'tabend':
                        {
                            if (containerDepth === 0 || !(container instanceof Panel && container.type === 'tab')) {
                                throw `Unbalanced tab/tabend`;
                            }
                            container = container.parent as Container;
                            --containerDepth;
                        }
                        break;
                    // Controls
                    case 'checkbox':
                        {
                            const ui = value.ui = container.add('checkbox', undefined, isString(value.text) ? value.text : value.key, value.options);
                            if (isBoolean(value.defaultValue)) {
                                ui.value = value.defaultValue;
                            }
                            if (value.uiFn) {
                                value.uiFn(ui, this);
                            }
                            this._values[value.key] = value;
                        }
                        break;
                    case 'radiobutton':
                        {
                            const ui = value.ui = container.add('radiobutton', undefined, isString(value.text) ? value.text : value.key, value.options);
                            if (isBoolean(value.defaultValue)) {
                                ui.value = value.defaultValue;
                            }
                            if (value.uiFn) {
                                value.uiFn(ui, this);
                            }
                            this._values[value.key] = value;
                        }
                        break;
                    case 'statictext':
                        {
                            const ui = value.ui = container.add('statictext', undefined, isString(value.defaultValue) ? value.defaultValue : '', value.options);
                            if (value.uiFn) {
                                value.uiFn(ui, this);
                            }
                            this._values[value.key] = value;
                        }
                        break;
                    case 'edittext':
                        {
                            const ui = value.ui = container.add('edittext', undefined, isString(value.defaultValue) ? value.defaultValue : '', value.options);
                            if (value.uiFn) {
                                value.uiFn(ui, this);
                            }
                            this._values[value.key] = value;
                        }
                        break;
                    case 'number':
                        {
                            const { initialvalue = 0, minvalue = -Number.MAX_VALUE, maxvalue = Number.MAX_VALUE } = value.value;
                            const ui = value.ui = container.add('edittext', undefined, `${initialvalue}`, value.options);
                            value.value = {
                                initialvalue,
                                minvalue,
                                maxvalue,
                            };
                            if (value.uiFn) {
                                value.uiFn(ui, this);
                            }
                            const onChange = ui.onChange;
                            ui.onChange = () => {
                                if (/^([0-9\+\-\*\/eE\.\(\)]|\s)+$/.test(ui.text)) {
                                    try {
                                        const value = eval(ui.text);
                                        if (isNumber(value)) {
                                            if (value < minvalue) {
                                                ui.text = `${minvalue}`;
                                            } else if (value > maxvalue) {
                                                ui.text = `${maxvalue}`;
                                            }
                                        } else {
                                            ui.text = `${initialvalue}`;
                                        }
                                    } catch (e) {
                                        ui.text = `${initialvalue}`;
                                    }
                                } else {
                                    ui.text = `${initialvalue}`;
                                }
                                if (isFunction(onChange)) {
                                    onChange.call(ui);
                                }
                            };
                            this._values[value.key] = value;
                        }
                        break;
                    case 'slider':
                        {
                            const { initialvalue, minvalue, maxvalue } = value.value;
                            const ui = value.ui = container.add('slider', undefined, initialvalue, minvalue, maxvalue, value.options);
                            if (value.uiFn) {
                                value.uiFn(ui, this);
                            }
                            this._values[value.key] = value;
                        }
                        break;
                    case 'color':
                        {
                            const ui = value.ui = container.add('button', undefined, undefined, value.options) as ColorButton;
                            if (value.uiFn) {
                                value.uiFn(ui, this);
                            }
                            if (isArray(value.defaultValue)) {
                                let [red, green, blue] = value.defaultValue;
                                if (!isNumber(red)) {
                                    red = 1;
                                }
                                if (!isNumber(green)) {
                                    green = 1;
                                }
                                if (!isNumber(blue)) {
                                    blue = 1;
                                }
                                ui.value = [red, green, blue];
                            } else {
                                ui.value = [1, 1, 1];
                            }
                            ui.onClick = () => {
                                const color = Atarabi.app.colorPicker(ui.value);
                                if (color) {
                                    ui.value = color;
                                    ui.notify('onDraw');
                                    if (isFunction(ui.onChange)) {
                                        ui.onChange();
                                    }
                                }
                            };
                            const clamp = (v: number) => Math.max(0, Math.min(1, v));
                            ui.onDraw = () => {
                                const graphics = ui.graphics;
                                const size = ui.size;
                                const color = [clamp(ui.value[0]), clamp(ui.value[1]), clamp(ui.value[2]), 1] as [number, number, number, number];
                                if (!ui.enabled) {
                                    color[0] *= 0.1;
                                    color[1] *= 0.1;
                                    color[2] *= 0.1;
                                }
                                const brush = graphics.newBrush(graphics.BrushType.SOLID_COLOR as any, color);
                                graphics.rectPath(0, 0, size[0], size[1]);
                                graphics.fillPath(brush);
                            };
                            this._values[value.key] = value;
                        }
                        break;
                    case 'button':
                        {
                            const ui = value.ui = container.add('button', undefined, isString(value.defaultValue) ? value.defaultValue : value.key, value.options);
                            if (value.uiFn) {
                                value.uiFn(ui, this);
                            }
                            this._values[value.key] = value;
                        }
                        break;
                    case 'custom':
                        {
                            const result = value.uiFn(container, this);
                            value.options = result;
                            this._values[value.key] = value;
                        }
                        break;
                    // Lists
                    case 'dropdownlist':
                        {
                            const ui = value.ui = container.add('dropdownlist', undefined, value.items, value.options);
                            if (value.uiFn) {
                                value.uiFn(ui, this);
                            }
                            this._values[value.key] = value;
                        }
                        break;
                    case 'listbox':
                        {
                            const ui = value.ui = container.add('listbox', undefined, value.items, value.options);
                            if (value.uiFn) {
                                value.uiFn(ui, this);
                            }
                            this._values[value.key] = value;
                        }
                        break;
                    default:
                        throw `invalid type`;
                }
            }

            if (options.win.options && options.win.options.resizeable) {
                if (!win.onResizing) {
                    win.onResizing = () => {
                        win.layout.resize();
                    };
                }
                if (!win.onResize) {
                    win.onResize = () => {
                        win.layout.resize();
                    };
                }
            }

            if (win instanceof Panel) {
                win.layout.layout(true);
            } else {
                win.center();
                win.show();
            }
        }
        // Events
        addEventListener(eventName: string, callback: Function): Atarabi.Uuid {
            if (!this._events[eventName]) {
                this._events[eventName] = [];
            }
            const uuid = generateUuid();
            this._events[eventName].push({
                uuid,
                callback,
            });
            return uuid;
        }
        removeEventListener(eventName: string, uuid: Atarabi.Uuid): boolean {
            const _event = this._events[eventName];
            if (!_event) {
                return false;
            }
            for (let i = 0; i < _event.length; i++) {
                const fn = _event[i];
                if (fn.uuid === uuid) {
                    _event.splice(i, 1);
                    return true;
                }
            }
            return false;
        }
        notify(eventName: string, ...args: any[]) {
            const _event = this._events[eventName];
            if (!_event) {
                return;
            }
            for (const fn of _event) {
                fn.callback(...args);
            }
        }
        // Groups / Controls / Lists
        show<K extends keyof UIs>(key: K): void {
            const _value = this._values[key as string];
            if (!(isGroupEndValue(_value) || isCustomValue(_value))) {
                _value.ui.show();
            }
        }
        hide<K extends keyof UIs>(key: K): void {
            const _value = this._values[key as string];
            if (!(isGroupEndValue(_value) || isCustomValue(_value))) {
                _value.ui.hide();
            }
        }
        enable<K extends keyof UIs>(key: K): void {
            const _value = this._values[key as string];
            if (!(isGroupEndValue(_value) || isCustomValue(_value))) {
                _value.ui.enabled = true;
            }
        }
        disable<K extends keyof UIs>(key: K): void {
            const _value = this._values[key as string];
            if (!(isGroupEndValue(_value) || isCustomValue(_value))) {
                _value.ui.enabled = false;
            }
        }
        ui<K extends keyof UIs>(key: K): UIs[K] {
            const _value = this._values[key as string];
            if (isGroupEndValue(_value) || isCustomValue(_value)) {
                return null;
            }
            return _value.ui as any;
        }
        get<K extends keyof (Controls & Lists)>(key: K): (Controls & Lists)[K] {
            const _value = this._values[key as string];
            switch (_value.type) {
                case 'checkbox':
                case 'radiobutton':
                    return _value.ui.value as any;
                case 'statictext':
                case 'edittext':
                    return _value.ui.text as any;
                case 'number':
                    {
                        let result = _value.value.initialvalue;
                        if (/^([0-9\+\-\*\/eE\.\(\)]|\s)+$/.test(_value.ui.text)) {
                            try {
                                const v = eval(_value.ui.text);
                                if (isNumber(v)) {
                                    if (v < _value.value.minvalue) {
                                        result = _value.value.minvalue;
                                    } else if (v > _value.value.maxvalue) {
                                        result = _value.value.maxvalue;
                                    } else {
                                        result = v;
                                    }
                                }
                            } catch (e) {
                                // pass
                            }
                        }
                        return result as any;
                    }
                case 'slider':
                    return _value.ui.value as any;
                case 'color':
                    return _value.ui.value as any;
                case 'button':
                    return _value.ui.text as any;
                case 'custom':
                    if (_value.options && isFunction(_value.options.get)) {
                        return _value.options.get();
                    } else {
                        return null;
                    }
                case 'dropdownlist':
                case 'listbox':
                    {
                        let result: string | string[] = null;
                        const selection = _value.ui.selection;
                        if (selection) {
                            if (isArray(selection)) {
                                result = [];
                                for (let item of selection) {
                                    result.push(item.text);
                                }
                            } else {
                                result = (selection as ListItem).text;
                            }
                        }
                        return result as any;
                    }
            }
            return null;
        }
        set<K extends keyof (Controls & Lists)>(key: K, value: (Controls & Lists)[K]): void {
            const _value = this._values[key as string];
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
                        _value.ui.text = `${Math.max(_value.value.minvalue, Math.min(_value.value.maxvalue, value))}`;
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
                        let texts: string[] = [];
                        if (value === null) {
                            // deselect all
                        } else if (isString(value)) {
                            texts.push(value);
                        } else if (typeof _value.ui.properties === 'object' && _value.ui.properties.multiselect === true && isArray(value)) {
                            for (const text of value) {
                                if (isString(text)) {
                                    texts.push(text);
                                } else {
                                    throw 'value must be string or string[]';
                                }
                            }
                        } else {
                            throw 'value must be null, string or string[]';
                        }
                        for (const item of _value.ui.items) {
                            let ok = false;
                            for (const text of texts) {
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
        }
        // Lists
        addItem<K extends keyof Lists>(key: K, text: string, fn?: (item: ListItem) => void): void {
            const _value = this._values[key as string];
            if (isListValue(_value)) {
                const item = _value.ui.add('item', text);
                if (fn) {
                    fn(item);
                }
            }

        }
        removeAll<K extends keyof Lists>(key: K, index: number | string): void {
            const _value = this._values[key as string];
            if (isListValue(_value)) {
                _value.ui.removeAll();
            }
        }
        // Groups / Lists
        remove<K extends keyof (Groups & Lists)>(key: K, index: number | string): void {
            const _value = this._values[key as string];
            if (isGroupValue(_value) || isListValue(_value)) {
                _value.ui.remove(index as any);
            }
        }
        // Window
        close() {
            if (this._win instanceof Window) {
                this._win.close();
            }
        }
        // Utility
        onInit(fn: (builder: this) => void) {
            fn(this);
        }
        private load<K extends keyof (Controls & Lists)>(data: BuilderJsonData, include?: K[]) {
            if (include) {
                for (const key in data) {
                    let found = false;
                    for (const inc of include) {
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
            for (const key in data) {
                const _data = data[key];
                const _value = this._values[key as string];
                if (!_value || _data.type !== _value.type) {
                    continue;
                }
                if (isControlValue(_value)) {
                    this.set(key as any, _data.value);
                } else if (isListValue(_value)) {
                    if (!_value.ui.items.length) {
                        _value.ui.removeAll();
                        for (const item of _data.items) {
                            _value.ui.add('item', item);
                        }
                    }
                    this.set(key as any, _data.value);
                }
            }
        }
        loadFromFile<K extends keyof (Controls & Lists)>(file: File, include?: K[]) {
            if (!file.exists) {
                return;
            }
            file.encoding = 'utf-8';
            if (!file.open('r')) {
                throw `Unable to open file`;
            }
            const body = file.read();
            file.close();
            let data: BuilderJsonData = null;
            try {
                data = Atarabi.JSON.parse(body);
            } catch (e) {
                throw `Invalid data`;
            }
            if (typeof data !== 'object') {
                throw `Invalid data`;
            }
            this.load(data, include);
        }
        loadFromSetting<K extends keyof (Controls & Lists)>(section: string, key: string, include?: K[]) {
            if (!app.settings.haveSetting(section, key)) {
                return;
            }
            let data: BuilderJsonData = null;
            try {
                data = Atarabi.JSON.parse(app.settings.getSetting(section, key));
            } catch (e) {
                throw `Invalid data`;
            }
            if (typeof data !== 'object') {
                throw `Invalid data`;
            }
            this.load(data, include);
        }
        private generateSaveData<K extends keyof (Controls & Lists)>(include?: K[]) {
            let data = this.toJSON();
            if (include) {
                for (const key in data) {
                    let found = false;
                    for (const inc of include) {
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
        }
        saveToFile<K extends keyof (Controls & Lists)>(file: File, include?: K[]) {
            const data = this.generateSaveData(include);
            file.encoding = 'utf-8';
            if (!file.open('w')) {
                throw `Unable to open file`;
            }
            file.write(Atarabi.JSON.stringify(data, undefined, 2));
            file.close();
        }
        saveToSetting<K extends keyof (Controls & Lists)>(section: string, key: string, include?: K[]) {
            const data = this.generateSaveData(include);
            app.settings.saveSetting(section, key, Atarabi.JSON.stringify(data));
        }
        toJSON<K extends keyof (Controls & Lists)>(): { [P in K]: { type: string; value: (Controls & Lists)[K]; items?: string[]; } } {
            let obj: BuilderJsonData = {};
            for (const key in this._values) {
                const _value = this._values[key];
                if (isControlValue(_value)) {
                    obj[key] = {
                        type: _value.type,
                        value: this.get(key as any),
                    }
                } else if (isListValue(_value)) {
                    let items: string[] = [];
                    for (const item of _value.ui.items) {
                        items.push(item.text);
                    }
                    obj[key] = {
                        type: _value.type,
                        value: this.get(key as any),
                        items,
                    };
                }
            }
            return obj as any;
        }
    }

    Atarabi.UI.Builder = BuilderOptions as any;

    /*
        Fuzzy Search
    */
    function assign(t: any, ...args: any[]) {
        for (let arg of args) {
            for (var p in arg) if (Object.prototype.hasOwnProperty.call(arg, p))
                t[p] = arg[p];
        }
        return t;
    }

    interface FuzzySearchOptions {
        caseSensitive?: boolean;
        sort?: boolean;
        cache?: boolean;
        maxCacheSize?: number;
    }

    class FuzzySearch<T> {
        private items: T[];
        private keyWeights: { key: keyof T; weight: number }[];
        private options: {
            caseSensitive: boolean;
            cache: boolean;
            sort: boolean;
            maxCacheSize: number;
        };
        private _cache: { [key: string]: T[] } = {};
        private _cacheKeys: string[] = [];
        constructor(items: T[], keys: ((keyof T) | { key: keyof T; weight: number; })[], options: FuzzySearchOptions = {}) {
            this.items = items;
            this.keyWeights = [];
            if (keys != null) {
                for (const k of keys) {
                    if (typeof k === "object" && k !== null && "key" in k) {
                        this.keyWeights.push({ key: k.key, weight: k.weight });
                    } else {
                        this.keyWeights.push({ key: k as keyof T, weight: 1 });
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
        public search(query: string = ''): T[] {
            query = query.replace(/^\s+|\s+$/g, "");
            if (!query) return this.items;

            const { caseSensitive, cache, sort, maxCacheSize } = this.options;
            query = caseSensitive ? query : query.toLowerCase();

            if (cache && Object.prototype.hasOwnProperty.call(this._cache, query)) {
                this.refreshCacheKey(query);
                return this._cache[query];
            }

            const matchedItems: { item: T; score: number; }[] = [];
            const qChars = query.split('');
            for (const item of this.items) {
                let bestScore = -1;
                if (this.keyWeights.length === 0) {
                    if (typeof item !== "string") continue;
                    const targetText = caseSensitive ? item : item.toLowerCase();
                    bestScore = this.calculateScore(targetText, query, qChars, item);
                } else {
                    for (const kw of this.keyWeights) {
                        const value = item[kw.key];
                        if (typeof value !== "string") continue;
                        const targetText = caseSensitive ? value : value.toLowerCase();
                        let score = this.calculateScore(targetText, query, qChars, value);
                        if (score > -1) {
                            score *= kw.weight;
                            if (score > bestScore) bestScore = score;
                        }
                    }
                }
                if (bestScore > -1) matchedItems.push({ item, score: bestScore });
            }

            if (sort) {
                matchedItems.sort((a, b) => b.score - a.score);
            }

            const result: T[] = [];
            for (const item of matchedItems) {
                result.push(item.item);
            }

            if (cache) {
                if (this._cacheKeys.length >= maxCacheSize) {
                    const oldestKey = this._cacheKeys.shift();
                    if (oldestKey != null) delete this._cache[oldestKey];
                }
                this._cache[query] = result;
                this._cacheKeys.push(query);
            }

            return result;
        }
        private refreshCacheKey(key: string): void {
            let foundIndex = -1;
            for (let i = 0; i < this._cacheKeys.length; i++) {
                if (this._cacheKeys[i] === key) {
                    foundIndex = i;
                    break;
                }
            }
            if (foundIndex !== -1) {
                this._cacheKeys.splice(foundIndex, 1);
                this._cacheKeys.push(key);
            }
        }
        private calculateScore(text: string, query: string, qChars: string[], original: string): number {
            const firstFoundIdx = text.indexOf(qChars[0]);
            if (firstFoundIdx === -1) return -1;
            if (text === query) return 100000;

            let score = 0;
            let textIdx = firstFoundIdx + 1;
            let lastFoundIdx = firstFoundIdx;
            let consecutiveCount = 0;
            if (firstFoundIdx === 0) {
                score += 500;
                if (text.indexOf(query) === 0) score += 10000;
            }

            score += 100 - firstFoundIdx;

            for (let i = 1; i < qChars.length; i++) {
                const ch = qChars[i];
                const foundIdx = text.indexOf(ch, textIdx);
                if (foundIdx === -1) return -1;
                const prevCh = text[foundIdx - 1];
                if (prevCh === ' ' || prevCh === '_' || prevCh === '.' || prevCh === '-') {
                    score += 250;
                } else  {
                    const code = original.charCodeAt(foundIdx);
                    if (code >= 65 && code <= 90) score += 250;
                }
                score += 100 - foundIdx;
                if (lastFoundIdx !== -1 && foundIdx === lastFoundIdx + 1) {
                    consecutiveCount++;
                    score += 200 * consecutiveCount;
                } else {
                    consecutiveCount = 0;
                }
                lastFoundIdx = foundIdx;
                textIdx = foundIdx + 1;
            }
            score += 100 - (lastFoundIdx - firstFoundIdx);
            score -= text.length; // length penalty
            return score;
        }
    }

    Atarabi.UI.FuzzySearch = <T extends any>(haystack: T[], keys: (string | Atarabi.UI.KeyWithWeight)[], options: FuzzySearchOptions = {}) => {
        return new FuzzySearch<T>(haystack, keys as any, options);
    };

})();
