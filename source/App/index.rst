====
App
====

App.colorPicker()
------------------

``colorPicker(initialColor: Color): Color | null;``

カラーピッカーを呼び出します。キャンセルされた場合は **null** が返ります。

参照: `PF_AppColorPickerDialog <https://ae-plugins.docsforadobe.dev/effect-details/useful-utility-functions.html?highlight=PF_AppColorPickerDialog#pf-appsuite>`_

.. code-block:: typescript

    const yourFavoriteColor = Atarabi.app.colorPicker([1, 0, 0]);


App.getColor()
--------------

``getColor(colorType: ColorType): Color | null;``

AEのUIの各要素の色を取得する。

参照: `PF_AppGetColor <https://ae-plugins.docsforadobe.dev/effect-details/useful-utility-functions.html?highlight=PF_AppGetColor#pf-appsuite>`_

.. code-block:: typescript

    const buttonTextColor = Atarabi.app.getColor('Button Text');


App.getBackgroundColor()
-------------------------

``getBackgroundColor(): Color;``

AEの背景色を取得する。

参照: `PF_AppGetBgColor <https://ae-plugins.docsforadobe.dev/effect-details/useful-utility-functions.html?highlight=PF_AppGetBgColor#pf-appsuite>`_

.. code-block:: typescript

    const bgColor = Atarabi.app.getBackgroundColor();

App.debounce()
---------------

``debounce(callback: () => void, delay: number): () => void;``

イベントが高頻度で発生する場合に、関数の呼び出しを間引く。例えば、 **EditText.onChanging** のように、キー入力イベントが高頻度で発火する可能性がある場合などに用いる。

.. code-block:: typescript

    const win = new Window('dialog');
    win.preferredSize[0] = 200;
    const editText = win.add('edittext');
    editText.alignment = ['fill', 'top'];
    editText.onChanging = Atarabi.app.debounce(() => {
        alert(editText.text);
    }, 1000);
    win.show();
