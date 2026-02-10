/**
 * @swatch v1.0.2
 *
 *      v1.0.2(2025/04/02) Switch to Types-for-Adobe
 *      v1.0.1(2024/05/29) Add helptip
 *      v1.0.0(2024/02/13)
 */
(function (global) {
    var SCRIPT_NAME = '@swatch';
    var BUTTON_SIZE = 25;
    var SECTION_NAME = "@script/".concat(SCRIPT_NAME);
    var KEY_NAME = '$$$Defaults$$$';
    var COLORS = loadColors();
    function loadColors() {
        if (!app.settings.haveSetting(SECTION_NAME, KEY_NAME)) {
            return [];
        }
        try {
            return Atarabi.JSON.parse(app.settings.getSetting(SECTION_NAME, KEY_NAME));
        }
        catch (_a) {
            return [];
        }
    }
    function saveColors() {
        app.settings.saveSetting(SECTION_NAME, KEY_NAME, Atarabi.JSON.stringify(COLORS));
    }
    function removeColor(index) {
        COLORS.splice(index, 1);
        saveColors();
    }
    function addColor(color) {
        COLORS.push(color);
        saveColors();
    }
    function existColor(color) {
        for (var _i = 0, COLORS_1 = COLORS; _i < COLORS_1.length; _i++) {
            var c = COLORS_1[_i];
            if (c[0] === color[0] && c[1] === color[1] && c[2] === color[2]) {
                return true;
            }
        }
        return false;
    }
    function isAVLayer(layer) {
        return layer instanceof ShapeLayer || layer instanceof TextLayer || layer instanceof AVLayer;
    }
    function floatToUint8(value) {
        return Math.min(255, Math.max(0, Math.round(value * 255)));
    }
    function floatsToUint8s(arr) {
        var result = [];
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var value = arr_1[_i];
            result.push(floatToUint8(value));
        }
        return result;
    }
    function getActiveColor() {
        var colors = [];
        var comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp === null) {
            return colors;
        }
        var layer = comp.selectedLayers[0];
        if (!isAVLayer(layer)) {
            return colors;
        }
        var undoneEffects = [];
        var doneEffects = [];
        for (var _i = 0, _a = layer.selectedProperties; _i < _a.length; _i++) {
            var property = _a[_i];
            if (property instanceof PropertyGroup && property.isEffect) {
                undoneEffects.push(property);
            }
            else if (property instanceof Property) {
                if (property.propertyValueType === PropertyValueType.COLOR) {
                    var color = floatsToUint8s(property.value);
                    color.splice(3, 1);
                    colors.push(color);
                }
                if (property.parentProperty.isEffect) {
                    doneEffects.push(property.parentProperty);
                }
            }
        }
        for (var _b = 0, undoneEffects_1 = undoneEffects; _b < undoneEffects_1.length; _b++) {
            var undoneEffect = undoneEffects_1[_b];
            var done = false;
            for (var _c = 0, doneEffects_1 = doneEffects; _c < doneEffects_1.length; _c++) {
                var doneEffect = doneEffects_1[_c];
                // === is NG
                if (undoneEffect == doneEffect) {
                    done = true;
                    break;
                }
            }
            for (var i = 1, len = undoneEffect.numProperties; i <= len; i++) {
                var property = undoneEffect(i);
                if (property instanceof Property && property.propertyValueType === PropertyValueType.COLOR && !Atarabi.property.isHidden(property) && property.isModified) {
                    var color = floatsToUint8s(property.value);
                    color.splice(3, 1);
                    colors.push(color);
                }
            }
            doneEffects.push(undoneEffect);
        }
        if (colors.length === 0 && layer.source instanceof FootageItem && layer.source.mainSource instanceof SolidSource) {
            colors.push(floatsToUint8s(layer.source.mainSource.color));
        }
        return colors;
    }
    var buildUI = function () {
        var win = global instanceof Panel ? global : new Window('palette', SCRIPT_NAME, undefined, { resizeable: true });
        win.spacing = 0;
        win.margins = 0;
        win.preferredSize = [BUTTON_SIZE * 4, BUTTON_SIZE * 3];
        function createLayoutManager(panel) {
            var layout = function () {
                var _a = panel.size, width = _a[0], height = _a[1];
                var left = 0, top = 0;
                for (var i = 0, len = panel.children.length; i < len; i++) {
                    var child = panel.children[i];
                    child.bounds = [left, top, left + BUTTON_SIZE, top + BUTTON_SIZE];
                    left += BUTTON_SIZE;
                    if (left + BUTTON_SIZE > width) {
                        left = 0;
                        top += BUTTON_SIZE;
                    }
                }
            };
            return {
                layout: function (recalculate) {
                    if (panel.bounds == null) {
                        return;
                    }
                    layout();
                },
                resize: function () {
                    layout();
                },
            };
        }
        ;
        var panel = win.add('panel');
        panel.spacing = 0;
        panel.margins = 0;
        panel.alignment = ['fill', 'fill'];
        panel.layout = createLayoutManager(panel);
        function colorButtonOnDraw() {
            var size = this.size;
            var g = this.graphics;
            g.rectPath(0, 0, size[0], size[1]);
            g.fillPath(g.newBrush(g.BrushType.SOLID_COLOR, [this.color[0] / 255, this.color[1] / 255, this.color[2] / 255]));
        }
        function colorButtonOnDoubleClick(ev) {
            var parent = this.parent;
            for (var i = 0, len = parent.children.length; i < len; i++) {
                if (parent.children[i] === this) {
                    parent.remove(i);
                    removeColor(i);
                    break;
                }
            }
            parent.layout.layout();
        }
        function createColorButton(color) {
            var button = panel.add('button', undefined, '');
            button.color = color;
            button.helpTip = "(".concat(color[0], ", ").concat(color[1], ", ").concat(color[2], ")");
            button.onDraw = colorButtonOnDraw;
            button.addEventListener('mousedown', function (ev) {
                if (ev.button === 0 && ev.detail === 2) {
                    colorButtonOnDoubleClick.call(button, ev);
                }
            });
            return button;
        }
        for (var _i = 0, COLORS_2 = COLORS; _i < COLORS_2.length; _i++) {
            var color = COLORS_2[_i];
            createColorButton(color);
        }
        function appendColor(color) {
            createColorButton(color);
            addColor(color);
        }
        win.addEventListener('mousedown', function (ev) {
            if (ev.button === 1) {
                var colors = getActiveColor();
                var done = false;
                for (var _i = 0, colors_1 = colors; _i < colors_1.length; _i++) {
                    var color = colors_1[_i];
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
        win.onResize = function () {
            win.layout.resize();
        };
        if (win instanceof Panel) {
            win.layout.layout(true);
        }
        else {
            win.center();
            win.show();
        }
    };
    var main = function () {
        buildUI();
    };
    main();
})(this);
