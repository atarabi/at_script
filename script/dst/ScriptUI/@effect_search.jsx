/**
 * @effect_search v2.0.0
 *
 *      v2.0.0(2024/11/14)  Support script and preset and reduce debounce time
 *      v1.0.0(2023/09/16)
 */
(function (global) {
    var SCRIPT_NAME = '@effect_search';
    var DEBOUNCE_TIME = 100; // ms
    var Param;
    (function (Param) {
        Param["Search"] = "Search";
        Param["ItemList"] = "ItemList";
    })(Param || (Param = {}));
    var Event;
    (function (Event) {
        Event["Search"] = "Search";
    })(Event || (Event = {}));
    /*
    *   Utility
    */
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
    function isAVLayer(layer) {
        return layer instanceof ShapeLayer || layer instanceof TextLayer || layer instanceof AVLayer;
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
    /*
    *   Main
    */
    var Type;
    (function (Type) {
        Type["Effect"] = "effect";
        Type["Script"] = "script";
        Type["Preset"] = "preset";
    })(Type || (Type = {}));
    var SETTINGS_FILE = new File("".concat(Folder.userData.absoluteURI, "/Atarabi/@scripts/").concat(SCRIPT_NAME, "/settings.json"));
    SETTINGS_FILE.encoding = 'utf-8';
    var SETTINGS = loadSettings();
    function loadSettings() {
        var settings = {
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
            var data = SETTINGS_FILE.read();
            SETTINGS_FILE.close();
            settings = Atarabi.JSON.parse(data);
            // simple check
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
    var SETTINGS_COMMAND = '\\\\';
    function buildSettingsUI() {
        var Param;
        (function (Param) {
            Param["Container"] = "Container";
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
            Event["NewScriptFolder"] = "NewScriptFolder";
            Event["DeleteScriptFolder"] = "DeleteScriptFolder";
            Event["RecursiveScriptFolder"] = "RecursiveScriptFolder";
            Event["NewScriptFile"] = "NewScriptFile";
            Event["DeleteScriptFile"] = "DeleteScriptFile";
            Event["NewPresetFolder"] = "NewPresetFolder";
            Event["DeletePresetFolder"] = "DeletePresetFolder";
            Event["RecursivePresetFolder"] = "RecursivePresetFolder";
            Event["NewPresetFile"] = "NewPresetFile";
            Event["DeletePresetFile"] = "DeletePresetFile";
        })(Event || (Event = {}));
        var newSettings = clone(SETTINGS);
        var update = false;
        var builder = new Atarabi.UI.Builder('dialog', 'Settings', { resizeable: true }, function (win) {
            win.spacing = 8;
            win.margins = 10;
        })
            .addGroup(Param.Container, undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'fill'];
            ui.orientation = 'row';
            ui.spacing = 3;
            ui.margins = 3;
        })
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
            ui.preferredSize[1] = 100;
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
                    var index = Atarabi.UI.showContextMenu([{ text: 'Recursive', checked: selection.checked }, { text: 'Delete' }]);
                    if (index === 0) {
                        emitter.notify(Event.RecursiveScriptFolder);
                    }
                    else if (index === 1) {
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
            emitter.addEventListener(Event.RecursiveScriptFolder, function () {
                var selection = ui.selection;
                if (!selection) {
                    return;
                }
                newSettings.script.folders[selection.index].recursive = selection.checked = !selection.checked;
            });
        })
            .addGroup(Param.ScriptFoldersButtonGroup, undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'top'];
            ui.spacing = ui.margins = 1;
            ui.orientation = 'row';
        })
            .addButton(Param.ScriptFoldersNew, 'New', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'top'];
            ui.onClick = function () {
                emitter.notify(Event.NewScriptFolder);
            };
        })
            .addButton(Param.ScriptFoldersDelete, 'Delete', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'top'];
            ui.onClick = function () {
                emitter.notify(Event.DeleteScriptFolder);
            };
        })
            .addGroupEnd()
            .addPanel(Param.ScriptSeparator, '', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'top'];
        })
            .addPanelEnd()
            .addStaticText(Param.ScriptFilesText, 'Files', undefined, function (ui, emitter) {
            ui.alignment = ['left', 'top'];
        })
            .addListBox(Param.ScriptFilesList, undefined, { numberOfColumns: 2, columnWidths: [150, 200] }, function (ui, emitter) {
            ui.alignment = ['fill', 'fill'];
            ui.preferredSize[1] = 100;
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
                    var index = Atarabi.UI.showContextMenu([{ text: 'Delete' }]);
                    if (index === 0) {
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
            ui.alignment = ['fill', 'top'];
            ui.orientation = 'row';
        })
            .addButton(Param.ScriptFilesNew, 'New', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'top'];
            ui.onClick = function () {
                emitter.notify(Event.NewScriptFile);
            };
        })
            .addButton(Param.ScriptFilesDelete, 'Delete', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'top'];
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
            ui.preferredSize[1] = 100;
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
                    var index = Atarabi.UI.showContextMenu([{ text: 'Recursive', checked: selection.checked }, { text: 'Delete' }]);
                    if (index === 0) {
                        emitter.notify(Event.RecursivePresetFolder);
                    }
                    else if (index === 1) {
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
            emitter.addEventListener(Event.RecursivePresetFolder, function () {
                var selection = ui.selection;
                if (!selection) {
                    return;
                }
                newSettings.preset.folders[selection.index].recursive = selection.checked = !selection.checked;
            });
        })
            .addGroup(Param.PresetFoldersButtonGroup, undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'top'];
            ui.spacing = ui.margins = 1;
            ui.orientation = 'row';
        })
            .addButton(Param.PresetFoldersNew, 'New', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'top'];
            ui.onClick = function () {
                emitter.notify(Event.NewPresetFolder);
            };
        })
            .addButton(Param.PresetFoldersDelete, 'Delete', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'top'];
            ui.onClick = function () {
                emitter.notify(Event.DeletePresetFolder);
            };
        })
            .addGroupEnd()
            .addPanel(Param.PresetSeparator, '', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'top'];
        })
            .addPanelEnd()
            .addStaticText(Param.PresetFilesText, 'Files', undefined, function (ui, emitter) {
            ui.alignment = ['left', 'top'];
        })
            .addListBox(Param.PresetFilesList, undefined, { numberOfColumns: 2, columnWidths: [150, 200] }, function (ui, emitter) {
            ui.alignment = ['fill', 'fill'];
            ui.preferredSize[1] = 100;
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
                    var index = Atarabi.UI.showContextMenu([{ text: 'Delete' }]);
                    if (index === 0) {
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
            ui.alignment = ['fill', 'top'];
            ui.orientation = 'row';
        })
            .addButton(Param.PresetFilesNew, 'New', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'top'];
            ui.onClick = function () {
                emitter.notify(Event.NewPresetFile);
            };
        })
            .addButton(Param.PresetFilesDelete, 'Delete', undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'top'];
            ui.onClick = function () {
                emitter.notify(Event.DeletePresetFile);
            };
        })
            .addGroupEnd()
            .addPanelEnd()
            .addGroupEnd()
            .addGroup(Param.ButtonGroup, undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'top'];
            ui.orientation = 'row';
        })
            .addButton(Param.OK, undefined, undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'top'];
            ui.onClick = function () {
                update = true;
                updateSettings(newSettings);
                ui.window.close();
            };
        })
            .addButton(Param.Cancel, undefined, undefined, function (ui, emitter) {
            ui.alignment = ['fill', 'top'];
            ui.onClick = function () {
                ui.window.close();
            };
        })
            .addGroupEnd()
            .build();
        return update;
    }
    // effect
    var EFFECT_LIST = [];
    function initEffect() {
        for (var _i = 0, _a = app.effects; _i < _a.length; _i++) {
            var _b = _a[_i], displayName = _b.displayName, matchName = _b.matchName, category = _b.category;
            if (displayName && matchName && category) {
                var item = { type: Type.Effect, name: displayName, category: category, detail: matchName };
                EFFECT_LIST.push(item);
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
        scanFiles(SETTINGS.script, SCRIPT_RE, function (root, file) {
            if (root) {
                SCRIPT_LIST.push({ type: Type.Script, name: file.displayName, category: 'Script', detail: file.fsName.substr(root.fsName.length + 1), path: file.fsName });
            }
            else {
                SCRIPT_LIST.push({ type: Type.Script, name: file.displayName, category: 'Script', detail: file.displayName, path: file.fsName });
            }
        });
    }
    initScript();
    // preset
    var PRESET_LIST = [];
    var PRESET_RE = /\.ffx$/i;
    function initPreset() {
        PRESET_LIST = [];
        scanFiles(SETTINGS.preset, PRESET_RE, function (root, file) {
            if (root) {
                SCRIPT_LIST.push({ type: Type.Preset, name: file.displayName, category: 'Preset', detail: file.fsName.substr(root.fsName.length + 1), path: file.fsName });
            }
            else {
                SCRIPT_LIST.push({ type: Type.Preset, name: file.displayName, category: 'Preset', detail: file.displayName, path: file.fsName });
            }
        });
    }
    initPreset();
    // recent
    var SECTION_NAME = "@script/".concat(SCRIPT_NAME);
    var RECENT_KEY_NAME = 'recent items';
    var RECENT_ITEMS = loadRecentItems();
    var MAX_RECENT_ITEM = 30;
    function getRecentItems(clone) {
        if (clone === void 0) { clone = false; }
        return clone ? RECENT_ITEMS.slice() : RECENT_ITEMS;
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
        app.settings.saveSetting(SECTION_NAME, RECENT_KEY_NAME, Atarabi.JSON.stringify(RECENT_ITEMS));
    }
    function appendRecentItem(item) {
        for (var i = 0; i < RECENT_ITEMS.length; i++) {
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
    function applyEffect(effectMatchName, move) {
        if (move === void 0) { move = undefined; }
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return false;
        }
        var layers = filter(comp.selectedLayers.slice(), isAVLayer);
        if (!layers.length) {
            var activeLayer = Atarabi.layer.getActiveLayer();
            if (!isAVLayer(activeLayer)) {
                return false;
            }
            layers.push(activeLayer);
        }
        // check
        if (!layers[0].effect.canAddProperty(effectMatchName)) {
            alert("Unable to apply \"".concat(effectMatchName, "\""));
            return false;
        }
        try {
            app.beginUndoGroup("".concat(SCRIPT_NAME, ": Apply"));
            for (var _i = 0, layers_1 = layers; _i < layers_1.length; _i++) {
                var layer = layers_1[_i];
                var properties = layer.selectedProperties.slice();
                var selectedEffect = null;
                for (var _a = 0, properties_1 = properties; _a < properties_1.length; _a++) {
                    var property = properties_1[_a];
                    property.selected = false;
                    if (property.isEffect) {
                        selectedEffect = property;
                        break;
                    }
                }
                var effects = layer.effect;
                if (move === 'beginning') {
                    var newEffect = effects.addProperty(effectMatchName);
                    newEffect.moveTo(1);
                    effects(1).selected = true;
                }
                else if (move === 'end' || !selectedEffect) {
                    var newEffect = effects.addProperty(effectMatchName);
                    newEffect.selected = true;
                }
                else {
                    var newIndex = selectedEffect.propertyIndex;
                    var newEffect = effects.addProperty(effectMatchName);
                    newEffect.moveTo(newIndex + 1);
                    effects(newIndex + 1).selected = true;
                }
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
    function applyScript(item) {
        var file = new File(item.path);
        if (!(file instanceof File && file.exists)) {
            return false;
        }
        (function () {
            $.evalFile(file.absoluteURI);
        }).call($.global);
        return true;
    }
    function applyPreset(item) {
        var file = new File(item.path);
        if (!(file instanceof File && file.exists)) {
            return false;
        }
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return false;
        }
        var layers = comp.selectedLayers.slice();
        if (!layers.length) {
            return false;
        }
        try {
            app.beginUndoGroup("".concat(SCRIPT_NAME, ": Apply"));
            // deselect
            for (var _i = 0, layers_2 = layers; _i < layers_2.length; _i++) {
                var layer = layers_2[_i];
                layer.selected = false;
            }
            for (var _a = 0, layers_3 = layers; _a < layers_3.length; _a++) {
                var layer = layers_3[_a];
                layer.selected = true;
                layer.applyPreset(file);
                layer.selected = false;
            }
            // reselect
            for (var _b = 0, layers_4 = layers; _b < layers_4.length; _b++) {
                var layer = layers_4[_b];
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
    function apply(item, move) {
        if (move === void 0) { move = undefined; }
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
    var searcher = null;
    function initSearcher() {
        searcher = Atarabi.UI.FuzzySearch([].concat(EFFECT_LIST, SCRIPT_LIST, PRESET_LIST), ['name', 'detail', 'category'], {
            caseSensitive: false,
            sort: true,
            cache: true,
        });
    }
    initSearcher();
    // ui
    var builder = new Atarabi.UI.Builder(global instanceof Panel ? global : 'palette', SCRIPT_NAME, { resizeable: true }, function (win) {
        win.spacing = win.margins = 2;
        win.preferredSize = [300, 300];
    })
        .addEditText(Param.Search, undefined, undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.onChanging = Atarabi.app.debounce(function () {
            emitter.notify(Event.Search, ui.text);
        }, DEBOUNCE_TIME);
    })
        .addListBox(Param.ItemList, undefined, { numberOfColumns: 3, columnWidths: [150, 100, 50] }, function (ui, emitter) {
        ui.alignment = ['fill', 'fill'];
        ui.onDoubleClick = function () {
            var selection = ui.selection;
            if (!selection) {
                return;
            }
            apply(selection.item);
        };
        ui.addEventListener('mousedown', function (e) {
            var selection = ui.selection;
            if (!selection) {
                return;
            }
            // right click
            if (e.button === 2) {
                if (selection.item.type === Type.Effect) {
                    var index = Atarabi.UI.showContextMenu([{ text: 'Move To Beginning' }, { text: 'Move To End' }]);
                    if (index === 0) {
                        apply(selection.item, 'beginning');
                    }
                    else if (index === 1) {
                        apply(selection.item, 'end');
                    }
                }
            }
        });
        emitter.addEventListener(Event.Search, function (searchText) {
            if (searchText === SETTINGS_COMMAND) {
                if (buildSettingsUI()) {
                    initSearcher();
                }
                builder.set(Param.Search, '');
                emitter.notify(Event.Search, '');
                return;
            }
            var iItems = searchText ? searcher.search(searchText).slice(0, 50) : getRecentItems();
            ui.removeAll();
            for (var _i = 0, iItems_1 = iItems; _i < iItems_1.length; _i++) {
                var iItem = iItems_1[_i];
                try {
                    var item = ui.add('item', iItem.name);
                    item.subItems[0].text = iItem.category;
                    item.subItems[1].text = iItem.detail;
                    item.item = iItem;
                }
                catch (e) {
                    app.setTimeout(function () {
                        emitter.notify(Event.Search, searchText);
                    }, 500);
                    return;
                }
            }
        });
    })
        .build();
    builder.onInit(function (builder) {
        builder.notify(Event.Search, '');
    });
})(this);
