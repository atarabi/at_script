declare namespace Atarabi {

    interface UI {
        Builder: UI.BuilderOptions;

        FuzzySearch<T>(haystack: T[], keys: string[], options?: {caseSensitive?: boolean; sort?: boolean; cache?: boolean;}): UI.FuzzySearch<T>;
    }

    /*
    * UI
    */
    namespace UI {
        interface WindowOptions {
            resizeable?: boolean;
            closeButton?: boolean;
            maximizeButton?: boolean;
            minimizeButton?: boolean;
            independent?: boolean;
            borderless?: boolean;
        }

        interface PanelOptions {
            name?: string;
            borderStyle?: string;
            su1PanelCoordinates?: boolean;
        }

        interface GroupOptions {
            name?: string;
        }

        interface TabbedPanelOptions {
            name?: string;
        }

        interface TabOptions {
            name?: string;
        }

        interface CheckboxOptions {
            name?: string;
        }

        interface RadioButtonOptions {
            name?: string;
        }

        interface StaticTextOptions {
            name?: string;
            multiline?: boolean;
            scrolling?: boolean;
            truncate?: string;
        }

        interface EditTextOptions {
            name?: string;
            readonly?: boolean;
            noecho?: boolean;
            enterKeySignalsOnChange?: boolean;
            borderless?: boolean;
            multiline?: boolean;
            scrollable?: boolean;
        }

        interface NumberOptions {
            name?: string;
            readonly?: boolean;
            enterKeySignalsOnChange?: boolean;
            borderless?: boolean;
        }

        interface SliderOptions {
            name?: string;
        }

        interface ColorOptions {
            name?: string;
        }

        interface ButtonOptions {
            name?: string;
        }

        interface DropDownListOptions {
            name?: string;
            items?: string[];
        }

        interface ListBoxOptions {
            name?: string;
            multiselect?: boolean;
            items?: string[];
            numberOfColumns?: number;
            showHeaders?: boolean;
            columnWidths?: number[];
            columnTitles?: string[];
        }

        interface CustomOptions<Value> {
            get?: () => Value;
            set?: (value: Value) => void;
        }

        type NumberUI = Omit<EditText, 'onChanging' | 'text'>;

        type ColorUI = Omit<Button, 'onClick' | 'onDraw'> & { onChange: Function; };

        type GroupUI = Panel | Group | TabbedPanel | Tab;

        type ControUI = Checkbox | RadioButton | StaticText | EditText | NumberUI | Slider | ColorUI | Button;

        type ListUI = DropDownList | ListBox;

        interface BuilderOptions<Groups = {}, Controls = {}, Lists = {}, UIs = {}, Stack extends string[] = []> {
            new(win: Window | Panel | 'palette' | 'dialog', title?: string, options?: WindowOptions, uiFn?: (win: Window | Panel, emitter: EventEmitter) => void): BuilderOptions;

            // Events
            addEventListener(eventName: string, callback: Function, uuidFn?: (uuid: Uuid) => void): this;

            // Groups
            addPanel<K extends string>(key: K, text?: string, options?: PanelOptions, uiFn?: (ui: Panel, emitter: EventEmitter) => void): K extends keyof UIs ? never : BuilderOptions<Groups & { [P in K]: never; }, Controls, Lists, UIs & { [P in K]: Panel; }, Unshift<Stack, 'Panel'>>;
            addPanelEnd(): Head<Stack> extends 'Panel' ? BuilderOptions<Groups, Controls, Lists, UIs, Tail<Stack>> : never;
            addGroup<K extends string>(key: K, options?: GroupOptions, uiFn?: (ui: Group, emitter: EventEmitter) => void): K extends keyof UIs ? never : BuilderOptions<Groups & { [P in K]: never; }, Controls, Lists, UIs & { [P in K]: Group; }, Unshift<Stack, 'Group'>>;
            addGroupEnd(): Head<Stack> extends 'Group' ? BuilderOptions<Groups, Controls, Lists, UIs, Tail<Stack>> : never;
            addTabbedPanel<K extends string>(key: K, text?: string, options?: TabbedPanelOptions, uiFn?: (ui: TabbedPanel, emitter: EventEmitter) => void): K extends keyof UIs ? never : BuilderOptions<Groups & { [P in K]: never; }, Controls, Lists, UIs & { [P in K]: TabbedPanel; }, Unshift<Stack, 'TabbedPanel'>>;
            addTabbedPanelEnd(): Head<Stack> extends 'TabbedPanel' ? BuilderOptions<Groups, Controls, Lists, UIs, Tail<Stack>> : never;
            addTab<K extends string>(key: K, text?: string, options?: TabOptions, uiFn?: (ui: Tab, emitter: EventEmitter) => void): K extends keyof UIs ? never : BuilderOptions<Groups & { [P in K]: never; }, Controls, Lists, UIs & { [P in K]: Tab; }, Unshift<Stack, 'Tab'>>;
            addTabEnd(): Head<Stack> extends 'Tab' ? BuilderOptions<Groups, Controls, Lists, UIs, Tail<Stack>> : never;

            // Controls
            addCheckbox<K extends string>(key: K, defaultValue?: boolean, text?: string, options?: CheckboxOptions, uiFn?: (ui: Checkbox, emitter: EventEmitter) => void): K extends keyof UIs ? never : BuilderOptions<Groups, Controls & { [P in K]: boolean; }, Lists, UIs & { [P in K]: Checkbox; }, Stack>;
            addRadioButton<K extends string>(key: K, defaultValue?: boolean, text?: string, options?: RadioButtonOptions, uiFn?: (ui: RadioButton, emitter: EventEmitter) => void): K extends keyof UIs ? never : BuilderOptions<Groups, Controls & { [P in K]: boolean; }, Lists, UIs & { [P in K]: RadioButton; }, Stack>;
            addStaticText<K extends string>(key: K, defaultValue?: string, options?: StaticTextOptions, uiFn?: (ui: StaticText, emitter: EventEmitter) => void): K extends keyof UIs ? never : BuilderOptions<Groups, Controls & { [P in K]: string; }, Lists, UIs & { [P in K]: StaticText; }, Stack>;
            addEditText<K extends string>(key: K, defaultValue?: string, options?: EditTextOptions, uiFn?: (ui: EditText, emitter: EventEmitter) => void): K extends keyof UIs ? never : BuilderOptions<Groups, Controls & { [P in K]: string; }, Lists, UIs & { [P in K]: EditText; }, Stack>;
            addNumber<K extends string>(key: K, value?: { initialvalue?: number; minvalue?: number; maxvalue?: number; }, options?: NumberOptions, uiFn?: (ui: NumberUI, emitter: EventEmitter) => void): K extends keyof UIs ? never : BuilderOptions<Groups, Controls & { [P in K]: number; }, Lists, UIs & { [P in K]: NumberUI; }, Stack>;
            addSlider<K extends string>(key: K, value?: { initialvalue?: number; minvalue?: number; maxvalue?: number; }, options?: SliderOptions, uiFn?: (ui: Slider, emitter: EventEmitter) => void): K extends keyof UIs ? never : BuilderOptions<Groups, Controls & { [P in K]: number; }, Lists, UIs & { [P in K]: Slider; }, Stack>;
            addColor<K extends string>(key: K, defaultValue?: Color, options?: ColorOptions, uiFn?: (ui: ColorUI, emitter: EventEmitter) => void): K extends keyof UIs ? never : BuilderOptions<Groups, Controls & { [P in K]: Color; }, Lists, UIs & { [P in K]: ColorUI; }, Stack>;
            addButton<K extends string>(key: K, defaultValue?: string, options?: ButtonOptions, uiFn?: (ui: Button, emitter: EventEmitter) => void): K extends keyof UIs ? never : BuilderOptions<Groups, Controls & { [P in K]: string; }, Lists, UIs & { [P in K]: Button; }, Stack>;
            addCustom<K extends string, Value = any>(key: K, uiFn: (container: Window | Panel | Group, emitter: EventEmitter) => CustomOptions<Value>): K extends keyof UIs ? never : BuilderOptions<Groups, Controls & { [P in K]: Value; }, Lists, UIs, Stack>;

            // Lists
            addDropDownList<K extends string>(key: K, items?: string[], options?: DropDownListOptions, uiFn?: (ui: DropDownList, emitter: EventEmitter) => void): K extends keyof UIs ? never : BuilderOptions<Groups, Controls, Lists & { [P in K]: string; }, UIs & { [P in K]: DropDownList; }, Stack>;
            addListBox<K extends string>(key: K, items?: string[], options?: ListBoxOptions, uiFn?: (ui: ListBox, emitter: EventEmitter) => void): K extends keyof UIs ? never : BuilderOptions<Groups, Controls, Lists & { [P in K]: string | string[]; }, UIs & { [P in K]: ListBox; }, Stack>;

            // Build
            build(): Builder<Groups, Controls, Lists, UIs>;
        }

        interface EventEmitter {
            // Events
            addEventListener<Args extends any[]>(eventName: string, callback: (...args: Args) => void): Uuid;
            removeEventListener(eventName: string, uuid: Uuid): boolean;
            notify<Args extends any[]>(eventName: string, ...args: Args): void;
        }

        interface Builder<Groups = {}, Controls = {}, Lists = {}, UIs = {}> extends EventEmitter {
            // Groups / Controls / Lists
            show<K extends keyof UIs>(key: K): void;
            hide<K extends keyof UIs>(key: K): void;
            enable<K extends keyof UIs>(key: K): void;
            disable<K extends keyof UIs>(key: K): void;
            ui<K extends keyof UIs>(key: K): UIs[K];

            // Controls / Lists
            get<K extends keyof (Controls & Lists)>(key: K): (Controls & Lists)[K];
            set<K extends keyof (Controls & Lists)>(key: K, value: (Controls & Lists)[K]): void;

            // Lists
            addItem<K extends keyof Lists>(key: K, text: string, fn?: (item: ListItem) => void): void;
            removeAll<K extends keyof Lists>(key: K, index: number | string): void;

            // Groups / Lists
            remove<K extends keyof Groups>(key: K, index: number | string): void;
            remove<K extends keyof Lists>(key: K, index: number | string): void;

            // Utility
            onInit(fn: (builder: this) => void): void;
            loadFromFile<K extends keyof (Controls & Lists)>(file: File, include?: K[]): void;
            loadFromSetting<K extends keyof (Controls & Lists)>(section: string, key: string, include?: K[]): void;
            saveToFile<K extends keyof (Controls & Lists)>(file: File, include?: K[]): void;
            saveToSetting<K extends keyof (Controls & Lists)>(section: string, key: string, include?: K[]): void;
            toJSON<K extends keyof (Controls & Lists)>(): { [P in K]: { type: string; value: (Controls & Lists)[K]; items?: string[]; } };
        }

        interface FuzzySearch<T> {
            search(query?: string): T[];
        }
    }

}
