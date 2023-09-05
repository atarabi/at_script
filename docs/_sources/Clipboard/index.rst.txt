===============
Clipboard
===============

Clipboard.getText()
-------------------

``getText(): string;``

クリップボードにある文字列を取得する。

.. code-block:: typescript

    const text = Atarabi.clipboard.getText();

Clipboard.setText()
-------------------

``setText(text: string): void;``

クリップボードに文字列を設定する。

.. code-block:: typescript

    Atarabi.clipboard.setText('wiggle(3, 100)');
