/**
 * @effect_launcher v2.1.0
 * 
 *      v2.1.0(2025/02/01)  Support footage shortcut
 *      v2.0.0(2024/11/14)  Support shortcut and reduce debounce time
 *      v1.0.3(2024/02/13)  Fix dynamic link bug
 *      v1.0.2(2023/12/05)  Fix lock bug
 *      v1.0.1(2023/09/23)  Fix strange behavior
 *      v1.0.0(2023/09/16)
 */
(() => {

    if (Atarabi.isDynamicLink()) {
        return;
    }

    const SCRIPT_NAME = '@effect_launcher';

    const DEBOUNCE_TIME = 100; // ms

    // utility
    function filter<T>(values: any[], fn: (value: any) => value is T): T[] {
        const arr: T[] = [];
        for (const value of values) {
            if (fn(value)) {
                arr.push(value);
            }
        }
        return arr;
    }

    function createFolder(folder: Folder) {
        if (folder.exists) {
            return;
        }
        const parents: Folder[] = [];
        let parent: Folder = folder;
        while (!(parent && parent.exists)) {
            parents.push(parent);
            parent = parent.parent;
        }
        parents.reverse();
        for (const folder of parents) {
            folder.create();
        }
    }

    function clone<T>(value: T): T {
        return eval(`(${Atarabi.JSON.stringify(value)})`);
    }

    function isWin() {
        return /^win/i.test($.os);
    }

    function makeFileFilter(exts: string[]): string | Function {
        if (isWin()) {
            let arr: string[] = [];
            for (const ext of exts) {
                arr.push(`*.${ext}`);
            }
            return arr.join(';');
        }
        return function (f: File | Folder) {
            const re = RegExp('\\.(' + exts.join('|') + ')$', 'i');
            return f instanceof Folder || re.test(f.displayName);
        };
    }

    // shortcut
    enum Type {
        Effect = 'effect',
        Script = 'script',
        Scriptlet = 'scriptlet',
        Preset = 'preset',
        Command = 'command',
        Footage = 'footage',
        Project = 'project',
        Unknown = 'unknown',
    }

    interface ISettings {
        type: '@scripts/@effect_launcher';
        version: 1;
        shortcuts: { [key: string]: ShortcutValue; };
    }

    const SETTINGS_FILE = new File(`${Folder.userData.absoluteURI}/Atarabi/@scripts/${SCRIPT_NAME}/settings.json`);
    SETTINGS_FILE.encoding = 'utf-8';
    let SETTINGS = loadSettings();
    const SETTINGS_COMMAND = '\\\\';

    type ShortcutValue = { type: Type; value: string; };

    type ShortcutValueWithKey = ShortcutValue & { key: string; };

    function hasShortcutKey(key: string): boolean {
        return SETTINGS.shortcuts.hasOwnProperty(key);
    }

    function getShortcutValue(key: string): ShortcutValue {
        return SETTINGS.shortcuts[key];
    }

    function getShortcutTypeFromFile(file: File): Type {
        if (!file.exists) {
            return Type.Unknown;
        }
        if (/\.(jsx|jsxbin)$/i.test(file.displayName)) {
            return Type.Script;
        } else if (/\.(ffx)$/i.test(file.displayName)) {
            return Type.Preset;
        }
        try {
            const importOptions = new ImportOptions(file);
            if (importOptions.canImportAs(ImportAsType.FOOTAGE) || importOptions.canImportAs(ImportAsType.COMP) || importOptions.canImportAs(ImportAsType.COMP_CROPPED_LAYERS)) {
                return Type.Footage;
            } else if (importOptions.canImportAs(ImportAsType.PROJECT)) {
                return Type.Project;
            }
        } catch (e) {
            alert(e);
        }
        return Type.Unknown;
    }

    function getShortcutValues(perms: { [type in Type]?: boolean; } = { [Type.Effect]: true, [Type.Script]: true, [Type.Preset]: true, }) {
        const values: ShortcutValueWithKey[] = [];
        for (let key in SETTINGS.shortcuts) {
            if (SETTINGS.shortcuts.hasOwnProperty(key)) {
                const value = getShortcutValue(key);
                if (perms[value.type]) {
                    values.push({ key, type: value.type, value: value.value });
                }
            }
        }
        return values;
    }

    function loadSettings(): ISettings {
        let settings: ISettings = {
            type: '@scripts/@effect_launcher',
            version: 1,
            shortcuts: {},
        };
        if (!SETTINGS_FILE.exists) {
            return settings;
        }
        try {
            if (!SETTINGS_FILE.open('r')) {
                return settings;
            }
            const data = SETTINGS_FILE.read();
            SETTINGS_FILE.close();
            settings = Atarabi.JSON.parse(data);
            // simple check
            if (!settings.shortcuts) {
                settings.shortcuts = {};
            }
        } catch (e) {
            alert(e);
        }
        return settings;
    }

    function saveSettings() {
        createFolder(SETTINGS_FILE.parent);
        if (!SETTINGS_FILE.open('w')) {
            alert(`Unable to open ${SETTINGS_FILE.displayName}`);
            return;
        }
        SETTINGS_FILE.write(Atarabi.JSON.stringify(SETTINGS, undefined, 2));
        SETTINGS_FILE.close();
    }

    function updateSettings(newSettings: ISettings) {
        SETTINGS = newSettings;
        saveSettings();
    }

    function generateShortcutKey(settings: ISettings, name: string, defaultKey: string = ''): string {
        enum Param {
            ShortcutGroup = 'ShortcutGroup',
            ShortcutKey = 'ShortcutKey',
            ShortcutValue = 'ShortcutValue',

            ButtonGroup = 'ButtonGroup',
            OK = 'OK',
            Cancel = 'Cancel'
        }

        enum Event {
            Change = 'Change',
            Submit = 'Submit',
        }

        const hasKey = (k: string) => {
            return k === SETTINGS_COMMAND || settings.shortcuts.hasOwnProperty(k);
        };

        if (!defaultKey) {
            for (const ch of name) {
                const k = `\\${ch.toLowerCase()}`;
                if (!hasKey(k)) {
                    defaultKey = k;
                    break;
                }
            }
        }

        let newKey: string = null;

        const builder = new Atarabi.UI.Builder('dialog', 'Create a shortcut', { resizeable: true }, win => {
            win.spacing = 8;
            win.margins = 10;
        })
            .addGroup(Param.ShortcutGroup, undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.orientation = 'row';
            })
            .addEditText(Param.ShortcutKey, defaultKey, undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.preferredSize[0] = 100;
                ui.helpTip = 'Shortcut Key';
                ui.active = true;
                ui.onChanging = () => {
                    emitter.notify(Event.Change, ui.text);
                };
                emitter.addEventListener(Event.Submit, () => {
                    const key = ui.text;
                    if (hasKey(key)) {
                        return;
                    }
                    newKey = key;
                    ui.window.close();
                });
            })
            .addStaticText(Param.ShortcutValue, name, undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.preferredSize[0] = 250;
            })
            .addGroupEnd()
            .addGroup(Param.ButtonGroup, undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.orientation = 'row';
                ui.spacing = ui.margins = 3;
            })
            .addButton(Param.OK, undefined, undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.onClick = () => {
                    emitter.notify(Event.Submit);
                };
                emitter.addEventListener(Event.Change, (k: string) => {
                    ui.enabled = !hasKey(k);
                });
            })
            .addButton(Param.Cancel, undefined, undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.onClick = () => {
                    ui.window.close();
                };
            })
            .addGroupEnd()
            .build();

        return newKey;
    }

    function createEffectShortcut(name: string, matchName: string) {
        const newKey = generateShortcutKey(SETTINGS, name);
        if (newKey) {
            SETTINGS.shortcuts[newKey] = { type: Type.Effect, value: matchName };
            saveSettings();
        }
    }

    // effect
    type EffectItem = { displayName: string; matchName: string; category: string; };
    const EFFECT_LIST: EffectItem[] = [];
    const EFFECT_NAME_MAP: { [matchName: string]: string } = {};
    const RECENT_NUM = 50;
    const RECENT_EFFECT_LIST: EffectItem[] = [];

    function initEffect() {
        for (let { displayName, matchName, category } of app.effects) {
            if (displayName && matchName && category) {
                const item = { displayName, matchName, category };
                EFFECT_LIST.push(item);
                EFFECT_NAME_MAP[matchName] = displayName;
            }
        }

        EFFECT_LIST.sort((a, b) => {
            const aObsolete = a.category === '_Obsolete';
            const bObsolete = b.category === '_Obsolete';
            if (aObsolete === bObsolete) {
                return 0;
            } else if (aObsolete) {
                return 1;
            } else {
                return -1;
            }
        });
    }

    initEffect();

    // searcher
    const searcher = Atarabi.UI.FuzzySearch(EFFECT_LIST, ['displayName', 'category', 'matchName'], {
        caseSensitive: false,
        sort: true,
        cache: true,
    });

    // apply
    function isAVLayer(layer: Layer): layer is AVLayer {
        return layer instanceof AVLayer || layer instanceof ShapeLayer || layer instanceof TextLayer;
    }

    function getActiveLayers(): Layer[] {
        const activeLayer = Atarabi.layer.getActiveLayer();
        const comp = activeLayer ? activeLayer.containingComp : Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            return comp.selectedLayers.slice();
        }
        return [];
    }

    function applyEffect(avLayers: AVLayer[], effectMatchName: string) {
        if (!avLayers.length) {
            return;
        }
        if (!avLayers[0].effect.canAddProperty(effectMatchName)) {
            return;
        }
        try {
            app.beginUndoGroup(`Apply: ${effectMatchName}`)
            for (const layer of avLayers) {
                const properties = layer.selectedProperties.slice();
                let index = 0;
                for (const property of properties) {
                    if (property.isEffect) {
                        index = property.propertyIndex;
                    }
                    property.selected = false;
                }
                const effects = layer.effect;
                const newEffect = effects.addProperty(effectMatchName);
                if (index > 0) {
                    newEffect.moveTo(index + 1);
                    effects(index + 1).selected = true;
                } else {
                    newEffect.selected = true;
                }
            }
        } catch (e) {
            // pass
        } finally {
            app.endUndoGroup();
        }
    }

    function applyScript(file: File) {
        if (!(file instanceof File && file.exists)) {
            return false;
        }
        (() => {
            $.evalFile(file.absoluteURI);
        }).call($.global);
    }

    function applyScriptlet(code: string) {
        (() => {
            eval(code);
        }).call($.global);
    }

    function applyPreset(layers: Layer[], file: File) {
        if (!layers.length) {
            return;
        }
        if (!(file instanceof File && file.exists)) {
            return;
        }

        try {
            app.beginUndoGroup(`${SCRIPT_NAME}: Apply`);

            // deselect
            for (const layer of layers) {
                layer.selected = false;
            }

            for (const layer of layers) {
                layer.selected = true;
                layer.applyPreset(file);
                layer.selected = false;
            }

            // reselect
            for (const layer of layers) {
                layer.selected = true;
            }
        } catch (e) {
            alert(e);
        } finally {
            app.endUndoGroup();
        }
    }

    function applyCommand(command: string) {
        if (/^\d+$/.test(command)) {
            app.executeCommand(parseInt(command, 10));
        } else {
            const commandID = app.findMenuCommandId(command);
            if (!commandID) {
                alert(`${command} is not found`);
                return;
            }
            app.executeCommand(commandID);
        }
    }

    function applyImport(file: File) {
        if (!file.exists) {
            return;
        }
        try {
            const importOptions = new ImportOptions(file);
            app.project.importFile(importOptions);
        } catch (e) {
            alert(e);
        }
    }

    function applyShortcutValue(layers: Layer[], shortcutValue: ShortcutValue) {
        switch (shortcutValue.type) {
            case Type.Effect:
                applyEffect(filter(layers, isAVLayer), shortcutValue.value);
                break;
            case Type.Script:
                applyScript(new File(shortcutValue.value));
                break;
            case Type.Scriptlet:
                applyScriptlet(shortcutValue.value);
                break;
            case Type.Preset:
                applyPreset(layers, new File(shortcutValue.value));
                break;
            case Type.Command:
                applyCommand(shortcutValue.value);
                break;
            case Type.Footage:
            case Type.Project:
                applyImport(new File(shortcutValue.value));
                break;
        }
    }

    function createNameFromShortcutValue(value: ShortcutValue) {
        switch (value.type) {
            case Type.Effect:
                const name = EFFECT_NAME_MAP[value.value];
                return name ? name : 'not found';
                return;
            default:
                const file = new File(value.value);
                return file.displayName;
        }
    }


    function mod(x: number, y: number) {
        const z = x % y;
        return z < 0 ? z + y : z;
    }

    // ui
    class Timer {
        private static time = 0;
        static reset() {
            Timer.time = 0;
        }
        static get() {
            return Timer.time;
        }
        static update() {
            Timer.time = Date.now();
        }
    }

    function buildSettingsUI() {
        enum Param {
            ShortcutPanel = 'ShortcutPanel',
            ShortcutList = 'ShortcutList',
            ShortcutButtonGroup = 'ShortcutButtonGroup',
            ShortcutNew = 'ShortcutNew',
            ShortcutEdit = 'ShortcutEdit',
            ShortcutDelete = 'ShortcutDelete',

            ButtonGroup = 'ButtonGroup',
            OK = 'OK',
            Cancel = 'Cancel'
        }

        enum Event {
            NewShortcut = 'NewShortcut',
            EditShortcut = 'EditShortcut',
            DeleteShortcut = 'DeleteShortcut',
        }

        let newSettings: ISettings = clone(SETTINGS);

        const builder = new Atarabi.UI.Builder('dialog', 'Settings', { resizeable: true }, win => {
            win.spacing = 8;
            win.margins = 10;
        })
            .addPanel(Param.ShortcutPanel, 'Shortcuts', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'fill'];
                ui.preferredSize[0] = 450;
                ui.spacing = 3;
                ui.margins = 10;
            })
            .addListBox(Param.ShortcutList, undefined, { numberOfColumns: 4, columnWidths: [50, 150, 100, 150] }, (ui, emitter) => {
                ui.alignment = ['fill', 'fill'];
                ui.preferredSize[1] = 100;
                for (const key in newSettings.shortcuts) {
                    if (newSettings.shortcuts.hasOwnProperty(key)) {
                        const item = ui.add('item', key);
                        const value = newSettings.shortcuts[key];
                        item.subItems[0].text = createNameFromShortcutValue(value);
                        item.subItems[1].text = value.type;
                        item.subItems[2].text = value.value;
                    }
                }
                ui.addEventListener('mousedown', (e: MouseEvent) => {
                    const selection = ui.selection as ListItem;
                    if (!selection) {
                        return;
                    }
                    // right click
                    if (e.button === 2) {
                        const index = Atarabi.UI.showContextMenu([{ text: 'Edit' }, { text: 'Delete' }]);
                        if (index === 0) {
                            emitter.notify(Event.EditShortcut);
                        } else if (index === 1) {
                            emitter.notify(Event.DeleteShortcut);
                        }
                    }
                });
                emitter.addEventListener(Event.NewShortcut, () => {
                    const file = File.openDialog('File for shortcut') as File;
                    if (file) {
                        const type = getShortcutTypeFromFile(file);
                        if (type === Type.Unknown) {
                            alert('Invalid file');
                            return;
                        }
                        const newKey = generateShortcutKey(newSettings, file.displayName);
                        if (newKey) {
                            const item = ui.add('item', newKey);
                            item.subItems[0].text = file.displayName;
                            item.subItems[1].text = type;
                            item.subItems[2].text = file.fsName;
                            newSettings.shortcuts[newKey] = { type, value: file.fsName };
                        }
                    }
                });
                emitter.addEventListener(Event.EditShortcut, () => {
                    const selection = ui.selection as ListItem;
                    if (!selection) {
                        return;
                    }
                    const prevKey = selection.text;
                    const value = newSettings.shortcuts[prevKey];
                    let tempSettings = clone(newSettings);
                    delete tempSettings.shortcuts[prevKey];
                    const newKey = generateShortcutKey(tempSettings, createNameFromShortcutValue(value), prevKey);
                    if (newKey) {
                        delete newSettings.shortcuts[prevKey];
                        newSettings.shortcuts[newKey] = value;
                        selection.text = newKey;
                    }
                });
                emitter.addEventListener(Event.DeleteShortcut, () => {
                    const selection = ui.selection as ListItem;
                    if (!selection) {
                        return;
                    }
                    if (confirm(`Delete "${selection.text}": "${selection.subItems[0].text}"?`)) {
                        delete newSettings.shortcuts[selection.text];
                        ui.remove(selection);
                    }
                });
            })
            .addGroup(Param.ShortcutButtonGroup, undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.spacing = ui.margins = 1;
                ui.orientation = 'row';
            })
            .addButton(Param.ShortcutNew, 'New', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.onClick = () => {
                    emitter.notify(Event.NewShortcut);
                };
            })
            .addButton(Param.ShortcutEdit, 'Edit', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.onClick = () => {
                    emitter.notify(Event.EditShortcut);
                };
            })
            .addButton(Param.ShortcutDelete, 'Delete', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.onClick = () => {
                    emitter.notify(Event.DeleteShortcut);
                };
            })
            .addGroupEnd()
            .addPanelEnd()
            .addGroup(Param.ButtonGroup, undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.orientation = 'row';
                ui.spacing = ui.margins = 1;
            })
            .addButton(Param.OK, undefined, undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.onClick = () => {
                    updateSettings(newSettings);
                    ui.window.close();
                };
            })
            .addButton(Param.Cancel, undefined, undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.onClick = () => {
                    ui.window.close();
                };
            })
            .addGroupEnd()
            .build();
    }

    const WIN_PREFERRED_SIZE = [350, 200] satisfies [number, number];

    function buildDefaultUI(ctx: Atarabi.Keyboard.HookContext, layers: Layer[]) {
        const win = new Window('dialog', undefined, undefined, { borderless: true });
        win.spacing = 0;
        win.margins = 0;
        win.preferredSize = WIN_PREFERRED_SIZE;

        const searchbox = win.add('edittext');
        searchbox.alignment = ['fill', 'top'];
        searchbox.onChanging = Atarabi.app.debounce(() => {
            updateList(searchbox.text);
        }, DEBOUNCE_TIME);
        searchbox.addEventListener('keydown', (ev: KeyboardEvent) => {
            Timer.update();
            switch (ev.keyName) {
                case 'Up':
                    moveList(-1);
                    ev.preventDefault();
                    break;
                case 'Down':
                    moveList(1);
                    ev.preventDefault();
                    break;
                case 'Enter':
                    apply();
                    ev.preventDefault();
                    break;
            }
        });

        type EffectListBoxItem = ListItem & { item: EffectItem };
        const effectList = win.add('listbox', undefined, undefined, { numberOfColumns: 3, columnWidths: [150, 100, 100] });
        effectList.alignment = ['fill', 'fill'];
        effectList.onDoubleClick = () => {
            apply();
        }
        effectList.addEventListener('mousedown', (e: MouseEvent) => {
            const selection = effectList.selection as ListItem;
            if (!selection) {
                return;
            }
            // right click
            if (e.button === 2) {
                const index = Atarabi.UI.showContextMenu([{ text: `Create a shortcut` }]);
                if (index === 0) {
                    win.close();
                    app.setTimeout(() => {
                        createEffectShortcut(selection.text, selection.subItems[1].text);
                    }, 0);
                }
            }
        });
        if (RECENT_EFFECT_LIST.length) {
            updateList('');
        }

        function moveList(offset: number) {
            const selection = effectList.selection as ListItem;
            if (!selection) {
                if (effectList.items.length) {
                    effectList.selection = 0;
                }
                return;
            }
            effectList.selection = mod(selection.index + offset, effectList.items.length);
        }

        function updateList(needle: string) {
            if (needle === SETTINGS_COMMAND) {
                win.close();
                app.setTimeout(() => {
                    buildSettingsUI();
                }, 10);
                return;
            }

            const shortcutValue = hasShortcutKey(needle) ? getShortcutValue(needle) : null;
            if (shortcutValue) {
                applyShortcutValue(layers, shortcutValue);
                win.close();
                return;
            }

            const effectItems = needle ? searcher.search(needle).slice(0, 50) : RECENT_EFFECT_LIST;
            effectList.removeAll();
            for (const effectItem of effectItems) {
                const item = effectList.add('item', effectItem.displayName) as EffectListBoxItem;
                item.subItems[0].text = effectItem.category;
                item.subItems[1].text = effectItem.matchName;
                item.item = effectItem;
            }
            if (effectList.items.length) {
                effectList.selection = 0;
            }
        }

        function updateRecent(item: EffectItem) {
            let found = false;
            for (let i = 0, total = RECENT_EFFECT_LIST.length; i < total; i++) {
                const it = RECENT_EFFECT_LIST[i];
                if (it.matchName === item.matchName) {
                    found = true;
                    if (i != 0) {
                        RECENT_EFFECT_LIST.splice(i, 1);
                        RECENT_EFFECT_LIST.unshift(item);
                    }
                    break;
                }
            }
            if (!found) {
                RECENT_EFFECT_LIST.unshift(item);
            }
            if (RECENT_EFFECT_LIST.length > RECENT_NUM) {
                RECENT_EFFECT_LIST.length = RECENT_NUM;
            }
        }

        function apply() {
            let selection = effectList.selection as EffectListBoxItem;
            if (!selection && effectList.items.length === 1) {
                selection = effectList.items[0] as EffectListBoxItem;
            }
            if (!selection) {
                win.close();
                return;
            }
            const item = selection.item;
            updateRecent(item);
            const matchName = item.matchName;
            applyEffect(filter(layers, isAVLayer), matchName);
            win.close();
        }

        win.onShow = () => {
            searchbox.active = true;
        };
        win.location = [ctx.mousePosition.x, ctx.mousePosition.y];
        win.show();
    }

    function buildShortcutUI(ctx: Atarabi.Keyboard.HookContext, layers: Layer[]) {
        const shortcutValues = getShortcutValues({ [Type.Effect]: false, [Type.Script]: true, [Type.Preset]: layers.length > 0 });
        if (!shortcutValues.length) {
            return;
        }

        const shortcutMap: { [key: string]: ShortcutValueWithKey; } = {};
        for (const value of shortcutValues) {
            shortcutMap[value.key] = value;
        }

        const win = new Window('dialog', undefined, undefined, { borderless: true });
        win.spacing = 0;
        win.margins = 0;
        win.preferredSize = WIN_PREFERRED_SIZE;

        const searchbox = win.add('edittext');
        searchbox.alignment = ['fill', 'top'];
        searchbox.onChanging = Atarabi.app.debounce(() => {
            updateList(searchbox.text);
        }, 200);
        searchbox.addEventListener('keydown', (ev: KeyboardEvent) => {
            Timer.update();
            switch (ev.keyName) {
                case 'Up':
                    moveList(-1);
                    ev.preventDefault();
                    break;
                case 'Down':
                    moveList(1);
                    ev.preventDefault();
                    break;
                case 'Enter':
                    apply();
                    ev.preventDefault();
                    break;
            }
        });

        const shortcutList = win.add('listbox', undefined, undefined, { numberOfColumns: 3, columnWidths: [100, 150, 100] });
        shortcutList.alignment = ['fill', 'fill'];
        shortcutList.onDoubleClick = () => {
            apply();
        }
        updateList('');

        function moveList(offset: number) {
            const selection = shortcutList.selection as ListItem;
            if (!selection) {
                if (shortcutList.items.length) {
                    shortcutList.selection = 0;
                }
                return;
            }
            shortcutList.selection = mod(selection.index + offset, shortcutList.items.length);
        }

        function updateList(needle: string) {
            if (needle === SETTINGS_COMMAND) {
                win.close();
                app.setTimeout(() => {
                    buildSettingsUI();
                }, 10);
                return;
            }

            if (shortcutMap.hasOwnProperty(needle)) {
                applyShortcutValue(layers, shortcutMap[needle]);
                win.close();
                return;
            }

            shortcutList.removeAll();
            for (const value of shortcutValues) {
                if (value.key.indexOf(needle) === 0) {
                    const item = shortcutList.add('item', value.key) as ListItem;
                    item.subItems[0].text = createNameFromShortcutValue(value);
                    item.subItems[1].text = value.value;
                }
            }
            if (shortcutList.items.length) {
                shortcutList.selection = 0;
            }
        }

        function apply() {
            let selection = shortcutList.selection as ListItem;
            if (!selection && shortcutList.items.length === 1) {
                selection = shortcutList.items[0] as ListItem;
            }
            if (!selection) {
                win.close();
                return;
            }
            const key = selection.text;
            if (shortcutMap.hasOwnProperty(key)) {
                applyShortcutValue(layers, shortcutMap[key]);
            }
            win.close();
        }

        win.onShow = () => {
            searchbox.active = true;
        };
        win.location = [ctx.mousePosition.x, ctx.mousePosition.y];
        win.show();

        return true;
    }

    Atarabi.keyboard.hook(isWin() ? { code: 'Space', ctrlOrCmdKey: true } : { code: 'Space', altKey: true }, ctx => {
        const newTime = Date.now();
        const elapsed = newTime - Timer.get();
        Timer.update();
        if (elapsed < 2000) {
            return false;
        }
        const layers = getActiveLayers();
        const avLayers = filter(layers, isAVLayer);
        if (avLayers.length) {
            buildDefaultUI(ctx, layers);
        } else {
            buildShortcutUI(ctx, layers);
        }
        Timer.reset();
        return true;
    });

})();