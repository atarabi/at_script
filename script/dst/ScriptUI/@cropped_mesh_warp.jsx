/**
 * @cropped_mesh_warp v1.0.1
 *
 *      v1.0.1(2025/04/02) Switch to Types-for-Adobe
 *      v1.0.0(2025/02/09)
 */
(function (global) {
    var SCRIPT_NAME = '@cropped_mesh_warp';
    var builder = new Atarabi.UI.Builder(global instanceof Panel ? global : 'palette', SCRIPT_NAME, { resizeable: true }, function (win) {
        win.spacing = 2;
        win.margins = 8;
        win.preferredSize[0] = 150;
    })
        .addGroup("RowsGroup" /* Param.RowsGroup */, undefined, function (ui, emitter) {
        ui.orientation = 'row';
        ui.spacing = 2;
        ui.margins = 4;
        ui.alignment = ['fill', 'top'];
    })
        .addStaticText("RowsText" /* Param.RowsText */, 'Rows: ', undefined, function (ui, emitter) {
        ui.alignment = ['left', 'top'];
        ui.preferredSize[0] = 60;
    })
        .addNumber("Rows" /* Param.Rows */, { initialvalue: 7, minvalue: 1, maxvalue: 31 }, undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.onChange = function () {
            builder.set("Rows" /* Param.Rows */, Math.round(builder.get("Rows" /* Param.Rows */)));
        };
    })
        .addGroupEnd()
        .addGroup("ColumnsGroup" /* Param.ColumnsGroup */, undefined, function (ui, emitter) {
        ui.orientation = 'row';
        ui.spacing = 2;
        ui.margins = 4;
        ui.alignment = ['fill', 'top'];
    })
        .addStaticText("ColumnsText" /* Param.ColumnsText */, 'Columns: ', undefined, function (ui, emitter) {
        ui.alignment = ['left', 'top'];
        ui.preferredSize[0] = 60;
    })
        .addNumber("Columns" /* Param.Columns */, { initialvalue: 7, minvalue: 1, maxvalue: 31 }, undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.onChange = function () {
            builder.set("Columns" /* Param.Columns */, Math.round(builder.get("Columns" /* Param.Columns */)));
        };
    })
        .addGroupEnd()
        .addButton("Execute" /* Param.Execute */, undefined, undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.onClick = function () {
            var rows = builder.get("Rows" /* Param.Rows */);
            var columns = builder.get("Columns" /* Param.Columns */);
            execute(rows, columns);
        };
    })
        .build();
    var CC_POWER_PIN = 'CC Power Pin';
    var MESH_WARP = 'ADBE MESH WARP';
    function execute(rows, columns) {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return;
        }
        var layers = filter(comp.selectedLayers, isAVLayer);
        if (!layers.length) {
            return;
        }
        try {
            app.beginUndoGroup(SCRIPT_NAME);
            var _loop_1 = function (layer) {
                var bound = Atarabi.layer.getBounds(layer);
                if (bound.width <= 0 || bound.height <= 0) {
                    return "continue";
                }
                var map = (function () {
                    var left = bound.left / layer.width;
                    var top = bound.top / layer.height;
                    var width = bound.width / layer.width;
                    var height = bound.height / layer.height;
                    return function (_a) {
                        var x = _a[0], y = _a[1];
                        return [left + x * width, top + y * height];
                    };
                })();
                var ccPowerPin = layer.effect.addProperty(CC_POWER_PIN);
                ccPowerPin("CC Power Pin-0002" /* PowerPin.TopLeft */).setValue([bound.left, bound.top]);
                ccPowerPin("CC Power Pin-0003" /* PowerPin.TopRight */).setValue([bound.left + bound.width, bound.top]);
                ccPowerPin("CC Power Pin-0004" /* PowerPin.BottomLeft */).setValue([bound.left, bound.top + bound.height]);
                ccPowerPin("CC Power Pin-0005" /* PowerPin.BottomRight */).setValue([bound.left + bound.width, bound.top + bound.height]);
                ccPowerPin("CC Power Pin-0007" /* PowerPin.Unstretch */).setValue(true);
                var meshWarp = layer.effect.addProperty(MESH_WARP);
                meshWarp("ADBE MESH WARP-0001" /* MeshWarp.Rows */).setValue(rows);
                meshWarp("ADBE MESH WARP-0002" /* MeshWarp.Columns */).setValue(columns);
                var distortionMeshValue = { rows: rows + 1, columns: columns + 1, vertices: [] };
                var rr = 1 / rows / 3;
                var rc = 1 / columns / 3;
                for (var r = 0; r <= rows; r++) {
                    var y = r / rows;
                    for (var c = 0; c <= columns; c++) {
                        var x = c / columns;
                        distortionMeshValue.vertices.push({ pos: map([x, y]), up: map([x, y - rr]), right: map([x + rc, y]), down: map([x, y + rr]), left: map([x - rc, y]) });
                    }
                }
                Atarabi.effect['ADBE MESH WARP'].setDistortionMeshValue(meshWarp("ADBE MESH WARP-0004" /* MeshWarp.DistortionMesh */), distortionMeshValue);
            };
            for (var _i = 0, layers_1 = layers; _i < layers_1.length; _i++) {
                var layer = layers_1[_i];
                _loop_1(layer);
            }
        }
        catch (e) {
            alert(e);
        }
        finally {
            app.endUndoGroup();
        }
    }
    function isAVLayer(layer) {
        return layer instanceof AVLayer || layer instanceof TextLayer || layer instanceof ShapeLayer;
    }
    function filter(values, fn) {
        var arr = [];
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var value = values_1[_i];
            if (fn(value)) {
                arr.push(value);
            }
        }
        return arr;
    }
})(this);
