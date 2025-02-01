declare namespace Atarabi {

    interface API {
        // added in @hook_solid
        invoke<F extends API.AtHookSolid.addSolid>(name: '@hook_solid', method: 'addSolid', args: Parameters<F>, fallback?: (...args: Parameters<F>) => ReturnType<F>): ReturnType<F>;
        // added in @hook_null
        invoke<F extends API.AtHookNull.addNull>(name: '@hook_null', method: 'addNull', args: Parameters<F>, fallback?: (...args: Parameters<F>) => ReturnType<F>): ReturnType<F>;
        // added in @svg
        invoke<F extends API.AtSvg.svgToShapeLayer>(name: '@svg', method: 'svgToShapeLayer', args: Parameters<F>, fallback?: (...args: Parameters<F>) => ReturnType<F>): ReturnType<F>;
        invoke<F extends API.AtSvg.getContext>(name: '@svg', method: 'getContext', args: Parameters<F>, fallback?: (...args: Parameters<F>) => ReturnType<F>): ReturnType<F>;
    }

    namespace API {
        namespace AtHookSolid {
            type addSolid = (comp: CompItem, width: number, height: number, color?: Atarabi.Color) => AVLayer;
        }
        namespace AtHookNull {
            type addNull = (comp: CompItem) => AVLayer;
        }
        namespace AtSvg {
            type svgToShapeLayer = (svgFileOrText: File | string, shapeLayer?: ShapeLayer) => ShapeLayer;

            type getContext = (layer?: AVLayer) => Context;

            // If the first letter is capitalized, absolute coordinates are used; otherwise, relative coordinates are used.
            interface Context {
                // set layer
                layer(layer: AVLayer): Context;
                /**
                 * Path
                 */
                clearPath(): Context;
                // moveto
                MoveTo(X: number, Y: number): Context;
                M(X: number, Y: number): Context;
                moveTo(x: number, y: number): Context;
                m(x: number, y: number): Context;
                // lineto
                LineTo(X: number, Y: number): Context;
                L(X: number, Y: number): Context;
                lineTo(x: number, y: number): Context;
                l(x: number, y: number): Context;
                HorizontalLineTo(X: number): Context;
                H(X: number): Context;
                horizontalLineTo(x: number): Context;
                h(x: number): Context;
                VerticalLineTo(Y: number): Context;
                V(Y: number): Context;
                verticalLineTo(y: number): Context;
                v(y: number): Context;
                // curveto
                CuverTo(X1: number, Y1: number, X2: number, Y2: number, X: number, Y: number): Context;
                C(X1: number, Y1: number, X2: number, Y2: number, X: number, Y: number): Context;
                cuverTo(x1: number, y1: number, x2: number, y2: number, x: number, y: number): Context;
                c(x1: number, y1: number, x2: number, y2: number, x: number, y: number): Context;
                SmoothCuverTo(X2: number, Y2: number, X: number, Y: number): Context;
                S(X2: number, Y2: number, X: number, Y: number): Context;
                smoothCuverTo(x2: number, y2: number, x: number, y: number): Context;
                s(x2: number, y2: number, x: number, y: number): Context;
                // quadratic curveto
                QuadraticCurveTo(X1: number, Y1: number, X: number, Y: number): Context;
                Q(X1: number, Y1: number, X: number, Y: number): Context;
                quadraticCurveTo(x1: number, y1: number, x: number, y: number): Context;
                q(x1: number, y1: number, x: number, y: number): Context;
                SmoothQuadraticCurveTo(X: number, Y: number): Context;
                T(X: number, Y: number): Context;
                smoothQuadraticCurveTo(x: number, y: number): Context;
                t(x: number, y: number): Context;
                // elliptical arc
                EllipticalArc(rx: number, ry: number, axisDegree: number, largeArcFlag: 0 | 1, sweepFlag: 0 | 1, X: number, Y: number): Context;
                A(rx: number, ry: number, axisDegree: number, largeArcFlag: 0 | 1, sweepFlag: 0 | 1, X: number, Y: number): Context;
                ellipticalArc(rx: number, ry: number, axisDegree: number, largeArcFlag: 0 | 1, sweepFlag: 0 | 1, x: number, y: number): Context;
                a(rx: number, ry: number, axisDegree: number, largeArcFlag: 0 | 1, sweepFlag: 0 | 1, x: number, y: number): Context;
                // closepath
                closePath(): Context;
                Z(): Context;
                z(): Context;
                /**
                 * Basic Shapes
                 */
                rect(x: number, y: number, width: number, height: number, rx: number, ry: number): Context;
                circle(cx: number, cy: number, r: number): Context;
                ellipse(cx: number, cy: number, rx: number, ry: number): Context;
                line(x1: number, y1: number, x2: number, y2: number): Context;
                polyline(points: [number, number][]): Context;
                polygon(points: [number, number][]): Context;
                /**
                 * Transform
                 */
                clearTransform(): Context;
                matrix(a: number, b: number, c: number, d: number, e: number, f: number): Context;
                translate(tx: number, ty: number): Context;
                scale(sx: number, sy: number): Context;
                rotate(degree: number, cx?: number, cy?: number): Context;
                skewX(degree: number): Context;
                skewY(degree: number): Context;
                /**
                 * Style
                 */
                clearStyle(): Context;
                style(style: Partial<Style>): Context;
                fill(color: Style['fill']): Context;
                fillOpacity(opacity: Style['fillOpacity']): Context;
                fillRule(rule: Style['fillRule']): Context;
                stroke(color: Style['stroke']): Context;
                strokeOpacity(opacity: Style['strokeOpacity']): Context;
                strokeWidth(width: Style['strokeWidth']): Context;
                strokeLineCap(cap: Style['strokeLineCap']): Context;
                strokeLineJoin(join: Style['strokeLineJoin']): Context;
                strokeMiterLimit(limit: Style['strokeMiterLimit']): Context;
                strokeDashArray(array: Style['strokeDashArray']): Context;
                strokeDashOffset(offset: Style['strokeDashOffset']): Context;
                /**
                 * State
                 */
                save(): Context;
                restore(): Context;
                reset(): Context;
                /**
                 * Bake
                 */
                shape(): Context; // for shape layer
                mask(): Context;
                /**
                 * Output
                 */
                toShape(transform?: boolean): Shape[]; // default: true
            }

            interface Style {
                fill: Color | 'none'; // r, g, b: [0, 1]
                fillOpacity: number; // [0, 1]
                fillRule: 'nonzero' | 'evenodd';
                stroke: Color | 'none'; // r, g, b: [0, 1]
                strokeOpacity: number; // [0, 1]
                strokeWidth: number;
                strokeLineCap: 'butt' | 'round' | 'square';
                strokeLineJoin: 'miter' | 'round' | 'bevel';
                strokeMiterLimit: number;
                strokeDashArray: number[] | 'none';
                strokeDashOffset: number;
            }
        }
    }

    // for convenience
    interface API {
        add<F extends API.AtHookSolid.addSolid>(name: '@hook_solid', method: 'addSolid', fn: F): boolean;
        isAdded(name: '@hook_solid', method: 'addSolid'): boolean;
        add<F extends API.AtHookNull.addNull>(name: '@hook_null', method: 'addNull', fn: F): boolean;
        isAdded(name: '@hook_null', method: 'addNull'): boolean;
        add<F extends API.AtSvg.svgToShapeLayer>(name: '@svg', method: 'svgToShapeLayer', fn: F): boolean;
        isAdded(name: '@svg', method: 'svgToShapeLayer'): boolean;
        add<F extends API.AtSvg.getContext>(name: '@svg', method: 'getContext', fn: F): boolean;
        isAdded(name: '@svg', method: 'getContext'): boolean;
    }

}