====
UI
====

UI.showContextMenu()
--------------------

``showContextMenu(items: { text: string; checked?: boolean; }[]): number;``

コンテクストメニューを表示する。選択した項目のindexの値が返ってくる。選択されなければ-1。

.. code-block:: typescript

    const items = [{text: 'AAA'}, {text:'BBB'}, {text:'CCC'}];
    const index = Atarabi.UI.showContextMenu(items);

UI.progress()
--------------

``progress(title: string, total: number, fn: ProgressFunc): void;``

PF_CreateNewAppProgressDialog(CC2014.1で追加されている)を用いて、プログレスバーを表示する。

参照: `PF_CreateNewAppProgressDialog <https://ae-plugins.docsforadobe.dev/intro/whats-new.html?highlight=PF_CreateNewAppProgressDialog#what-s-new-in-cc-2014-1-13-1>`_
参照: `PF_CreateNewAppProgressDialog - how to use it? <https://community.adobe.com/t5/after-effects-discussions/pf-createnewappprogressdialog-how-to-use-it/td-p/7987142>`_

.. code-block:: typescript

    // コンポを大量に作る。
    (() => {

        try {
            app.beginUndoGroup('Make Numerous Comps')
            Atarabi.UI.progress('Progress Example', 500, ctx => {
                const comp = app.project.items.addComp(`Comp ${ctx.index + 1}`, 100, 100, 1, 10, 30);
            });
        } catch (e) {
            // pass
        } finally {
            app.endUndoGroup();
        }

    })();
