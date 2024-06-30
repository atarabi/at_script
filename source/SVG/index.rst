===============
SVG
===============

.. note::
    @svg(Startup script) is required

**@svg.jsx** 内でSVGの読み込みに関する処理を実装している（ただし、useタグなど未実装のものや、グラデーションなど実装自体が困難なものがあるので、完全には再現されない）。
また、 拡張子が **.svg**　のファイルに対して `Register.importFlavor() <../Register/index.html#register-importflavor>`_ を用いて読み込めるようにしてあるので、ドラッグ&ドロップで容易にsvgファイルをシェイプレイヤーに変換することが出来る。

SVG.svgToShapeLayer()
-----------------------------------

``svgToShapeLayer(svgFile: File, shapeLayer?: ShapeLayer): ShapeLayer;``

svgファイルを読み込み、シェイププレイヤーに変換する。shapeLayerを与えればそのシェイプレイヤー下に、与えなければ、アクティブなコンポに新たにシェイプレイヤーを作り、その下に構築する。

.. versionadded:: 0.4.0

SVG.getContext()
-----------------------------------

``getContext(layer?: AVLayer): SVG.Context;``

htmlにおけるcanvasのgetContext()よろしく、SVGのコマンドを用いてシェイプやマスクのパスを構築できる。 `@script.svg.d.ts <https://github.com/atarabi/at_script/blob/main/script/types/%40script.svg.d.ts>`_ や `Paths – SVG 1.1 (Second Edition) <https://www.w3.org/TR/SVG11/paths.html>`_ 参照のこと。

.. tabs::

    .. code-tab:: TypeScript

        (() => {

            const comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) {
                return;
            }

            const layer = comp.layers.addSolid([1, 1, 1], 'Solid', comp.width, comp.height, 1, comp.duration);
            const ctx = Atarabi.SVG.getContext(layer);
            ctx.style({ stroke: [1, 0, 0], strokeWidth: 10 }); // スタイルの設定（マスクの場合は当然反映されない）
            // 適当にコマンドを入力していく、大文字から始まるコマンドは絶対座標、小文字から始まるコマンドは相対座標
            ctx.M(0, 0); // MoveTo
            ctx.Q(300, 400, 500, 100); // QuadraticCurveTo
            for (let i = 0; i < 100; i++) {
                ctx.t(generateRandomNumber() * 200 - 100, generateRandomNumber() * 200 - 100); // smoothQuadraticCurveTo
            }
            ctx.shape(); // シェイプを生成、 ctx.mask(); にするとマスクを生成する

        })();

    .. code-tab:: JavaScript

        // SVG.getContext
        (function () {
            var comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) {
                return;
            }
            var layer = comp.layers.addSolid([1, 1, 1], 'Solid', comp.width, comp.height, 1, comp.duration);
            var ctx = Atarabi.SVG.getContext(layer);
            ctx.style({ stroke: [1, 0, 0], strokeWidth: 10 }); // スタイルの設定（マスクの場合は当然反映されない）
            // 適当にコマンドを入力していく、大文字から始まるコマンドは絶対座標、小文字から始まるコマンドは相対座標
            ctx.M(0, 0); // MoveTo
            ctx.Q(300, 400, 500, 100); // QuadraticCurveTo
            for (var i = 0; i < 100; i++) {
                ctx.t(generateRandomNumber() * 200 - 100, generateRandomNumber() * 200 - 100); // smoothQuadraticCurveTo
            }
            ctx.shape(); // シェイプを生成、 ctx.mask(); にするとマスクを生成する
        })();


.. versionadded:: 0.4.0