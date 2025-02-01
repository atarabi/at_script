================
@hook_null
================

既存の新規ヌルレイヤーコマンドを上書きして、出来るだけ既存の平面を再利用するようにする。

API
-------------------

addSolid()
^^^^^^^^^^^^^^^^^^^^

``Atarabi.API.invoke('@hook_null', 'addNull', [comp: CompItem]): AVLayer;``

@hook_nullのようにヌルを追加する。
