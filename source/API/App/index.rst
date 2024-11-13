====
App
====

App.colorPicker()
------------------

``colorPicker(initialColor: Color): Color | null;``

カラーピッカーを呼び出します。キャンセルされた場合は **null** が返ります。

参照: `PF_AppColorPickerDialog <https://ae-plugins.docsforadobe.dev/effect-details/useful-utility-functions.html?highlight=PF_AppColorPickerDialog#pf-appsuite>`_

.. tabs::

    .. code-tab:: TypeScript

        const yourFavoriteColor = Atarabi.app.colorPicker([1, 0, 0]);

    .. code-tab:: JavaScript

        var yourFavoriteColor = Atarabi.app.colorPicker([1, 0, 0]);


App.getColor()
--------------

``getColor(colorType: ColorType): Color | null;``

AEのUIの各要素の色を取得する。

参照: `PF_AppGetColor <https://ae-plugins.docsforadobe.dev/effect-details/useful-utility-functions.html?highlight=PF_AppGetColor#pf-appsuite>`_

.. tabs::

    .. code-tab:: TypeScript

        const buttonTextColor = Atarabi.app.getColor('Button Text');

    .. code-tab:: JavaScript

        var buttonTextColor = Atarabi.app.getColor('Button Text');


App.getBackgroundColor()
-------------------------

``getBackgroundColor(): Color;``

AEの背景色を取得する。

参照: `PF_AppGetBgColor <https://ae-plugins.docsforadobe.dev/effect-details/useful-utility-functions.html?highlight=PF_AppGetBgColor#pf-appsuite>`_

.. tabs::

    .. code-tab:: TypeScript

        const bgColor = Atarabi.app.getBackgroundColor();

    .. code-tab:: JavaScript

        var bgColor = Atarabi.app.getBackgroundColor();

App.setProjectDirty()
-------------------------

``setProjectDirty(): void;``

プロジェクトを **dirty** (プロジェクトが最後に保存したときから変更されている)に設定する。

参照: `PF_SetProjectDirty <https://ae-plugins.docsforadobe.dev/effect-details/useful-utility-functions.html?highlight=PF_SetProjectDirty#pf-advappsuite2>`_

.. tabs::

    .. code-tab:: TypeScript

        Atarabi.app.setProjectDirty();

    .. code-tab:: JavaScript

        Atarabi.app.setProjectDirty();

.. versionadded:: 0.2.0

App.saveBackgroundState()
-------------------------

``saveBackgroundState(): void;``

参照: `PF_SaveBackgroundState <https://ae-plugins.docsforadobe.dev/effect-details/useful-utility-functions.html?highlight=PF_SaveBackgroundState#pf-advappsuite2>`_

.. tabs::

    .. code-tab:: TypeScript

        Atarabi.app.saveBackgroundState();

    .. code-tab:: JavaScript

        Atarabi.app.saveBackgroundState();

.. versionadded:: 0.2.0

App.forceForeground()
-------------------------

``forceForeground(): void;``

参照: `PF_ForceForeground <https://ae-plugins.docsforadobe.dev/effect-details/useful-utility-functions.html?highlight=PF_ForceForeground#pf-advappsuite2>`_

.. tabs::

    .. code-tab:: TypeScript

        Atarabi.app.forceForeground();

    .. code-tab:: JavaScript

        Atarabi.app.forceForeground();

.. versionadded:: 0.2.0

App.restoreBackgroundState()
----------------------------

``restoreBackgroundState(): void;``

参照: `PF_RestoreBackgroundState <https://ae-plugins.docsforadobe.dev/effect-details/useful-utility-functions.html?highlight=PF_RestoreBackgroundState#pf-advappsuite2>`_

.. tabs::

    .. code-tab:: TypeScript

        Atarabi.app.restoreBackgroundState();

    .. code-tab:: JavaScript

        Atarabi.app.restoreBackgroundState();

.. versionadded:: 0.2.0

App.refreshAllWindows()
-------------------------

``refreshAllWindows(): void;``

参照: `PF_RefreshAllWindows <https://ae-plugins.docsforadobe.dev/effect-details/useful-utility-functions.html?highlight=PF_RefreshAllWindows#pf-advappsuite2>`_

.. tabs::

    .. code-tab:: TypeScript

        Atarabi.app.refreshAllWindows();

    .. code-tab:: JavaScript

        Atarabi.app.refreshAllWindows();

.. versionadded:: 0.2.0

App.getMainHWND() 
-------------------------

``getMainHWND(): number;``

AEのHWNDを取得する(Windowsのみ)。

参照: `AEGP_GetMainHWND <https://ae-plugins.docsforadobe.dev/aegps/aegp-suites.html?highlight=AEGP_GetMainHWND#aegp-utilitysuite6>`_

.. tabs::

    .. code-tab:: TypeScript

        const hwnd = Atarabi.app.getMainHWND();

    .. code-tab:: JavaScript

        var hwnd = Atarabi.app.getMainHWND();

.. versionadded:: 0.2.0

App.debounce()
---------------

``debounce(callback: () => void, delay: number): () => void;``

イベントが高頻度で発生する場合に、関数の呼び出しを間引く。例えば、 **EditText.onChanging** のように、キー入力イベントが高頻度で発火する可能性がある場合などに用いる。

.. tabs::

    .. code-tab:: TypeScript

        const win = new Window('dialog');
        win.preferredSize[0] = 200;
        const editText = win.add('edittext');
        editText.alignment = ['fill', 'top'];
        editText.onChanging = Atarabi.app.debounce(() => {
            alert(editText.text);
        }, 1000);
        win.show();

    .. code-tab:: JavaScript

        var win = new Window('dialog');
        win.preferredSize[0] = 200;
        var editText = win.add('edittext');
        editText.alignment = ['fill', 'top'];
        editText.onChanging = Atarabi.app.debounce(function () {
            alert(editText.text);
        }, 1000);
        win.show();
