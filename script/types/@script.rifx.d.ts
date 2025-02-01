// WIP: subject to change
declare namespace Atarabi {

    interface RIFX {
        decode(chunk: RIFX.Chunk): RIFX.DecodedChunk;

        encode(chunk: RIFX.DecodedChunk): RIFX.Chunk;
    }

    namespace RIFX {

        type DecodedChunk = { id: string; data: any; list?: DecodedChunk[]; cosList?: string; } & { __brand: 'Decoded' };
        type Int8 = number;
        type Int16 = number;
        type Int32 = number;
        type Fixed32 = number; // Fixed is converted to float
        type Float32 = number;
        type Float64 = number;
        type FixedString = { text: string; readonly length: number; };
        type VariableString = { text: string; utf8: boolean; }; // 0x03 0x5C: support utf8

        // match name
        interface Tdmn {
            id: 'tdmn';
            data: FixedString; // length=40
        }

        // effect name
        interface Fnam {
            id: 'fnam';
            data: VariableString;
        }

        // stream name
        interface Tdsn {
            id: 'tdsn';
            data: VariableString;
        }

        interface Tdpl {
            id: 'tdpl';
            data: Int32;
        }

        interface Tdix {
            id: 'tdix';
            data: Int32;
        }

        // AEGP_DynStreamFlags?
        interface Tdsb {
            id: 'tdsb';
            data: Int32;
        }

        // layer id
        interface Tdpi {
            id: 'tdpi';
            data: Int32;
        }

        // layer source
        interface Tdps {
            id: 'tdps';
            data: Int32;
        }

        // min
        interface Tdum {
            id: 'tdum';
            data: Float64;
        }

        // max
        interface TduM {
            id: 'tduM';
            data: Float64;
        }

        interface Tdb4 {
            id: 'tdb4';
            data: string; // 124bytes
        }

        interface Cdat {
            id: 'cdat';
            data: Float64[];
        }

        // mask index
        interface Tdli {
            id: 'tdli';
            data: Int32;
        }

        // number of parameter
        interface Parn {
            id: 'parn';
            data: Int32;
        }

        // definition of pard
        interface Pard {
            id: 'pard';
            data: ParamDef; // 148 byte
        }

        // popup, checkbox string
        interface Pdnm {
            id: 'pdnm';
            data: VariableString;
        }

        type ParamDef = LayerDef | SliderDef | FixedSliderDef | AngleDef | CheckboxDef | ColorDef | PointDef | PopupDef | NoDataDef | FloatSliderDef | ArbitraryDataDef | PathDef | GroupStartDef | GroupEndDef | ButtonDef | Point3DDef | UnknownDef;
        type UiParam = { uiWidth: Int16; uiHeight: Int16; };
        type CommonFlags = { uiFlags: Int32; flags: Int32; };
        type Pixel = { alpha: Int8; red: Int8; green: Int8; blue: Int8; };
        type LayerDef = { type: 'layer'; name: FixedString; dephault: Int32;} & CommonFlags;
        type SliderDef = { type: 'slider'; name: FixedString; value: Int32; validMin: Int32; validMax: Int32; sliderMin: Int32; sliderMax: Int32; dephault: Int32; } & CommonFlags;
        type FixedSliderDef = { type: 'fixedSlider'; name: FixedString; value: Fixed32; validMin: Fixed32; validMax: Fixed32; sliderMin: Fixed32; sliderMax: Fixed32; dephault: Fixed32; precision: Int16; displayFlags: Int16; } & CommonFlags;
        type AngleDef = { type: 'angle'; name: FixedString; value: Fixed32; dephault: Fixed32; validMin: Fixed32; validMax: Fixed32; } & CommonFlags;
        type CheckboxDef = { type: 'checkbox'; name: FixedString; value: Int32; dephault: Int8; } & CommonFlags;
        type ColorDef = { type: 'color'; name: FixedString; value: Pixel; dephault: Pixel; } & CommonFlags;
        type PointDef = { type: 'point'; name: FixedString; xValue: Fixed32; yValue: Fixed32; restrictBounds: Int8; xDephault: Fixed32; yDephault: Fixed32; } & CommonFlags;
        type PopupDef = { type: 'popup'; name: FixedString; value: Int32; numChoices: Int16; dephault: Int16; } & CommonFlags;
        type NoDataDef = { type: 'noData'; name: FixedString; } & CommonFlags & UiParam;
        type FloatSliderDef = { type: 'floatSlider'; name: FixedString; value: Float64; phase: Float64; validMin: Float32; validMax: Float32; sliderMin: Float32; sliderMax: Float32; dephault: Float32; precision: Int16; displayFlags: Int16; fsFlags: Int32; curveTolerance: Float32; useExponent: Int8; exponent: Float32; } & CommonFlags;
        type ArbitraryDataDef = { type: 'arbitraryData'; name: FixedString; id: Int16; } & CommonFlags & UiParam;
        type PathDef = { type: 'path'; name: FixedString; pathId: Int32; dephault: Int32; } & CommonFlags;
        type GroupStartDef = { type: 'groupStart'; name: FixedString; } & CommonFlags;
        type GroupEndDef = { type: 'groupEnd'; };
        type ButtonDef = { type: 'button'; name: FixedString; value: Int32 } & CommonFlags;
        type Point3DDef = { type: 'point3D'; name: FixedString; xValue: Float64; yValue: Float64; zValue: Float64; xDephault: Float64; yDephault: Float64; zDephault: Float64; } & CommonFlags;
        type UnknownDef = { type: Int32 | -1; data: string; };
    }

}
