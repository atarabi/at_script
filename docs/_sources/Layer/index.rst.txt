============
Layer
============

Layer.getActiveLayer()
-------------------------

``getActiveLayer(): Layer | null;``

タイムラインが表示されているコンポの中で選択されているレイヤーを返す。

参照: `AEGP_GetActiveLayer <https://ae-plugins.docsforadobe.dev/aegps/aegp-suites.html?highlight=AEGP_GetActiveLayer#aegp-layersuite9>`_

.. tabs::

    .. code-tab:: TypeScript

        const layer = Atarabi.layer.getActiveLayer();

    .. code-tab:: JavaScript

        var layer = Atarabi.layer.getActiveLayer();
	
Layer.getID()
----------------

``getID(layer: Layer): number;``

レイヤーのIDを取得する。スクリプトでもCC2022からサポートされた。

参照: `Layer.id <https://ae-scripting.docsforadobe.dev/layers/layer.html#layer-id>`_

.. tabs::

    .. code-tab:: TypeScript

        const layer = Atarabi.layer.getActiveLayer();
        if (layer) {
            alert(Atarabi.layer.getID(layer));
        }

    .. code-tab:: JavaScript

        var layer = Atarabi.layer.getActiveLayer();
        if (layer) {
            alert(Atarabi.layer.getID(layer));
        }

Layer.getBounds()
-------------------

``getBounds(layer: AVLayer, options?: { time?: number }): Rect;``

不透明の範囲を取得する。クロップしたいときに用いる。

.. tabs::

    .. code-tab:: TypeScript

        const layer = Atarabi.layer.getActiveLayer();
        const isAVLayer = (layer: Layer): layer is AVLayer => {
            return layer instanceof TextLayer || layer instanceof ShapeLayer || layer instanceof AVLayer;
        };
        if (layer && isAVLayer(layer)) {
            const bounds = Atarabi.layer.getBounds(layer);
        }

    .. code-tab:: JavaScript
        
        var layer = Atarabi.layer.getActiveLayer();
        var isAVLayer = function (layer) {
            return layer instanceof TextLayer || layer instanceof ShapeLayer || layer instanceof AVLayer;
        };
        if (layer && isAVLayer(layer)) {
            var bounds = Atarabi.layer.getBounds(layer);
        }

Layer.getMaskBounds()
-----------------------

``getMaskBounds(layer: AVLayer, options?: { time?: number; }): Rect;``

マスクによって囲まれた範囲を取得する。

参照: `AEGP_GetLayerMaskedBounds <https://ae-plugins.docsforadobe.dev/aegps/aegp-suites.html?highlight=AEGP_GetLayerMaskedBounds#aegp-layersuite9>`_

.. tabs::

    .. code-tab:: TypeScript

        const layer = Atarabi.layer.getActiveLayer();
        const isAVLayer = (layer: Layer): layer is AVLayer => {
            return layer instanceof TextLayer || layer instanceof ShapeLayer || layer instanceof AVLayer;
        };
        if (layer && isAVLayer(layer)) {
            const bounds = Atarabi.layer.getMaskBounds(layer);
        }

    .. code-tab:: JavaScript
	
        var layer = Atarabi.layer.getActiveLayer();
        var isAVLayer = function (layer) {
            return layer instanceof TextLayer || layer instanceof ShapeLayer || layer instanceof AVLayer;
        };
        if (layer && isAVLayer(layer)) {
            var bounds = Atarabi.layer.getMaskBounds(layer);
        }

Layer.getMoments()
-----------------------

``getMoments(layer: AVLayer, options?: { time?: number; binary?: boolean; }): Moments;``

画像モーメントを取得する。

参照: `cv::moments <https://docs.opencv.org/4.8.0/d3/dc0/group__imgproc__shape.html#ga556a180f43cab22649c23ada36a8a139>`_

.. tabs::

    .. code-tab:: TypeScript

        const layer = Atarabi.layer.getActiveLayer();
        const isAVLayer = (layer: Layer): layer is AVLayer => {
            return layer instanceof TextLayer || layer instanceof ShapeLayer || layer instanceof AVLayer;
        };
        if (layer && isAVLayer(layer)) {
            const moments = Atarabi.layer.getMoments(layer);
        }

    .. code-tab:: JavaScript
	
        var layer = Atarabi.layer.getActiveLayer();
        var isAVLayer = function (layer) {
            return layer instanceof TextLayer || layer instanceof ShapeLayer || layer instanceof AVLayer;
        };
        if (layer && isAVLayer(layer)) {
            var moments = Atarabi.layer.getMoments(layer);
        }

