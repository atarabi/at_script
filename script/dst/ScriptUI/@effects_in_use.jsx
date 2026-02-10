/**
 * @effects_in_use v1.0.1
 *
 *      v1.0.1(2025/04/02)  Switch to Types-for-Adobe
 *      v1.0.0(2023/12/05)
 */
(function (global) {
    var SCRIPT_NAME = '@effects_in_use';
    var Param;
    (function (Param) {
        Param["Scan"] = "Scan";
        Param["EffectList"] = "EffectList";
        Param["InstanceList"] = "InstanceList";
    })(Param || (Param = {}));
    var Event;
    (function (Event) {
        Event["Scan"] = "Scan";
        Event["UpdateInstance"] = "UpdateInstance";
    })(Event || (Event = {}));
    /*
    *   Utility
    */
    function isAVLayer(layer) {
        return layer instanceof ShapeLayer || layer instanceof TextLayer || layer instanceof AVLayer;
    }
    var EFFECT_MAP = {};
    for (var _i = 0, _a = app.effects; _i < _a.length; _i++) {
        var _b = _a[_i], displayName = _b.displayName, matchName = _b.matchName, category = _b.category;
        if (displayName && matchName && category) {
            var item = { displayName: displayName, matchName: matchName, category: category };
            EFFECT_MAP[matchName] = item;
        }
    }
    var effectList = {};
    function updateEffectList() {
        effectList = {};
        Atarabi.UI.progress('Scanning..', app.project.numItems, function (ctx) {
            var item = app.project.item(ctx.index + 1);
            if (item instanceof CompItem) {
                for (var j = 1; j <= item.numLayers; j++) {
                    var layer = item.layer(j);
                    if (isAVLayer(layer)) {
                        for (var k = 1; k <= layer.effect.numProperties; k++) {
                            var effect = layer.effect(k);
                            if (!effectList[effect.matchName]) {
                                effectList[effect.matchName] = [];
                            }
                            effectList[effect.matchName].push({ layer: layer, name: effect.name, enabled: effect.enabled });
                        }
                    }
                }
            }
        });
        var effectArray = [];
        for (var matchName in effectList) {
            effectArray.push({ matchName: matchName, number: effectList[matchName].length });
        }
        effectArray.sort(function (lhs, rhs) {
            return rhs.number - lhs.number;
        });
        return effectArray;
    }
    function isValidInstanceItem(item) {
        return isValid(item.layer) && item.layer.effect(item.name) != null;
    }
    var builder = new Atarabi.UI.Builder(global instanceof Panel ? global : 'palette', SCRIPT_NAME, { resizeable: true }, function (win) {
        win.spacing = win.margins = 2;
        win.preferredSize = [400, 300];
    })
        .addButton(Param.Scan, undefined, undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.onClick = function () {
            emitter.notify(Event.Scan);
        };
    })
        .addListBox(Param.EffectList, undefined, { numberOfColumns: 3, showHeaders: true, columnWidths: [150, 150, 50], columnTitles: ['Name', 'Match Name', 'Number'] }, function (ui, emitter) {
        ui.alignment = ['fill', 'fill'];
        emitter.addEventListener(Event.Scan, function () {
            var list = updateEffectList();
            ui.removeAll();
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var _a = list_1[_i], matchName = _a.matchName, number = _a.number;
                if (EFFECT_MAP[matchName]) {
                    var item = ui.add('item', EFFECT_MAP[matchName].displayName);
                    item.subItems[0].text = matchName;
                    item.subItems[1].text = "".concat(number);
                    item.item = EFFECT_MAP[matchName];
                }
            }
            emitter.notify(Event.UpdateInstance, null);
        });
        ui.onChange = function () {
            var selection = ui.selection;
            if (selection) {
                emitter.notify(Event.UpdateInstance, selection.item);
            }
        };
    })
        .addListBox(Param.InstanceList, undefined, { numberOfColumns: 3, showHeaders: true, columnWidths: [100, 100, 100], columnTitles: ['Comp', 'Layer', 'Effect'] }, function (ui, emitter) {
        ui.alignment = ['fill', 'fill'];
        emitter.addEventListener(Event.UpdateInstance, function (effectItem) {
            ui.removeAll();
            if (!effectItem) {
                return;
            }
            var list = effectList[effectItem.matchName];
            for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                var instance = list_2[_i];
                if (!isValidInstanceItem(instance)) {
                    continue;
                }
                var item = ui.add('item', instance.layer.containingComp.name);
                item.checked = instance.enabled;
                item.subItems[0].text = instance.layer.name;
                item.subItems[1].text = instance.name;
                item.item = instance;
            }
            ui.columns.preferredWidths = [100, 100, 100];
        });
        ui.onDoubleClick = function () {
            var selection = ui.selection;
            if (!selection) {
                return;
            }
            var item = selection.item;
            if (!isValidInstanceItem(item)) {
                return;
            }
            try {
                app.beginUndoGroup("".concat(SCRIPT_NAME, ": Focus"));
                var layer = item.layer;
                var comp = layer.containingComp;
                comp.openInViewer();
                if (!layer.locked) {
                    for (var _i = 0, _a = comp.selectedLayers.slice(); _i < _a.length; _i++) {
                        var layer_1 = _a[_i];
                        layer_1.selected = false;
                    }
                    layer.selected = true;
                    layer.effect(item.name).selected = true;
                }
            }
            catch (e) {
                alert(e);
            }
            finally {
                app.endUndoGroup();
            }
        };
    })
        .build();
})(this);
