/**
 * @hook_] v1.0.0
 */
(() => {

    Atarabi.keyboard.hook({code: ']'}, ctx => {
        const comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (!comp) {
            return false;
        }
        const layers = comp.selectedLayers;
        if (!layers.length) {
            return false;
        }
        try {
            app.beginUndoGroup(']');
            for (const layer of layers) {
                const delta = comp.time - layer.outPoint;
                layer.startTime += delta;
            }
        } catch (e) {
            // pass
        } finally {
            app.endUndoGroup();
        }
        return true;
    });

    Atarabi.keyboard.hook({ code: ']', altKey: true }, ctx => {
        const comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (!comp) {
            return false;
        }
        const layers = comp.selectedLayers;
        if (!layers.length) {
            return false;
        }
        try {
            app.beginUndoGroup(']');
            for (const layer of layers) {
                layer.outPoint = comp.time;
            }
        } catch (e) {
            // pass
        } finally {
            app.endUndoGroup();
        }
        return true;
    });

})();