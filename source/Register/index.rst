===============
Register
===============

Register.insertCommand()
------------------------

``insertCommand(menu: Menu, order: Order, name: string, fn: CommandFunc, enabledWhen?: EnabledWhen): Uuid;``

新たなコマンドを作る。

参照: `AEGP_InsertMenuCommand <https://ae-plugins.docsforadobe.dev/aegps/aegp-suites.html?highlight=AEGP_InsertMenuCommand#aegp-commandsuite1>`_

.. code-block:: typescript

    (() => {
        Atarabi.register.insertCommand('Layer' /* Layerメニューに挿入する */, 'AtTop' /* 一番上に挿入する */, 'Set Null', () => {
            const comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) {
                return;
            }
            try {
                app.beginUndoGroup('Set Null');
                for (const layer of comp.selectedLayers) {
                    if (layer instanceof ShapeLayer || layer instanceof TextLayer || layer instanceof AVLayer) {
                        Atarabi.layer.setNull(layer, true);
                    }
                }
            } catch (e) {
                // pass
            } finally {
                app.endUndoGroup();
            }

        }, 'LayerSelected');
    })();

Register.hookCommand()
------------------------

``hookCommand(commandId: number, fn: HookCoomandFunc): Uuid;``

既存のコマンドをフックする。

参照: `AEGP_RegisterCommandHook <https://ae-plugins.docsforadobe.dev/aegps/aegp-suites.html?highlight=AEGP_RegisterCommandHook#aegp-registersuites5>`_

.. code-block:: typescript

    /* レイヤーを複製をした回数を数える */
    (() => {
        let counter = 0;
        Atarabi.register.hookCommand(2080 /* Duplicate */, ctx => {
            ctx.fallback = true; // デフォルトの処理にフォールバックする。
            // ctx.stopIteration = true; 同じコマンドに複数個フックしている場合に、後続の呼び出しを止める。
            counter++;
            $.writeln(`Duplicate: ${counter}`);
        });
    })();

Register.unhookCommand()
------------------------

``unhookCommand(commandId: number, uuid: Uuid): boolean;``

**Register.hookCommand()** で実行したフックを解除する。

.. code-block:: typescript

    (() => {
        const uuid = Atarabi.register.hookCommand(2080 /* Duplicate */, ctx => {
            // do nothing
        });
        Atarabi.register.unhookCommand(2080, uuid);
    })();


Register.importFlavor()
------------------------

``importFlavor(extension: string, fn: ImportFlavorFunc): void;``

拡張子を登録し、その拡張子のファイルを読み込むと、そのファイルの内容に基づいて、例えばコンポを構築するみたいなことが出来る機能がある。あまり使い道は思いつかない。AEにドラッグ・アンド・ドロップして実行できるのが利点か。

参照: `File Import Manager Suite <https://ae-plugins.docsforadobe.dev/aegps/aegp-suites.html?highlight=AEGP_FIMSuite3#aegp-fimsuite3>`_

適当にzjfという拡張子をもつ以下のような仕様を持つファイルを考える。

| width height framerate duration
| red green blue

一行目には生成するコンポジションの内容をスペース区切りで、二行目には敷く平面の色をスペース区切りで書く、という仕様となっている。

.. code-block:: text
    :caption: example.zjf

    1920 1080 30 10
    1 0 0

この場合、1920x1080のサイズの30fps、10secのコンポを作り、赤の平面を敷くという意味になる。

.. code-block:: typescript
    :caption: zjf_importer.tsx

    (() => {
        Atarabi.register.importFlavor('zjf', ({path}) => {
            const file = new File(path);
            file.encoding = 'utf-8';
            if (!file.open('r')) {
                return;
            }
            const body = file.read();
            file.close();
            const lines = body.split('\n');
            const compSpec = lines[0].split('\s');
            const width = parseInt(compSpec[0], 10);
            const height = parseInt(compSpec[1], 10);
            const frameRate = parseFloat(compSpec[2]);
            const duration = parseFloat(compSpec[3]);
            const solidSpec = lines[1].split('\s');
            const red = parseFloat(solidSpec[0]);
            const green = parseFloat(solidSpec[1]);
            const blue = parseFloat(solidSpec[2]);
        
            const comp = app.project.items.addComp(`${file.displayName}`, width, height, 1, duration, frameRate);
            const solid = comp.layers.addSolid([red, green, blue], 'Solid', width, height, 1);
        });
    })();
