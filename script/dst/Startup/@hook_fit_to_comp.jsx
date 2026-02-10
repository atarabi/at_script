/**
 * @hook_null v1.0.2
 *
 *      v1.0.2(2025/04/02) Switch to Types-for-Adobe
 *      v1.0.1(2024/02/13) Fix dynamic link bug
 *      v1.0.0(2023/08/28)
 */
(function () {
    if (Atarabi.isDynamicLink()) {
        return;
    }
    Atarabi.register.hookCommand(2156 /* _CommandID.FitToComp */, function () {
        main();
    });
    function isAVLayer(layer) {
        return layer instanceof AVLayer || layer instanceof ShapeLayer || layer instanceof TextLayer;
    }
    function selectLayers(layers, selected) {
        for (var _i = 0, layers_1 = layers; _i < layers_1.length; _i++) {
            var layer = layers_1[_i];
            layer.selected = selected;
        }
    }
    function main() {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return;
        }
        var layers = comp.selectedLayers.slice();
        selectLayers(layers, false);
        var done = false;
        try {
            for (var _i = 0, layers_2 = layers; _i < layers_2.length; _i++) {
                var layer = layers_2[_i];
                if (isAVLayer(layer)) {
                    if (!done) {
                        done = true;
                        app.beginUndoGroup('Fit to Comp');
                    }
                    layer.selected = true;
                    var rect = layer.sourceRectAtTime(comp.time, true);
                    if (rect.width / comp.width > rect.height / comp.height) {
                        app.executeCommand(2732 /* _CommandID.FitToCompWidth */);
                    }
                    else {
                        app.executeCommand(2733 /* _CommandID.FitToCompHeight */);
                    }
                    layer.selected = false;
                }
            }
        }
        catch (e) {
            alert(e);
        }
        finally {
            selectLayers(layers, true);
            if (done) {
                app.endUndoGroup();
            }
        }
    }
})();
