/**
 * @command_set_null v1.0.0
 */
(() => {

    Atarabi.register.insertCommand('Layer', 'AtTop', 'Set Null', () => {
        const comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return;
        }
        try {
            app.beginUndoGroup('Set Null');
            for (const layer of comp.selectedLayers) {
                if (layer instanceof ShapeLayer || layer instanceof TextLayer || layer instanceof AVLayer) {
                    Atarabi.layer.setNull(layer, true);
                }
            }
        } catch (e) {
            // pass
        } finally {
            app.endUndoGroup();
        }

    }, 'LayerSelected');

})();