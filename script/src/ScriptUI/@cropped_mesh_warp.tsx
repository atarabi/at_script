/**
 * @cropped_mesh_warp v1.0.0
 */
((global: Panel | Global) => {

    const SCRIPT_NAME = '@cropped_mesh_warp';

    const enum Param {
        RowsGroup = 'RowsGroup',
        RowsText = 'RowsText',
        Rows = 'Rows',
        ColumnsGroup = 'ColumnsGroup',
        ColumnsText = 'ColumnsText',
        Columns = 'Columns',
        Execute = 'Execute',
    }

    const builder = new Atarabi.UI.Builder(global instanceof Panel ? global : 'palette', SCRIPT_NAME, { resizeable: true }, win => {
        win.spacing = 2;
        win.margins = 8;
        win.preferredSize[0] = 150;
    })
        .addGroup(Param.RowsGroup, undefined, (ui, emitter) => {
            ui.orientation = 'row';
            ui.spacing = 2;
            ui.margins = 4;
            ui.alignment = ['fill', 'top'];
        })
        .addStaticText(Param.RowsText, 'Rows: ', undefined, (ui, emitter) => {
            ui.alignment = ['left', 'top'];
            ui.preferredSize[0] = 60;
        })
        .addNumber(Param.Rows, { initialvalue: 7, minvalue: 1, maxvalue: 31 }, undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.onChange = () => {
                builder.set(Param.Rows, Math.round(builder.get(Param.Rows)));
            };
        })
        .addGroupEnd()
        .addGroup(Param.ColumnsGroup, undefined, (ui, emitter) => {
            ui.orientation = 'row';
            ui.spacing = 2;
            ui.margins = 4;
            ui.alignment = ['fill', 'top'];
        })
        .addStaticText(Param.ColumnsText, 'Columns: ', undefined, (ui, emitter) => {
            ui.alignment = ['left', 'top'];
            ui.preferredSize[0] = 60;
        })
        .addNumber(Param.Columns, { initialvalue: 7, minvalue: 1, maxvalue: 31 }, undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.onChange = () => {
                builder.set(Param.Columns, Math.round(builder.get(Param.Columns)));
            };
        })
        .addGroupEnd()
        .addButton(Param.Execute, undefined, undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.onClick = () => {
                const rows = builder.get(Param.Rows);
                const columns = builder.get(Param.Columns);
                execute(rows, columns);
            };
        })
        .build()
        ;

    const CC_POWER_PIN = 'CC Power Pin';

    const enum PowerPin {
        TopLeft = 'CC Power Pin-0002',
        TopRight = 'CC Power Pin-0003',
        BottomLeft = 'CC Power Pin-0004',
        BottomRight = 'CC Power Pin-0005',
        Unstretch = 'CC Power Pin-0007',
    }

    const MESH_WARP = 'ADBE MESH WARP';

    const enum MeshWarp {
        Rows = 'ADBE MESH WARP-0001',
        Columns = 'ADBE MESH WARP-0002',
        DistortionMesh = 'ADBE MESH WARP-0004',
    }

    function execute(rows: number, columns: number) {
        const comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return;
        }
        const layers = filter(comp.selectedLayers, isAVLayer);
        if (!layers.length) {
            return;
        }

        try {
            app.beginUndoGroup(SCRIPT_NAME);
            for (const layer of layers) {
                const bound = Atarabi.layer.getBounds(layer);
                if (bound.width <= 0 || bound.height <= 0) {
                    continue;
                }
                const map = (() => {
                    const left = bound.left / layer.width;
                    const top = bound.top / layer.height;
                    const width = bound.width / layer.width;
                    const height = bound.height / layer.height;
                    return ([x, y]: [number, number]): [number, number] => [left + x * width, top + y * height];
                })();

                const ccPowerPin = layer.effect.addProperty(CC_POWER_PIN);
                (ccPowerPin(PowerPin.TopLeft) as Property).setValue([bound.left, bound.top]);
                (ccPowerPin(PowerPin.TopRight) as Property).setValue([bound.left + bound.width, bound.top]);
                (ccPowerPin(PowerPin.BottomLeft) as Property).setValue([bound.left, bound.top + bound.height]);
                (ccPowerPin(PowerPin.BottomRight) as Property).setValue([bound.left + bound.width, bound.top + bound.height]);
                (ccPowerPin(PowerPin.Unstretch) as Property).setValue(true);

                const meshWarp = layer.effect.addProperty(MESH_WARP);
                (meshWarp(MeshWarp.Rows) as Property).setValue(rows);
                (meshWarp(MeshWarp.Columns) as Property).setValue(columns);
                const distortionMeshValue: Atarabi.Effect.MeshWarp.DistortionMeshValue = { rows: rows + 1, columns: columns + 1, vertices: [] };
                const rr = 1 / rows / 3;
                const rc = 1 / columns / 3;
                for (let r = 0; r <= rows; r++) {
                    const y = r / rows;
                    for (let c = 0; c <= columns; c++) {
                        const x = c / columns;
                        distortionMeshValue.vertices.push({ pos: map([x, y]), up: map([x, y - rr]), right: map([x + rc, y]), down: map([x, y + rr]), left: map([x - rc, y]) });
                    }
                }
                Atarabi.effect['ADBE MESH WARP'].setDistortionMeshValue(meshWarp(MeshWarp.DistortionMesh) as Property, distortionMeshValue);
            }
        } catch (e) {
            alert(e);
        } finally {
            app.endUndoGroup();
        }
    }

    function isAVLayer(layer: Layer): layer is AVLayer {
        return layer instanceof AVLayer || layer instanceof TextLayer || layer instanceof ShapeLayer;
    }

    function filter<T>(values: any[], fn: (value: any) => value is T): T[] {
        const arr: T[] = [];
        for (const value of values) {
            if (fn(value)) {
                arr.push(value);
            }
        }
        return arr;
    }

})(this);