=====
Label
=====

Label.setColor()
----------------

``setColor(index: number, color: Color): void;``

ラベル(1から16)の色を設定します。

.. code-block:: typescript

    Atarabi.label.setColor(1, [1, 0, 0]);


Label.getColor()
----------------

``getColor(index: number): Color;``

ラベル(1から16)の色を取得します。

.. code-block:: typescript

    const maybeRed = Atarabi.label.getColor(1);