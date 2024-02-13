/**
 * @command_set_null v1.0.1
 * 
 *      v1.0.1(2024/02/13) Fix dynamic link bug
 *      v1.0.0(2023/08/28)
 */
(() => {

    if (Atarabi.isDynamicLink()) {
        return;
    }

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