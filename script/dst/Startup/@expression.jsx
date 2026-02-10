/**
 * for @expression(https://github.com/atarabi/at_expression)
 */
(function () {
    if (Atarabi.isDynamicLink()) {
        return;
    }
    var SCRIPT_NAME = '@expression';
    Atarabi.keyboard.hook({ code: 'E', altKey: true }, function (ctx) {
        main();
        return true;
    });
    function main() {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return;
        }
        var props = comp.selectedProperties.slice();
        for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
            var prop = props_1[_i];
            if (!(prop instanceof Property && prop.canVaryOverTime && prop.canSetExpression)) {
                continue;
            }
            var expressionError = prop.expressionError;
            if (!expressionError) {
                continue;
            }
            var message = null;
            try {
                message = Atarabi.JSON.parse(extractMessage(expressionError));
            }
            catch (e) {
                continue;
            }
            interpretMessage(prop, message);
        }
    }
    var REGISTERED_HANDLERS = {};
    function register(scope, handlers) {
        var target = REGISTERED_HANDLERS[scope];
        if (!target) {
            REGISTERED_HANDLERS[scope] = handlers;
            return;
        }
        for (var key in handlers) {
            if (handlers.hasOwnProperty(key)) {
                target[key] = handlers[key];
            }
        }
        REGISTERED_HANDLERS[scope] = handlers;
    }
    function resolve(scope, action) {
        var handlers = REGISTERED_HANDLERS[scope];
        if (!handlers) {
            return null;
        }
        var handle = handlers[action];
        if (!handle) {
            return null;
        }
        return handle;
    }
    function extractMessage(text) {
        return text
            .split(/\r\n|\r|\n/)
            .slice(2)
            .join("\n");
    }
    function getLayerOf(prop) {
        return prop.propertyGroup(prop.propertyDepth);
    }
    function isAVLayer(layer) {
        return layer instanceof TextLayer || layer instanceof ShapeLayer || layer instanceof AVLayer;
    }
    function interpretMessage(prop, message) {
        if (message == null || typeof message !== 'object') {
            return;
        }
        if (message.namespace !== '@expression') {
            return;
        }
        if (typeof message.scope !== 'string') {
            return;
        }
        if (typeof message.action !== 'string') {
            return;
        }
        var dispatch = resolve(message.scope, message.action);
        if (dispatch) {
            dispatch(prop, message);
        }
    }
    register('@effect', {
        'createEffect': function (prop, message) {
            var layer = getLayerOf(prop);
            if (!isAVLayer(layer)) {
                return;
            }
            var settings = message.payload;
            if (!layer.effect.canAddProperty(settings.matchName)) {
                throw new Error("Unable to add \"".concat(settings.matchName, "\""));
            }
            try {
                app.beginUndoGroup("".concat(SCRIPT_NAME, ": ").concat(message.scope, "::").concat(message.action));
                var effect = layer.effect.addProperty(settings.matchName);
                effect.name = settings.name;
                if (settings.parameters != null) {
                    for (var key in settings.parameters) {
                        var param = settings.parameters[key];
                        if (param.value != null) {
                            effect(key).setValue(param.value);
                        }
                        if (typeof param.expression === 'string') {
                            effect(key).expression = param.expression;
                        }
                    }
                }
            }
            catch (e) {
                alert(e);
            }
            finally {
                app.endUndoGroup();
            }
        },
        'createExpressionControl': function (prop, message) {
            var layer = getLayerOf(prop);
            if (!isAVLayer(layer)) {
                return;
            }
            try {
                app.beginUndoGroup("".concat(SCRIPT_NAME, ": ").concat(message.scope, "::").concat(message.action));
                var settings = message.payload;
                switch (settings.type) {
                    case '3D Point': {
                        var effect = layer.effect.addProperty('ADBE Point3D Control');
                        effect.name = settings.name;
                        if (settings.value) {
                            effect(1).setValue([
                                layer.width * settings.value[0] / 100,
                                layer.height * settings.value[1] / 100,
                                layer.height * settings.value[2] / 100
                            ]);
                        }
                        if (typeof settings.expression === 'string') {
                            effect(1).expression = settings.expression;
                        }
                        break;
                    }
                    case 'Angle': {
                        var effect = layer.effect.addProperty('ADBE Angle Control');
                        effect.name = settings.name;
                        if (typeof settings.value === 'number') {
                            effect(1).setValue(settings.value);
                        }
                        if (typeof settings.expression === 'string') {
                            effect(1).expression = settings.expression;
                        }
                        break;
                    }
                    case 'Checkbox': {
                        var effect = layer.effect.addProperty('ADBE Checkbox Control');
                        effect.name = settings.name;
                        if (settings.value != null) {
                            effect(1).setValue(!!settings.value);
                        }
                        if (typeof settings.expression === 'string') {
                            effect(1).expression = settings.expression;
                        }
                        break;
                    }
                    case 'Color': {
                        var effect = layer.effect.addProperty('ADBE Color Control');
                        effect.name = settings.name;
                        if (settings.value) {
                            effect(1).setValue(settings.value);
                        }
                        if (typeof settings.expression === 'string') {
                            effect(1).expression = settings.expression;
                        }
                        break;
                    }
                    case 'Dropdown Menu': {
                        var effect = layer.effect.addProperty('ADBE Dropdown Control');
                        effect(1).setPropertyParameters(settings.items);
                        effect = layer.effect(layer.effect.numProperties); // refresh
                        effect.name = settings.name;
                        if (typeof settings.value === 'number') {
                            effect(1).setValue(settings.value);
                        }
                        if (typeof settings.expression === 'string') {
                            effect(1).expression = settings.expression;
                        }
                        break;
                    }
                    case 'Layer': {
                        var effect = layer.effect.addProperty('ADBE Layer Control');
                        effect.name = settings.name;
                        break;
                    }
                    case 'Point': {
                        var effect = layer.effect.addProperty('ADBE Point Control');
                        effect.name = settings.name;
                        if (settings.value) {
                            effect(1).setValue([
                                layer.width * settings.value[0] / 100,
                                layer.height * settings.value[1] / 100
                            ]);
                        }
                        if (typeof settings.expression === 'string') {
                            effect(1).expression = settings.expression;
                        }
                        break;
                    }
                    case 'Slider': {
                        var effect = layer.effect.addProperty('ADBE Slider Control');
                        effect.name = settings.name;
                        if (typeof settings.value === 'number') {
                            effect(1).setValue(settings.value);
                        }
                        if (typeof settings.expression === 'string') {
                            effect(1).expression = settings.expression;
                        }
                        break;
                    }
                }
            }
            catch (e) {
                alert(e);
            }
            finally {
                app.endUndoGroup();
            }
        },
        'createPseudo': function (prop, message) {
            var layer = getLayerOf(prop);
            if (!isAVLayer(layer)) {
                return;
            }
            try {
                app.beginUndoGroup("".concat(SCRIPT_NAME, ": ").concat(message.scope, "::").concat(message.action));
                var config = message.payload;
                Atarabi.pseudo.apply(config, layer);
            }
            catch (e) {
                alert(e);
            }
            finally {
                app.endUndoGroup();
            }
        },
    });
    function findCallStart(src, pos) {
        var i = pos;
        var lastValid = pos;
        var prev = 1;
        var inSpace = false;
        while (i > 0) {
            var c = src[i - 1];
            if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
                inSpace = true;
                i--;
                continue;
            }
            if (/[A-Za-z0-9_$]/.test(c)) {
                if (inSpace && prev === 1)
                    break; // ident space ident
                prev = 1;
                inSpace = false;
                lastValid = i - 1;
                i--;
                continue;
            }
            if (c === '.') {
                if (inSpace && prev === 2)
                    break; // dot space dot
                prev = 2;
                inSpace = false;
                lastValid = i - 1;
                i--;
                continue;
            }
            break;
        }
        return lastValid;
    }
    function findCallEnd(src, pos) {
        var i = pos;
        while (i < src.length && src[i] !== '(')
            i++;
        if (src[i] !== '(')
            return null;
        var depth = 0;
        for (; i < src.length; i++) {
            if (src[i] === '(')
                depth++;
            else if (src[i] === ')') {
                depth--;
                if (depth === 0)
                    return i + 1;
            }
        }
        return null;
    }
    function findCallOffset(src, line, column) {
        var i = 0;
        var l = 0;
        while (i < src.length && l < line) {
            var c = src[i++];
            if (c === '\n') {
                l++;
            }
            else if (c === '\r') {
                l++;
                if (src[i] === '\n')
                    i++;
            }
        }
        return i + column;
    }
    function replaceCall(src, position, replacement) {
        var line = position[0], column = position[1];
        var offset = findCallOffset(src, line, column);
        var start = findCallStart(src, offset);
        var end = findCallEnd(src, offset);
        return src.slice(0, start) + replacement + "/*".concat(src.slice(start, end), "*/") + src.slice(end);
    }
    function getFavoriteFontFamilyList() {
        var list = app.fonts.favoriteFontFamilyList;
        if (list == null) {
            return [];
        }
        return list;
    }
    function getAllFonts() {
        var fontFamilies = [];
        var done = {};
        for (var _i = 0, _a = app.fonts.allFonts; _i < _a.length; _i++) {
            var font = _a[_i];
            var familyName = font[0].familyName;
            if (done[familyName]) {
                continue;
            }
            done[familyName] = true;
            fontFamilies.push(font[0].familyName);
        }
        return fontFamilies;
    }
    register('@font', {
        'bakeFavorites': function (prop, message) {
            try {
                app.beginUndoGroup("".concat(SCRIPT_NAME, ": ").concat(message.scope, "::").concat(message.action));
                var expression = prop.expression;
                prop.expression = replaceCall(expression, message.payload, Atarabi.JSON.stringify(getFavoriteFontFamilyList()));
            }
            catch (e) {
                alert(e);
            }
            finally {
                app.endUndoGroup();
            }
        },
        'bakeAll': function (prop, message) {
            try {
                app.beginUndoGroup("".concat(SCRIPT_NAME, ": ").concat(message.scope, "::").concat(message.action));
                var expression = prop.expression;
                prop.expression = replaceCall(expression, message.payload, Atarabi.JSON.stringify(getAllFonts()));
            }
            catch (e) {
                alert(e);
            }
            finally {
                app.endUndoGroup();
            }
        },
    });
    function getPropertyFromIndices(comp, indices) {
        var property = comp.layer(indices[0]);
        for (var i = 1; i < indices.length; i++) {
            property = property(indices[i]);
        }
        return property;
    }
    function getValue(prop, time, preExpression) {
        if (prop instanceof PropertyGroup || prop instanceof MaskPropertyGroup) {
            return prop.name;
        }
        switch (prop.propertyValueType) {
            case PropertyValueType.COLOR:
            case PropertyValueType.LAYER_INDEX:
            case PropertyValueType.MASK_INDEX:
            case PropertyValueType.OneD:
            case PropertyValueType.ThreeD:
            case PropertyValueType.ThreeD_SPATIAL:
            case PropertyValueType.TwoD:
            case PropertyValueType.TwoD_SPATIAL:
                return prop.valueAtTime(time, preExpression);
            case PropertyValueType.CUSTOM_VALUE:
                return 'custom';
            case PropertyValueType.NO_VALUE:
                return 'no value';
            case PropertyValueType.SHAPE: {
                var _a = prop.valueAtTime(time, preExpression), closed = _a.closed, vertices = _a.vertices, inTangents = _a.inTangents, outTangents = _a.outTangents;
                return { closed: closed, vertices: vertices, inTangents: inTangents, outTangents: outTangents };
            }
            case PropertyValueType.TEXT_DOCUMENT: {
                var textDocument = prop.valueAtTime(time, preExpression);
                return textDocument.text;
            }
        }
    }
    register('@property', {
        'bakeValue': function (prop, message) {
            var comp = getLayerOf(prop).containingComp;
            var targetProp = getPropertyFromIndices(comp, message.payload.indices);
            try {
                app.beginUndoGroup("".concat(SCRIPT_NAME, ": ").concat(message.scope, "::").concat(message.action));
                var expression = prop.expression;
                prop.expression = replaceCall(expression, message.payload.position, Atarabi.JSON.stringify(getValue(targetProp, message.payload.time, message.payload.preExpression)));
            }
            catch (e) {
                alert(e);
            }
            finally {
                app.endUndoGroup();
            }
        },
    });
})();
