declare interface Atarabi {
    at: Atarabi.At;
}

declare namespace Atarabi {

    interface At {
        // common
        isAtEffect(effect: PropertyGroup): boolean;
        setCollapse(property: Property, doCollapse: boolean): void;
        // gradient
        isGradientParameter(property: Property): boolean;
        getGradientValue(property: Property, options?: { time?: number; preExpression?: boolean; }): At.GradientValue;
        setGradientValue(property: Property, value: At.GradientValue, options?: { time?: number; key?: boolean; }): void;
        getGradientValueAtKey(property: Property, keyIndex: number): At.GradientValue;
        setGradientValueAtKey(property: Property, value: At.GradientValue, keyIndex: number): void;
        // contour
        isContourParameter(property: Property): boolean;
        getContourValue(property: Property, options?: { time?: number; preExpression?: boolean; }): At.ContourValue;
        setContourValue(property: Property, value: At.ContourValue, options?: { time?: number; key?: boolean; }): void;
        getContourValueAtKey(property: Property, keyIndex: number): At.ContourValue;
        setContourValueAtKey(property: Property, value: At.ContourValue, keyIndex: number): void;
        // pat
        isPatParameter(property: Property): boolean;
        cachePat(property: Property, value: boolean): void;
        cachePatAtKey(property: Property, value: boolean, keyIndex: number): void;
        // text
        isTextParameter(property: Property): boolean;
        getTextValue(property: Property, options?: { time?: number; preExpression?: boolean; }): At.TextValue;
        setTextValue(property: Property, value: At.TextValue, options?: { time?: number; key?: boolean; }): void;
        getTextValueAtKey(property: Property, keyIndex: number): At.TextValue;
        setTextValueAtKey(property: Property, value: At.TextValue, keyIndex: number): void;
        // memo
        isMemoParameter(property: Property): boolean;
        getMemoValue(property: Property, options?: { time?: number; preExpression?: boolean; }): At.MemoValue;
        setMemoValue(property: Property, value: At.MemoValue, options?: { time?: number; key?: boolean; }): void;
        getMemoValueAtKey(property: Property, keyIndex: number): At.MemoValue;
        setMemoValueAtKey(property: Property, value: At.MemoValue, keyIndex: number): void;
        // image
        isImageParameter(property: Property): boolean;
        getImageInfo(property: Property, options?: { time?: number; preExpression?: boolean; }): Image_.Info | null;
        setImageFromFile(property: Property, file: File, options?: { time?: number; key?: boolean; }): void;
        setImageFromClipboard(property: Property, options?: { time?: number; key?: boolean; }): void;
        getImageInfoAtKey(property: Property, keyIndex: number): Image_.Info;
        setImageFromFileAtKey(property: Property, file: File, keyIndex: number): void;
        setImageFromClipboardAtKey(property: Property, keyIndex: number): void;
        // for @script_effect
        effect: At.Effect;
    }

    namespace At {

        type GradientValue = {
            link?: false;
            // value: [0, 1], location: [0, 1]
            opacities: { opacity: number; location: number; }[];
            // location: [0, 1]
            colors: { red: number; green: number; blue: number; location: number; }[];
        } | {
            link: true;
            // location: [0, 1]
            colors: { red: number; green: number; blue: number; opacity: number; location: number; }[];
        };

        interface ContourValue {
            // x: [0, 1], y: [0, 1]
            points: { x: number; y: number; corner?: boolean; }[];
            interpolation?: 0 | 1;
        }

        interface TextValue {
            text: string;
        }

        interface MemoValue {
            subject: string;
            body: string;
            checked: boolean;
        }

        interface Effect {
            getCameraMatrix(effect: PropertyGroup, time?: number): CameraMatrix;
        }

        type CameraMatrix = {
            cameraMatrix: number[][];
            dstToPlane: number;
            planeWidth: number;
            planeHeight: number;
        };
    }
}
