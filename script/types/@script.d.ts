declare var Atarabi: Atarabi;

declare interface Atarabi {
    version: string;
    JSON: Atarabi.JSON;
    app: Atarabi.App;
    label: Atarabi.Label;
    item: Atarabi.Item_;
    comp: Atarabi.Comp;
    layer: Atarabi.Layer_;
    effect: Atarabi.Effect;
    property: Atarabi.Property_;
    register: Atarabi.Register;
    UI: Atarabi.UI;
    clipboard: Atarabi.Clipboard;
}

declare namespace Atarabi {

    // R,G,B: [0, 1]
    type Color = [number, number, number];

    // R,G,B,A: [0, 1]
    type ColorA = [number, number, number, number];

    type Vector2 = [number, number];

    type Vector3 = [number, number, number];

    type Rect = { left: number; top: number; width: number; height: number; };

    type Brand<T extends string> = string & { __brand: T };

    type Uuid = Brand<'Uuid'>;

    interface JSON {
        // by json2.js
        stringify(value: any, replacer?: (string | number)[] | ((key: string, value: any) => any), space?: number | string): string;
        parse(text: string, reviver?: (key: string, value: any) => any): any;
        // -----------
        isValid(text: string): boolean;
        isValidFile(file: File): boolean;
        parseFast(text: string): any;
    }

    interface App {
        colorPicker(initialColor: Atarabi.Color): Atarabi.Color | null;
        getColor(colorType: App.ColorType): Atarabi.Color | null;
        getBackgroundColor(): Atarabi.Color;
        debounce(callback: () => void, delay: number): () => void;
    }

    namespace App {
        type ColorType = 'Frame' | 'Fill' | 'Text' | 'Light Tinge' | 'Dark Tinge' | 'Hilite' | 'Shadow' | 'Button Frame' | 'Button Fill' | 'Button Text' | 'Button Light Tinge' | 'Button Dark Tinge' | 'Button Hilite' | 'Button Shadow' | 'Button Pressed Frame' | 'Button Pressed Fill' | 'Button Pressed Text' | 'Button Pressed Light Tinge' | 'Button Pressed Dark Tinge' | 'Button Pressed Hilite' | 'Button Pressed Shadow' | 'Frame Disabled' | 'Fill Disabled' | 'Text Disabled' | 'Light Tinge Disabled' | 'Dark Tinge Disabled' | 'Hilite Disabled' | 'Shadow Disabled' | 'Button Frame Disabled' | 'Button Fill Disabled' | 'Button Text Disabled' | 'Button Light Tinge Disabled' | 'Button Dark Tinge Disabled' | 'Button Hilite Disabled' | 'Button Shadow Disabled' | 'Button Pressed Frame Disabled' | 'Button Pressed Fill Disabled' | 'Button Pressed Text Disabled' | 'Button Pressed Light Tinge Disabled' | 'Button Pressed Dark Tinge Disabled' | 'Button Pressed Hilite Disabled' | 'Button Pressed Shadow Disabled' | 'Tlw Needle Current Time' | 'Tlw Needle Preview Time' | 'Tlw Cache Mark Mem' | 'Tlw Cache Mark Disk' | 'Tlw Cache Mark Mix' | 'Fill Light' | 'Hot Text' | 'Hot Text Disabled' | 'Label 0' | 'Label 1' | 'Label 2' | 'Label 3' | 'Label 4' | 'Label 5' | 'Label 6' | 'Label 7' | 'Label 8' | 'Label 9' | 'Label 10' | 'Label 11' | 'Label 12' | 'Label 13' | 'Label 14' | 'Label 15' | 'Label 16' | 'Tlw Cache Mark Mem Dubious' | 'Tlw Cache Mark Disk Dubious' | 'Tlw Cache Mark Mix Dubious' | 'Hot Text Pressed' | 'Hot Text Warning' | 'Pure Black' | 'Pure White' | 'Panel Background' | 'List Box Fill' | 'Dark Caption Fill' | 'Dark Caption Text' | 'Text On Lighter Bg';
    }

    interface Label {
        setColor(index: number, color: Color): void;
        getColor(index: number): Color;
    }
    
    interface Item_ {
        getActiveItem(): Item | null;
    }

    interface Comp {
        getMostRecentlyUsedComp(): CompItem | null;

        // if true, comp shows layer names
        getShowLayerNameOrSourceName(comp: CompItem): boolean;

        setShowLayerNameOrSourceName(comp: CompItem, set: boolean): void;

        getShowBlendModes(comp: CompItem): boolean;

        setShowBlendModes(comp: CompItem, set: boolean): void;

        renderFrame(comp: CompItem, options?: { time?: number; downsample?: number; timestamp?: number }): { binary: string | null; timestamp: number; };

