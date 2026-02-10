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
(function () {
    if (Atarabi.isDynamicLink()) {
        return;
    }
    Atarabi.register.hookCommand(2038 /* _CommandID.NewSolid */, function () {
        main();
    });
    function main() {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return;
        }
        var settings = loadSettings();
        var solidItems = collectSolidItems();
        var black = [0, 0, 0];
        var white = [1, 1, 1];
        var win = new Window('dialog', 'Solid Settings', undefined, { resizeable: false });
        // size
        var sizePanel = win.add('panel', undefined, 'Size');
        sizePanel.orientation = 'column';
        sizePanel.alignment = ['fill', 'top'];
        var prevRatio = ratio(comp.width, comp.height);
        var prevWidth = comp.width;
        var prevHeight = comp.height;
        var widthGroup = sizePanel.add('group');
        var widthTitle = widthGroup.add('statictext', undefined, 'Width:');
        widthTitle.justify = 'right';
        widthTitle.characters = 8;
        var widthText = widthGroup.add('edittext', undefined, "".concat(prevWidth));
        widthText.characters = 10;
        var heightGroup = sizePanel.add('group');
        var heightTitle = heightGroup.add('statictext', undefined, 'Height:');
        heightTitle.justify = 'right';
        heightTitle.characters = 8;
        var heightText = heightGroup.add('edittext', undefined, "".concat(prevHeight));
        heightText.characters = 10;
        var lockCheckBox = sizePanel.add('checkbox', undefined, "Lock Aspect Ratio to ".concat(prevRatio[0], ":").concat(prevRatio[1]));
        lockCheckBox.value = true;
        var updateRatio = function (x, y) {
            prevRatio = ratio(x, y);
            lockCheckBox.text = "Lock Aspect Ratio to ".concat(prevRatio[0], ":").concat(prevRatio[1]);
        };
        widthText.onChange = function () {
            var newWidth = comp.width;
            try {
                newWidth = ~~eval(widthText.text);
            }
            catch (e) {
                widthText.text = "".concat(prevWidth);
                return;
            }
            newWidth = clamp(newWidth, 1, 30000);
            if (lockCheckBox.value) {
                var newHeight = clamp(~~(newWidth * prevRatio[1] / prevRatio[0]), 1, 30000);
                prevHeight = newHeight;
                heightText.text = "".concat(prevHeight);
            }
            else {
                updateRatio(newWidth, prevHeight);
            }
            prevWidth = newWidth;
            widthText.text = "".concat(prevWidth);
        };
        heightText.onChange = function () {
            var newHeight = comp.height;
            try {
                newHeight = ~~eval(heightText.text);
            }
            catch (e) {
                heightText.text = "".concat(prevHeight);
                return;
            }
            newHeight = clamp(newHeight, 1, 30000);
            if (lockCheckBox.value) {
                var newWidth = clamp(~~(newHeight * prevRatio[0] / prevRatio[1]), 1, 30000);
                prevWidth = newWidth;
                widthText.text = "".concat(prevWidth);
            }
            else {
                updateRatio(prevWidth, newHeight);
            }
            prevHeight = newHeight;
            heightText.text = "".concat(prevHeight);
        };
        lockCheckBox.onClick = function () {
            if (this.value) {
                updateRatio(prevWidth, prevHeight);
            }
        };
        // color
        var currentColor = white;
        var colorPanel = win.add('panel', undefined, 'Color');
        colorPanel.orientation = 'column';
        colorPanel.alignment = ['fill', 'top'];
        colorPanel.spacing = 5;
        var colorButtons = [];
        var currentColorButton = null;
        function colorButtonOnDraw() {
            var size = this.size;
            var g = this.graphics;
            g.rectPath(0, 0, size[0], size[1]);
            g.fillPath(g.newBrush(g.BrushType.SOLID_COLOR, clampColor(this.color)));
            if (currentColorButton === this) {
                g.strokePath(g.newPen(g.PenType.SOLID_COLOR, black, 6));
                g.strokePath(g.newPen(g.PenType.SOLID_COLOR, white, 2));
            }
        }
        function updateColorButtons() {
            for (var _i = 0, colorButtons_1 = colorButtons; _i < colorButtons_1.length; _i++) {
                var button = colorButtons_1[_i];
                button.notify('onDraw');
            }
        }
        // color picker
        var colorPickerGroup = colorPanel.add('group');
        colorPickerGroup.alignment = ['fill', 'top'];
        colorPickerGroup.spacing = 7;
        var colorPickerButton = colorPickerGroup.add('button');
        colorPickerButton.alignment = ['fill', 'top'];
        colorPickerButton.preferredSize[1] = 20;
        colorPickerButton.color = white;
        colorPickerButton.helpTip = colorToHelpTip(white);
        colorPickerButton.onDraw = colorButtonOnDraw;
        colorPickerButton.onClick = function () {
            var newColor = Atarabi.app.colorPicker(this.color);
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
        var colors = collectColors(solidItems);
        if (colors.length) {
            var separator = colorPanel.add('panel');
            separator.alignment = ['fill', 'top'];
            separator.preferredSize[1] = 2;
        }
        // colors
        var colorGroup = null;
        for (var i = 0, l = colors.length; i < l; i++) {
            if (i % 7 === 0) {
                colorGroup = colorPanel.add('group');
                colorGroup.orientation = 'row';
                colorGroup.alignment = ['fill', 'top'];
                colorGroup.spacing = 7;
            }
            var color = colors[i];
            var colorButton = colorGroup.add('button');
            colorButton.preferredSize = [20, 20];
            colorButton.color = color;
            colorButton.helpTip = colorToHelpTip(color);
            colorButton.onDraw = colorButtonOnDraw;
            colorButton.onClick = function () {
                currentColor = colorPickerButton.color = this.color;
                currentColorButton = this;
                updateColorButtons();
            };
            colorButtons.push(colorButton);
        }
        // options
        var addFillEffectCheckbox = win.add('checkbox', undefined, 'Use Fill Effect');
        addFillEffectCheckbox.alignment = ['left', 'top'];
        addFillEffectCheckbox.value = settings.useFillEffect;
        addFillEffectCheckbox.onClick = function () {
            settings.useFillEffect = this.value;
        };
        // button
        var buttonGroup = win.add('group');
        buttonGroup.orientation = 'row';
        var okButton = buttonGroup.add('button', undefined, 'OK');
        okButton.onClick = function () {
            try {
                app.beginUndoGroup('New: Solid');
                var solidWidth = ~~widthText.text;
                var solidHeight = ~~heightText.text;
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
                var solidLayer_1 = addSolid(comp, solidWidth, solidHeight, settings.useFillEffect ? white : currentColor);
                if (settings.useFillEffect) {
                    var fillEffect = solidLayer_1.effect.addProperty(ADOBE_FILL);
                    fillEffect(ADOBE_FILL_COLOR).setValue(currentColor);
                }
                if (topLayer) {
                    solidLayer_1.moveBefore(topLayer);
                    if (single) {
                        solidLayer_1.startTime = topLayer.inPoint;
                        solidLayer_1.outPoint = topLayer.outPoint;
                    }
                }
                app.setTimeout(function () {
                    solidLayer_1.selected = true;
                }, 0);
            }
            catch (e) {
                alert(e);
            }
            finally {
                app.endUndoGroup();
            }
            saveSettings(settings);
            win.close();
        };
        var cancelButton = buttonGroup.add('button', undefined, 'Cancel');
        cancelButton.onClick = function () {
            win.close();
        };
        win.center();
        win.show();
    }
    var SCRIPT_NAME = '@hook_solid';
    function gcd(x, y) {
        if (!y) {
            return x;
        }
        return gcd(y, x % y);
    }
    function ratio(x, y) {
        var d = gcd(x, y);
        return [x / d, y / d];
    }
    function clamp(v, mn, mx) {
        return Math.min(Math.max(v, mn), mx);
    }
    function clampColor(c) {
        return [clamp(c[0], 0, 1), clamp(c[1], 0, 1), clamp(c[2], 0, 1)];
    }
    function isWhite(c) {
        return c[0] === 1 && c[1] === 1 && c[2] === 1;
    }
    function colorToHelpTip(c) {
        var r = function (v) { return Math.round(v * 255); };
        return "(".concat(r(c[0]), ",").concat(r(c[1]), ",").concat(r(c[2]), ")");
    }
    function colorToStr(c) {
        return "".concat(c[0], ",").concat(c[1], ",").concat(c[2]);
    }
    function collectSolidItems() {
        var proj = app.project;
        var solidItems = [];
        for (var i = 1, l = proj.numItems; i <= l; i++) {
            var item = proj.item(i);
            if (item instanceof FootageItem && item.mainSource instanceof SolidSource) {
                solidItems.push(item);
            }
        }
        return solidItems;
    }
    function collectColors(solidItems) {
        var colors = [];
        var solidIds = {};
        for (var _i = 0, solidItems_1 = solidItems; _i < solidItems_1.length; _i++) {
            var item = solidItems_1[_i];
            if (/^Solid \(\d+x\d+\)/.test(item.name)) {
                var color = item.mainSource.color;
                if (isWhite(color)) {
                    continue;
                }
                var colorStr = colorToStr(color);
                if (solidIds[colorStr] === void 0) {
                    solidIds[colorStr] = item.id;
                    colors.push(color);
                }
                else {
                    solidIds[colorStr] = Math.min(solidIds[colorStr], item.id);
                }
            }
        }
        colors.sort(function (lhs, rhs) {
            return solidIds[colorToStr(lhs)] - solidIds[colorToStr(rhs)];
        });
        return colors;
    }
    function addSolid(comp, width, height, color) {
        if (color === void 0) { color = [1, 1, 1]; }
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
        })('Solid');
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
        var solidLayer = (function () {
            var solidName = "Solid (".concat(width, "x").concat(height, ")");
            var eps = 1e-3;
            var solidItems = collectSolidItems();
            for (var _i = 0, solidItems_2 = solidItems; _i < solidItems_2.length; _i++) {
                var item = solidItems_2[_i];
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
    var SECTION_NAME = "@script/".concat(SCRIPT_NAME);
    var KEY_NAME = 'settings';
    var ADOBE_FILL = 'ADBE Fill';
    var ADOBE_FILL_COLOR = 'ADBE Fill-0002';
    function loadSettings() {
        if (app.settings.haveSetting(SECTION_NAME, KEY_NAME)) {
            try {
                var settings = Atarabi.JSON.parse(app.settings.getSetting(SECTION_NAME, KEY_NAME));
                if (typeof settings.useFillEffect !== 'boolean') {
                    settings.useFillEffect = false;
                }
                return settings;
            }
            catch (e) {
                // pass
            }
        }
        return {
            useFillEffect: false,
        };
    }
    function saveSettings(settings) {
        app.settings.saveSetting(SECTION_NAME, KEY_NAME, Atarabi.JSON.stringify(settings));
    }
})();
