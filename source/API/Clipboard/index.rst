===============
Clipboard
===============

Clipboard.getTypes()
---------------------

``getTypes(): string[];``

クリップボードのデータのフォーマットを取得する。

.. tabs::

    .. code-tab:: TypeScript

        const types = Atarabi.clipboard.getTypes();

    .. code-tab:: JavaScript
	
        var types = Atarabi.clipboard.getTypes();

.. versionadded:: 0.5.0

Clipboard.getFiles()
---------------------

``getFiles(): (File | Folder)[];``

クリップボードにあるファイルの一覧を取得する。

.. tabs::

    .. code-tab:: TypeScript

        const files = Atarabi.clipboard.getFiles();

    .. code-tab:: JavaScript
	
        var files = Atarabi.clipboard.getFiles();

.. versionadded:: 0.5.0

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

Clipboard.getImageInfo()
-------------------------

``getImageInfo(): Image_.Info | null;``

クリップボードに画像が登録されていれば、その画像の情報を取得する。

.. tabs::

    .. code-tab:: TypeScript

        const info = Atarabi.clipboard.getImageInfo();

    .. code-tab:: JavaScript
	
        var info = Atarabi.clipboard.getImageInfo();

.. versionadded:: 0.5.0
