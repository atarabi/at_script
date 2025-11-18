/**
 * @hook_solid v1.2.2
 * 
 *      v1.2.2(2025/11/18) Fix Property Panel activation issue
 *      v1.2.1(2025/04/02) Switch to Types-for-Adobe
 *      v1.2.0(2025/02/04) Support API
 *      v1.1.0(2024/05/29) Add color panel
 *      v1.0.1(2024/02/13) Fix dynamic link bug
 *      v1.0.0(2023/08/28)
 */
(() => {

    if (Atarabi.isDynamicLink()) {
        return;
    }

    Atarabi.register.hookCommand(_CommandID.NewSolid, () => {
        main();
    });

    function main() {
        const comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return;
        }

        const settings = loadSettings();
        const solidItems = collectSolidItems();
        const black = [0, 0, 0] satisfies Atarabi.Color;
        const white = [1, 1, 1] satisfies Atarabi.Color;

        const win = new Window('dialog', 'Solid Settings', undefined, { resizeable: false });

        // size
        const sizePanel = win.add('panel', undefined, 'Size');
        sizePanel.orientation = 'column';
        sizePanel.alignment = ['fill', 'top'];

        let prevRatio: [number, number] = ratio(comp.width, comp.height);
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

        const lockCheckBox = sizePanel.add('checkbox', undefined, `Lock Aspect Ratio to ${prevRatio[0]}:${prevRatio[1]}`);
        lockCheckBox.value = true;

        const updateRatio = (x: number, y: number) => {
            prevRatio = ratio(x, y);
            lockCheckBox.text = `Lock Aspect Ratio to ${prevRatio[0]}:${prevRatio[1]}`;
        };

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
                let newHeight = clamp(~~(newWidth * prevRatio[1] / prevRatio[0]), 1, 30000);
                prevHeight = newHeight;
                heightText.text = `${prevHeight}`
            } else {
                updateRatio(newWidth, prevHeight);
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
                let newWidth = clamp(~~(newHeight * prevRatio[0] / prevRatio[1]), 1, 30000);
                prevWidth = newWidth;
                widthText.text = `${prevWidth}`;
            } else {
                updateRatio(prevWidth, newHeight);
            }
            prevHeight = newHeight;
            heightText.text = `${prevHeight}`;
        };

        lockCheckBox.onClick = function (this: Checkbox) {
            if (this.value) {
                updateRatio(prevWidth, prevHeight);
            }
        };

        // color
        let currentColor: Atarabi.Color = white;
        const colorPanel = win.add('panel', undefined, 'Color');
        colorPanel.orientation = 'column';
        colorPanel.alignment = ['fill', 'top'];
        colorPanel.spacing = 5;
        type ColorButton = Button & { color: Atarabi.Color; };
        const colorButtons: ColorButton[] = [];
        let currentColorButton: Button = null;
        function colorButtonOnDraw(this: ColorButton) {
            const size = this.size;
            const g = this.graphics;
            g.rectPath(0, 0, size[0], size[1]);
            g.fillPath(g.newBrush(g.BrushType.SOLID_COLOR, clampColor(this.color)));
            if (currentColorButton === this) {
                g.strokePath(g.newPen(g.PenType.SOLID_COLOR, black, 6));
                g.strokePath(g.newPen(g.PenType.SOLID_COLOR, white, 2));
            }
        }
        function updateColorButtons() {
            for (const button of colorButtons) {
                button.notify('onDraw');
            }
        }
        // color picker
        const colorPickerGroup = colorPanel.add('group');
        colorPickerGroup.alignment = ['fill', 'top'];
        colorPickerGroup.spacing = 7;
        const colorPickerButton = colorPickerGroup.add('button') as ColorButton;
        colorPickerButton.alignment = ['fill', 'top'];
        colorPickerButton.preferredSize[1] = 20;
        colorPickerButton.color = white;
        colorPickerButton.helpTip = colorToHelpTip(white);
        colorPickerButton.onDraw = colorButtonOnDraw;
        colorPickerButton.onClick = function (this: ColorButton) {
            const newColor = Atarabi.app.colorPicker(this.color);
            if (newColor) {
                this.helpTip = colorToHelpTip(newColor);
                currentColor = this.color = newColor;
                currentColorButton = this;
            }
            updateColorButtons();
        };
        currentColorButton = colorPickerButton;
        colorButtons.push(colorPickerButton);
        // separator
        const colors = collectColors(solidItems);
        if (colors.length) {
            const separator = colorPanel.add('panel');
            separator.alignment = ['fill', 'top'];
            separator.preferredSize[1] = 2;
        }
        // colors
        let colorGroup: Group = null;
        for (let i = 0, l = colors.length; i < l; i++) {
            if (i % 7 === 0) {
                colorGroup = colorPanel.add('group');
                colorGroup.orientation = 'row';
                colorGroup.alignment = ['fill', 'top'];
                colorGroup.spacing = 7;
            }
            const color = colors[i];
            const colorButton = colorGroup.add('button') as ColorButton;
            colorButton.preferredSize = [20, 20];
            colorButton.color = color;
            colorButton.helpTip = colorToHelpTip(color);
            colorButton.onDraw = colorButtonOnDraw;
            colorButton.onClick = function (this: ColorButton) {
                currentColor = colorPickerButton.color = this.color;
                currentColorButton = this;
                updateColorButtons();
            };
            colorButtons.push(colorButton);
        }

        // options
        const addFillEffectCheckbox = win.add('checkbox', undefined, 'Use Fill Effect');
        addFillEffectCheckbox.alignment = ['left', 'top'];
        addFillEffectCheckbox.value = settings.useFillEffect;
        addFillEffectCheckbox.onClick = function(this: Checkbox) {
            settings.useFillEffect = this.value;
        };

        // button
        const buttonGroup = win.add('group');
        buttonGroup.orientation = 'row';
        const okButton = buttonGroup.add('button', undefined, 'OK');
        okButton.onClick = () => {
            try {
                app.beginUndoGroup('New: Solid');
                const solidWidth = ~~widthText.text;
                const solidHeight = ~~heightText.text;
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
                const solidLayer = addSolid(comp, solidWidth, solidHeight, settings.useFillEffect ? white : currentColor);
                if (settings.useFillEffect) {
                    const fillEffect = solidLayer.effect.addProperty(ADOBE_FILL) as PropertyGroup;
                    (fillEffect(ADOBE_FILL_COLOR) as Property).setValue(currentColor);
                }
                if (topLayer) {
                    solidLayer.moveBefore(topLayer);
                    if (single) {
                        solidLayer.startTime = topLayer.inPoint;
                        solidLayer.outPoint = topLayer.outPoint;
                    }
                }
                app.setTimeout(() => {
                    solidLayer.selected = true;
                }, 0);
            } catch (e) {
                alert(e);
            } finally {
                app.endUndoGroup();
            }
            saveSettings(settings);
            win.close();
        };
        const cancelButton = buttonGroup.add('button', undefined, 'Cancel');
        cancelButton.onClick = () => {
            win.close();
        };

        win.center();
        win.show();
    }

    const SCRIPT_NAME = '@hook_solid';

    function gcd(x: number, y: number) {
        if (!y) {
            return x;
        }
        return gcd(y, x % y);
    }

    function ratio(x: number, y: number): [number, number] {
        const d = gcd(x, y);
        return [x / d, y / d];
    }

    function clamp(v: number, mn: number, mx: number) {
        return Math.min(Math.max(v, mn), mx);
    }

    function clampColor(c: Atarabi.Color): Atarabi.Color {
        return [clamp(c[0], 0, 1), clamp(c[1], 0, 1), clamp(c[2], 0, 1)];
    }

    function isWhite(c: Atarabi.Color) {
        return c[0] === 1 && c[1] === 1 && c[2] === 1;
    }

    function colorToHelpTip(c: Atarabi.Color) {
        const r = (v: number) => Math.round(v * 255);
        return `(${r(c[0])},${r(c[1])},${r(c[2])})`;
    }

    function colorToStr(c: Atarabi.Color) {
        return `${c[0]},${c[1]},${c[2]}`;
    }

    type SolidItem = Omit<FootageItem, 'mainSource'> & { mainSource: SolidSource };

    function collectSolidItems(): SolidItem[] {
        const proj = app.project;
        const solidItems: SolidItem[] = [];
        for (let i = 1, l = proj.numItems; i <= l; i++) {
            const item = proj.item(i);
            if (item instanceof FootageItem && item.mainSource instanceof SolidSource) {
                solidItems.push(item as SolidItem);
            }
        }
        return solidItems;
    }

    function collectColors(solidItems: SolidItem[]): Atarabi.Color[] {
        const colors: Atarabi.Color[] = [];
        const solidIds: { [key: string]: number } = {};
        for (const item of solidItems) {
            if (/^Solid \(\d+x\d+\)/.test(item.name)) {
                const color = item.mainSource.color;
                if (isWhite(color)) {
                    continue;
                }
                const colorStr = colorToStr(color);
                if (solidIds[colorStr] === void 0) {
                    solidIds[colorStr] = item.id;
                    colors.push(color);
                } else {
                    solidIds[colorStr] = Math.min(solidIds[colorStr], item.id);
                }
            }
        }
        colors.sort((lhs, rhs) => {
            return solidIds[colorToStr(lhs)] - solidIds[colorToStr(rhs)];
        });
        return colors;
    }

    function addSolid(comp: CompItem, width: number, height: number, color: Atarabi.Color = [1, 1, 1]) {
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
                return lhs.index - rhs.index;
            });
            return [layers[0], layers.length === 1];
        })();
        const solidLayer = (() => {
            const solidName = `Solid (${width}x${height})`;
            const eps = 1e-3;
            const solidItems = collectSolidItems();
            for (const item of solidItems) {
                if (item.name.indexOf(solidName) === 0 && item.width === width && item.height === height && Math.abs(item.mainSource.color[0] - color[0]) < eps && Math.abs(item.mainSource.color[1] - color[1]) < eps && Math.abs(item.mainSource.color[2] - color[2]) < eps) {
                    return comp.layers.add(item);
                }
            }
            return comp.layers.addSolid(color, solidName, width, height, 1);
        })();
        solidLayer.name = layerName;
        return solidLayer;
    }

    if (Atarabi.API) {
        Atarabi.API.add(SCRIPT_NAME, 'addSolid', addSolid);
    }

    const SECTION_NAME = `@script/${SCRIPT_NAME}` as const;
    const KEY_NAME = 'settings';

    const ADOBE_FILL = 'ADBE Fill';
    const ADOBE_FILL_COLOR = 'ADBE Fill-0002';

    interface HookSolidSettings {
        useFillEffect: boolean;
    }

    function loadSettings(): HookSolidSettings {
        if (app.settings.haveSetting(SECTION_NAME, KEY_NAME)) {
            try {
                const settings = Atarabi.JSON.parse(app.settings.getSetting(SECTION_NAME, KEY_NAME)) as HookSolidSettings;
                if (typeof settings.useFillEffect !== 'boolean') {
                    settings.useFillEffect = false;
                }
                return settings;
            } catch (e) {
                // pass
            }
        }
        return {
            useFillEffect: false,
        };
    }

    function saveSettings(settings: HookSolidSettings) {
        app.settings.saveSetting(SECTION_NAME, KEY_NAME, Atarabi.JSON.stringify(settings));
    }

})();