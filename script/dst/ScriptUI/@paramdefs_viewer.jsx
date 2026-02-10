/**
 * @paramdefs_viewer v1.0.0
 */
(function (global) {
    var SCRIPT_NAME = '@paramdefs_viewer';
    var Param;
    (function (Param) {
        Param["Text"] = "Text";
    })(Param || (Param = {}));
    var Event;
    (function (Event) {
        Event["Refresh"] = "Refresh";
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
    var isValidProperty = function (paramDef) {
        switch (paramDef.type) {
            case 'Button':
            case 'Group Start':
            case 'Group End':
            case 'No Data':
            case 'Path':
                return false;
        }
        return true;
    };
    var builder = new Atarabi.UI.Builder(global instanceof Panel ? global : 'palette', SCRIPT_NAME, { resizeable: true }, function (win, emitter) {
        win.spacing = win.margins = 1;
        win.preferredSize = [400, 300];
        win.addEventListener('mouseover', function () {
            emitter.notify(Event.Refresh);
        });
    })
        .addEditText(Param.Text, '', { multiline: true }, function (ui, emitter) {
        ui.alignment = ['fill', 'fill'];
        var effect = null;
        emitter.addEventListener(Event.Refresh, function () {
            var activeEffect = getActiveEffect();
            if (activeEffect === null || activeEffect == effect) {
                return;
            }
            effect = activeEffect;
            var paramDefs = [];
            for (var i = 1, len = effect.numProperties; i <= len; i++) {
                var property = effect(i);
                if (property instanceof Property) {
                    var paramDef = {
                        name: property.name,
                        matchName: property.matchName,
                        index: i,
                        paramDef: Atarabi.property.getParamDef(property),
                    };
                    var expression = Atarabi.property.getExpression(property);
                    if (expression) {
                        paramDef.expression = expression;
                    }
                    if (isValidProperty(paramDef.paramDef)) {
                        paramDef.value = Atarabi.property.getValue(property);
                    }
                    var hidden = Atarabi.property.isHidden(property);
                    if (hidden) {
                        paramDef.hidden = hidden;
                    }
                    paramDefs.push(paramDef);
                }
            }
            ui.text = Atarabi.JSON.stringify(paramDefs, undefined, 2);
        });
    })
        .build();
})(this);
