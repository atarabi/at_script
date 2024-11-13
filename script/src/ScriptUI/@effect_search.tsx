/**
 * @effect_search v2.0.0
 * 
 *      v2.0.0(2024/11/14)  Support script and preset and reduce debounce time
 *      v1.0.0(2023/09/16)
 */
((global: Panel | Global) => {

    const SCRIPT_NAME = '@effect_search';

    const DEBOUNCE_TIME = 100; // ms

    enum Param {
        Search = 'Search',
        ItemList = 'ItemList',
    }

    enum Event {
        Search = 'Search',
    }

    /*
    *   Utility
    */
    function filter<T>(values: any[], fn: (value: any) => value is T): T[] {
        const arr: T[] = [];
        for (const value of values) {
            if (fn(value)) {
                arr.push(value);
            }
        }
        return arr;
    }

    function isAVLayer(layer: Layer): layer is AVLayer {
        return layer instanceof ShapeLayer || layer instanceof TextLayer || layer instanceof AVLayer;
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

    /*
    *   Main
    */
    enum Type {
        Effect = 'effect',
        Script = 'script',
        Preset = 'preset',
    }
    type IItem = { name: string; detail: string; path?: string; category: string; type: Type; };

    // setting
    interface ISettings {
        type: '@scripts/@effect_search';
        version: 1;
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

    function loadSettings(): ISettings {
        let settings: ISettings = {
            type: '@scripts/@effect_search',
            version: 1,
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

    const SETTINGS_COMMAND = '\\\\';

    function buildSettingsUI() {

        enum Param {
            Container = 'Container',

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
            NewScriptFolder = 'NewScriptFolder',
            DeleteScriptFolder = 'DeleteScriptFolder',
            RecursiveScriptFolder = 'RecursiveScriptFolder',
            NewScriptFile = 'NewScriptFile',
            DeleteScriptFile = 'DeleteScriptFile',

            NewPresetFolder = 'NewPresetFolder',
            DeletePresetFolder = 'DeletePresetFolder',
            RecursivePresetFolder = 'RecursivePresetFolder',
            NewPresetFile = 'NewPresetFile',
            DeletePresetFile = 'DeletePresetFile',
        }

        let newSettings: ISettings = clone(SETTINGS);

        let update = false;

        const builder = new Atarabi.UI.Builder('dialog', 'Settings', { resizeable: true }, win => {
            win.spacing = 8;
            win.margins = 10;
        })
            .addGroup(Param.Container, undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'fill'];
                ui.orientation = 'row';
                ui.spacing = 3;
                ui.margins = 3;
            })
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
                ui.preferredSize[1] = 100;
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
                        const index = Atarabi.UI.showContextMenu([{ text: 'Recursive', checked: selection.checked }, { text: 'Delete' }]);
                        if (index === 0) {
                            emitter.notify(Event.RecursiveScriptFolder);
                        } else if (index === 1) {
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
                emitter.addEventListener(Event.RecursiveScriptFolder, () => {
                    const selection = ui.selection as ListItem;
                    if (!selection) {
                        return;
                    }
                    newSettings.script.folders[selection.index].recursive = selection.checked = !selection.checked;
                });
            })
            .addGroup(Param.ScriptFoldersButtonGroup, undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.spacing = ui.margins = 1;
                ui.orientation = 'row';
            })
            .addButton(Param.ScriptFoldersNew, 'New', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.onClick = () => {
                    emitter.notify(Event.NewScriptFolder);
                };
            })
            .addButton(Param.ScriptFoldersDelete, 'Delete', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.onClick = () => {
                    emitter.notify(Event.DeleteScriptFolder);
                };
            })
            .addGroupEnd()
            .addPanel(Param.ScriptSeparator, '', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
            })
            .addPanelEnd()
            .addStaticText(Param.ScriptFilesText, 'Files', undefined, (ui, emitter) => {
                ui.alignment = ['left', 'top'];
            })
            .addListBox(Param.ScriptFilesList, undefined, { numberOfColumns: 2, columnWidths: [150, 200] }, (ui, emitter) => {
                ui.alignment = ['fill', 'fill'];
                ui.preferredSize[1] = 100;
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
                        const index = Atarabi.UI.showContextMenu([{ text: 'Delete' }]);
                        if (index === 0) {
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
                ui.alignment = ['fill', 'top'];
                ui.orientation = 'row';
            })
            .addButton(Param.ScriptFilesNew, 'New', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.onClick = () => {
                    emitter.notify(Event.NewScriptFile);
                };
            })
            .addButton(Param.ScriptFilesDelete, 'Delete', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
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
                ui.preferredSize[1] = 100;
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
                        const index = Atarabi.UI.showContextMenu([{ text: 'Recursive', checked: selection.checked }, { text: 'Delete' }]);
                        if (index === 0) {
                            emitter.notify(Event.RecursivePresetFolder);
                        } else if (index === 1) {
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
                emitter.addEventListener(Event.RecursivePresetFolder, () => {
                    const selection = ui.selection as ListItem;
                    if (!selection) {
                        return;
                    }
                    newSettings.preset.folders[selection.index].recursive = selection.checked = !selection.checked;
                });
            })
            .addGroup(Param.PresetFoldersButtonGroup, undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.spacing = ui.margins = 1;
                ui.orientation = 'row';
            })
            .addButton(Param.PresetFoldersNew, 'New', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.onClick = () => {
                    emitter.notify(Event.NewPresetFolder);
                };
            })
            .addButton(Param.PresetFoldersDelete, 'Delete', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.onClick = () => {
                    emitter.notify(Event.DeletePresetFolder);
                };
            })
            .addGroupEnd()
            .addPanel(Param.PresetSeparator, '', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
            })
            .addPanelEnd()
            .addStaticText(Param.PresetFilesText, 'Files', undefined, (ui, emitter) => {
                ui.alignment = ['left', 'top'];
            })
            .addListBox(Param.PresetFilesList, undefined, { numberOfColumns: 2, columnWidths: [150, 200] }, (ui, emitter) => {
                ui.alignment = ['fill', 'fill'];
                ui.preferredSize[1] = 100;
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
                        const index = Atarabi.UI.showContextMenu([{ text: 'Delete' }]);
                        if (index === 0) {
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
                ui.alignment = ['fill', 'top'];
                ui.orientation = 'row';
            })
            .addButton(Param.PresetFilesNew, 'New', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.onClick = () => {
                    emitter.notify(Event.NewPresetFile);
                };
            })
            .addButton(Param.PresetFilesDelete, 'Delete', undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.onClick = () => {
                    emitter.notify(Event.DeletePresetFile);
                };
            })
            .addGroupEnd()
            .addPanelEnd()
            .addGroupEnd()
            .addGroup(Param.ButtonGroup, undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.orientation = 'row';
            })
            .addButton(Param.OK, undefined, undefined, (ui, emitter) => {
                ui.alignment = ['fill', 'top'];
                ui.onClick = () => {
                    update = true;
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
            .build()
            ;

        return update;
    }

    // effect
    const EFFECT_LIST: IItem[] = [];

    function initEffect() {
        for (let { displayName, matchName, category } of app.effects) {
            if (displayName && matchName && category) {
                const item = { type: Type.Effect, name: displayName, category, detail: matchName } satisfies IItem;
                EFFECT_LIST.push(item);
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
        scanFiles(SETTINGS.script, SCRIPT_RE, (root, file) => {
            if (root) {
                SCRIPT_LIST.push({ type: Type.Script, name: file.displayName, category: 'Script', detail: file.fsName.substr(root.fsName.length + 1), path: file.fsName });
            } else {
                SCRIPT_LIST.push({ type: Type.Script, name: file.displayName, category: 'Script', detail: file.displayName, path: file.fsName });
            }
        });
    }

    initScript();

    // preset
    let PRESET_LIST: IItem[] = [];
    const PRESET_RE = /\.ffx$/i;

    function initPreset() {
        PRESET_LIST = [];
        scanFiles(SETTINGS.preset, PRESET_RE, (root, file) => {
            if (root) {
                SCRIPT_LIST.push({ type: Type.Preset, name: file.displayName, category: 'Preset', detail: file.fsName.substr(root.fsName.length + 1), path: file.fsName });
            } else {
                SCRIPT_LIST.push({ type: Type.Preset, name: file.displayName, category: 'Preset', detail: file.displayName, path: file.fsName });
            }
        });
    }

    initPreset();

    // recent
    const SECTION_NAME = `@script/${SCRIPT_NAME}` as const;
    const RECENT_KEY_NAME = 'recent items';
    const RECENT_ITEMS: IItem[] = loadRecentItems();
    const MAX_RECENT_ITEM = 30;

    function getRecentItems(clone = false) {
        return clone ? RECENT_ITEMS.slice() : RECENT_ITEMS;
    }

    function loadRecentItems() {
        let items: IItem[] = [];
        if (app.settings.haveSetting(SECTION_NAME, RECENT_KEY_NAME)) {
            try {
                items = Atarabi.JSON.parse(app.settings.getSetting(SECTION_NAME, RECENT_KEY_NAME)) as IItem[];
            } catch (e) {
                // pass
            }
        }
        return items;
    }

    function saveRecentItems() {
        app.settings.saveSetting(SECTION_NAME, RECENT_KEY_NAME, Atarabi.JSON.stringify(RECENT_ITEMS));
    }

    function appendRecentItem(item: IItem) {
        for (let i = 0; i < RECENT_ITEMS.length; i++) {
            if (RECENT_ITEMS[i].detail === item.detail) {
                RECENT_ITEMS.splice(i, 1);
                break;
            }
        }
        RECENT_ITEMS.unshift(item);
        RECENT_ITEMS.splice(MAX_RECENT_ITEM);
        saveRecentItems();
    }

    // apply
    function applyEffect(effectMatchName: string, move: 'beginning' | 'end' | undefined = undefined) {
        const comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return false;
        }

        const layers = filter(comp.selectedLayers.slice(), isAVLayer);
        if (!layers.length) {
            const activeLayer = Atarabi.layer.getActiveLayer();
            if (!isAVLayer(activeLayer)) {
                return false;
            }
            layers.push(activeLayer);
        }

        // check
        if (!layers[0].effect.canAddProperty(effectMatchName)) {
            alert(`Unable to apply "${effectMatchName}"`);
            return false;
        }

        try {
            app.beginUndoGroup(`${SCRIPT_NAME}: Apply`);
            for (const layer of layers) {
                const properties = layer.selectedProperties.slice();
                let selectedEffect: PropertyBase = null;
                for (const property of properties) {
                    property.selected = false;
                    if (property.isEffect) {
                        selectedEffect = property;
                        break;
                    }
                }
                const effects = layer.effect;
                if (move === 'beginning') {
                    const newEffect = effects.addProperty(effectMatchName);
                    newEffect.moveTo(1);
                    effects(1).selected = true;
                } else if (move === 'end' || !selectedEffect) {
                    const newEffect = effects.addProperty(effectMatchName);
                    newEffect.selected = true;
                } else {
                    const newIndex = selectedEffect.propertyIndex;
                    const newEffect = effects.addProperty(effectMatchName);
                    newEffect.moveTo(newIndex + 1);
                    effects(newIndex + 1).selected = true;
                }
            }
        } catch (e) {
            alert(e);
        } finally {
            app.endUndoGroup();
        }
        return true;
    }

    function applyScript(item: IItem) {
        const file = new File(item.path);
        if (!(file instanceof File && file.exists)) {
            return false;
        }
        (() => {
            $.evalFile(file.absoluteURI);
        }).call($.global);
        return true;
    }

    function applyPreset(item: IItem) {
        const file = new File(item.path);
        if (!(file instanceof File && file.exists)) {
            return false;
        }
        const comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return false;
        }
        const layers = comp.selectedLayers.slice();
        if (!layers.length) {
            return false;
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
        return true;
    }

    function apply(item: IItem, move: 'beginning' | 'end' | undefined = undefined) {
        switch (item.type) {
            case Type.Effect:
                if (applyEffect(item.detail, move)) {
                    appendRecentItem(item);
                }
                break;
            case Type.Script:
                if (applyScript(item)) {
                    appendRecentItem(item);
                }
                break;
            case Type.Preset:
                if (applyPreset(item)) {
                    appendRecentItem(item);
                }
                break;
        }
    }

    // search
    let searcher: Atarabi.UI.FuzzySearch<IItem> = null;

    function initSearcher() {
        searcher = Atarabi.UI.FuzzySearch([].concat(EFFECT_LIST, SCRIPT_LIST, PRESET_LIST), ['name', 'detail', 'category'], {
            caseSensitive: false,
            sort: true,
            cache: true,
        });
    }

    initSearcher();

    // ui
    const builder = new Atarabi.UI.Builder(global instanceof Panel ? global : 'palette', SCRIPT_NAME, { resizeable: true }, win => {
        win.spacing = win.margins = 2;
        win.preferredSize = [300, 300];
    })
        .addEditText(Param.Search, undefined, undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.onChanging = Atarabi.app.debounce(() => {
                emitter.notify(Event.Search, ui.text);
            }, DEBOUNCE_TIME);
        })
        .addListBox(Param.ItemList, undefined, { numberOfColumns: 3, columnWidths: [150, 100, 50] }, (ui, emitter) => {
            type IListBoxItem = ListItem & { item: IItem };
            ui.alignment = ['fill', 'fill'];
            ui.onDoubleClick = () => {
                const selection = ui.selection as IListBoxItem;
                if (!selection) {
                    return;
                }
                apply(selection.item);
            };
            ui.addEventListener('mousedown', (e: MouseEvent) => {
                const selection = ui.selection as IListBoxItem;
                if (!selection) {
                    return;
                }
                // right click
                if (e.button === 2) {
                    if (selection.item.type === Type.Effect) {
                        const index = Atarabi.UI.showContextMenu([{ text: 'Move To Beginning' }, { text: 'Move To End' }]);
                        if (index === 0) {
                            apply(selection.item, 'beginning');
                        } else if (index === 1) {
                            apply(selection.item, 'end');
                        }
                    }
                }
            });

            emitter.addEventListener(Event.Search, (searchText: string) => {
                if (searchText === SETTINGS_COMMAND) {
                    if (buildSettingsUI()) {
                        initSearcher();
                    }
                    builder.set(Param.Search, '');
                    emitter.notify(Event.Search, '');
                    return;
                }
                const iItems = searchText ? searcher.search(searchText).slice(0, 50) : getRecentItems();
                ui.removeAll();
                for (const iItem of iItems) {
                    try {
                        const item = ui.add('item', iItem.name) as IListBoxItem;
                        item.subItems[0].text = iItem.category;
                        item.subItems[1].text = iItem.detail;
                        item.item = iItem;
                    } catch (e) {
                        app.setTimeout(() => {
                            emitter.notify(Event.Search, searchText);
                        }, 500);
                        return;
                    }
                }
            });
        })
        .build();

    builder.onInit(builder => {
        builder.notify(Event.Search, '');
    });

})(this);