        // 8, 16bpc, default: downsample=1
        saveFrameToPng(comp: CompItem, file: File, options?: { time?: number; downsample?: number; }): void;

        // 8bpc, default: downsample=1, quality=80
        saveFrameToJpg(comp: CompItem, file: File, options?: { time?: number; downsample?: number; quality?: number; }): void;

        // 8, 16, 32bpc, default: downsample=1
        saveFrameToHdr(comp: CompItem, file: File, options?: { time?: number; downsample?: number; }): void;

        // 8bpc, default: downsample=1
        saveFrameToClipboard(comp: CompItem, options?: { time?: number; downsample?: number; }): void;

        // 8bpc, default: downsample=1, skip=0, speed=1
        saveFramesToGif(comp: CompItem, startTime: number, endTime: number, file: File, options?: { downsample?: number; skip?: number; speed?: number; }): void;

        // 8pbc, default: downsample=1, skip=0, speed=1
        saveFramesToApng(comp: CompItem, startTime: number, endTime: number, file: File, options?: { downsample?: number; skip?: number; speed?: number; }): void;
    }

    interface Layer_ {
        getActiveLayer(): Layer | null;

        getID(layer: Layer): number;

        // default: set=true
        setNull(layer: AVLayer, set?: boolean): void;

        getBounds(layer: AVLayer, options?: { time?: number }): Rect;

        getMaskBounds(layer: AVLayer, options?: { time?: number; }): Rect;

        // default: binary=false
        getMoments(layer: AVLayer, options?: { time?: number; binary?: boolean; }): Moments;

        // 8, 16bpc, default: downsample=1
        saveFrameToPng(layer: AVLayer, file: File, options?: { time?: number; downsample?: number; }): void;

        // 8bpc, default: downsample=1, quality=80
        saveFrameToJpg(layer: AVLayer, file: File, options?: { time?: number; downsample?: number; quality?: number; }): void;

        // 8, 16, 32bpc, default: downsample=1
        saveFrameToHdr(layer: AVLayer, file: File, options?: { time?: number; downsample?: number; }): void;

        // 8bpc, default: downsample=1
        saveFrameToClipboard(layer: AVLayer, options?: { time?: number; downsample?: number; }): void;

        // 8bpc, default: downsample=1, skip=0, speed=1
        saveFramesToGif(layer: AVLayer, startTime: number, endTime: number, file: File, options?: { downsample?: number; skip?: number; speed?: number; }): void;

        // 8bpc, default: downsample=1, skip=0, speed=1
        saveFramesToApng(layer: AVLayer, startTime: number, endTime: number, file: File, options?: { downsample?: number; skip?: number; speed?: number; }): void;

        sampleImage(layer: AVLayer, points: readonly Readonly<Vector2>[], options?: { time?: number; }): ColorA[];
    }

    type Moments = {
        m00: number; m10: number; m01: number; m20: number; m11: number; m02: number; m30: number; m21: number; m12: number; m03: number;
        mu20: number; mu11: number; mu02: number; mu30: number; mu21: number; mu12: number; mu03: number;
    };

    interface Effect {
        updateParamUI(effect: PropertyGroup): void;
    }

    interface Property_ {
        // effect's property only
        getParamDef(property: Property): ParamDef;

        // effect's property only
        getPropertyParameters(property: Property): string;

        // not supported: marker, text_document, custom value is expressed in base64 format
        // default: preExpression=false
        getValue(property: Property, options?: { time?: number; preExpression?: boolean; }): ValueType;

        // not supported: marker, text_document, custom value must be expressed in base64 format
        // default: key=false
        setValue(property: Property, value: Readonly<ValueType>, options?: { time?: number; key?: boolean; }): void;

        // not supported: marker, text_document, custom value is expressed in base64 format
        getValueAtKey(property: Property, ketIndex: number): ValueType;

        // not supported: marker, text_document, custom value must be expressed in base64 format
        setValueAtKey(property: Property, value: Readonly<ValueType>, keyIndex: number): void;

        getKeyParameters(property: Property, keyIndex: number): KeyParameters;

        setKeyParameters(property: Property, keyIndex: number, params: Readonly<KeyParameters>): void;

        isModified(property: PropertyBase): boolean;

        isHidden(property: PropertyBase): boolean;

        setHidden(property: PropertyBase, set: boolean): void;

        getExpression(property: Property): string;

        setExpression(property: Property, expression: string): void;

        userChangedParam(property: Property): void;

        clickButton(property: Property): void;
    }

    type ValueType = boolean | number | Vector2 | Vector3 | Color | ColorA | string | PathValue;

    type PathValue = {
        closed: boolean;
        vertices: Vector2[];
        inTangents?: Vector2[];
        outTangents?: Vector2[];
    }

