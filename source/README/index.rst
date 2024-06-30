======
README
======

.. _summary:

概要
----
@scriptは、スクリプトからAEGPのAPIに気軽にアクセスするために開発されたAfter Effectsプラグインである。

開発背景は、 `After Effectsのスクリプトの可能性を広げる。 <https://atarabi.hateblo.jp/entry/2023/09/02/211426>`_ に詳しい。

このドキュメントは例示を含め、TypeScript環境を前提としているので、適宜調べてください。

.. _repository:

リポジトリ
----------
https://github.com/atarabi/at_script/

.. _target:

対象
----
Win, Mac

CC2018-

.. _how-to:

導入方法
--------
`Releases · atarabi/at_script <https://github.com/atarabi/at_script/releases>`_ から **@script.zip** をダウンロード。
プラグインはプラグインのフォルダにコピー。Startup時にAPIを用いたい場合は、 **!@script_initializer.jsx** をスクリプトのStartupのフォルダにコピー。

自身でAPIを用いたスクリプトを開発したい場合は、リポジトリをクローンし、 **script** フォルダをコピーし作業フォルダにし、 **src** フォルダ内に適当にフォルダを作成し、その中でtsxという拡張子でスクリプトファイルを作っていけばよい。

| script（適当にリネーム）
| ├── src
| │   ├── MyScripts(適当に作成)
| │   │ └──MyScript.tsx
| │   ├── ScriptUI(削除して良い)
| │   └── StartUP(削除して良い)
| ├── types
| └── tsconfig.json


Atarabi.version
---------------

``version: string;``

v0.4.0(2024/06/30)
^^^^^^^^^^^^^^^^^^^^

Fix
"""""""""""
- Register.importFlavor() で登録した拡張子のファイルを複数個同時に読み込んだ際に、モーダルダイアログに関するエラーが生じることに対する修正

API
"""""""""""
- Property.saveCustomValue() の追加
- Effect['ADBE CurvesCustom'] の追加
- Effect['APC Colorama'] の追加

Script
"""""""""""
- @svg の追加

v0.3.1(2024/05/29)
^^^^^^^^^^^^^^^^^^^^

Fix
"""""""""""
- ある環境下で、API実行時にPreferencesのウインドウが表示される問題の対処 (`#3 <https://github.com/atarabi/at_script/issues/3>`_)

API
"""""""""""
- Register.hookCommand() の引数にoptionsを追加
- Register.unhookCommandAll() の追加

Script
"""""""""""
- @hook_solid の平面の命名規則の変更及びカラーパネルの追加 (`#4 <https://github.com/atarabi/at_script/issues/4>`_)
- @hook_adjustment の平面の命名規則の変更
- @hook_null のリファクタリング
- @swatch にツールチップを追加

v0.3.0(2024/02/13)
^^^^^^^^^^^^^^^^^^^^

Fix
"""""""""""
- Windows環境で、AME起動時などDynamic Link経由でAfterFXが起動する際にStartupのスクリプトがAfterFXをクラッシュさせる問題の対処 (`#1 <https://github.com/atarabi/at_script/issues/1>`_)

API
"""""""""""
- Atarabi.isDynamicLink() の追加
- Mouse.getPosition() の追加
- Mouse.hook() の追加
- Mouse.unhook() の追加
- Mouse.enableHook() の追加
- Mouse.enableHookByUuid() の追加
- Mouse.sendClick() の追加

Script
"""""""""""
- Dynamic Linkに関するバグに伴う、Startup系のスクリプトの修正
- @effect_launcher が表示されなくなることがある問題の修正
- @rpp_loader でプロジェクト内にEmpty Itemがあるときに読み込みが失敗する問題の修正
- Atarabi.UI.Builder にaddCustom()を追加
- @effects_in_use の追加
- @swatch の追加

v0.2.0(2023/09/16)
^^^^^^^^^^^^^^^^^^^^

API
"""""""""""
- App.setProjectDirty() の追加
- App.saveBackgroundState() の追加
- App.forceForeground() の追加
- App.restoreBackgroundState() の追加
- App.refreshAllWindows() の追加
- App.getMainHWND() の追加
- Item.touchActiveItem() の追加
- Item.moveTimeStepActiveItem() の追加
- Item.getFootageSoundDataFormat() の追加
- Camera.getDefaultCameraDistanceToImagePlane() の追加
- Camera.getFilmSize() の追加
- Camera.setFilmSize() の追加
- Keyboard.hook() の追加
- Keyboard.unhook() の追加
- Keyboard.enableHook() の追加
- Keyboard.enableHookByUuid() の追加
- Keyboard.sendKeys() の追加

Script
"""""""""""
- @script_UI を !\@script_UI にリネーム
- @effect_launcher の追加
- @hook_] の追加
- @save_to_desktop の追加
- @toggle_mfr の追加

v0.1.0(2023/08/28)
^^^^^^^^^^^^^^^^^^^^