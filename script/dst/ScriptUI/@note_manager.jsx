/**
 * @note_manager v1.0.0
 *
 *      v1.0.0(2026/02/07) Initial release
 */
(function (global) {
    var SCRIPT_NAME = '@note_manager';
    var Param = {
        ToolGroup: 'Tool Group',
        Search: 'Search',
        Checked: 'Checked',
        Refresh: 'Refresh',
        List: 'List',
        Body: 'Body',
    };
    var Event = {
        Refresh: 'Refresh',
        Update: 'Update',
    };
    /*
    *   Utility
    */
    var debounce = function (callback, delay) {
        var timer = -1;
        return function () {
            app.cancelTimeout(timer);
            timer = app.setTimeout(callback, delay);
        };
    };
    var filter = function (arr, cond) {
        var reuslt = [];
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var item = arr_1[_i];
            if (cond(item)) {
                reuslt.push(item);
            }
        }
        return reuslt;
    };
    var isAVLayer = function (layer) {
        return layer instanceof AVLayer || layer instanceof ShapeLayer || layer instanceof TextLayer;
    };
    var forEachComp = function (fn) {
        for (var i = 1, len = app.project.numItems; i <= len; i++) {
            var item = app.project.item(i);
            if (item instanceof CompItem) {
                fn(item);
            }
        }
    };
    var deselectLayers = function (comp) {
        var layers = comp.selectedLayers.slice();
        for (var _i = 0, layers_1 = layers; _i < layers_1.length; _i++) {
            var layer = layers_1[_i];
            layer.selected = false;
        }
    };
    var deselectProperties = function (layer) {
        var properties = layer.selectedProperties.slice();
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var property = properties_1[_i];
            property.selected = false;
        }
    };
    var noteInfos = [];
    var searcher = Atarabi.UI.FuzzySearch(noteInfos, ['value.subject', 'value.body'], { caseSensitive: false });
    var AT_NOTE_MATCH_NAME = 'Atarabi_note';
    var AT_NOTE_PROPERTY_MATCH_NAME = 'Atarabi_note-0001';
    var validateNoteInfo = function (info) {
        if (isValid(info.effect.instance)) {
            return true;
        }
        if (isValid(info.layer.instance)) {
            var effects = info.layer.instance.effect;
            if (info.effect.index > effects.numProperties) {
                return false;
            }
            var effect = effects(info.effect.index);
            if (effect.matchName === AT_NOTE_MATCH_NAME && effect.name === info.effect.name) {
                info.effect.instance = effect;
                return true;
            }
        }
        return false;
    };
    var refreshNoteInfos = function () {
        noteInfos.splice(0);
        forEachComp(function (comp) {
            for (var i = 1, len = comp.numLayers; i <= len; i++) {
                var layer = comp.layer(i);
                if (!isAVLayer(layer)) {
                    continue;
                }
                var effects = layer.effect;
                for (var j = 1, len_1 = effects.numProperties; j <= len_1; j++) {
                    var effect = effects(j);
                    if (effect.matchName !== AT_NOTE_MATCH_NAME) {
                        continue;
                    }
                    var property = effect(AT_NOTE_PROPERTY_MATCH_NAME);
                    var numKeys = property.numKeys;
                    if (numKeys > 0) {
                        for (var k = 1; k <= numKeys; k++) {
                            var time = property.keyTime(k);
                            var value = Atarabi.at.getNoteValueAtKey(property, k);
                            noteInfos.push({
                                comp: {
                                    instance: comp,
                                    name: comp.name,
                                },
                                layer: {
                                    instance: layer,
                                    name: layer.name,
                                },
                                effect: {
                                    instance: effect,
                                    name: effect.name,
                                    index: effect.propertyIndex,
                                },
                                time: time,
                                key: k,
                                value: value,
                            });
                        }
                    }
                    else {
                        var value = Atarabi.at.getNoteValue(property);
                        noteInfos.push({
                            comp: {
                                instance: comp,
                                name: comp.name,
                            },
                            layer: {
                                instance: layer,
                                name: layer.name,
                            },
                            effect: {
                                instance: effect,
                                name: effect.name,
                                index: effect.propertyIndex,
                            },
                            value: value,
                        });
                    }
                }
            }
        });
    };
    var builder = new Atarabi.UI.Builder(global instanceof Panel ? global : 'palette', SCRIPT_NAME, { resizeable: true }, function (win) {
        win.spacing = 2;
        win.margins = 3;
        win.preferredSize = [640, 300];
    })
        .addGroup(Param.ToolGroup, undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
    })
        .addEditText(Param.Search, undefined, undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'fill'];
        ui.onChanging = debounce(function () {
            emitter.notify(Event.Refresh);
        }, 200);
    })
        .addCheckbox(Param.Checked, true, '', undefined, function (ui, emitter) {
        ui.alignment = ['right', 'top'];
        ui.preferredSize[0] = 20;
        ui.justify = 'center';
        ui.onClick = function () {
            emitter.notify(Event.Refresh, false);
        };
    })
        .addButton(Param.Refresh, undefined, undefined, function (ui, emitter) {
        ui.alignment = ['right', 'top'];
        ui.preferredSize[0] = 70;
        ui.onClick = function () {
            emitter.notify(Event.Refresh, true);
        };
    })
        .addGroupEnd()
        .addListBox(Param.List, undefined, { showHeaders: true, numberOfColumns: 5 /* Column.Total */, columnTitles: ['Subject', 'Body', 'Comp', 'Layer', 'Effect'], columnWidths: [120, 120, 120, 120, 120] }, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.minimumSize[1] = 80;
        ui.preferredSize[1] = 100;
        emitter.addEventListener(Event.Refresh, function (force) {
            if (force === void 0) { force = false; }
            if (force) {
                refreshNoteInfos();
            }
            var searchText = builder.get(Param.Search);
            var infos = searchText ? searcher.search(searchText) : noteInfos;
            var isChecked = builder.get(Param.Checked);
            if (isChecked) {
                infos = filter(infos, function (info) { return info.value.checked; });
            }
            ui.removeAll();
            for (var _i = 0, infos_1 = infos; _i < infos_1.length; _i++) {
                var info = infos_1[_i];
                var item = ui.add('item', info.value.subject);
                item.subItems[0 /* Column.Body */].text = info.value.body.slice(0, 20).replace(/\n/g, ' ');
                item.subItems[1 /* Column.Comp */].text = info.comp.name;
                item.subItems[2 /* Column.Layer */].text = info.layer.name;
                item.subItems[3 /* Column.Effect */].text = info.effect.name;
                item.info = info;
            }
        });
        ui.onChange = function () {
            var selection = ui.selection;
            if (!selection) {
                emitter.notify(Event.Update, '');
                return;
            }
            emitter.notify(Event.Update, selection.info.value.body);
        };
        ui.onDoubleClick = function () {
            var selection = ui.selection;
            if (!selection) {
                return;
            }
            var info = selection.info;
            if (!validateNoteInfo(info)) {
                alert('invalid: Please refresh');
                return;
            }
            info.comp.instance.openInViewer();
            if (typeof info.time === 'number') {
                info.comp.instance.time = info.time;
            }
            deselectLayers(info.comp.instance);
            info.layer.instance.selected = true;
            deselectProperties(info.layer.instance);
            info.effect.instance.selected = true;
        };
    })
        .addEditText(Param.Body, undefined, { multiline: true }, function (ui, emitter) {
        ui.alignment = ['fill', 'fill'];
        ui.minimumSize[1] = 100;
        ui.preferredSize[1] = 120;
        emitter.addEventListener(Event.Update, function (body) {
            ui.text = body;
        });
    })
        .build();
})(this);
