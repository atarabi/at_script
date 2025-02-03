// embeded in @script
(() => {
    /** START **/
    // rifx
    const isArray = (arg: any): arg is any[] => Object.prototype.toString.call(arg) === '[object Array]';

    function log2(n: number) {
        return Math.log(n) / Math.LN2;
    }

    function trunc(n: number) {
        return n < 0 ? Math.ceil(n) : Math.floor(n);
    }

    class Pack {
        static int8(n: number): string { return String.fromCharCode(n & 0xFF); }
        static int16(n: number): string { return String.fromCharCode((n >> 8) & 0xFF, n & 0xFF); }
        static int32(n: number): string { return String.fromCharCode((n >> 24) & 0xFF, (n >> 16) & 0xFF, (n >> 8) & 0xFF, n & 0xFF); }
        static float32(n: number): string {
            const sign = n < 0 ? 1 : 0;
            const absN = Math.abs(n);
            const exponent = Math.floor(log2(absN));
            const biasedExponent = exponent + 127;
            const mantissa = (absN / Math.pow(2, exponent) - 1) * Math.pow(2, 23);
            const bits = (sign << 31) | (biasedExponent << 23) | (mantissa & 0x7FFFFF);
            return String.fromCharCode((bits >> 24) & 0xFF, (bits >> 16) & 0xFF, (bits >> 8) & 0xFF, bits & 0xFF);
        }
        static fixed32(n: number): string {
            return Pack.int32(trunc(n * 65536 + (n < 0 ? -0.5 : 0.5)));
        }
        static float64(n: number): string {
            const sign = n < 0 ? 1 : 0;
            const absN = Math.abs(n);
            const exponent = Math.floor(log2(absN));
            const biasedExponent = exponent + 1023;
            const mantissa = (absN / Math.pow(2, exponent) - 1) * Math.pow(2, 52);
            const high = (sign << 31) | (biasedExponent << 20) | (mantissa / Math.pow(2, 32) & 0xFFFFF);
            const low = mantissa & 0xFFFFFFFF;
            return String.fromCharCode((high >> 24) & 0xFF, (high >> 16) & 0xFF, (high >> 8) & 0xFF, high & 0xFF, (low >> 24) & 0xFF, (low >> 16) & 0xFF, (low >> 8) & 0xFF, low & 0xFF);
        }
    }

    class Unpack {
        static int8(s: string): number { return s.charCodeAt(0); }
        static int16(s: string): number { return (s.charCodeAt(0) << 8) + s.charCodeAt(1); }
        static int32(s: string): number { return (s.charCodeAt(0) << 24) + (s.charCodeAt(1) << 16) + (s.charCodeAt(2) << 8) + s.charCodeAt(3); }
        static float32(s: string): number {
            let bits = 0;
            for (let i = 0; i < 4; i++) {
                bits = (bits << 8) | s.charCodeAt(i);
            }
            const sign = (bits >>> 31) === 0 ? 1 : -1;
            const exponent = (bits >>> 23) & 0xFF;
            const mantissa = bits & 0x7FFFFF;
            if (exponent === 0 && mantissa === 0) {
                return sign * 0;
            }
            return sign * (1 + mantissa / Math.pow(2, 23)) * Math.pow(2, exponent - 127);
        }
        static fixed32(s: string): number {
            return Unpack.int32(s) / 65536;
        }
        static float64(s: string): number {
            let high = 0;
            for (let i = 0; i < 4; i++) {
                high = (high << 8) | s.charCodeAt(i);
            }
            let low = 0;
            for (let i = 4; i < 8; i++) {
                low = (low << 8) | s.charCodeAt(i);
            }
            const sign = (high >>> 31) === 0 ? 1 : -1;
            const exponent = (high >>> 20) & 0x7FF;
            const mantissaHigh = high & 0xFFFFF;
            if (exponent === 0 && mantissaHigh === 0 && low === 0) {
                return sign * 0;
            }
            return sign * (1 + (mantissaHigh / Math.pow(2, 20)) + (low / Math.pow(2, 52))) * Math.pow(2, exponent - 1023);
        }
    }

    const enum Mode {
        Absolute = 0,
        Relative = 1,
        Backward = 2,
    }

    interface Reader {
        tell(): number;
        seek(count: number, mode: Mode): void;
        read(count: number): string;
        read(): string;
    }

    class FileReader implements Reader {
        constructor(private fp: File) { }
        private raise() {
            throw 'parse error';
        }
        tell(): number {
            return this.fp.tell();
        }
        seek(count: number, mode: Mode): void {
            const ok = this.fp.seek(count, mode);
            if (!ok) this.raise();
        }
        read(count?: number): string {
            if (typeof count !== 'number') {
                return this.fp.read();
            }
            if (count === 0) { return ''; }
            const b = this.fp.read(count);
            if (b.length !== count) this.raise();
            return b;
        }
    }

    // for "binary" string
    class StringReader implements Reader {
        private pos = 0;
        constructor(private str: string) { }
        private raise() {
            throw 'parse error';
        }
        tell(): number {
            return this.pos;
        }
        seek(count: number, mode: Mode): void {
            let pos = 0;
            switch (mode) {
                case Mode.Absolute:
                    pos = count;
                    break;
                case Mode.Relative:
                    pos = this.pos + count;
                    break;
                case Mode.Backward:
                    pos = this.str.length - count;
                    break;
            }
            if (pos < 0 || pos >= this.str.length) this.raise();
            this.pos = pos;
        }
        read(count?: number): string {
            if (typeof count !== 'number') {
                const text = this.str.substr(this.pos);
                this.pos = this.str.length;
                return text;
            }
            if (count === 0) { return ''; }
            const b = this.str.substr(this.pos, count);
            this.pos += b.length;
            if (b.length !== count) this.raise();
            return b;
        }
    }

    class Parser {
        constructor(private reader: Reader) { }
        tell(): number {
            return this.reader.tell();
        }
        seek(count: number, mode: Mode): void {
            this.reader.seek(count, mode);
        }
        read(count?: number): string {
            return this.reader.read(count);
        }
        int8(): number {
            return Unpack.int8(this.read(1));
        }
        int16(): number {
            return Unpack.int16(this.read(2));
        }
        int32(): number {
            return Unpack.int32(this.read(4));
        }
        fixed32(): number {
            return Unpack.fixed32(this.read(4));
        }
        float32(): number {
            return Unpack.float32(this.read(4));
        }
        float64(): number {
            return Unpack.float64(this.read(8));
        }
    }

    const RIFX = 'RIFX';
    const LIST = 'LIST';
    const isCOSList = (id: string) => id === 'btdk';

    type Chunk = Atarabi.RIFX.Chunk;
    type DecodedChunk = Atarabi.RIFX.DecodedChunk;

    const parseList = (parser: Parser, parent: Chunk, totalLength: number) => {
        const start = parser.tell();
        let current = 0;
        while (current < totalLength) {
            if (current + 8 > totalLength) {
                throw 'invalid chunk';
            }
            const id = parser.read(4);
            const length = parser.int32();
            if (id === LIST) {
                const listId = parser.read(4);
                if (isCOSList(listId)) {
                    const list = { id, data: listId, cosList: parser.read(length - 4) } satisfies Chunk;
                    parent.list.push(list);
                } else {
                    const list = { id, data: listId, list: [] } satisfies Chunk;
                    parent.list.push(list);
                    parseList(parser, list, length - 4);
                }
                current += 8 + length;
            } else {
                const data = parser.read(length);
                const chunk = { id, data } satisfies Chunk;
                parent.list.push(chunk);
                current += 8 + length;
                if (length % 2 === 1) {
                    parser.seek(1, Mode.Relative);
                    current += 1;
                }
            }
        }
        parser.seek(start + totalLength, Mode.Absolute);
    };

    const parseRIFX = (parser: Parser): Chunk => {
        const id = parser.read(4);
        if (id !== RIFX) {
            throw 'invalid header';
        }
        const length = parser.int32();
        const listId = parser.read(4);
        const rifx = { id, data: listId, list: [] } satisfies Chunk;
        parseList(parser, rifx, length - 4);
        return rifx;
    };

    const parse = (file: File, readToEnd: boolean = false): [Chunk, string] => {
        let rifx: Chunk = null;
        let tail: string = '';
        const newFile = new File(file.absoluteURI);
        newFile.encoding = 'binary';
        if (!newFile.open('r')) {
            throw 'unable to open file';
        }
        let err = null;
        try {
            const reader = new FileReader(newFile);
            rifx = parseRIFX(new Parser(reader));
            if (readToEnd) {
                tail = reader.read();
            }
        } catch (e) {
            err = e;
        } finally {
            newFile.close();
        }
        if (err) {
            throw err;
        }
        return [rifx, tail];
    };

    const stringify = (chunk: Chunk): string => {
        let binary = '';
        if (chunk.id === LIST && isCOSList(chunk.data)) {
            const cosList = chunk.cosList;
            binary += chunk.id;
            binary += Pack.int32(4 + cosList.length);
            binary += cosList;
        } else if (chunk.id === RIFX || chunk.id === LIST) {
            let binaries: string[] = [];
            let length = 0;
            for (const child of chunk.list) {
                const childBinary = stringify(child);
                length += childBinary.length;
                binaries.push(childBinary);
            }
            binary += chunk.id;
            binary += Pack.int32(4 + length);
            binary += chunk.data;
            binary += binaries.join('');
        } else {
            binary += chunk.id;
            binary += Pack.int32(chunk.data.length)
            binary += chunk.data;
            if (chunk.data.length % 2 === 1) {
                binary += '\0';
            }
        }
        return binary;
    };

    const size = (chunk: Chunk): number => {
        if (chunk.id === LIST && isCOSList(chunk.data)) {
            return 4 + chunk.cosList.length;
        } else if (chunk.id === RIFX || chunk.id === LIST) {
            let total = 0;
            for (const child of chunk.list) {
                const childSize = size(child);
                total += 8 + childSize;
                if (childSize % 2 === 1) {
                    total += 1;
                }
            }
            return 4 + total;
        } else {
            return chunk.data.length;
        }
    };

    const visit = <C extends Chunk>(chunk: C, fn: (chunk: C | null) => boolean): boolean => {
        if (!fn(chunk)) {
            return false;
        }
        if (chunk && (chunk.id === RIFX || chunk.id === LIST)) {
            if (chunk.list) {
                for (const child of chunk.list) {
                    if (!visit(child, fn)) {
                        return false;
                    }
                }
            }
        }
        if (!fn(null)) {
            return false;
        }
        return true;
    };

    const walk = <C extends Chunk>(chunk: C, fn: (chunk: C | null) => boolean) => {
        visit(chunk, fn);
    };

    // pseudo
    function trimNull(str: string) {
        return str.replace(/[\x00]+$/, '');
    }

    function appendNull(str: string, len: number) {
        if (str.length >= len - 1) {
            str = str.substr(0, len - 1);
        }
        return str + repeat('\0', len - str.length);
    }

    function repeat(str: string, count: number) {
        count = Math.floor(count);
        let result = '';
        while (count > 0) {
            if (count & 1) {
                result += str;
            }
            count >>>= 1;
            if (count > 0) {
                str += str;
            }
        }
        return result;
    }

    type Decoder = (chunk: Chunk) => DecodedChunk;
    type Encoder = (chunk: DecodedChunk) => Chunk;

    class ChunkCodec {
        static STORE: { [id: string]: { decoder: (chunk: Chunk) => DecodedChunk; encoder: (decoded: DecodedChunk) => Chunk; } } = {};
        static register<Decoded extends { id: string; data: any; }>(ids: string | string[], decoder: (chunk: Chunk) => Decoded, encoder: (decoded: Decoded) => Chunk) {
            if (typeof ids === 'string') {
                ids = [ids];
            }
            for (const id of ids) {
                if (ChunkCodec.STORE.hasOwnProperty(id)) {
                    throw new Error(`${id} is already registered`);
                }
                ChunkCodec.STORE[id] = { decoder: decoder as any as Decoder, encoder: encoder as any as Encoder };
            }
        }
        static decode(chunk: Chunk): DecodedChunk {
            if (ChunkCodec.STORE.hasOwnProperty(chunk.id)) {
                return ChunkCodec.STORE[chunk.id].decoder(chunk);
            }
            return chunk as DecodedChunk;
        }
        static encode(chunk: DecodedChunk): Chunk {
            if (ChunkCodec.STORE.hasOwnProperty(chunk.id)) {
                return ChunkCodec.STORE[chunk.id].encoder(chunk);
            }
            return chunk;
        }
    }

    // Fixed String
    function decodeFixedString(str: string): Atarabi.RIFX.FixedString {
        const length = str.length;
        const text = trimNull(str);
        return { text, length };
    }

    function encodeFixedString(str: Atarabi.RIFX.FixedString): string {
        return appendNull(str.text, str.length);
    }

    ChunkCodec.register(['tdmn'], chunk => {
        return { id: chunk.id, data: decodeFixedString(chunk.data) };
    }, chunk => {
        return { id: chunk.id, data: encodeFixedString(chunk.data) };
    });

    // Variable String
    function decodeVariableString(str: string): Atarabi.RIFX.VariableString {
        if (str.substr(0, 4) === 'Utf8') {
            const len = Unpack.int32(str.substr(4, 4));
            const text = str.substr(8, len);
            return { text, utf8: true };
        } else {
            const text = trimNull(str);
            return { text, utf8: false };
        }
    }

    function encodeVariableString(str: Atarabi.RIFX.VariableString): string {
        if (str.utf8) {
            return 'Utf8' + Pack.int32(str.text.length) + str.text + (str.text.length % 2 === 1 ? '\0' : '');
        } else {
            return trimNull(str.text) + '\0';
        }
    }

    const VARIABLE_STRING_CHUNKS = ['tdsn', 'pdnm', 'fnam', 'Utf8', 'expr'] as const;
    type VariableStringChunkType = (typeof VARIABLE_STRING_CHUNKS)[number];
    ChunkCodec.register(VARIABLE_STRING_CHUNKS, chunk => {
        return { id: chunk.id, data: decodeVariableString(chunk.data) };
    }, chunk => {
        return { id: chunk.id, data: encodeVariableString(chunk.data) };
    });

    // int32
    const INT32_CHUNKS = ['tdpl', 'tdix', 'tdsb', 'tdpi', 'tdli', 'tdps', 'parn'] as const;
    type Int32ChunkType = (typeof INT32_CHUNKS)[number];
    ChunkCodec.register(INT32_CHUNKS, chunk => {
        return { id: chunk.id, data: Unpack.int32(chunk.data) };
    }, chunk => {
        return { id: chunk.id, data: Pack.int32(chunk.data) };
    });

    // float64
    const FLOAT64_CHUNKS = ['tdum', 'tduM'] as const;
    type Float64ChunkType = (typeof FLOAT64_CHUNKS)[number];
    ChunkCodec.register(FLOAT64_CHUNKS, chunk => {
        return { id: chunk.id, data: Unpack.float64(chunk.data) };
    }, chunk => {
        return { id: chunk.id, data: Pack.float64(chunk.data) };
    });

    // float64Array
    ChunkCodec.register(['cdat'], chunk => {
        const arr: number[] = [];
        for (let i = 0; i < chunk.data.length; i += 8) {
            arr.push(Unpack.float64(chunk.data.substr(i, 8)));
        }
        return { id: chunk.id, data: arr };
    }, chunk => {
        let data = '';
        for (const n of chunk.data) {
            data += Pack.float64(n);
        }
        return { id: chunk.id, data };
    });

    function decodeParamDef(str: string): Atarabi.RIFX.ParamDef {
        if (str.length !== 148) {
            return { type: -1, data: str };
        }
        const parser = new Parser(new StringReader(str));
        parser.read(4);
        const uiFlags = parser.int32();
        const uiWidth = parser.int16();
        const uiHeight = parser.int16();
        const type = parser.int32();
        const name = decodeFixedString(parser.read(32));
        const flags = parser.int32();
        const unused = parser.read(4);
        switch (type) {
            default:
                {
                    return { type, data: str };
                }
            case PF.ParamType.Layer:
                {
                    parser.read(72);
                    const dephault = parser.int32();
                    return { type: 'layer', name, uiFlags, flags, dephault };
                }
            case PF.ParamType.Slider:
                {
                    const value = parser.int32();
                    parser.read(32);
                    parser.read(32);
                    const validMin = parser.int32();
                    const validMax = parser.int32();
                    const sliderMin = parser.int32();
                    const sliderMax = parser.int32();
                    const dephault = parser.int32();
                    return { type: 'slider', name, value, validMin, validMax, sliderMin, sliderMax, dephault, uiFlags, flags };
                }
            case PF.ParamType.FixedSlider:
                {
                    const value = parser.fixed32();
                    parser.read(32);
                    parser.read(32);
                    const validMin = parser.fixed32();
                    const validMax = parser.fixed32();
                    const sliderMin = parser.fixed32();
                    const sliderMax = parser.fixed32();
                    const dephault = parser.fixed32();
                    const precision = parser.int16();
                    const displayFlags = parser.int16();
                    return { type: 'fixedSlider', name, value, validMin, validMax, sliderMin, sliderMax, dephault, precision, displayFlags, uiFlags, flags };
                }
            case PF.ParamType.Angle:
                {
                    const value = parser.fixed32();
                    const dephault = parser.fixed32();
                    const validMin = parser.fixed32();
                    const validMax = parser.fixed32();
                    return { type: 'angle', name, value, dephault, validMin, validMax, uiFlags, flags };
                }
            case PF.ParamType.Checkbox:
                {
                    const value = parser.int32();
                    const dephault = parser.int8();
                    return { type: 'checkbox', name, value, dephault, uiFlags, flags };
                }
            case PF.ParamType.Color:
                {
                    const value = {
                        alpha: parser.int8(),
                        red: parser.int8(),
                        green: parser.int8(),
                        blue: parser.int8(),
                    };
                    const dephault = {
                        alpha: parser.int8(),
                        red: parser.int8(),
                        green: parser.int8(),
                        blue: parser.int8(),
                    };
                    return { type: 'color', name, value, dephault, uiFlags, flags };
                }
            case PF.ParamType.Point:
                {
                    const xValue = parser.fixed32();
                    const yValue = parser.fixed32();
                    parser.read(3);
                    const restrictBounds = parser.int8();
                    const xDephault = parser.fixed32();
                    const yDephault = parser.fixed32();
                    return { type: 'point', name, xValue, yValue, restrictBounds, xDephault, yDephault, uiFlags, flags };
                }
            case PF.ParamType.Popup:
                {
                    const value = parser.int32();
                    const numChoices = parser.int16();
                    const dephault = parser.int16();
                    return { type: 'popup', name, value, numChoices, dephault, uiFlags, flags };
                }
            case PF.ParamType.NoData:
                {
                    return { type: 'noData', name, uiWidth, uiHeight, uiFlags, flags };
                }
            case PF.ParamType.FloatSlider:
                {
                    const value = parser.float64();
                    const phase = parser.float64();
                    parser.read(32);
                    const validMin = parser.float32();
                    const validMax = parser.float32();
                    const sliderMin = parser.float32();
                    const sliderMax = parser.float32();
                    const dephault = parser.float32();
                    const precision = parser.int16();
                    const displayFlags = parser.int16();
                    const fsFlags = parser.int32();
                    const curveTolerance = parser.float32();
                    const useExponent = parser.int8();
                    const exponent = parser.float32();
                    return { type: 'floatSlider', name, value, phase, validMin, validMax, sliderMin, sliderMax, dephault, precision, displayFlags, fsFlags, curveTolerance, useExponent, exponent, uiFlags, flags }
                }
            case PF.ParamType.ArbitraryData:
                {
                    const id = parser.int16();
                    return { type: 'arbitraryData', name, id, uiWidth, uiHeight, uiFlags, flags };
                }
            case PF.ParamType.Path:
                {
                    const pathId = parser.int32();
                    parser.read(4);
                    const dephault = parser.int32();
                    return { type: 'path', name, pathId, dephault, uiFlags, flags };
                }
            case PF.ParamType.GroupStart:
                {
                    return { type: 'groupStart', name, uiFlags, flags };
                }
            case PF.ParamType.GroupEnd:
                {
                    return { type: 'groupEnd' };
                }
            case PF.ParamType.Button:
                {
                    const value = parser.int32();
                    return { type: 'button', name, value, uiFlags, flags };
                }
            case PF.ParamType.Point3D:
                {
                    const xValue = parser.float64();
                    const yValue = parser.float64();
                    const zValue = parser.float64();
                    const xDephault = parser.float64();
                    const yDephault = parser.float64();
                    const zDephault = parser.float64();
                    return { type: 'point3D', name, xValue, yValue, zValue, xDephault, yDephault, zDephault, uiFlags, flags };
                }
        }
    }

    function encodeParamDef(data: Atarabi.RIFX.ParamDef): string {
        if (typeof data.type === 'number') {
            return data.data;
        }

        let binary = '';
        binary += repeat('\0', 4);

        const LEN = 148;

        switch (data.type) {
            case 'layer':
                {
                    binary += Pack.int32(data.uiFlags);
                    binary += repeat('\0', 4);
                    binary += Pack.int32(PF.ParamType.Layer);
                    binary += encodeFixedString(data.name);
                    binary += Pack.int32(data.flags);
                    binary += repeat('\0', 76);
                    binary += Pack.int32(data.dephault);
                    break;
                }
            case 'slider':
                {
                    binary += Pack.int32(data.uiFlags);
                    binary += repeat('\0', 4);
                    binary += Pack.int32(PF.ParamType.Slider);
                    binary += encodeFixedString(data.name);
                    binary += Pack.int32(data.flags);
                    binary += repeat('\0', 4);
                    binary += Pack.int32(data.value);
                    binary += repeat('\0', 32);
                    binary += repeat('\0', 32);
                    binary += Pack.int32(data.validMin);
                    binary += Pack.int32(data.validMax);
                    binary += Pack.int32(data.sliderMin);
                    binary += Pack.int32(data.sliderMax);
                    binary += Pack.int32(data.dephault);
                    break;
                }
            case 'fixedSlider':
                {
                    binary += Pack.int32(data.uiFlags);
                    binary += repeat('\0', 4);
                    binary += Pack.int32(PF.ParamType.FixedSlider);
                    binary += encodeFixedString(data.name);
                    binary += Pack.int32(data.flags);
                    binary += repeat('\0', 4);
                    binary += Pack.fixed32(data.value);
                    binary += repeat('\0', 32);
                    binary += repeat('\0', 32);
                    binary += Pack.fixed32(data.validMin);
                    binary += Pack.fixed32(data.validMax);
                    binary += Pack.fixed32(data.sliderMin);
                    binary += Pack.fixed32(data.sliderMax);
                    binary += Pack.fixed32(data.dephault);
                    binary += Pack.int16(data.precision);
                    binary += Pack.int16(data.displayFlags);
                    break;
                }
            case 'angle':
                {
                    binary += Pack.int32(data.uiFlags);
                    binary += repeat('\0', 4);
                    binary += Pack.int32(PF.ParamType.Angle);
                    binary += encodeFixedString(data.name);
                    binary += Pack.int32(data.flags);
                    binary += repeat('\0', 4);
                    binary += Pack.fixed32(data.value);
                    binary += Pack.fixed32(data.dephault);
                    binary += Pack.fixed32(data.validMin);
                    binary += Pack.fixed32(data.validMax);
                    break;
                }
            case 'checkbox':
                {
                    binary += Pack.int32(data.uiFlags);
                    binary += repeat('\0', 4);
                    binary += Pack.int32(PF.ParamType.Checkbox);
                    binary += encodeFixedString(data.name);
                    binary += Pack.int32(data.flags);
                    binary += repeat('\0', 4);
                    binary += Pack.int32(data.value);
                    binary += Pack.int8(data.dephault);
                    break;
                }
            case 'color':
                {
                    binary += Pack.int32(data.uiFlags);
                    binary += repeat('\0', 4);
                    binary += Pack.int32(PF.ParamType.Color);
                    binary += encodeFixedString(data.name);
                    binary += Pack.int32(data.flags);
                    binary += repeat('\0', 4);
                    binary += Pack.int8(data.value.alpha);
                    binary += Pack.int8(data.value.red);
                    binary += Pack.int8(data.value.green);
                    binary += Pack.int8(data.value.blue);
                    binary += Pack.int8(data.dephault.alpha);
                    binary += Pack.int8(data.dephault.red);
                    binary += Pack.int8(data.dephault.green);
                    binary += Pack.int8(data.dephault.blue);
                    break;
                }
            case 'point':
                {
                    binary += Pack.int32(data.uiFlags);
                    binary += repeat('\0', 4);
                    binary += Pack.int32(PF.ParamType.Point);
                    binary += encodeFixedString(data.name);
                    binary += Pack.int32(data.flags);
                    binary += repeat('\0', 4);
                    binary += Pack.fixed32(data.xValue);
                    binary += Pack.fixed32(data.yValue);
                    binary += repeat('\0', 3);
                    binary += Pack.int8(data.restrictBounds);
                    binary += Pack.fixed32(data.xValue * 100);
                    binary += Pack.fixed32(data.yValue * 100);
                    break;
                }
            case 'popup':
                {
                    binary += Pack.int32(data.uiFlags);
                    binary += repeat('\0', 4);
                    binary += Pack.int32(PF.ParamType.Popup);
                    binary += encodeFixedString(data.name);
                    binary += Pack.int32(data.flags);
                    binary += repeat('\0', 4);
                    binary += Pack.int32(data.value);
                    binary += Pack.int16(data.numChoices);
                    binary += Pack.int16(data.dephault);
                    break;
                }
            case 'noData':
                {
                    binary += Pack.int32(data.uiFlags);
                    binary += Pack.int16(data.uiWidth);
                    binary += Pack.int16(data.uiHeight);
                    binary += Pack.int32(PF.ParamType.NoData);
                    binary += encodeFixedString(data.name);
                    binary += Pack.int32(data.flags);
                    binary += repeat('\0', 4);
                    break;
                }
            case 'floatSlider':
                {
                    binary += Pack.int32(data.uiFlags);
                    binary += repeat('\0', 4);
                    binary += Pack.int32(PF.ParamType.FloatSlider);
                    binary += encodeFixedString(data.name);
                    binary += Pack.int32(data.flags);
                    binary += repeat('\0', 4);
                    binary += Pack.float64(data.value);
                    binary += Pack.float64(data.phase);
                    binary += repeat('\0', 32);
                    binary += Pack.float32(data.validMin);
                    binary += Pack.float32(data.validMax);
                    binary += Pack.float32(data.sliderMin);
                    binary += Pack.float32(data.sliderMax);
                    binary += Pack.float32(data.dephault);
                    binary += Pack.int16(data.precision);
                    binary += Pack.int16(data.displayFlags);
                    binary += Pack.int32(data.fsFlags);
                    binary += Pack.float32(data.curveTolerance);
                    binary += Pack.int8(data.useExponent);
                    binary += Pack.float32(data.exponent);
                    break;
                }
            case 'arbitraryData':
                {
                    binary += Pack.int32(data.uiFlags);
                    binary += Pack.int16(data.uiWidth);
                    binary += Pack.int16(data.uiHeight);
                    binary += Pack.int32(PF.ParamType.ArbitraryData);
                    binary += encodeFixedString(data.name);
                    binary += Pack.int32(data.flags);
                    binary += repeat('\0', 4);
                    binary += Pack.int16(data.id);
                    break;
                }
            case 'path':
                {
                    binary += Pack.int32(data.uiFlags);
                    binary += repeat('\0', 4);
                    binary += Pack.int32(PF.ParamType.Path);
                    binary += encodeFixedString(data.name);
                    binary += Pack.int32(data.flags);
                    binary += repeat('\0', 4);
                    binary += Pack.int32(data.pathId);
                    binary += repeat('\0', 4);
                    binary += Pack.int32(data.dephault);
                    break;
                }
            case 'groupStart':
                {
                    binary += Pack.int32(data.uiFlags);
                    binary += repeat('\0', 4);
                    binary += Pack.int32(PF.ParamType.GroupStart);
                    binary += encodeFixedString(data.name);
                    binary += Pack.int32(data.flags);
                    binary += repeat('\0', 4);
                    break;
                }
            case 'groupEnd':
                {
                    binary += repeat('\0', 8);
                    binary += Pack.int32(PF.ParamType.GroupEnd);
                    break;
                }
            case 'button':
                {
                    binary += Pack.int32(data.uiFlags);
                    binary += repeat('\0', 4);
                    binary += Pack.int32(PF.ParamType.Button);
                    binary += encodeFixedString(data.name);
                    binary += Pack.int32(data.flags);
                    binary += repeat('\0', 4);
                    binary += Pack.int32(data.value);
                    break;
                }
            case 'point3D':
                {
                    binary += Pack.int32(data.uiFlags);
                    binary += repeat('\0', 4);
                    binary += Pack.int32(PF.ParamType.Point3D);
                    binary += encodeFixedString(data.name);
                    binary += Pack.int32(data.flags);
                    binary += repeat('\0', 4);
                    binary += Pack.float64(data.xValue);
                    binary += Pack.float64(data.yValue);
                    binary += Pack.float64(data.zValue);
                    binary += Pack.float64(data.xDephault);
                    binary += Pack.float64(data.yDephault);
                    binary += Pack.float64(data.zDephault);
                    break;
                }
        }

        binary += repeat('\0', LEN - binary.length);

        return binary;
    }

    ChunkCodec.register(['pard'], chunk => {
        return { id: chunk.id, data: decodeParamDef(chunk.data) };
    }, chunk => {
        return { id: chunk.id, data: encodeParamDef(chunk.data) };
    });

    function decodeListChunk(parent: DecodedChunk, chunk: Chunk) {
        if (isArray(chunk.list)) {
            for (const child of chunk.list) {
                if (child.id === LIST) {
                    if (isCOSList(child.data)) {
                        const decodedChunk = { id: child.id, data: child.data, cosList: child.cosList } as DecodedChunk;
                        parent.list.push(decodedChunk);
                    } else {
                        const decodedChunk = { id: child.id, data: child.data, list: [] } as DecodedChunk;
                        parent.list.push(decodedChunk);
                        decodeListChunk(decodedChunk, child);
                    }
                } else {
                    const decodedChunk = ChunkCodec.decode(child);
                    parent.list.push(decodedChunk);
                }
            }
        }
    }

    function decode(chunk: Chunk): DecodedChunk {
        if (chunk.id === RIFX || chunk.id === LIST) {
            if (isCOSList(chunk.data)) {
                return { id: chunk.id, data: chunk.data, cosList: chunk.cosList } as DecodedChunk;
            }
            const decodedChunk = { id: chunk.id, data: chunk.data, list: [] } as DecodedChunk;
            decodeListChunk(decodedChunk, chunk);
            return decodedChunk;
        } else {
            return ChunkCodec.decode(chunk);
        }
    }

    function encodeListChunk(parent: Chunk, chunk: DecodedChunk) {
        if (isArray(chunk.list)) {
            for (const child of chunk.list) {
                if (child.id === LIST) {
                    if (isCOSList(child.data)) {
                        const encodedChunk = { id: child.id, data: child.data, cosList: child.cosList };
                        parent.list.push(encodedChunk);
                    } else {
                        const encodedChunk = { id: child.id, data: child.data, list: [] };
                        parent.list.push(encodedChunk);
                        encodeListChunk(encodedChunk, child);
                    }
                } else {
                    const encodedChunk = ChunkCodec.encode(child);
                    parent.list.push(encodedChunk);
                }
            }
        }
    }

    function encode(chunk: DecodedChunk): Chunk {
        if (chunk.id === RIFX || chunk.id === LIST) {
            if (isCOSList(chunk.data)) {
                return { id: chunk.id, data: chunk.data, cosList: chunk.cosList };
            }
            const encodedChunk = { id: chunk.id, data: chunk.data, list: [] };
            encodeListChunk(encodedChunk, chunk);
            return encodedChunk;
        } else {
            return ChunkCodec.encode(chunk);
        }
    }

    type Parameter = Atarabi.Pseudo.Parameter;

    function makeTdmn(matchName: string): DecodedChunk {
        return { id: 'tdmn', data: { text: matchName, length: 40 } } satisfies Atarabi.RIFX.Tdmn as DecodedChunk;
    }

    function makePard(parameter: Parameter): DecodedChunk {
        const pard: Atarabi.RIFX.Pard = { id: 'pard', data: null };
        switch (parameter.type) {
            case 'layer':
                pard.data = { type: parameter.type, name: { text: parameter.name, length: 32 }, uiFlags: parameter.uiFlags, flags: parameter.flags, dephault: ~~parameter.dephault };
                break;
            case 'slider':
                pard.data = { type: parameter.type, name: { text: parameter.name, length: 32 }, uiFlags: parameter.uiFlags, flags: parameter.flags, value: parameter.value, validMin: parameter.validMin, validMax: parameter.validMax, sliderMin: parameter.sliderMin, sliderMax: parameter.sliderMax, dephault: parameter.value };
                break;
            case 'fixedSlider':
                pard.data = { type: parameter.type, name: { text: parameter.name, length: 32 }, uiFlags: parameter.uiFlags, flags: parameter.flags, value: parameter.value, validMin: parameter.validMin, validMax: parameter.validMax, sliderMin: parameter.sliderMin, sliderMax: parameter.sliderMax, dephault: parameter.value, precision: parameter.precision, displayFlags: parameter.displayFlags };
                break;
            case 'angle':
                pard.data = { type: parameter.type, name: { text: parameter.name, length: 32 }, uiFlags: parameter.uiFlags, flags: parameter.flags, value: parameter.value, validMin: -30000, validMax: 30000, dephault: parameter.value };
                break;
            case 'checkbox':
                pard.data = { type: parameter.type, name: { text: parameter.name, length: 32 }, uiFlags: parameter.uiFlags, flags: parameter.flags, value: +parameter.value, dephault: +parameter.value };
                break;
            case 'color':
                pard.data = { type: parameter.type, name: { text: parameter.name, length: 32 }, uiFlags: parameter.uiFlags, flags: parameter.flags, value: { alpha: 255, red: parameter.value.red, green: parameter.value.green, blue: parameter.value.blue }, dephault: { alpha: 255, red: parameter.value.red, green: parameter.value.green, blue: parameter.value.blue } };
                break;
            case 'point':
                pard.data = { type: parameter.type, name: { text: parameter.name, length: 32 }, uiFlags: parameter.uiFlags, flags: parameter.flags, xValue: parameter.xValue, yValue: parameter.yValue, restrictBounds: 0, xDephault: parameter.xValue * 100, yDephault: parameter.yValue * 100 };
                break;
            case 'popup':
                pard.data = { type: parameter.type, name: { text: parameter.name, length: 32 }, uiFlags: parameter.uiFlags, flags: parameter.flags, value: parameter.value, numChoices: parameter.items.length, dephault: parameter.value };
                break;
            case 'floatSlider':
                pard.data = { type: parameter.type, name: { text: parameter.name, length: 32 }, uiFlags: parameter.uiFlags, flags: parameter.flags, value: parameter.value, phase: 0, validMin: parameter.validMin, validMax: parameter.validMax, sliderMin: parameter.sliderMin, sliderMax: parameter.sliderMax, dephault: parameter.value, precision: parameter.precision, displayFlags: parameter.displayFlags, fsFlags: 0, curveTolerance: 0, useExponent: 0, exponent: 0 };
                break;
            case 'path':
                pard.data = { type: parameter.type, name: { text: parameter.name, length: 32 }, uiFlags: parameter.uiFlags, flags: parameter.flags, pathId: 0, dephault: parameter.dephault };
                break;
            case 'groupStart':
                pard.data = { type: parameter.type, name: { text: parameter.name, length: 32 }, uiFlags: parameter.uiFlags, flags: parameter.flags };
                break;
            case 'groupEnd':
                pard.data = { type: parameter.type };
                break;
            case 'button':
                pard.data = { type: parameter.type, name: { text: parameter.name, length: 32 }, uiFlags: parameter.uiFlags, flags: parameter.flags, value: 0 };
                break;
            case 'point3D':
                pard.data = { type: parameter.type, name: { text: parameter.name, length: 32 }, uiFlags: parameter.uiFlags, flags: parameter.flags, xValue: parameter.xValue, yValue: parameter.yValue, zValue: parameter.zValue, xDephault: parameter.xValue * 100, yDephault: parameter.yValue * 100, zDephault: parameter.zValue * 100 };
                break;
        }
        return pard as DecodedChunk;
    }

    function makeVariableStringChunk(id: string, text: string, utf8: boolean = false): DecodedChunk {
        return { id, data: { text, utf8 } } as DecodedChunk;
    }

    function makeInt32Chunk<K extends Int32ChunkType>(id: K, data: number): DecodedChunk {
        return { id: id as string, data } as DecodedChunk;
    }

    function makeFloat64Chunk<K extends Float64ChunkType>(id: K, data: number): DecodedChunk {
        return { id: id as string, data } as DecodedChunk;
    }

    const BASE_TDB4S = {
        layer: "Û\x99\x00\x01\x00\x01\x00\x00\x00\x01\x00\x00\x00\x00x\x00?\x1a6âë\x1cC-?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x80\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
        slider: "Û\x99\x00\x01\x00\x01\x00\x00ÿÿÿÿ\x00\x00x\x00?\x1a6âë\x1cC-?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
        fixedSlider: "Û\x99\x00\x01\x00\x01\x00\x00ÿÿÿÿ\x00\x00x\x00?\x1a6âë\x1cC-?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x06\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
        angle: "Û\x99\x00\x01\x00\x01\x00\x00ÿÿÿÿ\x00\x00x\x00?\x1a6âë\x1cC-?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x06\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
        checkbox: "Û\x99\x00\x01\x00\x01\x00\x00\x00\x01\x00\x04\x00\x00x\x00?\x1a6âë\x1cC-?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
        color: "Û\x99\x00\x04\x00\x07\x00\x01\x00\x02ÿÿ\x00\x00x\x00?\x1a6âë\x1cC-?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
        point: "Û\x99\x00\x02\x00\x0f\x00\x03ÿÿÿÿ\x00\x00x\x00=\x9b|ßÙ×½¼?üqÇ\x1cqÇ\x1c?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x06\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
        popup: "Û\x99\x00\x01\x00\x01\x00\x00\x00\x01\x00\x04\x00\x00x\x00?\x1a6âë\x1cC-?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
        floatSlider: "Û\x99\x00\x01\x00\x01\x00\x00ÿÿÿÿ\x00\x00x\x00?\x1a6âë\x1cC-?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00\x00\x00\x00\b\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
        arbitraryData: "Û\x99\x00\x01\x00\x07\x00\x01\x00\x06\x00\x07\x00\x00x\x00?\x1a6âë\x1cC-?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00\x00\x01\x00\b\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
        path: "Û\x99\x00\x01\x00\x01\x00\x00\x00\x01\x00\x00\x00\x00x\x00?\x1a6âë\x1cC-?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
        groupStart: "Û\x99\x00\x01\x00\x01\x00\x00\x00\x01\x00\x00\x00\x00x\x00?\x1a6âë\x1cC-?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00\x00\x00\x00\b\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x80\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
        groupEnd: "Û\x99\x00\x01\x00\x01\x00\x00\x00\x01\x00\x00\x00\x00x\x00?\x1a6âë\x1cC-?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00\x00\x00\x00\b\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x80\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
        button: "Û\x99\x00\x01\x00\x01\x00\x00\x00\x01\x00\x00\x00\x00x\x00?\x1a6âë\x1cC-?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00\x00\x00\x00\b\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x80\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
        point3D: "Û\x99\x00\x03\x00\x0f\x00\x03ÿÿÿÿ\x00\x00x\x00=\x9b|ßÙ×½¼?üqÇ\x1cqÇ\x1c?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00\x00\x00\x00\b\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00",
    } as const;

    function buildTdb4(type: string, key: boolean) {
        return BASE_TDB4S[type] + (key ? "\x01\x00\x00\x00" : "\x00\x00\x00\x00");
    }

    function makeTdb4(parameter: Parameter): DecodedChunk {
        let hasKey = false;
        switch (parameter.type) {
            case 'slider':
            case 'fixedSlider':
            case 'angle':
            case 'checkbox':
            case 'color':
            case 'point':
            case 'popup':
            case 'floatSlider':
            case 'point3D':
                if (parameter.expression) {
                    hasKey = true;
                }
                break;
        }
        return { id: 'tdb4', data: buildTdb4(parameter.type, hasKey) } satisfies Atarabi.RIFX.Tdb4 as DecodedChunk;
    }

    const CDAT_LENS = {
        layer: 5,
        slider: 5,
        fixedSlider: 5,
        angle: 5,
        checkbox: 5,
        color: 12,
        point: 6,
        popup: 5,
        floatSlider: 5,
        arbitraryData: 1,
        path: 5,
        groupStart: 5,
        groupEnd: 5,
        button: 5,
        point3D: 9,
    };

    function makeCdat(parameter: Parameter): DecodedChunk {
        const data: number[] = [];
        for (let i = 0, l = CDAT_LENS[parameter.type]; i < l; i++) {
            data.push(0);
        }

        switch (parameter.type) {
            case 'layer':
                break;
            case 'slider':
                data[0] = parameter.value;
                break;
            case 'fixedSlider':
                data[0] = parameter.value;
                break;
            case 'angle':
                data[0] = parameter.value;
                break;
            case 'checkbox':
                data[0] = +parameter.value;
                break;
            case 'color':
                data[0] = 255;
                data[1] = parameter.value.red;
                data[2] = parameter.value.green;
                data[3] = parameter.value.blue;
                break;
            case 'point':
                data[0] = parameter.xValue;
                data[1] = parameter.yValue;
                break;
            case 'popup':
                data[0] = parameter.value;
                break;
            case 'floatSlider':
                data[0] = parameter.value;
                break;
            case 'path':
                break;
            case 'groupStart':
                break;
            case 'groupEnd':
                break;
            case 'button':
                break;
            case 'point3D':
                data[0] = parameter.xValue;
                data[1] = parameter.yValue;
                data[2] = parameter.zValue;
                break;
        }

        return { id: 'cdat', data } satisfies Atarabi.RIFX.Cdat as DecodedChunk;
    }

    function makeTdbs(parameter: Parameter, dynStreamFlags: 1 | 3 = 1): DecodedChunk {
        const tdbs = { id: 'LIST', data: 'tdbs', list: [] } satisfies Chunk as DecodedChunk;
        tdbs.list.push(makeInt32Chunk('tdsb', dynStreamFlags));
        tdbs.list.push(makeVariableStringChunk('tdsn', parameter.type === 'groupEnd' ? '' : parameter.name));
        tdbs.list.push(makeTdb4(parameter));
        tdbs.list.push(makeCdat(parameter));

        switch (parameter.type) {
            case 'layer':
                tdbs.list.push(makeInt32Chunk('tdpi', ~~parameter.dephault));
                tdbs.list.push(makeInt32Chunk('tdps', 0));
                break;
            case 'slider':
                if (parameter.expression) {
                    tdbs.list.push(makeVariableStringChunk('expr', parameter.expression));
                }
                tdbs.list.push(makeFloat64Chunk('tdum', parameter.sliderMin));
                tdbs.list.push(makeFloat64Chunk('tduM', parameter.sliderMax));
                break;
            case 'fixedSlider':
                if (parameter.expression) {
                    tdbs.list.push(makeVariableStringChunk('expr', parameter.expression));
                }
                tdbs.list.push(makeFloat64Chunk('tdum', parameter.sliderMin));
                tdbs.list.push(makeFloat64Chunk('tduM', parameter.sliderMax));
                break;
            case 'angle':
                if (parameter.expression) {
                    tdbs.list.push(makeVariableStringChunk('expr', parameter.expression));
                }
                break;
            case 'checkbox':
                if (parameter.expression) {
                    tdbs.list.push(makeVariableStringChunk('expr', parameter.expression));
                }
                break;
            case 'color':
                if (parameter.expression) {
                    tdbs.list.push(makeVariableStringChunk('expr', parameter.expression));
                }
                break;
            case 'point':
                if (parameter.expression) {
                    tdbs.list.push(makeVariableStringChunk('expr', parameter.expression));
                }
                break;
            case 'popup':
                if (parameter.expression) {
                    tdbs.list.push(makeVariableStringChunk('expr', parameter.expression));
                }
                break;
            case 'floatSlider':
                if (parameter.expression) {
                    tdbs.list.push(makeVariableStringChunk('expr', parameter.expression));
                }
                tdbs.list.push(makeFloat64Chunk('tdum', parameter.sliderMin));
                tdbs.list.push(makeFloat64Chunk('tduM', parameter.sliderMax));
                break;
            case 'path':
                tdbs.list.push(makeInt32Chunk('tdli', 0));
                break;
            case 'groupStart':
                // nothing
                break;
            case 'groupEnd':
                // nothing
                break;
            case 'button':
                // nothing
                break;
            case 'point3D':
                if (parameter.expression) {
                    tdbs.list.push(makeVariableStringChunk('expr', parameter.expression));
                }
                break;
        }

        return tdbs;
    }

    function makePseudoTempalte(matchName: string, name: string, paramDefsList: Chunk[], streamValuesList: Chunk[]): Chunk {
        return {
            "id": "RIFX",
            "data": "FaFX",
            "list": [
                {
                    "id": "head",
                    "data": "\x00\x00\x00\x03\x00\x00\x00J\x00\x00\x00\x00\x00\x00\x00\x00"
                },
                {
                    "id": "LIST",
                    "data": "besc",
                    "list": [
                        {
                            "id": "beso",
                            "data": "\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00`\x00\x00\x18\x00\x00\x00\x00\x00\x04\x00\x01\x00\x01\x07\x80\x048?ð\x00\x00\x00\x00\x00\x00@$\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00ÿÿÿÿ"
                        },
                        {
                            "id": "LIST",
                            "data": "tdsp",
                            "list": [
                                {
                                    "id": "tdot",
                                    "data": "ÿÿÿÿ"
                                },
                                {
                                    "id": "tdpl",
                                    "data": "\x00\x00\x00\x02"
                                },
                                {
                                    "id": "LIST",
                                    "data": "tdsi",
                                    "list": [
                                        {
                                            "id": "tdix",
                                            "data": "ÿÿÿÿ"
                                        },
                                        {
                                            "id": "tdmn",
                                            "data": "ADBE Effect Parade\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
                                        }
                                    ]
                                },
                                {
                                    "id": "LIST",
                                    "data": "tdsi",
                                    "list": [
                                        {
                                            "id": "tdix",
                                            "data": "\x00\x00\x00\x00"
                                        },
                                        {
                                            "id": "tdmn",
                                            "data": encodeFixedString({ text: matchName, length: 40 })
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "LIST",
                            "data": "tdsp",
                            "list": [
                                {
                                    "id": "tdot",
                                    "data": "ÿÿÿÿ"
                                },
                                {
                                    "id": "tdpl",
                                    "data": "\x00\x00\x00\x01"
                                },
                                {
                                    "id": "LIST",
                                    "data": "tdsi",
                                    "list": [
                                        {
                                            "id": "tdix",
                                            "data": "ÿÿÿÿ"
                                        },
                                        {
                                            "id": "tdmn",
                                            "data": "ADBE End of path sentinel\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "LIST",
                            "data": "sspc",
                            "list": [
                                {
                                    "id": "fnam",
                                    "data": encodeVariableString({ text: name, utf8: false }),
                                },
                                {
                                    "id": "LIST",
                                    "data": "parT",
                                    "list": [].concat(paramDefsList)
                                },
                                {
                                    "id": "LIST",
                                    "data": "tdgp",
                                    "list": [
                                        {
                                            "id": "tdsb",
                                            "data": "\x00\x00\x00\x01"
                                        },
                                        {
                                            "id": "tdsn",
                                            "data": encodeVariableString({ text: name, utf8: false }),
                                        }
                                    ].concat(streamValuesList)
                                },
                                {
                                    "id": "pgui",
                                    "data": "\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    }

    function zfill(number: number, size: number = 4, ch: string = '0') {
        let s = '' + number;
        while (s.length < size) {
            s = ch + s;
        }
        return s;
    }

    function getDynStreamFlag(parameter: Atarabi.Pseudo.Parameter): 1 | 3 {
        if (parameter.type === 'groupEnd') {
            return 1;
        }
        return parameter.uiFlags & PF.ParamUIFlags.Invisible ? 3 : 1;
    }

    function makePseudoEffectChunk({ matchName, name, parameters }: Atarabi.Pseudo.Config) {
        if (matchName.indexOf('Pseudo/') !== 0) {
            throw new Error(`matchName must start with 'Pseudo/`);
        }
        const inputParameter: Parameter = { type: 'layer', name: '', dephault: PF.LayerDefault.Myself, uiFlags: PF.ParamUIFlags.None, flags: PF.ParamFlags.CannotTimeVary, id: 0 };

        const paramDefsList: Chunk[] = [];
        // input
        paramDefsList.push(encode({ id: 'parn', data: 1 + parameters.length } as DecodedChunk));
        paramDefsList.push(encode(makeTdmn(`${matchName}-${zfill(inputParameter.id)}`)));
        paramDefsList.push(encode(makePard(inputParameter)));
        // params			
        for (const parameter of parameters) {
            paramDefsList.push(encode(makeTdmn(`${matchName}-${zfill(parameter.id)}`)));
            paramDefsList.push(encode(makePard(parameter)));
            switch (parameter.type) {
                case 'popup':
                    paramDefsList.push(encode(makeVariableStringChunk('pdnm', parameter.items.join('|'))));
                    break;
                case 'checkbox':
                    paramDefsList.push(encode(makeVariableStringChunk('pdnm', parameter.text || '')));
                    break;
                case 'button':
                    paramDefsList.push(encode(makeVariableStringChunk('pdnm', parameter.buttonName || '')));
                    break;
            }
        }

        const streamValuesList: Chunk[] = [];
        // input
        streamValuesList.push(encode(makeTdmn(`${matchName}-${zfill(0)}`)));
        streamValuesList.push(encode(makeTdbs(inputParameter, 3)));
        // params
        for (const parameter of parameters) {
            streamValuesList.push(encode(makeTdmn(`${matchName}-${zfill(parameter.id)}`)));
            streamValuesList.push(encode(makeTdbs(parameter, getDynStreamFlag(parameter))));
        }
        // sentinel
        streamValuesList.push(encode(makeTdmn('ADBE Group End')));

        return makePseudoTempalte(matchName, name, paramDefsList, streamValuesList);
    }

    // xml
    type Tag = { tag: string; attributes?: { [key: string]: any; }; text?: string; children?: Tag[]; };

    const stringifyTag = (tag: Tag) => {
        let text = '';
        const attributes: string[] = [];
        if (tag.attributes) {
            for (const key in tag.attributes) {
                if (tag.attributes.hasOwnProperty(key)) {
                    attributes.push(`${key}='${tag.attributes[key]}'`);
                }
            }
        }
        let childrenText = '';
        if (tag.text) {
            childrenText = tag.text;
        } else if (isArray(tag.children)) {
            for (const child of tag.children) {
                childrenText += stringifyTag(child);
            }
        }
        if (childrenText) {
            if (attributes.length) {
                text = `<${tag.tag} ${attributes.join(' ')}>${childrenText}</${tag.tag}>`;
            } else {
                text = `<${tag.tag}>${childrenText}</${tag.tag}>`;
            }
        } else {
            if (attributes.length) {
                text = `<${tag.tag} ${attributes.join(' ')}/>`;
            } else {
                text = `<${tag.tag}/>`;
            }
        }
        return text;
    };

    const makePropListTag = (): Tag => {
        const propList = { tag: 'prop.list', children: [] } satisfies Tag;
        return propList;
    };

    const makePropPairTag = (key: string, value?: Tag): Tag => {
        const propPair = { tag: 'prop.pair', children: [] } satisfies Tag;
        propPair.children.push({ tag: 'key', text: key });
        if (value) {
            propPair.children.push(value);
        }
        return propPair;
    };

    const makeArrayTag = (type = 'float'): Tag => {
        const array = { tag: 'array', children: [] } satisfies Tag;
        array.children.push({ tag: 'array.type', children: [{ tag: type }] });
        return array;
    };

    const makeStopsTag = (type: 'Alpha' | 'Color', stopArr: number[][]): Tag => {
        const baseStopsList = makePropListTag();
        const baseStops = makePropPairTag(`${type} Stops`, baseStopsList);

        const stops = makePropListTag();
        const stopsList = makePropPairTag('Stops List', stops);
        baseStopsList.children.push(stopsList);

        for (let i = 0; i < stopArr.length; i++) {
            const valueList = makePropListTag();
            const stop = makePropPairTag(`Stop-${i}`, valueList);
            stops.children.push(stop);
            const valueArr = makeArrayTag('float');
            const valuePair = makePropPairTag(`Stops ${type}`, valueArr);
            valueList.children.push(valuePair);
            for (const value of stopArr[i]) {
                valueArr.children.push({ tag: 'float', text: `${value}` });
            }
        }

        const stopsSize = makePropPairTag('Stops Size');
        baseStopsList.children.push(stopsSize);
        stopsSize.children.push({ tag: 'int', attributes: { type: 'unsigned', size: 32 }, text: `${stopArr.length}` });

        return baseStops;
    };

    const convertAlphaStopToArray = (stop: Atarabi.Property.AlphaStop): number[] => {
        const arr: number[] = [];
        arr.push(stop.location);
        arr.push(typeof stop.midpoint === 'number' ? stop.midpoint : 0.5);
        arr.push(stop.opacity);
        return arr;
    };

    const makeAlphaStopsTag = (stops: Atarabi.Property.AlphaStop[]): Tag => {
        const arr: number[][] = [];
        for (const stop of stops) {
            arr.push(convertAlphaStopToArray(stop));
        }
        return makeStopsTag('Alpha', arr);
    };

    const convertColorStopToArray = (stop: Atarabi.Property.ColorStop): number[] => {
        const arr: number[] = [];
        arr.push(stop.location);
        arr.push(typeof stop.midpoint === 'number' ? stop.midpoint : 0.5);
        arr.push(stop.color[0]);
        arr.push(stop.color[1]);
        arr.push(stop.color[2]);
        arr.push(1);
        return arr;
    };

    const makeColorStopsTag = (stops: Atarabi.Property.ColorStop[]): Tag => {
        const arr: number[][] = [];
        for (const stop of stops) {
            arr.push(convertColorStopToArray(stop));
        }
        return makeStopsTag('Color', arr);
    };

    const makeGradientXML = (value: Atarabi.Property.GradientValue): string => {
        const base: Tag = { tag: 'prop.map', attributes: { version: 4 }, children: [] };
        const baseList = makePropListTag();
        base.children.push(baseList);
        const gradientColorDataList = makePropListTag();
        const gradientColorData = makePropPairTag('Gradient Color Data', gradientColorDataList);
        baseList.children.push(gradientColorData);
        const alphaStopsTag = makeAlphaStopsTag(value.alphaStops);
        gradientColorDataList.children.push(alphaStopsTag);
        const colorStopsTag = makeColorStopsTag(value.colorStops);
        gradientColorDataList.children.push(colorStopsTag);
        return "<?xml version='1.0'?>" + stringifyTag(base);
    };

    const getParentMatchName = (type: Atarabi.Property.GradientType) => {
        switch (type) {
            case 'Gradient Fill':
                return "ADBE Vector Graphic - G-Fill\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00";
            case 'Gradient Stroke':
                return "ADBE Vector Graphic - G-Stroke\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00";
            case "Gradient Overlay":
                return "gradientFill/enabled\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00";
        }
    };

    const getPropertyMatchName = (type: Atarabi.Property.GradientType) => {
        switch (type) {
            case 'Gradient Fill':
            case 'Gradient Stroke':
                return "ADBE Vector Grad Colors\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00";
            case "Gradient Overlay":
                return "gradientFill/gradient\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00";
        }
    };

    const createGradientTemplate = (type: Atarabi.Property.GradientType): Chunk => {
        return {
            "id": "RIFX",
            "data": "FaFX",
            "list": [
                {
                    "id": "head",
                    "data": "\x00\x00\x00\x03\x00\x00\x00E\x00\x00\x00\x07\x00\x00\x00\x00"
                },
                {
                    "id": "LIST",
                    "data": "besc",
                    "list": [
                        {
                            "id": "beso",
                            "data": "\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00x\x00\x00\x1e\x00\x00\x00\x00\x00\x04\x00\x01\x00\x01\x07\x80\x048?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00ÿÿÿÿ"
                        },
                        {
                            "id": "LIST",
                            "data": "tdsp",
                            "list": [
                                {
                                    "id": "tdot",
                                    "data": "ÿÿÿÿ"
                                },
                                {
                                    "id": "tdpl",
                                    "data": "\x00\x00\x00\x02"
                                },
                                {
                                    "id": "LIST",
                                    "data": "tdsi",
                                    "list": [
                                        {
                                            "id": "tdix",
                                            "data": "\x00\x00\x00\x00"
                                        },
                                        {
                                            "id": "tdmn",
                                            "data": getParentMatchName(type)
                                        }
                                    ]
                                },
                                {
                                    "id": "LIST",
                                    "data": "tdsi",
                                    "list": [
                                        {
                                            "id": "tdix",
                                            "data": "ÿÿÿÿ"
                                        },
                                        {
                                            "id": "tdmn",
                                            "data": getPropertyMatchName(type)
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "LIST",
                            "data": "tdsp",
                            "list": [
                                {
                                    "id": "tdot",
                                    "data": "ÿÿÿÿ"
                                },
                                {
                                    "id": "tdpl",
                                    "data": "\x00\x00\x00\x01"
                                },
                                {
                                    "id": "LIST",
                                    "data": "tdsi",
                                    "list": [
                                        {
                                            "id": "tdix",
                                            "data": "ÿÿÿÿ"
                                        },
                                        {
                                            "id": "tdmn",
                                            "data": "ADBE End of path sentinel\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "LIST",
                            "data": "GCst",
                            "list": [
                                {
                                    "id": "LIST",
                                    "data": "tdbs",
                                    "list": [
                                        {
                                            "id": "tdsb",
                                            "data": "\x00\x00\x00\x01"
                                        },
                                        {
                                            "id": "tdsn",
                                            "data": "Colors\x00"
                                        },
                                        {
                                            "id": "tdb4",
                                            "data": "Û\x99\x00\x01\x00\x07\x00\x00ÿÿÿÿ\x00\x00x\x00?\x1a6âë\x1cC-?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00\x00\x01\x00\b\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
                                        },
                                        {
                                            "id": "cdat",
                                            "data": "\x00\x00\x00\x00"
                                        }
                                    ]
                                },
                                {
                                    "id": "LIST",
                                    "data": "GCky",
                                    "list": [
                                        {
                                            "id": "Utf8",
                                            "data": "<<XML>>"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    };

    const createGradientTemplateWithKey = (type: Atarabi.Property.GradientType): Chunk => {
        return {
            "id": "RIFX",
            "data": "FaFX",
            "list": [
                {
                    "id": "head",
                    "data": "\x00\x00\x00\x03\x00\x00\x00E\x00\x00\x00\x07\x00\x00\x00\x00"
                },
                {
                    "id": "LIST",
                    "data": "besc",
                    "list": [
                        {
                            "id": "beso",
                            "data": "\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00x\x00\x00\x1e\x00\x00\x00\x00\x00\x04\x00\x01\x00\x01\x07\x80\x048?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00ÿÿÿÿ"
                        },
                        {
                            "id": "LIST",
                            "data": "tdsp",
                            "list": [
                                {
                                    "id": "tdot",
                                    "data": "ÿÿÿÿ"
                                },
                                {
                                    "id": "tdpl",
                                    "data": "\x00\x00\x00\x02"
                                },
                                {
                                    "id": "LIST",
                                    "data": "tdsi",
                                    "list": [
                                        {
                                            "id": "tdix",
                                            "data": "\x00\x00\x00\x00"
                                        },
                                        {
                                            "id": "tdmn",
                                            "data": getParentMatchName(type)
                                        }
                                    ]
                                },
                                {
                                    "id": "LIST",
                                    "data": "tdsi",
                                    "list": [
                                        {
                                            "id": "tdix",
                                            "data": "ÿÿÿÿ"
                                        },
                                        {
                                            "id": "tdmn",
                                            "data": getPropertyMatchName(type)
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "LIST",
                            "data": "tdsp",
                            "list": [
                                {
                                    "id": "tdot",
                                    "data": "ÿÿÿÿ"
                                },
                                {
                                    "id": "tdpl",
                                    "data": "\x00\x00\x00\x01"
                                },
                                {
                                    "id": "LIST",
                                    "data": "tdsi",
                                    "list": [
                                        {
                                            "id": "tdix",
                                            "data": "ÿÿÿÿ"
                                        },
                                        {
                                            "id": "tdmn",
                                            "data": "ADBE End of path sentinel\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "LIST",
                            "data": "GCst",
                            "list": [
                                {
                                    "id": "LIST",
                                    "data": "tdbs",
                                    "list": [
                                        {
                                            "id": "tdsb",
                                            "data": "\x00\x00\x00\x01"
                                        },
                                        {
                                            "id": "tdsn",
                                            "data": "Colors\x00"
                                        },
                                        {
                                            "id": "tdb4",
                                            "data": "Û\x99\x00\x01\x00\x06\x00\x00ÿÿÿÿ\x00\x00x\x00?\x1a6âë\x1cC-?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00?ð\x00\x00\x00\x00\x00\x00\x00\x01\x00\b\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
                                        },
                                        {
                                            "id": "LIST",
                                            "data": "list",
                                            "list": [
                                                {
                                                    "id": "lhd3",
                                                    "data": "\x00Ð\x0bî\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00@\x00\x00\x00\x04\x00\x00\x00\x01\x00\x00\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
                                                },
                                                {
                                                    "id": "ldat",
                                                    "data": "\x00\x00x\x00\x01\x01\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00 ø×\x15[\x01\x00\x00"
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "id": "LIST",
                                    "data": "GCky",
                                    "list": [
                                        {
                                            "id": "Utf8",
                                            "data": "<<XML>>"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    };

    const makeGradientPreset = (value: Atarabi.Property.GradientValue, type: Atarabi.Property.GradientType, key: boolean = false): string => {
        if (value.alphaStops.length < 2) {
            throw `length of alphaStops must be 2 or greater: ${value.alphaStops.length}`;
        }
        if (value.colorStops.length < 2) {
            throw `length of colorStops must be 2 or greater: ${value.colorStops.length}`;
        }
        const valueXML = makeGradientXML(value);
        const presetChunk = key ? createGradientTemplateWithKey(type) : createGradientTemplate(type);
        presetChunk.list[1].list[3].list[1].list[0].data = valueXML;
        return stringify(presetChunk);
    };

    /**
     * API
     */
    $.global.Atarabi = $.global.Atarabi || {};
    var Atarabi: Atarabi = $.global.Atarabi; Atarabi.RIFX = (Atarabi.RIFX || {}) as any;

    Atarabi.RIFX.stringify = stringify;

    Atarabi.RIFX.parse = (file: File) => {
        return parse(file)[0];
    };

    Atarabi.RIFX.parseWithXMP = (file: File) => {
        return parse(file, true);
    };

    Atarabi.RIFX.size = size;

    Atarabi.RIFX.walk = walk;

    Atarabi.RIFX.makeGradientPreset = makeGradientPreset;

    Atarabi.RIFX.makePseudoEffectPreset = (config: Atarabi.Pseudo.Config) => {
        return stringify(makePseudoEffectChunk(config));
    };

    Atarabi.RIFX.encode = encode;

    Atarabi.RIFX.decode = decode;
    /** END **/
})();
