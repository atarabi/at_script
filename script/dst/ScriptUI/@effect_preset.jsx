/**
 * @effect_preset v1.1.0
 *
 *      v1.1.0(2024/11/14)  Reduce debounce time
 *      v1.0.0(2023/09/16)
 */
(function (global) {
    var SCRIPT_NAME = '@effect_preset';
    var DEBOUNCE_TIME = 100; // ms
    var Param;
    (function (Param) {
        Param["ToolGroup"] = "Tool";
        Param["Search"] = "Search";
        Param["Add"] = "Add";
        Param["Remove"] = "Remove";
        Param["Up"] = "Up";
        Param["Down"] = "Down";
        Param["PresetList"] = "PresetList";
    })(Param || (Param = {}));
    var Event;
    (function (Event) {
        Event["SearchChanging"] = "SearchChanging";
        Event["Add"] = "Add";
        Event["Remove"] = "Remove";
        Event["Up"] = "Up";
        Event["Down"] = "Down";
        Event["Refresh"] = "Refresh";
        Event["Save"] = "Save";
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
    function map(array, fn) {
        var result = [];
        for (var i = 0; i < array.length; i++) {
            result.push(fn(array[i], i, array));
        }
        return result;
    }
    var PRESET_FOLDER = new Folder("".concat(Folder.userData.absoluteURI, "/Atarabi/@scripts/").concat(SCRIPT_NAME));
    var PRESET_FILE = new File("".concat(PRESET_FOLDER.absoluteURI, "/preset.json"));
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
    function loadPreset(file) {
        var preset = { type: '@scripts/@effect_preset', version: 1, presets: [], createdAt: new Date().toLocaleString(), updatedAt: new Date().toLocaleString() };
        if (file.exists) {
            try {
                file.encoding = 'utf-8';
                if (!file.open('r')) {
                    return preset;
                }
                var data = file.read();
                file.close();
                preset = Atarabi.JSON.parse(data);
            }
            catch (e) {
                alert(e);
            }
        }
        return preset;
    }
    function savePreset(file, preset) {
        createFolder(file.parent);
        file.encoding = 'utf-8';
        if (!file.open('w')) {
            alert("Unable to open ".concat(file.displayName));
            return;
        }
        file.write(Atarabi.JSON.stringify(preset, undefined, 2));
        file.close();
    }
    var PRESET = loadPreset(PRESET_FILE);
    var searcher = Atarabi.UI.FuzzySearch(PRESET.presets, ['name', 'description'], {
        caseSensitive: false,
        sort: true,
    });
    function isAVLayer(layer) {
        return layer instanceof ShapeLayer || layer instanceof TextLayer || layer instanceof AVLayer;
    }
    // black list
    var INVALID_CUSTOM_VALUES = {
        'ADBE MESH WARP-0004': true,
        'ADBE RESHAPE-0006': true,
    };
    function isValidProperty(property) {
        switch (property.propertyValueType) {
            case PropertyValueType.ThreeD_SPATIAL:
            case PropertyValueType.ThreeD:
            case PropertyValueType.TwoD_SPATIAL:
            case PropertyValueType.TwoD:
            case PropertyValueType.OneD:
            case PropertyValueType.COLOR:
                return true;
            case PropertyValueType.CUSTOM_VALUE:
                return INVALID_CUSTOM_VALUES[property.matchName] ? false : true;
        }
        return false;
    }
    function transformValue(layer, property, value, forward) {
        if (forward === void 0) { forward = true; }
        switch (property.propertyValueType) {
            case PropertyValueType.ThreeD_SPATIAL:
                if (forward) {
                    return [value[0] / layer.width * 100, value[1] / layer.height * 100, value[2] / layer.height * 100];
                }
                else {
                    return [value[0] * layer.width / 100, value[1] * layer.height / 100, value[2] * layer.height / 100];
                }
            case PropertyValueType.TwoD_SPATIAL:
                if (forward) {
                    return [value[0] / layer.width * 100, value[1] / layer.height * 100];
                }
                else {
                    return [value[0] * layer.width / 100, value[1] * layer.height / 100];
                }
        }
        return value;
    }
    function createPreset() {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return null;
        }
        var layers = comp.selectedLayers.slice();
        if (!layers.length) {
            return null;
        }
        var layer = layers[0];
        if (!isAVLayer(layer)) {
            return null;
        }
        var effectItems = [];
        var effects = layer.effect;
        for (var i = 1; i <= effects.numProperties; i++) {
            var effect = effects(i);
            if (!effect.selected) {
                continue;
            }
            var effectItem = { name: effect.name, matchName: effect.matchName, enabled: effect.enabled };
            for (var j = 1; j <= effect.numProperties; j++) {
                var property = effect(j);
                var expression = '';
                if (property.canSetExpression && property.expressionEnabled) {
                    expression = Atarabi.property.getExpression(property);
                }
                var value = null, values = null;
                if (isValidProperty(property)) {
                    if (property.numKeys > 0) {
                        values = [];
                        for (var k = 1; k <= property.numKeys; k++) {
                            var time = property.keyTime(k) - layer.time;
                            var value_1 = transformValue(layer, property, Atarabi.property.getValueAtKey(property, k));
                            var params = Atarabi.property.getKeyParameters(property, k);
                            values.push({ time: time, value: value_1, params: params });
                        }
                    }
                    else {
                        if (Atarabi.property.isModified(property)) {
                            value = transformValue(layer, property, Atarabi.property.getValue(property, { preExpression: true }));
                        }
                    }
                }
                if (expression || value != null || values != null) {
                    var propertyItem = { name: property.name, matchName: property.matchName };
                    if (expression) {
                        propertyItem.expression = expression;
                    }
                    if (value !== null) {
                        propertyItem.value = value;
                    }
                    if (values !== null) {
                        propertyItem.values = values;
                    }
                    if (!effectItem.properties) {
                        effectItem.properties = [];
                    }
                    effectItem.properties.push(propertyItem);
                }
            }
            effectItems.push(effectItem);
        }
        if (!effectItems.length) {
            return null;
        }
        var name = map(effectItems, function (item) { return item.name; }).join(' / ');
        do {
            name = prompt('Input a preset name', name, SCRIPT_NAME);
            if (name === null) {
                return null;
            }
        } while (!name);
        var description = prompt('Input a description', '', SCRIPT_NAME);
        if (description === null) {
            return null;
        }
        return { name: name, description: description, effects: effectItems };
    }
    function deselectLayers(comp) {
        var layers = comp.selectedLayers.slice();
        for (var _i = 0, layers_1 = layers; _i < layers_1.length; _i++) {
            var layer = layers_1[_i];
            layer.selected = false;
        }
    }
    function applyPropertyItems(layer, effect, propertyItem) {
        var property = effect(propertyItem.matchName);
        if (propertyItem.value != null) {
            Atarabi.property.setValue(property, transformValue(layer, property, propertyItem.value, false));
        }
        if (propertyItem.values != null) {
            for (var _i = 0, _a = propertyItem.values; _i < _a.length; _i++) {
                var _b = _a[_i], time = _b.time, value = _b.value;
                Atarabi.property.setValue(property, transformValue(layer, property, value, false), { time: time + layer.time, key: true });
            }
            for (var k = 0, total = propertyItem.values.length; k < total; k++) {
                var value = propertyItem.values[k];
                if (value.params) {
                    Atarabi.property.setKeyParameters(property, k + 1, value.params);
                }
            }
        }
        if (propertyItem.expression) {
            Atarabi.property.setExpression(property, propertyItem.expression);
        }
    }
    function applyPreset(preset) {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return;
        }
        var selectedLayers = comp.selectedLayers.slice();
        var layers = filter(selectedLayers, isAVLayer);
        if (!layers.length) {
            var activeLayer = Atarabi.layer.getActiveLayer();
            if (!isAVLayer(activeLayer)) {
                return;
            }
            layers.push(activeLayer);
        }
        try {
            app.beginUndoGroup("".concat(SCRIPT_NAME, ": Apply \"").concat(preset.name, "\""));
            for (var _i = 0, layers_2 = layers; _i < layers_2.length; _i++) {
                var layer = layers_2[_i];
                deselectLayers(comp);
                layer.selected = true;
                var effects = layer.effect;
                for (var _a = 0, _b = preset.effects; _a < _b.length; _a++) {
                    var effectItem = _b[_a];
                    if (!effects.canAddProperty(effectItem.matchName)) {
                        continue;
                    }
                    var effect = effects.addProperty(effectItem.matchName);
                    effect.name = effectItem.name;
                    effect.enabled = effectItem.enabled;
                    if (effectItem.properties) {
                        for (var _c = 0, _d = effectItem.properties; _c < _d.length; _c++) {
                            var propertyItem = _d[_c];
                            try {
                                applyPropertyItems(layer, effect, propertyItem);
                            }
                            catch (e) {
                                // pass
                            }
                        }
                    }
                }
            }
        }
        catch (e) {
            alert(e);
        }
        finally {
            for (var _e = 0, selectedLayers_1 = selectedLayers; _e < selectedLayers_1.length; _e++) {
                var layer = selectedLayers_1[_e];
                layer.selected = true;
            }
            app.endUndoGroup();
        }
    }
    ;
    var builder = new Atarabi.UI.Builder(global instanceof Panel ? global : 'palette', SCRIPT_NAME, { resizeable: true }, function (win) {
        win.spacing = win.margins = 2;
        win.preferredSize = [300, 300];
    })
        .addGroup(Param.ToolGroup, undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.spacing = ui.margins = 0;
        ui.orientation = 'row';
    })
        .addEditText(Param.Search, undefined, undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        var refresh = Atarabi.app.debounce(function () {
            emitter.notify(Event.Refresh);
        }, DEBOUNCE_TIME);
        ui.onChanging = function () {
            emitter.notify(Event.SearchChanging, ui.text ? true : false);
            refresh();
        };
    })
        .addButton(Param.Add, '＋', undefined, function (ui, emitter) {
        ui.alignment = ['right', 'fill'];
        ui.preferredSize = [25, 18];
        ui.onClick = function () {
            var newItem = createPreset();
            if (!newItem) {
                return;
            }
            emitter.notify(Event.Add, newItem);
        };
    })
        .addButton(Param.Remove, '－', undefined, function (ui, emitter) {
        ui.alignment = ['right', 'fill'];
        ui.preferredSize = [25, 18];
        ui.onClick = function () {
            emitter.notify(Event.Remove);
        };
    })
        .addButton(Param.Up, '↑', undefined, function (ui, emitter) {
        ui.alignment = ['right', 'fill'];
        ui.preferredSize = [25, 18];
        ui.onClick = function () {
            emitter.notify(Event.Up);
        };
        emitter.addEventListener(Event.SearchChanging, function (isInput) {
            ui.enabled = !isInput;
        });
    })
        .addButton(Param.Down, '↓', undefined, function (ui, emitter) {
        ui.alignment = ['right', 'fill'];
        ui.preferredSize = [25, 18];
        ui.onClick = function () {
            emitter.notify(Event.Down);
        };
        emitter.addEventListener(Event.SearchChanging, function (isInput) {
            ui.enabled = !isInput;
        });
    })
        .addGroupEnd()
        .addListBox(Param.PresetList, undefined, { numberOfColumns: 2, columnWidths: [150, 200], }, function (ui, emitter) {
        ui.alignment = ['fill', 'fill'];
        ui.onDoubleClick = function () {
            var selection = ui.selection;
            if (!selection) {
                return;
            }
            applyPreset(selection.item);
        };
        ui.addEventListener('mousedown', function (e) {
            var selection = ui.selection;
            if (!selection) {
                return;
            }
            if (e.button === 2) {
                var index = Atarabi.UI.showContextMenu([{ text: 'Rename' }, { text: 'Rewrite Description' }, { text: 'Remove' }]);
                if (index === 0) {
                    var newName = prompt('Input a preset name', selection.item.name, SCRIPT_NAME);
                    if (newName) {
                        selection.text = selection.item.name = newName;
                        emitter.notify(Event.Save);
                        ui.notify('onDraw');
                    }
                }
                else if (index === 1) {
                    var newDescription = prompt('Input a description', selection.item.description, SCRIPT_NAME);
                    if (newDescription != null) {
                        selection.subItems[0].text = selection.item.description = newDescription;
                        emitter.notify(Event.Save);
                        ui.notify('onDraw');
                    }
                }
                else if (index === 2) {
                    emitter.notify(Event.Remove);
                }
            }
        });
        emitter.addEventListener(Event.Add, function (newItem) {
            PRESET.presets.unshift(newItem);
            emitter.notify(Event.Save);
            emitter.notify(Event.Refresh);
        });
        emitter.addEventListener(Event.Remove, function () {
            var selection = ui.selection;
            if (!selection) {
                return;
            }
            if (!confirm("Remove \"".concat(selection.text, "\"?"))) {
                return;
            }
            var item = selection.item;
            var index = -1;
            for (var i = 0; i < PRESET.presets.length; i++) {
                var preset = PRESET.presets[i];
                if (preset === item) {
                    index = i;
                    break;
                }
            }
            if (index >= 0) {
                PRESET.presets.splice(index, 1);
                emitter.notify(Event.Save);
                emitter.notify(Event.Refresh);
            }
        });
        var swapItem = function (n, m) {
            var nItem = PRESET.presets[n];
            var mItem = PRESET.presets[m];
            var nListItem = ui.items[n];
            var mListItem = ui.items[m];
            PRESET.presets[n] = nListItem.item = mItem;
            PRESET.presets[m] = mListItem.item = nItem;
            nListItem.text = mItem.name;
            nListItem.subItems[0].text = mItem.description;
            mListItem.text = nItem.name;
            mListItem.subItems[0].text = nItem.description;
            emitter.notify(Event.Save);
            ui.selection = m;
            ui.notify('onDraw');
        };
        emitter.addEventListener(Event.Up, function () {
            var selection = ui.selection;
            if (!selection) {
                return;
            }
            var index = selection.index;
            if (index <= 0) {
                return;
            }
            swapItem(index, index - 1);
        });
        emitter.addEventListener(Event.Down, function () {
            var selection = ui.selection;
            if (!selection) {
                return;
            }
            var index = selection.index;
            if (index + 1 >= PRESET.presets.length) {
                return;
            }
            swapItem(index, index + 1);
        });
        emitter.addEventListener(Event.Refresh, function (searchText) {
            searchText = typeof searchText === 'string' ? searchText : builder.get(Param.Search);
            var presets = searcher.search(searchText);
            ui.removeAll();
            for (var _i = 0, presets_1 = presets; _i < presets_1.length; _i++) {
                var preset = presets_1[_i];
                try {
                    var item = ui.add('item', preset.name);
                    item.subItems[0].text = preset.description;
                    item.item = preset;
                }
                catch (e) {
                    app.setTimeout(function () {
                        emitter.notify(Event.Refresh, searchText);
                    }, 500);
                    return;
                }
            }
        });
    })
        .addEventListener(Event.Save, function () {
        PRESET.updatedAt = new Date().toLocaleString();
        savePreset(PRESET_FILE, PRESET);
    })
        .build();
    builder.onInit(function (builder) {
        builder.notify(Event.Refresh, '');
    });
})(this);
