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

At.isTextParameter()
--------------------

``isTextParameter(property: Property): boolean;``

テキストパラメータかを調べる。

At.getTextValue()
--------------------

``getTextValue(property: Property, options?: { time?: number; preExpression?: boolean; }): TextValue;``

テキストパラメータの値を取得する。

At.setTextValue()
--------------------

``setTextValue(property: Property, value: TextValue, options?: { time?: number; key?: boolean; }): void;``

テキストパラメータの値を設定する。

At.getTextValueAtKey()
-----------------------

``getTextValueAtKey(property: Property, keyIndex: number): At.TextValue;``

あるキーにおけるテキストパラメータの値を取得する。

At.setTextValueAtKey()
-----------------------

``setTextValueAtKey(property: Property, value: At.TextValue, keyIndex: number): void;``

あるキーに対してテキストパラメータの値を設定する。

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