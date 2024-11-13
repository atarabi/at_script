===========
Keyboard
===========

Keyboard.hook()
----------------

``hook(key: Keyboard.Key, fn: Keyboard.HookFunc): Uuid;``

キー入力をフックします。 **fn** が **true** を返した場合、デフォルトの処理が無視され、 **false** を返した場合、続いてデフォルトの処理が実行されます。

.. tabs::

    .. code-tab:: TypeScript

        // Aを入力するとコンポをつくる。
        const uuid = Atarabi.keyboard.hook({ code: 'A' }, ctx => {
            app.project.items.addComp('Comp', 1000, 1000, 1, 100, 30);
            return true; // trueを返した場合、デフォルトの処理が呼ばれなくなる。
        });

    .. code-tab:: JavaScript
        
        // Aを入力するとコンポをつくる。
        var uuid = Atarabi.keyboard.hook({ code: 'A' }, function (ctx) {
            app.project.items.addComp('Comp', 1000, 1000, 1, 100, 30);
            return true; // trueを返した場合、デフォルトの処理が呼ばれなくなる。
        });

.. versionadded:: 0.2.0

Keyboard.unhook()
-----------------

``unhook(uuid: Uuid): void;``

キー入力のフックを解除します。

.. tabs::

    .. code-tab:: TypeScript

        const uuid = Atarabi.keyboard.hook({ code: 'C', ctrlOrCmdKey: true }, ctx => {
            alert('C');
            return true;
        });

        Atarabi.keyboard.unhook(uuid);

    .. code-tab:: JavaScript
	
        var uuid = Atarabi.keyboard.hook({ code: 'C', ctrlOrCmdKey: true }, function (ctx) {
            alert('C');
            return true;
        });
        Atarabi.keyboard.unhook(uuid);

.. versionadded:: 0.2.0

Keyboard.enableHook()
---------------------

``enableHook(enable: boolean): void;``

フック機能をオンorオフにします。

.. tabs::

    .. code-tab:: TypeScript

        Atarabi.keyboard.enableHook(false);

    .. code-tab:: JavaScript

        Atarabi.keyboard.enableHook(false);

.. versionadded:: 0.2.0

Keyboard.enableHookByUuid()
----------------------------

``enableHookByUuid(uuid: Uuid, enable: boolean): void;``

個別のフックに対してオンorオフにします。

.. tabs::

    .. code-tab:: TypeScript

        const uuid = Atarabi.keyboard.hook({ code: 'D', ctrlOrCmdKey: true }, ctx => {
            alert('D');
            return true;
        });

        Atarabi.keyboard.enableHookByUuid(uuid, false);

    .. code-tab:: JavaScript

        var uuid = Atarabi.keyboard.hook({ code: 'D', ctrlOrCmdKey: true }, function (ctx) {
            alert('D');
            return true;
        });
        Atarabi.keyboard.enableHookByUuid(uuid, false);

.. versionadded:: 0.2.0

Keyboard.sendKeys()
-------------------

``sendKeys(keys: Keyboard.Key[]): void;``

キー入力します。

.. tabs::

    .. code-tab:: TypeScript

        // 新規カメラレイヤー
        Atarabi.keyboard.sendKeys([{ code: 'C', ctrlOrCmdKey: true, altKey: true, shiftKey: true }]);

    .. code-tab:: JavaScript
        
        // 新規カメラレイヤー
        Atarabi.keyboard.sendKeys([{ code: 'C', ctrlOrCmdKey: true, altKey: true, shiftKey: true }]);

.. versionadded:: 0.2.0