Layer.saveFrameToPng()
------------------------

``saveFrameToPng(layer: AVLayer, file: File, options?: { time?: number; downsample?: number; }): void;``

レイヤーの画をpngで保存する。

.. tabs::

    .. code-tab:: TypeScript

        const layer = Atarabi.layer.getActiveLayer();
        const isAVLayer = (layer: Layer): layer is AVLayer => {
            return layer instanceof TextLayer || layer instanceof ShapeLayer || layer instanceof AVLayer;
        };
        if (layer && isAVLayer(layer)) {
            const file = new File(`${Folder.desktop.absoluteURI}/${layer.name}_${Date.now()}.png`);
            Atarabi.layer.saveFrameToPng(layer, file);
        }

    .. code-tab:: JavaScript
	
        var layer = Atarabi.layer.getActiveLayer();
        var isAVLayer = function (layer) {
            return layer instanceof TextLayer || layer instanceof ShapeLayer || layer instanceof AVLayer;
        };
        if (layer && isAVLayer(layer)) {
            var file = new File("".concat(Folder.desktop.absoluteURI, "/").concat(layer.name, "_").concat(Date.now(), ".png"));
            Atarabi.layer.saveFrameToPng(layer, file);
        }

Layer.saveFrameToJpg()
------------------------

``saveFrameToJpg(layer: AVLayer, file: File, options?: { time?: number; downsample?: number; quality?: number; }): void;``

レイヤーの画をjpegで保存する。

.. tabs::

    .. code-tab:: TypeScript

        const layer = Atarabi.layer.getActiveLayer();
        const isAVLayer = (layer: Layer): layer is AVLayer => {
            return layer instanceof TextLayer || layer instanceof ShapeLayer || layer instanceof AVLayer;
        };
        if (layer && isAVLayer(layer)) {
            const file = new File(`${Folder.desktop.absoluteURI}/${layer.name}_${Date.now()}.jpg`);
            Atarabi.layer.saveFrameToJpg(layer, file);
        }

    .. code-tab:: JavaScript

        var layer = Atarabi.layer.getActiveLayer();
        var isAVLayer = function (layer) {
            return layer instanceof TextLayer || layer instanceof ShapeLayer || layer instanceof AVLayer;
        };
        if (layer && isAVLayer(layer)) {
            var file = new File("".concat(Folder.desktop.absoluteURI, "/").concat(layer.name, "_").concat(Date.now(), ".jpg"));
            Atarabi.layer.saveFrameToJpg(layer, file);
        }

Layer.saveFrameToHdr()
------------------------

``saveFrameToHdr(layer: AVLayer, file: File, options?: { time?: number; downsample?: number; }): void;``

レイヤーの画をhdrで保存する。

.. tabs::

    .. code-tab:: TypeScript

        const layer = Atarabi.layer.getActiveLayer();
        const isAVLayer = (layer: Layer): layer is AVLayer => {
            return layer instanceof TextLayer || layer instanceof ShapeLayer || layer instanceof AVLayer;
        };
        if (layer && isAVLayer(layer)) {
            const file = new File(`${Folder.desktop.absoluteURI}/${layer.name}_${Date.now()}.hdr`);
            Atarabi.layer.saveFrameToHdr(layer, file);
        }

    .. code-tab:: JavaScript

        var layer = Atarabi.layer.getActiveLayer();
        var isAVLayer = function (layer) {
            return layer instanceof TextLayer || layer instanceof ShapeLayer || layer instanceof AVLayer;
        };
        if (layer && isAVLayer(layer)) {
            var file = new File("".concat(Folder.desktop.absoluteURI, "/").concat(layer.name, "_").concat(Date.now(), ".hdr"));
            Atarabi.layer.saveFrameToHdr(layer, file);
        }

Layer.saveFrameToClipboard()
------------------------------

``saveFrameToClipboard(layer: AVLayer, options?: { time?: number; downsample?: number; }): void;``

レイヤーの画をクリップボードに保存する。

.. tabs::

    .. code-tab:: TypeScript

        const layer = Atarabi.layer.getActiveLayer();
        const isAVLayer = (layer: Layer): layer is AVLayer => {
            return layer instanceof TextLayer || layer instanceof ShapeLayer || layer instanceof AVLayer;
        };
        if (layer && isAVLayer(layer)) {
            Atarabi.layer.saveFrameToClipboard(layer);
        }

    .. code-tab:: JavaScript
	
        var layer = Atarabi.layer.getActiveLayer();
        var isAVLayer = function (layer) {
            return layer instanceof TextLayer || layer instanceof ShapeLayer || layer instanceof AVLayer;
        };
        if (layer && isAVLayer(layer)) {
            Atarabi.layer.saveFrameToClipboard(layer);
        }
    
