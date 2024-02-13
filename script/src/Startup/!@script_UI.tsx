/**
 * @script_UI v0.2.0
 * 
 *      v0.2.0(2024/02/13)  Add custom
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
        constructor(options: BuilderOptions<Groups, Controls, Lists, UIs, any>) {
            this._events = options.events;
            this.build(options);
        }
        private build(options: BuilderOptions<Groups, Controls, Lists, UIs, any>) {
            const win = (options.win.win instanceof Panel || options.win.win instanceof Window) ? options.win.win : new Window(options.win.win, options.win.title, undefined, options.win.options);
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
                            const ui = container = value.ui = container.add('tabbedpanel', undefined, isString(value.text) ? value.text : value.key, value.options);
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
                            const ui = container = value.ui = container.add('tab', undefined, isString(value.text) ? value.text : value.key, value.options);
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
                                const brush = graphics.newBrush(graphics.BrushType.SOLID_COLOR, color);
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
    /*!
     *   Fuzzy search (https://github.com/wouter2203/fuzzy-search)
     *   ISC License
     *
     *   Copyright (c) 2016, Wouter Rutgers
     *   Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
     *   THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
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
    }

    class FuzzySearch<T> {
        haystack: T[];
        keys: string[];
        options: FuzzySearchOptions;
        cache: { [query: string]: T[] } = {};
        constructor(haystack: T[] = [], keys: string[] = [], options: FuzzySearchOptions = {}) {
            this.haystack = haystack;
            this.keys = keys;
            this.options = assign({
                caseSensitive: false,
                sort: false,
                cache: false,
            }, options);
        }

        search(query: string = ''): T[] {
            query = query.replace(/^\s+|\s+$/g, '');
            if (query === '') {
                return this.haystack;
            } else if (this.options.cache && this.cache[query]) {
                return this.cache[query];
            }
            const results = [];
            for (let i = 0; i < this.haystack.length; i++) {
                const item = this.haystack[i];
                if (this.keys.length === 0) {
                    const score = FuzzySearch.isMatch(item, query, this.options.caseSensitive);
                    if (score) {
                        results.push({ item, score });
                    }
                } else {
                    for (let y = 0; y < this.keys.length; y++) {
                        const propertyValues = getDescendantProperty(item, this.keys[y]);
                        let found = false;
                        for (let z = 0; z < propertyValues.length; z++) {
                            const score = FuzzySearch.isMatch(propertyValues[z], query, this.options.caseSensitive);
                            if (score) {
                                found = true;
                                results.push({ item, score });
                                break;
                            }
                        }
                        if (found) {
                            break;
                        }
                    }
                }
            }

            if (this.options.sort) {
                results.sort((a, b) => a.score - b.score);
            }

            const items = [];
            for (let result of results) {
                items.push(result.item);
            }

            if (this.options.cache) {
                this.cache[query] = items;
            }

            return items;
        }

        static isMatch(item, query, caseSensitive) {
            item = String(item);
            query = String(query);

            if (!caseSensitive) {
                item = item.toLocaleLowerCase();
                query = query.toLocaleLowerCase();
            }

            const indexes = FuzzySearch.nearestIndexesFor(item, query);

            if (!indexes) {
                return false;
            }

            if (item === query) {
                return 1;
            }

            if (indexes.length > 1) {
                return 2 + (indexes[indexes.length - 1] - indexes[0]);
            }

            return 2 + indexes[0];
        }

        static nearestIndexesFor(item, query) {
            const letters = query.split('');

            let tempIndexes = [];

            const indexesOfFirstLetter = FuzzySearch.indexesOfFirstLetter(item, query);

            for (let loopingIndex = 0; loopingIndex < indexesOfFirstLetter.length; loopingIndex++) {
                const startingIndex = indexesOfFirstLetter[loopingIndex];
                let index = startingIndex + 1;

                tempIndexes[loopingIndex] = [startingIndex];

                for (let i = 1; i < letters.length; i++) {
                    const letter = letters[i];

                    index = item.indexOf(letter, index);

                    if (index === -1) {
                        tempIndexes[loopingIndex] = false;

                        break;
                    }

                    tempIndexes[loopingIndex].push(index);

                    index++;
                }
            }

            let indexes = [];
            for (let letterIndexes of tempIndexes) {
                if (letterIndexes !== false) {
                    indexes.push(letterIndexes);
                }
            }

            if (!indexes.length) {
                return false;
            }

            return indexes.sort((a, b) => {
                if (a.length === 1) {
                    return a[0] - b[0];
                }

                a = a[a.length - 1] - a[0];
                b = b[b.length - 1] - b[0];

                return a - b;
            })[0];
        }

        static indexesOfFirstLetter(item, query) {
            const match = query[0];

            const results = [];
            const items = item.split('');
            for (let index = 0; index < items.length; index++) {
                const letter = items[index];
                if (letter === match) {
                    results.push(index);
                }
            }
            return results;
        }
    }

    function getDescendantProperty(object, path, list = []) {
        let firstSegment;
        let remaining;
        let dotIndex;
        let value;
        let index;
        let length;

        if (path) {
            dotIndex = path.indexOf('.');

            if (dotIndex === -1) {
                firstSegment = path;
            } else {
                firstSegment = path.slice(0, dotIndex);
                remaining = path.slice(dotIndex + 1);
            }

            value = object[firstSegment];
            if (value !== null && typeof value !== 'undefined') {
                if (!remaining && (typeof value === 'string' || typeof value === 'number')) {
                    list.push(value);
                } else if (Object.prototype.toString.call(value) === '[object Array]') {
                    for (index = 0, length = value.length; index < length; index++) {
                        getDescendantProperty(value[index], remaining, list);
                    }
                } else if (remaining) {
                    getDescendantProperty(value, remaining, list);
                }
            }
        } else {
            list.push(object);
        }
        return list;
    }

    Atarabi.UI.FuzzySearch = <T extends any>(haystack: T[], keys: string[], options: FuzzySearchOptions = {}) => {
        return new FuzzySearch<T>(haystack, keys, options);
    };

})();
