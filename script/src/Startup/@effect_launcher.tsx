/**
 * @effect_launcher v2.2.2
 * 
 *      v2.2.2(2025/04/16)  Fix a bug where a script wasn’t executed
 *      v2.2.1(2025/04/02)  Switch to Types-for-Adobe
 *      v2.2.0(2025/03/08)  Support script and preset
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

    // settings
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

    const CURRENT_SETTINGS_VERSION = 2;

    interface ISettings_V1 {
        type: '@scripts/@effect_launcher';
        version: 1;
        shortcuts: { [key: string]: ShortcutValue; };
    }

    interface ISettings {
        type: '@scripts/@effect_launcher';
        version: typeof CURRENT_SETTINGS_VERSION;
        shortcuts: { [key: string]: ShortcutValue; };
        script: {
            folders: { path: string; recursive: boolean; }[];
            files: { path: string; }[];
        };
        preset: {
            folders: { path: string; recursive: boolean; }[];
            files: { path: string; }[];
        };
    }

    const SETTINGS_FILE = new File(`${Folder.userData.absoluteURI}/Atarabi/@scripts/${SCRIPT_NAME}/settings.json`);
    SETTINGS_FILE.encoding = 'utf-8';
    let SETTINGS = loadSettings();
    const SETTINGS_COMMAND = '\\\\';

    // shortcut
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

    // script, preset
    function scanFiles(setting: { folders: { path: string; recursive: boolean; }[]; files: { path: string; }[]; }, re: RegExp, fn: (root: Folder, file: File) => void) {
        const doneFolder: { [path: string]: boolean; } = {};
        const doneFile: { [path: string]: boolean; } = {};

        const push = (root: Folder, file: File) => {
            if (!doneFile.hasOwnProperty(file.absoluteURI)) {
                doneFile[file.absoluteURI] = true;
                fn(root, file);
            }
        };

        // folder
        const MAX_DEPTH = 3;
        const scanFolder = (root: Folder, folder: Folder, rescursive: boolean, depth: number) => {
            if (doneFolder.hasOwnProperty(folder.absoluteURI)) {
                return;
            }
            doneFolder[folder.absoluteURI] = true;

            for (const file of folder.getFiles()) {
                if (file instanceof Folder) {
                    if (rescursive && depth < MAX_DEPTH) {
                        scanFolder(root, file, rescursive, depth + 1);
                    }
                } else if (file instanceof File && re.test(file.displayName)) {
                    push(root, file);
                }
            }
        };

        for (const { path, recursive } of setting.folders) {
            const folder = Folder(path);
            if (folder instanceof Folder && folder.exists) {
                scanFolder(folder.parent, folder, recursive, 0);
            }
        }

        // file
        for (const { path } of setting.files) {
            const file = File(path);
            if (file instanceof File && file.exists && re.test(file.displayName)) {
                push(null, file);
            }
        }
    }

    // script
    let SCRIPT_LIST: IItem[] = [];
    const SCRIPT_RE = /\.jsx(bin)?$/i;

    function initScript() {
        SCRIPT_LIST = [];
        if (SETTINGS && SETTINGS.script) {
            scanFiles(SETTINGS.script, SCRIPT_RE, (root, file) => {
                if (root) {
                    SCRIPT_LIST.push({ type: Type.Script, name: file.displayName, category: 'Script', detail: file.fsName.substr(root.fsName.length + 1), path: file.fsName });
                } else {
                    SCRIPT_LIST.push({ type: Type.Script, name: file.displayName, category: 'Script', detail: file.displayName, path: file.fsName });
                }
            });
        }
    }

    initScript();

    // preset
    let PRESET_LIST: IItem[] = [];
    const PRESET_RE = /\.ffx$/i;

    function initPreset() {
        PRESET_LIST = [];
        if (SETTINGS && SETTINGS.preset) {
            scanFiles(SETTINGS.preset, PRESET_RE, (root, file) => {
                if (root) {
                    SCRIPT_LIST.push({ type: Type.Preset, name: file.displayName, category: 'Preset', detail: file.fsName.substr(root.fsName.length + 1), path: file.fsName });
                } else {
                    SCRIPT_LIST.push({ type: Type.Preset, name: file.displayName, category: 'Preset', detail: file.displayName, path: file.fsName });
                }
            });
        }
    }

    initPreset();

    function loadSettings(): ISettings {
        let settings: ISettings = {
            type: '@scripts/@effect_launcher',
            version: CURRENT_SETTINGS_VERSION,
            shortcuts: {},
            script: {
                folders: [],
                files: [],
            },
            preset: {
                folders: [],
                files: []
            },
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
            settings.version = CURRENT_SETTINGS_VERSION;
            if (!settings.shortcuts) {
                settings.shortcuts = {};
            }
            if (!settings.script) {
                settings.script = {} as any;
            }
            if (!settings.script.folders) {
                settings.script.folders = [];
            }
            if (!settings.script.files) {
                settings.script.files = [];
            }
            if (!settings.preset) {
                settings.preset = {} as any;
            }
            if (!settings.preset.folders) {
                settings.preset.folders = [];
            }
            if (!settings.preset.files) {
                settings.preset.files = [];
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
        initScript();
        initPreset();
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
    type IItem = { name: string; detail: string; path?: string; category: string; type: Type; };
    const EFFECT_LIST: IItem[] = [];
    const EFFECT_NAME_MAP: { [matchName: string]: string } = {};

    function initEffect() {
        for (let { displayName, matchName, category } of app.effects) {
            if (displayName && matchName && category) {
                const item = { type: Type.Effect, name: displayName, category, detail: matchName } satisfies IItem;
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

    // recent
    const RECENT_NUM = 50;
    const RECENT_ITEM_LIST: IItem[] = [];

    // searcher
    let searcher: Atarabi.UI.FuzzySearch<IItem> = null;

    function initSearcher() {
        searcher = Atarabi.UI.FuzzySearch([].concat(EFFECT_LIST, SCRIPT_LIST, PRESET_LIST), ['name', 'detail', 'category'], {
            caseSensitive: false,
            sort: true,
            cache: true,
        });
    }

    initSearcher();

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

    function applyItem(layers: Layer[], iItem: IItem) {
        switch (iItem.type) {
            case Type.Effect:
                applyEffect(filter(layers, isAVLayer), iItem.detail);
                break;
            case Type.Script:
                applyScript(new File(iItem.path));
                break;
            case Type.Preset:
                applyPreset(layers, new File(iItem.path));
                break;
        }
    }

    function createNameFromShortcutValue(value: ShortcutValue) {
        switch (value.type) {
            case Type.Effect:
                const name = EFFECT_NAME_MAP[value.value];
                return name ? name : 'not found';
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
            Container = 'Container',

            ShortcutPanel = 'ShortcutPanel',
            ShortcutList = 'ShortcutList',
            ShortcutButtonGroup = 'ShortcutButtonGroup',
            ShortcutNew = 'ShortcutNew',
            ShortcutEdit = 'ShortcutEdit',
            ShortcutDelete = 'ShortcutDelete',

            ScriptPanel = 'ScriptPanel',
            ScriptFoldersText = 'ScriptFoldersText',
            ScriptFoldersList = 'ScriptFoldersList',
            ScriptFoldersButtonGroup = 'ScriptFoldersButtonGroup',
            ScriptFoldersNew = 'ScriptFoldersNew',
            ScriptFoldersDelete = 'ScriptFoldersDelete',
            ScriptSeparator = 'ScriptSeparator',
            ScriptFilesText = 'ScriptFilesText',
            ScriptFilesList = 'ScriptFilesList',
            ScriptFilesButtonGroup = 'ScriptFilesButtonGroup',
            ScriptFilesNew = 'ScriptFilesNew',
            ScriptFilesDelete = 'ScriptFilesDelete',

            PresetPanel = 'PresetPanel',
            PresetFoldersText = 'PresetFoldersText',
            PresetFoldersList = 'PresetFoldersList',
            PresetFoldersButtonGroup = 'PresetFoldersButtonGroup',
            PresetFoldersNew = 'PresetFoldersNew',
            PresetFoldersDelete = 'PresetFoldersDelete',
            PresetSeparator = 'PresetSeparator',
            PresetFilesText = 'PresetFilesText',
            PresetFilesList = 'PresetFilesList',
            PresetFilesButtonGroup = 'PresetFilesButtonGroup',
            PresetFilesNew = 'PresetFilesNew',
            PresetFilesDelete = 'PresetFilesDelete',

            ButtonGroup = 'ButtonGroup',
            OK = 'OK',
            Cancel = 'Cancel'
        }

        enum Event {
            NewShortcut = 'NewShortcut',
            EditShortcut = 'EditShortcut',
            DeleteShortcut = 'DeleteShortcut',

            NewScriptFolder = 'NewScriptFolder',
            DeleteScriptFolder = 'DeleteScriptFolder',
            EditScriptFolder = 'EditScriptFolder',
            RecursiveScriptFolder = 'RecursiveScriptFolder',
            NewScriptFile = 'NewScriptFile',
            EditScriptFile = 'EditScriptFile',
            DeleteScriptFile = 'DeleteScriptFile',

            NewPresetFolder = 'NewPresetFolder',
            DeletePresetFolder = 'DeletePresetFolder',
            EditPresetFolder = 'EditPresetFolder',
            RecursivePresetFolder = 'RecursivePresetFolder',
            NewPresetFile = 'NewPresetFile',
            EditPresetFile = 'EditPresetFile',
            DeletePresetFile = 'DeletePresetFile',
        }

        let newSettings: ISettings = clone(SETTINGS);

        let update = false;

        const builder = new Atarabi.UI.Builder('dialog', 'Settings', undefined, win => {
            win.spacing = 8;
            win.margins = 10;
        })
            .addGroup(Param.Container, undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'fill'];
                ui.orientation = 'row';
                ui.spacing = 3;
                ui.margins = 3;
            })
            .addPanel(Param.ShortcutPanel, 'Shortcuts', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'fill'];
                ui.preferredSize[0] = 350;
                ui.spacing = 3;
                ui.margins = 10;
            })
            .addListBox(Param.ShortcutList, undefined, { numberOfColumns: 4, columnWidths: [50, 100, 100, 100] }, (ui, emitter) => {
                ui.alignment = ['fill', 'fill'];
                ui.preferredSize[1] = 300;
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
                ui.alignment = ['fill', 'bottom'];
                ui.spacing = ui.margins = 1;
                ui.orientation = 'row';
            })
            .addButton(Param.ShortcutNew, 'New', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'bottom'];
                ui.onClick = () => {
                    emitter.notify(Event.NewShortcut);
                };
            })
            .addButton(Param.ShortcutEdit, 'Edit', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'bottom'];
                ui.onClick = () => {
                    emitter.notify(Event.EditShortcut);
                };
            })
            .addButton(Param.ShortcutDelete, 'Delete', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'bottom'];
                ui.onClick = () => {
                    emitter.notify(Event.DeleteShortcut);
                };
            })
            .addGroupEnd()
            .addPanelEnd()
            .addPanel(Param.ScriptPanel, 'Script', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'fill'];
                ui.preferredSize[0] = 350;
                ui.spacing = 3;
                ui.margins = 10;
            })
            .addStaticText(Param.ScriptFoldersText, 'Folders', undefined, (ui, emitter) => {
                ui.alignment = ['left', 'top'];
            })
            .addListBox(Param.ScriptFoldersList, undefined, { numberOfColumns: 2, columnWidths: [150, 200] }, (ui, emitter) => {
                ui.alignment = ['fill', 'fill'];
                ui.preferredSize[1] = 150;
                for (const { path, recursive } of newSettings.script.folders) {
                    const folder = new Folder(path);
                    const item = ui.add('item', folder.displayName);
                    item.subItems[0].text = path;
                    item.checked = recursive;
                }
                ui.addEventListener('mousedown', (e: MouseEvent) => {
                    const selection = ui.selection as ListItem;
                    if (!selection) {
                        return;
                    }
                    // right click
                    if (e.button === 2) {
                        const index = Atarabi.UI.showContextMenu([{ text: 'Edit' },{ text: 'Recursive', checked: selection.checked }, { text: 'Delete' }]);
                        if (index === 0) {
                            emitter.notify(Event.EditScriptFolder);
                        } if (index === 1) {
                            emitter.notify(Event.RecursiveScriptFolder);
                        } else if (index === 2) {
                            emitter.notify(Event.DeleteScriptFolder);
                        }
                    }
                });
                emitter.addEventListener(Event.NewScriptFolder, () => {
                    const folder = Folder.selectDialog('Script Folder');
                    if (folder) {
                        const newItem = ui.add('item', folder.displayName);
                        newItem.subItems[0].text = folder.fsName;
                        newSettings.script.folders.push({ path: folder.fsName, recursive: false });
                    }
                });
                emitter.addEventListener(Event.EditScriptFolder, () => {
                    const selection = ui.selection as ListItem;
                    if (!selection) {
                        return;
                    }
                    const folder = new Folder(newSettings.script.folders[selection.index].path).selectDlg('Script Folder');
                    if (folder) {
                        selection.text = folder.displayName;
                        newSettings.script.folders[selection.index].path = selection.subItems[0].text = folder.fsName;
                    }
                });
                emitter.addEventListener(Event.RecursiveScriptFolder, () => {
                    const selection = ui.selection as ListItem;
                    if (!selection) {
                        return;
                    }
                    newSettings.script.folders[selection.index].recursive = selection.checked = !selection.checked;
                });
                emitter.addEventListener(Event.DeleteScriptFolder, () => {
                    const selection = ui.selection as ListItem;
                    if (!selection) {
                        return;
                    }
                    if (confirm(`Delete "${selection.text}"?`)) {
                        newSettings.script.folders.splice(selection.index, 1);
                        ui.remove(selection);
                    }
                });
            })
            .addGroup(Param.ScriptFoldersButtonGroup, undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'bottom'];
                ui.spacing = ui.margins = 1;
                ui.orientation = 'row';
            })
            .addButton(Param.ScriptFoldersNew, 'New', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'bottom'];
                ui.onClick = () => {
                    emitter.notify(Event.NewScriptFolder);
                };
            })
            .addButton(Param.ScriptFoldersDelete, 'Delete', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'bottom'];
                ui.onClick = () => {
                    emitter.notify(Event.DeleteScriptFolder);
                };
            })
            .addGroupEnd()
            .addPanel(Param.ScriptSeparator, '', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.preferredSize[1] = 1;
            })
            .addPanelEnd()
            .addStaticText(Param.ScriptFilesText, 'Files', undefined, (ui, emitter) => {
                ui.alignment = ['left', 'top'];
            })
            .addListBox(Param.ScriptFilesList, undefined, { numberOfColumns: 2, columnWidths: [150, 200] }, (ui, emitter) => {
                ui.alignment = ['fill', 'fill'];
                ui.preferredSize[1] = 150;
                for (const { path } of newSettings.script.files) {
                    const folder = new Folder(path);
                    const item = ui.add('item', folder.displayName);
                    item.subItems[0].text = path;
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
                            emitter.notify(Event.EditScriptFile);
                        } else if (index === 1) {
                            emitter.notify(Event.DeleteScriptFile);
                        }
                    }
                });
                emitter.addEventListener(Event.NewScriptFile, () => {
                    const file = File.openDialog('Script File', makeFileFilter(['jsx', 'jsxbin'])) as File;
                    if (file) {
                        const newItem = ui.add('item', file.displayName);
                        newItem.subItems[0].text = file.fsName;
                        newSettings.script.files.push({ path: file.fsName });
                    }
                });
                emitter.addEventListener(Event.EditScriptFile, () => {
                    const selection = ui.selection as ListItem;
                    if (!selection) {
                        return;
                    }
                    const file = new File(newSettings.script.files[selection.index].path).openDlg('Script File', makeFileFilter(['jsx', 'jsxbin'])) as File;
                    if (file) {
                        selection.text = file.displayName;
                        newSettings.script.files[selection.index].path = selection.subItems[0].text = file.fsName;
                    }
                });
                emitter.addEventListener(Event.DeleteScriptFile, () => {
                    const selection = ui.selection as ListItem;
                    if (!selection) {
                        return;
                    }
                    if (confirm(`Delete "${selection.text}"?`)) {
                        newSettings.script.files.splice(selection.index, 1);
                        ui.remove(selection);
                    }
                });
            })
            .addGroup(Param.ScriptFilesButtonGroup, undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'bottom'];
                ui.orientation = 'row';
            })
            .addButton(Param.ScriptFilesNew, 'New', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'bottom'];
                ui.onClick = () => {
                    emitter.notify(Event.NewScriptFile);
                };
            })
            .addButton(Param.ScriptFilesDelete, 'Delete', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'bottom'];
                ui.onClick = () => {
                    emitter.notify(Event.DeleteScriptFile);
                };
            })
            .addGroupEnd()
            .addPanelEnd()
            .addPanel(Param.PresetPanel, 'Preset', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'fill'];
                ui.preferredSize[0] = 350;
                ui.spacing = 3;
                ui.margins = 10;
            })
            .addStaticText(Param.PresetFoldersText, 'Folders', undefined, (ui, emitter) => {
                ui.alignment = ['left', 'top'];
            })
            .addListBox(Param.PresetFoldersList, undefined, { numberOfColumns: 2, columnWidths: [150, 200] }, (ui, emitter) => {
                ui.alignment = ['fill', 'fill'];
                ui.preferredSize[1] = 150;
                for (const { path, recursive } of newSettings.preset.folders) {
                    const folder = new Folder(path);
                    const item = ui.add('item', folder.displayName);
                    item.subItems[0].text = path;
                    item.checked = recursive;
                }
                ui.addEventListener('mousedown', (e: MouseEvent) => {
                    const selection = ui.selection as ListItem;
                    if (!selection) {
                        return;
                    }
                    // right click
                    if (e.button === 2) {
                        const index = Atarabi.UI.showContextMenu([{ text: 'Edit' }, { text: 'Recursive', checked: selection.checked }, { text: 'Delete' }]);
                        if (index === 0) {
                            emitter.notify(Event.EditPresetFolder);
                        } else if (index === 1) {
                            emitter.notify(Event.RecursivePresetFolder);
                        } else if (index === 2) {
                            emitter.notify(Event.DeletePresetFolder);
                        }
                    }
                });
                emitter.addEventListener(Event.NewPresetFolder, () => {
                    const folder = Folder.selectDialog('Preset Folder');
                    if (folder) {
                        const newItem = ui.add('item', folder.displayName);
                        newItem.subItems[0].text = folder.fsName;
                        newSettings.preset.folders.push({ path: folder.fsName, recursive: false });
                    }
                });
                emitter.addEventListener(Event.EditPresetFolder, () => {
                    const selection = ui.selection as ListItem;
                    if (!selection) {
                        return;
                    }
                    const folder = new Folder(newSettings.preset.folders[selection.index].path).selectDlg('Preset Folder');
                    if (folder) {
                        selection.text = folder.displayName;
                        newSettings.preset.folders[selection.index].path = selection.subItems[0].text = folder.fsName;
                    }
                });
                emitter.addEventListener(Event.RecursivePresetFolder, () => {
                    const selection = ui.selection as ListItem;
                    if (!selection) {
                        return;
                    }
                    newSettings.preset.folders[selection.index].recursive = selection.checked = !selection.checked;
                });
                emitter.addEventListener(Event.DeletePresetFolder, () => {
                    const selection = ui.selection as ListItem;
                    if (!selection) {
                        return;
                    }
                    if (confirm(`Delete "${selection.text}"?`)) {
                        newSettings.preset.folders.splice(selection.index, 1);
                        ui.remove(selection);
                    }
                });
            })
            .addGroup(Param.PresetFoldersButtonGroup, undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'bottom'];
                ui.spacing = ui.margins = 1;
                ui.orientation = 'row';
            })
            .addButton(Param.PresetFoldersNew, 'New', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'bottom'];
                ui.onClick = () => {
                    emitter.notify(Event.NewPresetFolder);
                };
            })
            .addButton(Param.PresetFoldersDelete, 'Delete', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'bottom'];
                ui.onClick = () => {
                    emitter.notify(Event.DeletePresetFolder);
                };
            })
            .addGroupEnd()
            .addPanel(Param.PresetSeparator, '', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.preferredSize[1] = 1;
            })
            .addPanelEnd()
            .addStaticText(Param.PresetFilesText, 'Files', undefined, (ui, emitter) => {
                ui.alignment = ['left', 'top'];
            })
            .addListBox(Param.PresetFilesList, undefined, { numberOfColumns: 2, columnWidths: [150, 200] }, (ui, emitter) => {
                ui.alignment = ['fill', 'fill'];
                ui.preferredSize[1] = 150;
                for (const { path } of newSettings.preset.files) {
                    const folder = new Folder(path);
                    const item = ui.add('item', folder.displayName);
                    item.subItems[0].text = path;
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
                            emitter.notify(Event.EditPresetFile);
                        } else if (index === 1) {
                            emitter.notify(Event.DeletePresetFile);
                        }
                    }
                });
                emitter.addEventListener(Event.NewPresetFile, () => {
                    const file = File.openDialog('Preset File', makeFileFilter(['ffx'])) as File;
                    if (file) {
                        const newItem = ui.add('item', file.displayName);
                        newItem.subItems[0].text = file.fsName;
                        newSettings.preset.files.push({ path: file.fsName });
                    }
                });
                emitter.addEventListener(Event.EditPresetFile, () => {
                    const selection = ui.selection as ListItem;
                    if (!selection) {
                        return;
                    }
                    const file = new File(newSettings.preset.files[selection.index].path).openDlg('Preset File', makeFileFilter(['ffx'])) as File;
                    if (file) {
                        selection.text = file.displayName;
                        newSettings.preset.files[selection.index].path = selection.subItems[0].text = file.fsName;
                    }
                });
                emitter.addEventListener(Event.DeletePresetFile, () => {
                    const selection = ui.selection as ListItem;
                    if (!selection) {
                        return;
                    }
                    if (confirm(`Delete "${selection.text}"?`)) {
                        newSettings.preset.files.splice(selection.index, 1);
                        ui.remove(selection);
                    }
                });
            })
            .addGroup(Param.PresetFilesButtonGroup, undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'bottom'];
                ui.orientation = 'row';
            })
            .addButton(Param.PresetFilesNew, 'New', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'bottom'];
                ui.onClick = () => {
                    emitter.notify(Event.NewPresetFile);
                };
            })
            .addButton(Param.PresetFilesDelete, 'Delete', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'bottom'];
                ui.onClick = () => {
                    emitter.notify(Event.DeletePresetFile);
                };
            })
            .addGroupEnd()
            .addPanelEnd()
            .addGroupEnd()
            .addGroup(Param.ButtonGroup, undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'bottom'];
                ui.orientation = 'row';
                ui.spacing = ui.margins = 1;
            })
            .addButton(Param.OK, undefined, undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'bottom'];
                ui.onClick = () => {
                    update = true;
                    updateSettings(newSettings);
                    ui.window.close();
                };
            })
            .addButton(Param.Cancel, undefined, undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'bottom'];
                ui.onClick = () => {
                    ui.window.close();
                };
            })
            .addGroupEnd()
            .build();

        return update;
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

        type ItemListBoxItem = ListItem & { item: IItem };
        const itemList = win.add('listbox', undefined, undefined, { numberOfColumns: 3, columnWidths: [150, 100, 100] });
        itemList.alignment = ['fill', 'fill'];
        itemList.onDoubleClick = () => {
            apply();
        }
        itemList.addEventListener('mousedown', (e: MouseEvent) => {
            const selection = itemList.selection as ListItem;
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
        if (RECENT_ITEM_LIST.length) {
            updateList('');
        }

        function moveList(offset: number) {
            const selection = itemList.selection as ListItem;
            if (!selection) {
                if (itemList.items.length) {
                    itemList.selection = 0;
                }
                return;
            }
            itemList.selection = mod(selection.index + offset, itemList.items.length);
        }

        function updateList(needle: string) {
            if (needle === SETTINGS_COMMAND) {
                win.close();
                app.setTimeout(() => {
                    if (buildSettingsUI()) {
                        initSearcher();
                    }
                }, 10);
                return;
            }

            const shortcutValue = hasShortcutKey(needle) ? getShortcutValue(needle) : null;
            if (shortcutValue) {
                applyShortcutValue(layers, shortcutValue);
                win.close();
                return;
            }

            const iItems = needle ? searcher.search(needle).slice(0, 50) : RECENT_ITEM_LIST;
            itemList.removeAll();
            for (const iItem of iItems) {
                const item = itemList.add('item', iItem.name) as ItemListBoxItem;
                item.subItems[0].text = iItem.category;
                item.subItems[1].text = iItem.detail;
                item.item = iItem;
            }
            if (itemList.items.length) {
                itemList.selection = 0;
            }
        }

        function updateRecent(item: IItem) {
            let found = false;
            for (let i = 0, total = RECENT_ITEM_LIST.length; i < total; i++) {
                const it = RECENT_ITEM_LIST[i];
                if (it.detail === item.detail) {
                    found = true;
                    if (i != 0) {
                        RECENT_ITEM_LIST.splice(i, 1);
                        RECENT_ITEM_LIST.unshift(item);
                    }
                    break;
                }
            }
            if (!found) {
                RECENT_ITEM_LIST.unshift(item);
            }
            if (RECENT_ITEM_LIST.length > RECENT_NUM) {
                RECENT_ITEM_LIST.length = RECENT_NUM;
            }
        }

        function apply() {
            let selection = itemList.selection as ItemListBoxItem;
            if (!selection && itemList.items.length === 1) {
                selection = itemList.items[0] as ItemListBoxItem;
            }
            if (!selection) {
                win.close();
                return;
            }
            const iItem = selection.item;
            updateRecent(iItem);
            applyItem(layers, iItem);
            win.close();
        }

        win.onShow = () => {
            searchbox.active = true;
        };
        win.location = [ctx.mousePosition.x, ctx.mousePosition.y] as Point;
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
        win.location = [ctx.mousePosition.x, ctx.mousePosition.y] as Point;
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