===============
API
===============

スクリプト間での関数の呼び出しをやりやすくする。

.. tabs::

    .. code-tab:: TypeScript

        (() => {
            type AddShapeFn =  (comp: CompItem, name: string) => ShapeLayer;

            // APIを追加する
            Atarabi.API.add<AddShapeFn>('My Namespace', 'addShape', (comp: CompItem, name: string) => {
                const shapeLayer = comp.layers.addShape();
                shapeLayer.name = name;     
                return shapeLayer;   
            });

            const comp = app.project.activeItem;
            if (comp instanceof CompItem) {
                // APIが追加されているか確認する
                if (Atarabi.API.isAdded('My Namespace', 'addShape')) {
                    // APIを呼び出す
                    const newShapeLayer = Atarabi.API.invoke<AddShapeFn>('My Namespace', 'addShape', [comp, 'New Shape!']);
                }

                // APIが追加されてない場合にフォールバックを呼び出すように設定して呼び出す（isAddedの確認が減らせる）
                const newerShapeLayer = Atarabi.API.invoke<AddShapeFn>('My Namespace', 'addShape', [comp, 'Newer Shape!'], (comp, name) => {
                    const shapeLayer = comp.layers.addShape();
                    shapeLayer.name = `${name}!?`;
                    return shapeLayer;   
                });
            }
        });

    .. code-tab:: JavaScript
	
        (function () {
            // APIを追加する
            Atarabi.API.add('My Namespace', 'addShape', function (comp, name) {
                var shapeLayer = comp.layers.addShape();
                shapeLayer.name = name;
                return shapeLayer;
            });
            var comp = app.project.activeItem;
            if (comp instanceof CompItem) {
                // APIが追加されているか確認する
                if (Atarabi.API.isAdded('My Namespace', 'addShape')) {
                    // APIを呼び出す
                    var newShapeLayer = Atarabi.API.invoke('My Namespace', 'addShape', [comp, 'New Shape!']);
                }
                // APIが追加されてない場合にフォールバックを呼び出すように設定して呼び出す（isAddedの確認が減らせる）
                var newerShapeLayer = Atarabi.API.invoke('My Namespace', 'addShape', [comp, 'Newer Shape!'], function (comp, name) {
                    var shapeLayer = comp.layers.addShape();
                    shapeLayer.name = "".concat(name, "!?");
                    return shapeLayer;
                });
            }
        });

API.add()
------------------------

``add<F extends (...args: any[]) => any>(name: string, method: string, callback: F, thisArg?: any): boolean;``

name, methodをキーとして関数を登録する。登録に成功すれば、trueが帰る。

.. versionadded:: 0.5.0

API.invoke()
------------------------

``invoke<F extends (...args: any[]) => any>(name: string, method: string, args?: Parameters<F>, fallback?: (...args: Parameters<F>) => ReturnType<F>): ReturnType<F>;``

登録した関数を呼び出す。登録されていなければ、フォールバックが呼ばれる。

.. versionadded:: 0.5.0

API.remove()
------------------------

``remove(name: string, method: string): boolean;``

登録した関数を削除する。削除に成功すれば、trueが帰る。

.. versionadded:: 0.5.0

API.isAdded()
------------------------

``isAdded(name: string, method: string): boolean;``

関数が登録されているか調べる。

.. versionadded:: 0.5.0