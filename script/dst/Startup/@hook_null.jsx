/**
 * @hook_null v1.1.3
 *
 *      v1.1.3(2025/11/18) Fix Property Panel activation issue
 *      v1.1.2(2025/04/02) Switch to Types-for-Adobe
 *      v1.1.1(2025/02/16) Fix minor bug
 *      v1.1.0(2025/02/04) Support API
 *      v1.0.2(2024/05/29) Refactor
 *      v1.0.1(2024/02/13) Fix dynamic link bug
 *      v1.0.0(2023/08/28)
 */
(function () {
    if (Atarabi.isDynamicLink()) {
        return;
    }
    var AnchorPoint = {
        LeftTop: 'LeftTop',
        Center: 'Center',
    };
    var ANCHOR_POINT = AnchorPoint.LeftTop;
    Atarabi.register.hookCommand(2767 /* _CommandID.NewNullObject */, function () {
        main();
    });
    function main() {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return;
        }
        try {
            app.beginUndoGroup('New: Null');
            var _a = (function () {
                var layers = comp.selectedLayers.slice();
                if (!layers.length) {
                    return [null, false];
                }
                layers.sort(function (lhs, rhs) {
                    return lhs.index - rhs.index;
                });
                return [layers[0], layers.length === 1];
            })(), topLayer = _a[0], single = _a[1];
            var nullLayer_1 = addNull(comp);
            if (topLayer) {
                nullLayer_1.moveBefore(topLayer);
                if (single) {
                    nullLayer_1.startTime = topLayer.inPoint;
                    nullLayer_1.outPoint = topLayer.outPoint;
                }
            }
            app.setTimeout(function () {
                nullLayer_1.selected = true;
            }, 0);
        }
        catch (e) {
            alert(e);
        }
        finally {
            app.endUndoGroup();
        }
    }
    var SCRIPT_NAME = '@hook_null';
    function addNull(comp) {
        var layerName = (function (name) {
            var layerNames = {};
            for (var i = 1; i <= comp.numLayers; i++) {
                layerNames[comp.layer(i).name] = true;
            }
            for (var j = 1;; j++) {
                var newName = "".concat(name, " ").concat(j);
                if (!layerNames[newName]) {
                    return newName;
                }
            }
        })('Null');
        var nullLayer = (function () {
            var proj = app.project;
            var solidName = 'Null';
            for (var i = 1, l = proj.numItems; i <= l; i++) {
                var item = proj.item(i);
                if (item instanceof FootageItem && item.mainSource instanceof SolidSource && item.name === solidName && item.width === 100 && item.height === 100) {
                    return comp.layers.add(item);
                }
            }
            return comp.layers.addSolid([1, 1, 1], solidName, 100, 100, 1);
        })();
        nullLayer.name = layerName;
        nullLayer.transform.opacity.setValue(0);
        if (ANCHOR_POINT === AnchorPoint.LeftTop) {
            nullLayer.transform.anchorPoint.setValue([0, 0]);
        }
        Atarabi.layer.setNull(nullLayer, true);
        return nullLayer;
    }
    if (Atarabi.API) {
        Atarabi.API.add(SCRIPT_NAME, 'addNull', addNull);
    }
})();
