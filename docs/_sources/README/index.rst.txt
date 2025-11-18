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

.. note::
    APIを使用するのに必須なのは、 **@scriptプラグイン** と **!@script_initializer.jsx** のみです。

    その他スクリプトは任意で、画像関係を扱うプラグインである `@image <../Plugin/@image/index.html>`_ と、 SVGを扱うスクリプト `@svg.jsx <../Script/Startup/@svg.html>`_ といった機能を拡張する特殊な例を除けば、すべて実際にAPIを利用して作成したスクリプトの例となります。 `Script <../Script/index.html>`_ に解説があるので、興味があれば導入してみてください。
    
    ただし、GUIのあるスクリプトに関しては、 `!@script_UI.jsx <../Script/Startup/!@script_UI.html>`_ に依存しているので、Startupフォルダに  **!@script_UI.jsx** をコピーするのを忘れないでください。

`Releases · atarabi/at_script <https://github.com/atarabi/at_script/releases>`_ から **@script.zip** をダウンロード。

プラグインは、pluginフォルダにある@scriptプラグイン(Windowsの場合は **@script.aex** , Macの場合は **@script.plugin** )をAfter Effectsのプラグイン関係のフォルダ内にコピー。

スクリプトは、script/Startupフォルダにある **!@script_initializer.jsx**、 **!@script_UI.jsx** をAfter EffectsのStartup向けスクリプトのフォルダ内にコピー(例えば、Windows、AE2025の場合、 **C:\Program Files\Adobe\Adobe After Effects 2025\Support Files\Scripts\Startup** )。

後は各自使いたいスクリプトを各自script/Startupフォルダないしscript/ScriptUIフォルダからコピーする。

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

v0.6.0(2025/11/18)
^^^^^^^^^^^^^^^^^^^^

Breaking Changes
"""""""""""""""""
- 型定義を独自のものからTypes-for-Adobeのものに変更

Improve
"""""""""""
- Mouse.hook()において、Mouse Downだけでなく、Mouse Upにもhook出来るようにした
- Keyboard.hook(), Mouse.hook()において、何も返さなければデフォルトの処理を実行するようにした
  
Script
"""""""""""
- @cropped_mesh_warpの追加
- @paste_clipboardで連番ファイル読み込み時の問題を修正
- @effect_searchの設定ダイアログで、各項目を修正出来るようにした
- @effect_launcherでスクリプトとプリセットを扱えるようにした
- @hook_null, @hook_solid, @hook_adjustmentでレイヤーを追加した場合にプロパティパネルが更新されない問題の修正

v0.5.1(2025/02/04)
^^^^^^^^^^^^^^^^^^^^

Fix
"""""""""""
- Mac環境で、Clipboard.getText()でテキストがクリップボードに無い時に取得しようとするとクラッシュする問題の修正

Improve
"""""""""""
- Pseudo においてInvisibleの対応

Script
"""""""""""
- @hook_solid がAtarabi.APIに対応
- @hook_null がAtarabi.APIに対応

v0.5.0(2025/02/01)
^^^^^^^^^^^^^^^^^^^^

Fix
"""""""""""
- Windows環境で、Clipboard.getText()において、CF_UNICODETEXTではなくCF_TEXTから読み込むようにした(CF_TEXTにUTF-8の文字列が設定されていて、かつCF_UNICODETEXTが設定されていない状態で、CF_UNICODETEXTを取得しようとすると、UTF-8文字列をANSIコードページ(日本語であればShift_JIS)として解釈、変換された文字列が渡されるので、それに対する暫定的措置)

Improve
"""""""""""
- Keyboard.hook(), Mouse.hook()において、一つの状態に対して、一つしかフック出来なかったのを複数フック出来るようにした
- SVG.svgToShapeLayer()をFileだけでなくstringも受け付けるようにした

Plugin
"""""""""""
- @image(@image, @image_file, @images_in_folder) の追加

API
"""""""""""
- Image の追加
- RIFX の追加
- Pseudo の追加
- API の追加
- Effect['ADBE MESH WARP'] の追加
- Property.setGradientValue() の追加
- Property.isGradientParameter() の追加
- Clipboard.getTypes() の追加
- Clipboard.getFiles() の追加
- Clipboard.getImageInfo() の追加
- At.isImageParameter() の追加
- At.getImageInfo() の追加
- At.setImageFromFile() の追加
- At.setImageFromClipboard() の追加
- At.getImageInfoAtKey() の追加
- At.setImageFromFileAtKey() の追加
- At.setImageFromClipboardAtKey() の追加

Script
"""""""""""
- @paste_clipboard の追加
- @script_panel において、jsxbinも取得するようにした
- @effect_launcher のショートカット機能でフッテージの読み込みも出来るようにした
- @toggle_mfr で、アイドル時のキャッシュのオンオフも出来るようにした
- @svg でスタイルタグを用いたスタイル設定に一部対応した(単純なclass、idによる指定のみ)
- @svg でグラデーションに一部対応した

v0.4.2(2024/11/14)
^^^^^^^^^^^^^^^^^^^^

Fix
"""""""""""
- Windows環境で、UI.showContextMenu()において、コンテクストメニューの文字列が正常に表示されない場合があることに対する修正
- UI.FuzzySearch()においてキャッシュを有効にした状態である特定の文字列を与えた場合に、配列以外が返ってくる場合があることに対する修正（@effect_launcher, @effect_search, @effect_presetなどで使用しているので、使っている方は!@script_UI.jsxを更新してください）

Script
"""""""""""
- @script_panel の追加
- @effect_launcher にショートカット機能を追加
- @effect_search で、スクリプト、プリセットを扱える機能を追加
- @effect_launcher、@effect_search、@effect_preset で検索窓のデバウンスタイムを少なくした
- @still_maker、 @movie_maker のブラウズボタンの挙動を改善した

v0.4.1(2024/10/22)
^^^^^^^^^^^^^^^^^^^^

Fix
"""""""""""
- Compositing Options以下のプロパティの扱いでエラーが生じることに対する修正 (`#7 <https://github.com/atarabi/at_script/issues/7>`_)

API
"""""""""""
- Property.loadCustomValue() の追加

Script
"""""""""""
- @proxy_maker の追加
- @rpp_loader にアンドゥ処理を追加

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