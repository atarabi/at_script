===============
@proxy_maker
===============

.. image:: @proxy_maker-UI.png

.. image:: @proxy_maker-progress.png

レイヤー単位でプリレンダングをする（レンダキュー経由でレンダリングするわけではないのでそれ相応の速度）。

.. image:: @proxy_maker-ex.png

初回はレイヤーのインポイントからアウトポイントまですべてをレンダリングする。二回目以降は、ワークエリアの範囲だけ再レンダリングする。