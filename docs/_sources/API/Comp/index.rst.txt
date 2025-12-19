====
Comp
====

Comp.getMostRecentlyUsedComp()
------------------------------

``getMostRecentlyUsedComp(): CompItem | null;``

コンポの中で、直近にタイムラインを開いていたものを取得する。

参照: `AEGP_GetMostRecentlyUsedComp <https://ae-plugins.docsforadobe.dev/aegps/aegp-suites/?h=AEGP_GetMostRecentlyUsedComp#aegp_compsuite11>`_

.. tabs::

    .. code-tab:: TypeScript

        const comp = Atarabi.comp.getMostRecentlyUsedComp();

    .. code-tab:: JavaScript

        var comp = Atarabi.comp.getMostRecentlyUsedComp();
    
Comp.getShowLayerNameOrSourceName()
------------------------------------

``getShowLayerNameOrSourceName(comp: CompItem): boolean;``

あるコンポのタイムラインタブでレイヤー名が表示されているかソース名が表示されているかを調べる。

参照: `AEGP_GetShowLayerNameOrSourceName <https://ae-plugins.docsforadobe.dev/aegps/aegp-suites/?h=AEGP_GetShowLayerNameOrSourceName#aegp_compsuite11>`_

.. tabs::

    .. code-tab:: TypeScript

        const comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            const showLayerName = Atarabi.comp.getShowLayerNameOrSourceName(comp);
        }

    .. code-tab:: JavaScript

        var comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            var showLayerName = Atarabi.comp.getShowLayerNameOrSourceName(comp);
        }

Comp.setShowLayerNameOrSourceName()
------------------------------------

あるコンポのタイムラインタブでレイヤー名を表示させるかソース名を表示させるか決める。

``setShowLayerNameOrSourceName(comp: CompItem, set: boolean): void;``

参照: `AEGP_SetShowLayerNameOrSourceName <https://ae-plugins.docsforadobe.dev/aegps/aegp-suites/?h=AEGP_SetShowLayerNameOrSourceName#aegp_compsuite11>`_

.. tabs::

    .. code-tab:: TypeScript

        const comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            const showLayerName = Atarabi.comp.getShowLayerNameOrSourceName(comp);
            Atarabi.comp.setShowLayerNameOrSourceName(comp, !showLayerName);
        }

    .. code-tab:: JavaScript

        var comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            var showLayerName = Atarabi.comp.getShowLayerNameOrSourceName(comp);
            Atarabi.comp.setShowLayerNameOrSourceName(comp, !showLayerName);
        }
        
Comp.getShowBlendModes()
--------------------------

``getShowBlendModes(comp: CompItem): boolean;``

あるコンポのタイムラインタブでブレンドモードが表示されているかどうかを調べる。

参照: `AEGP_GetShowBlendModes <https://ae-plugins.docsforadobe.dev/aegps/aegp-suites/?h=AEGP_GetShowBlendModes#aegp_compsuite11>`_

.. tabs::

    .. code-tab:: TypeScript

        const comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            const showBlendModes = Atarabi.comp.getShowBlendModes(comp);
        }

    .. code-tab:: JavaScript

        var comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            var showBlendModes = Atarabi.comp.getShowBlendModes(comp);
        }

Comp.setShowBlendModes()
------------------------

あるコンポのタイムラインタブでブレンドモードを表示させるか決める。

``setShowBlendModes(comp: CompItem, set: boolean): void;``

参照: `AEGP_SetShowBlendModes <https://ae-plugins.docsforadobe.dev/aegps/aegp-suites/?h=AEGP_SetShowBlendModes#aegp_compsuite11>`_

.. tabs::

    .. code-tab:: TypeScript

        const comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            const showBlendModes = Atarabi.comp.getShowBlendModes(comp);
            Atarabi.comp.setShowBlendModes(comp, !showBlendModes);
        }

    .. code-tab:: JavaScript

        var comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            var showBlendModes = Atarabi.comp.getShowBlendModes(comp);
            Atarabi.comp.setShowBlendModes(comp, !showBlendModes);
        }

Comp.renderFrame()
------------------------

``renderFrame(comp: CompItem, options?: { time?: number; downsample?: number; timestamp?: number }): { binary: string | null; timestamp: number; };``

コンポをレンダリングする。実行すると、pngのバイナリが文字列として、そしてタイムスタンプが返ってくる。時間とタイムスタンプによって、コンポが更新されたか検知しており、更新されていない場合は、バイナリとして **null** が返ってくる。

