/**
 * @hook_adjustment v1.0.4
 * 
 *      v1.0.4(2025/11/18) Fix Property Panel activation issue
 *      v1.0.3(2025/04/02) Switch to Types-for-Adobe
 *      v1.0.2(2024/05/29) Change solid's name
 *      v1.0.1(2024/02/13) Fix dynamic link bug
 *      v1.0.0(2023/08/28)
 */
(() => {

    if (Atarabi.isDynamicLink()) {
        return;
    }

    Atarabi.register.hookCommand(_CommandID.NewAdjustmentLayer, () => {
        main();
    });

    function main() {
        const comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return;
        }
        const [isSelected, topLayer, startTime, outPoint] = (() => {
            type Result = [boolean, Layer, number, number];
            const layers = comp.selectedLayers;
            if (!layers.length) {
                return [false, null, 0, comp.duration] as Result;
            }

            let topLayer: Layer = null;
            let index = -1;
            let inPoint = Number.MAX_VALUE;
            let outPoint = -Number.MAX_VALUE;

            for (const layer of layers) {
                if (!topLayer) {
                    index = layer.index;
                    topLayer = layer;
                } else {
                    if (layer.index < index) {
                        index = layer.index;
                        topLayer = layer;
                    }
                }
                inPoint = Math.min(inPoint, layer.inPoint);
                outPoint = Math.max(outPoint, layer.outPoint);
            }
            return [true, topLayer, inPoint, outPoint] as Result;
        })();

        try {
            app.beginUndoGroup('New: Adjustment Layer');
            const solidWidth = comp.width;
            const solidHeight = comp.height;
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
            })('Adjustment Layer');
            const solidLayer = (() => {
                const proj = app.project;
                const solidName = `Solid (${solidWidth}x${solidHeight})`;
                for (let i = 1, l = proj.numItems; i <= l; i++) {
                    const item = proj.item(i);
                    if (item instanceof FootageItem && item.mainSource instanceof SolidSource && item.name.indexOf(solidName) === 0 && item.width === solidWidth && item.height === solidHeight && item.mainSource.color[0] === 1 && item.mainSource.color[1] === 1 && item.mainSource.color[2] === 1) {
                        return comp.layers.add(item);
                    }
                }
                return comp.layers.addSolid([1, 1, 1], solidName, solidWidth, solidHeight, 1);
            })();
            solidLayer.name = layerName;
            if (parseFloat(app.version) >= AppVersion.CC) {
                const preferences = app.preferences;
                const section = 'Label Preference Indices Section 5';
                const key = 'Adjustment Label Index 2';
                const type = PREFType.PREF_Type_MACHINE_INDEPENDENT;
                if (preferences.havePref(section, key, type)) {
                    const label = preferences.getPrefAsLong(section, key, type);
                    solidLayer.label = label;
                }
            }
            solidLayer.adjustmentLayer = true;
            if (isSelected) {
                solidLayer.startTime = startTime;
                solidLayer.outPoint = outPoint;
                solidLayer.moveBefore(topLayer);
            }
            app.setTimeout(() => {
                solidLayer.selected = true;
            }, 0);
        } catch (e) {
            alert(e);
        } finally {
            app.endUndoGroup();
        }
    }

})();