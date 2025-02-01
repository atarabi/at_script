/**
 * @svg v1.1.0
 * 
 *      v1.1.0(2025/02/01) Partial support for style tags and gradients
 */
(() => {

    const SCRIPT_NAME = '@svg';

    /**
     *  Utility
     */
    class A {
        static map<T, U>(arr: T[], fn: (v: T) => U): U[] {
            const result: U[] = [];
            for (const v of arr) {
                result.push(fn(v));
            }
            return result;
        }
        static last<T>(arr: T[]): T {
            return arr[arr.length - 1];
        }
    }

    function trim(s: string) {
        return s.replace(/^\s+|\s+$/g, '');
    }

    function removeCComment(s: string) {
        return s.replace(/\/\*[\s\S]*?\*\//g, '');
    }

    function isArray(value: any): value is any[] {
        return Object.prototype.toString.call(value) === '[object Array]';
    }

    function isLayer(layer: unknown): layer is Layer {
        return layer instanceof ShapeLayer || layer instanceof AVLayer || layer instanceof TextLayer || layer instanceof LightLayer || layer instanceof CameraLayer;
    }

    function isAVLayer(layer: unknown): layer is AVLayer {
        return layer instanceof ShapeLayer || layer instanceof AVLayer || layer instanceof TextLayer;
    }

    /**
     * Math
     */
    class M {
        static clamp(v: number, mn: number, mx: number) {
            return Math.min(Math.max(v, mn), mx);
        }
        static sign(x: number) {
            return x >= 0 ? 1 : -1;
        }
        static degreeToRadian(deg: number) {
            return deg / 180 * Math.PI;
        }
        static radianToDegree(rad: number) {
            return rad / Math.PI * 180;
        }
        static mod(a: number, b: number) {
            const v = a % b;
            return v < 0 ? v + b : v;
        }
    }

    type Vector2 = Atarabi.Vector2;
    type Vector3 = Atarabi.Vector3;

    class V2 {
        static add(lhs: Vector2, rhs: Vector2): Vector2 {
            return [lhs[0] + rhs[0], lhs[1] + rhs[1]];
        }
        static added(lhs: Vector2, rhs: Vector2): Vector2 {
            lhs[0] += rhs[0];
            lhs[1] += rhs[1];
            return lhs;
        }
        static sub(lhs: Vector2, rhs: Vector2): Vector2 {
            return [lhs[0] - rhs[0], lhs[1] - rhs[1]];
        }
        static subed(lhs: Vector2, rhs: Vector2): Vector2 {
            lhs[0] -= rhs[0];
            lhs[1] -= rhs[1];
            return lhs;
        }
        static mult(lhs: Vector2, rhs: Vector2 | number): Vector2 {
            if (typeof rhs === 'number') {
                return [lhs[0] * rhs, lhs[1] * rhs];
            } else {
                return [lhs[0] * rhs[0], lhs[1] * rhs[1]];
            }
        }
        static multed(lhs: Vector2, rhs: Vector2 | number): Vector2 {
            if (typeof rhs === 'number') {
                lhs[0] *= rhs;
                lhs[1] *= rhs;
            } else {
                lhs[0] *= rhs[0];
                lhs[1] *= rhs[1];
            }
            return lhs;
        }
        static div(lhs: Vector2, rhs: Vector2 | number): Vector2 {
            if (typeof rhs === 'number') {
                return [lhs[0] / rhs, lhs[1] / rhs];
            } else {
                return [lhs[0] / rhs[0], lhs[1] / rhs[1]];
            }
        }
        static dived(lhs: Vector2, rhs: Vector2 | number): Vector2 {
            if (typeof rhs === 'number') {
                lhs[0] /= rhs;
                lhs[1] /= rhs;
            } else {
                lhs[0] /= rhs[0];
                lhs[1] /= rhs[1];
            }
            return lhs;
        }
        static dot(lhs: Vector2, rhs: Vector2): number {
            return lhs[0] * rhs[0] + lhs[1] * rhs[1];
        }
        static normalize(lhs: Vector2): Vector2 {
            return this.div(lhs, Math.sqrt(this.dot(lhs, lhs)));
        }
    }

    class V3 {
        static add(lhs: Vector3, rhs: Vector3): Vector3 {
            return [lhs[0] + rhs[0], lhs[1] + rhs[1], lhs[2] + rhs[2]];
        }
        static added(lhs: Vector3, rhs: Vector3): Vector3 {
            lhs[0] += rhs[0];
            lhs[1] += rhs[1];
            lhs[2] += rhs[2];
            return lhs;
        }
        static sub(lhs: Vector3, rhs: Vector3): Vector3 {
            return [lhs[0] - rhs[0], lhs[1] - rhs[1], lhs[2] - rhs[2]];
        }
        static subed(lhs: Vector3, rhs: Vector3): Vector3 {
            lhs[0] -= rhs[0];
            lhs[1] -= rhs[1];
            lhs[2] -= rhs[2];
            return lhs;
        }
        static mult(lhs: Vector3, rhs: Vector3 | number): Vector3 {
            if (typeof rhs === 'number') {
                return [lhs[0] * rhs, lhs[1] * rhs, lhs[2] * rhs];
            } else {
                return [lhs[0] * rhs[0], lhs[1] * rhs[1], lhs[2] * rhs[2]];
            }
        }
        static multed(lhs: Vector3, rhs: Vector3 | number): Vector3 {
            if (typeof rhs === 'number') {
                lhs[0] *= rhs;
                lhs[1] *= rhs;
                lhs[2] *= rhs;
            } else {
                lhs[0] *= rhs[0];
                lhs[1] *= rhs[1];
                lhs[2] *= rhs[2];
            }
            return lhs;
        }
        static div(lhs: Vector3, rhs: Vector3 | number): Vector3 {
            if (typeof rhs === 'number') {
                return [lhs[0] / rhs, lhs[1] / rhs, lhs[2] / rhs];
            } else {
                return [lhs[0] / rhs[0], lhs[1] / rhs[1], lhs[2] / rhs[2]];
            }
        }
        static dived(lhs: Vector3, rhs: Vector3 | number): Vector3 {
            if (typeof rhs === 'number') {
                lhs[0] /= rhs;
                lhs[1] /= rhs;
                lhs[2] /= rhs;
            } else {
                lhs[0] /= rhs[0];
                lhs[1] /= rhs[1];
                lhs[2] /= rhs[2];
            }
            return lhs;
        }
        static dot(lhs: Vector3, rhs: Vector3): number {
            return lhs[0] * rhs[0] + lhs[1] * rhs[1] + lhs[2] * rhs[2];
        }
        static normalize(lhs: Vector3): Vector3 {
            return this.div(lhs, Math.sqrt(this.dot(lhs, lhs)));
        }
    }

    class Mat3x3 {
        private mat: [Vector3, Vector3, Vector3];
        constructor(r1: Vector3, r2: Vector3, r3: Vector3) {
            this.mat = [[...r1], [...r2], [...r3]];
        }
        clone(): Mat3x3 {
            return new Mat3x3(
                [...this.mat[0]],
                [...this.mat[1]],
                [...this.mat[2]],
            );
        }
        static identity(): Mat3x3 {
            return new Mat3x3(
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]
            );
        }
        static zero(): Mat3x3 {
            return new Mat3x3(
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            );
        }
        static mat(a: number, b: number, c: number, d: number, e: number, f: number) {
            return new Mat3x3(
                [a, c, e],
                [b, d, f],
                [0, 0, 1]
            );
        }
        static translate(tx: number, ty: number) {
            return new Mat3x3(
                [1, 0, tx],
                [0, 1, ty],
                [0, 0, 1]
            );
        }
        static scale(sx: number, sy: number) {
            return new Mat3x3(
                [sx, 0, 0],
                [0, sy, 0],
                [0, 0, 1]
            );
        }
        static rotate(deg: number) {
            const rad = M.degreeToRadian(deg);
            return new Mat3x3(
                [Math.cos(rad), -Math.sin(rad), 0],
                [Math.sin(rad), Math.cos(rad), 0],
                [0, 0, 1]
            );
        }
        static skewX(deg: number) {
            const rad = M.degreeToRadian(deg);
            return new Mat3x3(
                [1, Math.tan(rad), 0],
                [0, 1, 0],
                [0, 0, 1]
            );
        }
        static skewY(deg: number) {
            const rad = M.degreeToRadian(deg);
            return new Mat3x3(
                [1, 0, 0],
                [Math.tan(rad), 1, 0],
                [0, 0, 1]
            );
        }
        T(): Mat3x3 {
            return new Mat3x3(
                [this.mat[0][0], this.mat[1][0], this.mat[2][0]],
                [this.mat[0][1], this.mat[1][1], this.mat[2][1]],
                [this.mat[0][2], this.mat[1][2], this.mat[2][2]]
            );
        }
        mult(m: Mat3x3): Mat3x3;
        mult(m: Vector2): Vector2;
        mult(m: Vector3): Vector3;
        mult(m: Mat3x3 | Vector2 | Vector3): Mat3x3 | Vector2 | Vector3 {
            if (m instanceof Mat3x3) {
                const t = m.T();
                return new Mat3x3(
                    [V3.dot(this.mat[0], t.mat[0]), V3.dot(this.mat[0], t.mat[1]), V3.dot(this.mat[0], t.mat[2])],
                    [V3.dot(this.mat[1], t.mat[0]), V3.dot(this.mat[1], t.mat[1]), V3.dot(this.mat[1], t.mat[2])],
                    [V3.dot(this.mat[2], t.mat[0]), V3.dot(this.mat[2], t.mat[1]), V3.dot(this.mat[2], t.mat[2])]
                );
            } else {
                if (m.length === 2) {
                    const _m = [m[0], m[1], 1] satisfies Vector3;
                    return [V3.dot(this.mat[0], _m), V3.dot(this.mat[1], _m)];
                } else {
                    return [V3.dot(this.mat[0], m), V3.dot(this.mat[1], m), V3.dot(this.mat[2], m)];
                }
            }
        }
        inverse(): Mat3x3 {
            const [a, b, c] = this.mat[0];
            const [d, e, f] = this.mat[1];
            const [g, h, i] = this.mat[2];
            const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
            const invDet = 1 / det;
            return new Mat3x3(
                [
                    invDet * (e * i - f * h),
                    invDet * (c * h - b * i),
                    invDet * (b * f - c * e)
                ],
                [
                    invDet * (f * g - d * i),
                    invDet * (a * i - c * g),
                    invDet * (c * d - a * f)
                ],
                [
                    invDet * (d * h - e * g),
                    invDet * (b * g - a * h),
                    invDet * (a * e - b * d)
                ]
            );
        }
        // ref: https://math.stackexchange.com/questions/13150/extracting-rotation-scale-values-from-2d-transformation-matrix
        decompose() {
            const [a, c, e] = this.mat[0];
            const [b, d, f] = this.mat[1];
            const delta = a * d - b * c;
            const result = {
                translation: [e, f] satisfies Vector2,
                scale: [0, 0] satisfies Vector2,
                skew: [0, 0] satisfies Vector2,
                rotation: 0,
            };
            if (a !== 0 || b !== 0) {
                const r = Math.sqrt(a * a + b * b);
                result.scale = [r, delta / r];
                result.skew = [Math.atan((a * c + b * d) / (r * r)), 0];
                result.rotation = M.sign(b) * Math.acos(a / r);
            } else if (c !== 0 || d !== 0) {
                const s = Math.sqrt(c * c + d * d);
                result.scale = [delta / s, s];
                result.skew = [0, Math.atan((a * c + b * d) / (s * s))];
                result.rotation = Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
            }
            return result;
        }
    }

    /**
     *  Parser
     *      (ref: https://blog.livewing.net/typescript-parser-combinator)
     */
    // Base
    type ParserInput = readonly [text: string, pos: number];

    type ParserSucess<T> = [true, position: number, value: T];

    type ParserFail = [false];

    type ParserOutput<T> = ParserSucess<T> | ParserFail;

    type Parser<T> = (input: ParserInput) => ParserOutput<T>;

    type ParserData<P> = P extends Parser<infer T> ? T : never;

    const eof: Parser<null> = ([text, pos]) => {
        if (pos < text.length) {
            return [false];
        }
        return [true, pos, null];
    };

    // one character
    type IsFunc = <T extends string>(f: (c: string) => c is T) => Parser<T>;
    const is: IsFunc = f => ([text, pos]) => {
        if (pos < text.length) {
            const c = text[pos];
            if (f(c)) {
                return [true, pos + 1, c];
            }
        }
        return [false];
    };

    // multiple characters
    type AreFunc = (f: (str: string) => number) => Parser<string>;
    const are: AreFunc = f => ([text, pos]) => {
        if (pos < text.length) {
            const t = text.substr(pos);
            const c = f(t);
            if (c > 0) {
                return [true, pos + c, t.substr(0, c)];
            }
        }
        return [false];
    };

    type ChFunc = <T extends string>(c: T) => Parser<T>;
    const ch: ChFunc = <T extends string>(c: T) => input => is((v): v is typeof c => v === c)(input);

    type StrFunc = <T extends string>(str: T) => Parser<T>;
    const str: StrFunc = <T extends string>(s: T) => input => {
        const t = input[0].substr(input[1], s.length);
        if (t === s) {
            return [true, input[1] + s.length, s];
        }
        return [false];
    };

    type RegFunc = (reg: RegExp) => Parser<string>;
    const reg: RegFunc = reg => input => {
        const s = input[0].substr(input[1]);
        const m = s.match(reg);
        if (!m) {
            return [false];
        }
        return [true, input[1] + m[0].length, m[0]];
    };

    type NotFunc = (p: Parser<unknown>) => Parser<null>;
    const not: NotFunc = p => input => {
        if (p(input)[0]) {
            return [false];
        } else {
            return [true, input[1], null];
        }
    };

    type OrFunc = <T>(ps: Parser<T>[]) => Parser<T>;
    const or: OrFunc = ps => input => {
        for (const p of ps) {
            const r = p(input);
            if (r[0]) return r;
        }
        return [false];
    };

    type CatFunc = <T extends Parser<unknown>[]>(ps: [...T]) => Parser<{ [K in keyof T]: ParserData<T[K]> }>;
    const cat: CatFunc = ps => input => {
        const rs = [];
        let i = input;
        for (const p of ps) {
            const r = p(i);
            if (!r[0]) return [false];
            rs.push(r[2]);
            i = [input[0], r[1]];
        }
        return [true, i[1], rs as ParserData<ReturnType<ReturnType<CatFunc>>>];
    };

    type RepFunc = <T>(p: Parser<T>, min?: number, max?: number) => Parser<T[]>;
    const rep: RepFunc = (p, min = 0, max = Number.POSITIVE_INFINITY) => input => {
        if (!(0 <= min && min <= max)) throw new Error('rep: must be 0 <= min <= max');
        const rs: ParserData<typeof p>[] = [];
        let i = input;
        for (let n = 0; n < max; n++) {
            const r = p(i);
            if (!r[0]) break;
            rs.push(r[2]);
            i = [input[0], r[1]];
        }
        if (rs.length < min) return [false];
        return [true, i[1], rs];
    };

    type MapFunc = <T, U>(p: Parser<T>, f: (a: T) => U) => Parser<U>;
    const map: MapFunc = (p, f) => input => {
        const r = p(input);
        if (!r[0]) return [false];
        return [true, r[1], f(r[2])];
    };

    type Some<T> = { _tag: 'some'; value: T; }
    type None = { _tag: 'none'; };
    type Option<T> = Some<T> | None;
    const isSome = <T extends unknown>(v: Option<T>): v is Some<T> => {
        return v._tag === 'some';
    };
    const isNone = <T extends unknown>(v: Option<T>): v is None => {
        return v._tag === 'none';
    };

    type OptFunc = <T>(p: Parser<T>) => Parser<Option<T>>;
    const opt: OptFunc = p => input => {
        const r = rep(p, 0, 1)(input);
        if (!r[0]) return [false];
        return [true, r[1], r[2].length === 0 ? { _tag: 'none' } : { _tag: 'some', value: r[2][0] }];
    };

    // Basic
    type Wsp = ' ' | '\r' | '\n' | '\t';
    const wsp: Parser<Wsp> = is((c): c is Wsp => /^[ \r\n\t]$/.test(c));

    type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    const digit: Parser<Digit> = is((c): c is Digit => /^\d$/.test(c));

    type HexDigit = Digit | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f';
    const hexDigit: Parser<HexDigit> = is((c): c is Digit => /^[0-9A-Fa-f]$/.test(c));

    const unwrap = <T extends string>(v: Option<T> | T) => {
        if (typeof v === 'string') {
            return v;
        }
        if (isSome(v)) {
            return v.value;
        }
        return '';
    };

    type OptArray<T> = (Option<T> | T)[];

    const flatten = <T extends string>(p: Parser<(Option<T> | T)[]>) => {
        return map(p, v => A.map(v, unwrap).join(''));
    };

    const wspPlus = reg(/^[ \r\n\t]+/); // flatten(rep(wsp, 1));
    const wspStar = reg(/^[ \r\n\t]*/);// flatten(rep(wsp));
    const digitSequence = reg(/^[0-9]+/);
    const sign = or([ch('+'), ch('-')]);
    const exponent = reg(/^[eE][+-]?[0-9]+/); //flatten(cat([or([ch('e'), ch('E')]), opt(sign), digitSequence]));
    const fractionalConstant = flatten(or<OptArray<string>>([cat([opt(digitSequence), ch('.'), digitSequence]), cat([digitSequence, ch('.')])]));
    const floatingPointConstant = flatten(or<OptArray<string>>([cat([fractionalConstant, opt(exponent)]), cat([digitSequence, exponent])]));
    const integerConstant = digitSequence;
    const comma = ch(',');
    const commaWsp = flatten(or<OptArray<string>>([cat([wspPlus, opt(comma), wspStar]), cat([comma, wspStar])]));
    const flag = or([ch('0'), ch('1')]);
    const floatingPoint = flatten(cat([opt(sign), floatingPointConstant]));
    const integer = flatten(cat([opt(sign), integerConstant]));
    const number = reg(/^[+-]?\d*\.?\d+(?:[eE][+-]?\d+)?/); //or([floatingPoint, integer]);
    const negativeNumber = flatten(or([cat([ch('-'), floatingPointConstant]), cat([ch('-'), integerConstant])]));
    const nonNegativeNumber = or([floatingPointConstant, integerConstant]);

    /**
     * Transform
     */
    type Transform = Matrix | Translate | Scale | Rotate | SkewX | SkewY;
    type Matrix = { type: 'matrix'; mat: [number, number, number, number, number, number]; };
    type Translate = { type: 'translate'; tx: number; ty?: number; };
    type Scale = { type: 'scale'; sx: number; sy?: number; };
    type Rotate = { type: 'rotate'; angle: number; cx?: number; cy?: number; };
    type SkewX = { type: 'skewX'; angle: number; };
    type SkewY = { type: 'skewY'; angle: number; };

    const skewY = map(cat([str('skewY'), wspStar, ch('('), wspStar, number, wspStar, ch(')')]), arr => {
        return {
            type: 'skewY',
            angle: parseFloat(arr[4]),
        } as SkewY;
    });

    const skewX = map(cat([str('skewX'), wspStar, ch('('), wspStar, number, wspStar, ch(')')]), arr => {
        return {
            type: 'skewX',
            angle: parseFloat(arr[4]),
        } as SkewX;
    });

    const rotate = map(cat([str('rotate'), wspStar, ch('('), wspStar, number, opt(cat([commaWsp, number, commaWsp, number])), wspStar, ch(')')]), arr => {
        const center = arr[5];
        if (isSome(center)) {
            return {
                type: 'rotate',
                angle: parseFloat(arr[4]),
                cx: parseFloat(center.value[1]),
                cy: parseFloat(center.value[3]),
            } as Rotate;
        }
        return {
            type: 'rotate',
            angle: parseFloat(arr[4]),
        } as Rotate;
    });

    const scale = map(cat([str('scale'), wspStar, ch('('), wspStar, number, opt(cat([commaWsp, number])), wspStar, ch(')')]), arr => {
        const sy = arr[5];
        if (isSome(sy)) {
            return {
                type: 'scale',
                sx: parseFloat(arr[4]),
                sy: parseFloat(sy.value[1]),
            } as Scale;
        }
        return {
            type: 'scale',
            sx: parseFloat(arr[4]),
        } as Scale;
    });

    const translate = map(cat([str('translate'), wspStar, ch('('), wspStar, number, opt(cat([commaWsp, number])), wspStar, ch(')')]), arr => {
        const sy = arr[5];
        if (isSome(sy)) {
            return {
                type: 'translate',
                tx: parseFloat(arr[4]),
                ty: parseFloat(sy.value[1]),
            } as Translate;
        }
        return {
            type: 'translate',
            tx: parseFloat(arr[4]),
        } as Translate;
    });

    const matrix = map(cat([str('matrix'), wspStar, ch('('), wspStar, number, commaWsp, number, commaWsp, number, commaWsp, number, commaWsp, number, commaWsp, number, wspStar, ch(')')]), arr => {
        return {
            type: 'matrix',
            mat: A.map([arr[4], arr[6], arr[8], arr[10], arr[12], arr[14]], parseFloat),
        } as Matrix;
    });

    const transform = or<Transform>([matrix, translate, scale, rotate, skewX, skewY]);

    function transforms(input: ParserInput): ParserOutput<Transform[]> {
        return or<Transform[]>([
            map(cat([transform, rep(commaWsp, 1), transforms]), ([t, , ts]) => {
                return [t, ...ts];
            }),
            map(transform, v => [v]),
        ])(input);
    }

    const transformList = map(cat([wspStar, opt(transforms), wspStar]), ([, ts,]) => {
        if (isSome(ts)) {
            return ts.value;
        }
        return [];
    });

    /**
     * Path
     */
    type PathCommand = MoveTo | ClosePath | LineTo | HorizontalLineTo | VerticalLineTo | CurveTo | SmoothCurveTo | QuadraticBezier | SmoothQuadraticBezier | EllipticalArc;
    type MoveTo = { command: 'M' | 'm'; params: [number, number][]; };
    type ClosePath = { command: 'Z' | 'z'; };
    type LineTo = { command: 'L' | 'l'; params: [number, number][]; };
    type HorizontalLineTo = { command: 'H' | 'h'; params: number[]; };
    type VerticalLineTo = { command: 'V' | 'v'; params: number[]; };
    type CurveTo = { command: 'C' | 'c'; params: [number, number, number, number, number, number][]; };
    type SmoothCurveTo = { command: 'S' | 's'; params: [number, number, number, number][]; };
    type QuadraticBezier = { command: 'Q' | 'q'; params: [number, number, number, number][]; };
    type SmoothQuadraticBezier = { command: 'T' | 't'; params: [number, number][]; };
    type EllipticalArc = { command: 'A' | 'a'; params: [number, number, number, number, number, number, number][]; }

    const coordinateOfPath = number;
    const coordinatePair = map(cat([coordinateOfPath, opt(commaWsp), coordinateOfPath]), ([x, , y]) => [x, y] satisfies [string, string]);

    const makeSequence = <T, U>(parser: Parser<T>, sep: Parser<U>): Parser<T[]> => ([text, pos]) => {
        const value: T[] = [];

        const firstResult = parser([text, pos]);
        if (!firstResult[0]) {
            return [false];
        }
        pos = firstResult[1];
        value.push(firstResult[2]);

        const sepParser = map(cat([opt(sep), parser]), arr => arr[1]);
        while (true) {
            const result = sepParser([text, pos]);
            if (!result[0]) {
                break;
            }
            pos = result[1];
            value.push(result[2]);
        }

        return [true, pos, value];
    };

    // common
    const coordinateSequence = makeSequence(map(coordinateOfPath, v => parseFloat(v)), commaWsp);

    const vector2dSequence = makeSequence(map(coordinatePair, arr => A.map(arr, parseFloat) as Vector2), commaWsp);

    const vector4d = map(cat([coordinatePair, opt(commaWsp), coordinatePair]), arr => {
        return A.map([...arr[0], ...arr[2]], parseFloat) as [number, number, number, number];
    });

    const vector4dSequence = makeSequence(vector4d, commaWsp);

    // main
    const ellipticalArcArgument = map(cat([nonNegativeNumber, opt(commaWsp), nonNegativeNumber, opt(commaWsp), number, commaWsp, flag, opt(commaWsp), flag, opt(commaWsp), coordinatePair]), arr => {
        return A.map([arr[0], arr[2], arr[4], arr[6], arr[8], arr[10][0], arr[10][1]], parseFloat) as EllipticalArc['params'][0];
    });

    const ellipticalArcArgumentSequence = makeSequence(ellipticalArcArgument, commaWsp);

    const ellipticalArc = map(cat([or([ch('A'), ch('a')]), wspStar, ellipticalArcArgumentSequence]), arr => {
        return {
            command: arr[0],
            params: arr[2],
        } satisfies EllipticalArc;
    });

    const smoothQuadraticBezierCurveto = map(cat([or([ch('T'), ch('t')]), wspStar, vector2dSequence]), arr => {
        return {
            command: arr[0],
            params: arr[2],
        } satisfies SmoothQuadraticBezier;
    });

    const quadraticBezierCurveTo = map(cat([or([ch('Q'), ch('q')]), wspStar, vector4dSequence]), arr => {
        return {
            command: arr[0],
            params: arr[2],
        } satisfies QuadraticBezier;
    });

    const smoothCurveTo = map(cat([or([ch('S'), ch('s')]), wspStar, vector4dSequence]), arr => {
        return {
            command: arr[0],
            params: arr[2],
        } satisfies SmoothCurveTo;
    });

    const curvetoArgument = map(cat([coordinatePair, opt(commaWsp), coordinatePair, opt(commaWsp), coordinatePair]), arr => {
        return A.map([...arr[0], ...arr[2], ...arr[4]], parseFloat) as CurveTo['params'][0];
    });

    const curvetoArgumentSequence = makeSequence(curvetoArgument, commaWsp);

    const curveTo = map(cat([or([ch('C'), ch('c')]), wspStar, curvetoArgumentSequence]), arr => {
        return {
            command: arr[0],
            params: arr[2],
        } satisfies CurveTo;
    });

    const verticalLineto = map(cat([or([ch('V'), ch('v')]), wspStar, coordinateSequence]), arr => {
        return {
            command: arr[0],
            params: arr[2],
        } satisfies VerticalLineTo;
    });

    const horizontalLineto = map(cat([or([ch('H'), ch('h')]), wspStar, coordinateSequence]), arr => {
        return {
            command: arr[0],
            params: arr[2],
        } satisfies HorizontalLineTo;
    });

    const lineTo = map(cat([or([ch('L'), ch('l')]), wspStar, vector2dSequence]), arr => {
        return {
            command: arr[0],
            params: arr[2],
        } satisfies LineTo;
    });

    const closePath = map(or([ch('Z'), ch('z')]), c => {
        return {
            command: c,
        } satisfies ClosePath;
    });

    const moveTo = map(cat([or([ch('M'), ch('m')]), wspStar, vector2dSequence]), arr => {
        return {
            command: arr[0],
            params: arr[2],
        } satisfies MoveTo;
    });

    const drawToCommand = or<PathCommand>([closePath, lineTo, horizontalLineto, verticalLineto, curveTo, smoothCurveTo, quadraticBezierCurveTo, smoothQuadraticBezierCurveto, ellipticalArc]);

    const svgPath: Parser<PathCommand[][]> = ([text, pos]: ParserInput) => {
        const commandsGroup: PathCommand[][] = [];

        while (true) {
            const newPos = text.substr(pos).search(/[Mm]/);
            if (newPos === -1) {
                break;
            }

            let commands: PathCommand[] = [];
            pos += newPos;

            const result = moveTo([text, pos]);
            if (!result[0]) {
                break;
            }
            pos = result[1];
            commands.push(result[2]);

            while (true) {
                const newPos = text.substr(pos).search(/[MmZzLlHhVvCcSsQqTtAa]/);
                if (newPos === -1) {
                    break;
                }
                pos += newPos;
                const c = text[pos];
                if (c === 'M' || c === 'm') {
                    break;
                } else {
                    const result = drawToCommand([text, pos]);
                    if (!result[0]) {
                        break;
                    }
                    pos = result[1];
                    commands.push(result[2]);
                }
            }

            commandsGroup.push(commands);
        }

        return [true, pos, commandsGroup];
    };

    /**
     * Color
     */
    const COLOR_NAMES = {
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
    } satisfies { [name: string]: Atarabi.Color; };

    // https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
    const hueToRgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };

    // h: [0, 360], s, l: [0, 100]
    const hslToRgb = ([h, s, l]: Vector3): Vector3 => {
        h = M.mod(h, 360) / 360;
        s = M.clamp(s / 100, 0, 1);
        l = M.clamp(l / 100, 0, 1);

        let r = l;
        let g = l;
        let b = l;

        if (s !== 0) {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
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
    const angle: Parser<number> = map(cat([number, opt(or([str('deg'), str('grad'), str('rad')]))]), (arr) => {
        if (isSome(arr[1])) {
            let deg = parseFloat(arr[0]);
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

    const colorKeyword = are(str => {
        const s = str.toLowerCase();
        for (const key in COLOR_NAMES) {
            if (s.substr(0, key.length) === key) {
                return key.length;
            }
        }
        return 0;
    });

    const color: Parser<Atarabi.Color | Atarabi.ColorA> = or([
        // #FFFFFF
        map(cat([ch('#'), hexDigit, hexDigit, hexDigit, hexDigit, hexDigit, hexDigit]), arr => {
            return [parseInt(`${arr[1]}${arr[2]}`, 16) / 255, parseInt(`${arr[3]}${arr[4]}`, 16) / 255, parseInt(`${arr[5]}${arr[6]}`, 16) / 255] satisfies Atarabi.Color;
        }),
        // #FFF
        map(cat([ch('#'), hexDigit, hexDigit, hexDigit]), arr => {
            return [parseInt(`${arr[1]}${arr[1]}`, 16) / 255, parseInt(`${arr[2]}${arr[2]}`, 16) / 255, parseInt(`${arr[3]}${arr[3]}`, 16) / 255] satisfies Atarabi.Color;
        }),
        // rgb(100%, 100%, 100%)
        map(cat([str('rgb('), wspStar, integer, ch('%'), commaWsp, integer, ch('%'), commaWsp, integer, ch('%'), wspStar, ch(')')]), arr => {
            return [parseInt(arr[2], 10) / 100, parseInt(arr[5], 10) / 100, parseInt(arr[8], 10) / 100] satisfies Atarabi.Color;
        }),
        // rgb(255, 255, 255)
        map(cat([str('rgb('), wspStar, integer, commaWsp, integer, commaWsp, integer, wspStar, ch(')')]), arr => {
            return [parseInt(arr[2], 10) / 255, parseInt(arr[4], 10) / 255, parseInt(arr[6], 10) / 255] satisfies Atarabi.Color;
        }),
        // rgba(100%, 100%, 100%, 1)
        map(cat([str('rgba('), wspStar, integer, ch('%'), commaWsp, integer, ch('%'), commaWsp, integer, ch('%'), commaWsp, number, wspStar, ch(')')]), arr => {
            return [parseInt(arr[2], 10) / 100, parseInt(arr[5], 10) / 100, parseInt(arr[8], 10) / 100, M.clamp(parseFloat(arr[11]), 0, 1)] satisfies Atarabi.ColorA;
        }),
        // rgba(255, 255, 255, 1)
        map(cat([str('rgba('), wspStar, integer, commaWsp, integer, commaWsp, integer, commaWsp, number, wspStar, ch(')')]), arr => {
            return [parseInt(arr[2], 10) / 255, parseInt(arr[4], 10) / 100, parseInt(arr[6], 10) / 100, M.clamp(parseFloat(arr[8]), 0, 1)] satisfies Atarabi.ColorA;
        }),
        // hsl(360, 100%, 100%)
        map(cat([str('hsl('), wspStar, integer, commaWsp, integer, ch('%'), commaWsp, integer, ch('%'), wspStar, ch(')')]), arr => {
            const h = parseInt(arr[2], 10);
            const s = parseInt(arr[4], 10);
            const l = parseInt(arr[7], 10);
            return hslToRgb([h, s, l]) satisfies Atarabi.Color;
        }),
        // hsla(360, 100%, 100%, 1)
        map(cat([str('hsla('), wspStar, integer, commaWsp, integer, ch('%'), commaWsp, integer, ch('%'), commaWsp, number, wspStar, ch(')')]), arr => {
            const h = parseInt(arr[2], 10);
            const s = parseInt(arr[4], 10);
            const l = parseInt(arr[7], 10);
            return [...hslToRgb([h, s, l]), M.clamp(parseFloat(arr[10]), 0, 1)] satisfies Atarabi.ColorA;
        }),
        map(colorKeyword, name => {
            return COLOR_NAMES[name.toLowerCase()];
        }),
    ]);

    type Paint = Atarabi.Color | Atarabi.ColorA | 'none' | 'transparent' | string;
    const paint: Parser<Paint> = or<Paint>([
        color,
        str('none'),
        str('transparent'),
        reg(/^url\(.*\)/),
    ]);

    const length: Parser<number> = map(cat([number, opt(or([str('em'), str('ex'), str('px'), str('in'), str('cm'), str('mm'), str('pt'), str('pc')]))]), (arr) => {
        if (isSome(arr[1])) {
            let len = parseFloat(arr[0]);
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

    type Percentage = [number, '%'];
    const percentage: Parser<Percentage> = map(cat([number, ch('%')]), arr => {
        return [parseFloat(arr[0]), arr[1]] satisfies [number, '%'];
    });

    const lengthOrPercentage: Parser<Percentage|number> = or<Percentage|number>([percentage, length]);

    const numberOrPercentage: Parser<number> = or([map(percentage, percent => percent[0] / 100), map(number, n => parseFloat(n))]);

    /**
     * Style
     */
    const coordinatePairOfPoints = or([
        map(cat([number, commaWsp, number]), arr => { return [parseFloat(arr[0]), parseFloat(arr[2])] satisfies Vector2; }),
        map(cat([number, negativeNumber]), arr => { return [parseFloat(arr[0]), parseFloat(arr[1])] satisfies Vector2; }),
    ]);

    function coordinatePairsOfPoints(input: ParserInput): ParserOutput<Vector2[]> {
        return or<Vector2[]>([
            map(cat([coordinatePairOfPoints, opt(commaWsp), coordinatePairsOfPoints]), ([p, , ps]) => {
                return [p, ...ps];
            }),
            map(coordinatePairOfPoints, v => [v]),
        ])(input);
    }

    const listOfPoints = map(cat([wspStar, coordinatePairsOfPoints, wspStar]), arr => arr[1]);

    type Opacity = number | 'inherit';
    const opacity: Parser<Opacity> = or<Opacity>([
        map(number, v => M.clamp(parseFloat(v), 0, 1)),
        str('inherit'),
    ]);

    type FillRule = 'nonzero' | 'evenodd' | 'inherit';
    const fillRule: Parser<FillRule> = or<FillRule>([
        str('inherit'),
        str('evenodd'),
        str('inherit'),
    ]);

    const fillRuleToValue = (rule: FillRule) => {
        switch (rule) {
            default:
                return 1;
            case 'evenodd':
                return 2;
        }
    };

    type StrokeWidth = number | 'inherit';
    const strokeWidth: Parser<StrokeWidth> = or<StrokeWidth>([
        length,
        str('inherit'),
    ]);

    type StrokeLineCap = 'butt' | 'round' | 'square' | 'inherit';
    const strokeLineCap: Parser<StrokeLineCap> = or<StrokeLineCap>([
        str('butt'),
        str('round'),
        str('square'),
        str('inherit'),
    ]);

    const strokeLineCapToValue = (cap: StrokeLineCap) => {
        switch (cap) {
            default:
                return 1;
            case 'round':
                return 2;
            case 'square':
                return 3;
        }
    };

    type StrokeLineJoin = 'miter' | 'round' | 'bevel' | 'inherit';
    const strokeLineJoin: Parser<StrokeLineJoin> = or<StrokeLineJoin>([
        str('miter'),
        str('round'),
        str('bevel'),
        str('inherit'),
    ]);

    const strokeLineJoinToValue = (join: StrokeLineJoin) => {
        switch (join) {
            default:
                return 1;
            case 'round':
                return 2;
            case 'bevel':
                return 3;
        }
    };

    type StrokeMiterLimit = number | 'inherit';
    const strokeMiterLimit: Parser<StrokeMiterLimit> = or<StrokeMiterLimit>([
        map(number, v => parseFloat(v)),
        str('inherit'),
    ]);

    type DashArray = number[];
    const dashArray: Parser<DashArray> = makeSequence(length, commaWsp);

    type StrokeDashArray = DashArray | 'none' | 'inherit';
    const strokeDashArray: Parser<StrokeDashArray> = or<StrokeDashArray>([
        dashArray,
        str('none'),
        str('inherit'),
    ]);

    type StrokeDashOffset = number | 'inherit';
    const strokeDashOffset: Parser<StrokeDashOffset> = or<StrokeDashOffset>([
        length,
        str('inherit'),
    ]);

    type Gradient = LinearGradient | RadialGradient;

    type LinearGradient = {
        type: 'linear';
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        stops: GradientStop[];
    };

    type RadialGradient = {
        type: 'radial';
        cx: number;
        cy: number;
        r: number;
        fx: number;
        fy: number;
        stops: GradientStop[];
    };

    type GradientStop = {
        offset: number;
        color: Atarabi.ColorA;
    };

    const gradientTagToGradient = (tag: GradientTag, bb: [number, number, number, number] ): Gradient => {
        let m : Mat3x3 = null;
        if (isArray(tag.gradientTransform)) {
            m = Mat3x3.identity();
            for (const transform of tag.gradientTransform) {
                m = m.mult(transformToMat3x3(transform));
            }
        }
        if (tag._tag === 'linearGradient') {
            let x1 = typeof tag.x1 === 'number' ? tag.x1 : 0;
            let y1 = typeof tag.y1 === 'number' ? tag.y1 : 0;
            let x2 = typeof tag.x2 === 'number' ? tag.x2 : bb[2];
            let y2 = typeof tag.y2 === 'number' ? tag.y2 : 0;
            if (m) {
                [x1, y1] = m.mult([x1, y1]);
                [x2, y2] = m.mult([x2, y2]);
            }
            let stops: GradientStop[] = [];
            if (isArray(tag._children)) {
                for (const child of tag._children) {
                    if (child._tag === 'stop') {
                        const offset = typeof child.offset === 'number' ? child.offset : 0;
                        const stopColor = isArray(child["stop-color"]) ? child['stop-color'] : [0, 0, 0, 1];
                        const stopOpacity = isArray(child["stop-opacity"]) ? child['stop-opacity'] : 1;
                        if (stopColor.length === 4) {
                            stopColor[3] *= stopOpacity;
                        } else {
                            stopColor[3] = stopOpacity;
                        }
                        stops.push({ offset, color: stopColor as Atarabi.ColorA });
                    }
                }
            }
            return { type: 'linear', x1, y1, x2, y2, stops };
        } else if (tag._tag === 'radialGradient') {
            let cx = typeof tag.cx === 'number' ? tag.cx : 0.5 * bb[2];
            let cy = typeof tag.cy === 'number' ? tag.cy : 0.5 * bb[3];
            let r = typeof tag.r === 'number' ? tag.r : Math.sqrt(bb[2] * bb[2] + bb[3] * bb[3]) / Math.SQRT2;
            let fx = typeof tag.fx === 'number' ? tag.fx : cx;
            let fy = typeof tag.fy === 'number' ? tag.fy : cy;
            if (m) {
                [cx, cy] = m.mult([cx, cy]);
                [fx, fy] = m.mult([fx, fy]);
            }
            let stops: GradientStop[] = [];
            if (isArray(tag._children)) {
                for (const child of tag._children) {
                    if (child._tag === 'stop') {
                        const offset = typeof child.offset === 'number' ? child.offset : 0;
                        const stopColor = isArray(child["stop-color"]) ? child['stop-color'] : [0, 0, 0, 1];
                        const stopOpacity = isArray(child["stop-opacity"]) ? child['stop-opacity'] : 1;
                        if (stopColor.length === 4) {
                            stopColor[3] *= stopOpacity;
                        } else {
                            stopColor[3] = stopOpacity;
                        }
                        stops.push({ offset, color: stopColor as Atarabi.ColorA });
                    }
                }
            }
            return { type: 'radial', cx, cy, r, fx, fy, stops };
        }
    };

    type StyleMap = { [property: string]: any };

    const styleMap = (text: string): StyleMap => {
        text = removeCComment(text);
        const s: StyleMap = {};
        const ms = text.match(/\s*([^:;]+)\s*:\s*((?:[^;"]|"(?:\\.|[^"])*")*)\s*;?/gm);
        if (!ms) {
            return s;
        }
        for (const m of ms) {
            const idx = m.indexOf(':');
            if (idx === -1) {
                continue;
            }
            s[trim(m.substring(0, idx))] = trim(m.substring(idx + 1).replace(/;\s*$/, ''));
        }
        return s;
    };

    type Style = {
        fill?: Paint; // black
        'fill-opacity'?: Opacity; // 1
        'fill-rule'?: FillRule; // nonzero
        stroke?: Paint; // none
        'stroke-opacity'?: Opacity; // 1
        'stroke-width'?: StrokeWidth; // 1
        'stroke-linecap'?: StrokeLineCap; // butt
        'stroke-linejoin'?: StrokeLineJoin; // miter
        'stroke-miterlimit'?: StrokeMiterLimit; // 4
        'stroke-dasharray'?: StrokeDashArray;
        'stroke-dashoffset'?: StrokeDashOffset;
        display?: 'none' | string; // inline
        visibility?: 'hidden' | 'collapse' | string; // visible
    };

    type StyleSheet = { [selector: string]: Style; };

    const STYLE_ATTRIBUTES: (keyof Style)[] = ['fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-opacity', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset', 'display', 'visibility'] as const;

    const convertStyle = (obj: any, attribute: string) => {
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

    const parseStyle = (text: string): Style => {
        const style = styleMap(text);
        for (const attribute in style) {
            if (!convertStyle(style, attribute)) {
                style[attribute] = typeof style[attribute] === 'string' ? trim(style[attribute]) : style[attribute];
            }
        }
        return style;
    };

    const style = (element: Element): Style | null => {
        const style: Style = {};
        // attribute
        for (const attribute of STYLE_ATTRIBUTES) {
            if (element[attribute] !== void 0) {
                style[attribute] = element[attribute];
            }
        }

        // style
        if (element.style) {
            for (const attribute in element.style) {
                if (element.style[attribute] !== void 0) {
                    style[attribute] = element.style[attribute];
                }
            }
        }

        // check empty
        for (const _ in style) {
            return style;
        }

        return null;
    };

    const mergeStyle = (...styles: Style[]): Style => {
        let base: Style = {};
        for (const style of styles) {
            if (!style) {
                continue;
            }
            for (const key in style) {
                if (style.hasOwnProperty(key)) {
                    base[key] = style[key];
                }
            }
        }
        return base;
    };

    /**
     * SVG
     */
    class SVGContext {
        private _styleSheet: StyleSheet = {};
        pushStyleTag( styleTag: StyleTag ) {
            if (styleTag.styleSheet) {
                const src = styleTag.styleSheet;
                const dst = this._styleSheet;
                for (let selector in src) {
                    if (!src.hasOwnProperty(selector)) {
                        continue;
                    }
                    if (dst.hasOwnProperty(selector)) {
                        dst[selector] = mergeStyle(dst[selector], src[selector]);
                    } else {
                        dst[selector] = src[selector];
                    }
                }
            }
        }
        inquireStyle(element: Element): Style {
            let style: Style = {};
            if (element.class) {
                const klasses = trim(element.class).split(/\s+/);
                for (const klass of klasses) {
                    const key = `.${klass}`;
                    if (this._styleSheet.hasOwnProperty(key)) {
                        style = mergeStyle(style, this._styleSheet[key]);
                    }
                }
            }
            if (element.id) {
                const id = trim(element.id);
                if (id) {
                    const key = `#${id}`;
                    if (this._styleSheet.hasOwnProperty(key)) {
                        style = mergeStyle(style, this._styleSheet[key]);
                    }
                }
            }
            return style;
        }
        private _gradientTags: { [id: string]: GradientTag } = {};
        pushGradientTag( gradientTag: GradientTag, bb: [number, number, number, number] ) {
            if (gradientTag.id) {
                this._gradientTags[gradientTag.id] = gradientTag;
                gradientTag._gradient = gradientTagToGradient(gradientTag, bb);
            }
        }
        inquireGradient(id: string) {
            if (this._gradientTags.hasOwnProperty(id) && this._gradientTags[id]._gradient) {
                return this._gradientTags[id]._gradient;
            }
            return null;
        }
    }

    interface CoreAttirbutes {
        [attribute: string]: any;
        id?: string;
        class?: string;
        _children?: Element[];
        _text?: string;
        _style?: Style;
    }

    interface PresentationAttributes {
        fill?: Paint;
        'fill-opacity'?: Opacity;
        'fill-rule'?: FillRule;
        stroke?: Paint;
        'stroke-opacity'?: Opacity;
        'stroke-width'?: StrokeWidth;
        'stroke-linecap'?: StrokeLineCap;
        'stroke-linejoin'?: StrokeLineJoin;
        'stroke-miterlimit'?: StrokeMiterLimit;
        'stroke-dasharray'?: StrokeDashArray;
        'stroke-dashoffset'?: StrokeDashOffset;
        opacity?: Opacity;
    }

    type Element = SVG | G | Title | Desc | StyleTag | LinearGradientTag | RadialGradientTag | StopTag | Path | Rect | Circle | Ellipse | Line | Polyline | Polygon;

    // Group
    interface SVG extends CoreAttirbutes, PresentationAttributes {
        _tag: 'svg';
        _ctx: SVGContext;
        width?: number;
        height?: number;
        viewBox?: [number, number, number, number];
    }

    interface G extends CoreAttirbutes, PresentationAttributes {
        _tag: 'g';
        style?: Style;
        transform?: Transform[];
    }

    // Text
    interface Title extends CoreAttirbutes {
        _tag: 'title';
    }

    interface Desc extends CoreAttirbutes {
        _tag: 'desc';
    }

    // Style
    interface StyleTag extends CoreAttirbutes {
        _tag: 'style';
        styleSheet?: StyleSheet;
    }

    type GradientTag = LinearGradientTag | RadialGradientTag;

    interface LinearGradientTag extends CoreAttirbutes {
        _tag: 'linearGradient';
        _gradient?: LinearGradient;
        x1?: number;
        y1?: number;
        x2?: number;
        y2?: number;
        gradientTransform?: Transform[];
    }

    interface RadialGradientTag extends CoreAttirbutes {
        _tag: 'radialGradient';
        _gradient?: RadialGradient;
        cx?: number;
        cy?: number;
        r?: number;
        fx?: number;
        fy?: number;
        gradientTransform?: Transform[];
    }

    interface StopTag extends CoreAttirbutes {
        _tag: 'stop';
        offset?: number;
        'stop-color'?: Paint;
        'stop-opacity'?: number;
    }

    // Shape
    interface Path extends CoreAttirbutes, PresentationAttributes {
        _tag: 'path';
        style?: Style;
        transform?: Transform[];
        d?: PathCommand[][];
    }

    interface Rect extends CoreAttirbutes, PresentationAttributes {
        _tag: 'rect';
        style?: Style;
        transform?: Transform[];
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        rx?: number;
        ry?: number;
    }

    interface Circle extends CoreAttirbutes, PresentationAttributes {
        _tag: 'circle';
        style?: Style;
        transform?: Transform[];
        cx?: number;
        cy?: number;
        r?: number;
    }

    interface Ellipse extends CoreAttirbutes, PresentationAttributes {
        _tag: 'ellipse';
        style?: Style;
        transform?: Transform[];
        cx?: number;
        cy?: number;
        rx?: number;
        ry?: number;
    }

    interface Line extends CoreAttirbutes, PresentationAttributes {
        _tag: 'line';
        style?: Style;
        transform?: Transform[];
        x1?: number;
        y1?: number;
        x2?: number;
        y2?: number;
    }

    interface Polyline extends CoreAttirbutes, PresentationAttributes {
        _tag: 'polyline';
        style?: Style;
        transform?: Transform[];
        points?: Vector2[];
    }

    interface Polygon extends CoreAttirbutes, PresentationAttributes {
        _tag: 'polygon';
        style?: Style;
        transform?: Transform[];
        points?: Vector2[];
    }

    const doReverse = (element: Element) => {
        switch (element._tag) {
            case 'linearGradient':
            case 'radialGradient':
                return false;
        }
        return true;
    };

    const getElementName = (element: Element): string => {
        let name = element._tag;
        if (element.id) {
            name += '#' + element.id;
        }
        if (element.class) {
            name += '.' + element.class;
        }
        return name;
    };

    const viewBox = map(cat([wspStar, number, commaWsp, number, commaWsp, number, commaWsp, number, wspStar]), arr => {
        return [parseFloat(arr[1]), parseFloat(arr[3]), parseFloat(arr[5]), parseFloat(arr[7])] satisfies [number, number, number, number];
    });

    function textToXML(text: string): XML {
        // remove xmlns (ref: https://community.adobe.com/t5/indesign-discussions/namespace-in-xml/m-p/3586814)
        text = text.replace(/xmlns?=\"(.*?)\"/g, '');
        return new XML(text);
    }

    function fileToXML(file: File): XML {
        const newFile = new File(file.absoluteURI);
        newFile.encoding = 'utf-8';
        if (!newFile.open('r')) {
            return;
        }
        let text = newFile.read();
        newFile.close();
        return textToXML(text);
    }

    const extractAttributes = (element: Element, xml: XML) => {
        const attributes = xml.attributes();
        for (let i = 0, l = attributes.length(); i < l; i++) {
            const attribute = attributes[i];
            const name = attribute.localName();
            const value = attribute.toString();
            element[name] = value;
        }
        const text = xml.text().toString();
        if (text) {
            element['_text'] = text;
        }
    };

    const parseSelector = (text: string): string[] => {
        const texts = text.split(',');
        const selectors: string[] = [];
        for (const text of texts ) {
            const selector = trim(text).replace(/\s+/g, '');
            if (selector) {
                selectors.push(selector);
            }
        }
        return selectors;
    };

    const percentToNumber = (attribute: string, percent: Percentage, bb: [number, number, number, number]): number => {
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

    const convertAttribute = (element: Element, bb?: [number, number, number, number]) => {
        for (const attribute in element) {
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
                        const len = lengthOrPercentage([trim(element[attribute]), 0])[2];
                        if (isArray(len)) {
                            element[attribute] = percentToNumber(attribute, len, bb);
                        } else {
                            element[attribute] = len;
                        }
                    } else {
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
        const _style = style(element);
        if (_style) {
            element._style = _style;
        }

        // tag specific
        if (element._tag === 'style') {
            if (element._text) {
                const styleSheet: StyleSheet = {};
                let text = removeCComment(element._text);
                while (true) {
                    const start = text.indexOf('{');
                    if (start === -1) {
                        break;
                    }
                    const end = text.indexOf('}', start + 1);
                    if (end === -1) {
                        break;
                    }
                    const selectorText = text.substring(0, start);
                    const styleText = text.substring(start + 1, end);
                    const selectors = parseSelector(selectorText);
                    const style = parseStyle(styleText);
                    for (const selector of selectors) {
                        if (styleSheet.hasOwnProperty(selector)) {
                            styleSheet[selector] = mergeStyle(styleSheet[selector], style);
                        } else {
                            styleSheet[selector] = style;
                        }
                    }
                    text = text.substr(end + 1);
                }
                element.styleSheet = styleSheet;
            }
        }
    };

    const traverseContainer = (svg: SVG, parent: Element, xml: XML) => {
        if (!parent._children) {
            parent._children = [];
        }
        const children = xml.children();
        for (let i = 0; i < children.length(); i++) {
            const childXML = children[i];
            const child: Element = { _tag: childXML.localName() } as any;
            extractAttributes(child, childXML);
            convertAttribute(child, svg.viewBox);
            parent._children.push(child);
            if (childXML.children().length() > 0) {
                traverseContainer(svg, child, childXML);
            }
            if (child._tag === 'style') {
                svg._ctx.pushStyleTag(child);
            } else if (child._tag === 'linearGradient' || child._tag === 'radialGradient') {
                svg._ctx.pushGradientTag(child, svg.viewBox);
            }
        }
        if (doReverse(parent)) {
            parent._children.reverse(); // drawing order is reversed
        }
    };

    const traverseSVG = (xml: XML): SVG => {
        if (xml.localName() !== 'svg') return null;
        const svg: SVG = { _tag: 'svg', _ctx: new SVGContext };
        extractAttributes(svg, xml);
        convertAttribute(svg);
        if (!svg.viewBox) {
            const width = typeof svg.width === 'number' ? svg.width : 300;
            const height = typeof svg.height === 'number' ? svg.height : 150;
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
    class ValidPropertyGroup {
        private indices: number[] = [];
        constructor(private layer: Layer, private propertyGroup: PropertyGroup) {
            const indices = this.indices;
            if (isLayer(propertyGroup)) {
                return;
            }
            let prop = this.propertyGroup;
            while (!isLayer(prop)) {
                indices.unshift(prop.propertyIndex);
                prop = prop.parentProperty;
            }
        }
        P() {
            if (isValid(this.propertyGroup)) {
                return this.propertyGroup;
            }
            let prop = this.layer as any as PropertyGroup;
            for (const index of this.indices) {
                prop = prop(index) as PropertyGroup;
            }
            return this.propertyGroup = prop;
        }
        L() {
            return this.layer;
        }
        C() {
            return this.layer.containingComp;
        }
    }

    class ShapeGroup {
        private propertyGroup: ValidPropertyGroup;
        constructor(layer: Layer, propertyGroup: PropertyGroup) {
            this.propertyGroup = new ValidPropertyGroup(layer, propertyGroup);
        }
        property() {
            return this.propertyGroup.P();
        }
        layer() {
            return this.propertyGroup.L();
        }
        transform(): TransformGroup {
            return new TransformGroup(this.property());
        }
        content(): PropertyGroup {
            if (this.property().matchName === 'ADBE Vector Group') {
                return this.property()('ADBE Vectors Group') as PropertyGroup;
            }
            return this.property()('ADBE Root Vectors Group') as PropertyGroup;
        }
        addGroup(name?: string) {
            const group = this.content().addProperty('ADBE Vector Group') as PropertyGroup;
            if (name) {
                group.name = name;
            }
            return new ShapeGroup(this.layer(), group);
        }
        addPath() {
            const group = this.content().addProperty('ADBE Vector Shape - Group') as PropertyGroup;
            return new PathGroup(this.layer(), group);
        }
        addEllipse() {
            const group = this.content().addProperty('ADBE Vector Shape - Ellipse') as PropertyGroup;
            return new EllipseGroup(this.layer(), group);
        }
        addFill() {
            const group = this.content().addProperty('ADBE Vector Graphic - Fill') as PropertyGroup;
            return new FillGroup(this.layer(), group);
        }
        addStroke() {
            const group = this.content().addProperty('ADBE Vector Graphic - Stroke') as PropertyGroup;
            return new StrokeGroup(this.layer(), group);
        }
        addGradientFill(id?: string) {
            const group = this.content().addProperty('ADBE Vector Graphic - G-Fill') as PropertyGroup;
            if (id) {
                group.name = `#${id}`;
            }
            return new GradientFillGroup(this.layer(), group);
        }
        addGradientStroke(id?: string) {
            const group = this.content().addProperty('ADBE Vector Graphic - G-Stroke') as PropertyGroup;
            if (id) {
                group.name = `#${id}`;
            }
            return new GradientStrokeGroup(this.layer(), group);
        }
    }

    class TransformGroup {
        constructor(private group: PropertyGroup) { }
        transform() {
            return this.group['ADBE Vector Transform Group'] as PropertyGroup;
        }
        anchorPoint() {
            return this.transform()('ADBE Vector Anchor') as Property;
        }
        position() {
            return this.transform()('ADBE Vector Position') as Property;
        }
        scale() {
            return this.transform()('ADBE Vector Scale') as Property;
        }
        skew() {
            return this.transform()('ADBE Vector Skew') as Property;
        }
        skewAxis() {
            return this.transform()('ADBE Vector Skew Axis') as Property;
        }
        rotation() {
            return this.transform()('ADBE Vector Rotation') as Property;
        }
        opacity() {
            return this.transform()('ADBE Vector Group Opacity') as Property;
        }
    }

    class PathGroup {
        private propertyGroup: ValidPropertyGroup;
        constructor(layer: Layer, propertyGroup: PropertyGroup) {
            this.propertyGroup = new ValidPropertyGroup(layer, propertyGroup);
        }
        property() {
            return this.propertyGroup.P();
        }
        path(shape: Shape) {
            (this.property()('ADBE Vector Shape') as Property).setValue(shape);
            return this;
        }
    }

    class EllipseGroup {
        private propertyGroup: ValidPropertyGroup;
        constructor(layer: Layer, propertyGroup: PropertyGroup) {
            this.propertyGroup = new ValidPropertyGroup(layer, propertyGroup);
        }
        property() {
            return this.propertyGroup.P();
        }
        size(sz: Vector2) {
            (this.property()('ADBE Vector Ellipse Size') as Property).setValue(sz);
            return this;
        }
        position(pos: Vector2) {
            (this.property()('ADBE Vector Ellipse Position') as Property).setValue(pos);
            return this;
        }
    }

    class FillGroup {
        private propertyGroup: ValidPropertyGroup;
        constructor(layer: Layer, propertyGroup: PropertyGroup) {
            this.propertyGroup = new ValidPropertyGroup(layer, propertyGroup);
        }
        property() {
            return this.propertyGroup.P();
        }
        fillRule(rule: number) {
            (this.property()('ADBE Vector Fill Rule') as Property).setValue(rule);
            return this;
        }
        color(col: Atarabi.Color) {
            (this.property()('ADBE Vector Fill Color') as Property).setValue(col);
            return this;
        }
        opacity(op: number) {
            (this.property()('ADBE Vector Fill Opacity') as Property).setValue(op);
            return this;
        }
    }

    const DASH_MATCH_NAMES = ['ADBE Vector Stroke Dash 1', 'ADBE Vector Stroke Gap 1', 'ADBE Vector Stroke Dash 2', 'ADBE Vector Stroke Gap 2', 'ADBE Vector Stroke Dash 3', 'ADBE Vector Stroke Gap 3'] as const;

    class StrokeGroup {
        private propertyGroup: ValidPropertyGroup;
        constructor(Layer: Layer, propertyGroup: PropertyGroup) {
            this.propertyGroup = new ValidPropertyGroup(Layer, propertyGroup);
        }
        property() {
            return this.propertyGroup.P();
        }
        color(col: Atarabi.Color) {
            (this.property()('ADBE Vector Stroke Color') as Property).setValue(col);
            return this;
        }
        opacity(op: number) {
            (this.property()('ADBE Vector Stroke Opacity') as Property).setValue(op);
            return this;
        }
        strokeWidth(sw: number) {
            (this.property()('ADBE Vector Stroke Width') as Property).setValue(sw);
            return this;
        }
        lineCap(cp: number) {
            (this.property()('ADBE Vector Stroke Line Cap') as Property).setValue(cp);
            return this;
        }
        lineJoin(join: number) {
            (this.property()('ADBE Vector Stroke Line Join') as Property).setValue(join);
            return this;
        }
        miterLimit(limit: number) {
            (this.property()('ADBE Vector Stroke Miter Limit') as Property).setValue(Math.max(limit, 1));
            return this;
        }
        dashes(dashes: number[]) {
            const ds = (this.property())('ADBE Vector Stroke Dashes') as PropertyGroup;
            for (let i = 0, len = Math.min(DASH_MATCH_NAMES.length, dashes.length); i < len; i++) {
                const dash = ds.addProperty(DASH_MATCH_NAMES[i]) as Property;
                dash.setValue(dashes[i]);
            }
            return this;
        }
        dashOffset(offset: number) {
            const ds = (this.property())('ADBE Vector Stroke Dashes') as PropertyGroup;
            const dashOFfset = ds.addProperty('ADBE Vector Stroke Offset') as Property;
            dashOFfset.setValue(offset);
            return this;
        }
    }

    const enum GradientType {
        Linear = 1,
        Radial = 2,
    }

    class GradientFillGroup {
        private propertyGroup: ValidPropertyGroup;
        constructor(layer: Layer, propertyGroup: PropertyGroup) {
            this.propertyGroup = new ValidPropertyGroup(layer, propertyGroup);
        }
        property() {
            return this.propertyGroup.P();
        }
        fillRule(rule: number) {
            (this.property()('ADBE Vector Fill Rule') as Property).setValue(rule);
            return this;
        }
        type(type: GradientType) {
            (this.property()('ADBE Vector Grad Type') as Property).setValue(type);
            return this;
        }
        startPoint(p: Atarabi.Vector2) {
            (this.property()('ADBE Vector Grad Start Pt') as Property).setValue(p);
            return this;
        }
        endPoint(p: Atarabi.Vector2) {
            (this.property()('ADBE Vector Grad End Pt') as Property).setValue(p);
            return this;
        }
        highlightLength(v: number) {
            (this.property()('ADBE Vector Grad HiLite Length') as Property).setValue(v);
            return this;
        }
        highlightAngle(v: number) {
            (this.property()('ADBE Vector Grad HiLite Angle') as Property).setValue(v);
            return this;
        }
        colors(v: Atarabi.Property.GradientValue) {
            const property = this.property()('ADBE Vector Grad Colors') as Property;
            Atarabi.property.setGradientValue(property, v);
            return this;
        }
        opacity(op: number) {
            (this.property()('ADBE Vector Fill Opacity') as Property).setValue(op);
            return this;
        }
    }

    class GradientStrokeGroup {
        private propertyGroup: ValidPropertyGroup;
        constructor(Layer: Layer, propertyGroup: PropertyGroup) {
            this.propertyGroup = new ValidPropertyGroup(Layer, propertyGroup);
        }
        property() {
            return this.propertyGroup.P();
        }
        type(type: GradientType) {
            (this.property()('ADBE Vector Grad Type') as Property).setValue(type);
            return this;
        }
        startPoint(p: Atarabi.Vector2) {
            (this.property()('ADBE Vector Grad Start Pt') as Property).setValue(p);
            return this;
        }
        endPoint(p: Atarabi.Vector2) {
            (this.property()('ADBE Vector Grad End Pt') as Property).setValue(p);
            return this;
        }
        highlightLength(v: number) {
            (this.property()('ADBE Vector Grad HiLite Length') as Property).setValue(v);
            return this;
        }
        highlightAngle(v: number) {
            (this.property()('ADBE Vector Grad HiLite Angle') as Property).setValue(v);
            return this;
        }
        colors(v: Atarabi.Property.GradientValue) {
            const property = this.property()('ADBE Vector Grad Colors') as Property;
            Atarabi.property.setGradientValue(property, v);
            return this;
        }
        opacity(op: number) {
            (this.property()('ADBE Vector Stroke Opacity') as Property).setValue(op);
            return this;
        }
        strokeWidth(sw: number) {
            (this.property()('ADBE Vector Stroke Width') as Property).setValue(sw);
            return this;
        }
        lineCap(cp: number) {
            (this.property()('ADBE Vector Stroke Line Cap') as Property).setValue(cp);
            return this;
        }
        lineJoin(join: number) {
            (this.property()('ADBE Vector Stroke Line Join') as Property).setValue(join);
            return this;
        }
        miterLimit(limit: number) {
            (this.property()('ADBE Vector Stroke Miter Limit') as Property).setValue(Math.max(limit, 1));
            return this;
        }
        dashes(dashes: number[]) {
            const ds = (this.property())('ADBE Vector Stroke Dashes') as PropertyGroup;
            for (let i = 0, len = Math.min(DASH_MATCH_NAMES.length, dashes.length); i < len; i++) {
                const dash = ds.addProperty(DASH_MATCH_NAMES[i]) as Property;
                dash.setValue(dashes[i]);
            }
            return this;
        }
        dashOffset(offset: number) {
            const ds = (this.property())('ADBE Vector Stroke Dashes') as PropertyGroup;
            const dashOFfset = ds.addProperty('ADBE Vector Stroke Offset') as Property;
            dashOFfset.setValue(offset);
            return this;
        }
    }

    /**
     * Bake
    */
    const svgAngle = (ux: number, uy: number, vx: number, vy: number) => {
        var dot = ux * vx + uy * vy;
        var len = Math.sqrt(ux * ux + uy * uy) * Math.sqrt(vx * vx + vy * vy);

        var ang = Math.acos(M.clamp(dot / len, -1, 1));
        if ((ux * vy - uy * vx) < 0)
            ang = -ang;
        return ang;
    };

    const ellipticalArcToBezier = (rx: number, ry: number, phi: number, fa: number, fs: number, x1: number, y1: number, x2: number, y2: number): { c1: Vector2; c2: Vector2; en1: Vector2; en2: Vector2 }[] => {
        fa = +!!fa;
        fs = +!!fs;
        let rX = Math.abs(rx);
        let rY = Math.abs(ry);

        // (F.6.5.1)
        const dx2 = (x1 - x2) / 2;
        const dy2 = (y1 - y2) / 2;

        const x1p = Math.cos(phi) * dx2 + Math.sin(phi) * dy2;
        const y1p = -Math.sin(phi) * dx2 + Math.cos(phi) * dy2;

        // (F.6.5.2)
        let rxs = rX * rX;
        let rys = rY * rY;
        const x1ps = x1p * x1p;
        const y1ps = y1p * y1p;

        const cr = x1ps / rxs + y1ps / rys;
        if (cr > 1) {
            const s = Math.sqrt(cr);
            rX = s * rX;
            rY = s * rY;
            rxs = rX * rX;
            rys = rY * rY;
        }

        const dq = (rxs * y1ps + rys * x1ps);
        const pq = (rxs * rys - dq) / dq;
        let q = Math.sqrt(Math.max(0, pq));
        if (fa === fs) {
            q = -q;
        }
        const cxp = q * rX * y1p / rY;
        const cyp = - q * rY * x1p / rX;

        // (F.6.5.3)
        const cx = Math.cos(phi) * cxp - Math.sin(phi) * cyp + (x1 + x2) / 2;
        const cy = Math.sin(phi) * cxp + Math.cos(phi) * cyp + (y1 + y2) / 2;

        // (F.6.5.5)
        const theta = svgAngle(1, 0, (x1p - cxp) / rX, (y1p - cyp) / rY);

        // (F.6.5.6)
        let delta = svgAngle((x1p - cxp) / rX, (y1p - cyp) / rY, (-x1p - cxp) / rX, (-y1p - cyp) / rY);
        delta = M.mod(delta, 2 * Math.PI);
        if (!fs) {
            delta -= 2 * Math.PI;
        }

        const E = (n: number): Vector2 => {
            const x = cx + rx * Math.cos(phi) * Math.cos(n) - ry * Math.sin(phi) * Math.sin(n);
            const y = cy + rx * Math.sin(phi) * Math.cos(n) + ry * Math.cos(phi) * Math.sin(n);
            return [x, y];
        };

        const Ed = (n: number): Vector2 => {
            const x = -rx * Math.cos(phi) * Math.sin(n) - ry * Math.sin(phi) * Math.cos(n);
            const y = -rx * Math.sin(phi) * Math.sin(n) + ry * Math.cos(phi) * Math.cos(n);
            return [x, y];
        };

        const n: number[] = [];
        n.push(theta);
        const interval = Math.PI / 4;
        if (delta < 0) {
            for (let d = -interval; d > delta; d -= interval) {
                n.push(theta + d);
            }
        } else {
            for (let d = interval; d < delta; d += interval) {
                n.push(theta + d);
            }
        }
        n.push(theta + delta);

        const getCP = (n1: number, n2: number): ReturnType<typeof ellipticalArcToBezier>[0] => {
            const en1 = E(n1);
            const en2 = E(n2);
            const edn1 = Ed(n1);
            const edn2 = Ed(n2);
            const alpha = Math.sin(n2 - n1) * (Math.sqrt(4 + 3 * Math.pow(Math.tan((n2 - n1) / 2), 2)) - 1) / 3;
            return {
                c1: [en1[0] + alpha * edn1[0], en1[1] + alpha * edn1[1]],
                c2: [en2[0] - alpha * edn2[0], en2[1] - alpha * edn2[1]],
                en1,
                en2,
            };
        };

        const cps: ReturnType<typeof ellipticalArcToBezier> = []
        for (var i = 0; i < n.length - 1; i++) {
            cps.push(getCP(n[i], n[i + 1]));
        }

        return cps;
    };

    const pathCommandsToShape = (commands: PathCommand[], origin: Vector2 = [0, 0]): [Shape, Vector2] => {
        const shape = new Shape;
        shape.closed = false;

        const vertices: Vector2[] = [];
        const inTangents: Vector2[] = [];
        const outTangents: Vector2[] = [];

        for (const command of commands) {
            switch (command.command) {
                // MoveTo
                case 'M':
                    for (const p of command.params) {
                        vertices.push([...p]);
                        inTangents.push([0, 0]);
                        outTangents.push([0, 0]);
                    }
                    break;
                case 'm':
                    for (const p of command.params) {
                        if (vertices.length) {
                            vertices.push(V2.add(p, A.last(vertices)));
                        } else {
                            vertices.push(V2.add(p, origin));
                        }
                        inTangents.push([0, 0]);
                        outTangents.push([0, 0]);
                    }
                    break;
                // LineTo
                case 'L':
                    for (const p of command.params) {
                        vertices.push([...p]);
                        inTangents.push([0, 0]);
                        outTangents.push([0, 0]);
                    }
                    break;
                case 'l':
                    for (const p of command.params) {
                        vertices.push(V2.add(p, A.last(vertices)));
                        inTangents.push([0, 0]);
                        outTangents.push([0, 0]);
                    }
                    break;
                case 'H':
                    for (const p of command.params) {
                        vertices.push([p, A.last(vertices)[1]]);
                        inTangents.push([0, 0]);
                        outTangents.push([0, 0]);
                    }
                    break;
                case 'h':
                    for (const p of command.params) {
                        vertices.push(V2.add(A.last(vertices), [p, 0]));
                        inTangents.push([0, 0]);
                        outTangents.push([0, 0]);
                    }
                    break;
                case 'V':
                    for (const p of command.params) {
                        vertices.push([A.last(vertices)[0], p]);
                        inTangents.push([0, 0]);
                        outTangents.push([0, 0]);
                    }
                    break;
                case 'v':
                    for (const p of command.params) {
                        vertices.push(V2.add(A.last(vertices), [0, p]));
                        inTangents.push([0, 0]);
                        outTangents.push([0, 0]);
                    }
                    break;
                // 2D Bezier (ref: https://nowokay.hatenablog.com/entry/20070623/1182556929)
                case 'Q':
                    for (const ps of command.params) {
                        const prevP = A.last(vertices);
                        const c = [ps[0], ps[1]] satisfies Vector2;
                        const pn = [ps[2], ps[3]] satisfies Vector2;
                        const c1 = V2.mult(V2.sub(c, prevP), 2 / 3);
                        const c2 = V2.mult(V2.sub(c, pn), 2 / 3);
                        vertices.push(pn);
                        inTangents.push(c2);
                        outTangents[outTangents.length - 1] = c1;
                        outTangents.push([0, 0]);
                    }
                    break;
                case 'q':
                    for (const ps of command.params) {
                        const prevP = A.last(vertices);
                        const c = V2.add(prevP, [ps[0], ps[1]]);
                        const pn = V2.add(prevP, [ps[2], ps[3]]);
                        const c1 = V2.mult(V2.sub(c, prevP), 2 / 3);
                        const c2 = V2.mult(V2.sub(c, pn), 2 / 3);
                        vertices.push(pn);
                        inTangents.push(c2);
                        outTangents[outTangents.length - 1] = c1;
                        outTangents.push([0, 0]);
                    }
                    break;
                case 'T':
                    for (const p of command.params) {
                        const prevP = A.last(vertices);
                        const pn = [...p] satisfies Vector2;
                        const c = V2.add(V2.mult(A.last(inTangents), -3 / 2), prevP);
                        const c1 = V2.mult(V2.sub(c, prevP), 2 / 3);
                        const c2 = V2.mult(V2.sub(c, pn), 2 / 3);
                        vertices.push(pn);
                        inTangents.push(c2);
                        outTangents[outTangents.length - 1] = c1;
                        outTangents.push([0, 0]);
                    }
                    break;
                case 't':
                    for (const p of command.params) {
                        const prevP = A.last(vertices);
                        const pn = V2.add(p, prevP);
                        const c = V2.add(V2.mult(A.last(inTangents), -3 / 2), prevP);
                        const c1 = V2.mult(V2.sub(c, prevP), 2 / 3);
                        const c2 = V2.mult(V2.sub(c, pn), 2 / 3);
                        vertices.push(pn);
                        inTangents.push(c2);
                        outTangents[outTangents.length - 1] = c1;
                        outTangents.push([0, 0]);
                    }
                    break;
                // 3D Bezier
                case 'C':
                    for (const p of command.params) {
                        const prevP = A.last(vertices);
                        const c1 = V2.sub([p[0], p[1]], prevP);
                        const pn = [p[4], p[5]] satisfies Vector2;
                        const c2 = V2.sub([p[2], p[3]], pn);
                        vertices.push(pn);
                        inTangents.push(c2);
                        outTangents[outTangents.length - 1] = c1;
                        outTangents.push([0, 0]);
                    }
                    break;
                case 'c':
                    for (const p of command.params) {
                        const prevP = A.last(vertices);
                        const c1 = [p[0], p[1]] satisfies Vector2;
                        const pn = V2.add(prevP, [p[4], p[5]]);
                        const c2 = V2.sub(V2.add(prevP, [p[2], p[3]]), pn);
                        vertices.push(pn);
                        inTangents.push(c2);
                        outTangents[outTangents.length - 1] = c1;
                        outTangents.push([0, 0]);
                    }
                    break;
                case 'S':
                    for (const p of command.params) {
                        const prevP = A.last(vertices);
                        const c1 = V2.mult(A.last(inTangents), -1);
                        const pn = [p[2], p[3]] satisfies Vector2;
                        const c2 = V2.sub([p[0], p[1]], pn);
                        vertices.push(pn);
                        inTangents.push(c2);
                        outTangents[outTangents.length - 1] = c1;
                        outTangents.push([0, 0]);
                    }
                    break;
                case 's':
                    for (const p of command.params) {
                        const prevP = A.last(vertices);
                        const c1 = V2.mult(A.last(inTangents), -1);
                        const pn = V2.add(prevP, [p[2], p[3]]);
                        const c2 = V2.sub(V2.add(prevP, [p[0], p[1]]), pn);
                        vertices.push(pn);
                        inTangents.push(c2);
                        outTangents[outTangents.length - 1] = c1;
                        outTangents.push([0, 0]);
                    }
                    break;
                // Elliptical Arc (ref: https://mortoray.com/rendering-an-svg-elliptical-arc-as-bezier-curves/, https://stackoverflow.com/questions/43946153/approximating-svg-elliptical-arc-in-canvas-with-javascript)
                case 'A':
                    for (const [rx, ry, phi, fa, fs, x2, y2] of command.params) {
                        const [x1, y1] = A.last(vertices);
                        const cps = ellipticalArcToBezier(rx, ry, M.degreeToRadian(phi), fa, fs, x1, y1, x2, y2);
                        for (let i = 0; i < cps.length; i++) {
                            const cp = cps[i];
                            const prevP = cp.en1;
                            const pn = cp.en2;
                            const c1 = V2.sub(cp.c1, prevP);
                            const c2 = V2.sub(cp.c2, pn);
                            vertices.push(pn);
                            inTangents.push(c2);
                            outTangents[outTangents.length - 1] = c1;
                            outTangents.push([0, 0]);
                        }
                    }
                    break;
                case 'a':
                    for (const [rx, ry, phi, fa, fs, dx, dy] of command.params) {
                        const [x1, y1] = A.last(vertices);
                        const [x2, y2] = [x1 + dx, y1 + dy];
                        const cps = ellipticalArcToBezier(rx, ry, M.degreeToRadian(phi), fa, fs, x1, y1, x2, y2);
                        for (let i = 0; i < cps.length; i++) {
                            const cp = cps[i];
                            const prevP = cp.en1;
                            const pn = cp.en2;
                            const c1 = V2.sub(cp.c1, prevP);
                            const c2 = V2.sub(cp.c2, pn);
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

    const rectToPathCommands = (rect: Rect): PathCommand[] => {
        const commands: PathCommand[] = [];
        // https://www.w3.org/TR/SVG11/shapes.html#RectElement
        const x = rect.x === void 0 ? 0 : rect.x;
        const y = rect.y === void 0 ? 0 : rect.y;
        const width = rect.width;
        if (typeof width !== 'number' || width < 0) {
            return commands;
        }
        const height = rect.height;
        if (typeof height !== 'number' || height < 0) {
            return commands;
        }
        let rx = 0;
        let ry = 0;
        if (rect.rx === void 0 && rect.ry === void 0) {
            // pass
        } else if (rect.rx !== void 0) {
            rx = ry = rect.rx;
        } else if (rect.ry !== void 0) {
            rx = ry = rect.ry;
        } else {
            rx = rect.rx;
            ry = rect.ry;
        }
        if (rx < 0 || ry < 0) {
            return commands;
        }
        rx = Math.min(rx, 0.5 * width);
        ry = Math.min(ry, 0.5 * height);
        if (rx === 0 && ry === 0) {
            commands.push(
                { command: 'M', params: [[x, y]] },
                { command: 'h', params: [width] },
                { command: 'v', params: [height] },
                { command: 'h', params: [-width] },
                { command: 'Z' },
            );
        } else {
            commands.push(
                { command: 'M', params: [[x + rx, y]] },
                { command: 'H', params: [x + width - rx] },
                { command: 'A', params: [[rx, ry, 0, 0, 1, x + width, y + ry]] },
                { command: 'V', params: [y + height - ry] },
                { command: 'A', params: [[rx, ry, 0, 0, 1, x + width - rx, y + height]] },
                { command: 'H', params: [x + rx] },
                { command: 'A', params: [[rx, ry, 0, 0, 1, x, y + height - ry]] },
                { command: 'V', params: [y + ry] },
                { command: 'A', params: [[rx, ry, 0, 0, 1, x + rx, y]] },
                { command: 'Z' },
            );
        }
        return commands;
    };

    const circleToPathCommands = (circle: Circle): PathCommand[] => {
        const commands: PathCommand[] = [];
        const cx = typeof circle.cx === 'number' ? circle.cx : 0;
        const cy = typeof circle.cy === 'number' ? circle.cy : 0;
        const r = typeof circle.r === 'number' ? circle.r : 0;
        if (r > 0) {
            const handle_r = 4 * r * (Math.SQRT2 - 1) / 3;
            commands.push({ command: 'M', params: [[cx + r, cy]] });
            commands.push({ command: 'C', params: [[cx + r, cy + handle_r, cx + handle_r, cy + r, cx, cy + r]] });
            commands.push({ command: 'C', params: [[cx - handle_r, cy + r, cx - r, cy + handle_r, cx - r, cy]] });
            commands.push({ command: 'C', params: [[cx - r, cy - handle_r, cx - handle_r, cy - r, cx, cy - r]] });
            commands.push({ command: 'C', params: [[cx + handle_r, cy - r, cx + r, cy - handle_r, cx + r, cy]] });
            commands.push({ command: 'Z' });
        }
        return commands;
    };

    const ellipseToPathCommands = (ellipse: Ellipse): PathCommand[] => {
        const commands: PathCommand[] = [];
        const cx = typeof ellipse.cx === 'number' ? ellipse.cx : 0;
        const cy = typeof ellipse.cy === 'number' ? ellipse.cy : 0;
        const rx = typeof ellipse.rx === 'number' ? ellipse.rx : 0;
        const ry = typeof ellipse.ry === 'number' ? ellipse.ry : 0;
        if (rx > 0 && ry > 0) {
            const handle_rx = 4 * rx * (Math.SQRT2 - 1) / 3;
            const handle_ry = 4 * ry * (Math.SQRT2 - 1) / 3;
            commands.push({ command: 'M', params: [[cx + rx, cy]] });
            commands.push({ command: 'C', params: [[cx + rx, cy + handle_ry, cx + handle_rx, cy + ry, cx, cy + ry]] });
            commands.push({ command: 'C', params: [[cx - handle_rx, cy + ry, cx - rx, cy + handle_ry, cx - rx, cy]] });
            commands.push({ command: 'C', params: [[cx - rx, cy - handle_ry, cx - handle_rx, cy - ry, cx, cy - ry]] });
            commands.push({ command: 'C', params: [[cx + handle_rx, cy - ry, cx + rx, cy - handle_ry, cx + rx, cy]] });
            commands.push({ command: 'Z' });
        }
        return commands;
    };

    const lineToPathCommands = (line: Line): PathCommand[] => {
        const commands: PathCommand[] = [];
        const x1 = typeof line.x1 === 'number' ? line.x1 : 0;
        const y1 = typeof line.y1 === 'number' ? line.y1 : 0;
        const x2 = typeof line.x2 === 'number' ? line.x2 : 0;
        const y2 = typeof line.y2 === 'number' ? line.y2 : 0;
        commands.push({ command: 'M', params: [[x1, y1], [x2, y2]] });
        return commands;
    };

    const pointsToPathCommands = (points: Vector2[], closed: boolean): PathCommand[] => {
        const commands: PathCommand[] = [];
        if (!(isArray(points) && points.length)) {
            return commands;
        }
        commands.push({ command: 'M', params: points });
        if (closed) {
            commands.push({ command: 'Z' });
        }
        return commands;
    };

    const polylineToPathCommands = (polyline: Polyline): PathCommand[] => {
        return pointsToPathCommands(polyline.points, false);
    };

    const polygonToPathCommands = (polygon: Polygon): PathCommand[] => {
        return pointsToPathCommands(polygon.points, true);
    };

    const stopsToValue = (stops: GradientStop[]): Atarabi.Property.GradientValue => {
        const value = { alphaStops: [], colorStops: [] } as Atarabi.Property.GradientValue;
        for (const {offset, color} of stops) {
            value.alphaStops.push({ location: offset, opacity: color[3] });
            value.colorStops.push({ location: offset, color: color.slice(0, 3) as Atarabi.Color });
        }
        return value;
    };

    const applyGradient = (group: GradientFillGroup | GradientStrokeGroup, gradient: Gradient) => {
        if (gradient.type === 'linear') {
            group.type(GradientType.Linear).startPoint([gradient.x1, gradient.y1]).endPoint([gradient.x2, gradient.y2]);
        } else {
            group.type(GradientType.Radial).startPoint([gradient.cx, gradient.cy]).endPoint([gradient.cx + gradient.r, gradient.cy]);
            const dx = gradient.fx - gradient.cx;
            const dy = gradient.fy - gradient.cy;
            const rr = Math.sqrt(dx * dx + dy * dy);
            if (rr > 0) {
                const length = Math.min(1, rr / Math.max(1e-6, gradient.r)) * 100;
                const degree = Math.atan2(dy, dx) * (180.0 / Math.PI);
                group.highlightLength(length);
                group.highlightAngle(degree);
            }
        }
        group.colors(stopsToValue(gradient.stops));
    };

    const applyStyle = (group: ShapeGroup, style: Style, ctx: SVGContext) => {
        if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse') {
            group.property().enabled = false;
        }
        if (!(style.fill === 'none' || style.fill === 'transparent')) {
            let fill: FillGroup | GradientFillGroup = null;
            if (typeof style.fill === 'string') {
                let m = trim(style.fill).match(/^url\(#(.+)\)$/);
                if (m) {
                    const id = m[1];
                    const gradient = ctx.inquireGradient(id);
                    if (gradient) {
                        if (gradient.stops.length < 2) {
                            fill = group.addFill();
                            const color: Atarabi.Color = gradient.stops.length ? gradient.stops[0].color.slice(0, 3) as Atarabi.Color : [0, 0, 0];
                            const opacity = gradient.stops.length && gradient.stops[0].color.length === 4 ? gradient.stops[0].color[3] : 1;
                            fill.color(color).opacity(100 * opacity);
                        } else {
                            fill = group.addGradientFill(id);
                            applyGradient(fill, gradient);
                        }
                    }
                }
            }
            if (!fill) {
                fill = group.addFill();
                const color: Atarabi.Color = isArray(style.fill) ? style.fill.slice(0, 3) as Atarabi.Color : [0, 0, 0];
                let opacity = isArray(style.fill) && style.fill.length === 4 ? style.fill[3] : 1;
                if (typeof style['fill-opacity'] === 'number') {
                    opacity *= style['fill-opacity'];
                }
                fill.color(color).opacity(100 * opacity);
            }
            if (typeof style['fill-rule'] === 'string') {
                fill.fillRule(fillRuleToValue(style['fill-rule']));
            }
        }
        if (!(style.stroke === void 0 || style.stroke === 'none' || style.stroke === 'transparent')) {
            let stroke: StrokeGroup | GradientStrokeGroup = null;
            if (typeof style.stroke === 'string') {
                let m = trim(style.stroke).match(/^url\(#(.+)\)$/);
                if (m) {
                    const id = m[1];
                    const gradient = ctx.inquireGradient(id);
                    if (gradient) {
                        if (gradient.stops.length < 2) {
                            stroke = group.addStroke();
                            const color: Atarabi.Color = gradient.stops.length ? gradient.stops[0].color.slice(0, 3) as Atarabi.Color : [0, 0, 0];
                            const opacity = gradient.stops.length && gradient.stops[0].color.length === 4 ? gradient.stops[0].color[3] : 1;
                            stroke.color(color).opacity(100 * opacity);
                        } else {
                            stroke = group.addGradientStroke(id);
                            applyGradient(stroke, gradient);
                        }
                    }
                }
            }
            if (!stroke) {
                stroke = group.addStroke();
                const color: Atarabi.Color = isArray(style.stroke) ? style.stroke.slice(0, 3) as Atarabi.Color : [0, 0, 0];
                let opacity = isArray(style.stroke) && style.stroke.length === 4 ? style.stroke[3] : 1;
                if (typeof style['stroke-opacity'] === 'number') {
                    opacity *= style['stroke-opacity'];
                }
                stroke.color(color).opacity(100 * opacity)
            }
            const strokeWidth = typeof style['stroke-width'] === 'number' ? style['stroke-width'] : 1;
            stroke.strokeWidth(strokeWidth);
            if (typeof style['stroke-linecap'] === 'string') {
                stroke.lineCap(strokeLineCapToValue(style['stroke-linecap']));
            }
            let miter = true;
            if (typeof style['stroke-linejoin'] === 'string') {
                const join = strokeLineJoinToValue(style['stroke-linejoin']);
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

    const transformToMat3x3 = (transform: Transform) => {
        switch (transform.type) {
            case 'matrix':
                return Mat3x3.mat(...transform.mat);
            case 'translate':
                return Mat3x3.translate(transform.tx, typeof transform.ty === 'number' ? transform.ty : 0);
            case 'scale':
                return Mat3x3.scale(transform.sx, typeof transform.sy === 'number' ? transform.sy : transform.sx);
            case 'rotate':
                if (typeof transform.cx === 'number') {
                    return Mat3x3.translate(transform.cx, transform.cy).mult(Mat3x3.rotate(transform.angle)).mult(Mat3x3.translate(-transform.cx, -transform.cy));
                } else {
                    return Mat3x3.rotate(transform.angle);
                }
            case 'skewX':
                return Mat3x3.skewX(transform.angle);
            case 'skewY':
                return Mat3x3.skewY(transform.angle);
        }
    };

    const applyTransformByMatrix = (group: ShapeGroup, m: Mat3x3) => {
        const trans = m.decompose();
        group.transform().position().setValue(trans.translation);
        group.transform().scale().setValue([100 * trans.scale[0], 100 * trans.scale[1]]);
        if (trans.skew[0] !== 0) {
            group.transform().skew().setValue(M.radianToDegree(-trans.skew[0]));
        } else if (trans.skew[1] !== 0) {
            group.transform().skew().setValue(M.radianToDegree(trans.skew[1]));
            group.transform().skewAxis().setValue(90);
        }
        group.transform().rotation().setValue(M.radianToDegree(trans.rotation));
    };

    const applyTransform = (group: ShapeGroup, transforms: Transform[]) => {
        if (!isArray(transforms) || !transforms.length) {
            return;
        }

        // fast return
        if (transforms.length === 1) {
            const transform = transforms[0];
            if (transform.type === 'translate') {
                const tx = transform.tx;
                const ty = typeof transform.ty === 'number' ? transform.ty : 0;
                group.transform().position().setValue([tx, ty]);
                return;
            } else if (transform.type === 'scale') {
                const sx = transform.sx;
                const sy = typeof transform.sy === 'number' ? transform.sy : sx;
                group.transform().scale().setValue([100 * sx, 100 * sy]);
                return;
            } else if (transform.type === 'rotate') {
                const angle = transform.angle;
                if (transform.cx === void 0) {
                    group.transform().rotation().setValue(angle);
                } else {
                    const cx = transform.cx;
                    const cy = transform.cy;
                    group.transform().anchorPoint().setValue([cx, cy]);
                    group.transform().position().setValue([cx, cy]);
                    group.transform().rotation().setValue(angle);
                }
                return;
            } else if (transform.type === 'skewX') {
                const angle = transform.angle;
                group.transform().skew().setValue(-angle);
                return;
            } else if (transform.type === 'skewY') {
                const angle = transform.angle;
                group.transform().skew().setValue(angle);
                group.transform().skewAxis().setValue(90);
                return;
            }
        }

        // matrix
        let m = Mat3x3.identity();
        for (const transform of transforms) {
            m = m.mult(transformToMat3x3(transform));
        }
        applyTransformByMatrix(group, m);
    };

    const bakeSVG = (svg: SVG, shapeLayer: ShapeLayer) => {
        const root = new ShapeGroup(shapeLayer, shapeLayer as any as PropertyGroup).addGroup(getElementName(svg));
        const viewBox = svg.viewBox;
        root.transform().anchorPoint().setValue([viewBox[0], viewBox[1]]);
        const queue: { element: Element; group: ShapeGroup; }[] = [{ element: svg, group: root }];
        while (queue.length) {
            const { element, group } = queue.shift();
            if (isArray(element._children)) {
                for (const child of element._children) {
                    const style = child._style = mergeStyle(svg._ctx.inquireStyle(element), element._style, svg._ctx.inquireStyle(child), child._style);
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
                                const childGroup = group.addGroup(getElementName(child));
                                queue.push({ element: child, group: childGroup });
                                applyTransform(childGroup, child.transform);
                            }
                            break;
                        case 'path':
                            {
                                const pathGroup = group.addGroup(getElementName(child));
                                if (child.d) {
                                    let origin: Vector2 = [0, 0];
                                    for (const pathCommands of child.d) {
                                        const path = pathGroup.addPath();
                                        const [shape, newOrigin] = pathCommandsToShape(pathCommands, origin);
                                        path.path(shape);
                                        origin = newOrigin;
                                    }
                                }
                                applyStyle(pathGroup, style, svg._ctx);
                                applyTransform(pathGroup, child.transform);
                            }
                            break;
                        case 'rect':
                            {
                                const rectGroup = group.addGroup(getElementName(child));
                                const commands = rectToPathCommands(child);
                                if (commands.length) {
                                    const [shape,] = pathCommandsToShape(commands);
                                    const path = rectGroup.addPath();
                                    path.path(shape);
                                } else {
                                    rectGroup.property().name += ': Error';
                                }
                                applyStyle(rectGroup, style, svg._ctx);
                                applyTransform(rectGroup, child.transform);
                            }
                            break;
                        case 'circle':
                            {
                                const circleGroup = group.addGroup(getElementName(child));
                                const cx = typeof child.cx === 'number' ? child.cx : 0;
                                const cy = typeof child.cy === 'number' ? child.cy : 0;
                                const r = typeof child.r === 'number' ? child.r : 0;
                                if (r > 0) {
                                    const ellipse = circleGroup.addEllipse();
                                    ellipse.position([cx, cy]);
                                    ellipse.size([2 * r, 2 * r])
                                }
                                applyStyle(circleGroup, style, svg._ctx);
                                applyTransform(circleGroup, child.transform);
                            }
                            break;
                        case 'ellipse':
                            {
                                const ellipseGroup = group.addGroup(getElementName(child));
                                const cx = typeof child.cx === 'number' ? child.cx : 0;
                                const cy = typeof child.cy === 'number' ? child.cy : 0;
                                const rx = typeof child.rx === 'number' ? child.rx : 0;
                                const ry = typeof child.ry === 'number' ? child.ry : 0;
                                if (rx > 0 && ry > 0) {
                                    const ellipse = ellipseGroup.addEllipse();
                                    ellipse.position([cx, cy]);
                                    ellipse.size([2 * rx, 2 * ry])
                                }
                                applyStyle(ellipseGroup, style, svg._ctx);
                                applyTransform(ellipseGroup, child.transform);
                            }
                            break;
                        case 'line':
                            {
                                const lineGroup = group.addGroup(getElementName(child));
                                const commands = lineToPathCommands(child);
                                const [shape,] = pathCommandsToShape(commands);
                                const path = lineGroup.addPath();
                                path.path(shape);
                                applyStyle(lineGroup, style, svg._ctx);
                                applyTransform(lineGroup, child.transform);
                            }
                            break;
                        case 'polyline':
                            {
                                const polylineGroup = group.addGroup(getElementName(child));
                                const commands = polylineToPathCommands(child);
                                if (commands.length) {
                                    const [shape,] = pathCommandsToShape(commands);
                                    const path = polylineGroup.addPath();
                                    path.path(shape);
                                }
                                applyStyle(polylineGroup, style, svg._ctx);
                                applyTransform(polylineGroup, child.transform);
                            }
                            break;
                        case 'polygon':
                            {
                                const polygonGroup = group.addGroup(getElementName(child));
                                const commands = polygonToPathCommands(child);
                                if (commands.length) {
                                    const [shape,] = pathCommandsToShape(commands);
                                    const path = polygonGroup.addPath();
                                    path.path(shape);
                                }
                                applyStyle(polygonGroup, style, svg._ctx);
                                applyTransform(polygonGroup, child.transform);
                            }
                            break;
                    }
                }
            }
        }
    }

    const xlmToShapeLayer = (svgXML: XML, layerName: string, shapeLayer?: ShapeLayer): ShapeLayer => {
        const svg = traverseSVG(svgXML);
        if (!svg) {
            throw new Error('unable to parse as svg');
        }

        let layer: ShapeLayer = null;
        if (shapeLayer instanceof ShapeLayer) {
            layer = shapeLayer;
        } else {
            const comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) {
                throw new Error('activate a comp')
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
    const svgToShapeLayer = (fileOrText: File | string, shapeLayer?: ShapeLayer): ShapeLayer => {
        if (fileOrText instanceof File) {
            const svgXML = fileToXML(fileOrText);
            return xlmToShapeLayer(svgXML, fileOrText.displayName, shapeLayer);
        } else if (typeof fileOrText === 'string') {
            const svgXML = textToXML(fileOrText);
            return xlmToShapeLayer(svgXML, 'SVG from text', shapeLayer);
        }
        throw new Error('argument must be File or string');
    };

    interface ContextState {
        commandsGroup: PathCommand[][];
        currentCommands: PathCommand[];
        transform: Mat3x3;
        style: Partial<Atarabi.SVG.Style>;
    }

    class Context implements Atarabi.SVG.Context {
        private _layer: AVLayer = null;
        private _commandsGroup: PathCommand[][] = [];
        private _currentCommands: PathCommand[] = [];
        private _transform: Mat3x3 = null;
        private _style: Partial<Atarabi.SVG.Style> = {};
        private _states: ContextState[] = [];
        constructor(layer?: AVLayer) {
            this._layer = layer;
        }
        private push() {
            if (this._currentCommands.length) {
                this._commandsGroup.push(this._currentCommands);
                this._currentCommands = [];
            }
        }
        private checkEmpty() {
            if (!this._currentCommands.length) {
                throw new Error(`moveto isn't called yet`);
            }
        }
        // set layer
        layer(layer: AVLayer): this {
            this._layer = layer;
            return this;
        }
        // clear path
        clearPath(): this {
            this._commandsGroup = [];
            this._currentCommands = [];
            return this;
        }
        MoveTo(X: number, Y: number): this {
            this.push();
            this._currentCommands.push({ command: 'M', params: [[X, Y]] });
            return this;
        }
        M(X: number, Y: number): this {
            return this.MoveTo(X, Y);
        }
        moveTo(x: number, y: number): this {
            this.push();
            this._currentCommands.push({ command: 'm', params: [[x, y]] });
            return this;
        }
        m(x: number, y: number): this {
            return this.moveTo(x, y);
        }
        // lineto
        LineTo(X: number, Y: number): this {
            this.checkEmpty();
            this._currentCommands.push({ command: 'L', params: [[X, Y]] });
            return this;
        }
        L(X: number, Y: number): this {
            return this.LineTo(X, Y);
        }
        lineTo(x: number, y: number): this {
            this.checkEmpty();
            this._currentCommands.push({ command: 'l', params: [[x, y]] });
            return this;
        }
        l(x: number, y: number): this {
            return this.lineTo(x, y);
        }
        HorizontalLineTo(X: number): this {
            this.checkEmpty();
            this._currentCommands.push({ command: 'H', params: [X] });
            return this;
        }
        H(X: number): this {
            return this.HorizontalLineTo(X);
        }
        horizontalLineTo(x: number): this {
            this.checkEmpty();
            this._currentCommands.push({ command: 'h', params: [x] });
            return this;
        }
        h(x: number): this {
            return this.horizontalLineTo(x);
        }
        VerticalLineTo(Y: number): this {
            this.checkEmpty();
            this._currentCommands.push({ command: 'V', params: [Y] });
            return this;
        }
        V(Y: number): this {
            return this.VerticalLineTo(Y);
        }
        verticalLineTo(y: number): this {
            this.checkEmpty();
            this._currentCommands.push({ command: 'v', params: [y] });
            return this;
        }
        v(y: number): this {
            return this.verticalLineTo(y);
        }
        // curveto
        CuverTo(X1: number, Y1: number, X2: number, Y2: number, X: number, Y: number): this {
            this.checkEmpty();
            this._currentCommands.push({ command: 'C', params: [[X1, Y1, X2, Y2, X, Y]] });
            return this;
        }
        C(X1: number, Y1: number, X2: number, Y2: number, X: number, Y: number): this {
            return this.CuverTo(X1, Y1, X2, Y2, X, Y);
        }
        cuverTo(x1: number, y1: number, x2: number, y2: number, x: number, y: number): this {
            this.checkEmpty();
            this._currentCommands.push({ command: 'c', params: [[x1, y1, x2, y2, x, y]] });
            return this;
        }
        c(x1: number, y1: number, x2: number, y2: number, x: number, y: number): this {
            return this.cuverTo(x1, y1, x2, y2, x, y);
        }
        SmoothCuverTo(X2: number, Y2: number, X: number, Y: number): this {
            this.checkEmpty();
            this._currentCommands.push({ command: 'S', params: [[X2, Y2, X, Y]] });
            return this;
        }
        S(X2: number, Y2: number, X: number, Y: number): this {
            return this.SmoothCuverTo(X2, Y2, X, Y);
        }
        smoothCuverTo(x2: number, y2: number, x: number, y: number): this {
            this.checkEmpty();
            this._currentCommands.push({ command: 's', params: [[x2, y2, x, y]] });
            return this;
        }
        s(x2: number, y2: number, x: number, y: number): this {
            return this.smoothCuverTo(x2, y2, x, y);
        }
        // quadratic curveto
        QuadraticCurveTo(X1: number, Y1: number, X: number, Y: number): this {
            this.checkEmpty();
            this._currentCommands.push({ command: 'Q', params: [[X1, Y1, X, Y]] });
            return this;
        }
        Q(X1: number, Y1: number, X: number, Y: number): this {
            return this.QuadraticCurveTo(X1, Y1, X, Y);
        }
        quadraticCurveTo(x1: number, y1: number, x: number, y: number): this {
            this.checkEmpty();
            this._currentCommands.push({ command: 'q', params: [[x1, y1, x, y]] });
            return this;
        }
        q(x1: number, y1: number, x: number, y: number): this {
            return this.quadraticCurveTo(x1, y1, x, y);
        }
        SmoothQuadraticCurveTo(X: number, Y: number): this {
            this.checkEmpty();
            this._currentCommands.push({ command: 'T', params: [[X, Y]] });
            return this;
        }
        T(X: number, Y: number): this {
            return this.SmoothQuadraticCurveTo(X, Y);
        }
        smoothQuadraticCurveTo(x: number, y: number): this {
            this.checkEmpty();
            this._currentCommands.push({ command: 't', params: [[x, y]] });
            return this;
        }
        t(x: number, y: number): this {
            return this.smoothQuadraticCurveTo(x, y);
        }
        // elliptical arc
        EllipticalArc(rx: number, ry: number, axisDegree: number, largeArcFlag: 0 | 1, sweepFlag: 0 | 1, X: number, Y: number): this {
            this.checkEmpty();
            this._currentCommands.push({ command: 'A', params: [[rx, ry, axisDegree, largeArcFlag, sweepFlag, X, Y]] });
            return this;
        }
        A(rx: number, ry: number, axisDegree: number, largeArcFlag: 0 | 1, sweepFlag: 0 | 1, X: number, Y: number): this {
            return this.EllipticalArc(rx, ry, axisDegree, largeArcFlag, sweepFlag, X, Y);
        }
        ellipticalArc(rx: number, ry: number, axisDegree: number, largeArcFlag: 0 | 1, sweepFlag: 0 | 1, x: number, y: number): this {
            this.checkEmpty();
            this._currentCommands.push({ command: 'a', params: [[rx, ry, axisDegree, largeArcFlag, sweepFlag, x, y]] });
            return this;
        }
        a(rx: number, ry: number, axisDegree: number, largeArcFlag: 0 | 1, sweepFlag: 0 | 1, x: number, y: number): this {
            return this.ellipticalArc(rx, ry, axisDegree, largeArcFlag, sweepFlag, x, y);
        }
        // closepath
        closePath(): this {
            this.checkEmpty();
            this._currentCommands.push({ command: 'Z' });
            return this;
        }
        Z(): this {
            return this.closePath();
        }
        z(): this {
            return this.closePath();
        }
        /**
         * Basic Shapes
         */
        rect(x: number, y: number, width: number, height: number, rx: number, ry: number): this {
            this.push();
            this._currentCommands = rectToPathCommands({
                _tag: 'rect',
                x,
                y,
                width,
                height,
                rx,
                ry,
            });
            this.push();
            return this;
        }
        circle(cx: number, cy: number, r: number): this {
            this.push();
            this._currentCommands = circleToPathCommands({
                _tag: 'circle',
                cx,
                cy,
                r,
            });
            this.push();
            return this;
        }
        ellipse(cx: number, cy: number, rx: number, ry: number): this {
            this.push();
            this._currentCommands = ellipseToPathCommands({
                _tag: 'ellipse',
                cx,
                cy,
                rx,
                ry,
            });
            this.push();
            return this;
        }
        line(x1: number, y1: number, x2: number, y2: number): this {
            this.push();
            this._currentCommands = lineToPathCommands({
                _tag: 'line',
                x1,
                y1,
                x2,
                y2,
            });
            this.push();
            return this;
        }
        polyline(points: [number, number][]): this {
            this.push();
            this._currentCommands = polylineToPathCommands({
                _tag: 'polyline',
                points,
            });
            this.push();
            return this;
        }
        polygon(points: [number, number][]): this {
            this.push();
            this._currentCommands = polygonToPathCommands({
                _tag: 'polygon',
                points,
            });
            this.push();
            return this;
        }
        /**
         * Transform
         */
        private updateTransform(m: Mat3x3) {
            if (!this._transform) {
                this._transform = Mat3x3.identity();
            }
            this._transform = this._transform.mult(m);
        }
        clearTransform(): this {
            this._transform = null;
            return this;
        }
        matrix(a: number, b: number, c: number, d: number, e: number, f: number): this {
            this.updateTransform(transformToMat3x3({ type: 'matrix', mat: [a, b, c, d, e, f] }));
            return this;
        }
        translate(tx: number, ty: number): this {
            this.updateTransform(transformToMat3x3({ type: 'translate', tx, ty }));
            return this;
        }
        scale(sx: number, sy: number): this {
            this.updateTransform(transformToMat3x3({ type: 'scale', sx, sy }));
            return this;
        }
        rotate(degree: number, cx?: number, cy?: number): this {
            this.updateTransform(transformToMat3x3({ type: 'rotate', angle: degree, cx, cy }));
            return this;
        }
        skewX(degree: number): this {
            this.updateTransform(transformToMat3x3({ type: 'skewX', angle: degree }));
            return this;
        }
        skewY(degree: number): this {
            this.updateTransform(transformToMat3x3({ type: 'skewY', angle: degree }));
            return this;
        }
        /**
         * Style
         */
        private updateStyle(style: Partial<Atarabi.SVG.Style>) {
            this._style = { ...this._style, ...style };
        }
        clearStyle(): this {
            this._style = {};
            return this;
        }
        style(style: Partial<Atarabi.SVG.Style>): this {
            this.updateStyle(style);
            return this;
        }
        fill(color: Atarabi.SVG.Style['fill']): this {
            this.updateStyle({ fill: color });
            return this;
        }
        fillOpacity(opacity: Atarabi.SVG.Style['fillOpacity']): this {
            this.updateStyle({ fillOpacity: opacity });
            return this;
        }
        fillRule(rule: Atarabi.SVG.Style['fillRule']): this {
            this.updateStyle({ fillRule: rule });
            return this;
        }
        stroke(color: Atarabi.SVG.Style['stroke']): this {
            this.updateStyle({ stroke: color });
            return this;
        }
        strokeOpacity(opacity: Atarabi.SVG.Style['strokeOpacity']): this {
            this.updateStyle({ strokeOpacity: opacity });
            return this;
        }
        strokeWidth(width: Atarabi.SVG.Style['strokeWidth']): this {
            this.updateStyle({ strokeWidth: width });
            return this;
        }
        strokeLineCap(cap: Atarabi.SVG.Style['strokeLineCap']): this {
            this.updateStyle({ strokeLineCap: cap });
            return this;
        }
        strokeLineJoin(join: Atarabi.SVG.Style['strokeLineJoin']): this {
            this.updateStyle({ strokeLineJoin: join });
            return this;
        }
        strokeMiterLimit(limit: Atarabi.SVG.Style['strokeMiterLimit']): this {
            this.updateStyle({ strokeMiterLimit: limit });
            return this;
        }
        strokeDashArray(array: Atarabi.SVG.Style['strokeDashArray']): this {
            this.updateStyle({ strokeDashArray: array });
            return this;
        }
        strokeDashOffset(offset: Atarabi.SVG.Style['strokeDashOffset']): this {
            this.updateStyle({ strokeDashOffset: offset });
            return this;
        }
        /**
         * State
         */
        save(): this {
            const state: ContextState = {
                commandsGroup: Atarabi.JSON.parse(Atarabi.JSON.stringify(this._commandsGroup)),
                currentCommands: Atarabi.JSON.parse(Atarabi.JSON.stringify(this._currentCommands)),
                transform: this._transform ? this._transform.clone() : null,
                style: { ...this._style },
            };
            this._states.push(state);
            return this;
        }
        restore(): this {
            if (this._states.length) {
                const state = this._states.pop();
                this._commandsGroup = state.commandsGroup;
                this._currentCommands = state.currentCommands;
                this._transform = state.transform;
                this._style = state.style;
            }
            return this;
        }
        reset(): this {
            this._commandsGroup = [];
            this._currentCommands = [];
            this._transform = null;
            this._style = {};
            this._states = [];
            return this;
        }
        /**
         * Bake
         */
        shape(): this {
            if (!this._layer) {
                throw new Error(`layer isn't given`);
            }
            if (!isValid(this._layer)) {
                throw new Error(`layer is invalid`);
            }
            if (!(this._layer instanceof ShapeLayer)) {
                throw new Error(`layer isn't shape layer`);
            }
            const layer = this._layer;
            const shapes = this.toShape(false);
            const group = new ShapeGroup(layer, layer as any as PropertyGroup).addGroup();
            for (const shape of shapes) {
                group.addPath().path(shape);
            }
            const style = this._style;
            // fill
            if (isArray(style.fill)) {
                const fill = group.addFill();
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
                const stroke = group.addStroke();
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
                let miter = true;
                if (typeof style.strokeLineJoin === 'string') {
                    const join = strokeLineJoinToValue(style.strokeLineJoin);
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
            const m = this._transform;
            if (m) {
                applyTransformByMatrix(group, m);
            }
            return this;
        }
        mask(): this {
            if (!this._layer) {
                throw new Error(`layer isn't given`);
            }
            if (!isValid(this._layer)) {
                throw new Error(`layer is invalid`);
            }
            if (!isAVLayer(this._layer)) {
                throw new Error(`layer isn't AV layer`);
            }
            const layer = this._layer;
            const shapes = this.toShape(true);
            for (const shape of shapes) {
                const mask = layer.mask.addProperty('ADBE Mask Atom');
                (mask('ADBE Mask Shape') as Property).setValue(shape);
            }
            return this;
        }
        /**
         * Output
         */
        toShape(transform?: boolean): Shape[] {
            const shapes: Shape[] = [];
            let origin: Vector2 = [0, 0];
            for (const commands of this._commandsGroup) {
                const [shape, newOrigin] = pathCommandsToShape(commands, origin);
                shapes.push(shape);
                origin = newOrigin;
            }
            if (this._currentCommands.length) {
                const [shape,] = pathCommandsToShape(this._currentCommands);
                shapes.push(shape);
            }
            if (transform === void 0 || (typeof transform === 'boolean' && transform)) {
                if (this._transform) {
                    const m = this._transform;
                    for (const shape of shapes) {
                        const newVertices: Vector2[] = [];
                        const newInTangents: Vector2[] = [];
                        const newOutTangents: Vector2[] = [];
                        for (let i = 0, l = shape.vertices.length; i < l; i++) {
                            const vertex = shape.vertices[i];
                            const inTangent = V2.add(shape.inTangents[i], vertex);
                            const outTangent = V2.add(shape.outTangents[i], vertex);
                            const newVertex = m.mult(vertex);
                            const newInTangent = m.mult(inTangent);
                            const newOutTangent = m.mult(outTangent);
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
        }
    }

    const getContext = (layer?: AVLayer) => {
        return new Context(layer);
    };

    $.global.Atarabi = $.global.Atarabi || {};
    var Atarabi: Atarabi = $.global.Atarabi; Atarabi.SVG = (Atarabi.SVG || {}) as any;

    Atarabi.SVG.svgToShapeLayer = svgToShapeLayer;

    Atarabi.SVG.getContext = getContext;

    if (Atarabi.API) {
        Atarabi.API.add(SCRIPT_NAME, 'svgToShapeLayer', svgToShapeLayer);
        Atarabi.API.add(SCRIPT_NAME, 'getContext', getContext);
    }

    /**
     * Entry Point
     */
    const main = (file: File) => {
        const svgXML = fileToXML(file);
        const svg = traverseSVG(svgXML);
        if (!svg) {
            return;
        }

        const fileName = file.displayName;
        const comp = app.project.activeItem instanceof CompItem ? app.project.activeItem : app.project.items.addComp(fileName, Math.ceil(svg.viewBox[2]), Math.ceil(svg.viewBox[3]), 1, 10, 30);

        try {
            app.beginUndoGroup(`@svg: ${fileName}`);
            const shapeLayer = comp.layers.addShape();
            shapeLayer.name = fileName;
            shapeLayer.transform.anchorPoint.setValue([0.5 * svg.viewBox[2], 0.5 * svg.viewBox[3]]);
            shapeLayer.transform.position.setValue([0.5 * comp.width, 0.5 * comp.height]);
            bakeSVG(svg, shapeLayer);
        } catch (e) {
            alert(e);
        } finally {
            app.endUndoGroup();
        }
    }

    Atarabi.register.importFlavor('svg', info => {
        const file = new File(info.path);
        main(file);
    });

})();