.. tabs::

    .. code-tab:: TypeScript

        (() => {

            const timestampCache: { [id: number]: { [time: number]: number; } } = {};

            const getTimestamp = (comp: CompItem, time: number) => {
                let cache = timestampCache[comp.id];
                if (cache == null) {
                    cache = timestampCache[comp.id] = {};
                }
                let timestamp = cache[time];
                if (timestamp == null) {
                    return 0;
                }
                return timestamp;
            };

            const setTimestamp = (comp: CompItem, time: number, timestamp: number) => {
                let cache = timestampCache[comp.id];
                if (cache == null) {
                    cache = timestampCache[comp.id] = {};
                }
                cache[time] = timestamp;
            };

            const renderFrame = (): { comp: string; binary: string; timestamp: number; } | null => {
                const comp = app.project.activeItem;
                if (!(comp instanceof CompItem)) {
                    return null;
                }
                const oldTimestamp = getTimestamp(comp, comp.time);
                const { binary, timestamp } = Atarabi.comp.renderFrame(comp, { time: comp.time, downsample: 6, timestamp: oldTimestamp });
                if (!binary) {
                    return null;
                }
                setTimestamp(comp, comp.time, timestamp);
                return { comp: comp.name, binary, timestamp };
            };

            const build = () => {
                const win = new Window('palette', 'Render Frame Example', undefined, { resizeable: true });
                win.preferredSize = [600, 300];
                win.spacing = 1;
                win.margins = 1;

                const add = win.add('button', undefined, 'Add');
                add.alignment = ['fill', 'top'];
                add.onClick = () => {
                    const result = renderFrame();
                    if (!result) {
                        return;
                    }
                    const { comp, binary, timestamp } = result;
                    const group = win.add('group');
                    group.alignment = ['fill', 'top'];
                    group.alignChildren = ['fill', 'top'];
                    group.add('statictext', undefined, `${comp} (${timestamp})`);
                    group.add('image', undefined, binary);
                    win.layout.layout(true);
                };

                win.onResize = win.onResizing = () => {
                    win.layout.resize();
                };
                win.center();
                win.show();
            };

            build();

        })();

    .. code-tab:: JavaScript

        (function () {
            var timestampCache = {};
            var getTimestamp = function (comp, time) {
                var cache = timestampCache[comp.id];
                if (cache == null) {
                    cache = timestampCache[comp.id] = {};
                }
                var timestamp = cache[time];
                if (timestamp == null) {
                    return 0;
                }
                return timestamp;
            };
            var setTimestamp = function (comp, time, timestamp) {
                var cache = timestampCache[comp.id];
                if (cache == null) {
                    cache = timestampCache[comp.id] = {};
                }
                cache[time] = timestamp;
            };
            var renderFrame = function () {
                var comp = app.project.activeItem;
                if (!(comp instanceof CompItem)) {
                    return null;
                }
                var oldTimestamp = getTimestamp(comp, comp.time);
                var _a = Atarabi.comp.renderFrame(comp, { time: comp.time, downsample: 6, timestamp: oldTimestamp }), binary = _a.binary, timestamp = _a.timestamp;
                if (!binary) {
                    return null;
                }
                setTimestamp(comp, comp.time, timestamp);
                return { comp: comp.name, binary: binary, timestamp: timestamp };
            };
            var build = function () {
                var win = new Window('palette', 'Render Frame Example', undefined, { resizeable: true });
                win.preferredSize = [600, 300];
                win.spacing = 1;
                win.margins = 1;
                var add = win.add('button', undefined, 'Add');
                add.alignment = ['fill', 'top'];
                add.onClick = function () {
                    var result = renderFrame();
                    if (!result) {
                        return;
                    }
                    var comp = result.comp, binary = result.binary, timestamp = result.timestamp;
                    var group = win.add('group');
                    group.alignment = ['fill', 'top'];
                    group.alignChildren = ['fill', 'top'];
                    group.add('statictext', undefined, "".concat(comp, " (").concat(timestamp, ")"));
                    group.add('image', undefined, binary);
                    win.layout.layout(true);
                };
                win.onResize = win.onResizing = function () {
                    win.layout.resize();
                };
                win.center();
                win.show();
            };
            build();
        })();

Comp.saveFrameToPng()
------------------------

