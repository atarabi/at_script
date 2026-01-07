/**
 * @expression_baker v1.0.0
 * 
 *      v1.0.0(2026/01/07)
 */
(() => {

    if (Atarabi.isDynamicLink()) {
        return;
    }

    const SCRIPT_NAME = '@expression_baker';

    Atarabi.keyboard.hook({ code: 'K', altKey: true }, ctx => {
        mainCurrentFrame();
    });

    Atarabi.keyboard.hook({ code: 'K', altKey: true, shiftKey: true }, ctx => {
        mainDefault();
    });

    function mainCurrentFrame() {
        const comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return;
        }
        const props = comp.selectedProperties.slice();
        for (const prop of props) {
            if (!(prop instanceof Property && prop.canVaryOverTime && prop.canSetExpression && prop.expressionEnabled)) {
                continue;
            }
            bakeCurrentFrame(prop,);
        }
    }

    function mainDefault() {
        const comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return;
        }
        const props = comp.selectedProperties.slice();
        for (const prop of props) {
            if (!(prop instanceof Property && prop.canVaryOverTime && prop.canSetExpression && prop.expressionEnabled)) {
                continue;
            }
            bakeDefault(prop,);
        }
    }

    function bakeCurrentFrame(prop: Property) {
        const layer = getLayerOf(prop);
        const { frameDuration } = layer.containingComp;
        const { inPoint, outPoint, time } = layer;
        if (!(inPoint <= time && time < outPoint)) {
            return;
        }

        const noKeys = prop.numKeys === 0;
        let success = false;
        let value: PropertyValue = null;

        try {
            app.beginUndoGroup(`${SCRIPT_NAME}: ${prop.name}(${layer.name})`);
            if (time < outPoint) {
                layer.inPoint = time;
                layer.outPoint = Math.min(time + frameDuration, outPoint);
            } else {
                layer.outPoint = Math.min(time + frameDuration, outPoint);
                layer.inPoint = time;
            }
            app.executeCommand(_CommandID.DeselectAll);
            prop.selected = true;
            app.executeCommand(_CommandID.ConvertExpressionToKeyframes);
            if (noKeys) {
                removeKeys(prop);
            } else {
                value = prop.valueAtTime(time, true);
            }
            success = true;
        } catch (e) {
            alert(e);
        } finally {
            if (inPoint < time) {
                layer.inPoint = inPoint;
                layer.outPoint = outPoint;
            } else {
                layer.outPoint = outPoint;
                layer.inPoint = inPoint;
            }
            app.endUndoGroup();
        }
        if (!noKeys) {
            app.executeCommand(_CommandID.Undo);
            try {
                app.beginUndoGroup(`${SCRIPT_NAME}: ${prop.name}(${layer.name})`);
                prop.setValueAtTime(time, value);
                prop.expressionEnabled = false;
            } catch (e) {
                alert(e);
            } finally {
                app.endUndoGroup();
            }
        }
    }

    function bakeDefault(prop: Property) {
        const layer = getLayerOf(prop);
        try {
            app.beginUndoGroup(`${SCRIPT_NAME}: ${prop.name}(${layer.name})`);
            app.executeCommand(_CommandID.DeselectAll);
            prop.selected = true;
            app.executeCommand(_CommandID.ConvertExpressionToKeyframes);
        } catch (e) {
            alert(e);
        } finally {
            app.endUndoGroup();
        }
    }

    function getLayerOf(prop: PropertyBase): Layer {
        return prop.propertyGroup(prop.propertyDepth) as Layer;
    }

    function removeKeys(prop: Property) {
        while (prop.numKeys > 0) {
            prop.removeKey(1);
        }
    }

})();