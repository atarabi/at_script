/**
 * @hook_solid v1.0.0
 */
(() => {

    Atarabi.register.hookCommand(CommandID.NewSolid, () => {
        main();
    });

    function main() {
        const comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return;
        }

        const win = new Window('dialog', 'Solid Settings', undefined, { resizeable: false });

        // size
        const sizePanel = win.add('panel', undefined, 'Size');
        sizePanel.orientation = 'column';

        let prevRatio = comp.width / comp.height;
        let prevWidth = comp.width;
        let prevHeight = comp.height;

        const widthGroup = sizePanel.add('group');
        const widthTitle = widthGroup.add('statictext', undefined, 'Width:');
        widthTitle.justify = 'right';
        widthTitle.characters = 8;
        const widthText = widthGroup.add('edittext', undefined, `${prevWidth}`);
        widthText.characters = 10;

        const heightGroup = sizePanel.add('group');
        const heightTitle = heightGroup.add('statictext', undefined, 'Height:');
        heightTitle.justify = 'right';
        heightTitle.characters = 8;
        const heightText = heightGroup.add('edittext', undefined, `${prevHeight}`);
        heightText.characters = 10;

        const lockCheckBox = sizePanel.add('checkbox', undefined, 'Lock Aspect Ratio');
        lockCheckBox.value = true;

        widthText.onChange = () => {
            let newWidth = comp.width;
            try {
                newWidth = ~~eval(widthText.text);
            } catch (e) {
                widthText.text = `${prevWidth}`
                return;
            }
            newWidth = clamp(newWidth, 1, 30000);
            if (lockCheckBox.value) {
                let newHeight = clamp(~~(newWidth / prevRatio), 1, 30000);
                prevHeight = newHeight;
                heightText.text = `${prevHeight}`
            } else {
                prevRatio = newWidth / prevHeight;
            }
            prevWidth = newWidth;
            widthText.text = `${prevWidth}`
        };

        heightText.onChange = () => {
            let newHeight = comp.height;
            try {
                newHeight = ~~eval(heightText.text);
            } catch (e) {
                heightText.text = `${prevHeight}`;
                return;
            }
            newHeight = clamp(newHeight, 1, 30000);
            if (lockCheckBox.value) {
                let newWidth = clamp(~~(newHeight * prevRatio), 1, 30000);
                prevWidth = newWidth;
                widthText.text = `${prevWidth}`;
            } else {
                prevRatio = prevWidth / newHeight;
            }
            prevHeight = newHeight;
            heightText.text = `${prevHeight}`;
        };

        lockCheckBox.onClick = () => {
            if (lockCheckBox.value) {
                prevRatio = prevWidth / prevHeight;
            }
        };

        // button
        const buttonGroup = win.add('group');
        buttonGroup.orientation = 'row';
        const okButton = buttonGroup.add('button', undefined, 'OK');
        const cancelButton = buttonGroup.add('button', undefined, 'Cancel');

        okButton.onClick = () => {
            try {
                app.beginUndoGroup('New: Solid');
                const solidWidth = ~~widthText.text;
                const solidHeight = ~~heightText.text;
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
                })('Solid');
                const [topLayer, single] = ((): [Layer, boolean] => {
                    const layers = comp.selectedLayers.slice();
                    if (!layers.length) {
                        return [null, false];
                    }

                    layers.sort((lhs, rhs) => {
                        if (lhs.index < rhs.index) {
                            return -1;
                        } else if (lhs.index > rhs.index) {
                            return 1;
                        }
                        return 0;
                    });

                    return [layers[0], layers.length === 1];
                })();
                const solidLayer = (() => {
                    const proj = app.project;
                    const solidName = `Solid ${solidWidth}x${solidHeight}`;
                    for (let i = 1, l = proj.numItems; i <= l; ++i) {
                        const item = proj.item(i);
                        if (item instanceof FootageItem && item.mainSource instanceof SolidSource && item.name === solidName && item.width === solidWidth && item.height == solidHeight) {
                            return comp.layers.add(item);
                        }
                    }
                    return comp.layers.addSolid([1, 1, 1], solidName, solidWidth, solidHeight, 1);
                })();
                solidLayer.name = layerName;
                if (topLayer) {
                    solidLayer.moveBefore(topLayer);
                    if (single) {
                        solidLayer.startTime = topLayer.inPoint;
                        solidLayer.outPoint = topLayer.outPoint;
                    }
                }
            } catch (e) {
                alert(e);
            } finally {
                app.endUndoGroup();
            }
            win.close();
        };

        cancelButton.onClick = () => {
            win.close();
        };

        win.center();
        win.show();
    }

    function clamp(v: number, mn: number, mx: number) {
        return Math.min(Math.max(v, mn), mx);
    }

})();