Layer.saveFramesToGif()
------------------------------

``saveFramesToGif(layer: AVLayer, startTime: number, endTime: number, file: File, options?: { downsample?: number; skip?: number; speed?: number; }): void;``

レイヤーのある範囲の画をアニメーションgifとして保存する。

.. tabs::

    .. code-tab:: TypeScript

        const layer = Atarabi.layer.getActiveLayer();
        const isAVLayer = (layer: Layer): layer is AVLayer => {
            return layer instanceof TextLayer || layer instanceof ShapeLayer || layer instanceof AVLayer;
        };
        if (layer && isAVLayer(layer)) {
            const comp = layer.containingComp;
            const file = new File(`${Folder.desktop.absoluteURI}/${layer.name}_${Date.now()}.gif`);
            Atarabi.layer.saveFramesToGif(layer, comp.workAreaStart, comp.workAreaStart + comp.workAreaDuration, file);
        }

    .. code-tab:: JavaScript
	
        var layer = Atarabi.layer.getActiveLayer();
        var isAVLayer = function (layer) {
            return layer instanceof TextLayer || layer instanceof ShapeLayer || layer instanceof AVLayer;
        };
        if (layer && isAVLayer(layer)) {
            var comp = layer.containingComp;
            var file = new File("".concat(Folder.desktop.absoluteURI, "/").concat(layer.name, "_").concat(Date.now(), ".gif"));
            Atarabi.layer.saveFramesToGif(layer, comp.workAreaStart, comp.workAreaStart + comp.workAreaDuration, file);
        }

Layer.saveFramesToApng()
------------------------------

``saveFramesToApng(layer: AVLayer, startTime: number, endTime: number, file: File, options?: { downsample?: number; skip?: number; speed?: number; }): void;``

レイヤーのある範囲の画をアニメーションpngとして保存する。

.. tabs::

    .. code-tab:: TypeScript

        const layer = Atarabi.layer.getActiveLayer();
        const isAVLayer = (layer: Layer): layer is AVLayer => {
            return layer instanceof TextLayer || layer instanceof ShapeLayer || layer instanceof AVLayer;
        };
        if (layer && isAVLayer(layer)) {
            const comp = layer.containingComp;
            const file = new File(`${Folder.desktop.absoluteURI}/${layer.name}_${Date.now()}.png`);
            Atarabi.layer.saveFramesToApng(layer, comp.workAreaStart, comp.workAreaStart + comp.workAreaDuration, file);
        }

    .. code-tab:: JavaScript

        var layer = Atarabi.layer.getActiveLayer();
        var isAVLayer = function (layer) {
            return layer instanceof TextLayer || layer instanceof ShapeLayer || layer instanceof AVLayer;
        };
        if (layer && isAVLayer(layer)) {
            var comp = layer.containingComp;
            var file = new File("".concat(Folder.desktop.absoluteURI, "/").concat(layer.name, "_").concat(Date.now(), ".png"));
            Atarabi.layer.saveFramesToApng(layer, comp.workAreaStart, comp.workAreaStart + comp.workAreaDuration, file);
        }

Layer.sampleImage()
------------------------------

``sampleImage(layer: AVLayer, points: readonly Readonly<Vector2>[], options?: { time?: number; }): ColorA[];``

レイヤーのピクセルの値を取得する。

.. tabs::

    .. code-tab:: TypeScript

        const layer = Atarabi.layer.getActiveLayer();
        const isAVLayer = (layer: Layer): layer is AVLayer => {
            return layer instanceof TextLayer || layer instanceof ShapeLayer || layer instanceof AVLayer;
        };
        if (layer && isAVLayer(layer)) {
            const { width, height } = layer;
            const pixels = Atarabi.layer.sampleImage(layer, [[0, 0], [0.5 * width, 0.5 * height], [width - 1, height - 1]]);
        }

    .. code-tab:: JavaScript

        var layer = Atarabi.layer.getActiveLayer();
        var isAVLayer = function (layer) {
            return layer instanceof TextLayer || layer instanceof ShapeLayer || layer instanceof AVLayer;
        };
        if (layer && isAVLayer(layer)) {
            var width = layer.width, height = layer.height;
            var pixels = Atarabi.layer.sampleImage(layer, [[0, 0], [0.5 * width, 0.5 * height], [width - 1, height - 1]]);
        }