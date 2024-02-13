/**
 * @fold_layers v1.0.1
 * 
 *      v1.0.1(2024/02/13)  Fix dynamic link bug
 *      v1.0.0(2023/08/28)
 */
(() => {

    if (Atarabi.isDynamicLink()) {
        return;
    }

    const UNFOLD = '▾';

    const FOLD = '▸';

    Atarabi.register.insertCommand('Layer', 'AtTop', 'Add Separator', () => {
        const comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return;
        }
        try {
            app.beginUndoGroup('Add Separator');
            const selectedLayers = comp.selectedLayers;
            const selectedLayer = selectedLayers.length ? selectedLayers[0] : null;
            const layer = comp.layers.addShape();
            layer.name = `${UNFOLD}  Separator`;
            layer.enabled = false;
            Atarabi.layer.setNull(layer);
            if (selectedLayer) {
                layer.moveBefore(selectedLayer);
            }
        } catch (e) {
            // pass
        } finally {
            app.endUndoGroup();
        }

    }, 'CompActive');

    const isUnfold = (layer: Layer) => {
        return layer.name.indexOf(UNFOLD) === 0;
    };

    const isFold = (layer: Layer) => {
        return layer.name.indexOf(FOLD) === 0;
    };

    const isMarkedLayer = (layer: Layer) => {
        return layer instanceof ShapeLayer && (isUnfold(layer) || isFold(layer));
    };

    const getMarkedLayer = () => {
        const comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return null;
        }
        const layers = comp.selectedLayers.slice();
        if (!layers.length) {
            return null;
        }
        const layer = layers[0];
        if (isMarkedLayer(layer)) {
            return layer;
        }
        return null;
    };

    Atarabi.register.hookCommand(3974, ctx => {
        const markedLayer = getMarkedLayer();
        if (!markedLayer) {
            ctx.fallback = true;
            return;
        }
        try {
            const unfold = isUnfold(markedLayer);
            app.beginUndoGroup(`${unfold ? 'Fold' : 'Unfold'} Layers`);
            markedLayer.shy = false;
            markedLayer.name = markedLayer.name.replace(unfold ? UNFOLD : FOLD, unfold ? FOLD : UNFOLD);
            const comp = markedLayer.containingComp;
            for (let idx = markedLayer.index + 1; idx <= comp.numLayers; idx++) {
                const layer = comp.layer(idx);
                if (isMarkedLayer(layer)) {
                    break;
                }
                layer.shy = unfold;
            }
            comp.hideShyLayers = true;
        } catch (e) {
            alert(e);
        } finally {
            app.endUndoGroup();
        }
    });

})();