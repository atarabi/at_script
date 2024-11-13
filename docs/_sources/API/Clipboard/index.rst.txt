===============
Clipboard
===============

Clipboard.getText()
-------------------

``getText(): string;``

クリップボードにある文字列を取得する。

.. tabs::

    .. code-tab:: TypeScript

        const text = Atarabi.clipboard.getText();

    .. code-tab:: JavaScript
	
        var text = Atarabi.clipboard.getText();

Clipboard.setText()
-------------------

``setText(text: string): void;``

クリップボードに文字列を設定する。

.. tabs::

    .. code-tab:: TypeScript

        Atarabi.clipboard.setText('wiggle(3, 100)');

    .. code-tab:: JavaScript
	
        Atarabi.clipboard.setText('wiggle(3, 100)');