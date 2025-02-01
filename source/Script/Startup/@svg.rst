====================
@svg
====================

SVGファイルを直接シェイプレイヤーとして読み込めるようにする。

API
-------------------

svgToShapeLayer()
^^^^^^^^^^^^^^^^^^^^

``Atarabi.API.invoke('@svg', 'svgToShapeLayer', [svgFileOrText: File | string, shapeLayer?: ShapeLayer]): ShapeLayer;``

svgファイルないし、svgのテキストデータを読み込み、シェイププレイヤーに変換する。shapeLayerを与えればそのシェイプレイヤー下に、与えなければ、アクティブなコンポに新たにシェイプレイヤーを作り、その下に構築する。

getContext()
^^^^^^^^^^^^^^^^^^^^

``Atarabi.API.invoke('@svg', 'getContext', [layer?: AVLayer]): Context;``

htmlにおけるcanvasのgetContext()よろしく、SVGのコマンドを用いてシェイプやマスクのパスを構築できる。
