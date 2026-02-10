/**
 * @fold_layers v1.0.1
 *
 *      v1.0.1(2024/02/13)  Fix dynamic link bug
 *      v1.0.0(2023/08/28)
 */
(function () {
    if (Atarabi.isDynamicLink()) {
        return;
    }
    var UNFOLD = '▾';
    var FOLD = '▸';
    Atarabi.register.insertCommand('Layer', 'AtTop', 'Add Separator', function () {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return;
        }
        try {
            app.beginUndoGroup('Add Separator');
            var selectedLayers = comp.selectedLayers;
            var selectedLayer = selectedLayers.length ? selectedLayers[0] : null;
            var layer = comp.layers.addShape();
            layer.name = "".concat(UNFOLD, "  Separator");
            layer.enabled = false;
            Atarabi.layer.setNull(layer);
            if (selectedLayer) {
                layer.moveBefore(selectedLayer);
            }
        }
        catch (e) {
            // pass
        }
        finally {
            app.endUndoGroup();
        }
    }, 'CompActive');
    var isUnfold = function (layer) {
        return layer.name.indexOf(UNFOLD) === 0;
    };
    var isFold = function (layer) {
        return layer.name.indexOf(FOLD) === 0;
    };
    var isMarkedLayer = function (layer) {
        return layer instanceof ShapeLayer && (isUnfold(layer) || isFold(layer));
    };
    var getMarkedLayer = function () {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return null;
        }
        var layers = comp.selectedLayers.slice();
        if (!layers.length) {
            return null;
        }
        var layer = layers[0];
        if (isMarkedLayer(layer)) {
            return layer;
        }
        return null;
    };
    Atarabi.register.hookCommand(3974, function (ctx) {
        var markedLayer = getMarkedLayer();
        if (!markedLayer) {
            ctx.fallback = true;
            return;
        }
        try {
            var unfold = isUnfold(markedLayer);
            app.beginUndoGroup("".concat(unfold ? 'Fold' : 'Unfold', " Layers"));
            markedLayer.shy = false;
            markedLayer.name = markedLayer.name.replace(unfold ? UNFOLD : FOLD, unfold ? FOLD : UNFOLD);
            var comp = markedLayer.containingComp;
            for (var idx = markedLayer.index + 1; idx <= comp.numLayers; idx++) {
                var layer = comp.layer(idx);
                if (isMarkedLayer(layer)) {
                    break;
                }
                layer.shy = unfold;
            }
            comp.hideShyLayers = true;
        }
        catch (e) {
            alert(e);
        }
        finally {
            app.endUndoGroup();
        }
    });
})();
