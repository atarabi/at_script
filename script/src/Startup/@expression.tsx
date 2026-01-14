/**
 * for @expression(https://github.com/atarabi/at_expression)
 */
(() => {

    if (Atarabi.isDynamicLink()) {
        return;
    }

    const SCRIPT_NAME = '@expression';

    Atarabi.keyboard.hook({ code: 'E', altKey: true }, ctx => {
        main();
        return true;
    });

    function main() {
        const comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return;
        }
        const props = comp.selectedProperties.slice();
        for (const prop of props) {
            if (!(prop instanceof Property && prop.canVaryOverTime && prop.canSetExpression)) {
                continue;
            }

            const expressionError = prop.expressionError;
            if (!expressionError) {
                continue;
            }
            let message = null;
            try {
                message = Atarabi.JSON.parse(extractMessage(expressionError));
            } catch (e) {
                continue;
            }
            interpretMessage(prop, message);
        }
    }

    type DispatchFunc = (prop: Property, message: Atarabi.Expression.Action) => void;
    type HandlerMap<Key extends string = string> = Record<Key, DispatchFunc>;
    type ScopedHandlers = Record<string, HandlerMap>;

    const REGISTERED_HANDLERS: ScopedHandlers = {};

    function register<Actions extends { scope: string; action: string; }>(scope: Actions["scope"], handlers: HandlerMap<Actions["action"]>) {
        const target = REGISTERED_HANDLERS[scope];
        if (!target) {
            REGISTERED_HANDLERS[scope] = handlers;
            return;
        }

        for (let key in handlers) {
            if (handlers.hasOwnProperty(key)) {
                target[key] = handlers[key];
            }
        }
        REGISTERED_HANDLERS[scope] = handlers;
    }

    function resolve(scope: string, action: string): DispatchFunc | null {
        const handlers = REGISTERED_HANDLERS[scope];
        if (!handlers) {
            return null;
        }
        const handle = handlers[action];
        if (!handle) {
            return null;
        }
        return handle;
    }

    function extractMessage(text: string): string {
        return text
            .split(/\r\n|\r|\n/)
            .slice(2)
            .join("\n");
    }

    function getLayerOf(prop: PropertyBase): Layer {
        return prop.propertyGroup(prop.propertyDepth) as Layer;
    }

    function isAVLayer(layer: Layer): layer is AVLayer {
        return layer instanceof TextLayer || layer instanceof ShapeLayer || layer instanceof AVLayer;
    }

    function interpretMessage(prop: Property, message: Atarabi.Expression.Action) {
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
        const dispatch = resolve(message.scope, message.action);
        if (dispatch) {
            dispatch(prop, message);
        }
    }

    register<Atarabi.Expression.Effect.Actions>('@effect', {
        'createEffect': (prop: Property, message: Atarabi.Expression.Effect.CreateEffectAction) => {
            const layer = getLayerOf(prop);
            if (!isAVLayer(layer)) {
                return;
            }
            const settings = message.payload;
            if (!layer.effect.canAddProperty(settings.matchName)) {
                throw new Error(`Unable to add "${settings.matchName}"`);
            }

            try {
                app.beginUndoGroup(`${SCRIPT_NAME}: ${message.scope}::${message.action}`);
                const effect = layer.effect.addProperty(settings.matchName) as PropertyGroup;
                effect.name = settings.name;
                if (settings.parameters != null) {
                    for (const key in settings.parameters) {
                        const param = settings.parameters[key];
                        if (param.value != null) {
                            (effect(key) as Property).setValue(param.value);
                        }
                        if (typeof param.expression === 'string') {
                            (effect(key) as Property).expression = param.expression;
                        }
                    }
                }
            } catch (e) {
                alert(e);
            } finally {
                app.endUndoGroup();
            }
        },
        'createExpressionControl': (prop: Property, message: Atarabi.Expression.Effect.CreateExpressionControlAction) => {
            const layer = getLayerOf(prop);
            if (!isAVLayer(layer)) {
                return;
            }
            try {
                app.beginUndoGroup(`${SCRIPT_NAME}: ${message.scope}::${message.action}`);
                const settings = message.payload;
                switch (settings.type) {
                    case '3D Point': {
                        const effect = layer.effect.addProperty('ADBE Point3D Control') as PropertyGroup;
                        effect.name = settings.name;
                        if (settings.value) {
                            (effect(1) as Property).setValue([
                                layer.width * settings.value[0] / 100,
                                layer.height * settings.value[1] / 100,
                                layer.height * settings.value[2] / 100
                            ]);
                        }
                        if (typeof settings.expression === 'string') {
                            (effect(1) as Property).expression = settings.expression;
                        }
                        break;
                    }
                    case 'Angle': {
                        const effect = layer.effect.addProperty('ADBE Angle Control') as PropertyGroup;
                        effect.name = settings.name;
                        if (typeof settings.value === 'number') {
                            (effect(1) as Property).setValue(settings.value);
                        }
                        if (typeof settings.expression === 'string') {
                            (effect(1) as Property).expression = settings.expression;
                        }
                        break;
                    }
                    case 'Checkbox': {
                        const effect = layer.effect.addProperty('ADBE Checkbox Control') as PropertyGroup;
                        effect.name = settings.name;
                        if (settings.value != null) {
                            (effect(1) as Property).setValue(!!settings.value);
                        }
                        if (typeof settings.expression === 'string') {
                            (effect(1) as Property).expression = settings.expression;
                        }
                        break;
                    }
                    case 'Color': {
                        const effect = layer.effect.addProperty('ADBE Color Control') as PropertyGroup;
                        effect.name = settings.name;
                        if (settings.value) {
                            (effect(1) as Property).setValue(settings.value);
                        }
                        if (typeof settings.expression === 'string') {
                            (effect(1) as Property).expression = settings.expression;
                        }
                        break;
                    }
                    case 'Dropdown Menu': {
                        let effect = layer.effect.addProperty('ADBE Dropdown Control') as PropertyGroup;
                        (effect(1) as Property).setPropertyParameters(settings.items);
                        effect = layer.effect(layer.effect.numProperties) as PropertyGroup; // refresh
                        effect.name = settings.name;
                        if (typeof settings.value === 'number') {
                            (effect(1) as Property).setValue(settings.value);
                        }
                        if (typeof settings.expression === 'string') {
                            (effect(1) as Property).expression = settings.expression;
                        }
                        break;
                    }
                    case 'Layer': {
                        const effect = layer.effect.addProperty('ADBE Layer Control') as PropertyGroup;
                        effect.name = settings.name;
                        break;
                    }
                    case 'Point': {
                        const effect = layer.effect.addProperty('ADBE Point Control') as PropertyGroup;
                        effect.name = settings.name;
                        if (settings.value) {
                            (effect(1) as Property).setValue([
                                layer.width * settings.value[0] / 100,
                                layer.height * settings.value[1] / 100
                            ]);
                        }
                        if (typeof settings.expression === 'string') {
                            (effect(1) as Property).expression = settings.expression;
                        }
                        break;
                    }
                    case 'Slider': {
                        const effect = layer.effect.addProperty('ADBE Slider Control') as PropertyGroup;
                        effect.name = settings.name;
                        if (typeof settings.value === 'number') {
                            (effect(1) as Property).setValue(settings.value);
                        }
                        if (typeof settings.expression === 'string') {
                            (effect(1) as Property).expression = settings.expression;
                        }
                        break;
                    }
                }
            } catch (e) {
                alert(e);
            } finally {
                app.endUndoGroup();
            }
        },
        'createPseudo': (prop: Property, message: Atarabi.Expression.Effect.CreatePseudoAction) => {
            const layer = getLayerOf(prop);
            if (!isAVLayer(layer)) {
                return;
            }
            try {
                app.beginUndoGroup(`${SCRIPT_NAME}: ${message.scope}::${message.action}`);
                const config = message.payload;
                Atarabi.pseudo.apply(config, layer);
            } catch (e) {
                alert(e);
            } finally {
                app.endUndoGroup();
            }
        },
    });

    function findCallStart(src: string, pos: number): number {
        let i = pos;
        let lastValid = pos;

        type Prev = 1 | 2; // 1=ident, 2=dot
        let prev: Prev = 1;
        let inSpace = false;

        while (i > 0) {
            const c = src[i - 1];
            if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
                inSpace = true;
                i--;
                continue;
            }
            if (/[A-Za-z0-9_$]/.test(c)) {
                if (inSpace && prev === 1) break; // ident space ident
                prev = 1;
                inSpace = false;
                lastValid = i - 1;
                i--;
                continue;
            }
            if (c === '.') {
                if (inSpace && prev === 2) break; // dot space dot
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

    function findCallEnd(src: string, pos: number): number | null {
        let i = pos;
        while (i < src.length && src[i] !== '(') i++;
        if (src[i] !== '(') return null;
        let depth = 0;
        for (; i < src.length; i++) {
            if (src[i] === '(') depth++;
            else if (src[i] === ')') {
                depth--;
                if (depth === 0) return i + 1;
            }
        }
        return null;
    }

    function findCallOffset(src: string, line: number, column: number): number {
        let i = 0;
        let l = 0;
        while (i < src.length && l < line) {
            const c = src[i++];
            if (c === '\n') {
                l++;
            } else if (c === '\r') {
                l++;
                if (src[i] === '\n') i++;
            }
        }
        return i + column;
    }

    function replaceCall(src: string, position: [number, number], replacement: string) {
        const [line, column] = position;
        const offset = findCallOffset(src, line, column);
        const start = findCallStart(src, offset);
        const end = findCallEnd(src, offset);
        return src.slice(0, start) + replacement + `/*${src.slice(start, end)}*/` + src.slice(end);
    }

    function getFavoriteFontFamilyList() {
        const list = app.fonts.favoriteFontFamilyList;
        if (list == null) {
            return [];
        }
        return list;
    }

    function getAllFonts() {
        const fontFamilies: string[] = [];
        const done: Record<string, boolean> = {};
        for (const font of app.fonts.allFonts) {
            const familyName = font[0].familyName;
            if (done[familyName]) {
                continue;
            }
            done[familyName] = true;
            fontFamilies.push(font[0].familyName);
        }
        return fontFamilies;
    }

    register<Atarabi.Expression.Font.Actions>('@font', {
        'bakeFavorites': (prop: Property, message: Atarabi.Expression.Font.BakeFavoritesAction) => {
            try {
                app.beginUndoGroup(`${SCRIPT_NAME}: ${message.scope}::${message.action}`);
                const expression = prop.expression;
                prop.expression = replaceCall(expression, message.payload, Atarabi.JSON.stringify(getFavoriteFontFamilyList()));
            } catch (e) {
                alert(e);
            } finally {
                app.endUndoGroup();
            }
        },
        'bakeAll': (prop: Property, message: Atarabi.Expression.Font.BakeAllAction) => {
            try {
                app.beginUndoGroup(`${SCRIPT_NAME}: ${message.scope}::${message.action}`);
                const expression = prop.expression;
                prop.expression = replaceCall(expression, message.payload, Atarabi.JSON.stringify(getAllFonts()));
            } catch (e) {
                alert(e);
            } finally {
                app.endUndoGroup();
            }
        },
    });

    function getPropertyFromIndices(comp: CompItem, indices: number[]): Property | PropertyGroup {
        let property: Property | PropertyGroup = comp.layer(indices[0]);
        for (let i = 1; i < indices.length; i++) {
            property = (property as PropertyGroup)(indices[i]);
        }
        return property;
    }

    function getValue(prop: Property | PropertyGroup, time: number, preExpression: boolean) {
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
                let { closed, vertices, inTangents, outTangents } = prop.valueAtTime(time, preExpression) as Shape;
                return { closed, vertices, inTangents, outTangents };
            }
            case PropertyValueType.TEXT_DOCUMENT: {
                let textDocument = prop.valueAtTime(time, preExpression) as TextDocument;
                return textDocument.text;
            }
        }
    }

    register<Atarabi.Expression.Property.Actions>('@property', {
        'bakeValue': (prop: Property, message: Atarabi.Expression.Property.BakeValueAction) => {
            const comp = getLayerOf(prop).containingComp;
            const targetProp = getPropertyFromIndices(comp, message.payload.indices);
            try {
                app.beginUndoGroup(`${SCRIPT_NAME}: ${message.scope}::${message.action}`);
                const expression = prop.expression;
                prop.expression = replaceCall(expression, message.payload.position, Atarabi.JSON.stringify(getValue(targetProp, message.payload.time, message.payload.preExpression)));
            } catch (e) {
                alert(e);
            } finally {
                app.endUndoGroup();
            }
        },
    });

})();