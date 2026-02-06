/**
 * @expression_baker v1.1.0
 * 
 *      v1.1.0(2026/02/07) Refactored
 *      v1.0.1(2026/01/10) Set the function to return true
 *      v1.0.0(2026/01/07)
 */
(() => {

    if (Atarabi.isDynamicLink()) {
        return;
    }

    const SCRIPT_NAME = '@expression_baker';

    Atarabi.keyboard.hook({ code: 'K', altKey: true }, ctx => {
        main(true);
        return true;
    });

    Atarabi.keyboard.hook({ code: 'K', altKey: true, shiftKey: true }, ctx => {
        main(false);
        return true;
    });

    function main(currentFrame: boolean) {
        const comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return;
        }
        const props = comp.selectedProperties.slice();
        for (const prop of props) {
            if (!(prop instanceof Property && prop.canVaryOverTime && prop.canSetExpression && prop.expressionEnabled)) {
                continue;
            }
            if (currentFrame) {
                bakeCurrentFrame(prop);
            } else {
                bakeDefault(prop);
            }
        }
    }

    function bakeCurrentFrame(prop: Property) {
        const layer = getLayerOf(prop);
        try {
            app.beginUndoGroup(`${SCRIPT_NAME}: ${prop.name}(${layer.name})`);
            const value = prop.valueAtTime(layer.time, false);
            prop.setValue(value);
            prop.expressionEnabled = false;
        } catch (e) {
            alert(e);
        } finally {
            app.endUndoGroup();
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

})();