// embeded in @script
(function () {
    /** START **/
    // rifx
    var isArray = function (arg) { return Object.prototype.toString.call(arg) === '[object Array]'; };
    function log2(n) {
        return Math.log(n) / Math.LN2;
    }
    function trunc(n) {
        return n < 0 ? Math.ceil(n) : Math.floor(n);
    }
    var Pack = /** @class */ (function () {
        function Pack() {
        }
        Pack.int8 = function (n) { return String.fromCharCode(n & 0xFF); };
        Pack.int16 = function (n) { return String.fromCharCode((n >> 8) & 0xFF, n & 0xFF); };
        Pack.int32 = function (n) { return String.fromCharCode((n >> 24) & 0xFF, (n >> 16) & 0xFF, (n >> 8) & 0xFF, n & 0xFF); };
        Pack.float32 = function (n) {
            var sign = n < 0 ? 1 : 0;
            var absN = Math.abs(n);
            var exponent = Math.floor(log2(absN));
            var biasedExponent = exponent + 127;
            var mantissa = (absN / Math.pow(2, exponent) - 1) * Math.pow(2, 23);
            var bits = (sign << 31) | (biasedExponent << 23) | (mantissa & 0x7FFFFF);
            return String.fromCharCode((bits >> 24) & 0xFF, (bits >> 16) & 0xFF, (bits >> 8) & 0xFF, bits & 0xFF);
        };
        Pack.fixed32 = function (n) {
            return Pack.int32(trunc(n * 65536 + (n < 0 ? -0.5 : 0.5)));
        };
        Pack.float64 = function (n) {
            var sign = n < 0 ? 1 : 0;
            var absN = Math.abs(n);
            var exponent = Math.floor(log2(absN));
            var biasedExponent = exponent + 1023;
            var mantissa = (absN / Math.pow(2, exponent) - 1) * Math.pow(2, 52);
            var high = (sign << 31) | (biasedExponent << 20) | (mantissa / Math.pow(2, 32) & 0xFFFFF);
            var low = mantissa & 0xFFFFFFFF;
            return String.fromCharCode((high >> 24) & 0xFF, (high >> 16) & 0xFF, (high >> 8) & 0xFF, high & 0xFF, (low >> 24) & 0xFF, (low >> 16) & 0xFF, (low >> 8) & 0xFF, low & 0xFF);
        };
        return Pack;
    }());
    var Unpack = /** @class */ (function () {
        function Unpack() {
        }
        Unpack.int8 = function (s) { return s.charCodeAt(0); };
        Unpack.int16 = function (s) { return (s.charCodeAt(0) << 8) + s.charCodeAt(1); };
        Unpack.int32 = function (s) { return (s.charCodeAt(0) << 24) + (s.charCodeAt(1) << 16) + (s.charCodeAt(2) << 8) + s.charCodeAt(3); };
        Unpack.float32 = function (s) {
            var bits = 0;
            for (var i = 0; i < 4; i++) {
                bits = (bits << 8) | s.charCodeAt(i);
            }
            var sign = (bits >>> 31) === 0 ? 1 : -1;
            var exponent = (bits >>> 23) & 0xFF;
            var mantissa = bits & 0x7FFFFF;
            if (exponent === 0 && mantissa === 0) {
                return sign * 0;
            }
            return sign * (1 + mantissa / Math.pow(2, 23)) * Math.pow(2, exponent - 127);
        };
        Unpack.fixed32 = function (s) {
            return Unpack.int32(s) / 65536;
        };
        Unpack.float64 = function (s) {
            var high = 0;
            for (var i = 0; i < 4; i++) {
                high = (high << 8) | s.charCodeAt(i);
            }
            var low = 0;
            for (var i = 4; i < 8; i++) {
                low = (low << 8) | s.charCodeAt(i);
            }
            var sign = (high >>> 31) === 0 ? 1 : -1;
            var exponent = (high >>> 20) & 0x7FF;
            var mantissaHigh = high & 0xFFFFF;
            if (exponent === 0 && mantissaHigh === 0 && low === 0) {
                return sign * 0;
            }
            return sign * (1 + (mantissaHigh / Math.pow(2, 20)) + (low / Math.pow(2, 52))) * Math.pow(2, exponent - 1023);
        };
        return Unpack;
    }());
    var FileReader = /** @class */ (function () {
        function FileReader(fp) {
            this.fp = fp;
        }
        FileReader.prototype.raise = function () {
            throw 'parse error';
        };
        FileReader.prototype.tell = function () {
            return this.fp.tell();
        };
        FileReader.prototype.seek = function (count, mode) {
            var ok = this.fp.seek(count, mode);
            if (!ok)
                this.raise();
        };
        FileReader.prototype.read = function (count) {
            if (typeof count !== 'number') {
                return this.fp.read();
            }
            if (count === 0) {
                return '';
            }
            var b = this.fp.read(count);
            if (b.length !== count)
                this.raise();
            return b;
        };
        return FileReader;
    }());
    // for "binary" string
    var StringReader = /** @class */ (function () {
        function StringReader(str) {
            this.str = str;
            this.pos = 0;
        }
        StringReader.prototype.raise = function () {
            throw 'parse error';
        };
        StringReader.prototype.tell = function () {
            return this.pos;
        };
        StringReader.prototype.seek = function (count, mode) {
            var pos = 0;
            switch (mode) {
                case 0 /* Mode.Absolute */:
                    pos = count;
                    break;
                case 1 /* Mode.Relative */:
                    pos = this.pos + count;
                    break;
                case 2 /* Mode.Backward */:
                    pos = this.str.length - count;
                    break;
            }
            if (pos < 0 || pos >= this.str.length)
                this.raise();
            this.pos = pos;
        };
        StringReader.prototype.read = function (count) {
            if (typeof count !== 'number') {
                var text = this.str.substr(this.pos);
                this.pos = this.str.length;
                return text;
            }
            if (count === 0) {
                return '';
            }
            var b = this.str.substr(this.pos, count);
            this.pos += b.length;
            if (b.length !== count)
                this.raise();
            return b;
        };
        return StringReader;
    }());
    var Parser = /** @class */ (function () {
        function Parser(reader) {
            this.reader = reader;
        }
        Parser.prototype.tell = function () {
            return this.reader.tell();
        };
        Parser.prototype.seek = function (count, mode) {
            this.reader.seek(count, mode);
        };
        Parser.prototype.read = function (count) {
            return this.reader.read(count);
        };
        Parser.prototype.int8 = function () {
            return Unpack.int8(this.read(1));
        };
        Parser.prototype.int16 = function () {
            return Unpack.int16(this.read(2));
        };
        Parser.prototype.int32 = function () {
            return Unpack.int32(this.read(4));
        };
        Parser.prototype.fixed32 = function () {
            return Unpack.fixed32(this.read(4));
        };
        Parser.prototype.float32 = function () {
            return Unpack.float32(this.read(4));
        };
        Parser.prototype.float64 = function () {
            return Unpack.float64(this.read(8));
        };
        return Parser;
    }());
    var RIFX = 'RIFX';
    var LIST = 'LIST';
    var isCOSList = function (id) { return id === 'btdk'; };
    var parseList = function (parser, parent, totalLength) {
        var start = parser.tell();
        var current = 0;
        while (current < totalLength) {
            if (current + 8 > totalLength) {
                throw 'invalid chunk';
            }
            var id = parser.read(4);
            var length = parser.int32();
            if (id === LIST) {
                var listId = parser.read(4);
                if (isCOSList(listId)) {
                    var list = { id: id, data: listId, cosList: parser.read(length - 4) };
                    parent.list.push(list);
                }
                else {
                    var list = { id: id, data: listId, list: [] };
                    parent.list.push(list);
                    parseList(parser, list, length - 4);
                }
                current += 8 + length;
            }
            else {
                var data = parser.read(length);
                var chunk = { id: id, data: data };
                parent.list.push(chunk);
                current += 8 + length;
                if (length % 2 === 1) {
                    parser.seek(1, 1 /* Mode.Relative */);
                    current += 1;
                }
            }
        }
        parser.seek(start + totalLength, 0 /* Mode.Absolute */);
    };
    var parseRIFX = function (parser) {
        var id = parser.read(4);
        if (id !== RIFX) {
            throw 'invalid header';
        }
        var length = parser.int32();
        var listId = parser.read(4);
        var rifx = { id: id, data: listId, list: [] };
        parseList(parser, rifx, length - 4);
        return rifx;
    };
    var parse = function (file, readToEnd) {
        if (readToEnd === void 0) { readToEnd = false; }
        var rifx = null;
        var tail = '';
        var newFile = new File(file.absoluteURI);
        newFile.encoding = 'binary';
        if (!newFile.open('r')) {
            throw 'unable to open file';
        }
        var err = null;
        try {
            var reader = new FileReader(newFile);
            rifx = parseRIFX(new Parser(reader));
            if (readToEnd) {
                tail = reader.read();
            }
        }
        catch (e) {
            err = e;
        }
        finally {
            newFile.close();
        }
        if (err) {
            throw err;
        }
        return [rifx, tail];
    };
    var stringify = function (chunk) {
        var binary = '';
        if (chunk.id === LIST && isCOSList(chunk.data)) {
            var cosList = chunk.cosList;
            binary += chunk.id;
            binary += Pack.int32(4 + cosList.length);
            binary += cosList;
        }
        else if (chunk.id === RIFX || chunk.id === LIST) {
            var binaries = [];
            var length = 0;
            for (var _i = 0, _a = chunk.list; _i < _a.length; _i++) {
                var child = _a[_i];
                var childBinary = stringify(child);
                length += childBinary.length;
                binaries.push(childBinary);
            }
            binary += chunk.id;
            binary += Pack.int32(4 + length);
            binary += chunk.data;
            binary += binaries.join('');
        }
        else {
            binary += chunk.id;
            binary += Pack.int32(chunk.data.length);
            binary += chunk.data;
            if (chunk.data.length % 2 === 1) {
                binary += '\0';
            }
        }
        return binary;
    };
    var size = function (chunk) {
        if (chunk.id === LIST && isCOSList(chunk.data)) {
            return 4 + chunk.cosList.length;
        }
        else if (chunk.id === RIFX || chunk.id === LIST) {
            var total = 0;
            for (var _i = 0, _a = chunk.list; _i < _a.length; _i++) {
                var child = _a[_i];
                var childSize = size(child);
                total += 8 + childSize;
                if (childSize % 2 === 1) {
                    total += 1;
                }
            }
            return 4 + total;
        }
        else {
            return chunk.data.length;
        }
    };
    var visit = function (chunk, fn) {
        if (!fn(chunk)) {
            return false;
        }
        if (chunk && (chunk.id === RIFX || chunk.id === LIST)) {
            if (chunk.list) {
                for (var _i = 0, _a = chunk.list; _i < _a.length; _i++) {
                    var child = _a[_i];
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
    var walk = function (chunk, fn) {
        visit(chunk, fn);
    };
    // pseudo
    function trimNull(str) {
        return str.replace(/[\x00]+$/, '');
    }
    function appendNull(str, len) {
        if (str.length >= len - 1) {
            str = str.substr(0, len - 1);
        }
        return str + repeat('\0', len - str.length);
    }
    function repeat(str, count) {
        count = Math.floor(count);
        var result = '';
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
    var ChunkCodec = /** @class */ (function () {
        function ChunkCodec() {
        }
        ChunkCodec.register = function (ids, decoder, encoder) {
            if (typeof ids === 'string') {
                ids = [ids];
            }
            for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                var id = ids_1[_i];
                if (ChunkCodec.STORE.hasOwnProperty(id)) {
                    throw new Error("".concat(id, " is already registered"));
                }
                ChunkCodec.STORE[id] = { decoder: decoder, encoder: encoder };
            }
        };
        ChunkCodec.decode = function (chunk) {
            if (ChunkCodec.STORE.hasOwnProperty(chunk.id)) {
                return ChunkCodec.STORE[chunk.id].decoder(chunk);
            }
            return chunk;
        };
        ChunkCodec.encode = function (chunk) {
            if (ChunkCodec.STORE.hasOwnProperty(chunk.id)) {
                return ChunkCodec.STORE[chunk.id].encoder(chunk);
            }
            return chunk;
        };
        ChunkCodec.STORE = {};
        return ChunkCodec;
    }());
    // Fixed String
    function decodeFixedString(str) {
        var length = str.length;
        var text = trimNull(str);
        return { text: text, length: length };
    }
    function encodeFixedString(str) {
        return appendNull(str.text, str.length);
    }
    ChunkCodec.register(['tdmn'], function (chunk) {
        return { id: chunk.id, data: decodeFixedString(chunk.data) };
    }, function (chunk) {
        return { id: chunk.id, data: encodeFixedString(chunk.data) };
    });
    // Variable String
    function decodeVariableString(str) {
        if (str.substr(0, 4) === 'Utf8') {
            var len = Unpack.int32(str.substr(4, 4));
            var text = str.substr(8, len);
            return { text: text, utf8: true };
        }
        else {
            var text = trimNull(str);
            return { text: text, utf8: false };
        }
    }
    function encodeVariableString(str) {
        if (str.utf8) {
            return 'Utf8' + Pack.int32(str.text.length) + str.text + (str.text.length % 2 === 1 ? '\0' : '');
        }
        else {
            return trimNull(str.text) + '\0';
        }
    }
    var VARIABLE_STRING_CHUNKS = ['tdsn', 'pdnm', 'fnam', 'Utf8', 'expr'];
    ChunkCodec.register(VARIABLE_STRING_CHUNKS, function (chunk) {
        return { id: chunk.id, data: decodeVariableString(chunk.data) };
    }, function (chunk) {
        return { id: chunk.id, data: encodeVariableString(chunk.data) };
    });
    // int32
    var INT32_CHUNKS = ['tdpl', 'tdix', 'tdsb', 'tdpi', 'tdli', 'tdps', 'parn'];
    ChunkCodec.register(INT32_CHUNKS, function (chunk) {
        return { id: chunk.id, data: Unpack.int32(chunk.data) };
    }, function (chunk) {
        return { id: chunk.id, data: Pack.int32(chunk.data) };
    });
    // float64
    var FLOAT64_CHUNKS = ['tdum', 'tduM'];
    ChunkCodec.register(FLOAT64_CHUNKS, function (chunk) {
        return { id: chunk.id, data: Unpack.float64(chunk.data) };
    }, function (chunk) {
        return { id: chunk.id, data: Pack.float64(chunk.data) };
    });
    // float64Array
    ChunkCodec.register(['cdat'], function (chunk) {
        var arr = [];
        for (var i = 0; i < chunk.data.length; i += 8) {
            arr.push(Unpack.float64(chunk.data.substr(i, 8)));
        }
        return { id: chunk.id, data: arr };
    }, function (chunk) {
        var data = '';
        for (var _i = 0, _a = chunk.data; _i < _a.length; _i++) {
            var n = _a[_i];
            data += Pack.float64(n);
        }
        return { id: chunk.id, data: data };
    });
    function decodeParamDef(str) {
        if (str.length !== 148) {
            return { type: -1, data: str };
        }
        var parser = new Parser(new StringReader(str));
        parser.read(4);
        var uiFlags = parser.int32();
        var uiWidth = parser.int16();
        var uiHeight = parser.int16();
        var type = parser.int32();
        var name = decodeFixedString(parser.read(32));
        var flags = parser.int32();
        var unused = parser.read(4);
        switch (type) {
            default:
                {
                    return { type: type, data: str };
                }
            case 0 /* PF.ParamType.Layer */:
                {
                    parser.read(72);
                    var dephault = parser.int32();
                    return { type: 'layer', name: name, uiFlags: uiFlags, flags: flags, dephault: dephault };
                }
            case 1 /* PF.ParamType.Slider */:
                {
                    var value = parser.int32();
                    parser.read(32);
                    parser.read(32);
                    var validMin = parser.int32();
                    var validMax = parser.int32();
                    var sliderMin = parser.int32();
                    var sliderMax = parser.int32();
                    var dephault = parser.int32();
                    return { type: 'slider', name: name, value: value, validMin: validMin, validMax: validMax, sliderMin: sliderMin, sliderMax: sliderMax, dephault: dephault, uiFlags: uiFlags, flags: flags };
                }
            case 2 /* PF.ParamType.FixedSlider */:
                {
                    var value = parser.fixed32();
                    parser.read(32);
                    parser.read(32);
                    var validMin = parser.fixed32();
                    var validMax = parser.fixed32();
                    var sliderMin = parser.fixed32();
                    var sliderMax = parser.fixed32();
                    var dephault = parser.fixed32();
                    var precision = parser.int16();
                    var displayFlags = parser.int16();
                    return { type: 'fixedSlider', name: name, value: value, validMin: validMin, validMax: validMax, sliderMin: sliderMin, sliderMax: sliderMax, dephault: dephault, precision: precision, displayFlags: displayFlags, uiFlags: uiFlags, flags: flags };
                }
            case 3 /* PF.ParamType.Angle */:
                {
                    var value = parser.fixed32();
                    var dephault = parser.fixed32();
                    var validMin = parser.fixed32();
                    var validMax = parser.fixed32();
                    return { type: 'angle', name: name, value: value, dephault: dephault, validMin: validMin, validMax: validMax, uiFlags: uiFlags, flags: flags };
                }
            case 4 /* PF.ParamType.Checkbox */:
                {
                    var value = parser.int32();
                    var dephault = parser.int8();
                    return { type: 'checkbox', name: name, value: value, dephault: dephault, uiFlags: uiFlags, flags: flags };
                }
            case 5 /* PF.ParamType.Color */:
                {
                    var value = {
                        alpha: parser.int8(),
                        red: parser.int8(),
                        green: parser.int8(),
                        blue: parser.int8(),
                    };
                    var dephault = {
                        alpha: parser.int8(),
                        red: parser.int8(),
                        green: parser.int8(),
                        blue: parser.int8(),
                    };
                    return { type: 'color', name: name, value: value, dephault: dephault, uiFlags: uiFlags, flags: flags };
                }
            case 6 /* PF.ParamType.Point */:
                {
                    var xValue = parser.fixed32();
                    var yValue = parser.fixed32();
                    parser.read(3);
                    var restrictBounds = parser.int8();
                    var xDephault = parser.fixed32();
                    var yDephault = parser.fixed32();
                    return { type: 'point', name: name, xValue: xValue, yValue: yValue, restrictBounds: restrictBounds, xDephault: xDephault, yDephault: yDephault, uiFlags: uiFlags, flags: flags };
                }
            case 7 /* PF.ParamType.Popup */:
                {
                    var value = parser.int32();
                    var numChoices = parser.int16();
                    var dephault = parser.int16();
                    return { type: 'popup', name: name, value: value, numChoices: numChoices, dephault: dephault, uiFlags: uiFlags, flags: flags };
                }
            case 9 /* PF.ParamType.NoData */:
                {
                    return { type: 'noData', name: name, uiWidth: uiWidth, uiHeight: uiHeight, uiFlags: uiFlags, flags: flags };
                }
            case 10 /* PF.ParamType.FloatSlider */:
                {
                    var value = parser.float64();
                    var phase = parser.float64();
                    parser.read(32);
                    var validMin = parser.float32();
                    var validMax = parser.float32();
                    var sliderMin = parser.float32();
                    var sliderMax = parser.float32();
                    var dephault = parser.float32();
                    var precision = parser.int16();
                    var displayFlags = parser.int16();
                    var fsFlags = parser.int32();
                    var curveTolerance = parser.float32();
                    var useExponent = parser.int8();
                    var exponent = parser.float32();
                    return { type: 'floatSlider', name: name, value: value, phase: phase, validMin: validMin, validMax: validMax, sliderMin: sliderMin, sliderMax: sliderMax, dephault: dephault, precision: precision, displayFlags: displayFlags, fsFlags: fsFlags, curveTolerance: curveTolerance, useExponent: useExponent, exponent: exponent, uiFlags: uiFlags, flags: flags };
                }
            case 11 /* PF.ParamType.ArbitraryData */:
                {
                    var id = parser.int16();
                    return { type: 'arbitraryData', name: name, id: id, uiWidth: uiWidth, uiHeight: uiHeight, uiFlags: uiFlags, flags: flags };
                }
            case 12 /* PF.ParamType.Path */:
                {
                    var pathId = parser.int32();
                    parser.read(4);
                    var dephault = parser.int32();
                    return { type: 'path', name: name, pathId: pathId, dephault: dephault, uiFlags: uiFlags, flags: flags };
                }
            case 13 /* PF.ParamType.GroupStart */:
                {
                    return { type: 'groupStart', name: name, uiFlags: uiFlags, flags: flags };
                }
            case 14 /* PF.ParamType.GroupEnd */:
                {
                    return { type: 'groupEnd' };
                }
            case 15 /* PF.ParamType.Button */:
                {
                    var value = parser.int32();
                    return { type: 'button', name: name, value: value, uiFlags: uiFlags, flags: flags };
                }
            case 18 /* PF.ParamType.Point3D */:
                {
                    var xValue = parser.float64();
                    var yValue = parser.float64();
                    var zValue = parser.float64();
                    var xDephault = parser.float64();
                    var yDephault = parser.float64();
                    var zDephault = parser.float64();
                    return { type: 'point3D', name: name, xValue: xValue, yValue: yValue, zValue: zValue, xDephault: xDephault, yDephault: yDephault, zDephault: zDephault, uiFlags: uiFlags, flags: flags };
                }
        }
    }
    function encodeParamDef(data) {
        if (typeof data.type === 'number') {
            return data.data;
        }
        var binary = '';
        binary += repeat('\0', 4);
        var LEN = 148;
        switch (data.type) {
            case 'layer':
                {
                    binary += Pack.int32(data.uiFlags);
                    binary += repeat('\0', 4);
                    binary += Pack.int32(0 /* PF.ParamType.Layer */);
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
                    binary += Pack.int32(1 /* PF.ParamType.Slider */);
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
                    binary += Pack.int32(2 /* PF.ParamType.FixedSlider */);
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
                    binary += Pack.int32(3 /* PF.ParamType.Angle */);
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
                    binary += Pack.int32(4 /* PF.ParamType.Checkbox */);
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
                    binary += Pack.int32(5 /* PF.ParamType.Color */);
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
                    binary += Pack.int32(6 /* PF.ParamType.Point */);
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
                    binary += Pack.int32(7 /* PF.ParamType.Popup */);
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
                    binary += Pack.int32(9 /* PF.ParamType.NoData */);
                    binary += encodeFixedString(data.name);
                    binary += Pack.int32(data.flags);
                    binary += repeat('\0', 4);
                    break;
                }
            case 'floatSlider':
                {
                    binary += Pack.int32(data.uiFlags);
                    binary += repeat('\0', 4);
                    binary += Pack.int32(10 /* PF.ParamType.FloatSlider */);
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
                    binary += Pack.int32(11 /* PF.ParamType.ArbitraryData */);
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
                    binary += Pack.int32(12 /* PF.ParamType.Path */);
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
                    binary += Pack.int32(13 /* PF.ParamType.GroupStart */);
                    binary += encodeFixedString(data.name);
                    binary += Pack.int32(data.flags);
                    binary += repeat('\0', 4);
                    break;
                }
            case 'groupEnd':
                {
                    binary += repeat('\0', 8);
                    binary += Pack.int32(14 /* PF.ParamType.GroupEnd */);
                    break;
                }
            case 'button':
                {
                    binary += Pack.int32(data.uiFlags);
                    binary += repeat('\0', 4);
                    binary += Pack.int32(15 /* PF.ParamType.Button */);
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
                    binary += Pack.int32(18 /* PF.ParamType.Point3D */);
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
    ChunkCodec.register(['pard'], function (chunk) {
        return { id: chunk.id, data: decodeParamDef(chunk.data) };
    }, function (chunk) {
        return { id: chunk.id, data: encodeParamDef(chunk.data) };
    });
    function decodeListChunk(parent, chunk) {
        if (isArray(chunk.list)) {
            for (var _i = 0, _a = chunk.list; _i < _a.length; _i++) {
                var child = _a[_i];
                if (child.id === LIST) {
                    if (isCOSList(child.data)) {
                        var decodedChunk = { id: child.id, data: child.data, cosList: child.cosList };
                        parent.list.push(decodedChunk);
                    }
                    else {
                        var decodedChunk = { id: child.id, data: child.data, list: [] };
                        parent.list.push(decodedChunk);
                        decodeListChunk(decodedChunk, child);
                    }
                }
                else {
                    var decodedChunk = ChunkCodec.decode(child);
                    parent.list.push(decodedChunk);
                }
            }
        }
    }
    function decode(chunk) {
        if (chunk.id === RIFX || chunk.id === LIST) {
            if (isCOSList(chunk.data)) {
                return { id: chunk.id, data: chunk.data, cosList: chunk.cosList };
            }
            var decodedChunk = { id: chunk.id, data: chunk.data, list: [] };
            decodeListChunk(decodedChunk, chunk);
            return decodedChunk;
        }
        else {
            return ChunkCodec.decode(chunk);
        }
    }
    function encodeListChunk(parent, chunk) {
        if (isArray(chunk.list)) {
            for (var _i = 0, _a = chunk.list; _i < _a.length; _i++) {
                var child = _a[_i];
                if (child.id === LIST) {
                    if (isCOSList(child.data)) {
                        var encodedChunk = { id: child.id, data: child.data, cosList: child.cosList };
                        parent.list.push(encodedChunk);
                    }
                    else {
                        var encodedChunk = { id: child.id, data: child.data, list: [] };
                        parent.list.push(encodedChunk);
                        encodeListChunk(encodedChunk, child);
                    }
                }
                else {
                    var encodedChunk = ChunkCodec.encode(child);
                    parent.list.push(encodedChunk);
                }
            }
        }
    }
    function encode(chunk) {
        if (chunk.id === RIFX || chunk.id === LIST) {
            if (isCOSList(chunk.data)) {
                return { id: chunk.id, data: chunk.data, cosList: chunk.cosList };
            }
            var encodedChunk = { id: chunk.id, data: chunk.data, list: [] };
            encodeListChunk(encodedChunk, chunk);
            return encodedChunk;
        }
        else {
            return ChunkCodec.encode(chunk);
        }
    }
    function makeTdmn(matchName) {
        return { id: 'tdmn', data: { text: matchName, length: 40 } };
    }
    function makePard(parameter) {
        var pard = { id: 'pard', data: null };
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
        return pard;
    }
    function makeVariableStringChunk(id, text, utf8) {
        if (utf8 === void 0) { utf8 = false; }
        return { id: id, data: { text: text, utf8: utf8 } };
    }
    function makeInt32Chunk(id, data) {
        return { id: id, data: data };
    }
    function makeFloat64Chunk(id, data) {
        return { id: id, data: data };
    }
    var BASE_TDB4S = {
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
    };
    function buildTdb4(type, key) {
        return BASE_TDB4S[type] + (key ? "\x01\x00\x00\x00" : "\x00\x00\x00\x00");
    }
    function makeTdb4(parameter) {
        var hasKey = false;
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
        return { id: 'tdb4', data: buildTdb4(parameter.type, hasKey) };
    }
    var CDAT_LENS = {
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
    function makeCdat(parameter) {
        var data = [];
        for (var i = 0, l = CDAT_LENS[parameter.type]; i < l; i++) {
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
        return { id: 'cdat', data: data };
    }
    function makeTdbs(parameter, dynStreamFlags) {
        if (dynStreamFlags === void 0) { dynStreamFlags = 1; }
        var tdbs = { id: 'LIST', data: 'tdbs', list: [] };
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
    function makePseudoTempalte(matchName, name, paramDefsList, streamValuesList) {
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
    function zfill(number, size, ch) {
        if (size === void 0) { size = 4; }
        if (ch === void 0) { ch = '0'; }
        var s = '' + number;
        while (s.length < size) {
            s = ch + s;
        }
        return s;
    }
    function getDynStreamFlag(parameter) {
        if (parameter.type === 'groupEnd') {
            return 1;
        }
        return parameter.uiFlags & 512 /* PF.ParamUIFlags.Invisible */ ? 3 : 1;
    }
    function makePseudoEffectChunk(_a) {
        var matchName = _a.matchName, name = _a.name, parameters = _a.parameters;
        if (matchName.indexOf('Pseudo/') !== 0) {
            throw new Error("matchName must start with 'Pseudo/");
        }
        var inputParameter = { type: 'layer', name: '', dephault: -1 /* PF.LayerDefault.Myself */, uiFlags: 0 /* PF.ParamUIFlags.None */, flags: 2 /* PF.ParamFlags.CannotTimeVary */, id: 0 };
        var paramDefsList = [];
        // input
        paramDefsList.push(encode({ id: 'parn', data: 1 + parameters.length }));
        paramDefsList.push(encode(makeTdmn("".concat(matchName, "-").concat(zfill(inputParameter.id)))));
        paramDefsList.push(encode(makePard(inputParameter)));
        // params			
        for (var _i = 0, parameters_1 = parameters; _i < parameters_1.length; _i++) {
            var parameter = parameters_1[_i];
            paramDefsList.push(encode(makeTdmn("".concat(matchName, "-").concat(zfill(parameter.id)))));
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
        var streamValuesList = [];
        // input
        streamValuesList.push(encode(makeTdmn("".concat(matchName, "-").concat(zfill(0)))));
        streamValuesList.push(encode(makeTdbs(inputParameter, 3)));
        // params
        for (var _b = 0, parameters_2 = parameters; _b < parameters_2.length; _b++) {
            var parameter = parameters_2[_b];
            streamValuesList.push(encode(makeTdmn("".concat(matchName, "-").concat(zfill(parameter.id)))));
            streamValuesList.push(encode(makeTdbs(parameter, getDynStreamFlag(parameter))));
        }
        // sentinel
        streamValuesList.push(encode(makeTdmn('ADBE Group End')));
        return makePseudoTempalte(matchName, name, paramDefsList, streamValuesList);
    }
    var stringifyTag = function (tag) {
        var text = '';
        var attributes = [];
        if (tag.attributes) {
            for (var key in tag.attributes) {
                if (tag.attributes.hasOwnProperty(key)) {
                    attributes.push("".concat(key, "='").concat(tag.attributes[key], "'"));
                }
            }
        }
        var childrenText = '';
        if (tag.text) {
            childrenText = tag.text;
        }
        else if (isArray(tag.children)) {
            for (var _i = 0, _a = tag.children; _i < _a.length; _i++) {
                var child = _a[_i];
                childrenText += stringifyTag(child);
            }
        }
        if (childrenText) {
            if (attributes.length) {
                text = "<".concat(tag.tag, " ").concat(attributes.join(' '), ">").concat(childrenText, "</").concat(tag.tag, ">");
            }
            else {
                text = "<".concat(tag.tag, ">").concat(childrenText, "</").concat(tag.tag, ">");
            }
        }
        else {
            if (attributes.length) {
                text = "<".concat(tag.tag, " ").concat(attributes.join(' '), "/>");
            }
            else {
                text = "<".concat(tag.tag, "/>");
            }
        }
        return text;
    };
    var makePropListTag = function () {
        var propList = { tag: 'prop.list', children: [] };
        return propList;
    };
    var makePropPairTag = function (key, value) {
        var propPair = { tag: 'prop.pair', children: [] };
        propPair.children.push({ tag: 'key', text: key });
        if (value) {
            propPair.children.push(value);
        }
        return propPair;
    };
    var makeArrayTag = function (type) {
        if (type === void 0) { type = 'float'; }
        var array = { tag: 'array', children: [] };
        array.children.push({ tag: 'array.type', children: [{ tag: type }] });
        return array;
    };
    var makeStopsTag = function (type, stopArr) {
        var baseStopsList = makePropListTag();
        var baseStops = makePropPairTag("".concat(type, " Stops"), baseStopsList);
        var stops = makePropListTag();
        var stopsList = makePropPairTag('Stops List', stops);
        baseStopsList.children.push(stopsList);
        for (var i = 0; i < stopArr.length; i++) {
            var valueList = makePropListTag();
            var stop = makePropPairTag("Stop-".concat(i), valueList);
            stops.children.push(stop);
            var valueArr = makeArrayTag('float');
            var valuePair = makePropPairTag("Stops ".concat(type), valueArr);
            valueList.children.push(valuePair);
            for (var _i = 0, _a = stopArr[i]; _i < _a.length; _i++) {
                var value = _a[_i];
                valueArr.children.push({ tag: 'float', text: "".concat(value) });
            }
        }
        var stopsSize = makePropPairTag('Stops Size');
        baseStopsList.children.push(stopsSize);
        stopsSize.children.push({ tag: 'int', attributes: { type: 'unsigned', size: 32 }, text: "".concat(stopArr.length) });
        return baseStops;
    };
    var convertAlphaStopToArray = function (stop) {
        var arr = [];
        arr.push(stop.location);
        arr.push(typeof stop.midpoint === 'number' ? stop.midpoint : 0.5);
        arr.push(stop.opacity);
        return arr;
    };
    var makeAlphaStopsTag = function (stops) {
        var arr = [];
        for (var _i = 0, stops_1 = stops; _i < stops_1.length; _i++) {
            var stop = stops_1[_i];
            arr.push(convertAlphaStopToArray(stop));
        }
        return makeStopsTag('Alpha', arr);
    };
    var convertColorStopToArray = function (stop) {
        var arr = [];
        arr.push(stop.location);
        arr.push(typeof stop.midpoint === 'number' ? stop.midpoint : 0.5);
        arr.push(stop.color[0]);
        arr.push(stop.color[1]);
        arr.push(stop.color[2]);
        arr.push(1);
        return arr;
    };
    var makeColorStopsTag = function (stops) {
        var arr = [];
        for (var _i = 0, stops_2 = stops; _i < stops_2.length; _i++) {
            var stop = stops_2[_i];
            arr.push(convertColorStopToArray(stop));
        }
        return makeStopsTag('Color', arr);
    };
    var makeGradientXML = function (value) {
        var base = { tag: 'prop.map', attributes: { version: 4 }, children: [] };
        var baseList = makePropListTag();
        base.children.push(baseList);
        var gradientColorDataList = makePropListTag();
        var gradientColorData = makePropPairTag('Gradient Color Data', gradientColorDataList);
        baseList.children.push(gradientColorData);
        var alphaStopsTag = makeAlphaStopsTag(value.alphaStops);
        gradientColorDataList.children.push(alphaStopsTag);
        var colorStopsTag = makeColorStopsTag(value.colorStops);
        gradientColorDataList.children.push(colorStopsTag);
        return "<?xml version='1.0'?>" + stringifyTag(base);
    };
    var getParentMatchName = function (type) {
        switch (type) {
            case 'Gradient Fill':
                return "ADBE Vector Graphic - G-Fill\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00";
            case 'Gradient Stroke':
                return "ADBE Vector Graphic - G-Stroke\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00";
            case "Gradient Overlay":
                return "gradientFill/enabled\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00";
        }
    };
    var getPropertyMatchName = function (type) {
        switch (type) {
            case 'Gradient Fill':
            case 'Gradient Stroke':
                return "ADBE Vector Grad Colors\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00";
            case "Gradient Overlay":
                return "gradientFill/gradient\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00";
        }
    };
    var createGradientTemplate = function (type) {
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
    var createGradientTemplateWithKey = function (type) {
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
    var makeGradientPreset = function (value, type, key) {
        if (key === void 0) { key = false; }
        if (value.alphaStops.length < 2) {
            throw "length of alphaStops must be 2 or greater: ".concat(value.alphaStops.length);
        }
        if (value.colorStops.length < 2) {
            throw "length of colorStops must be 2 or greater: ".concat(value.colorStops.length);
        }
        var valueXML = makeGradientXML(value);
        var presetChunk = key ? createGradientTemplateWithKey(type) : createGradientTemplate(type);
        presetChunk.list[1].list[3].list[1].list[0].data = valueXML;
        return stringify(presetChunk);
    };
    /**
     * API
     */
    $.global.Atarabi = $.global.Atarabi || {};
    var Atarabi = $.global.Atarabi;
    Atarabi.RIFX = (Atarabi.RIFX || {});
    Atarabi.RIFX.stringify = stringify;
    Atarabi.RIFX.parse = function (file) {
        return parse(file)[0];
    };
    Atarabi.RIFX.parseWithXMP = function (file) {
        return parse(file, true);
    };
    Atarabi.RIFX.size = size;
    Atarabi.RIFX.walk = walk;
    Atarabi.RIFX.makeGradientPreset = makeGradientPreset;
    Atarabi.RIFX.makePseudoEffectPreset = function (config) {
        return stringify(makePseudoEffectChunk(config));
    };
    Atarabi.RIFX.encode = encode;
    Atarabi.RIFX.decode = decode;
    /** END **/
})();