    type KeyParameters = {
        inInterpolationType?: KeyInterpolationType;
        outInterpolationType?: KeyInterpolationType;
        inTemporalEase?: KeyEase[];
        outTemporalEase?: KeyEase[];
        temporalAutoBezier?: boolean;
        temporalContinuous?: boolean;
        // spatial
        inSpatialTangent?: number[];
        outSpatialTangent?: number[];
        spatialAutoBezier?: boolean;
        spatialContinuous?: boolean;
        roving?: boolean;
    };

    type KeyInterpolationType = 'LINEAR' | 'BEZIER' | 'HOLD';

    type KeyEase = { speed: number; influence: number; };

    interface Register {
        insertCommand(menu: Register.Menu, order: Register.Order, name: string, fn: Register.CommandFunc, enabledWhen?: Register.EnabledWhen): Uuid;

        hookCommand(commandId: number, fn: Register.HookCoomandFunc): Uuid;

        unhookCommand(commandId: number, uuid: Uuid): boolean;

        // extension: [a-z0-9]{3}
        importFlavor(extension: string, fn: Register.ImportFlavorFunc): void;
    }

    namespace Register {

        type Menu = 'Apple' | 'File' | 'Edit' | 'Composition' | 'Layer' | 'Effect' | 'Window' | 'Floaters' | 'KfAssist' | 'Import' | 'SaveFrameAs' | 'Prefs' | 'Export' | 'Animation' | 'Purge' | 'New';

        type Order = 'Sorted' | 'AtBottom' | 'AtTop';

        type CommandFunc = () => void;

        type EnabledWhen = 'Any' | 'ItemActive' | 'FolderActive' | 'CompActive' | 'LayerSelected';

        type HookCoomandFunc = (context?: HookCommandContext) => void;

        type HookCommandContext = { readonly uuid: Uuid; fallback: boolean; stopIteration: boolean; };

        type ImportFlavorFunc = (info?: ImportFlavorInfo) => void;

        type ImportFlavorInfo = { readonly path: string; };
    }

    interface UI {
        // returns -1 if no item is selected, cheked is win only
        showContextMenu(items: { text: string; checked?: boolean; }[]): number;

        progress(title: string, total: number, fn: UI.ProgressFunc): void;
    }

    namespace UI {
        type ProgressFunc = (context?: ProgressContext) => void;

        type ProgressContext = { readonly index: number; readonly total: number; stopIteration: boolean; };
    }

    interface Clipboard {
        getText(): string;
        setText(text: string): void;
    }

    /*
    * Property
    */
    type ParamDef = LayerDef | SliderDef | FixedSliderDef | AngleDef | CheckBoxDef | ColorDef | PointDef | PopupDef | CustomDef | NoDataDef | FloatSliderDef | ArbitraryDef | PathDef | ButtonDef | Point3DDef | GroupStartDef | GroupEndDef;

    interface LayerDef {
        type: 'Layer';
        target: 'Source' | 'Masks' | 'Effects & Masks';
        dephault: number;
    }

    interface SliderDef {
        type: 'Slider';
        validMin: number;
        validMax: number;
        sliderMin: number;
        sliderMax: number;
        dephault: number;
    }

    interface FixedSliderDef {
        type: 'Fixed Slider';
        validMin: number;
        validMax: number;
        sliderMin: number;
        sliderMax: number;
        dephault: number;
        precision: number;
        display: 'none' | 'percent' | 'pixel';
    }

    interface AngleDef {
        type: 'Angle';
        dephault: number;
    }

    interface CheckBoxDef {
        type: 'Check Box';
        dephault: boolean;
        text: string;
    }

    interface ColorDef {
        type: 'Color';
        dephault: Color;
    }

    interface PointDef {
        type: 'Point';
        dephault: Vector2; // percentage
        restrictBounds: boolean;
    }

    interface PopupDef {
        type: 'Popup';
        numChoices: number;
        dephault: number;
        menu: string;
    }

    interface CustomDef {
        type: 'Custom';
    }

    interface NoDataDef {
        type: 'No Data';
    }

    interface FloatSliderDef {
        type: 'Float Slider';
        validMin: number;
        validMax: number;
        sliderMin: number;
        sliderMax: number;
        dephault: number;
        precision: number;
        display: 'none' | 'percent' | 'pixel';
    }

    interface ArbitraryDef {
        type: 'Arbitrary';
    }

    interface PathDef {
        type: 'Path';
        dephault: number;
    }

    interface ButtonDef {
        type: 'Button';
        text: string;
    }

    interface Point3DDef {
        type: 'Point 3D';
        dephault: Vector3; // percentage
    }

    interface GroupStartDef {
        type: 'Group Start';
    }

    interface GroupEndDef {
        type: 'Group End';
    }
}
