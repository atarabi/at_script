===============
At
===============

Atarabiのエフェクトのカスタムパラメータをスクリプトから弄るようのAPI群。

At.isAtEffect()
--------------------

``isAtEffect(effect: PropertyGroup): boolean;``

Atarabi製のエフェクトかを調べる。

At.setCollapse()
--------------------

``setCollapse(property: Property, doCollapse: boolean): void;``

パラメータを開閉する。

At.isImageParameter()
-----------------------

``isImageParameter(property: Property): boolean;``

イメージパラメータかを調べる。

.. versionadded:: 0.5.0

At.getImageInfo()
-----------------------

``getImageInfo(property: Property, options?: { time?: number; preExpression?: boolean; }): Image.Info | null;``

イメージパラメータの画像データの情報を取得する。

.. versionadded:: 0.5.0

At.setImageFromFile()
-----------------------

``setImageFromFile(property: Property, file: File, options?: { time?: number; key?: boolean; }): void;``

イメージパラメータの画像データをファイルから設定する。

.. versionadded:: 0.5.0

At.setImageFromClipboard()
--------------------------

``setImageFromClipboard(property: Property, options?: { time?: number; key?: boolean; }): void;``

イメージパラメータの画像データをクリップボードから設定する。

.. versionadded:: 0.5.0

At.getImageInfoAtKey()
-----------------------

``getImageInfoAtKey(property: Property, keyIndex: number): Image_.Info;``

あるキーのイメージパラメータの画像データの情報を取得する。

.. versionadded:: 0.5.0

At.setImageFromFileAtKey()
--------------------------

``setImageFromFileAtKey(property: Property, file: File, keyIndex: number): void;``

あるキーのイメージパラメータの画像データをファイルから設定する。

.. versionadded:: 0.5.0

At.setImageFromClipboardAtKey()
---------------------------------

``setImageFromClipboardAtKey(property: Property, keyIndex: number): void;``

あるキーのイメージパラメータの画像データをクリップボードから設定する。

.. versionadded:: 0.5.0

At.isTextParameter()
--------------------

``isTextParameter(property: Property): boolean;``

テキストパラメータかを調べる。

.. versionadded:: 0.7.0

At.getTextValue()
--------------------

``getTextValue(property: Property, options?: { time?: number; preExpression?: boolean; }): At.TextValue;``

テキストパラメータの値を取得する。

.. versionadded:: 0.7.0

At.setTextValue()
--------------------

``setTextValue(property: Property, value: At.TextValue, options?: { time?: number; key?: boolean; }): void;``

テキストパラメータの値を設定する。

.. versionadded:: 0.7.0

At.getTextValueAtKey()
-----------------------

``getTextValueAtKey(property: Property, keyIndex: number): At.TextValue;``

あるキーにおけるテキストパラメータの値を取得する。

.. versionadded:: 0.7.0

At.setTextValueAtKey()
-----------------------

``setTextValueAtKey(property: Property, value: At.TextValue, keyIndex: number): void;``

あるキーに対してテキストパラメータの値を設定する。

.. versionadded:: 0.7.0

At.isNoteParameter()
--------------------

``isNoteParameter(property: Property): boolean;``

ノートパラメータかを調べる。

.. versionadded:: 0.7.0

At.getNoteValue()
--------------------

``getNoteValue(property: Property, options?: { time?: number; preExpression?: boolean; }): At.NoteValue;``

ノートパラメータの値を取得する。

.. versionadded:: 0.7.0

At.setNoteValue()
--------------------

``setNoteValue(property: Property, value: At.NoteValue, options?: { time?: number; key?: boolean; }): void;``

ノートパラメータの値を設定する。

.. versionadded:: 0.7.0

At.getNoteValueAtKey()
-----------------------

``getNoteValueAtKey(property: Property, keyIndex: number): At.NoteValue;``

あるキーにおけるノートパラメータの値を取得する。

.. versionadded:: 0.7.0

At.setNoteValueAtKey()
-----------------------

``setNoteValueAtKey(property: Property, value: At.NoteValue, keyIndex: number): void;``

あるキーに対してノートパラメータの値を設定する。

.. versionadded:: 0.7.0