=====
Label
=====

Label.setColor()
----------------

``setColor(index: number, color: Color): void;``

ラベル(1から16)の色を設定します。

.. tabs::

    .. code-tab:: TypeScript

        Atarabi.label.setColor(1, [1, 0, 0]);

    .. code-tab:: JavaScript

        Atarabi.label.setColor(1, [1, 0, 0]);

Label.getColor()
----------------

``getColor(index: number): Color;``

ラベル(1から16)の色を取得します。

.. tabs::

    .. code-tab:: TypeScript

        const maybeRed = Atarabi.label.getColor(1);

    .. code-tab:: JavaScript

        var maybeRed = Atarabi.label.getColor(1);
    