/**
 * @dropdownlist_viewer v1.0.0
 */
(function (global) {
    var SCRIPT_NAME = '@dropdownlist_viewer';
    var Param;
    (function (Param) {
        Param["Container"] = "Container";
        Param["Params"] = "Params";
        Param["ListGroup"] = "List Group";
        Param["List"] = "List";
        Param["OptionGroup"] = "Option Group";
        Param["RealTime"] = "Real Time";
    })(Param || (Param = {}));
    var Event;
    (function (Event) {
        Event["Refresh"] = "Refresh";
        Event["ChangeParam"] = "Change Param";
    })(Event || (Event = {}));
    var getActiveEffect = function () {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return null;
        }
        var properties = comp.selectedProperties.slice();
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var property = properties_1[_i];
            if (property.isEffect) {
                return property;
            }
        }
        return null;
    };
    var getTimeFromProperty = function (property) {
        var parent = property.parentProperty;
        while (parent.parentProperty) {
            parent = parent.parentProperty;
        }
        return parent.time;
    };
    var builder = new Atarabi.UI.Builder(global instanceof Panel ? global : 'palette', SCRIPT_NAME, { resizeable: true }, function (win, emitter) {
        win.spacing = win.margins = 1;
        win.preferredSize = [400, 300];
        win.addEventListener('mouseover', function () {
            emitter.notify(Event.Refresh);
        });
    })
        .addGroup(Param.Container, undefined, function (ui) {
        ui.alignment = ['fill', 'fill'];
        ui.orientation = 'row';
        ui.spacing = ui.margins = 1;
    })
        .addListBox(Param.Params, undefined, undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'fill'];
        var effect = null;
        emitter.addEventListener(Event.Refresh, function () {
            var activeEffect = getActiveEffect();
            if (activeEffect === null || activeEffect == effect) {
                return;
            }
            effect = activeEffect;
            ui.removeAll();
            for (var i = 1, len = effect.numProperties; i <= len; i++) {
                var property = effect(i);
                if (property.propertyValueType !== PropertyValueType.OneD) {
                    continue;
                }
                var paramDef = Atarabi.property.getParamDef(property);
                if (paramDef.type === 'Popup') {
                    var item = ui.add('item', property.name);
                    item.ex = { property: property, paramDef: paramDef };
                }
            }
            emitter.notify(Event.ChangeParam, null);
        });
        ui.onChange = function () {
            var selection = ui.selection;
            if (!selection) {
                return;
            }
            emitter.notify(Event.ChangeParam, selection.ex.property, selection.ex.paramDef);
        };
    })
        .addGroup(Param.ListGroup, undefined, function (ui) {
        ui.alignment = ['fill', 'fill'];
        ui.orientation = 'column';
        ui.spacing = ui.margins = 1;
    })
        .addListBox(Param.List, undefined, undefined, function (ui, emitter) {
        var property = null;
        ui.alignment = ['fill', 'fill'];
        emitter.addEventListener(Event.ChangeParam, function (newProperty, paramDef) {
            ui.removeAll();
            property = newProperty;
            if (property === null) {
                return;
            }
            var texts = paramDef.menu.split('|');
            for (var i = 0, len = texts.length; i < len; i++) {
                var text = texts[i];
                if (text === '(-') {
                    continue;
                }
                var item = ui.add('item', text);
                item.ex = { index: i + 1 };
            }
        });
        var apply = function () {
            var selection = ui.selection;
            if (!selection) {
                return;
            }
            if (!isValid(property)) {
                alert('invalid: please refresh');
                return;
            }
            if (property.numKeys > 0) {
                property.setValueAtTime(getTimeFromProperty(property), selection.ex.index);
            }
            else {
                property.setValue(selection.ex.index);
            }
        };
        ui.onDoubleClick = apply;
        ui.addEventListener('keydown', function (ev) {
            if (ev.keyName === 'Enter') {
                ev.preventDefault();
                apply();
            }
        });
        ui.onChange = function () {
            var realTime = builder.get(Param.RealTime);
            if (realTime) {
                apply();
            }
        };
    })
        .addGroup(Param.OptionGroup, undefined, function (ui) {
        ui.alignment = ['fill', 'bottom'];
        ui.orientation = 'row';
        ui.spacing = ui.margins = 1;
    })
        .addCheckbox(Param.RealTime, false, 'Real Time', undefined, function (ui) {
        ui.alignment = ['right', 'bottom'];
    })
        .addGroupEnd()
        .addGroupEnd()
        .addGroupEnd()
        .build();
})(this);
