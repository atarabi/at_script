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