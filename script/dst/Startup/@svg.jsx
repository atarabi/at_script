var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/**
 * @svg v1.1.1
 *
 *      v1.1.1(2025/04/02) Switch to Types-for-Adobe
 *      v1.1.0(2025/02/01) Partial support for style tags and gradients
 */
(function () {
    var SCRIPT_NAME = '@svg';
    /**
     *  Utility
     */
    var A = /** @class */ (function () {
        function A() {
        }
        A.map = function (arr, fn) {
            var result = [];
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var v = arr_1[_i];
                result.push(fn(v));
            }
            return result;
        };
        A.last = function (arr) {
            return arr[arr.length - 1];
        };
        return A;
    }());
    function trim(s) {
        return s.replace(/^\s+|\s+$/g, '');
    }
    function removeCComment(s) {
        return s.replace(/\/\*[\s\S]*?\*\//g, '');
    }
    function isArray(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    }
    function isLayer(layer) {
        return layer instanceof ShapeLayer || layer instanceof AVLayer || layer instanceof TextLayer || layer instanceof LightLayer || layer instanceof CameraLayer;
    }
    function isAVLayer(layer) {
        return layer instanceof ShapeLayer || layer instanceof AVLayer || layer instanceof TextLayer;
    }
    /**
     * Math
     */
    var M = /** @class */ (function () {
        function M() {
        }
        M.clamp = function (v, mn, mx) {
            return Math.min(Math.max(v, mn), mx);
        };
        M.sign = function (x) {
            return x >= 0 ? 1 : -1;
        };
        M.degreeToRadian = function (deg) {
            return deg / 180 * Math.PI;
        };
        M.radianToDegree = function (rad) {
            return rad / Math.PI * 180;
        };
        M.mod = function (a, b) {
            var v = a % b;
            return v < 0 ? v + b : v;
        };
        return M;
    }());
    var V2 = /** @class */ (function () {
        function V2() {
        }
        V2.add = function (lhs, rhs) {
            return [lhs[0] + rhs[0], lhs[1] + rhs[1]];
        };
        V2.added = function (lhs, rhs) {
            lhs[0] += rhs[0];
            lhs[1] += rhs[1];
            return lhs;
        };
        V2.sub = function (lhs, rhs) {
            return [lhs[0] - rhs[0], lhs[1] - rhs[1]];
        };
        V2.subed = function (lhs, rhs) {
            lhs[0] -= rhs[0];
            lhs[1] -= rhs[1];
            return lhs;
        };
        V2.mult = function (lhs, rhs) {
            if (typeof rhs === 'number') {
                return [lhs[0] * rhs, lhs[1] * rhs];
            }
            else {
                return [lhs[0] * rhs[0], lhs[1] * rhs[1]];
            }
        };
        V2.multed = function (lhs, rhs) {
            if (typeof rhs === 'number') {
                lhs[0] *= rhs;
                lhs[1] *= rhs;
            }
            else {
                lhs[0] *= rhs[0];
                lhs[1] *= rhs[1];
            }
            return lhs;
        };
        V2.div = function (lhs, rhs) {
            if (typeof rhs === 'number') {
                return [lhs[0] / rhs, lhs[1] / rhs];
            }
            else {
                return [lhs[0] / rhs[0], lhs[1] / rhs[1]];
            }
        };
        V2.dived = function (lhs, rhs) {
            if (typeof rhs === 'number') {
                lhs[0] /= rhs;
                lhs[1] /= rhs;
            }
            else {
                lhs[0] /= rhs[0];
                lhs[1] /= rhs[1];
            }
            return lhs;
        };
        V2.dot = function (lhs, rhs) {
            return lhs[0] * rhs[0] + lhs[1] * rhs[1];
        };
        V2.normalize = function (lhs) {
            return this.div(lhs, Math.sqrt(this.dot(lhs, lhs)));
        };
        return V2;
    }());
    var V3 = /** @class */ (function () {
        function V3() {
        }
        V3.add = function (lhs, rhs) {
            return [lhs[0] + rhs[0], lhs[1] + rhs[1], lhs[2] + rhs[2]];
        };
        V3.added = function (lhs, rhs) {
            lhs[0] += rhs[0];
            lhs[1] += rhs[1];
            lhs[2] += rhs[2];
            return lhs;
        };
        V3.sub = function (lhs, rhs) {
            return [lhs[0] - rhs[0], lhs[1] - rhs[1], lhs[2] - rhs[2]];
        };
        V3.subed = function (lhs, rhs) {
            lhs[0] -= rhs[0];
            lhs[1] -= rhs[1];
            lhs[2] -= rhs[2];
            return lhs;
        };
        V3.mult = function (lhs, rhs) {
            if (typeof rhs === 'number') {
                return [lhs[0] * rhs, lhs[1] * rhs, lhs[2] * rhs];
            }
            else {
                return [lhs[0] * rhs[0], lhs[1] * rhs[1], lhs[2] * rhs[2]];
            }
        };
        V3.multed = function (lhs, rhs) {
            if (typeof rhs === 'number') {
                lhs[0] *= rhs;
                lhs[1] *= rhs;
                lhs[2] *= rhs;
            }
            else {
                lhs[0] *= rhs[0];
                lhs[1] *= rhs[1];
                lhs[2] *= rhs[2];
            }
            return lhs;
        };
        V3.div = function (lhs, rhs) {
            if (typeof rhs === 'number') {
                return [lhs[0] / rhs, lhs[1] / rhs, lhs[2] / rhs];
            }
            else {
                return [lhs[0] / rhs[0], lhs[1] / rhs[1], lhs[2] / rhs[2]];
            }
        };
        V3.dived = function (lhs, rhs) {
            if (typeof rhs === 'number') {
                lhs[0] /= rhs;
                lhs[1] /= rhs;
                lhs[2] /= rhs;
            }
            else {
                lhs[0] /= rhs[0];
                lhs[1] /= rhs[1];
                lhs[2] /= rhs[2];
            }
            return lhs;
        };
        V3.dot = function (lhs, rhs) {
            return lhs[0] * rhs[0] + lhs[1] * rhs[1] + lhs[2] * rhs[2];
        };
        V3.normalize = function (lhs) {
            return this.div(lhs, Math.sqrt(this.dot(lhs, lhs)));
        };
        return V3;
    }());
    var Mat3x3 = /** @class */ (function () {
        function Mat3x3(r1, r2, r3) {
            this.mat = [__spreadArray([], r1, true), __spreadArray([], r2, true), __spreadArray([], r3, true)];
        }
        Mat3x3.prototype.clone = function () {
            return new Mat3x3(__spreadArray([], this.mat[0], true), __spreadArray([], this.mat[1], true), __spreadArray([], this.mat[2], true));
        };
        Mat3x3.identity = function () {
            return new Mat3x3([1, 0, 0], [0, 1, 0], [0, 0, 1]);
        };
        Mat3x3.zero = function () {
            return new Mat3x3([0, 0, 0], [0, 0, 0], [0, 0, 0]);
        };
        Mat3x3.mat = function (a, b, c, d, e, f) {
            return new Mat3x3([a, c, e], [b, d, f], [0, 0, 1]);
        };
        Mat3x3.translate = function (tx, ty) {
            return new Mat3x3([1, 0, tx], [0, 1, ty], [0, 0, 1]);
        };
        Mat3x3.scale = function (sx, sy) {
            return new Mat3x3([sx, 0, 0], [0, sy, 0], [0, 0, 1]);
        };
        Mat3x3.rotate = function (deg) {
            var rad = M.degreeToRadian(deg);
            return new Mat3x3([Math.cos(rad), -Math.sin(rad), 0], [Math.sin(rad), Math.cos(rad), 0], [0, 0, 1]);
        };
        Mat3x3.skewX = function (deg) {
            var rad = M.degreeToRadian(deg);
            return new Mat3x3([1, Math.tan(rad), 0], [0, 1, 0], [0, 0, 1]);
        };
        Mat3x3.skewY = function (deg) {
            var rad = M.degreeToRadian(deg);
            return new Mat3x3([1, 0, 0], [Math.tan(rad), 1, 0], [0, 0, 1]);
        };
        Mat3x3.prototype.T = function () {
            return new Mat3x3([this.mat[0][0], this.mat[1][0], this.mat[2][0]], [this.mat[0][1], this.mat[1][1], this.mat[2][1]], [this.mat[0][2], this.mat[1][2], this.mat[2][2]]);
        };
        Mat3x3.prototype.mult = function (m) {
            if (m instanceof Mat3x3) {
                var t = m.T();
                return new Mat3x3([V3.dot(this.mat[0], t.mat[0]), V3.dot(this.mat[0], t.mat[1]), V3.dot(this.mat[0], t.mat[2])], [V3.dot(this.mat[1], t.mat[0]), V3.dot(this.mat[1], t.mat[1]), V3.dot(this.mat[1], t.mat[2])], [V3.dot(this.mat[2], t.mat[0]), V3.dot(this.mat[2], t.mat[1]), V3.dot(this.mat[2], t.mat[2])]);
            }
            else {
                if (m.length === 2) {
                    var _m = [m[0], m[1], 1];
                    return [V3.dot(this.mat[0], _m), V3.dot(this.mat[1], _m)];
                }
                else {
                    return [V3.dot(this.mat[0], m), V3.dot(this.mat[1], m), V3.dot(this.mat[2], m)];
                }
            }
        };
        Mat3x3.prototype.inverse = function () {
            var _a = this.mat[0], a = _a[0], b = _a[1], c = _a[2];
            var _b = this.mat[1], d = _b[0], e = _b[1], f = _b[2];
            var _c = this.mat[2], g = _c[0], h = _c[1], i = _c[2];
            var det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
            var invDet = 1 / det;
            return new Mat3x3([
                invDet * (e * i - f * h),
                invDet * (c * h - b * i),
                invDet * (b * f - c * e)
            ], [
                invDet * (f * g - d * i),
                invDet * (a * i - c * g),
                invDet * (c * d - a * f)
            ], [
                invDet * (d * h - e * g),
                invDet * (b * g - a * h),
                invDet * (a * e - b * d)
            ]);
        };
        // ref: https://math.stackexchange.com/questions/13150/extracting-rotation-scale-values-from-2d-transformation-matrix
        Mat3x3.prototype.decompose = function () {
            var _a = this.mat[0], a = _a[0], c = _a[1], e = _a[2];
            var _b = this.mat[1], b = _b[0], d = _b[1], f = _b[2];
            var delta = a * d - b * c;
            var result = {
                translation: [e, f],
                scale: [0, 0],
                skew: [0, 0],
                rotation: 0,
            };
            if (a !== 0 || b !== 0) {
                var r = Math.sqrt(a * a + b * b);
                result.scale = [r, delta / r];
                result.skew = [Math.atan((a * c + b * d) / (r * r)), 0];
                result.rotation = M.sign(b) * Math.acos(a / r);
            }
            else if (c !== 0 || d !== 0) {
                var s = Math.sqrt(c * c + d * d);
                result.scale = [delta / s, s];
                result.skew = [0, Math.atan((a * c + b * d) / (s * s))];
                result.rotation = Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
            }
            return result;
        };
        return Mat3x3;
    }());
    var eof = function (_a) {
        var text = _a[0], pos = _a[1];
        if (pos < text.length) {
            return [false];
        }
        return [true, pos, null];
    };
    var is = function (f) { return function (_a) {
        var text = _a[0], pos = _a[1];
        if (pos < text.length) {
            var c = text[pos];
            if (f(c)) {
                return [true, pos + 1, c];
            }
        }
        return [false];
    }; };
    var are = function (f) { return function (_a) {
        var text = _a[0], pos = _a[1];
        if (pos < text.length) {
            var t = text.substr(pos);
            var c = f(t);
            if (c > 0) {
                return [true, pos + c, t.substr(0, c)];
            }
        }
        return [false];
    }; };
    var ch = function (c) { return function (input) { return is(function (v) { return v === c; })(input); }; };
    var str = function (s) { return function (input) {
        var t = input[0].substr(input[1], s.length);
        if (t === s) {
            return [true, input[1] + s.length, s];
        }
        return [false];
    }; };
    var reg = function (reg) { return function (input) {
        var s = input[0].substr(input[1]);
        var m = s.match(reg);
        if (!m) {
            return [false];
        }
        return [true, input[1] + m[0].length, m[0]];
    }; };
    var not = function (p) { return function (input) {
        if (p(input)[0]) {
            return [false];
        }
        else {
            return [true, input[1], null];
        }
    }; };
    var or = function (ps) { return function (input) {
        for (var _i = 0, ps_1 = ps; _i < ps_1.length; _i++) {
            var p = ps_1[_i];
            var r = p(input);
            if (r[0])
                return r;
        }
        return [false];
    }; };
    var cat = function (ps) { return function (input) {
        var rs = [];
        var i = input;
        for (var _i = 0, ps_2 = ps; _i < ps_2.length; _i++) {
            var p = ps_2[_i];
            var r = p(i);
            if (!r[0])
                return [false];
            rs.push(r[2]);
            i = [input[0], r[1]];
        }
        return [true, i[1], rs];
    }; };
    var rep = function (p, min, max) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = Number.POSITIVE_INFINITY; }
        return function (input) {
            if (!(0 <= min && min <= max))
                throw new Error('rep: must be 0 <= min <= max');
            var rs = [];
            var i = input;
            for (var n = 0; n < max; n++) {
                var r = p(i);
                if (!r[0])
                    break;
                rs.push(r[2]);
                i = [input[0], r[1]];
            }
            if (rs.length < min)
                return [false];
            return [true, i[1], rs];
        };
    };
    var map = function (p, f) { return function (input) {
        var r = p(input);
        if (!r[0])
            return [false];
        return [true, r[1], f(r[2])];
    }; };
    var isSome = function (v) {
        return v._tag === 'some';
    };
    var isNone = function (v) {
        return v._tag === 'none';
    };
    var opt = function (p) { return function (input) {
        var r = rep(p, 0, 1)(input);
        if (!r[0])
            return [false];
        return [true, r[1], r[2].length === 0 ? { _tag: 'none' } : { _tag: 'some', value: r[2][0] }];
    }; };
    var wsp = is(function (c) { return /^[ \r\n\t]$/.test(c); });
    var digit = is(function (c) { return /^\d$/.test(c); });
    var hexDigit = is(function (c) { return /^[0-9A-Fa-f]$/.test(c); });
    var unwrap = function (v) {
        if (typeof v === 'string') {
            return v;
        }
        if (isSome(v)) {
            return v.value;
        }
        return '';
    };
    var flatten = function (p) {
        return map(p, function (v) { return A.map(v, unwrap).join(''); });
    };
    var wspPlus = reg(/^[ \r\n\t]+/); // flatten(rep(wsp, 1));
    var wspStar = reg(/^[ \r\n\t]*/); // flatten(rep(wsp));
    var digitSequence = reg(/^[0-9]+/);
    var sign = or([ch('+'), ch('-')]);
    var exponent = reg(/^[eE][+-]?[0-9]+/); //flatten(cat([or([ch('e'), ch('E')]), opt(sign), digitSequence]));
    var fractionalConstant = flatten(or([cat([opt(digitSequence), ch('.'), digitSequence]), cat([digitSequence, ch('.')])]));
    var floatingPointConstant = flatten(or([cat([fractionalConstant, opt(exponent)]), cat([digitSequence, exponent])]));
    var integerConstant = digitSequence;
    var comma = ch(',');
    var commaWsp = flatten(or([cat([wspPlus, opt(comma), wspStar]), cat([comma, wspStar])]));
    var flag = or([ch('0'), ch('1')]);
    var floatingPoint = flatten(cat([opt(sign), floatingPointConstant]));
    var integer = flatten(cat([opt(sign), integerConstant]));
    var number = reg(/^[+-]?\d*\.?\d+(?:[eE][+-]?\d+)?/); //or([floatingPoint, integer]);
    var negativeNumber = flatten(or([cat([ch('-'), floatingPointConstant]), cat([ch('-'), integerConstant])]));
    var nonNegativeNumber = or([floatingPointConstant, integerConstant]);
    var skewY = map(cat([str('skewY'), wspStar, ch('('), wspStar, number, wspStar, ch(')')]), function (arr) {
        return {
            type: 'skewY',
            angle: parseFloat(arr[4]),
        };
    });
    var skewX = map(cat([str('skewX'), wspStar, ch('('), wspStar, number, wspStar, ch(')')]), function (arr) {
        return {
            type: 'skewX',
            angle: parseFloat(arr[4]),
        };
    });
    var rotate = map(cat([str('rotate'), wspStar, ch('('), wspStar, number, opt(cat([commaWsp, number, commaWsp, number])), wspStar, ch(')')]), function (arr) {
        var center = arr[5];
        if (isSome(center)) {
            return {
                type: 'rotate',
                angle: parseFloat(arr[4]),
                cx: parseFloat(center.value[1]),
                cy: parseFloat(center.value[3]),
            };
        }
        return {
            type: 'rotate',
            angle: parseFloat(arr[4]),
        };
    });
    var scale = map(cat([str('scale'), wspStar, ch('('), wspStar, number, opt(cat([commaWsp, number])), wspStar, ch(')')]), function (arr) {
        var sy = arr[5];
        if (isSome(sy)) {
            return {
                type: 'scale',
                sx: parseFloat(arr[4]),
                sy: parseFloat(sy.value[1]),
            };
        }
        return {
            type: 'scale',
            sx: parseFloat(arr[4]),
        };
    });
    var translate = map(cat([str('translate'), wspStar, ch('('), wspStar, number, opt(cat([commaWsp, number])), wspStar, ch(')')]), function (arr) {
        var sy = arr[5];
        if (isSome(sy)) {
            return {
                type: 'translate',
                tx: parseFloat(arr[4]),
                ty: parseFloat(sy.value[1]),
            };
        }
        return {
            type: 'translate',
            tx: parseFloat(arr[4]),
        };
    });
    var matrix = map(cat([str('matrix'), wspStar, ch('('), wspStar, number, commaWsp, number, commaWsp, number, commaWsp, number, commaWsp, number, commaWsp, number, wspStar, ch(')')]), function (arr) {
        return {
            type: 'matrix',
            mat: A.map([arr[4], arr[6], arr[8], arr[10], arr[12], arr[14]], parseFloat),
        };
    });
    var transform = or([matrix, translate, scale, rotate, skewX, skewY]);
    function transforms(input) {
        return or([
            map(cat([transform, rep(commaWsp, 1), transforms]), function (_a) {
                var t = _a[0], ts = _a[2];
                return __spreadArray([t], ts, true);
            }),
            map(transform, function (v) { return [v]; }),
        ])(input);
    }
    var transformList = map(cat([wspStar, opt(transforms), wspStar]), function (_a) {
        var ts = _a[1];
        if (isSome(ts)) {
            return ts.value;
        }
        return [];
    });
    var coordinateOfPath = number;
    var coordinatePair = map(cat([coordinateOfPath, opt(commaWsp), coordinateOfPath]), function (_a) {
        var x = _a[0], y = _a[2];
        return [x, y];
    });
    var makeSequence = function (parser, sep) { return function (_a) {
        var text = _a[0], pos = _a[1];
        var value = [];
        var firstResult = parser([text, pos]);
        if (!firstResult[0]) {
            return [false];
        }
        pos = firstResult[1];
        value.push(firstResult[2]);
        var sepParser = map(cat([opt(sep), parser]), function (arr) { return arr[1]; });
        while (true) {
            var result = sepParser([text, pos]);
            if (!result[0]) {
                break;
            }
            pos = result[1];
            value.push(result[2]);
        }
        return [true, pos, value];
    }; };
    // common
    var coordinateSequence = makeSequence(map(coordinateOfPath, function (v) { return parseFloat(v); }), commaWsp);
    var vector2dSequence = makeSequence(map(coordinatePair, function (arr) { return A.map(arr, parseFloat); }), commaWsp);
    var vector4d = map(cat([coordinatePair, opt(commaWsp), coordinatePair]), function (arr) {
        return A.map(__spreadArray(__spreadArray([], arr[0], true), arr[2], true), parseFloat);
    });
    var vector4dSequence = makeSequence(vector4d, commaWsp);
    // main
    var ellipticalArcArgument = map(cat([nonNegativeNumber, opt(commaWsp), nonNegativeNumber, opt(commaWsp), number, commaWsp, flag, opt(commaWsp), flag, opt(commaWsp), coordinatePair]), function (arr) {
        return A.map([arr[0], arr[2], arr[4], arr[6], arr[8], arr[10][0], arr[10][1]], parseFloat);
    });
    var ellipticalArcArgumentSequence = makeSequence(ellipticalArcArgument, commaWsp);
    var ellipticalArc = map(cat([or([ch('A'), ch('a')]), wspStar, ellipticalArcArgumentSequence]), function (arr) {
        return {
            command: arr[0],
            params: arr[2],
        };
    });
    var smoothQuadraticBezierCurveto = map(cat([or([ch('T'), ch('t')]), wspStar, vector2dSequence]), function (arr) {
        return {
            command: arr[0],
            params: arr[2],
        };
    });
    var quadraticBezierCurveTo = map(cat([or([ch('Q'), ch('q')]), wspStar, vector4dSequence]), function (arr) {
        return {
            command: arr[0],
            params: arr[2],
        };
    });
    var smoothCurveTo = map(cat([or([ch('S'), ch('s')]), wspStar, vector4dSequence]), function (arr) {
        return {
            command: arr[0],
            params: arr[2],
        };
    });
    var curvetoArgument = map(cat([coordinatePair, opt(commaWsp), coordinatePair, opt(commaWsp), coordinatePair]), function (arr) {
        return A.map(__spreadArray(__spreadArray(__spreadArray([], arr[0], true), arr[2], true), arr[4], true), parseFloat);
    });
    var curvetoArgumentSequence = makeSequence(curvetoArgument, commaWsp);
    var curveTo = map(cat([or([ch('C'), ch('c')]), wspStar, curvetoArgumentSequence]), function (arr) {
        return {
            command: arr[0],
            params: arr[2],
        };
    });
    var verticalLineto = map(cat([or([ch('V'), ch('v')]), wspStar, coordinateSequence]), function (arr) {
        return {
            command: arr[0],
            params: arr[2],
        };
    });
    var horizontalLineto = map(cat([or([ch('H'), ch('h')]), wspStar, coordinateSequence]), function (arr) {
        return {
            command: arr[0],
            params: arr[2],
        };
    });
    var lineTo = map(cat([or([ch('L'), ch('l')]), wspStar, vector2dSequence]), function (arr) {
        return {
            command: arr[0],
            params: arr[2],
        };
    });
    var closePath = map(or([ch('Z'), ch('z')]), function (c) {
        return {
            command: c,
        };
    });
    var moveTo = map(cat([or([ch('M'), ch('m')]), wspStar, vector2dSequence]), function (arr) {
        return {
            command: arr[0],
            params: arr[2],
        };
    });
    var drawToCommand = or([closePath, lineTo, horizontalLineto, verticalLineto, curveTo, smoothCurveTo, quadraticBezierCurveTo, smoothQuadraticBezierCurveto, ellipticalArc]);
    var svgPath = function (_a) {
        var text = _a[0], pos = _a[1];
        var commandsGroup = [];
        while (true) {
            var newPos = text.substr(pos).search(/[Mm]/);
            if (newPos === -1) {
                break;
            }
            var commands = [];
            pos += newPos;
            var result = moveTo([text, pos]);
            if (!result[0]) {
                break;
            }
            pos = result[1];
            commands.push(result[2]);
            while (true) {
                var newPos_1 = text.substr(pos).search(/[MmZzLlHhVvCcSsQqTtAa]/);
                if (newPos_1 === -1) {
                    break;
                }
                pos += newPos_1;
                var c = text[pos];
                if (c === 'M' || c === 'm') {
                    break;
                }
                else {
                    var result_1 = drawToCommand([text, pos]);
                    if (!result_1[0]) {
                        break;
                    }
                    pos = result_1[1];
                    commands.push(result_1[2]);
                }
            }
            commandsGroup.push(commands);
        }
        return [true, pos, commandsGroup];
    };
    /**
     * Color
     */
    var COLOR_NAMES = {
        aliceblue: [240 / 255, 248 / 255, 255 / 255],
        antiquewhite: [250 / 255, 235 / 255, 215 / 255],
        aqua: [0 / 255, 255 / 255, 255 / 255],
        aquamarine: [127 / 255, 255 / 255, 212 / 255],
        azure: [240 / 255, 255 / 255, 255 / 255],
        beige: [245 / 255, 245 / 255, 220 / 255],
        bisque: [255 / 255, 228 / 255, 196 / 255],
        black: [0 / 255, 0 / 255, 0 / 255],
        blanchedalmond: [255 / 255, 235 / 255, 205 / 255],
        blueviolet: [138 / 255, 43 / 255, 226 / 255],
        blue: [0 / 255, 0 / 255, 255 / 255],
        brown: [165 / 255, 42 / 255, 42 / 255],
        burlywood: [222 / 255, 184 / 255, 135 / 255],
        cadetblue: [95 / 255, 158 / 255, 160 / 255],
        chartreuse: [127 / 255, 255 / 255, 0 / 255],
        chocolate: [210 / 255, 105 / 255, 30 / 255],
        coral: [255 / 255, 127 / 255, 80 / 255],
        cornflowerblue: [100 / 255, 149 / 255, 237 / 255],
        cornsilk: [255 / 255, 248 / 255, 220 / 255],
        crimson: [220 / 255, 20 / 255, 60 / 255],
        cyan: [0 / 255, 255 / 255, 255 / 255],
        darkblue: [0 / 255, 0 / 255, 139 / 255],
        darkcyan: [0 / 255, 139 / 255, 139 / 255],
        darkgoldenrod: [184 / 255, 134 / 255, 11 / 255],
        darkgray: [169 / 255, 169 / 255, 169 / 255],
        darkgreen: [0 / 255, 100 / 255, 0 / 255],
        darkgrey: [169 / 255, 169 / 255, 169 / 255],
        darkkhaki: [189 / 255, 183 / 255, 107 / 255],
        darkmagenta: [139 / 255, 0 / 255, 139 / 255],
        darkolivegreen: [85 / 255, 107 / 255, 47 / 255],
        darkorange: [255 / 255, 140 / 255, 0 / 255],
        darkorchid: [153 / 255, 50 / 255, 204 / 255],
        darkred: [139 / 255, 0 / 255, 0 / 255],
        darksalmon: [233 / 255, 150 / 255, 122 / 255],
        darkseagreen: [143 / 255, 188 / 255, 143 / 255],
        darkslateblue: [72 / 255, 61 / 255, 139 / 255],
        darkslategray: [47 / 255, 79 / 255, 79 / 255],
        darkslategrey: [47 / 255, 79 / 255, 79 / 255],
        darkturquoise: [0 / 255, 206 / 255, 209 / 255],
        darkviolet: [148 / 255, 0 / 255, 211 / 255],
        deeppink: [255 / 255, 20 / 255, 147 / 255],
        deepskyblue: [0 / 255, 191 / 255, 255 / 255],
        dimgray: [105 / 255, 105 / 255, 105 / 255],
        dimgrey: [105 / 255, 105 / 255, 105 / 255],
        dodgerblue: [30 / 255, 144 / 255, 255 / 255],
        firebrick: [178 / 255, 34 / 255, 34 / 255],
        floralwhite: [255 / 255, 250 / 255, 240 / 255],
        forestgreen: [34 / 255, 139 / 255, 34 / 255],
        fuchsia: [255 / 255, 0 / 255, 255 / 255],
        gainsboro: [220 / 255, 220 / 255, 220 / 255],
        ghostwhite: [248 / 255, 248 / 255, 255 / 255],
        gold: [255 / 255, 215 / 255, 0 / 255],
        goldenrod: [218 / 255, 165 / 255, 32 / 255],
        gray: [128 / 255, 128 / 255, 128 / 255],
        grey: [128 / 255, 128 / 255, 128 / 255],
        greenyellow: [173 / 255, 255 / 255, 47 / 255],
        green: [0 / 255, 128 / 255, 0 / 255],
        honeydew: [240 / 255, 255 / 255, 240 / 255],
        hotpink: [255 / 255, 105 / 255, 180 / 255],
        indianred: [205 / 255, 92 / 255, 92 / 255],
        indigo: [75 / 255, 0 / 255, 130 / 255],
        ivory: [255 / 255, 255 / 255, 240 / 255],
        khaki: [240 / 255, 230 / 255, 140 / 255],
        lavenderblush: [255 / 255, 240 / 255, 245 / 255],
        lavender: [230 / 255, 230 / 255, 250 / 255],
        lawngreen: [124 / 255, 252 / 255, 0 / 255],
        lemonchiffon: [255 / 255, 250 / 255, 205 / 255],
        lightblue: [173 / 255, 216 / 255, 230 / 255],
        lightcoral: [240 / 255, 128 / 255, 128 / 255],
        lightcyan: [224 / 255, 255 / 255, 255 / 255],
        lightgoldenrodyellow: [250 / 255, 250 / 255, 210 / 255],
        lightgray: [211 / 255, 211 / 255, 211 / 255],
        lightgreen: [144 / 255, 238 / 255, 144 / 255],
        lightgrey: [211 / 255, 211 / 255, 211 / 255],
        lightpink: [255 / 255, 182 / 255, 193 / 255],
        lightsalmon: [255 / 255, 160 / 255, 122 / 255],
        lightseagreen: [32 / 255, 178 / 255, 170 / 255],
        lightskyblue: [135 / 255, 206 / 255, 250 / 255],
        lightslategray: [119 / 255, 136 / 255, 153 / 255],
        lightslategrey: [119 / 255, 136 / 255, 153 / 255],
        lightsteelblue: [176 / 255, 196 / 255, 222 / 255],
        lightyellow: [255 / 255, 255 / 255, 224 / 255],
        limegreen: [50 / 255, 205 / 255, 50 / 255],
        lime: [0 / 255, 255 / 255, 0 / 255],
        linen: [250 / 255, 240 / 255, 230 / 255],
        magenta: [255 / 255, 0 / 255, 255 / 255],
        maroon: [128 / 255, 0 / 255, 0 / 255],
        mediumaquamarine: [102 / 255, 205 / 255, 170 / 255],
        mediumblue: [0 / 255, 0 / 255, 205 / 255],
        mediumorchid: [186 / 255, 85 / 255, 211 / 255],
        mediumpurple: [147 / 255, 112 / 255, 219 / 255],
        mediumseagreen: [60 / 255, 179 / 255, 113 / 255],
        mediumslateblue: [123 / 255, 104 / 255, 238 / 255],
        mediumspringgreen: [0 / 255, 250 / 255, 154 / 255],
        mediumturquoise: [72 / 255, 209 / 255, 204 / 255],
        mediumvioletred: [199 / 255, 21 / 255, 133 / 255],
        midnightblue: [25 / 255, 25 / 255, 112 / 255],
        mintcream: [245 / 255, 255 / 255, 250 / 255],
        mistyrose: [255 / 255, 228 / 255, 225 / 255],
        moccasin: [255 / 255, 228 / 255, 181 / 255],
        navajowhite: [255 / 255, 222 / 255, 173 / 255],
        navy: [0 / 255, 0 / 255, 128 / 255],
        oldlace: [253 / 255, 245 / 255, 230 / 255],
        olivedrab: [107 / 255, 142 / 255, 35 / 255],
        olive: [128 / 255, 128 / 255, 0 / 255],
        orangered: [255 / 255, 69 / 255, 0 / 255],
        orange: [255 / 255, 165 / 255, 0 / 255],
        orchid: [218 / 255, 112 / 255, 214 / 255],
        palegoldenrod: [238 / 255, 232 / 255, 170 / 255],
        palegreen: [152 / 255, 251 / 255, 152 / 255],
        paleturquoise: [175 / 255, 238 / 255, 238 / 255],
        palevioletred: [219 / 255, 112 / 255, 147 / 255],
        papayawhip: [255 / 255, 239 / 255, 213 / 255],
        peachpuff: [255 / 255, 218 / 255, 185 / 255],
        peru: [205 / 255, 133 / 255, 63 / 255],
        pink: [255 / 255, 192 / 255, 203 / 255],
        plum: [221 / 255, 160 / 255, 221 / 255],
        powderblue: [176 / 255, 224 / 255, 230 / 255],
        purple: [128 / 255, 0 / 255, 128 / 255],
        red: [255 / 255, 0 / 255, 0 / 255],
        rosybrown: [188 / 255, 143 / 255, 143 / 255],
        royalblue: [65 / 255, 105 / 255, 225 / 255],
        saddlebrown: [139 / 255, 69 / 255, 19 / 255],
        salmon: [250 / 255, 128 / 255, 114 / 255],
        sandybrown: [244 / 255, 164 / 255, 96 / 255],
        seagreen: [46 / 255, 139 / 255, 87 / 255],
        seashell: [255 / 255, 245 / 255, 238 / 255],
        sienna: [160 / 255, 82 / 255, 45 / 255],
        silver: [192 / 255, 192 / 255, 192 / 255],
        skyblue: [135 / 255, 206 / 255, 235 / 255],
        slateblue: [106 / 255, 90 / 255, 205 / 255],
        slategray: [112 / 255, 128 / 255, 144 / 255],
        slategrey: [112 / 255, 128 / 255, 144 / 255],
        snow: [255 / 255, 250 / 255, 250 / 255],
        springgreen: [0 / 255, 255 / 255, 127 / 255],
        steelblue: [70 / 255, 130 / 255, 180 / 255],
        tan: [210 / 255, 180 / 255, 140 / 255],
        teal: [0 / 255, 128 / 255, 128 / 255],
        thistle: [216 / 255, 191 / 255, 216 / 255],
        tomato: [255 / 255, 99 / 255, 71 / 255],
        turquoise: [64 / 255, 224 / 255, 208 / 255],
        violet: [238 / 255, 130 / 255, 238 / 255],
        wheat: [245 / 255, 222 / 255, 179 / 255],
        whitesmoke: [245 / 255, 245 / 255, 245 / 255],
        white: [255 / 255, 255 / 255, 255 / 255],
        yellowgreen: [154 / 255, 205 / 255, 50 / 255],
        yellow: [255 / 255, 255 / 255, 0 / 255],
    };
    // https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
    var hueToRgb = function (p, q, t) {
        if (t < 0)
            t += 1;
        if (t > 1)
            t -= 1;
        if (t < 1 / 6)
            return p + (q - p) * 6 * t;
        if (t < 1 / 2)
            return q;
        if (t < 2 / 3)
            return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    // h: [0, 360], s, l: [0, 100]
    var hslToRgb = function (_a) {
        var h = _a[0], s = _a[1], l = _a[2];
        h = M.mod(h, 360) / 360;
        s = M.clamp(s / 100, 0, 1);
        l = M.clamp(l / 100, 0, 1);
        var r = l;
        var g = l;
        var b = l;
        if (s !== 0) {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hueToRgb(p, q, h + 1 / 3);
            g = hueToRgb(p, q, h);
            b = hueToRgb(p, q, h - 1 / 3);
        }
        return [r, g, b];
    };
    /**
     * Type
     */
    // degree
    var angle = map(cat([number, opt(or([str('deg'), str('grad'), str('rad')]))]), function (arr) {
        if (isSome(arr[1])) {
            var deg = parseFloat(arr[0]);
            switch (arr[1].value) {
                case 'deg':
                    // pass
                    break;
                case 'grad':
                    deg *= 0.9;
                    break;
                case 'rad':
                    deg *= 180 / Math.PI;
                    break;
            }
            return deg;
        }
        return parseFloat(arr[0]);
    });
    var colorKeyword = are(function (str) {
        var s = str.toLowerCase();
        for (var key in COLOR_NAMES) {
            if (s.substr(0, key.length) === key) {
                return key.length;
            }
        }
        return 0;
    });
    var color = or([
        // #FFFFFF
        map(cat([ch('#'), hexDigit, hexDigit, hexDigit, hexDigit, hexDigit, hexDigit]), function (arr) {
            return [parseInt("".concat(arr[1]).concat(arr[2]), 16) / 255, parseInt("".concat(arr[3]).concat(arr[4]), 16) / 255, parseInt("".concat(arr[5]).concat(arr[6]), 16) / 255];
        }),
        // #FFF
        map(cat([ch('#'), hexDigit, hexDigit, hexDigit]), function (arr) {
            return [parseInt("".concat(arr[1]).concat(arr[1]), 16) / 255, parseInt("".concat(arr[2]).concat(arr[2]), 16) / 255, parseInt("".concat(arr[3]).concat(arr[3]), 16) / 255];
        }),
        // rgb(100%, 100%, 100%)
        map(cat([str('rgb('), wspStar, integer, ch('%'), commaWsp, integer, ch('%'), commaWsp, integer, ch('%'), wspStar, ch(')')]), function (arr) {
            return [parseInt(arr[2], 10) / 100, parseInt(arr[5], 10) / 100, parseInt(arr[8], 10) / 100];
        }),
        // rgb(255, 255, 255)
        map(cat([str('rgb('), wspStar, integer, commaWsp, integer, commaWsp, integer, wspStar, ch(')')]), function (arr) {
            return [parseInt(arr[2], 10) / 255, parseInt(arr[4], 10) / 255, parseInt(arr[6], 10) / 255];
        }),
        // rgba(100%, 100%, 100%, 1)
        map(cat([str('rgba('), wspStar, integer, ch('%'), commaWsp, integer, ch('%'), commaWsp, integer, ch('%'), commaWsp, number, wspStar, ch(')')]), function (arr) {
            return [parseInt(arr[2], 10) / 100, parseInt(arr[5], 10) / 100, parseInt(arr[8], 10) / 100, M.clamp(parseFloat(arr[11]), 0, 1)];
        }),
        // rgba(255, 255, 255, 1)
        map(cat([str('rgba('), wspStar, integer, commaWsp, integer, commaWsp, integer, commaWsp, number, wspStar, ch(')')]), function (arr) {
            return [parseInt(arr[2], 10) / 255, parseInt(arr[4], 10) / 100, parseInt(arr[6], 10) / 100, M.clamp(parseFloat(arr[8]), 0, 1)];
        }),
        // hsl(360, 100%, 100%)
        map(cat([str('hsl('), wspStar, integer, commaWsp, integer, ch('%'), commaWsp, integer, ch('%'), wspStar, ch(')')]), function (arr) {
            var h = parseInt(arr[2], 10);
            var s = parseInt(arr[4], 10);
            var l = parseInt(arr[7], 10);
            return hslToRgb([h, s, l]);
        }),
        // hsla(360, 100%, 100%, 1)
        map(cat([str('hsla('), wspStar, integer, commaWsp, integer, ch('%'), commaWsp, integer, ch('%'), commaWsp, number, wspStar, ch(')')]), function (arr) {
            var h = parseInt(arr[2], 10);
            var s = parseInt(arr[4], 10);
            var l = parseInt(arr[7], 10);
            return __spreadArray(__spreadArray([], hslToRgb([h, s, l]), true), [M.clamp(parseFloat(arr[10]), 0, 1)], false);
        }),
        map(colorKeyword, function (name) {
            return COLOR_NAMES[name.toLowerCase()];
        }),
    ]);
    var paint = or([
        color,
        str('none'),
        str('transparent'),
        reg(/^url\(.*\)/),
    ]);
    var length = map(cat([number, opt(or([str('em'), str('ex'), str('px'), str('in'), str('cm'), str('mm'), str('pt'), str('pc')]))]), function (arr) {
        if (isSome(arr[1])) {
            var len = parseFloat(arr[0]);
            switch (arr[1].value) {
                case 'em':
                    len *= 16; // font-size: 16px
                    break;
                case 'ex':
                    len *= 8;
                    break;
                case 'px':
                    // pass
                    break;
                case 'in':
                    len *= 90;
                    break;
                case 'cm':
                    len *= 35.43307;
                    break;
                case 'mm':
                    len *= 3.543307;
                    break;
                case 'pt':
                    len *= 1.25;
                    break;
                case 'pc':
                    len *= 15;
                    break;
            }
            return len;
        }
        return parseFloat(arr[0]);
    });
    var percentage = map(cat([number, ch('%')]), function (arr) {
        return [parseFloat(arr[0]), arr[1]];
    });
    var lengthOrPercentage = or([percentage, length]);
    var numberOrPercentage = or([map(percentage, function (percent) { return percent[0] / 100; }), map(number, function (n) { return parseFloat(n); })]);
    /**
     * Style
     */
    var coordinatePairOfPoints = or([
        map(cat([number, commaWsp, number]), function (arr) { return [parseFloat(arr[0]), parseFloat(arr[2])]; }),
        map(cat([number, negativeNumber]), function (arr) { return [parseFloat(arr[0]), parseFloat(arr[1])]; }),
    ]);
    function coordinatePairsOfPoints(input) {
        return or([
            map(cat([coordinatePairOfPoints, opt(commaWsp), coordinatePairsOfPoints]), function (_a) {
                var p = _a[0], ps = _a[2];
                return __spreadArray([p], ps, true);
            }),
            map(coordinatePairOfPoints, function (v) { return [v]; }),
        ])(input);
    }
    var listOfPoints = map(cat([wspStar, coordinatePairsOfPoints, wspStar]), function (arr) { return arr[1]; });
    var opacity = or([
        map(number, function (v) { return M.clamp(parseFloat(v), 0, 1); }),
        str('inherit'),
    ]);
    var fillRule = or([
        str('inherit'),
        str('evenodd'),
        str('inherit'),
    ]);
    var fillRuleToValue = function (rule) {
        switch (rule) {
            default:
                return 1;
            case 'evenodd':
                return 2;
        }
    };
    var strokeWidth = or([
        length,
        str('inherit'),
    ]);
    var strokeLineCap = or([
        str('butt'),
        str('round'),
        str('square'),
        str('inherit'),
    ]);
    var strokeLineCapToValue = function (cap) {
        switch (cap) {
            default:
                return 1;
            case 'round':
                return 2;
            case 'square':
                return 3;
        }
    };
    var strokeLineJoin = or([
        str('miter'),
        str('round'),
        str('bevel'),
        str('inherit'),
    ]);
    var strokeLineJoinToValue = function (join) {
        switch (join) {
            default:
                return 1;
            case 'round':
                return 2;
            case 'bevel':
                return 3;
        }
    };
    var strokeMiterLimit = or([
        map(number, function (v) { return parseFloat(v); }),
        str('inherit'),
    ]);
    var dashArray = makeSequence(length, commaWsp);
    var strokeDashArray = or([
        dashArray,
        str('none'),
        str('inherit'),
    ]);
    var strokeDashOffset = or([
        length,
        str('inherit'),
    ]);
    var gradientTagToGradient = function (tag, bb) {
        var _a, _b, _c, _d;
        var m = null;
        if (isArray(tag.gradientTransform)) {
            m = Mat3x3.identity();
            for (var _i = 0, _e = tag.gradientTransform; _i < _e.length; _i++) {
                var transform_1 = _e[_i];
                m = m.mult(transformToMat3x3(transform_1));
            }
        }
        if (tag._tag === 'linearGradient') {
            var x1 = typeof tag.x1 === 'number' ? tag.x1 : 0;
            var y1 = typeof tag.y1 === 'number' ? tag.y1 : 0;
            var x2 = typeof tag.x2 === 'number' ? tag.x2 : bb[2];
            var y2 = typeof tag.y2 === 'number' ? tag.y2 : 0;
            if (m) {
                _a = m.mult([x1, y1]), x1 = _a[0], y1 = _a[1];
                _b = m.mult([x2, y2]), x2 = _b[0], y2 = _b[1];
            }
            var stops = [];
            if (isArray(tag._children)) {
                for (var _f = 0, _g = tag._children; _f < _g.length; _f++) {
                    var child = _g[_f];
                    if (child._tag === 'stop') {
                        var offset = typeof child.offset === 'number' ? child.offset : 0;
                        var stopColor = isArray(child["stop-color"]) ? child['stop-color'] : [0, 0, 0, 1];
                        var stopOpacity = isArray(child["stop-opacity"]) ? child['stop-opacity'] : 1;
                        if (stopColor.length === 4) {
                            stopColor[3] *= stopOpacity;
                        }
                        else {
                            stopColor[3] = stopOpacity;
                        }
                        stops.push({ offset: offset, color: stopColor });
                    }
                }
            }
            return { type: 'linear', x1: x1, y1: y1, x2: x2, y2: y2, stops: stops };
        }
        else if (tag._tag === 'radialGradient') {
            var cx = typeof tag.cx === 'number' ? tag.cx : 0.5 * bb[2];
            var cy = typeof tag.cy === 'number' ? tag.cy : 0.5 * bb[3];
            var r = typeof tag.r === 'number' ? tag.r : Math.sqrt(bb[2] * bb[2] + bb[3] * bb[3]) / Math.SQRT2;
            var fx = typeof tag.fx === 'number' ? tag.fx : cx;
            var fy = typeof tag.fy === 'number' ? tag.fy : cy;
            if (m) {
                _c = m.mult([cx, cy]), cx = _c[0], cy = _c[1];
                _d = m.mult([fx, fy]), fx = _d[0], fy = _d[1];
            }
            var stops = [];
            if (isArray(tag._children)) {
                for (var _h = 0, _j = tag._children; _h < _j.length; _h++) {
                    var child = _j[_h];
                    if (child._tag === 'stop') {
                        var offset = typeof child.offset === 'number' ? child.offset : 0;
                        var stopColor = isArray(child["stop-color"]) ? child['stop-color'] : [0, 0, 0, 1];
                        var stopOpacity = isArray(child["stop-opacity"]) ? child['stop-opacity'] : 1;
                        if (stopColor.length === 4) {
                            stopColor[3] *= stopOpacity;
                        }
                        else {
                            stopColor[3] = stopOpacity;
                        }
                        stops.push({ offset: offset, color: stopColor });
                    }
                }
            }
            return { type: 'radial', cx: cx, cy: cy, r: r, fx: fx, fy: fy, stops: stops };
        }
    };
    var styleMap = function (text) {
        text = removeCComment(text);
        var s = {};
        var ms = text.match(/\s*([^:;]+)\s*:\s*((?:[^;"]|"(?:\\.|[^"])*")*)\s*;?/gm);
        if (!ms) {
            return s;
        }
        for (var _i = 0, ms_1 = ms; _i < ms_1.length; _i++) {
            var m = ms_1[_i];
            var idx = m.indexOf(':');
            if (idx === -1) {
                continue;
            }
            s[trim(m.substring(0, idx))] = trim(m.substring(idx + 1).replace(/;\s*$/, ''));
        }
        return s;
    };
    var STYLE_ATTRIBUTES = ['fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-opacity', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset', 'display', 'visibility'];
    var convertStyle = function (obj, attribute) {
        switch (attribute) {
            case 'fill':
            case 'stroke':
            case 'stop-color':
                obj[attribute] = paint([trim(obj[attribute]), 0])[2];
                break;
            case 'opacity':
            case 'fill-opacity':
            case 'stroke-opacity':
                obj[attribute] = opacity([trim(obj[attribute]), 0])[2];
                break;
            case 'fill-rule':
                obj[attribute] = fillRule([trim(obj[attribute]), 0])[2];
                break;
            case 'stroke-width':
                obj[attribute] = strokeWidth([trim(obj[attribute]), 0])[2];
                break;
            case 'stroke-linecap':
                obj[attribute] = strokeLineCap([trim(obj[attribute]), 0])[2];
                break;
            case 'stroke-linejoin':
                obj[attribute] = strokeLineJoin([trim(obj[attribute]), 0])[2];
                break;
            case 'stroke-miterlimit':
                obj[attribute] = strokeMiterLimit([trim(obj[attribute]), 0])[2];
                break;
            case 'stroke-dasharray':
                obj[attribute] = strokeDashArray([trim(obj[attribute]), 0])[2];
                break;
            case 'stroke-dashoffset':
                obj[attribute] = strokeDashOffset([trim(obj[attribute]), 0])[2];
                break;
            default:
                return false;
        }
        return true;
    };
    var parseStyle = function (text) {
        var style = styleMap(text);
        for (var attribute in style) {
            if (!convertStyle(style, attribute)) {
                style[attribute] = typeof style[attribute] === 'string' ? trim(style[attribute]) : style[attribute];
            }
        }
        return style;
    };
    var style = function (element) {
        var style = {};
        // attribute
        for (var _i = 0, STYLE_ATTRIBUTES_1 = STYLE_ATTRIBUTES; _i < STYLE_ATTRIBUTES_1.length; _i++) {
            var attribute = STYLE_ATTRIBUTES_1[_i];
            if (element[attribute] !== void 0) {
                style[attribute] = element[attribute];
            }
        }
        // style
        if (element.style) {
            for (var attribute in element.style) {
                if (element.style[attribute] !== void 0) {
                    style[attribute] = element.style[attribute];
                }
            }
        }
        // check empty
        for (var _ in style) {
            return style;
        }
        return null;
    };
    var mergeStyle = function () {
        var styles = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            styles[_i] = arguments[_i];
        }
        var base = {};
        for (var _a = 0, styles_1 = styles; _a < styles_1.length; _a++) {
            var style_1 = styles_1[_a];
            if (!style_1) {
                continue;
            }
            for (var key in style_1) {
                if (style_1.hasOwnProperty(key)) {
                    base[key] = style_1[key];
                }
            }
        }
        return base;
    };
    /**
     * SVG
     */
    var SVGContext = /** @class */ (function () {
        function SVGContext() {
            this._styleSheet = {};
            this._gradientTags = {};
        }
        SVGContext.prototype.pushStyleTag = function (styleTag) {
            if (styleTag.styleSheet) {
                var src = styleTag.styleSheet;
                var dst = this._styleSheet;
                for (var selector in src) {
                    if (!src.hasOwnProperty(selector)) {
                        continue;
                    }
                    if (dst.hasOwnProperty(selector)) {
                        dst[selector] = mergeStyle(dst[selector], src[selector]);
                    }
                    else {
                        dst[selector] = src[selector];
                    }
                }
            }
        };
        SVGContext.prototype.inquireStyle = function (element) {
            var style = {};
            if (element.class) {
                var klasses = trim(element.class).split(/\s+/);
                for (var _i = 0, klasses_1 = klasses; _i < klasses_1.length; _i++) {
                    var klass = klasses_1[_i];
                    var key = ".".concat(klass);
                    if (this._styleSheet.hasOwnProperty(key)) {
                        style = mergeStyle(style, this._styleSheet[key]);
                    }
                }
            }
            if (element.id) {
                var id = trim(element.id);
                if (id) {
                    var key = "#".concat(id);
                    if (this._styleSheet.hasOwnProperty(key)) {
                        style = mergeStyle(style, this._styleSheet[key]);
                    }
                }
            }
            return style;
        };
        SVGContext.prototype.pushGradientTag = function (gradientTag, bb) {
            if (gradientTag.id) {
                this._gradientTags[gradientTag.id] = gradientTag;
                gradientTag._gradient = gradientTagToGradient(gradientTag, bb);
            }
        };
        SVGContext.prototype.inquireGradient = function (id) {
            if (this._gradientTags.hasOwnProperty(id) && this._gradientTags[id]._gradient) {
                return this._gradientTags[id]._gradient;
            }
            return null;
        };
        return SVGContext;
    }());
    var doReverse = function (element) {
        switch (element._tag) {
            case 'linearGradient':
            case 'radialGradient':
                return false;
        }
        return true;
    };
    var getElementName = function (element) {
        var name = element._tag;
        if (element.id) {
            name += '#' + element.id;
        }
        if (element.class) {
            name += '.' + element.class;
        }
        return name;
    };
    var viewBox = map(cat([wspStar, number, commaWsp, number, commaWsp, number, commaWsp, number, wspStar]), function (arr) {
        return [parseFloat(arr[1]), parseFloat(arr[3]), parseFloat(arr[5]), parseFloat(arr[7])];
    });
    function textToXML(text) {
        // remove xmlns (ref: https://community.adobe.com/t5/indesign-discussions/namespace-in-xml/m-p/3586814)
        text = text.replace(/xmlns?=\"(.*?)\"/g, '');
        return new XML(text);
    }
    function fileToXML(file) {
        var newFile = new File(file.absoluteURI);
        newFile.encoding = 'utf-8';
        if (!newFile.open('r')) {
            return;
        }
        var text = newFile.read();
        newFile.close();
        return textToXML(text);
    }
    var extractAttributes = function (element, xml) {
        var attributes = xml.attributes();
        for (var i = 0, l = attributes.length(); i < l; i++) {
            var attribute = attributes[i];
            var name = attribute.localName();
            var value = attribute.toString();
            element[name] = value;
        }
        var text = xml.text().toString();
        if (text) {
            element['_text'] = text;
        }
    };
    var parseSelector = function (text) {
        var texts = text.split(',');
        var selectors = [];
        for (var _i = 0, texts_1 = texts; _i < texts_1.length; _i++) {
            var text_1 = texts_1[_i];
            var selector = trim(text_1).replace(/\s+/g, '');
            if (selector) {
                selectors.push(selector);
            }
        }
        return selectors;
    };
    var percentToNumber = function (attribute, percent, bb) {
        switch (attribute) {
            case 'x':
            case 'x1':
            case 'x2':
            case 'cx':
            case 'rx':
            case 'fx':
            case 'width':
                return bb[2] * percent[0] / 100;
            case 'y':
            case 'y1':
            case 'y2':
            case 'cy':
            case 'ry':
            case 'fy':
            case 'height':
                return bb[3] * percent[0] / 100;
            case 'r':
                return Math.sqrt(bb[2] * bb[2] + bb[3] * bb[3]) / Math.SQRT2 * percent[0] / 100;
        }
        return percent[0];
    };
    var convertAttribute = function (element, bb) {
        for (var attribute in element) {
            switch (attribute) {
                case 'viewBox':
                    element[attribute] = viewBox([element[attribute], 0])[2];
                    break;
                case 'd':
                    element[attribute] = svgPath([element[attribute], 0])[2];
                    break;
                case 'x':
                case 'y':
                case 'x1':
                case 'y1':
                case 'x2':
                case 'y2':
                case 'cx':
                case 'cy':
                case 'r':
                case 'rx':
                case 'ry':
                case 'fx':
                case 'fy':
                case 'width':
                case 'height':
                    if (bb) {
                        var len = lengthOrPercentage([trim(element[attribute]), 0])[2];
                        if (isArray(len)) {
                            element[attribute] = percentToNumber(attribute, len, bb);
                        }
                        else {
                            element[attribute] = len;
                        }
                    }
                    else {
                        element[attribute] = length([trim(element[attribute]), 0])[2];
                    }
                    break;
                case 'points':
                    element[attribute] = listOfPoints([element[attribute], 0])[2];
                    break;
                case 'transform':
                case 'gradientTransform':
                    element[attribute] = transformList([element[attribute], 0])[2];
                    break;
                case 'style':
                    element[attribute] = parseStyle(element[attribute]);
                    break;
                case 'offset':
                case 'stop-opacity':
                    element[attribute] = numberOrPercentage([element[attribute], 0])[2];
                    break;
                // style
                default:
                    if (!convertStyle(element, attribute)) {
                        element[attribute] = typeof element[attribute] === 'string' ? trim(element[attribute]) : element[attribute];
                    }
                    break;
            }
        }
        // style
        var _style = style(element);
        if (_style) {
            element._style = _style;
        }
        // tag specific
        if (element._tag === 'style') {
            if (element._text) {
                var styleSheet = {};
                var text = removeCComment(element._text);
                while (true) {
                    var start = text.indexOf('{');
                    if (start === -1) {
                        break;
                    }
                    var end = text.indexOf('}', start + 1);
                    if (end === -1) {
                        break;
                    }
                    var selectorText = text.substring(0, start);
                    var styleText = text.substring(start + 1, end);
                    var selectors = parseSelector(selectorText);
                    var style_2 = parseStyle(styleText);
                    for (var _i = 0, selectors_1 = selectors; _i < selectors_1.length; _i++) {
                        var selector = selectors_1[_i];
                        if (styleSheet.hasOwnProperty(selector)) {
                            styleSheet[selector] = mergeStyle(styleSheet[selector], style_2);
                        }
                        else {
                            styleSheet[selector] = style_2;
                        }
                    }
                    text = text.substr(end + 1);
                }
                element.styleSheet = styleSheet;
            }
        }
    };
    var traverseContainer = function (svg, parent, xml) {
        if (!parent._children) {
            parent._children = [];
        }
        var children = xml.children();
        for (var i = 0; i < children.length(); i++) {
            var childXML = children[i];
            var child = { _tag: childXML.localName() };
            extractAttributes(child, childXML);
            convertAttribute(child, svg.viewBox);
            parent._children.push(child);
            if (childXML.children().length() > 0) {
                traverseContainer(svg, child, childXML);
            }
            if (child._tag === 'style') {
                svg._ctx.pushStyleTag(child);
            }
            else if (child._tag === 'linearGradient' || child._tag === 'radialGradient') {
                svg._ctx.pushGradientTag(child, svg.viewBox);
            }
        }
        if (doReverse(parent)) {
            parent._children.reverse(); // drawing order is reversed
        }
    };
    var traverseSVG = function (xml) {
        if (xml.localName() !== 'svg')
            return null;
        var svg = { _tag: 'svg', _ctx: new SVGContext };
        extractAttributes(svg, xml);
        convertAttribute(svg);
        if (!svg.viewBox) {
            var width = typeof svg.width === 'number' ? svg.width : 300;
            var height = typeof svg.height === 'number' ? svg.height : 150;
            svg.viewBox = [0, 0, width, height];
        }
        if (xml.children().length) {
            traverseContainer(svg, svg, xml);
        }
        return svg;
    };
    /**
     * Shape Layer
     */
    var ValidPropertyGroup = /** @class */ (function () {
        function ValidPropertyGroup(layer, propertyGroup) {
            this.layer = layer;
            this.propertyGroup = propertyGroup;
            this.indices = [];
            var indices = this.indices;
            if (isLayer(propertyGroup)) {
                return;
            }
            var prop = this.propertyGroup;
            while (!isLayer(prop)) {
                indices.unshift(prop.propertyIndex);
                prop = prop.parentProperty;
            }
        }
        ValidPropertyGroup.prototype.P = function () {
            if (isValid(this.propertyGroup)) {
                return this.propertyGroup;
            }
            var prop = this.layer;
            for (var _i = 0, _a = this.indices; _i < _a.length; _i++) {
                var index = _a[_i];
                prop = prop(index);
            }
            return this.propertyGroup = prop;
        };
        ValidPropertyGroup.prototype.L = function () {
            return this.layer;
        };
        ValidPropertyGroup.prototype.C = function () {
            return this.layer.containingComp;
        };
        return ValidPropertyGroup;
    }());
    var ShapeGroup = /** @class */ (function () {
        function ShapeGroup(layer, propertyGroup) {
            this.propertyGroup = new ValidPropertyGroup(layer, propertyGroup);
        }
        ShapeGroup.prototype.property = function () {
            return this.propertyGroup.P();
        };
        ShapeGroup.prototype.layer = function () {
            return this.propertyGroup.L();
        };
        ShapeGroup.prototype.transform = function () {
            return new TransformGroup(this.property());
        };
        ShapeGroup.prototype.content = function () {
            if (this.property().matchName === 'ADBE Vector Group') {
                return this.property()('ADBE Vectors Group');
            }
            return this.property()('ADBE Root Vectors Group');
        };
        ShapeGroup.prototype.addGroup = function (name) {
            var group = this.content().addProperty('ADBE Vector Group');
            if (name) {
                group.name = name;
            }
            return new ShapeGroup(this.layer(), group);
        };
        ShapeGroup.prototype.addPath = function () {
            var group = this.content().addProperty('ADBE Vector Shape - Group');
            return new PathGroup(this.layer(), group);
        };
        ShapeGroup.prototype.addEllipse = function () {
            var group = this.content().addProperty('ADBE Vector Shape - Ellipse');
            return new EllipseGroup(this.layer(), group);
        };
        ShapeGroup.prototype.addFill = function () {
            var group = this.content().addProperty('ADBE Vector Graphic - Fill');
            return new FillGroup(this.layer(), group);
        };
        ShapeGroup.prototype.addStroke = function () {
            var group = this.content().addProperty('ADBE Vector Graphic - Stroke');
            return new StrokeGroup(this.layer(), group);
        };
        ShapeGroup.prototype.addGradientFill = function (id) {
            var group = this.content().addProperty('ADBE Vector Graphic - G-Fill');
            if (id) {
                group.name = "#".concat(id);
            }
            return new GradientFillGroup(this.layer(), group);
        };
        ShapeGroup.prototype.addGradientStroke = function (id) {
            var group = this.content().addProperty('ADBE Vector Graphic - G-Stroke');
            if (id) {
                group.name = "#".concat(id);
            }
            return new GradientStrokeGroup(this.layer(), group);
        };
        return ShapeGroup;
    }());
    var TransformGroup = /** @class */ (function () {
        function TransformGroup(group) {
            this.group = group;
        }
        TransformGroup.prototype.transform = function () {
            return this.group['ADBE Vector Transform Group'];
        };
        TransformGroup.prototype.anchorPoint = function () {
            return this.transform()('ADBE Vector Anchor');
        };
        TransformGroup.prototype.position = function () {
            return this.transform()('ADBE Vector Position');
        };
        TransformGroup.prototype.scale = function () {
            return this.transform()('ADBE Vector Scale');
        };
        TransformGroup.prototype.skew = function () {
            return this.transform()('ADBE Vector Skew');
        };
        TransformGroup.prototype.skewAxis = function () {
            return this.transform()('ADBE Vector Skew Axis');
        };
        TransformGroup.prototype.rotation = function () {
            return this.transform()('ADBE Vector Rotation');
        };
        TransformGroup.prototype.opacity = function () {
            return this.transform()('ADBE Vector Group Opacity');
        };
        return TransformGroup;
    }());
    var PathGroup = /** @class */ (function () {
        function PathGroup(layer, propertyGroup) {
            this.propertyGroup = new ValidPropertyGroup(layer, propertyGroup);
        }
        PathGroup.prototype.property = function () {
            return this.propertyGroup.P();
        };
        PathGroup.prototype.path = function (shape) {
            this.property()('ADBE Vector Shape').setValue(shape);
            return this;
        };
        return PathGroup;
    }());
    var EllipseGroup = /** @class */ (function () {
        function EllipseGroup(layer, propertyGroup) {
            this.propertyGroup = new ValidPropertyGroup(layer, propertyGroup);
        }
        EllipseGroup.prototype.property = function () {
            return this.propertyGroup.P();
        };
        EllipseGroup.prototype.size = function (sz) {
            this.property()('ADBE Vector Ellipse Size').setValue(sz);
            return this;
        };
        EllipseGroup.prototype.position = function (pos) {
            this.property()('ADBE Vector Ellipse Position').setValue(pos);
            return this;
        };
        return EllipseGroup;
    }());
    var FillGroup = /** @class */ (function () {
        function FillGroup(layer, propertyGroup) {
            this.propertyGroup = new ValidPropertyGroup(layer, propertyGroup);
        }
        FillGroup.prototype.property = function () {
            return this.propertyGroup.P();
        };
        FillGroup.prototype.fillRule = function (rule) {
            this.property()('ADBE Vector Fill Rule').setValue(rule);
            return this;
        };
        FillGroup.prototype.color = function (col) {
            this.property()('ADBE Vector Fill Color').setValue(col);
            return this;
        };
        FillGroup.prototype.opacity = function (op) {
            this.property()('ADBE Vector Fill Opacity').setValue(op);
            return this;
        };
        return FillGroup;
    }());
    var DASH_MATCH_NAMES = ['ADBE Vector Stroke Dash 1', 'ADBE Vector Stroke Gap 1', 'ADBE Vector Stroke Dash 2', 'ADBE Vector Stroke Gap 2', 'ADBE Vector Stroke Dash 3', 'ADBE Vector Stroke Gap 3'];
    var StrokeGroup = /** @class */ (function () {
        function StrokeGroup(Layer, propertyGroup) {
            this.propertyGroup = new ValidPropertyGroup(Layer, propertyGroup);
        }
        StrokeGroup.prototype.property = function () {
            return this.propertyGroup.P();
        };
        StrokeGroup.prototype.color = function (col) {
            this.property()('ADBE Vector Stroke Color').setValue(col);
            return this;
        };
        StrokeGroup.prototype.opacity = function (op) {
            this.property()('ADBE Vector Stroke Opacity').setValue(op);
            return this;
        };
        StrokeGroup.prototype.strokeWidth = function (sw) {
            this.property()('ADBE Vector Stroke Width').setValue(sw);
            return this;
        };
        StrokeGroup.prototype.lineCap = function (cp) {
            this.property()('ADBE Vector Stroke Line Cap').setValue(cp);
            return this;
        };
        StrokeGroup.prototype.lineJoin = function (join) {
            this.property()('ADBE Vector Stroke Line Join').setValue(join);
            return this;
        };
        StrokeGroup.prototype.miterLimit = function (limit) {
            this.property()('ADBE Vector Stroke Miter Limit').setValue(Math.max(limit, 1));
            return this;
        };
        StrokeGroup.prototype.dashes = function (dashes) {
            var ds = (this.property())('ADBE Vector Stroke Dashes');
            for (var i = 0, len = Math.min(DASH_MATCH_NAMES.length, dashes.length); i < len; i++) {
                var dash = ds.addProperty(DASH_MATCH_NAMES[i]);
                dash.setValue(dashes[i]);
            }
            return this;
        };
        StrokeGroup.prototype.dashOffset = function (offset) {
            var ds = (this.property())('ADBE Vector Stroke Dashes');
            var dashOFfset = ds.addProperty('ADBE Vector Stroke Offset');
            dashOFfset.setValue(offset);
            return this;
        };
        return StrokeGroup;
    }());
    var GradientFillGroup = /** @class */ (function () {
        function GradientFillGroup(layer, propertyGroup) {
            this.propertyGroup = new ValidPropertyGroup(layer, propertyGroup);
        }
        GradientFillGroup.prototype.property = function () {
            return this.propertyGroup.P();
        };
        GradientFillGroup.prototype.fillRule = function (rule) {
            this.property()('ADBE Vector Fill Rule').setValue(rule);
            return this;
        };
        GradientFillGroup.prototype.type = function (type) {
            this.property()('ADBE Vector Grad Type').setValue(type);
            return this;
        };
        GradientFillGroup.prototype.startPoint = function (p) {
            this.property()('ADBE Vector Grad Start Pt').setValue(p);
            return this;
        };
        GradientFillGroup.prototype.endPoint = function (p) {
            this.property()('ADBE Vector Grad End Pt').setValue(p);
            return this;
        };
        GradientFillGroup.prototype.highlightLength = function (v) {
            this.property()('ADBE Vector Grad HiLite Length').setValue(v);
            return this;
        };
        GradientFillGroup.prototype.highlightAngle = function (v) {
            this.property()('ADBE Vector Grad HiLite Angle').setValue(v);
            return this;
        };
        GradientFillGroup.prototype.colors = function (v) {
            var property = this.property()('ADBE Vector Grad Colors');
            Atarabi.property.setGradientValue(property, v);
            return this;
        };
        GradientFillGroup.prototype.opacity = function (op) {
            this.property()('ADBE Vector Fill Opacity').setValue(op);
            return this;
        };
        return GradientFillGroup;
    }());
    var GradientStrokeGroup = /** @class */ (function () {
        function GradientStrokeGroup(Layer, propertyGroup) {
            this.propertyGroup = new ValidPropertyGroup(Layer, propertyGroup);
        }
        GradientStrokeGroup.prototype.property = function () {
            return this.propertyGroup.P();
        };
        GradientStrokeGroup.prototype.type = function (type) {
            this.property()('ADBE Vector Grad Type').setValue(type);
            return this;
        };
        GradientStrokeGroup.prototype.startPoint = function (p) {
            this.property()('ADBE Vector Grad Start Pt').setValue(p);
            return this;
        };
        GradientStrokeGroup.prototype.endPoint = function (p) {
            this.property()('ADBE Vector Grad End Pt').setValue(p);
            return this;
        };
        GradientStrokeGroup.prototype.highlightLength = function (v) {
            this.property()('ADBE Vector Grad HiLite Length').setValue(v);
            return this;
        };
        GradientStrokeGroup.prototype.highlightAngle = function (v) {
            this.property()('ADBE Vector Grad HiLite Angle').setValue(v);
            return this;
        };
        GradientStrokeGroup.prototype.colors = function (v) {
            var property = this.property()('ADBE Vector Grad Colors');
            Atarabi.property.setGradientValue(property, v);
            return this;
        };
        GradientStrokeGroup.prototype.opacity = function (op) {
            this.property()('ADBE Vector Stroke Opacity').setValue(op);
            return this;
        };
        GradientStrokeGroup.prototype.strokeWidth = function (sw) {
            this.property()('ADBE Vector Stroke Width').setValue(sw);
            return this;
        };
        GradientStrokeGroup.prototype.lineCap = function (cp) {
            this.property()('ADBE Vector Stroke Line Cap').setValue(cp);
            return this;
        };
        GradientStrokeGroup.prototype.lineJoin = function (join) {
            this.property()('ADBE Vector Stroke Line Join').setValue(join);
            return this;
        };
        GradientStrokeGroup.prototype.miterLimit = function (limit) {
            this.property()('ADBE Vector Stroke Miter Limit').setValue(Math.max(limit, 1));
            return this;
        };
        GradientStrokeGroup.prototype.dashes = function (dashes) {
            var ds = (this.property())('ADBE Vector Stroke Dashes');
            for (var i = 0, len = Math.min(DASH_MATCH_NAMES.length, dashes.length); i < len; i++) {
                var dash = ds.addProperty(DASH_MATCH_NAMES[i]);
                dash.setValue(dashes[i]);
            }
            return this;
        };
        GradientStrokeGroup.prototype.dashOffset = function (offset) {
            var ds = (this.property())('ADBE Vector Stroke Dashes');
            var dashOFfset = ds.addProperty('ADBE Vector Stroke Offset');
            dashOFfset.setValue(offset);
            return this;
        };
        return GradientStrokeGroup;
    }());
    /**
     * Bake
    */
    var svgAngle = function (ux, uy, vx, vy) {
        var dot = ux * vx + uy * vy;
        var len = Math.sqrt(ux * ux + uy * uy) * Math.sqrt(vx * vx + vy * vy);
        var ang = Math.acos(M.clamp(dot / len, -1, 1));
        if ((ux * vy - uy * vx) < 0)
            ang = -ang;
        return ang;
    };
    var ellipticalArcToBezier = function (rx, ry, phi, fa, fs, x1, y1, x2, y2) {
        fa = +!!fa;
        fs = +!!fs;
        var rX = Math.abs(rx);
        var rY = Math.abs(ry);
        // (F.6.5.1)
        var dx2 = (x1 - x2) / 2;
        var dy2 = (y1 - y2) / 2;
        var x1p = Math.cos(phi) * dx2 + Math.sin(phi) * dy2;
        var y1p = -Math.sin(phi) * dx2 + Math.cos(phi) * dy2;
        // (F.6.5.2)
        var rxs = rX * rX;
        var rys = rY * rY;
        var x1ps = x1p * x1p;
        var y1ps = y1p * y1p;
        var cr = x1ps / rxs + y1ps / rys;
        if (cr > 1) {
            var s = Math.sqrt(cr);
            rX = s * rX;
            rY = s * rY;
            rxs = rX * rX;
            rys = rY * rY;
        }
        var dq = (rxs * y1ps + rys * x1ps);
        var pq = (rxs * rys - dq) / dq;
        var q = Math.sqrt(Math.max(0, pq));
        if (fa === fs) {
            q = -q;
        }
        var cxp = q * rX * y1p / rY;
        var cyp = -q * rY * x1p / rX;
        // (F.6.5.3)
        var cx = Math.cos(phi) * cxp - Math.sin(phi) * cyp + (x1 + x2) / 2;
        var cy = Math.sin(phi) * cxp + Math.cos(phi) * cyp + (y1 + y2) / 2;
        // (F.6.5.5)
        var theta = svgAngle(1, 0, (x1p - cxp) / rX, (y1p - cyp) / rY);
        // (F.6.5.6)
        var delta = svgAngle((x1p - cxp) / rX, (y1p - cyp) / rY, (-x1p - cxp) / rX, (-y1p - cyp) / rY);
        delta = M.mod(delta, 2 * Math.PI);
        if (!fs) {
            delta -= 2 * Math.PI;
        }
        var E = function (n) {
            var x = cx + rx * Math.cos(phi) * Math.cos(n) - ry * Math.sin(phi) * Math.sin(n);
            var y = cy + rx * Math.sin(phi) * Math.cos(n) + ry * Math.cos(phi) * Math.sin(n);
            return [x, y];
        };
        var Ed = function (n) {
            var x = -rx * Math.cos(phi) * Math.sin(n) - ry * Math.sin(phi) * Math.cos(n);
            var y = -rx * Math.sin(phi) * Math.sin(n) + ry * Math.cos(phi) * Math.cos(n);
            return [x, y];
        };
        var n = [];
        n.push(theta);
        var interval = Math.PI / 4;
        if (delta < 0) {
            for (var d = -interval; d > delta; d -= interval) {
                n.push(theta + d);
            }
        }
        else {
            for (var d = interval; d < delta; d += interval) {
                n.push(theta + d);
            }
        }
        n.push(theta + delta);
        var getCP = function (n1, n2) {
            var en1 = E(n1);
            var en2 = E(n2);
            var edn1 = Ed(n1);
            var edn2 = Ed(n2);
            var alpha = Math.sin(n2 - n1) * (Math.sqrt(4 + 3 * Math.pow(Math.tan((n2 - n1) / 2), 2)) - 1) / 3;
            return {
                c1: [en1[0] + alpha * edn1[0], en1[1] + alpha * edn1[1]],
                c2: [en2[0] - alpha * edn2[0], en2[1] - alpha * edn2[1]],
                en1: en1,
                en2: en2,
            };
        };
        var cps = [];
        for (var i = 0; i < n.length - 1; i++) {
            cps.push(getCP(n[i], n[i + 1]));
        }
        return cps;
    };
    var pathCommandsToShape = function (commands, origin) {
        if (origin === void 0) { origin = [0, 0]; }
        var shape = new Shape;
        shape.closed = false;
        var vertices = [];
        var inTangents = [];
        var outTangents = [];
        for (var _i = 0, commands_1 = commands; _i < commands_1.length; _i++) {
            var command = commands_1[_i];
            switch (command.command) {
                // MoveTo
                case 'M':
                    for (var _a = 0, _b = command.params; _a < _b.length; _a++) {
                        var p = _b[_a];
                        vertices.push(__spreadArray([], p, true));
                        inTangents.push([0, 0]);
                        outTangents.push([0, 0]);
                    }
                    break;
                case 'm':
                    for (var _c = 0, _d = command.params; _c < _d.length; _c++) {
                        var p = _d[_c];
                        if (vertices.length) {
                            vertices.push(V2.add(p, A.last(vertices)));
                        }
                        else {
                            vertices.push(V2.add(p, origin));
                        }
                        inTangents.push([0, 0]);
                        outTangents.push([0, 0]);
                    }
                    break;
                // LineTo
                case 'L':
                    for (var _e = 0, _f = command.params; _e < _f.length; _e++) {
                        var p = _f[_e];
                        vertices.push(__spreadArray([], p, true));
                        inTangents.push([0, 0]);
                        outTangents.push([0, 0]);
                    }
                    break;
                case 'l':
                    for (var _g = 0, _h = command.params; _g < _h.length; _g++) {
                        var p = _h[_g];
                        vertices.push(V2.add(p, A.last(vertices)));
                        inTangents.push([0, 0]);
                        outTangents.push([0, 0]);
                    }
                    break;
                case 'H':
                    for (var _j = 0, _k = command.params; _j < _k.length; _j++) {
                        var p = _k[_j];
                        vertices.push([p, A.last(vertices)[1]]);
                        inTangents.push([0, 0]);
                        outTangents.push([0, 0]);
                    }
                    break;
                case 'h':
                    for (var _l = 0, _o = command.params; _l < _o.length; _l++) {
                        var p = _o[_l];
                        vertices.push(V2.add(A.last(vertices), [p, 0]));
                        inTangents.push([0, 0]);
                        outTangents.push([0, 0]);
                    }
                    break;
                case 'V':
                    for (var _p = 0, _q = command.params; _p < _q.length; _p++) {
                        var p = _q[_p];
                        vertices.push([A.last(vertices)[0], p]);
                        inTangents.push([0, 0]);
                        outTangents.push([0, 0]);
                    }
                    break;
                case 'v':
                    for (var _r = 0, _s = command.params; _r < _s.length; _r++) {
                        var p = _s[_r];
                        vertices.push(V2.add(A.last(vertices), [0, p]));
                        inTangents.push([0, 0]);
                        outTangents.push([0, 0]);
                    }
                    break;
                // 2D Bezier (ref: https://nowokay.hatenablog.com/entry/20070623/1182556929)
                case 'Q':
                    for (var _t = 0, _u = command.params; _t < _u.length; _t++) {
                        var ps = _u[_t];
                        var prevP = A.last(vertices);
                        var c = [ps[0], ps[1]];
                        var pn = [ps[2], ps[3]];
                        var c1 = V2.mult(V2.sub(c, prevP), 2 / 3);
                        var c2 = V2.mult(V2.sub(c, pn), 2 / 3);
                        vertices.push(pn);
                        inTangents.push(c2);
                        outTangents[outTangents.length - 1] = c1;
                        outTangents.push([0, 0]);
                    }
                    break;
                case 'q':
                    for (var _v = 0, _w = command.params; _v < _w.length; _v++) {
                        var ps = _w[_v];
                        var prevP = A.last(vertices);
                        var c = V2.add(prevP, [ps[0], ps[1]]);
                        var pn = V2.add(prevP, [ps[2], ps[3]]);
                        var c1 = V2.mult(V2.sub(c, prevP), 2 / 3);
                        var c2 = V2.mult(V2.sub(c, pn), 2 / 3);
                        vertices.push(pn);
                        inTangents.push(c2);
                        outTangents[outTangents.length - 1] = c1;
                        outTangents.push([0, 0]);
                    }
                    break;
                case 'T':
                    for (var _x = 0, _y = command.params; _x < _y.length; _x++) {
                        var p = _y[_x];
                        var prevP = A.last(vertices);
                        var pn = __spreadArray([], p, true);
                        var c = V2.add(V2.mult(A.last(inTangents), -3 / 2), prevP);
                        var c1 = V2.mult(V2.sub(c, prevP), 2 / 3);
                        var c2 = V2.mult(V2.sub(c, pn), 2 / 3);
                        vertices.push(pn);
                        inTangents.push(c2);
                        outTangents[outTangents.length - 1] = c1;
                        outTangents.push([0, 0]);
                    }
                    break;
                case 't':
                    for (var _z = 0, _0 = command.params; _z < _0.length; _z++) {
                        var p = _0[_z];
                        var prevP = A.last(vertices);
                        var pn = V2.add(p, prevP);
                        var c = V2.add(V2.mult(A.last(inTangents), -3 / 2), prevP);
                        var c1 = V2.mult(V2.sub(c, prevP), 2 / 3);
                        var c2 = V2.mult(V2.sub(c, pn), 2 / 3);
                        vertices.push(pn);
                        inTangents.push(c2);
                        outTangents[outTangents.length - 1] = c1;
                        outTangents.push([0, 0]);
                    }
                    break;
                // 3D Bezier
                case 'C':
                    for (var _1 = 0, _2 = command.params; _1 < _2.length; _1++) {
                        var p = _2[_1];
                        var prevP = A.last(vertices);
                        var c1 = V2.sub([p[0], p[1]], prevP);
                        var pn = [p[4], p[5]];
                        var c2 = V2.sub([p[2], p[3]], pn);
                        vertices.push(pn);
                        inTangents.push(c2);
                        outTangents[outTangents.length - 1] = c1;
                        outTangents.push([0, 0]);
                    }
                    break;
                case 'c':
                    for (var _3 = 0, _4 = command.params; _3 < _4.length; _3++) {
                        var p = _4[_3];
                        var prevP = A.last(vertices);
                        var c1 = [p[0], p[1]];
                        var pn = V2.add(prevP, [p[4], p[5]]);
                        var c2 = V2.sub(V2.add(prevP, [p[2], p[3]]), pn);
                        vertices.push(pn);
                        inTangents.push(c2);
                        outTangents[outTangents.length - 1] = c1;
                        outTangents.push([0, 0]);
                    }
                    break;
                case 'S':
                    for (var _5 = 0, _6 = command.params; _5 < _6.length; _5++) {
                        var p = _6[_5];
                        var prevP = A.last(vertices);
                        var c1 = V2.mult(A.last(inTangents), -1);
                        var pn = [p[2], p[3]];
                        var c2 = V2.sub([p[0], p[1]], pn);
                        vertices.push(pn);
                        inTangents.push(c2);
                        outTangents[outTangents.length - 1] = c1;
                        outTangents.push([0, 0]);
                    }
                    break;
                case 's':
                    for (var _7 = 0, _8 = command.params; _7 < _8.length; _7++) {
                        var p = _8[_7];
                        var prevP = A.last(vertices);
                        var c1 = V2.mult(A.last(inTangents), -1);
                        var pn = V2.add(prevP, [p[2], p[3]]);
                        var c2 = V2.sub(V2.add(prevP, [p[0], p[1]]), pn);
                        vertices.push(pn);
                        inTangents.push(c2);
                        outTangents[outTangents.length - 1] = c1;
                        outTangents.push([0, 0]);
                    }
                    break;
                // Elliptical Arc (ref: https://mortoray.com/rendering-an-svg-elliptical-arc-as-bezier-curves/, https://stackoverflow.com/questions/43946153/approximating-svg-elliptical-arc-in-canvas-with-javascript)
                case 'A':
                    for (var _9 = 0, _10 = command.params; _9 < _10.length; _9++) {
                        var _11 = _10[_9], rx = _11[0], ry = _11[1], phi = _11[2], fa = _11[3], fs = _11[4], x2 = _11[5], y2 = _11[6];
                        var _12 = A.last(vertices), x1 = _12[0], y1 = _12[1];
                        var cps = ellipticalArcToBezier(rx, ry, M.degreeToRadian(phi), fa, fs, x1, y1, x2, y2);
                        for (var i = 0; i < cps.length; i++) {
                            var cp = cps[i];
                            var prevP = cp.en1;
                            var pn = cp.en2;
                            var c1 = V2.sub(cp.c1, prevP);
                            var c2 = V2.sub(cp.c2, pn);
                            vertices.push(pn);
                            inTangents.push(c2);
                            outTangents[outTangents.length - 1] = c1;
                            outTangents.push([0, 0]);
                        }
                    }
                    break;
                case 'a':
                    for (var _13 = 0, _14 = command.params; _13 < _14.length; _13++) {
                        var _15 = _14[_13], rx = _15[0], ry = _15[1], phi = _15[2], fa = _15[3], fs = _15[4], dx = _15[5], dy = _15[6];
                        var _16 = A.last(vertices), x1 = _16[0], y1 = _16[1];
                        var _17 = [x1 + dx, y1 + dy], x2 = _17[0], y2 = _17[1];
                        var cps = ellipticalArcToBezier(rx, ry, M.degreeToRadian(phi), fa, fs, x1, y1, x2, y2);
                        for (var i = 0; i < cps.length; i++) {
                            var cp = cps[i];
                            var prevP = cp.en1;
                            var pn = cp.en2;
                            var c1 = V2.sub(cp.c1, prevP);
                            var c2 = V2.sub(cp.c2, pn);
                            vertices.push(pn);
                            inTangents.push(c2);
                            outTangents[outTangents.length - 1] = c1;
                            outTangents.push([0, 0]);
                        }
                    }
                    break;
                case 'Z':
                case 'z':
                    shape.closed = true;
                    break;
            }
        }
        shape.vertices = vertices;
        shape.inTangents = inTangents;
        shape.outTangents = outTangents;
        return [shape, A.last(vertices)];
    };
    var rectToPathCommands = function (rect) {
        var commands = [];
        // https://www.w3.org/TR/SVG11/shapes.html#RectElement
        var x = rect.x === void 0 ? 0 : rect.x;
        var y = rect.y === void 0 ? 0 : rect.y;
        var width = rect.width;
        if (typeof width !== 'number' || width < 0) {
            return commands;
        }
        var height = rect.height;
        if (typeof height !== 'number' || height < 0) {
            return commands;
        }
        var rx = 0;
        var ry = 0;
        if (rect.rx === void 0 && rect.ry === void 0) {
            // pass
        }
        else if (rect.rx !== void 0) {
            rx = ry = rect.rx;
        }
        else if (rect.ry !== void 0) {
            rx = ry = rect.ry;
        }
        else {
            rx = rect.rx;
            ry = rect.ry;
        }
        if (rx < 0 || ry < 0) {
            return commands;
        }
        rx = Math.min(rx, 0.5 * width);
        ry = Math.min(ry, 0.5 * height);
        if (rx === 0 && ry === 0) {
            commands.push({ command: 'M', params: [[x, y]] }, { command: 'h', params: [width] }, { command: 'v', params: [height] }, { command: 'h', params: [-width] }, { command: 'Z' });
        }
        else {
            commands.push({ command: 'M', params: [[x + rx, y]] }, { command: 'H', params: [x + width - rx] }, { command: 'A', params: [[rx, ry, 0, 0, 1, x + width, y + ry]] }, { command: 'V', params: [y + height - ry] }, { command: 'A', params: [[rx, ry, 0, 0, 1, x + width - rx, y + height]] }, { command: 'H', params: [x + rx] }, { command: 'A', params: [[rx, ry, 0, 0, 1, x, y + height - ry]] }, { command: 'V', params: [y + ry] }, { command: 'A', params: [[rx, ry, 0, 0, 1, x + rx, y]] }, { command: 'Z' });
        }
        return commands;
    };
    var circleToPathCommands = function (circle) {
        var commands = [];
        var cx = typeof circle.cx === 'number' ? circle.cx : 0;
        var cy = typeof circle.cy === 'number' ? circle.cy : 0;
        var r = typeof circle.r === 'number' ? circle.r : 0;
        if (r > 0) {
            var handle_r = 4 * r * (Math.SQRT2 - 1) / 3;
            commands.push({ command: 'M', params: [[cx + r, cy]] });
            commands.push({ command: 'C', params: [[cx + r, cy + handle_r, cx + handle_r, cy + r, cx, cy + r]] });
            commands.push({ command: 'C', params: [[cx - handle_r, cy + r, cx - r, cy + handle_r, cx - r, cy]] });
            commands.push({ command: 'C', params: [[cx - r, cy - handle_r, cx - handle_r, cy - r, cx, cy - r]] });
            commands.push({ command: 'C', params: [[cx + handle_r, cy - r, cx + r, cy - handle_r, cx + r, cy]] });
            commands.push({ command: 'Z' });
        }
        return commands;
    };
    var ellipseToPathCommands = function (ellipse) {
        var commands = [];
        var cx = typeof ellipse.cx === 'number' ? ellipse.cx : 0;
        var cy = typeof ellipse.cy === 'number' ? ellipse.cy : 0;
        var rx = typeof ellipse.rx === 'number' ? ellipse.rx : 0;
        var ry = typeof ellipse.ry === 'number' ? ellipse.ry : 0;
        if (rx > 0 && ry > 0) {
            var handle_rx = 4 * rx * (Math.SQRT2 - 1) / 3;
            var handle_ry = 4 * ry * (Math.SQRT2 - 1) / 3;
            commands.push({ command: 'M', params: [[cx + rx, cy]] });
            commands.push({ command: 'C', params: [[cx + rx, cy + handle_ry, cx + handle_rx, cy + ry, cx, cy + ry]] });
            commands.push({ command: 'C', params: [[cx - handle_rx, cy + ry, cx - rx, cy + handle_ry, cx - rx, cy]] });
            commands.push({ command: 'C', params: [[cx - rx, cy - handle_ry, cx - handle_rx, cy - ry, cx, cy - ry]] });
            commands.push({ command: 'C', params: [[cx + handle_rx, cy - ry, cx + rx, cy - handle_ry, cx + rx, cy]] });
            commands.push({ command: 'Z' });
        }
        return commands;
    };
    var lineToPathCommands = function (line) {
        var commands = [];
        var x1 = typeof line.x1 === 'number' ? line.x1 : 0;
        var y1 = typeof line.y1 === 'number' ? line.y1 : 0;
        var x2 = typeof line.x2 === 'number' ? line.x2 : 0;
        var y2 = typeof line.y2 === 'number' ? line.y2 : 0;
        commands.push({ command: 'M', params: [[x1, y1], [x2, y2]] });
        return commands;
    };
    var pointsToPathCommands = function (points, closed) {
        var commands = [];
        if (!(isArray(points) && points.length)) {
            return commands;
        }
        commands.push({ command: 'M', params: points });
        if (closed) {
            commands.push({ command: 'Z' });
        }
        return commands;
    };
    var polylineToPathCommands = function (polyline) {
        return pointsToPathCommands(polyline.points, false);
    };
    var polygonToPathCommands = function (polygon) {
        return pointsToPathCommands(polygon.points, true);
    };
    var stopsToValue = function (stops) {
        var value = { alphaStops: [], colorStops: [] };
        for (var _i = 0, stops_1 = stops; _i < stops_1.length; _i++) {
            var _a = stops_1[_i], offset = _a.offset, color_1 = _a.color;
            value.alphaStops.push({ location: offset, opacity: color_1[3] });
            value.colorStops.push({ location: offset, color: color_1.slice(0, 3) });
        }
        return value;
    };
    var applyGradient = function (group, gradient) {
        if (gradient.type === 'linear') {
            group.type(1 /* GradientType.Linear */).startPoint([gradient.x1, gradient.y1]).endPoint([gradient.x2, gradient.y2]);
        }
        else {
            group.type(2 /* GradientType.Radial */).startPoint([gradient.cx, gradient.cy]).endPoint([gradient.cx + gradient.r, gradient.cy]);
            var dx = gradient.fx - gradient.cx;
            var dy = gradient.fy - gradient.cy;
            var rr = Math.sqrt(dx * dx + dy * dy);
            if (rr > 0) {
                var length_1 = Math.min(1, rr / Math.max(1e-6, gradient.r)) * 100;
                var degree = Math.atan2(dy, dx) * (180.0 / Math.PI);
                group.highlightLength(length_1);
                group.highlightAngle(degree);
            }
        }
        group.colors(stopsToValue(gradient.stops));
    };
    var applyStyle = function (group, style, ctx) {
        if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse') {
            group.property().enabled = false;
        }
        if (!(style.fill === 'none' || style.fill === 'transparent')) {
            var fill = null;
            if (typeof style.fill === 'string') {
                var m = trim(style.fill).match(/^url\(#(.+)\)$/);
                if (m) {
                    var id = m[1];
                    var gradient = ctx.inquireGradient(id);
                    if (gradient) {
                        if (gradient.stops.length < 2) {
                            fill = group.addFill();
                            var color_2 = gradient.stops.length ? gradient.stops[0].color.slice(0, 3) : [0, 0, 0];
                            var opacity_1 = gradient.stops.length && gradient.stops[0].color.length === 4 ? gradient.stops[0].color[3] : 1;
                            fill.color(color_2).opacity(100 * opacity_1);
                        }
                        else {
                            fill = group.addGradientFill(id);
                            applyGradient(fill, gradient);
                        }
                    }
                }
            }
            if (!fill) {
                fill = group.addFill();
                var color_3 = isArray(style.fill) ? style.fill.slice(0, 3) : [0, 0, 0];
                var opacity_2 = isArray(style.fill) && style.fill.length === 4 ? style.fill[3] : 1;
                if (typeof style['fill-opacity'] === 'number') {
                    opacity_2 *= style['fill-opacity'];
                }
                fill.color(color_3).opacity(100 * opacity_2);
            }
            if (typeof style['fill-rule'] === 'string') {
                fill.fillRule(fillRuleToValue(style['fill-rule']));
            }
        }
        if (!(style.stroke === void 0 || style.stroke === 'none' || style.stroke === 'transparent')) {
            var stroke = null;
            if (typeof style.stroke === 'string') {
                var m = trim(style.stroke).match(/^url\(#(.+)\)$/);
                if (m) {
                    var id = m[1];
                    var gradient = ctx.inquireGradient(id);
                    if (gradient) {
                        if (gradient.stops.length < 2) {
                            stroke = group.addStroke();
                            var color_4 = gradient.stops.length ? gradient.stops[0].color.slice(0, 3) : [0, 0, 0];
                            var opacity_3 = gradient.stops.length && gradient.stops[0].color.length === 4 ? gradient.stops[0].color[3] : 1;
                            stroke.color(color_4).opacity(100 * opacity_3);
                        }
                        else {
                            stroke = group.addGradientStroke(id);
                            applyGradient(stroke, gradient);
                        }
                    }
                }
            }
            if (!stroke) {
                stroke = group.addStroke();
                var color_5 = isArray(style.stroke) ? style.stroke.slice(0, 3) : [0, 0, 0];
                var opacity_4 = isArray(style.stroke) && style.stroke.length === 4 ? style.stroke[3] : 1;
                if (typeof style['stroke-opacity'] === 'number') {
                    opacity_4 *= style['stroke-opacity'];
                }
                stroke.color(color_5).opacity(100 * opacity_4);
            }
            var strokeWidth_1 = typeof style['stroke-width'] === 'number' ? style['stroke-width'] : 1;
            stroke.strokeWidth(strokeWidth_1);
            if (typeof style['stroke-linecap'] === 'string') {
                stroke.lineCap(strokeLineCapToValue(style['stroke-linecap']));
            }
            var miter = true;
            if (typeof style['stroke-linejoin'] === 'string') {
                var join = strokeLineJoinToValue(style['stroke-linejoin']);
                if (join !== 1 /* not miter */) {
                    miter = false;
                    stroke.lineJoin(join);
                }
            }
            if (miter && typeof style['stroke-miterlimit'] === 'number') {
                stroke.miterLimit(style['stroke-miterlimit']);
            }
            if (isArray(style['stroke-dasharray'])) {
                stroke.dashes(style['stroke-dasharray']);
            }
            if (typeof style['stroke-dashoffset'] === 'number') {
                stroke.dashOffset(style['stroke-dashoffset']);
            }
        }
    };
    var transformToMat3x3 = function (transform) {
        switch (transform.type) {
            case 'matrix':
                return Mat3x3.mat.apply(Mat3x3, transform.mat);
            case 'translate':
                return Mat3x3.translate(transform.tx, typeof transform.ty === 'number' ? transform.ty : 0);
            case 'scale':
                return Mat3x3.scale(transform.sx, typeof transform.sy === 'number' ? transform.sy : transform.sx);
            case 'rotate':
                if (typeof transform.cx === 'number') {
                    return Mat3x3.translate(transform.cx, transform.cy).mult(Mat3x3.rotate(transform.angle)).mult(Mat3x3.translate(-transform.cx, -transform.cy));
                }
                else {
                    return Mat3x3.rotate(transform.angle);
                }
            case 'skewX':
                return Mat3x3.skewX(transform.angle);
            case 'skewY':
                return Mat3x3.skewY(transform.angle);
        }
    };
    var applyTransformByMatrix = function (group, m) {
        var trans = m.decompose();
        group.transform().position().setValue(trans.translation);
        group.transform().scale().setValue([100 * trans.scale[0], 100 * trans.scale[1]]);
        if (trans.skew[0] !== 0) {
            group.transform().skew().setValue(M.radianToDegree(-trans.skew[0]));
        }
        else if (trans.skew[1] !== 0) {
            group.transform().skew().setValue(M.radianToDegree(trans.skew[1]));
            group.transform().skewAxis().setValue(90);
        }
        group.transform().rotation().setValue(M.radianToDegree(trans.rotation));
    };
    var applyTransform = function (group, transforms) {
        if (!isArray(transforms) || !transforms.length) {
            return;
        }
        // fast return
        if (transforms.length === 1) {
            var transform_2 = transforms[0];
            if (transform_2.type === 'translate') {
                var tx = transform_2.tx;
                var ty = typeof transform_2.ty === 'number' ? transform_2.ty : 0;
                group.transform().position().setValue([tx, ty]);
                return;
            }
            else if (transform_2.type === 'scale') {
                var sx = transform_2.sx;
                var sy = typeof transform_2.sy === 'number' ? transform_2.sy : sx;
                group.transform().scale().setValue([100 * sx, 100 * sy]);
                return;
            }
            else if (transform_2.type === 'rotate') {
                var angle_1 = transform_2.angle;
                if (transform_2.cx === void 0) {
                    group.transform().rotation().setValue(angle_1);
                }
                else {
                    var cx = transform_2.cx;
                    var cy = transform_2.cy;
                    group.transform().anchorPoint().setValue([cx, cy]);
                    group.transform().position().setValue([cx, cy]);
                    group.transform().rotation().setValue(angle_1);
                }
                return;
            }
            else if (transform_2.type === 'skewX') {
                var angle_2 = transform_2.angle;
                group.transform().skew().setValue(-angle_2);
                return;
            }
            else if (transform_2.type === 'skewY') {
                var angle_3 = transform_2.angle;
                group.transform().skew().setValue(angle_3);
                group.transform().skewAxis().setValue(90);
                return;
            }
        }
        // matrix
        var m = Mat3x3.identity();
        for (var _i = 0, transforms_1 = transforms; _i < transforms_1.length; _i++) {
            var transform_3 = transforms_1[_i];
            m = m.mult(transformToMat3x3(transform_3));
        }
        applyTransformByMatrix(group, m);
    };
    var bakeSVG = function (svg, shapeLayer) {
        var root = new ShapeGroup(shapeLayer, shapeLayer).addGroup(getElementName(svg));
        var viewBox = svg.viewBox;
        root.transform().anchorPoint().setValue([viewBox[0], viewBox[1]]);
        var queue = [{ element: svg, group: root }];
        while (queue.length) {
            var _a = queue.shift(), element = _a.element, group = _a.group;
            if (isArray(element._children)) {
                for (var _i = 0, _b = element._children; _i < _b.length; _i++) {
                    var child = _b[_i];
                    var style_3 = child._style = mergeStyle(svg._ctx.inquireStyle(element), element._style, svg._ctx.inquireStyle(child), child._style);
                    switch (child._tag) {
                        case 'title':
                            if (element._tag === 'svg' && child._text) {
                                shapeLayer.name = child._text;
                            }
                            break;
                        case 'desc':
                            if (element._tag === 'svg' && child._text) {
                                shapeLayer.comment = child._text;
                            }
                            break;
                        case 'g':
                            {
                                var childGroup = group.addGroup(getElementName(child));
                                queue.push({ element: child, group: childGroup });
                                applyTransform(childGroup, child.transform);
                            }
                            break;
                        case 'path':
                            {
                                var pathGroup = group.addGroup(getElementName(child));
                                if (child.d) {
                                    var origin = [0, 0];
                                    for (var _c = 0, _d = child.d; _c < _d.length; _c++) {
                                        var pathCommands = _d[_c];
                                        var path = pathGroup.addPath();
                                        var _e = pathCommandsToShape(pathCommands, origin), shape = _e[0], newOrigin = _e[1];
                                        path.path(shape);
                                        origin = newOrigin;
                                    }
                                }
                                applyStyle(pathGroup, style_3, svg._ctx);
                                applyTransform(pathGroup, child.transform);
                            }
                            break;
                        case 'rect':
                            {
                                var rectGroup = group.addGroup(getElementName(child));
                                var commands = rectToPathCommands(child);
                                if (commands.length) {
                                    var shape = pathCommandsToShape(commands)[0];
                                    var path = rectGroup.addPath();
                                    path.path(shape);
                                }
                                else {
                                    rectGroup.property().name += ': Error';
                                }
                                applyStyle(rectGroup, style_3, svg._ctx);
                                applyTransform(rectGroup, child.transform);
                            }
                            break;
                        case 'circle':
                            {
                                var circleGroup = group.addGroup(getElementName(child));
                                var cx = typeof child.cx === 'number' ? child.cx : 0;
                                var cy = typeof child.cy === 'number' ? child.cy : 0;
                                var r = typeof child.r === 'number' ? child.r : 0;
                                if (r > 0) {
                                    var ellipse = circleGroup.addEllipse();
                                    ellipse.position([cx, cy]);
                                    ellipse.size([2 * r, 2 * r]);
                                }
                                applyStyle(circleGroup, style_3, svg._ctx);
                                applyTransform(circleGroup, child.transform);
                            }
                            break;
                        case 'ellipse':
                            {
                                var ellipseGroup = group.addGroup(getElementName(child));
                                var cx = typeof child.cx === 'number' ? child.cx : 0;
                                var cy = typeof child.cy === 'number' ? child.cy : 0;
                                var rx = typeof child.rx === 'number' ? child.rx : 0;
                                var ry = typeof child.ry === 'number' ? child.ry : 0;
                                if (rx > 0 && ry > 0) {
                                    var ellipse = ellipseGroup.addEllipse();
                                    ellipse.position([cx, cy]);
                                    ellipse.size([2 * rx, 2 * ry]);
                                }
                                applyStyle(ellipseGroup, style_3, svg._ctx);
                                applyTransform(ellipseGroup, child.transform);
                            }
                            break;
                        case 'line':
                            {
                                var lineGroup = group.addGroup(getElementName(child));
                                var commands = lineToPathCommands(child);
                                var shape = pathCommandsToShape(commands)[0];
                                var path = lineGroup.addPath();
                                path.path(shape);
                                applyStyle(lineGroup, style_3, svg._ctx);
                                applyTransform(lineGroup, child.transform);
                            }
                            break;
                        case 'polyline':
                            {
                                var polylineGroup = group.addGroup(getElementName(child));
                                var commands = polylineToPathCommands(child);
                                if (commands.length) {
                                    var shape = pathCommandsToShape(commands)[0];
                                    var path = polylineGroup.addPath();
                                    path.path(shape);
                                }
                                applyStyle(polylineGroup, style_3, svg._ctx);
                                applyTransform(polylineGroup, child.transform);
                            }
                            break;
                        case 'polygon':
                            {
                                var polygonGroup = group.addGroup(getElementName(child));
                                var commands = polygonToPathCommands(child);
                                if (commands.length) {
                                    var shape = pathCommandsToShape(commands)[0];
                                    var path = polygonGroup.addPath();
                                    path.path(shape);
                                }
                                applyStyle(polygonGroup, style_3, svg._ctx);
                                applyTransform(polygonGroup, child.transform);
                            }
                            break;
                    }
                }
            }
        }
    };
    var xlmToShapeLayer = function (svgXML, layerName, shapeLayer) {
        var svg = traverseSVG(svgXML);
        if (!svg) {
            throw new Error('unable to parse as svg');
        }
        var layer = null;
        if (shapeLayer instanceof ShapeLayer) {
            layer = shapeLayer;
        }
        else {
            var comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) {
                throw new Error('activate a comp');
            }
            layer = comp.layers.addShape();
            layer.name = layerName;
            layer.transform.anchorPoint.setValue([0.5 * svg.viewBox[2], 0.5 * svg.viewBox[3]]);
            layer.transform.position.setValue([0.5 * comp.width, 0.5 * comp.height]);
        }
        bakeSVG(svg, layer);
        return layer;
    };
    /**
     * API
     */
    var svgToShapeLayer = function (fileOrText, shapeLayer) {
        if (fileOrText instanceof File) {
            var svgXML = fileToXML(fileOrText);
            return xlmToShapeLayer(svgXML, fileOrText.displayName, shapeLayer);
        }
        else if (typeof fileOrText === 'string') {
            var svgXML = textToXML(fileOrText);
            return xlmToShapeLayer(svgXML, 'SVG from text', shapeLayer);
        }
        throw new Error('argument must be File or string');
    };
    var Context = /** @class */ (function () {
        function Context(layer) {
            this._layer = null;
            this._commandsGroup = [];
            this._currentCommands = [];
            this._transform = null;
            this._style = {};
            this._states = [];
            this._layer = layer;
        }
        Context.prototype.push = function () {
            if (this._currentCommands.length) {
                this._commandsGroup.push(this._currentCommands);
                this._currentCommands = [];
            }
        };
        Context.prototype.checkEmpty = function () {
            if (!this._currentCommands.length) {
                throw new Error("moveto isn't called yet");
            }
        };
        // set layer
        Context.prototype.layer = function (layer) {
            this._layer = layer;
            return this;
        };
        // clear path
        Context.prototype.clearPath = function () {
            this._commandsGroup = [];
            this._currentCommands = [];
            return this;
        };
        Context.prototype.MoveTo = function (X, Y) {
            this.push();
            this._currentCommands.push({ command: 'M', params: [[X, Y]] });
            return this;
        };
        Context.prototype.M = function (X, Y) {
            return this.MoveTo(X, Y);
        };
        Context.prototype.moveTo = function (x, y) {
            this.push();
            this._currentCommands.push({ command: 'm', params: [[x, y]] });
            return this;
        };
        Context.prototype.m = function (x, y) {
            return this.moveTo(x, y);
        };
        // lineto
        Context.prototype.LineTo = function (X, Y) {
            this.checkEmpty();
            this._currentCommands.push({ command: 'L', params: [[X, Y]] });
            return this;
        };
        Context.prototype.L = function (X, Y) {
            return this.LineTo(X, Y);
        };
        Context.prototype.lineTo = function (x, y) {
            this.checkEmpty();
            this._currentCommands.push({ command: 'l', params: [[x, y]] });
            return this;
        };
        Context.prototype.l = function (x, y) {
            return this.lineTo(x, y);
        };
        Context.prototype.HorizontalLineTo = function (X) {
            this.checkEmpty();
            this._currentCommands.push({ command: 'H', params: [X] });
            return this;
        };
        Context.prototype.H = function (X) {
            return this.HorizontalLineTo(X);
        };
        Context.prototype.horizontalLineTo = function (x) {
            this.checkEmpty();
            this._currentCommands.push({ command: 'h', params: [x] });
            return this;
        };
        Context.prototype.h = function (x) {
            return this.horizontalLineTo(x);
        };
        Context.prototype.VerticalLineTo = function (Y) {
            this.checkEmpty();
            this._currentCommands.push({ command: 'V', params: [Y] });
            return this;
        };
        Context.prototype.V = function (Y) {
            return this.VerticalLineTo(Y);
        };
        Context.prototype.verticalLineTo = function (y) {
            this.checkEmpty();
            this._currentCommands.push({ command: 'v', params: [y] });
            return this;
        };
        Context.prototype.v = function (y) {
            return this.verticalLineTo(y);
        };
        // curveto
        Context.prototype.CuverTo = function (X1, Y1, X2, Y2, X, Y) {
            this.checkEmpty();
            this._currentCommands.push({ command: 'C', params: [[X1, Y1, X2, Y2, X, Y]] });
            return this;
        };
        Context.prototype.C = function (X1, Y1, X2, Y2, X, Y) {
            return this.CuverTo(X1, Y1, X2, Y2, X, Y);
        };
        Context.prototype.cuverTo = function (x1, y1, x2, y2, x, y) {
            this.checkEmpty();
            this._currentCommands.push({ command: 'c', params: [[x1, y1, x2, y2, x, y]] });
            return this;
        };
        Context.prototype.c = function (x1, y1, x2, y2, x, y) {
            return this.cuverTo(x1, y1, x2, y2, x, y);
        };
        Context.prototype.SmoothCuverTo = function (X2, Y2, X, Y) {
            this.checkEmpty();
            this._currentCommands.push({ command: 'S', params: [[X2, Y2, X, Y]] });
            return this;
        };
        Context.prototype.S = function (X2, Y2, X, Y) {
            return this.SmoothCuverTo(X2, Y2, X, Y);
        };
        Context.prototype.smoothCuverTo = function (x2, y2, x, y) {
            this.checkEmpty();
            this._currentCommands.push({ command: 's', params: [[x2, y2, x, y]] });
            return this;
        };
        Context.prototype.s = function (x2, y2, x, y) {
            return this.smoothCuverTo(x2, y2, x, y);
        };
        // quadratic curveto
        Context.prototype.QuadraticCurveTo = function (X1, Y1, X, Y) {
            this.checkEmpty();
            this._currentCommands.push({ command: 'Q', params: [[X1, Y1, X, Y]] });
            return this;
        };
        Context.prototype.Q = function (X1, Y1, X, Y) {
            return this.QuadraticCurveTo(X1, Y1, X, Y);
        };
        Context.prototype.quadraticCurveTo = function (x1, y1, x, y) {
            this.checkEmpty();
            this._currentCommands.push({ command: 'q', params: [[x1, y1, x, y]] });
            return this;
        };
        Context.prototype.q = function (x1, y1, x, y) {
            return this.quadraticCurveTo(x1, y1, x, y);
        };
        Context.prototype.SmoothQuadraticCurveTo = function (X, Y) {
            this.checkEmpty();
            this._currentCommands.push({ command: 'T', params: [[X, Y]] });
            return this;
        };
        Context.prototype.T = function (X, Y) {
            return this.SmoothQuadraticCurveTo(X, Y);
        };
        Context.prototype.smoothQuadraticCurveTo = function (x, y) {
            this.checkEmpty();
            this._currentCommands.push({ command: 't', params: [[x, y]] });
            return this;
        };
        Context.prototype.t = function (x, y) {
            return this.smoothQuadraticCurveTo(x, y);
        };
        // elliptical arc
        Context.prototype.EllipticalArc = function (rx, ry, axisDegree, largeArcFlag, sweepFlag, X, Y) {
            this.checkEmpty();
            this._currentCommands.push({ command: 'A', params: [[rx, ry, axisDegree, largeArcFlag, sweepFlag, X, Y]] });
            return this;
        };
        Context.prototype.A = function (rx, ry, axisDegree, largeArcFlag, sweepFlag, X, Y) {
            return this.EllipticalArc(rx, ry, axisDegree, largeArcFlag, sweepFlag, X, Y);
        };
        Context.prototype.ellipticalArc = function (rx, ry, axisDegree, largeArcFlag, sweepFlag, x, y) {
            this.checkEmpty();
            this._currentCommands.push({ command: 'a', params: [[rx, ry, axisDegree, largeArcFlag, sweepFlag, x, y]] });
            return this;
        };
        Context.prototype.a = function (rx, ry, axisDegree, largeArcFlag, sweepFlag, x, y) {
            return this.ellipticalArc(rx, ry, axisDegree, largeArcFlag, sweepFlag, x, y);
        };
        // closepath
        Context.prototype.closePath = function () {
            this.checkEmpty();
            this._currentCommands.push({ command: 'Z' });
            return this;
        };
        Context.prototype.Z = function () {
            return this.closePath();
        };
        Context.prototype.z = function () {
            return this.closePath();
        };
        /**
         * Basic Shapes
         */
        Context.prototype.rect = function (x, y, width, height, rx, ry) {
            this.push();
            this._currentCommands = rectToPathCommands({
                _tag: 'rect',
                x: x,
                y: y,
                width: width,
                height: height,
                rx: rx,
                ry: ry,
            });
            this.push();
            return this;
        };
        Context.prototype.circle = function (cx, cy, r) {
            this.push();
            this._currentCommands = circleToPathCommands({
                _tag: 'circle',
                cx: cx,
                cy: cy,
                r: r,
            });
            this.push();
            return this;
        };
        Context.prototype.ellipse = function (cx, cy, rx, ry) {
            this.push();
            this._currentCommands = ellipseToPathCommands({
                _tag: 'ellipse',
                cx: cx,
                cy: cy,
                rx: rx,
                ry: ry,
            });
            this.push();
            return this;
        };
        Context.prototype.line = function (x1, y1, x2, y2) {
            this.push();
            this._currentCommands = lineToPathCommands({
                _tag: 'line',
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
            });
            this.push();
            return this;
        };
        Context.prototype.polyline = function (points) {
            this.push();
            this._currentCommands = polylineToPathCommands({
                _tag: 'polyline',
                points: points,
            });
            this.push();
            return this;
        };
        Context.prototype.polygon = function (points) {
            this.push();
            this._currentCommands = polygonToPathCommands({
                _tag: 'polygon',
                points: points,
            });
            this.push();
            return this;
        };
        /**
         * Transform
         */
        Context.prototype.updateTransform = function (m) {
            if (!this._transform) {
                this._transform = Mat3x3.identity();
            }
            this._transform = this._transform.mult(m);
        };
        Context.prototype.clearTransform = function () {
            this._transform = null;
            return this;
        };
        Context.prototype.matrix = function (a, b, c, d, e, f) {
            this.updateTransform(transformToMat3x3({ type: 'matrix', mat: [a, b, c, d, e, f] }));
            return this;
        };
        Context.prototype.translate = function (tx, ty) {
            this.updateTransform(transformToMat3x3({ type: 'translate', tx: tx, ty: ty }));
            return this;
        };
        Context.prototype.scale = function (sx, sy) {
            this.updateTransform(transformToMat3x3({ type: 'scale', sx: sx, sy: sy }));
            return this;
        };
        Context.prototype.rotate = function (degree, cx, cy) {
            this.updateTransform(transformToMat3x3({ type: 'rotate', angle: degree, cx: cx, cy: cy }));
            return this;
        };
        Context.prototype.skewX = function (degree) {
            this.updateTransform(transformToMat3x3({ type: 'skewX', angle: degree }));
            return this;
        };
        Context.prototype.skewY = function (degree) {
            this.updateTransform(transformToMat3x3({ type: 'skewY', angle: degree }));
            return this;
        };
        /**
         * Style
         */
        Context.prototype.updateStyle = function (style) {
            this._style = __assign(__assign({}, this._style), style);
        };
        Context.prototype.clearStyle = function () {
            this._style = {};
            return this;
        };
        Context.prototype.style = function (style) {
            this.updateStyle(style);
            return this;
        };
        Context.prototype.fill = function (color) {
            this.updateStyle({ fill: color });
            return this;
        };
        Context.prototype.fillOpacity = function (opacity) {
            this.updateStyle({ fillOpacity: opacity });
            return this;
        };
        Context.prototype.fillRule = function (rule) {
            this.updateStyle({ fillRule: rule });
            return this;
        };
        Context.prototype.stroke = function (color) {
            this.updateStyle({ stroke: color });
            return this;
        };
        Context.prototype.strokeOpacity = function (opacity) {
            this.updateStyle({ strokeOpacity: opacity });
            return this;
        };
        Context.prototype.strokeWidth = function (width) {
            this.updateStyle({ strokeWidth: width });
            return this;
        };
        Context.prototype.strokeLineCap = function (cap) {
            this.updateStyle({ strokeLineCap: cap });
            return this;
        };
        Context.prototype.strokeLineJoin = function (join) {
            this.updateStyle({ strokeLineJoin: join });
            return this;
        };
        Context.prototype.strokeMiterLimit = function (limit) {
            this.updateStyle({ strokeMiterLimit: limit });
            return this;
        };
        Context.prototype.strokeDashArray = function (array) {
            this.updateStyle({ strokeDashArray: array });
            return this;
        };
        Context.prototype.strokeDashOffset = function (offset) {
            this.updateStyle({ strokeDashOffset: offset });
            return this;
        };
        /**
         * State
         */
        Context.prototype.save = function () {
            var state = {
                commandsGroup: Atarabi.JSON.parse(Atarabi.JSON.stringify(this._commandsGroup)),
                currentCommands: Atarabi.JSON.parse(Atarabi.JSON.stringify(this._currentCommands)),
                transform: this._transform ? this._transform.clone() : null,
                style: __assign({}, this._style),
            };
            this._states.push(state);
            return this;
        };
        Context.prototype.restore = function () {
            if (this._states.length) {
                var state = this._states.pop();
                this._commandsGroup = state.commandsGroup;
                this._currentCommands = state.currentCommands;
                this._transform = state.transform;
                this._style = state.style;
            }
            return this;
        };
        Context.prototype.reset = function () {
            this._commandsGroup = [];
            this._currentCommands = [];
            this._transform = null;
            this._style = {};
            this._states = [];
            return this;
        };
        /**
         * Bake
         */
        Context.prototype.shape = function () {
            if (!this._layer) {
                throw new Error("layer isn't given");
            }
            if (!isValid(this._layer)) {
                throw new Error("layer is invalid");
            }
            if (!(this._layer instanceof ShapeLayer)) {
                throw new Error("layer isn't shape layer");
            }
            var layer = this._layer;
            var shapes = this.toShape(false);
            var group = new ShapeGroup(layer, layer).addGroup();
            for (var _i = 0, shapes_1 = shapes; _i < shapes_1.length; _i++) {
                var shape = shapes_1[_i];
                group.addPath().path(shape);
            }
            var style = this._style;
            // fill
            if (isArray(style.fill)) {
                var fill = group.addFill();
                fill.color(style.fill);
                if (typeof style.fillOpacity === 'number') {
                    fill.opacity(M.clamp(100 * style.fillOpacity, 0, 100));
                }
                if (typeof style.fillRule === 'string') {
                    fill.fillRule(fillRuleToValue(style.fillRule));
                }
            }
            // stroke
            if (isArray(style.stroke)) {
                var stroke = group.addStroke();
                stroke.color(style.stroke);
                if (typeof style.strokeOpacity === 'number') {
                    stroke.opacity(M.clamp(100 * style.strokeOpacity, 0, 100));
                }
                if (typeof style.strokeWidth === 'number') {
                    stroke.strokeWidth(style.strokeWidth);
                }
                if (typeof style.strokeLineCap === 'string') {
                    stroke.lineCap(strokeLineCapToValue(style.strokeLineCap));
                }
                var miter = true;
                if (typeof style.strokeLineJoin === 'string') {
                    var join = strokeLineJoinToValue(style.strokeLineJoin);
                    if (join !== 1 /* not miter */) {
                        miter = false;
                        stroke.lineJoin(join);
                    }
                }
                if (miter && typeof style.strokeMiterLimit === 'number') {
                    stroke.miterLimit(style.strokeMiterLimit);
                }
                if (isArray(style.strokeDashArray)) {
                    stroke.dashes(style.strokeDashArray);
                }
                if (typeof style.strokeDashOffset === 'number') {
                    stroke.dashOffset(style.strokeDashOffset);
                }
            }
            // transform
            var m = this._transform;
            if (m) {
                applyTransformByMatrix(group, m);
            }
            return this;
        };
        Context.prototype.mask = function () {
            if (!this._layer) {
                throw new Error("layer isn't given");
            }
            if (!isValid(this._layer)) {
                throw new Error("layer is invalid");
            }
            if (!isAVLayer(this._layer)) {
                throw new Error("layer isn't AV layer");
            }
            var layer = this._layer;
            var shapes = this.toShape(true);
            for (var _i = 0, shapes_2 = shapes; _i < shapes_2.length; _i++) {
                var shape = shapes_2[_i];
                var mask = layer.mask.addProperty('ADBE Mask Atom');
                mask('ADBE Mask Shape').setValue(shape);
            }
            return this;
        };
        /**
         * Output
         */
        Context.prototype.toShape = function (transform) {
            var shapes = [];
            var origin = [0, 0];
            for (var _i = 0, _a = this._commandsGroup; _i < _a.length; _i++) {
                var commands = _a[_i];
                var _b = pathCommandsToShape(commands, origin), shape = _b[0], newOrigin = _b[1];
                shapes.push(shape);
                origin = newOrigin;
            }
            if (this._currentCommands.length) {
                var shape = pathCommandsToShape(this._currentCommands)[0];
                shapes.push(shape);
            }
            if (transform === void 0 || (typeof transform === 'boolean' && transform)) {
                if (this._transform) {
                    var m = this._transform;
                    for (var _c = 0, shapes_3 = shapes; _c < shapes_3.length; _c++) {
                        var shape = shapes_3[_c];
                        var newVertices = [];
                        var newInTangents = [];
                        var newOutTangents = [];
                        for (var i = 0, l = shape.vertices.length; i < l; i++) {
                            var vertex = shape.vertices[i];
                            var inTangent = V2.add(shape.inTangents[i], vertex);
                            var outTangent = V2.add(shape.outTangents[i], vertex);
                            var newVertex = m.mult(vertex);
                            var newInTangent = m.mult(inTangent);
                            var newOutTangent = m.mult(outTangent);
                            newVertices.push(newVertex);
                            newInTangents.push(V2.sub(newInTangent, newVertex));
                            newOutTangents.push(V2.sub(newOutTangent, newVertex));
                        }
                        shape.vertices = newVertices;
                        shape.inTangents = newInTangents;
                        shape.outTangents = newOutTangents;
                    }
                }
            }
            return shapes;
        };
        return Context;
    }());
    var getContext = function (layer) {
        return new Context(layer);
    };
    $.global.Atarabi = $.global.Atarabi || {};
    var Atarabi = $.global.Atarabi;
    Atarabi.SVG = (Atarabi.SVG || {});
    Atarabi.SVG.svgToShapeLayer = svgToShapeLayer;
    Atarabi.SVG.getContext = getContext;
    if (Atarabi.API) {
        Atarabi.API.add(SCRIPT_NAME, 'svgToShapeLayer', svgToShapeLayer);
        Atarabi.API.add(SCRIPT_NAME, 'getContext', getContext);
    }
    /**
     * Entry Point
     */
    var main = function (file) {
        var svgXML = fileToXML(file);
        var svg = traverseSVG(svgXML);
        if (!svg) {
            return;
        }
        var fileName = file.displayName;
        var comp = app.project.activeItem instanceof CompItem ? app.project.activeItem : app.project.items.addComp(fileName, Math.ceil(svg.viewBox[2]), Math.ceil(svg.viewBox[3]), 1, 10, 30);
        try {
            app.beginUndoGroup("@svg: ".concat(fileName));
            var shapeLayer = comp.layers.addShape();
            shapeLayer.name = fileName;
            shapeLayer.transform.anchorPoint.setValue([0.5 * svg.viewBox[2], 0.5 * svg.viewBox[3]]);
            shapeLayer.transform.position.setValue([0.5 * comp.width, 0.5 * comp.height]);
            bakeSVG(svg, shapeLayer);
        }
        catch (e) {
            alert(e);
        }
        finally {
            app.endUndoGroup();
        }
    };
    Atarabi.register.importFlavor('svg', function (info) {
        var file = new File(info.path);
        main(file);
    });
})();
