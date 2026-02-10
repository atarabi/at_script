/**
 * @hook_] v1.0.1
 *
 *      v1.0.1(2024/02/13)  Fix dynamic link bug
 *      v1.0.0(2023/09/16)
 */
(function () {
    if (Atarabi.isDynamicLink()) {
        return;
    }
    Atarabi.keyboard.hook({ code: ']' }, function (ctx) {
        var comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (!comp) {
            return false;
        }
        var layers = comp.selectedLayers;
        if (!layers.length) {
            return false;
        }
        try {
            app.beginUndoGroup(']');
            for (var _i = 0, layers_1 = layers; _i < layers_1.length; _i++) {
                var layer = layers_1[_i];
                var delta = comp.time - layer.outPoint;
                layer.startTime += delta;
            }
        }
        catch (e) {
            // pass
        }
        finally {
            app.endUndoGroup();
        }
        return true;
    });
    Atarabi.keyboard.hook({ code: ']', altKey: true }, function (ctx) {
        var comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (!comp) {
            return false;
        }
        var layers = comp.selectedLayers;
        if (!layers.length) {
            return false;
        }
        try {
            app.beginUndoGroup(']');
            for (var _i = 0, layers_2 = layers; _i < layers_2.length; _i++) {
                var layer = layers_2[_i];
                layer.outPoint = comp.time;
            }
        }
        catch (e) {
            // pass
        }
        finally {
            app.endUndoGroup();
        }
        return true;
    });
})();
