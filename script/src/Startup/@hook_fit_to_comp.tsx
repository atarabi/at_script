/**
 * @hook_null v1.0.0
 */
(() => {

    Atarabi.register.hookCommand(CommandID.FitToComp, () => {
        main();
    });

    function isAVLayer (layer: Layer): layer is AVLayer {
        return layer instanceof AVLayer || layer instanceof ShapeLayer || layer instanceof TextLayer;
    }

    function selectLayers(layers: Layer[], selected: boolean) {
        for (const layer of layers) {
            layer.selected = selected;
        }
    }

    function main() {
        const comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return;
        }

        const layers = comp.selectedLayers.slice();
        selectLayers(layers, false);
        let done = false;
        try {
            for (const layer of layers) {
                if (isAVLayer(layer)) {
                    if (!done) {
                        done = true;
                        app.beginUndoGroup('Fit to Comp');
                    }
                    layer.selected = true;
                    const rect = layer.sourceRectAtTime(comp.time, true);
                    if (rect.width / comp.width > rect.height / comp.height) {
                        app.executeCommand(CommandID.FitToCompWidth);
                    } else {
                        app.executeCommand(CommandID.FitToCompHeight);
                    }
                    layer.selected = false;
                }
            }
        } catch (e) {
            alert(e);
        } finally {
            selectLayers(layers, true);
            if (done) {
                app.endUndoGroup();
            }
        }
    }

})();