``saveFrameToPng(comp: CompItem, file: File, options?: { time?: number; downsample?: number; }): void;``

コンポの画をpngで保存する。

.. tabs::

    .. code-tab:: TypeScript

        const comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            const file = new File(`${Folder.desktop.absoluteURI}/${comp.name}_${Date.now()}.png`);
            Atarabi.comp.saveFrameToPng(comp, file);
        }

    .. code-tab:: JavaScript

        var comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            var file = new File("".concat(Folder.desktop.absoluteURI, "/").concat(comp.name, "_").concat(Date.now(), ".png"));
            Atarabi.comp.saveFrameToPng(comp, file);
        }

Comp.saveFrameToJpg()
------------------------

``saveFrameToJpg(comp: CompItem, file: File, options?: { time?: number; downsample?: number; quality?: number; }): void;``

.. tabs::

    .. code-tab:: TypeScript

        const comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            const file = new File(`${Folder.desktop.absoluteURI}/${comp.name}_${Date.now()}.jpg`);
            Atarabi.comp.saveFrameToJpg(comp, file);
        }

    .. code-tab:: JavaScript

        var comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            var file = new File("".concat(Folder.desktop.absoluteURI, "/").concat(comp.name, "_").concat(Date.now(), ".jpg"));
            Atarabi.comp.saveFrameToJpg(comp, file);
        }

コンポの画をjpegで保存する。

Comp.saveFrameToHdr()
------------------------

``saveFrameToHdr(comp: CompItem, file: File, options?: { time?: number; downsample?: number; }): void;``

コンポの画をhdrで保存する。

.. tabs::

    .. code-tab:: TypeScript

        const comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            const file = new File(`${Folder.desktop.absoluteURI}/${comp.name}_${Date.now()}.hdr`);
            Atarabi.comp.saveFrameToHdr(comp, file);
        }

    .. code-tab:: JavaScript

        var comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            var file = new File("".concat(Folder.desktop.absoluteURI, "/").concat(comp.name, "_").concat(Date.now(), ".hdr"));
            Atarabi.comp.saveFrameToHdr(comp, file);
        }

Comp.saveFrameToClipboard()
----------------------------

``saveFrameToClipboard(comp: CompItem, options?: { time?: number; downsample?: number; }): void;``

コンポの画をクリップボードに保存する。

.. tabs::

    .. code-tab:: TypeScript

        const comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            Atarabi.comp.saveFrameToClipboard(comp);
        }

    .. code-tab:: JavaScript

        var comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            Atarabi.comp.saveFrameToClipboard(comp);
        }

Comp.saveFramesToGif()
------------------------

``saveFramesToGif(comp: CompItem, startTime: number, endTime: number, file: File, options?: { downsample?: number; skip?: number; speed?: number; }): void;``

コンポのある範囲の画をアニメーションgifとして保存する。

.. tabs::

    .. code-tab:: TypeScript

        const comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            const file = new File(`${Folder.desktop.absoluteURI}/${comp.name}_${Date.now()}.gif`);
            Atarabi.comp.saveFramesToGif(comp, comp.workAreaStart, comp.workAreaStart + comp.workAreaDuration, file);
        }

    .. code-tab:: JavaScript

        var comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            var file = new File("".concat(Folder.desktop.absoluteURI, "/").concat(comp.name, "_").concat(Date.now(), ".gif"));
            Atarabi.comp.saveFramesToGif(comp, comp.workAreaStart, comp.workAreaStart + comp.workAreaDuration, file);
        }

Comp.saveFramesToApng()
------------------------

``saveFramesToApng(comp: CompItem, startTime: number, endTime: number, file: File, options?: { downsample?: number; skip?: number; speed?: number; }): void;``

コンポのある範囲の画をアニメーションpngとして保存する。

.. tabs::

    .. code-tab:: TypeScript

        const comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            const file = new File(`${Folder.desktop.absoluteURI}/${comp.name}_${Date.now()}.png`);
            Atarabi.comp.saveFramesToApng(comp, comp.workAreaStart, comp.workAreaStart + comp.workAreaDuration, file);
        }

    .. code-tab:: JavaScript

        var comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            var file = new File("".concat(Folder.desktop.absoluteURI, "/").concat(comp.name, "_").concat(Date.now(), ".png"));
            Atarabi.comp.saveFramesToApng(comp, comp.workAreaStart, comp.workAreaStart + comp.workAreaDuration, file);
        }