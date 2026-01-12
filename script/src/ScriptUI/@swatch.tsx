/**
 * @swatch v1.0.2
 * 
 *      v1.0.2(2025/04/02) Switch to Types-for-Adobe
 *      v1.0.1(2024/05/29) Add helptip
 *      v1.0.0(2024/02/13)
 */
((global: Panel | Global) => {

    const SCRIPT_NAME = '@swatch';

    const BUTTON_SIZE = 25;

    interface LayoutManager {
        layout(recalculate?: boolean): void;
        resize(): void;
    }

    type Color = Atarabi.Color;

    type Colors = Color[];

    type ColorButton = Button & { color: Color; };

    const SECTION_NAME = `@script/${SCRIPT_NAME}` as const;
    const KEY_NAME = '$$$Defaults$$$';

    const COLORS: Colors = loadColors();

    function loadColors(): Colors {
        if (!app.settings.haveSetting(SECTION_NAME, KEY_NAME)) {
            return [];
        }
        try {
            return Atarabi.JSON.parse(app.settings.getSetting(SECTION_NAME, KEY_NAME));
        } catch {
            return [];
        }
    }

    function saveColors() {
        app.settings.saveSetting(SECTION_NAME, KEY_NAME, Atarabi.JSON.stringify(COLORS));
    }

    function removeColor(index: number) {
        COLORS.splice(index, 1);
        saveColors();
    }

    function addColor(color: Color) {
        COLORS.push(color);
        saveColors();
    }

    function existColor(color: Color) {
        for (let c of COLORS) {
            if (c[0] === color[0] && c[1] === color[1] && c[2] === color[2]) {
                return true;
            }
        }
        return false;
    }

    function isAVLayer(layer: Layer): layer is AVLayer {
        return layer instanceof ShapeLayer || layer instanceof TextLayer || layer instanceof AVLayer;
    }

    function floatToUint8(value: number) {
        return Math.min(255, Math.max(0, Math.round(value * 255)));
    }

    function floatsToUint8s(arr: number[]) {
        const result: number[] = [];
        for (const value of arr) {
            result.push(floatToUint8(value));
        }
        return result;
    }

    function getActiveColor(): Colors {
        const colors: Colors = [];

        const comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp === null) {
            return colors;
        }
        const layer = comp.selectedLayers[0];
        if (!isAVLayer(layer)) {
            return colors;
        }

        const undoneEffects: PropertyGroup[] = [];
        const doneEffects: PropertyGroup[] = [];

        for(const property of layer.selectedProperties) {
            if (property instanceof PropertyGroup && property.isEffect) {
                undoneEffects.push(property);
            } else if (property instanceof Property) {
                if (property.propertyValueType === PropertyValueType.COLOR) {
                    const color = floatsToUint8s(property.value as Atarabi.ColorA);
                    color.splice(3, 1);
                    colors.push(color as Color);
                }
                if (property.parentProperty.isEffect) {
                    doneEffects.push(property.parentProperty);
                }
            }
        }

        for (const undoneEffect of undoneEffects) {
            let done = false;
            for (const doneEffect of doneEffects) {
                // === is NG
                if (undoneEffect == doneEffect) {
                    done = true;
                    break;
                }
            }
            for (let i = 1, len = undoneEffect.numProperties; i<= len; i++) {
                const property = undoneEffect(i);
                if (property instanceof Property && property.propertyValueType === PropertyValueType.COLOR && !Atarabi.property.isHidden(property) && property.isModified) {
                    const color = floatsToUint8s(property.value as Atarabi.ColorA);
                    color.splice(3, 1);
                    colors.push(color as Color);
                }
            }
            doneEffects.push(undoneEffect);
        }

        if (colors.length === 0 && layer.source instanceof FootageItem && layer.source.mainSource instanceof SolidSource) {
            colors.push(floatsToUint8s(layer.source.mainSource.color) as Color);
        }

        return colors;
    }

    const buildUI = () => {
        const win = global instanceof Panel ? global : new Window('palette', SCRIPT_NAME, undefined, { resizeable: true });
        win.spacing = 0;
        win.margins = 0;
        win.preferredSize = [BUTTON_SIZE * 4, BUTTON_SIZE * 3];

        function createLayoutManager(panel: Panel): LayoutManager {
            const layout = () => {
                const [width, height] = panel.size;
                let left = 0, top = 0;
                for (let i = 0, len = panel.children.length; i < len; i++) {
                    const child = panel.children[i];
                    child.bounds = [left, top, left + BUTTON_SIZE, top + BUTTON_SIZE];
                    left += BUTTON_SIZE;
                    if (left + BUTTON_SIZE > width) {
                        left = 0;
                        top += BUTTON_SIZE;
                    }
                }
            };
            return {
                layout(recalculate?: boolean) {
                    if (panel.bounds == null) {
                        return;
                    }
                    layout();
                },
                resize() {
                    layout();
                },
            };
        };

        const panel = win.add('panel');
        panel.spacing = 0;
        panel.margins = 0;
        panel.alignment = ['fill', 'fill'];
        panel.layout = createLayoutManager(panel);

        function colorButtonOnDraw(this: ColorButton) {
            const size = this.size;
            const g = this.graphics;
            g.rectPath(0, 0, size[0], size[1]);
            g.fillPath(g.newBrush(g.BrushType.SOLID_COLOR as any, [this.color[0] / 255, this.color[1] / 255, this.color[2] / 255]));
        }

        function colorButtonOnDoubleClick(this: ColorButton, ev: MouseEvent) {
            const parent = this.parent as Window | Panel | Group;
            for (let i = 0, len = parent.children.length; i < len; i++) {
                if (parent.children[i] === this) {
                    parent.remove(i);
                    removeColor(i);
                    break;
                }
            }
            parent.layout.layout();
        }

        function createColorButton(color: Color) {
            const button = panel.add('button', undefined, '') as ColorButton;
            button.color = color;
            button.helpTip = `(${color[0]}, ${color[1]}, ${color[2]})`;
            button.onDraw = colorButtonOnDraw;
            button.addEventListener('mousedown', (ev: MouseEvent) => {
                if (ev.button === 0 && ev.detail === 2) {
                    colorButtonOnDoubleClick.call(button, ev);
                }
            });
            return button;
        }

        for (const color of COLORS) {
            createColorButton(color);
        }

        function appendColor(color: Color) {
            createColorButton(color);
            addColor(color);
        }

        win.addEventListener('mousedown', (ev: MouseEvent) => {
            if (ev.button === 1) {
                const colors = getActiveColor();
                let done = false;
                for (const color of colors) {
                    if (existColor(color)) {
                        continue;
                    }
                    appendColor(color);
                    done = true;
                }
                if (done) {
                    panel.layout.layout();
                }
            }
        });

        win.onResize = () => {
            win.layout.resize();
        };
      
        if (win instanceof Panel) {
            win.layout.layout(true);
        } else {
            win.center();
            win.show();
        }
    };

    const main = () => {
        buildUI();
    };

    main();

})(this);