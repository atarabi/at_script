/**
 * @effect_launcher v3.0.0
 *
 *      v3.0.0(2026/02/21)  Switched to new fuzzy search. dependency: @script >= v0.8.0
 *      v2.3.0(2026/02/07)  Added support for showing recent items
 *      v2.2.2(2025/04/16)  Fixed a bug where a script wasn’t executed
 *      v2.2.1(2025/04/02)  Switched to Types-for-Adobe
 *      v2.2.0(2025/03/08)  Added support for scripts and presets
 *      v2.1.0(2025/02/01)  Added support for footage shortcuts
 *      v2.0.0(2024/11/14)  Added support for shortcuts and reduce debounce time
 *      v1.0.3(2024/02/13)  Fixed dynamic link bug
 *      v1.0.2(2023/12/05)  Fixed lock bug
 *      v1.0.1(2023/09/23)  Fixed strange behavior
 *      v1.0.0(2023/09/16)  Initial release
 */
(function () {
    if (Atarabi.isDynamicLink()) {
        return;
    }
    var SCRIPT_NAME = '@effect_launcher';
    var DEBOUNCE_TIME = 100; // ms
    // utility
    function filter(values, fn) {
        var arr = [];
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var value = values_1[_i];
            if (fn(value)) {
                arr.push(value);
            }
        }
        return arr;
    }
    function createFolder(folder) {
        if (folder.exists) {
            return;
        }
        var parents = [];
        var parent = folder;
        while (!(parent && parent.exists)) {
            parents.push(parent);
            parent = parent.parent;
        }
        parents.reverse();
        for (var _i = 0, parents_1 = parents; _i < parents_1.length; _i++) {
            var folder_1 = parents_1[_i];
            folder_1.create();
        }
    }
    function clone(value) {
        return eval("(".concat(Atarabi.JSON.stringify(value), ")"));
    }
    function isWin() {
        return /^win/i.test($.os);
    }
    function makeFileFilter(exts) {
        if (isWin()) {
            var arr = [];
            for (var _i = 0, exts_1 = exts; _i < exts_1.length; _i++) {
                var ext = exts_1[_i];
                arr.push("*.".concat(ext));
            }
            return arr.join(';');
        }
        return function (f) {
            var re = RegExp('\\.(' + exts.join('|') + ')$', 'i');
            return f instanceof Folder || re.test(f.displayName);
        };
    }
    // settings
    var Type;
    (function (Type) {
        Type["Effect"] = "effect";
        Type["Script"] = "script";
        Type["Scriptlet"] = "scriptlet";
        Type["Preset"] = "preset";
        Type["Command"] = "command";
        Type["Footage"] = "footage";
        Type["Project"] = "project";
        Type["Unknown"] = "unknown";
    })(Type || (Type = {}));
    var CURRENT_SETTINGS_VERSION = 2;
    var SETTINGS_FILE = new File("".concat(Folder.userData.absoluteURI, "/Atarabi/@scripts/").concat(SCRIPT_NAME, "/settings.json"));
    SETTINGS_FILE.encoding = 'utf-8';
    var SETTINGS = loadSettings();
    var SETTINGS_COMMAND = '\\\\';
    function hasShortcutKey(key) {
        return SETTINGS.shortcuts.hasOwnProperty(key);
    }
    function getShortcutValue(key) {
        return SETTINGS.shortcuts[key];
    }
    function getShortcutTypeFromFile(file) {
        if (!file.exists) {
            return Type.Unknown;
        }
        if (/\.(jsx|jsxbin)$/i.test(file.displayName)) {
            return Type.Script;
        }
        else if (/\.(ffx)$/i.test(file.displayName)) {
            return Type.Preset;
        }
        try {
            var importOptions = new ImportOptions(file);
            if (importOptions.canImportAs(ImportAsType.FOOTAGE) || importOptions.canImportAs(ImportAsType.COMP) || importOptions.canImportAs(ImportAsType.COMP_CROPPED_LAYERS)) {
                return Type.Footage;
            }
            else if (importOptions.canImportAs(ImportAsType.PROJECT)) {
                return Type.Project;
            }
        }
        catch (e) {
            alert(e);
        }
        return Type.Unknown;
    }
    function getShortcutValues(perms) {
        var _a;
        if (perms === void 0) { perms = (_a = {}, _a[Type.Effect] = true, _a[Type.Script] = true, _a[Type.Preset] = true, _a); }
        var values = [];
        for (var key in SETTINGS.shortcuts) {
            if (SETTINGS.shortcuts.hasOwnProperty(key)) {
                var value = getShortcutValue(key);
                if (perms[value.type]) {
                    values.push({ key: key, type: value.type, value: value.value });
                }
            }
        }
        return values;
    }
    // script, preset
    function scanFiles(setting, re, fn) {
        var doneFolder = {};
        var doneFile = {};
        var push = function (root, file) {
            if (!doneFile.hasOwnProperty(file.absoluteURI)) {
                doneFile[file.absoluteURI] = true;
                fn(root, file);
            }
        };
        // folder
        var MAX_DEPTH = 3;
        var scanFolder = function (root, folder, rescursive, depth) {
            if (doneFolder.hasOwnProperty(folder.absoluteURI)) {
                return;
            }
            doneFolder[folder.absoluteURI] = true;
            for (var _i = 0, _a = folder.getFiles(); _i < _a.length; _i++) {
                var file = _a[_i];
                if (file instanceof Folder) {
                    if (rescursive && depth < MAX_DEPTH) {
                        scanFolder(root, file, rescursive, depth + 1);
                    }
                }
                else if (file instanceof File && re.test(file.displayName)) {
                    push(root, file);
                }
            }
        };
        for (var _i = 0, _a = setting.folders; _i < _a.length; _i++) {
            var _b = _a[_i], path = _b.path, recursive = _b.recursive;
            var folder = Folder(path);
            if (folder instanceof Folder && folder.exists) {
                scanFolder(folder.parent, folder, recursive, 0);
            }
        }
        // file
        for (var _c = 0, _d = setting.files; _c < _d.length; _c++) {
            var path = _d[_c].path;
            var file = File(path);
            if (file instanceof File && file.exists && re.test(file.displayName)) {
                push(null, file);
            }
        }
    }
    // script
    var SCRIPT_LIST = [];
    var SCRIPT_RE = /\.jsx(bin)?$/i;
    function initScript() {
        SCRIPT_LIST = [];
        if (SETTINGS && SETTINGS.script) {
            scanFiles(SETTINGS.script, SCRIPT_RE, function (root, file) {
                if (root) {
                    SCRIPT_LIST.push({ type: Type.Script, name: file.displayName, category: 'Script', detail: file.fsName.substr(root.fsName.length + 1), path: file.fsName });
                }
                else {
                    SCRIPT_LIST.push({ type: Type.Script, name: file.displayName, category: 'Script', detail: file.displayName, path: file.fsName });
                }
            });
        }
    }
    initScript();
    // preset
    var PRESET_LIST = [];
    var PRESET_RE = /\.ffx$/i;
    function initPreset() {
        PRESET_LIST = [];
        if (SETTINGS && SETTINGS.preset) {
            scanFiles(SETTINGS.preset, PRESET_RE, function (root, file) {
                if (root) {
                    SCRIPT_LIST.push({ type: Type.Preset, name: file.displayName, category: 'Preset', detail: file.fsName.substr(root.fsName.length + 1), path: file.fsName });
                }
                else {
                    SCRIPT_LIST.push({ type: Type.Preset, name: file.displayName, category: 'Preset', detail: file.displayName, path: file.fsName });
                }
            });
        }
    }
    initPreset();
    function loadSettings() {
        var settings = {
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
            var data = SETTINGS_FILE.read();
            SETTINGS_FILE.close();
            settings = Atarabi.JSON.parse(data);
            // simple check
            settings.version = CURRENT_SETTINGS_VERSION;
            if (!settings.shortcuts) {
                settings.shortcuts = {};
            }
            if (!settings.script) {
                settings.script = {};
            }
            if (!settings.script.folders) {
                settings.script.folders = [];
            }
            if (!settings.script.files) {
                settings.script.files = [];
            }
            if (!settings.preset) {
                settings.preset = {};
            }
            if (!settings.preset.folders) {
                settings.preset.folders = [];
            }
            if (!settings.preset.files) {
                settings.preset.files = [];
            }
        }
        catch (e) {
            alert(e);
        }
        return settings;
    }
    function saveSettings() {
        createFolder(SETTINGS_FILE.parent);
        if (!SETTINGS_FILE.open('w')) {
            alert("Unable to open ".concat(SETTINGS_FILE.displayName));
            return;
        }
        SETTINGS_FILE.write(Atarabi.JSON.stringify(SETTINGS, undefined, 2));
        SETTINGS_FILE.close();
    }
    function updateSettings(newSettings) {
        SETTINGS = newSettings;
        saveSettings();
        initScript();
        initPreset();
    }
    function generateShortcutKey(settings, name, defaultKey) {
        if (defaultKey === void 0) { defaultKey = ''; }
        var Param;
        (function (Param) {
            Param["ShortcutGroup"] = "ShortcutGroup";
            Param["ShortcutKey"] = "ShortcutKey";
            Param["ShortcutValue"] = "ShortcutValue";
            Param["ButtonGroup"] = "ButtonGroup";
            Param["OK"] = "OK";
            Param["Cancel"] = "Cancel";
        })(Param || (Param = {}));
        var Event;
        (function (Event) {
            Event["Change"] = "Change";
            Event["Submit"] = "Submit";
        })(Event || (Event = {}));
        var hasKey = function (k) {
            return k === SETTINGS_COMMAND || settings.shortcuts.hasOwnProperty(k);
        };
        if (!defaultKey) {
            for (var _i = 0, name_1 = name; _i < name_1.length; _i++) {
                var ch = name_1[_i];
                var k = "\\".concat(ch.toLowerCase());
                if (!hasKey(k)) {
                    defaultKey = k;
                    break;
                }
            }
        }
        var newKey = null;
        var builder = new Atarabi.UI.Builder('dialog', 'Create a shortcut', { resizeable: true }, function (win) {
            win.spacing = 8;
            win.margins = 10;
        })
            .addGroup(Param.ShortcutGroup, undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'top'];
            ui.orientation = 'row';
        })
            .addEditText(Param.ShortcutKey, defaultKey, undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'top'];
            ui.preferredSize[0] = 100;
            ui.helpTip = 'Shortcut Key';
            ui.active = true;
            ui.onChanging = function () {
                emitter.notify(Event.Change, ui.text);
            };
            emitter.addEventListener(Event.Submit, function () {
                var key = ui.text;
                if (hasKey(key)) {
                    return;
                }
                newKey = key;
                ui.window.close();
            });
        })
            .addStaticText(Param.ShortcutValue, name, undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'top'];
            ui.preferredSize[0] = 250;
        })
            .addGroupEnd()
            .addGroup(Param.ButtonGroup, undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'top'];
            ui.orientation = 'row';
            ui.spacing = ui.margins = 3;
        })
            .addButton(Param.OK, undefined, undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'top'];
            ui.onClick = function () {
                emitter.notify(Event.Submit);
            };
            emitter.addEventListener(Event.Change, function (k) {
                ui.enabled = !hasKey(k);
            });
        })
            .addButton(Param.Cancel, undefined, undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'top'];
            ui.onClick = function () {
                ui.window.close();
            };
        })
            .addGroupEnd()
            .build();
        return newKey;
    }
    function createEffectShortcut(name, matchName) {
        var newKey = generateShortcutKey(SETTINGS, name);
        if (newKey) {
            SETTINGS.shortcuts[newKey] = { type: Type.Effect, value: matchName };
            saveSettings();
        }
    }
    var EFFECT_LIST = [];
    var EFFECT_NAME_MAP = {};
    function initEffect() {
        for (var _i = 0, _a = app.effects; _i < _a.length; _i++) {
            var _b = _a[_i], displayName = _b.displayName, matchName = _b.matchName, category = _b.category;
            if (displayName && matchName && category) {
                var item = { type: Type.Effect, name: displayName, category: category, detail: matchName };
                EFFECT_LIST.push(item);
                EFFECT_NAME_MAP[matchName] = displayName;
            }
        }
        EFFECT_LIST.sort(function (a, b) {
            var aObsolete = a.category === '_Obsolete';
            var bObsolete = b.category === '_Obsolete';
            if (aObsolete === bObsolete) {
                return 0;
            }
            else if (aObsolete) {
                return 1;
            }
            else {
                return -1;
            }
        });
    }
    initEffect();
    // recent
    var SECTION_NAME = "@script/".concat(SCRIPT_NAME);
    var RECENT_KEY_NAME = 'recent items';
    var RECENT_ITEM_LIST = loadRecentItems();
    var MAX_RECENT_ITEM = 20;
    function getRecentItems(clone) {
        if (clone === void 0) { clone = false; }
        return clone ? RECENT_ITEM_LIST.slice() : RECENT_ITEM_LIST;
    }
    function loadRecentItems() {
        var items = [];
        if (app.settings.haveSetting(SECTION_NAME, RECENT_KEY_NAME)) {
            try {
                items = Atarabi.JSON.parse(app.settings.getSetting(SECTION_NAME, RECENT_KEY_NAME));
            }
            catch (e) {
                // pass
            }
        }
        return items;
    }
    function saveRecentItems() {
        app.settings.saveSetting(SECTION_NAME, RECENT_KEY_NAME, Atarabi.JSON.stringify(RECENT_ITEM_LIST));
    }
    function appendRecentItem(item) {
        for (var i = 0; i < RECENT_ITEM_LIST.length; i++) {
            if (RECENT_ITEM_LIST[i].detail === item.detail) {
                RECENT_ITEM_LIST.splice(i, 1);
                break;
            }
        }
        RECENT_ITEM_LIST.unshift(item);
        RECENT_ITEM_LIST.splice(MAX_RECENT_ITEM);
        saveRecentItems();
    }
    // searcher
    var searcher = null;
    function initSearcher() {
        searcher = Atarabi.UI.FuzzySearch([].concat(EFFECT_LIST, SCRIPT_LIST, PRESET_LIST), ['name', 'detail', { key: 'category', weight: 0.1 }], {
            caseSensitive: false,
            sort: true,
            cache: true,
        });
    }
    initSearcher();
    // apply
    function isAVLayer(layer) {
        return layer instanceof AVLayer || layer instanceof ShapeLayer || layer instanceof TextLayer;
    }
    function getActiveLayers() {
        var comp = app.project.activeItem;
        if (comp instanceof CompItem) {
            return comp.selectedLayers.slice();
        }
        return [];
    }
    function applyEffect(avLayers, effectMatchName) {
        if (!avLayers.length) {
            return false;
        }
        if (!avLayers[0].effect.canAddProperty(effectMatchName)) {
            return false;
        }
        try {
            app.beginUndoGroup("Apply: ".concat(effectMatchName));
            for (var _i = 0, avLayers_1 = avLayers; _i < avLayers_1.length; _i++) {
                var layer = avLayers_1[_i];
                var properties = layer.selectedProperties.slice();
                var index = 0;
                for (var _a = 0, properties_1 = properties; _a < properties_1.length; _a++) {
                    var property = properties_1[_a];
                    if (property.isEffect) {
                        index = property.propertyIndex;
                    }
                    property.selected = false;
                }
                var effects = layer.effect;
                var newEffect = effects.addProperty(effectMatchName);
                if (index > 0) {
                    newEffect.moveTo(index + 1);
                    effects(index + 1).selected = true;
                }
                else {
                    newEffect.selected = true;
                }
            }
        }
        catch (e) {
            // pass
        }
        finally {
            app.endUndoGroup();
        }
        return true;
    }
    function applyScript(file) {
        if (!(file instanceof File && file.exists)) {
            return false;
        }
        (function () {
            $.evalFile(file.absoluteURI);
        }).call($.global);
        return true;
    }
    function applyScriptlet(code) {
        (function () {
            eval(code);
        }).call($.global);
    }
    function applyPreset(layers, file) {
        if (!layers.length) {
            return false;
        }
        if (!(file instanceof File && file.exists)) {
            return false;
        }
        try {
            app.beginUndoGroup("".concat(SCRIPT_NAME, ": Apply"));
            // deselect
            for (var _i = 0, layers_1 = layers; _i < layers_1.length; _i++) {
                var layer = layers_1[_i];
                layer.selected = false;
            }
            for (var _a = 0, layers_2 = layers; _a < layers_2.length; _a++) {
                var layer = layers_2[_a];
                layer.selected = true;
                layer.applyPreset(file);
                layer.selected = false;
            }
            // reselect
            for (var _b = 0, layers_3 = layers; _b < layers_3.length; _b++) {
                var layer = layers_3[_b];
                layer.selected = true;
            }
        }
        catch (e) {
            alert(e);
        }
        finally {
            app.endUndoGroup();
        }
        return true;
    }
    function applyCommand(command) {
        if (/^\d+$/.test(command)) {
            app.executeCommand(parseInt(command, 10));
        }
        else {
            var commandID = app.findMenuCommandId(command);
            if (!commandID) {
                alert("".concat(command, " is not found"));
                return;
            }
            app.executeCommand(commandID);
        }
    }
    function applyImport(file) {
        if (!file.exists) {
            return;
        }
        try {
            var importOptions = new ImportOptions(file);
            app.project.importFile(importOptions);
        }
        catch (e) {
            alert(e);
        }
    }
    function applyShortcutValue(layers, shortcutValue) {
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
    function applyItem(layers, iItem) {
        switch (iItem.type) {
            case Type.Effect:
                if (applyEffect(filter(layers, isAVLayer), iItem.detail)) {
                    appendRecentItem(iItem);
                }
                break;
            case Type.Script:
                if (applyScript(new File(iItem.path))) {
                    appendRecentItem(iItem);
                }
                break;
            case Type.Preset:
                if (applyPreset(layers, new File(iItem.path))) {
                    appendRecentItem(iItem);
                }
                break;
        }
    }
    function createNameFromShortcutValue(value) {
        switch (value.type) {
            case Type.Effect:
                var name = EFFECT_NAME_MAP[value.value];
                return name ? name : 'not found';
            default:
                var file = new File(value.value);
                return file.displayName;
        }
    }
    function mod(x, y) {
        var z = x % y;
        return z < 0 ? z + y : z;
    }
    // ui
    var Timer = /** @class */ (function () {
        function Timer() {
        }
        Timer.reset = function () {
            Timer.time = 0;
        };
        Timer.get = function () {
            return Timer.time;
        };
        Timer.update = function () {
            Timer.time = Date.now();
        };
        Timer.time = 0;
        return Timer;
    }());
    function buildSettingsUI() {
        var Param;
        (function (Param) {
            Param["Container"] = "Container";
            Param["ShortcutPanel"] = "ShortcutPanel";
            Param["ShortcutList"] = "ShortcutList";
            Param["ShortcutButtonGroup"] = "ShortcutButtonGroup";
            Param["ShortcutNew"] = "ShortcutNew";
            Param["ShortcutEdit"] = "ShortcutEdit";
            Param["ShortcutDelete"] = "ShortcutDelete";
            Param["ScriptPanel"] = "ScriptPanel";
            Param["ScriptFoldersText"] = "ScriptFoldersText";
            Param["ScriptFoldersList"] = "ScriptFoldersList";
            Param["ScriptFoldersButtonGroup"] = "ScriptFoldersButtonGroup";
            Param["ScriptFoldersNew"] = "ScriptFoldersNew";
            Param["ScriptFoldersDelete"] = "ScriptFoldersDelete";
            Param["ScriptSeparator"] = "ScriptSeparator";
            Param["ScriptFilesText"] = "ScriptFilesText";
            Param["ScriptFilesList"] = "ScriptFilesList";
            Param["ScriptFilesButtonGroup"] = "ScriptFilesButtonGroup";
            Param["ScriptFilesNew"] = "ScriptFilesNew";
            Param["ScriptFilesDelete"] = "ScriptFilesDelete";
            Param["PresetPanel"] = "PresetPanel";
            Param["PresetFoldersText"] = "PresetFoldersText";
            Param["PresetFoldersList"] = "PresetFoldersList";
            Param["PresetFoldersButtonGroup"] = "PresetFoldersButtonGroup";
            Param["PresetFoldersNew"] = "PresetFoldersNew";
            Param["PresetFoldersDelete"] = "PresetFoldersDelete";
            Param["PresetSeparator"] = "PresetSeparator";
            Param["PresetFilesText"] = "PresetFilesText";
            Param["PresetFilesList"] = "PresetFilesList";
            Param["PresetFilesButtonGroup"] = "PresetFilesButtonGroup";
            Param["PresetFilesNew"] = "PresetFilesNew";
            Param["PresetFilesDelete"] = "PresetFilesDelete";
            Param["ButtonGroup"] = "ButtonGroup";
            Param["OK"] = "OK";
            Param["Cancel"] = "Cancel";
        })(Param || (Param = {}));
        var Event;
        (function (Event) {
            Event["NewShortcut"] = "NewShortcut";
            Event["EditShortcut"] = "EditShortcut";
            Event["DeleteShortcut"] = "DeleteShortcut";
            Event["NewScriptFolder"] = "NewScriptFolder";
            Event["DeleteScriptFolder"] = "DeleteScriptFolder";
            Event["EditScriptFolder"] = "EditScriptFolder";
            Event["RecursiveScriptFolder"] = "RecursiveScriptFolder";
            Event["NewScriptFile"] = "NewScriptFile";
            Event["EditScriptFile"] = "EditScriptFile";
            Event["DeleteScriptFile"] = "DeleteScriptFile";
            Event["NewPresetFolder"] = "NewPresetFolder";
            Event["DeletePresetFolder"] = "DeletePresetFolder";
            Event["EditPresetFolder"] = "EditPresetFolder";
            Event["RecursivePresetFolder"] = "RecursivePresetFolder";
            Event["NewPresetFile"] = "NewPresetFile";
            Event["EditPresetFile"] = "EditPresetFile";
            Event["DeletePresetFile"] = "DeletePresetFile";
        })(Event || (Event = {}));
        var newSettings = clone(SETTINGS);
        var update = false;
        var builder = new Atarabi.UI.Builder('dialog', 'Settings', undefined, function (win) {
            win.spacing = 8;
            win.margins = 10;
        })
            .addGroup(Param.Container, undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'fill'];
            ui.orientation = 'row';
            ui.spacing = 3;
            ui.margins = 3;
        })
            .addPanel(Param.ShortcutPanel, 'Shortcuts', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'fill'];
            ui.preferredSize[0] = 350;
            ui.spacing = 3;
            ui.margins = 10;
        })
            .addListBox(Param.ShortcutList, undefined, { numberOfColumns: 4, columnWidths: [50, 100, 100, 100] }, function (ui, emitter) {
            ui.alignment = ['fill', 'fill'];
            ui.preferredSize[1] = 300;
            for (var key in newSettings.shortcuts) {
                if (newSettings.shortcuts.hasOwnProperty(key)) {
                    var item = ui.add('item', key);
                    var value = newSettings.shortcuts[key];
                    item.subItems[0].text = createNameFromShortcutValue(value);
                    item.subItems[1].text = value.type;
                    item.subItems[2].text = value.value;
                }
            }
            ui.addEventListener('mousedown', function (e) {
                var selection = ui.selection;
                if (!selection) {
                    return;
                }
                // right click
                if (e.button === 2) {
                    var index = Atarabi.UI.showContextMenu([{ text: 'Edit' }, { text: 'Delete' }]);
                    if (index === 0) {
                        emitter.notify(Event.EditShortcut);
                    }
                    else if (index === 1) {
                        emitter.notify(Event.DeleteShortcut);
                    }
                }
            });
            emitter.addEventListener(Event.NewShortcut, function () {
                var file = File.openDialog('File for shortcut');
                if (file) {
                    var type = getShortcutTypeFromFile(file);
                    if (type === Type.Unknown) {
                        alert('Invalid file');
                        return;
                    }
                    var newKey = generateShortcutKey(newSettings, file.displayName);
                    if (newKey) {
                        var item = ui.add('item', newKey);
                        item.subItems[0].text = file.displayName;
                        item.subItems[1].text = type;
                        item.subItems[2].text = file.fsName;
                        newSettings.shortcuts[newKey] = { type: type, value: file.fsName };
                    }
                }
            });
            emitter.addEventListener(Event.EditShortcut, function () {
                var selection = ui.selection;
                if (!selection) {
                    return;
                }
                var prevKey = selection.text;
                var value = newSettings.shortcuts[prevKey];
                var tempSettings = clone(newSettings);
                delete tempSettings.shortcuts[prevKey];
                var newKey = generateShortcutKey(tempSettings, createNameFromShortcutValue(value), prevKey);
                if (newKey) {
                    delete newSettings.shortcuts[prevKey];
                    newSettings.shortcuts[newKey] = value;
                    selection.text = newKey;
                }
            });
            emitter.addEventListener(Event.DeleteShortcut, function () {
                var selection = ui.selection;
                if (!selection) {
                    return;
                }
                if (confirm("Delete \"".concat(selection.text, "\": \"").concat(selection.subItems[0].text, "\"?"))) {
                    delete newSettings.shortcuts[selection.text];
                    ui.remove(selection);
                }
            });
        })
            .addGroup(Param.ShortcutButtonGroup, undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'bottom'];
            ui.spacing = ui.margins = 1;
            ui.orientation = 'row';
        })
            .addButton(Param.ShortcutNew, 'New', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'bottom'];
            ui.onClick = function () {
                emitter.notify(Event.NewShortcut);
            };
        })
            .addButton(Param.ShortcutEdit, 'Edit', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'bottom'];
            ui.onClick = function () {
                emitter.notify(Event.EditShortcut);
            };
        })
            .addButton(Param.ShortcutDelete, 'Delete', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'bottom'];
            ui.onClick = function () {
                emitter.notify(Event.DeleteShortcut);
            };
        })
            .addGroupEnd()
            .addPanelEnd()
            .addPanel(Param.ScriptPanel, 'Script', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'fill'];
            ui.preferredSize[0] = 350;
            ui.spacing = 3;
            ui.margins = 10;
        })
            .addStaticText(Param.ScriptFoldersText, 'Folders', undefined, function (ui, emitter) {
            ui.alignment = ['left', 'top'];
        })
            .addListBox(Param.ScriptFoldersList, undefined, { numberOfColumns: 2, columnWidths: [150, 200] }, function (ui, emitter) {
            ui.alignment = ['fill', 'fill'];
            ui.preferredSize[1] = 150;
            for (var _i = 0, _a = newSettings.script.folders; _i < _a.length; _i++) {
                var _b = _a[_i], path = _b.path, recursive = _b.recursive;
                var folder = new Folder(path);
                var item = ui.add('item', folder.displayName);
                item.subItems[0].text = path;
                item.checked = recursive;
            }
            ui.addEventListener('mousedown', function (e) {
                var selection = ui.selection;
                if (!selection) {
                    return;
                }
                // right click
                if (e.button === 2) {
                    var index = Atarabi.UI.showContextMenu([{ text: 'Edit' }, { text: 'Recursive', checked: selection.checked }, { text: 'Delete' }]);
                    if (index === 0) {
                        emitter.notify(Event.EditScriptFolder);
                    }
                    if (index === 1) {
                        emitter.notify(Event.RecursiveScriptFolder);
                    }
                    else if (index === 2) {
                        emitter.notify(Event.DeleteScriptFolder);
                    }
                }
            });
            emitter.addEventListener(Event.NewScriptFolder, function () {
                var folder = Folder.selectDialog('Script Folder');
                if (folder) {
                    var newItem = ui.add('item', folder.displayName);
                    newItem.subItems[0].text = folder.fsName;
                    newSettings.script.folders.push({ path: folder.fsName, recursive: false });
                }
            });
            emitter.addEventListener(Event.EditScriptFolder, function () {
                var selection = ui.selection;
                if (!selection) {
                    return;
                }
                var folder = new Folder(newSettings.script.folders[selection.index].path).selectDlg('Script Folder');
                if (folder) {
                    selection.text = folder.displayName;
                    newSettings.script.folders[selection.index].path = selection.subItems[0].text = folder.fsName;
                }
            });
            emitter.addEventListener(Event.RecursiveScriptFolder, function () {
                var selection = ui.selection;
                if (!selection) {
                    return;
                }
                newSettings.script.folders[selection.index].recursive = selection.checked = !selection.checked;
            });
            emitter.addEventListener(Event.DeleteScriptFolder, function () {
                var selection = ui.selection;
                if (!selection) {
                    return;
                }
                if (confirm("Delete \"".concat(selection.text, "\"?"))) {
                    newSettings.script.folders.splice(selection.index, 1);
                    ui.remove(selection);
                }
            });
        })
            .addGroup(Param.ScriptFoldersButtonGroup, undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'bottom'];
            ui.spacing = ui.margins = 1;
            ui.orientation = 'row';
        })
            .addButton(Param.ScriptFoldersNew, 'New', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'bottom'];
            ui.onClick = function () {
                emitter.notify(Event.NewScriptFolder);
            };
        })
            .addButton(Param.ScriptFoldersDelete, 'Delete', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'bottom'];
            ui.onClick = function () {
                emitter.notify(Event.DeleteScriptFolder);
            };
        })
            .addGroupEnd()
            .addPanel(Param.ScriptSeparator, '', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'top'];
            ui.preferredSize[1] = 1;
        })
            .addPanelEnd()
            .addStaticText(Param.ScriptFilesText, 'Files', undefined, function (ui, emitter) {
            ui.alignment = ['left', 'top'];
        })
            .addListBox(Param.ScriptFilesList, undefined, { numberOfColumns: 2, columnWidths: [150, 200] }, function (ui, emitter) {
            ui.alignment = ['fill', 'fill'];
            ui.preferredSize[1] = 150;
            for (var _i = 0, _a = newSettings.script.files; _i < _a.length; _i++) {
                var path = _a[_i].path;
                var folder = new Folder(path);
                var item = ui.add('item', folder.displayName);
                item.subItems[0].text = path;
            }
            ui.addEventListener('mousedown', function (e) {
                var selection = ui.selection;
                if (!selection) {
                    return;
                }
                // right click
                if (e.button === 2) {
                    var index = Atarabi.UI.showContextMenu([{ text: 'Edit' }, { text: 'Delete' }]);
                    if (index === 0) {
                        emitter.notify(Event.EditScriptFile);
                    }
                    else if (index === 1) {
                        emitter.notify(Event.DeleteScriptFile);
                    }
                }
            });
            emitter.addEventListener(Event.NewScriptFile, function () {
                var file = File.openDialog('Script File', makeFileFilter(['jsx', 'jsxbin']));
                if (file) {
                    var newItem = ui.add('item', file.displayName);
                    newItem.subItems[0].text = file.fsName;
                    newSettings.script.files.push({ path: file.fsName });
                }
            });
            emitter.addEventListener(Event.EditScriptFile, function () {
                var selection = ui.selection;
                if (!selection) {
                    return;
                }
                var file = new File(newSettings.script.files[selection.index].path).openDlg('Script File', makeFileFilter(['jsx', 'jsxbin']));
                if (file) {
                    selection.text = file.displayName;
                    newSettings.script.files[selection.index].path = selection.subItems[0].text = file.fsName;
                }
            });
            emitter.addEventListener(Event.DeleteScriptFile, function () {
                var selection = ui.selection;
                if (!selection) {
                    return;
                }
                if (confirm("Delete \"".concat(selection.text, "\"?"))) {
                    newSettings.script.files.splice(selection.index, 1);
                    ui.remove(selection);
                }
            });
        })
            .addGroup(Param.ScriptFilesButtonGroup, undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'bottom'];
            ui.orientation = 'row';
        })
            .addButton(Param.ScriptFilesNew, 'New', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'bottom'];
            ui.onClick = function () {
                emitter.notify(Event.NewScriptFile);
            };
        })
            .addButton(Param.ScriptFilesDelete, 'Delete', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'bottom'];
            ui.onClick = function () {
                emitter.notify(Event.DeleteScriptFile);
            };
        })
            .addGroupEnd()
            .addPanelEnd()
            .addPanel(Param.PresetPanel, 'Preset', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'fill'];
            ui.preferredSize[0] = 350;
            ui.spacing = 3;
            ui.margins = 10;
        })
            .addStaticText(Param.PresetFoldersText, 'Folders', undefined, function (ui, emitter) {
            ui.alignment = ['left', 'top'];
        })
            .addListBox(Param.PresetFoldersList, undefined, { numberOfColumns: 2, columnWidths: [150, 200] }, function (ui, emitter) {
            ui.alignment = ['fill', 'fill'];
            ui.preferredSize[1] = 150;
            for (var _i = 0, _a = newSettings.preset.folders; _i < _a.length; _i++) {
                var _b = _a[_i], path = _b.path, recursive = _b.recursive;
                var folder = new Folder(path);
                var item = ui.add('item', folder.displayName);
                item.subItems[0].text = path;
                item.checked = recursive;
            }
            ui.addEventListener('mousedown', function (e) {
                var selection = ui.selection;
                if (!selection) {
                    return;
                }
                // right click
                if (e.button === 2) {
                    var index = Atarabi.UI.showContextMenu([{ text: 'Edit' }, { text: 'Recursive', checked: selection.checked }, { text: 'Delete' }]);
                    if (index === 0) {
                        emitter.notify(Event.EditPresetFolder);
                    }
                    else if (index === 1) {
                        emitter.notify(Event.RecursivePresetFolder);
                    }
                    else if (index === 2) {
                        emitter.notify(Event.DeletePresetFolder);
                    }
                }
            });
            emitter.addEventListener(Event.NewPresetFolder, function () {
                var folder = Folder.selectDialog('Preset Folder');
                if (folder) {
                    var newItem = ui.add('item', folder.displayName);
                    newItem.subItems[0].text = folder.fsName;
                    newSettings.preset.folders.push({ path: folder.fsName, recursive: false });
                }
            });
            emitter.addEventListener(Event.EditPresetFolder, function () {
                var selection = ui.selection;
                if (!selection) {
                    return;
                }
                var folder = new Folder(newSettings.preset.folders[selection.index].path).selectDlg('Preset Folder');
                if (folder) {
                    selection.text = folder.displayName;
                    newSettings.preset.folders[selection.index].path = selection.subItems[0].text = folder.fsName;
                }
            });
            emitter.addEventListener(Event.RecursivePresetFolder, function () {
                var selection = ui.selection;
                if (!selection) {
                    return;
                }
                newSettings.preset.folders[selection.index].recursive = selection.checked = !selection.checked;
            });
            emitter.addEventListener(Event.DeletePresetFolder, function () {
                var selection = ui.selection;
                if (!selection) {
                    return;
                }
                if (confirm("Delete \"".concat(selection.text, "\"?"))) {
                    newSettings.preset.folders.splice(selection.index, 1);
                    ui.remove(selection);
                }
            });
        })
            .addGroup(Param.PresetFoldersButtonGroup, undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'bottom'];
            ui.spacing = ui.margins = 1;
            ui.orientation = 'row';
        })
            .addButton(Param.PresetFoldersNew, 'New', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'bottom'];
            ui.onClick = function () {
                emitter.notify(Event.NewPresetFolder);
            };
        })
            .addButton(Param.PresetFoldersDelete, 'Delete', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'bottom'];
            ui.onClick = function () {
                emitter.notify(Event.DeletePresetFolder);
            };
        })
            .addGroupEnd()
            .addPanel(Param.PresetSeparator, '', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'top'];
            ui.preferredSize[1] = 1;
        })
            .addPanelEnd()
            .addStaticText(Param.PresetFilesText, 'Files', undefined, function (ui, emitter) {
            ui.alignment = ['left', 'top'];
        })
            .addListBox(Param.PresetFilesList, undefined, { numberOfColumns: 2, columnWidths: [150, 200] }, function (ui, emitter) {
            ui.alignment = ['fill', 'fill'];
            ui.preferredSize[1] = 150;
            for (var _i = 0, _a = newSettings.preset.files; _i < _a.length; _i++) {
                var path = _a[_i].path;
                var folder = new Folder(path);
                var item = ui.add('item', folder.displayName);
                item.subItems[0].text = path;
            }
            ui.addEventListener('mousedown', function (e) {
                var selection = ui.selection;
                if (!selection) {
                    return;
                }
                // right click
                if (e.button === 2) {
                    var index = Atarabi.UI.showContextMenu([{ text: 'Edit' }, { text: 'Delete' }]);
                    if (index === 0) {
                        emitter.notify(Event.EditPresetFile);
                    }
                    else if (index === 1) {
                        emitter.notify(Event.DeletePresetFile);
                    }
                }
            });
            emitter.addEventListener(Event.NewPresetFile, function () {
                var file = File.openDialog('Preset File', makeFileFilter(['ffx']));
                if (file) {
                    var newItem = ui.add('item', file.displayName);
                    newItem.subItems[0].text = file.fsName;
                    newSettings.preset.files.push({ path: file.fsName });
                }
            });
            emitter.addEventListener(Event.EditPresetFile, function () {
                var selection = ui.selection;
                if (!selection) {
                    return;
                }
                var file = new File(newSettings.preset.files[selection.index].path).openDlg('Preset File', makeFileFilter(['ffx']));
                if (file) {
                    selection.text = file.displayName;
                    newSettings.preset.files[selection.index].path = selection.subItems[0].text = file.fsName;
                }
            });
            emitter.addEventListener(Event.DeletePresetFile, function () {
                var selection = ui.selection;
                if (!selection) {
                    return;
                }
                if (confirm("Delete \"".concat(selection.text, "\"?"))) {
                    newSettings.preset.files.splice(selection.index, 1);
                    ui.remove(selection);
                }
            });
        })
            .addGroup(Param.PresetFilesButtonGroup, undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'bottom'];
            ui.orientation = 'row';
        })
            .addButton(Param.PresetFilesNew, 'New', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'bottom'];
            ui.onClick = function () {
                emitter.notify(Event.NewPresetFile);
            };
        })
            .addButton(Param.PresetFilesDelete, 'Delete', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'bottom'];
            ui.onClick = function () {
                emitter.notify(Event.DeletePresetFile);
            };
        })
            .addGroupEnd()
            .addPanelEnd()
            .addGroupEnd()
            .addGroup(Param.ButtonGroup, undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'bottom'];
            ui.orientation = 'row';
            ui.spacing = ui.margins = 1;
        })
            .addButton(Param.OK, undefined, undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'bottom'];
            ui.onClick = function () {
                update = true;
                updateSettings(newSettings);
                ui.window.close();
            };
        })
            .addButton(Param.Cancel, undefined, undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'bottom'];
            ui.onClick = function () {
                ui.window.close();
            };
        })
            .addGroupEnd()
            .build();
        return update;
    }
    var WIN_PREFERRED_SIZE = [350, 200];
    var WIN_MAX_HEIGHT = 300;
    function buildDefaultUI(ctx, layers) {
        var win = new Window('dialog', undefined, undefined, { borderless: true });
        win.spacing = 0;
        win.margins = 0;
        win.preferredSize = WIN_PREFERRED_SIZE;
        win.maximumSize[1] = WIN_MAX_HEIGHT;
        var searchbox = win.add('edittext');
        searchbox.alignment = ['fill', 'top'];
        searchbox.onChanging = Atarabi.app.debounce(function () {
            updateList(searchbox.text);
        }, DEBOUNCE_TIME);
        searchbox.addEventListener('keydown', function (ev) {
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
        var itemList = win.add('listbox', undefined, undefined, { numberOfColumns: 3, columnWidths: [150, 100, 100] });
        itemList.alignment = ['fill', 'fill'];
        itemList.onDoubleClick = function () {
            apply();
        };
        itemList.addEventListener('mousedown', function (e) {
            var selection = itemList.selection;
            if (!selection) {
                return;
            }
            // right click
            if (e.button === 2) {
                var index = Atarabi.UI.showContextMenu([{ text: "Create a shortcut" }]);
                if (index === 0) {
                    win.close();
                    app.setTimeout(function () {
                        createEffectShortcut(selection.text, selection.subItems[1].text);
                    }, 0);
                }
            }
        });
        if (RECENT_ITEM_LIST.length) {
            updateList('');
        }
        function moveList(offset) {
            var selection = itemList.selection;
            if (!selection) {
                if (itemList.items.length) {
                    itemList.selection = 0;
                }
                return;
            }
            itemList.selection = mod(selection.index + offset, itemList.items.length);
        }
        function updateList(needle) {
            if (needle === SETTINGS_COMMAND) {
                win.close();
                app.setTimeout(function () {
                    if (buildSettingsUI()) {
                        initSearcher();
                    }
                }, 10);
                return;
            }
            var shortcutValue = hasShortcutKey(needle) ? getShortcutValue(needle) : null;
            if (shortcutValue) {
                applyShortcutValue(layers, shortcutValue);
                win.close();
                return;
            }
            var iItems = needle ? searcher.search(needle).slice(0, 50) : getRecentItems();
            itemList.removeAll();
            for (var _i = 0, iItems_1 = iItems; _i < iItems_1.length; _i++) {
                var iItem = iItems_1[_i];
                var item = itemList.add('item', iItem.name);
                item.subItems[0].text = iItem.category;
                item.subItems[1].text = iItem.detail;
                item.item = iItem;
            }
            if (itemList.items.length) {
                itemList.selection = 0;
            }
        }
        function updateRecent(item) {
            var found = false;
            for (var i = 0, total = RECENT_ITEM_LIST.length; i < total; i++) {
                var it = RECENT_ITEM_LIST[i];
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
            if (RECENT_ITEM_LIST.length > MAX_RECENT_ITEM) {
                RECENT_ITEM_LIST.length = MAX_RECENT_ITEM;
            }
        }
        function apply() {
            var selection = itemList.selection;
            if (!selection && itemList.items.length === 1) {
                selection = itemList.items[0];
            }
            if (!selection) {
                win.close();
                return;
            }
            var iItem = selection.item;
            updateRecent(iItem);
            applyItem(layers, iItem);
            win.close();
        }
        win.onShow = function () {
            searchbox.active = true;
        };
        win.location = [ctx.mousePosition.x, ctx.mousePosition.y];
        win.show();
    }
    function buildShortcutUI(ctx, layers) {
        var _a;
        var shortcutValues = getShortcutValues((_a = {}, _a[Type.Effect] = false, _a[Type.Script] = true, _a[Type.Preset] = layers.length > 0, _a));
        if (!shortcutValues.length) {
            return;
        }
        var shortcutMap = {};
        for (var _i = 0, shortcutValues_1 = shortcutValues; _i < shortcutValues_1.length; _i++) {
            var value = shortcutValues_1[_i];
            shortcutMap[value.key] = value;
        }
        var win = new Window('dialog', undefined, undefined, { borderless: true });
        win.spacing = 0;
        win.margins = 0;
        win.preferredSize = WIN_PREFERRED_SIZE;
        win.maximumSize[1] = WIN_MAX_HEIGHT;
        var searchbox = win.add('edittext');
        searchbox.alignment = ['fill', 'top'];
        searchbox.onChanging = Atarabi.app.debounce(function () {
            updateList(searchbox.text);
        }, 200);
        searchbox.addEventListener('keydown', function (ev) {
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
        var shortcutList = win.add('listbox', undefined, undefined, { numberOfColumns: 3, columnWidths: [100, 150, 100] });
        shortcutList.alignment = ['fill', 'fill'];
        shortcutList.onDoubleClick = function () {
            apply();
        };
        updateList('');
        function moveList(offset) {
            var selection = shortcutList.selection;
            if (!selection) {
                if (shortcutList.items.length) {
                    shortcutList.selection = 0;
                }
                return;
            }
            shortcutList.selection = mod(selection.index + offset, shortcutList.items.length);
        }
        function updateList(needle) {
            if (needle === SETTINGS_COMMAND) {
                win.close();
                app.setTimeout(function () {
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
            for (var _i = 0, shortcutValues_2 = shortcutValues; _i < shortcutValues_2.length; _i++) {
                var value = shortcutValues_2[_i];
                if (value.key.indexOf(needle) === 0) {
                    var item = shortcutList.add('item', value.key);
                    item.subItems[0].text = createNameFromShortcutValue(value);
                    item.subItems[1].text = value.value;
                }
            }
            if (shortcutList.items.length) {
                shortcutList.selection = 0;
            }
        }
        function apply() {
            var selection = shortcutList.selection;
            if (!selection && shortcutList.items.length === 1) {
                selection = shortcutList.items[0];
            }
            if (!selection) {
                win.close();
                return;
            }
            var key = selection.text;
            if (shortcutMap.hasOwnProperty(key)) {
                applyShortcutValue(layers, shortcutMap[key]);
            }
            win.close();
        }
        win.onShow = function () {
            searchbox.active = true;
        };
        win.location = [ctx.mousePosition.x, ctx.mousePosition.y];
        win.show();
        return true;
    }
    Atarabi.keyboard.hook(isWin() ? { code: 'Space', ctrlOrCmdKey: true } : { code: 'Space', altKey: true }, function (ctx) {
        var newTime = Date.now();
        var elapsed = newTime - Timer.get();
        Timer.update();
        if (elapsed < 2000) {
            return false;
        }
        var layers = getActiveLayers();
        var avLayers = filter(layers, isAVLayer);
        if (avLayers.length) {
            buildDefaultUI(ctx, layers);
        }
        else {
            buildShortcutUI(ctx, layers);
        }
        Timer.reset();
        return true;
    });
})();
