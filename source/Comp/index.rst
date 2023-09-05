====
Comp
====

Comp.getMostRecentlyUsedComp()
------------------------------

``getMostRecentlyUsedComp(): CompItem | null;``

コンポの中で、直近にタイムラインを開いていたものを取得する。

参照: `AEGP_GetMostRecentlyUsedComp <https://ae-plugins.docsforadobe.dev/aegps/aegp-suites.html?highlight=AEGP_GetMostRecentlyUsedComp#aegp-compsuite11>`_

.. code-block:: typescript

    const comp = Atarabi.comp.getMostRecentlyUsedComp();

Comp.getShowLayerNameOrSourceName()
------------------------------------

``getShowLayerNameOrSourceName(comp: CompItem): boolean;``

あるコンポのタイムラインタブでレイヤー名が表示されているかソース名が表示されているかを調べる。

参照: `AEGP_GetShowLayerNameOrSourceName <https://ae-plugins.docsforadobe.dev/aegps/aegp-suites.html?highlight=AEGP_GetShowLayerNameOrSourceName#aegp-compsuite11>`_

.. code-block:: typescript

    const comp = Atarabi.comp.getMostRecentlyUsedComp();
    if (comp) {
        const showLayerName = Atarabi.comp.getShowLayerNameOrSourceName(comp);
    }

Comp.setShowLayerNameOrSourceName()
------------------------------------

あるコンポのタイムラインタブでレイヤー名を表示させるかソース名を表示させるか決める。

``setShowLayerNameOrSourceName(comp: CompItem, set: boolean): void;``

参照: `AEGP_SetShowLayerNameOrSourceName <https://ae-plugins.docsforadobe.dev/aegps/aegp-suites.html?highlight=AEGP_SetShowLayerNameOrSourceName#aegp-compsuite11>`_

.. code-block:: typescript

    const comp = Atarabi.comp.getMostRecentlyUsedComp();
    if (comp) {
        const showLayerName = Atarabi.comp.getShowLayerNameOrSourceName(comp);
        Atarabi.comp.setShowLayerNameOrSourceName(comp, !showLayerName);
    }

Comp.getShowBlendModes()
--------------------------

``getShowBlendModes(comp: CompItem): boolean;``

あるコンポのタイムラインタブでブレンドモードが表示されているかどうかを調べる。

参照: `AEGP_GetShowBlendModes <https://ae-plugins.docsforadobe.dev/aegps/aegp-suites.html?highlight=AEGP_GetShowBlendModes#aegp-compsuite11>`_

.. code-block:: typescript

    const comp = Atarabi.comp.getMostRecentlyUsedComp();
    if (comp) {
        const showBlendModes = Atarabi.comp.getShowBlendModes(comp);
    }

Comp.setShowBlendModes()
------------------------

あるコンポのタイムラインタブでブレンドモードを表示させるか決める。

``setShowBlendModes(comp: CompItem, set: boolean): void;``

参照: `AEGP_SetShowBlendModes <https://ae-plugins.docsforadobe.dev/aegps/aegp-suites.html?highlight=AEGP_SetShowBlendModes#aegp-compsuite11>`_

.. code-block:: typescript

    const comp = Atarabi.comp.getMostRecentlyUsedComp();
    if (comp) {
        const showBlendModes = Atarabi.comp.getShowBlendModes(comp);
        Atarabi.comp.setShowBlendModes(comp, !showBlendModes);
    }

Comp.renderFrame()
------------------------

``renderFrame(comp: CompItem, options?: { time?: number; downsample?: number; timestamp?: number }): { binary: string | null; timestamp: number; };``

コンポをレンダリングする。実行すると、pngのバイナリが文字列として、そしてタイムスタンプが返ってくる。時間とタイムスタンプによって、コンポが更新されたか検知しており、更新されていない場合は、バイナリとして **null** が返ってくる。

.. code-block:: typescript

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

Comp.saveFrameToPng()
------------------------

``saveFrameToPng(comp: CompItem, file: File, options?: { time?: number; downsample?: number; }): void;``

コンポの画をpngで保存する。

.. code-block:: typescript

    const comp = Atarabi.comp.getMostRecentlyUsedComp();
    if (comp) {
        const file = new File(`${Folder.desktop.absoluteURI}/${comp.name}_${Date.now()}.png`);
        Atarabi.comp.saveFrameToPng(comp, file);
    }

Comp.saveFrameToJpg()
------------------------

``saveFrameToJpg(comp: CompItem, file: File, options?: { time?: number; downsample?: number; quality?: number; }): void;``

.. code-block:: typescript

    const comp = Atarabi.comp.getMostRecentlyUsedComp();
    if (comp) {
        const file = new File(`${Folder.desktop.absoluteURI}/${comp.name}_${Date.now()}.jpg`);
        Atarabi.comp.saveFrameToJpg(comp, file);
    }

コンポの画をjpegで保存する。

Comp.saveFrameToHdr()
------------------------

``saveFrameToHdr(comp: CompItem, file: File, options?: { time?: number; downsample?: number; }): void;``

コンポの画をhdrで保存する。

.. code-block:: typescript

    const comp = Atarabi.comp.getMostRecentlyUsedComp();
    if (comp) {
        const file = new File(`${Folder.desktop.absoluteURI}/${comp.name}_${Date.now()}.hdr`);
        Atarabi.comp.saveFrameToHdr(comp, file);
    }

Comp.saveFrameToClipboard()
----------------------------

``saveFrameToClipboard(comp: CompItem, options?: { time?: number; downsample?: number; }): void;``

コンポの画をクリップボードに保存する。

.. code-block:: typescript

    const comp = Atarabi.comp.getMostRecentlyUsedComp();
    if (comp) {
        Atarabi.comp.saveFrameToClipboard(comp);
    }

Comp.saveFramesToGif()
------------------------

``saveFramesToGif(comp: CompItem, startTime: number, endTime: number, file: File, options?: { downsample?: number; skip?: number; speed?: number; }): void;``

コンポのある範囲の画をアニメーションgifとして保存する。

.. code-block:: typescript

    const comp = Atarabi.comp.getMostRecentlyUsedComp();
    if (comp) {
        const file = new File(`${Folder.desktop.absoluteURI}/${comp.name}_${Date.now()}.gif`);
        Atarabi.comp.saveFramesToGif(comp, comp.workAreaStart, comp.workAreaStart + comp.workAreaDuration, file);
    }

Comp.saveFramesToApng()
------------------------

``saveFramesToApng(comp: CompItem, startTime: number, endTime: number, file: File, options?: { downsample?: number; skip?: number; speed?: number; }): void;``

コンポのある範囲の画をアニメーションpngとして保存する。

.. code-block:: typescript

    const comp = Atarabi.comp.getMostRecentlyUsedComp();
    if (comp) {
        const file = new File(`${Folder.desktop.absoluteURI}/${comp.name}_${Date.now()}.png`);
        Atarabi.comp.saveFramesToApng(comp, comp.workAreaStart, comp.workAreaStart + comp.workAreaDuration, file);
    }