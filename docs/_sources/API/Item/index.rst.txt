==============
Item
==============

Item.getActiveItem()
----------------------

``getActiveItem(): Item | null;``

**app.project.activeItem** に同じ。なぜ入れたのか分からないので、将来的に取り除くやも。

参照: `AEGP_GetActiveItem <https://ae-plugins.docsforadobe.dev/aegps/aegp-suites/?h=AEGP_GetActiveItem#aegp_itemsuite9>`_

Item.touchActiveItem()
-----------------------

``touchActiveItem(): void;``

アクティブなアイテムが更新されたとAEに通知する。

参照: `PF_TouchActiveItem <https://ae-plugins.docsforadobe.dev/effect-details/useful-utility-functions/?h=PF_TouchActiveItem#pf_advitemsuite1>`_

.. tabs::

    .. code-tab:: TypeScript

        Atarabi.item.touchActiveItem();

    .. code-tab:: JavaScript

        Atarabi.item.touchActiveItem();

.. versionadded:: 0.2.0

Item.moveTimeStepActiveItem()
-----------------------------

``moveTimeStepActiveItem(steps: number): void;``

アクティブなアイテムの現在フレームを指定ステップ数だけ前後に移動させる。

参照: `PF_MoveTimeStepActiveItem <https://ae-plugins.docsforadobe.dev/effect-details/useful-utility-functions/?h=PF_MoveTimeStepActiveItem#pf_advitemsuite1>`_

.. tabs::

    .. code-tab:: TypeScript

        Atarabi.item.moveTimeStepActiveItem(1);

    .. code-tab:: JavaScript

        Atarabi.item.moveTimeStepActiveItem(1);

.. versionadded:: 0.2.0

Item.getFootageSoundDataFormat()
--------------------------------

``getFootageSoundDataFormat(item: FootageItem): SoundDataFormat;``

アイテムの音声のサンプルレート、モノラルorステレオなどを取得する。

参照: `AEGP_GetFootageSoundDataFormat <https://ae-plugins.docsforadobe.dev/aegps/aegp-suites/?h=AEGP_GetFootageSoundDataFormat#aegp_footagesuite5>`_

.. tabs::

    .. code-tab:: TypeScript

        const item = app.project.activeItem;
        if (item instanceof FootageItem) {
            const soundDataFormat = Atarabi.item.getFootageSoundDataFormat(item);
        }

    .. code-tab:: JavaScript

        var item = app.project.activeItem;
        if (item instanceof FootageItem) {
            var soundDataFormat = Atarabi.item.getFootageSoundDataFormat(item);
        }

.. versionadded:: 0.2.0
