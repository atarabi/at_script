/**
 * @expression_baker v1.1.0
 *
 *      v1.1.0(2026/02/07) Refactored
 *      v1.0.1(2026/01/10) Set the function to return true
 *      v1.0.0(2026/01/07)
 */
(function () {
    if (Atarabi.isDynamicLink()) {
        return;
    }
    var SCRIPT_NAME = '@expression_baker';
    Atarabi.keyboard.hook({ code: 'K', altKey: true }, function (ctx) {
        main(true);
        return true;
    });
    Atarabi.keyboard.hook({ code: 'K', altKey: true, shiftKey: true }, function (ctx) {
        main(false);
        return true;
    });
    function main(currentFrame) {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return;
        }
        var props = comp.selectedProperties.slice();
        for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
            var prop = props_1[_i];
            if (!(prop instanceof Property && prop.canVaryOverTime && prop.canSetExpression && prop.expressionEnabled)) {
                continue;
            }
            if (currentFrame) {
                bakeCurrentFrame(prop);
            }
            else {
                bakeDefault(prop);
            }
        }
    }
    function bakeCurrentFrame(prop) {
        var layer = getLayerOf(prop);
        try {
            app.beginUndoGroup("".concat(SCRIPT_NAME, ": ").concat(prop.name, "(").concat(layer.name, ")"));
            var value = prop.valueAtTime(layer.time, false);
            prop.setValue(value);
            prop.expressionEnabled = false;
        }
        catch (e) {
            alert(e);
        }
        finally {
            app.endUndoGroup();
        }
    }
    function bakeDefault(prop) {
        var layer = getLayerOf(prop);
        try {
            app.beginUndoGroup("".concat(SCRIPT_NAME, ": ").concat(prop.name, "(").concat(layer.name, ")"));
            app.executeCommand(2004 /* _CommandID.DeselectAll */);
            prop.selected = true;
            app.executeCommand(2639 /* _CommandID.ConvertExpressionToKeyframes */);
        }
        catch (e) {
            alert(e);
        }
        finally {
            app.endUndoGroup();
        }
    }
    function getLayerOf(prop) {
        return prop.propertyGroup(prop.propertyDepth);
    }
})();
