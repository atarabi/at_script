/**
 * @hook_null v1.1.0
 * 
 *      v1.1.1(2025/02/16) Fix minor bug
 *      v1.1.0(2025/02/04) Support API
 *      v1.0.2(2024/05/29) Refactor
 *      v1.0.1(2024/02/13) Fix dynamic link bug
 *      v1.0.0(2023/08/28)
 */
(() => {

    if (Atarabi.isDynamicLink()) {
        return;
    }

    const AnchorPoint = {
        LeftTop: 'LeftTop',
        Center: 'Center',
    } as const;

    const ANCHOR_POINT = AnchorPoint.LeftTop;

    Atarabi.register.hookCommand(CommandID.NewNullObject, () => {
        main();
    });

    function main() {
        const comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return;
        }

        try {
            app.beginUndoGroup('New: Null');
            const [topLayer, single] = ((): [Layer, boolean] => {
                const layers = comp.selectedLayers.slice();
                if (!layers.length) {
                    return [null, false];
                }
                layers.sort((lhs, rhs) => {
                    return lhs.index - rhs.index;
                });
                return [layers[0], layers.length === 1];
            })();
            const nullLayer = addNull(comp);
            if (topLayer) {
                nullLayer.moveBefore(topLayer);
                if (single) {
                    nullLayer.startTime = topLayer.inPoint;
                    nullLayer.outPoint = topLayer.outPoint;
                }
            }
        } catch(e) {
            alert(e);
        } finally {
            app.endUndoGroup();
        }
    }

    const SCRIPT_NAME = '@hook_null';

    function addNull(comp: CompItem) {
        const layerName = ((name: string): string => {
            const layerNames: { [name: string]: boolean; } = {};
            for (let i = 1; i <= comp.numLayers; i++) {
                layerNames[comp.layer(i).name] = true;
            }
            for (let j = 1; ; j++) {
                const newName = `${name} ${j}`;
                if (!layerNames[newName]) {
                    return newName;
                }
            }
        })('Null');

        const nullLayer = (() => {
            const proj = app.project;
            const solidName = 'Null';
            for (let i = 1, l = proj.numItems; i <= l; i++) {
                const item = proj.item(i);
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