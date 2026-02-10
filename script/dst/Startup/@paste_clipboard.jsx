/**
 * @paste_clipboard v1.0.1
 *
 *      v1.0.1(2025/02/08) Fix importing sequence files
 */
(function () {
    /**********************************/
    var ENABLE_AT_IAMGE = true;
    /**********************************/
    var SCRIPT_NAME = '@paste_clipboard';
    var HOOK_SOLID = '@hook_solid';
    var ADD_SOLID = 'addSolid';
    var AT_IMAGE = 'Atarabi_image';
    var IMAGE_PARAM = 'Atarabi_image-0001';
    var MODE_PARAM = 'Atarabi_image-0007';
    var BLENDING_MODE_PARAM = 'Atarabi_image-0018';
    Atarabi.keyboard.hook({ code: 'V', altKey: true }, function (ctx) {
        var activeItem = app.project.activeItem;
        var comp = activeItem instanceof CompItem ? activeItem : null;
        var folder = activeItem instanceof FolderItem ? activeItem : null;
        if (Atarabi.API.isAdded('@svg', 'svgToShapeLayer')) {
            var types = Atarabi.clipboard.getTypes();
            var isSVG = false;
            for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
                var type = types_1[_i];
                if (type.indexOf('Scalable Vector Graphics') >= 0 || type.indexOf('com.adobe.illustrator.svg') >= 0) {
                    isSVG = true;
                    break;
                }
            }
            if (isSVG) {
                var text = Atarabi.clipboard.getText();
                if (startsWith(text, '<?xml')) {
                    try {
                        app.beginUndoGroup(SCRIPT_NAME);
                        var layer = comp.selectedLayers[0];
                        Atarabi.API.invoke('@svg', 'svgToShapeLayer', [text, layer instanceof ShapeLayer ? layer : null]);
                    }
                    catch (e) {
                        alert(e);
                    }
                    finally {
                        app.endUndoGroup();
                    }
                    return true;
                }
            }
        }
        var files = Atarabi.clipboard.getFiles();
        if (files.length) {
            var targets = [];
            var items = collectFootageItems();
            for (var _a = 0, files_1 = files; _a < files_1.length; _a++) {
                var file = files_1[_a];
                if (!file.exists) {
                    continue;
                }
                if (file instanceof File) {
                    if (items.hasOwnProperty(file.absoluteURI)) {
                        if (comp) {
                            targets.push({ item: items[file.absoluteURI] });
                        }
                        continue;
                    }
                    if (/\.ffx$/i.test(file.displayName)) {
                        if (comp) {
                            targets.push({ ffx: file });
                        }
                        continue;
                    }
                    var options = new ImportOptions(file);
                    if (options.canImportAs(ImportAsType.COMP) || options.canImportAs(ImportAsType.COMP_CROPPED_LAYERS) || options.canImportAs(ImportAsType.FOOTAGE) || options.canImportAs(ImportAsType.FOOTAGE)) {
                        targets.push({ options: options });
                    }
                }
                else {
                    var files_3 = sortFilesInFolder(file);
                    for (var _b = 0, files_2 = files_3; _b < files_2.length; _b++) {
                        var _c = files_2[_b], file_1 = _c.file, sequence = _c.sequence;
                        if (items.hasOwnProperty(file_1.absoluteURI)) {
                            if (comp) {
                                targets.push({ item: items[file_1.absoluteURI] });
                            }
                            continue;
                        }
                        var options = new ImportOptions(file_1);
                        if (options.canImportAs(ImportAsType.COMP) || options.canImportAs(ImportAsType.COMP_CROPPED_LAYERS) || options.canImportAs(ImportAsType.FOOTAGE) || options.canImportAs(ImportAsType.FOOTAGE)) {
                            if (sequence) {
                                options.sequence = true;
                            }
                            targets.push({ options: options });
                        }
                    }
                }
            }
            if (targets.length) {
                try {
                    app.beginUndoGroup(SCRIPT_NAME);
                    var topLayer = (function () {
                        if (!comp) {
                            return null;
                        }
                        var layers = comp.selectedLayers.slice();
                        if (!layers.length) {
                            return null;
                        }
                        layers.sort(function (lhs, rhs) {
                            return lhs.index - rhs.index;
                        });
                        return layers[0];
                    })();
                    for (var _d = 0, targets_1 = targets; _d < targets_1.length; _d++) {
                        var _e = targets_1[_d], ffx = _e.ffx, item = _e.item, options = _e.options;
                        var layer = null;
                        if (ffx) {
                            if (comp) {
                                var layer_1 = comp.selectedLayers[0];
                                if (layer_1) {
                                    layer_1.applyPreset(ffx);
                                }
                            }
                        }
                        else if (item) {
                            if (comp) {
                                layer = comp.layers.add(item);
                            }
                        }
                        else if (options) {
                            var item_1 = app.project.importFile(options);
                            if (comp) {
                                if (item_1 instanceof CompItem || item_1 instanceof FootageItem) {
                                    layer = comp.layers.add(item_1);
                                }
                            }
                            else if (folder) {
                                item_1.parentFolder = folder;
                            }
                        }
                        if (layer && comp) {
                            layer.startTime = comp.time;
                            if (topLayer) {
                                layer.moveBefore(topLayer);
                            }
                            topLayer = layer;
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
        }
        if (ENABLE_AT_IAMGE) {
            var info = Atarabi.clipboard.getImageInfo();
            if (info) {
                try {
                    app.beginUndoGroup(SCRIPT_NAME);
                    if (!applyToProperty(comp) && !applyToLayer(comp)) {
                        var name = "Clipboard ".concat(formatDate(new Date));
                        var targetComp = comp;
                        if (!targetComp) {
                            targetComp = app.project.items.addComp(name, info.width, info.height, 1, 10, 30);
                            targetComp.openInViewer();
                        }
                        var solidLayer = addSolid(targetComp, info.width, info.height);
                        solidLayer.name = name;
                        solidLayer.selected = false;
                        var effect = solidLayer.effect.addProperty(AT_IMAGE);
                        setImageFromClipboard(effect);
                        effect(BLENDING_MODE_PARAM).setValue(1 /* BlendingMode.None */);
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
        }
        return false;
    });
    function startsWith(str, search, position) {
        if (position === void 0) { position = 0; }
        return str.substr(position, search.length) === search;
    }
    function isAVLayer(layer) {
        return layer instanceof AVLayer || layer instanceof TextLayer || layer instanceof ShapeLayer;
    }
    function formatDate(date) {
        return "".concat(date.getFullYear(), "/").concat(zfill(date.getMonth() + 1), "/").concat(zfill(date.getDate()), " ").concat(zfill(date.getHours()), ":").concat(zfill(date.getMinutes()), ":").concat(zfill(date.getSeconds()));
    }
    function zfill(n) {
        var s = "0".concat(n);
        return "0".concat(n).substr(s.length - 2);
    }
    function collectFootageItems() {
        var items = {};
        var project = app.project;
        for (var i = 1; i <= project.numItems; i++) {
            var item = project.item(i);
            if (item instanceof FootageItem && item.file) {
                items[item.file.absoluteURI] = item;
            }
        }
        return items;
    }
    function addSolid(comp, width, height) {
        return Atarabi.API.invoke(HOOK_SOLID, ADD_SOLID, [comp, width, height], function (comp, width, height) { return comp.layers.addSolid([1, 1, 1], "Solid (".concat(width, "x").concat(height, ")"), width, height, 1); });
    }
    function setImageFromClipboard(effect, mode) {
        if (mode === void 0) { mode = 0 /* Mode.None */; }
        Atarabi.at.setImageFromClipboard(effect(IMAGE_PARAM));
        if (mode != 0 /* Mode.None */) {
            effect(MODE_PARAM).setValue(mode);
        }
    }
    function setImageFromFile(effect, file, mode) {
        if (mode === void 0) { mode = 0 /* Mode.None */; }
        Atarabi.at.setImageFromFile(effect(IMAGE_PARAM), file);
        if (mode != 0 /* Mode.None */) {
            effect(MODE_PARAM).setValue(mode);
        }
    }
    function applyToProperty(comp, file) {
        if (file === void 0) { file = null; }
        if (!comp) {
            return false;
        }
        var effect = null;
        for (var _i = 0, _a = comp.selectedProperties.slice(); _i < _a.length; _i++) {
            var property = _a[_i];
            if (property.isEffect && property.matchName === AT_IMAGE) {
                effect = property;
                break;
            }
        }
        if (!effect) {
            return false;
        }
        if (file) {
            setImageFromFile(effect, file);
        }
        else {
            setImageFromClipboard(effect);
        }
        return true;
    }
    function applyToLayer(comp, file) {
        if (file === void 0) { file = null; }
        if (!comp) {
            return false;
        }
        var layer = comp.selectedLayers[0];
        if (!isAVLayer(layer)) {
            return false;
        }
        var effect = layer.effect.addProperty(AT_IMAGE);
        if (file) {
            setImageFromFile(effect, file, 2 /* Mode.Transform */);
        }
        else {
            setImageFromClipboard(effect, 2 /* Mode.Transform */);
        }
        return true;
    }
    var MOVIE_EXTS = { 'mp4': true, 'mov': true, 'avi': true, 'mkv': true, 'wmv': true, 'flv': true, 'webm': true, 'm4v': true, 'mpg': true, 'mpeg': true, 'ts': true };
    var AUDIO_EXTS = { 'wav': true, 'aiff': true, 'aif': true, 'flac': true, 'm4a': true, 'mp3': true, 'aac': true, 'ogg': true, 'opus': true, 'wma': true, };
    function sortFilesInFolder(folder) {
        var re = /^(.*?)(\d+)\.(\w+)$/i;
        var store = {};
        for (var _i = 0, _a = folder.getFiles(); _i < _a.length; _i++) {
            var file = _a[_i];
            if (file instanceof Folder) {
                continue;
            }
            var m = file.displayName.match(re);
            if (m) {
                var ext = m[3].toLowerCase();
                if (MOVIE_EXTS.hasOwnProperty(ext) || AUDIO_EXTS.hasOwnProperty(ext)) {
                    store[file.displayName] = { file: file, index: null, count: null };
                }
                else {
                    var index = parseInt(m[2], 10);
                    var key = "".concat(m[1], "/").concat(m[3]);
                    if (store.hasOwnProperty(key)) {
                        if (index < store[key].index) {
                            store[key] = { file: file, index: index, count: store[key].count + 1 };
                        }
                        else {
                            store[key].count++;
                        }
                    }
                    else {
                        store[key] = { file: file, index: index, count: 1 };
                    }
                }
            }
            else {
                store[file.displayName] = { file: file, index: null, count: null };
            }
        }
        var result = [];
        for (var key in store) {
            if (store.hasOwnProperty(key)) {
                if (typeof store[key].index === 'number' && store[key].count > 1) {
                    result.push({ file: store[key].file, sequence: true });
                }
                else {
                    result.push({ file: store[key].file, sequence: false });
                }
            }
        }
        return result;
    }
})();
