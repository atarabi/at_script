===============
Property
===============

多くがスクリプトにすでにあるメソッドの再実装となっているが、こちらを使用する場合、パラメータが **hidden** かどうかは気にしなくなくてもよい。

Property.getParamDef()
------------------------

``getParamDef(property: Property): ParamDef;``

エフェクトのパラメータの詳細を得ることが出来る。

Property.getPropertyParameters()
-----------------------------------

``getPropertyParameters(property: Property): string;``

内部的には、 **Property.getParamDef()** を呼び出しているだけ。ドロップダウンメニューのパラメータの文字列を取得する。 **Dropdown Menu Control** が追加され、それに対し **Property.setPropertyParameters()** も実装されたが、メニューの文字列が取得出来なかったため応用範囲も限られていた。

参照: `Property.setPropertyParameters() <https://ae-scripting.docsforadobe.dev/properties/property.html?highlight=Property.setPropertyParameters()#property-setpropertyparameters>`_

Property.getValue()
-----------------------------------

``getValue(property: Property, options?: { time?: number; preExpression?: boolean; }): ValueType;``

マーカー、テキストドキュメントを扱えない以外はスクリプトと同等。 **hidden** 属性のパラメータにも適用できる。

Property.setValue()
-----------------------------------

``setValue(property: Property, value: Readonly<ValueType>, options?: { time?: number; key?: boolean; }): void;``

マーカー、テキストドキュメントを扱えない以外はスクリプトと同等。 **hidden** 属性のパラメータにも適用できる。

Property.getValueAtKey()
-----------------------------------

``getValueAtKey(property: Property, ketIndex: number): ValueType;``

マーカー、テキストドキュメントを扱えない以外はスクリプトと同等。 **hidden** 属性のパラメータにも適用できる。

Property.setValueAtKey()
-----------------------------------

``setValueAtKey(property: Property, value: Readonly<ValueType>, keyIndex: number): void;``

マーカー、テキストドキュメントを扱えない以外はスクリプトと同等。 **hidden** 属性のパラメータにも適用できる。

Property.getKeyParameters()
-----------------------------------

``getKeyParameters(property: Property, keyIndex: number): KeyParameters;``

スクリプトと同等。 **hidden** 属性のパラメータにも適用できる。

Property.setKeyParameters()
-----------------------------------

``setKeyParameters(property: Property, keyIndex: number, params: Readonly<KeyParameters>): void;``

スクリプトと同等。 **hidden** 属性のパラメータにも適用できる。

Property.isModified()
-----------------------------------

``isModified(property: PropertyBase): boolean;``

値がデフォルト値から変わっているかどうかを取得する。

Property.isHidden()
-----------------------------------

``isHidden(property: PropertyBase): boolean;``

パラメータが隠れているかどうかを調べる。

Property.setHidden()
-----------------------------------

``setHidden(property: PropertyBase, set: boolean): void;``

パラメータに **hidden** 属性を付加ないし除去する。あまり勝手にやるのは行儀が良くない。

Property.getExpression()
-----------------------------------

``getExpression(property: Property): string;``

エクスプレッションを取得する。 **hidden** 属性のパラメータにも適用できる。

Property.setExpression()
-----------------------------------

``setExpression(property: Property, expression: string): void;``

エクスプレッションを設定する。 **hidden** 属性のパラメータにも適用できる。

Property.userChangedParam()
-----------------------------------

``userChangedParam(property: Property): void;``

対象のエフェクトのあるパラメータに対して、 **PF_Cmd_USER_CHANGED_PARAM** コマンドを発火させる。パラメータには **PF_ParamFlag_SUPERVISE** フラグが付されているものがあり（よくあるのはボタンやドロップダウンリストでプリセットを選択させる形式のもの [#uCP1]_ ）、このパラメータが変動した際に、イベントが発火するようになっている。そういったパラメータに対して、能動的に発火させる。

参照: `PF_Cmd_USER_CHANGED_PARAM <https://ae-plugins.docsforadobe.dev/effect-details/parameter-supervision.html?highlight=PF_Cmd_USER_CHANGED_PARAM#parameter-supervision>`_
参照: `PF_ParamFlag_SUPERVISE <https://ae-plugins.docsforadobe.dev/effect-basics/PF_ParamDef.html?highlight=PF_ParamFlag_SUPERVISE#parameter-flags>`_

.. [#uCP1] 標準プラグインの **Gradient Ramp**, **Tint**, **Detail-preserving Upscale** などのボタンに対しては発火しなかった。

Property.clickButton()
-----------------------------------

``clickButton(property: Property): void;``

内部的には、 **Property.userChangedParam()** に同じ。ボタンかどうか確認した後に発火させる。


.. code-block:: typescript

    const layer = Atarabi.layer.getActiveLayer();
    const isAVLayer = (layer: Layer): layer is AVLayer => {
        return layer instanceof TextLayer || layer instanceof ShapeLayer || layer instanceof AVLayer;
    };
    if (layer && isAVLayer(layer)) {
        const ramp = layer.effects.addProperty('');
    }