===========
Mouse
===========

Mouse.getPosition()
--------------------

``getPosition(): Mouse.Position;``

マウス位置を取得します。

.. tabs::

    .. code-tab:: TypeScript

        const position = Atarabi.mouse.getPosition();
        alert(`X: ${position.x}, Y: ${position.y}`);

    .. code-tab:: JavaScript
        
        var position = Atarabi.mouse.getPosition();
        alert("X: ".concat(position.x, ", Y: ").concat(position.y));

.. versionadded:: 0.3.0

Mouse.hook()
----------------

``hook(click: Mouse.Click, fn: Mouse.HookFunc): Uuid;``

マウス入力をフックします。 **fn** が **true** を返した場合、デフォルトの処理が無視され、 **false** を返した場合、続いてデフォルトの処理が実行されます。

.. tabs::

    .. code-tab:: TypeScript

        // ダブルミドルクリックをするとコンポをつくる。
        const uuid = Atarabi.mouse.hook({ button: 'Middle', count: 2 }, ctx => {
            app.project.items.addComp('Comp', 1000, 1000, 1, 100, 30);
            return true; // trueを返した場合、デフォルトの処理が呼ばれなくなる。
        });

    .. code-tab:: JavaScript
        
        // ダブルミドルクリックをするとコンポをつくる。
        var uuid = Atarabi.mouse.hook({ button: 'Middle', count: 2 }, function (ctx) {
            app.project.items.addComp('Comp', 1000, 1000, 1, 100, 30);
            return true; // trueを返した場合、デフォルトの処理が呼ばれなくなる。
        });

.. versionadded:: 0.3.0

Mouse.unhook()
-----------------

``unhook(uuid: Uuid): void;``

マウス入力のフックを解除します。

.. tabs::

    .. code-tab:: TypeScript

        const uuid = Atarabi.mouse.hook({ button: 'Middle', count: 2 }, ctx => {
            alert('C');
            return true;
        });

        Atarabi.mouse.unhook(uuid);

    .. code-tab:: JavaScript
	
        var uuid = Atarabi.mouse.hook({ button: 'Middle', count: 2 }, function (ctx) {
            alert('C');
            return true;
        });
        Atarabi.mouse.unhook(uuid);

.. versionadded:: 0.3.0

Mouse.enableHook()
---------------------

``enableHook(enable: boolean): void;``

フック機能をオンorオフにします。

.. tabs::

    .. code-tab:: TypeScript

        Atarabi.mouse.enableHook(false);

    .. code-tab:: JavaScript

        Atarabi.mouse.enableHook(false);

.. versionadded:: 0.3.0

Mouse.enableHookByUuid()
----------------------------

``enableHookByUuid(uuid: Uuid, enable: boolean): void;``

個別のフックに対してオンorオフにします。

.. tabs::

    .. code-tab:: TypeScript

        const uuid = Atarabi.mouse.hook({ button: 'Middle', count: 2 }, ctx => {
            alert('D');
            return true;
        });

        Atarabi.mouse.enableHookByUuid(uuid, false);

    .. code-tab:: JavaScript

        var uuid = Atarabi.mouse.hook({ button: 'Middle', count: 2 }, function (ctx) {
            alert('D');
            return true;
        });
        Atarabi.mouse.enableHookByUuid(uuid, false);

.. versionadded:: 0.3.0

Mouse.sendClick()
-------------------

``sendClick(click: Mouse.Click): void;``

マウス入力をします。

.. tabs::

    .. code-tab:: TypeScript

        // ダブル左クリック
        Atarabi.mouse.sendClick({ button: 'Left', count: 2 });

    .. code-tab:: JavaScript
        
        // ダブル左クリック
       Atarabi.mouse.sendClick({ button: 'Left', count: 2 });

.. versionadded:: 0.3.0